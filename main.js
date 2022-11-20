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

// console.log(await main('3660 rue de loreto brossard j4y3g3', 'quebec city canada'))