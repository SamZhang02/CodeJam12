import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config()

import{
    getDirections,
} from './directions.js'

const MAPS_API_KEY = process.env.MAPS_API_KEY;

const getPlaces = async (location, radius, keyword) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&keyword=${keyword}&key=${MAPS_API_KEY}`
    const response = await axios.get(url)
    return response.data.results
}
const getRestStops = async (intervalPoint) => {
    const places = await getPlaces(intervalPoint, 20000, 'highway rest area OR highway rest stop')
    let restStops = []
    for (let i = 0; i < places.length; i++) {
        const place = places[i]
        restStops.push(place.place_id)
    return restStops 
    }
}
const getAllRestStops = async (intervalPointsArray) => {
    let restStops = []
    for (let i = 0; i < intervalPointsArray.length; i++) {
        const intervalPoint = intervalPointsArray[i]
        const placesOnTheCorrectSideOfTheRoad = await getRestStops(intervalPoint)
        restStops = restStops.concat(placesOnTheCorrectSideOfTheRoad)
    }
    return restStops
}

const decodePlaces = async (places) => {
    let json = {}
    for (let i = 0; i < places.length; i++) {
        const place = places[i] 
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place}&fields=name,formatted_address,url,place_id,geometry&key=${MAPS_API_KEY}`
        const response = await axios.get(url)
        json[response.data.result.name] = response.data.result
    }
    return json 
}



export{
    getAllRestStops,
    decodePlaces,
}
