import axios from 'axios';
import polyUtil from 'polyline-encoded';
import * as dotenv from 'dotenv';
dotenv.config()


const MAPS_API_KEY = process.env.MAPS_API_KEY;

const getDirections = async (origin, destination) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${MAPS_API_KEY}`
    const response = await axios.get(url)
    return Number.parseFloat(response.data.routes[0].legs[0].distance.text)
}

// Get JSON data from Google Maps API and return steps
const getSteps = async (origin, destination) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${MAPS_API_KEY}`
    const response = await axios.get(url)
    return response.data.routes[0].legs[0].steps}

// Generate an array of steps from origin to destinationw in the form of 
// [[start_lat, start_lng], [end_lat, end_lng],distance, duration, polyline]
const getStepsArray = (steps) => {
    const stepsArray = []
    for (let i = 0; i < steps.length; i++) {
        const stepPoint = []
        stepPoint.push([steps[i].start_location.lat, steps[i].start_location.lng])
        stepPoint.push([steps[i].end_location.lat, steps[i].end_location.lng])
        stepPoint.push(Number.parseFloat(steps[i].distance.text))
        stepPoint.push(steps[i].duration.text)
        stepPoint.push(steps[i].polyline.points)
        stepsArray.push(stepPoint)
    }
    return stepsArray
}

const getPointsFromPolyline = (polyline) => {
    return polyUtil.decode(polyline)
}

const deg2rad = (deg) => {return deg * (Math.PI/180)};

// given two points, return the distance between them in km (MOE approx = 0.5%)
const getDistanceFromTwoPoints = (point1, point2) => {
    const R = 6371; // Radius of the earth in km
    const lat1 = point1[0];
    const lon1 = point1[1];
    const lat2 = point2[0];
    const lon2 = point2[1];
    const dLat = deg2rad(lat2-lat1);  
    const dLon = deg2rad(lon2-lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
    }

const getDistancesInPolyline = (polyline) => {
    const points = getPointsFromPolyline(polyline)
    const distances = []
    for (let i = 0; i < points.length - 1; i++) {
        distances.push(getDistanceFromTwoPoints(points[i], points[i+1]))
    }
    return distances
}

const getIntervalPoints = (stepsArray, interval) => {
    let allPoints = []
    let allDistances= []

    for (let i = 0; i < stepsArray.length; i++) {
        const distance = stepsArray[i][2]
        if (distance > interval) {
            const polyPoints = getPointsFromPolyline(stepsArray[i][4])
            const polyDistances = getDistancesInPolyline(stepsArray[i][4]) 
            allPoints = allPoints.concat(polyPoints)
            allDistances = allDistances.concat(polyDistances)
        }
        else{
            allPoints.push(stepsArray[i][0])
            allDistances.push(stepsArray[i][2])
        }
    }

    let intervalPoints = [];
    intervalPoints.push(allPoints[1])
    let totalDistance = 0;
    for (let i = 0; i < allPoints.length; i++) {
        totalDistance += allDistances[i]
        if (totalDistance >= interval) {
            intervalPoints.push(allPoints[i])
            totalDistance = 0
        }
    }
    intervalPoints.push(allPoints[allPoints.length - 1])
    return intervalPoints
}

export{
    getDirections,
}
// const road = await getSteps('Montreal', 'Toronto')
// const arr = getStepsArray(road)
// console.log(getIntervalPoints(arr, 50))
// console.log(getPointsFromPolyline('uoj|GxwcrL@H@F?@@HF^BTTdBD`@@DF\\F`@FTHZHZFJDLLVJPNT@BLPJPJLZ^BBVZ@@X\\@@RTd@h@b@d@RR@@VTTNPJBBXJVJ\\HZD^@^?^AZG^IXKTK\\SXWXWFGNQT]Tc@P_@?APc@Pm@Li@Hk@D]B]Fy@D{@Bw@Bg@?Q@_@?C?Y@}@?K?C?k@?CAu@?C?AAm@?UA]AYAYA]Ci@Cc@Ee@Gs@AOCSAIAOIs@AMGe@SqAOaA?CG_@CMMu@Ga@CICSGa@ACCQIi@I]Ie@QaAKi@?A?AYmBCQMeAQsBMcAK}@YyAm@oBk@kB?Ac@{AEQ]wAUaAKYO_@a@eA[y@EIYo@o@aBKWO]GQ]_Ag@{AWy@IS_@qAY_Aa@yAMg@CKMi@Mg@Om@Os@c@oBWiA[wAKg@g@{BU_AMc@IYQo@So@m@cBw@kBYm@Yo@KUc@s@S[SYUYQUQSOQc@a@c@a@SOGE[SuAu@c@W]SWSUQQSSSOQQU]c@QYU_@OYUi@[u@Qe@Oi@]wAU{@ESW_AUs@Qc@Sa@O[OYS[CGOSk@u@o@q@m@s@m@q@Y[gAmAQQs@y@m@k@]]MMa@_@m@g@{AoAu@s@GG[[CCs@w@[_@W[Y_@GI[c@i@y@c@q@_@o@Wi@OWMWm@qA]y@ISg@mAy@mBUg@a@aAe@aAWm@_@u@]o@GIUc@AA]m@s@gAkAaBCCeBmCWa@U]CEYc@QWaAkBMWUg@KUSi@Se@]_A]eA]gAKc@CGGWGUEQOm@Kg@Ke@Ow@Mw@M{@EYEa@MaAIm@Eo@OkAOaBCOAQo@_GKmAO_AAEO{@Ie@EUGYKc@CKq@eCCKACQi@[{@M[Wk@AAQc@[m@c@s@YY]Yk@_@c@S]MSEm@IY?K@S@c@Dg@JcAd@OFw@Ze@Ro@\\aBp@y@Nk@DM@eADcACCAQCQEA?[K]O_@Sq@k@m@q@o@oA[k@iAeBi@o@c@c@GGw@u@wA_AsAs@[Os@UeAUQEy@OgASuASy@G}AQKQ]k@m@OGAUUq@k@KMYc@CE_@}@EO_@wAUq@AGS]W[ECYYc@YOK][IGa@m@IMa@s@IKOUQSQSSQIGKIKIIGq@a@g@YQIUI_@KAAm@Q}A[o@K_@Ie@O[K]Oa@USOQMSSAAIKIGOSMQKOU]Q]OYIUACM]CIK]GOQk@Qm@IW[aAACOg@GQGQMYO_@IO_@u@U]EEGKKMOSWWa@_@_AcAQSQSQWU_@?AS[Sc@KWO_@EKK]GUACAA?AA?KIQ_AOo@S}@Sw@AGSo@Qi@M]M[Uc@We@Q[IOOWMWM]Oa@Uu@Qm@KYK[IQ]w@Ue@Qe@Se@M[KUOSOQMOGGGG]_@SSQWOUS]Wc@KUa@}@i@qAi@}AQe@Ww@m@aBc@oAI]ESCWCQAY?WASCo@Eo@?CAQCYAUEWEWGYGUKWMYQWQWMMY]UYY_@e@o@y@mAGOACMSwDoH_AkBEGc@}@MYM[K[IUGWGWEWEWEWAMCQCg@Ce@Co@GgAC]E_@CYCMCMEYI]I[K]KYM[O]Q_@Sc@]y@Ue@_@u@]k@o@}@o@_Aa@k@_@i@e@m@e@k@g@k@GI[]AAYWOMOMSMOKQKMKc@Ym@[kBeAw@a@}@e@YMi@We@S[Oi@UaA_@a@OUGc@Oe@Mk@K_@GC?OCOAA?QAQAA?a@A_C?[?S?OC_@Eo@Ie@AG?G?C?A?K?O?k@@M?q@?I?EAEACACECACICGCMAUI}@?CI{@COEa@EYAOEKCKEEEEECGAGCWAqAKE?u@GSAIAG?A?K@]F_AN'))


