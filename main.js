import {getAllIntervalPoints,  getDirections, findAllStops} from './directions.js';
import {getAllRestStops, decodePlaces} from './places.js';

const main = async (origin,destination) => {
    const IntervalPoints = await getAllIntervalPoints(origin, destination);
    const restStopIds = await getAllRestStops(IntervalPoints);
    return await decodePlaces(restStopIds)
}

export{
    main,
}
