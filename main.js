import {getAllIntervalPoints,  getDirections, findAllStops,getClosestRestStop,getStepsArray,getStops,getSteps,getDuration, checkForLocationAfterTime, findStops, getStopInterval} from './directions.js';
import {getAllRestStops, decodePlaces} from './places.js';

const main = async (origin,destination) => {
    const IntervalPoints = await getAllIntervalPoints(origin, destination);
    const restStopIds = await getAllRestStops(IntervalPoints);
    return await decodePlaces(restStopIds)
}

const getAllSuggestedRestStops = async (origin, destination,endTime,hoursSlept) => {
    let restStops = []
    const stops = await main(origin, destination)
    for (const stop in stops) {
        restStops.push(stops[stop].geometry.location)
    }
    for (let i = 0; i < restStops.length; i++) {
        restStops[i] = restStops[i].lat + ' ' + restStops[i].lng
    }
    const stepsArray = getStepsArray(await getSteps(origin, destination))
    const totalDuration = await getDuration (origin, destination)
    const timeArray = findStops(totalDuration,getStopInterval(hoursSlept)) 
    let points = checkForLocationAfterTime(timeArray, totalDuration, stepsArray)


    let closestStops = []
    for (let i = 0; i < points.length; i++) {
        closestStops.push(await getClosestRestStop(restStops, points[i]))
    }
    return closestStops
}
await getAllSuggestedRestStops('Montreal','New York City',12,1)

export{
    main,
    getAllSuggestedRestStops,
}


