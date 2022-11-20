import axios from 'axios';
import polyUtil from 'polyline-encoded';
import * as dotenv from 'dotenv';
import { findAll } from 'domutils';
dotenv.config()


const MAPS_API_KEY = process.env.MAPS_API_KEY;

const getDirections = async (origin, destination) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${MAPS_API_KEY}`
    const response = await axios.get(url)
    // console.log(response)
    return Number.parseFloat(response.data.routes[0].legs[0].distance.text)
}

const getDuration = async(origin, destination) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${MAPS_API_KEY}`
    const response = await axios.get(url)
    return Number.parseFloat(response.data.routes[0].legs[0].duration.text)
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


const getNbOfStops = (hours_slept_last12h, totalTripHours) => {
    //Will need to merge and the date form DatePicker to minutes and make small modifications to the formula below
    let IntervalOfRests = totalTripHours*(1-(totalTripHours / hours_slept_last12h));
    
    if (IntervalOfRests<=0){
        let IntervalOfRests2 = Math.sqrt(Math.abs(totalTripHours*(1-(totalTripHours / (hours_slept_last12h**2)))));
    }
}
const getAllIntervalPoints = async (origin, destination) => {
    const steps = await getSteps(origin, destination)
    const stepsArray = getStepsArray(steps)
    const intervalPoints = getIntervalPoints(stepsArray, 50)
    return intervalPoints
    }


const getStopInterval = (hours_slept_last12h) => {
    //Will need to merge and the date form DatePicker to minutes and make small modifications to the formula below
    if (hours_slept_last12h >=0 && hours_slept_last12h < 3) {
        return 1.5 
    }
    else if (hours_slept_last12h >=3 && hours_slept_last12h < 6) {
        return 2.5 
    }
    else if (hours_slept_last12h >=6 && hours_slept_last12h < 9) {
        return 3 
    }
    else if (hours_slept_last12h >=9 && hours_slept_last12h <= 12) {
        return 3.5 
    }
    return;
}

// Given an end time, a trip's duration without break and the interval where the user should stop, return the total time of the trip given that each stop lasts 30 minutes
const findStartTime = (endTime, tripDuration, stopIntervalTime) => {
    const numOfStops = Math.floor(tripDuration / stopIntervalTime)
    const totalTime = numOfStops * 0.5 + tripDuration
    return totalTime
}

// Given a total trip time and the interval where the user should stop, return the hours of the trip where the user should stop.
const findStops = (tripTime, stopIntervalTime) => {
    let stops = []
    for (let i = 0; i < tripTime; i += stopIntervalTime) {
        if (i > 0) {
            stops.push(i)
        }
    }
    return stops
}

const findAllStops = (stops, startTime) => {
    let restStops = []
    for (let i = 0; i < stops.length; i++) {
        restStops.push(startTime + stops[i])
    }
    return restStops
}

const getStops = (endTime, tripDuration, hours_slept_last12h) => {
    const stopIntervalTime = getStopInterval(hours_slept_last12h)
    const startTime = findStartTime(endTime, tripDuration, stopIntervalTime)
    let restStops = findStops(tripDuration, stopIntervalTime)
    restStops = findAllStops(restStops, startTime)
    return restStops
}

const convertToMinutes = (time) => {
    if (time.includes('hours')) {
        time = parseInt(time.split('hours')[0]) * 60 + parseInt(time.split('hours')[1].split('min')[0])
    }
    else if (time.includes('hour')) {
        times = parseInt(time.split('hour')[0]) * 60 + parseInt(time.split('hour')[1].split('min')[0])
    }
    else{
        time = parseInt(time.split('min')[0])
    }
    return time 
}


const checkForLocationAfterTime = (timeArray, totalDuration, stepsArray) => {
    let allPoints = []

    for (let i = 0; i < stepsArray.length; i++) {
        const polyPoints = getPointsFromPolyline(stepsArray[i][4])
        allPoints = allPoints.concat(polyPoints)
        allPoints.push(stepsArray[i][0])
        }
    let points = []
    for (let i = 0; i < timeArray.length; i++) {
        const ratio = timeArray[i] / totalDuration
        points.push(allPoints[Math.floor(allPoints.length*ratio)].join(' '))
        }
    return points
    }

    
const getClosestRestStop = async (stops, currentLocation) => {
    let closestStop = stops[0]
    let currMinDistance = await getDirections(currentLocation, closestStop)
    for (let i = 0; i < stops.length; i++) {
        const currDistance = await getDirections(stops[i], currentLocation)
        if (currDistance < currMinDistance) {
            currMinDistance = currDistance
            closestStop = stops[i]
        }
    }
    return closestStop
}

export{
    getDirections,
    findAllStops,
    getAllIntervalPoints,
    getStops,
    getDuration,
    getStopInterval,
    findStops,
    getClosestRestStop,
    checkForLocationAfterTime,
    getStepsArray,
    getSteps,
}

