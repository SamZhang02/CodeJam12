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

console.log(getDistanceFromTwoPoints([45.21567,-74.33538], [45.21587,-74.33503]))