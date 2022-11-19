import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config()

const MAPS_API_KEY = process.env.MAPS_API_KEY;

const getPlaces = async (location, radius, keyword) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&keyword=${keyword}&key=${MAPS_API_KEY}`
    const response = await axios.get(url)
    return response.data.results
}
