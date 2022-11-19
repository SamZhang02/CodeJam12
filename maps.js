import axios from 'axios';
import polyUtil from 'polyline-encoded';
import * as dotenv from 'dotenv';
dotenv.config()


const MAPS_API_KEY = process.env.MAPS_API_KEY;

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
        stepPoint.push(steps[i].distance.text)
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

// given two points, return the distance between them in km (MOE = 0.5%)
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

const json = await getSteps('Toronto', 'Montreal')
const arr = getStepsArray(json)
console.log(getIntervalPoints(arr, 50))