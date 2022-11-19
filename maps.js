import axios from 'axios';
import * as dotenv from 'dotenv'
dotenv.config()

const MAPS_API_KEY = process.env.MAPS_API_KEY;
console.log(MAPS_API_KEY)

const getDirections = async (origin, destination) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${MAPS_API_KEY}`
    const response = await axios.get(url)
    return response.data
}

console.log(await getDirections('Toronto', 'Montreal'))