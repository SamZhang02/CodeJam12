import {getAllIntervalPoints,  getDirections, findAllStops} from './directions.js';
import {getAllRestStops, decodePlaces} from './places.js';

const main = async () => {
    const IntervalPoints = await getAllIntervalPoints('3660 rue de loreto, brossard', 'Toronto');
    restStopIds = await getAllRestStops(IntervalPoints)
    return await decodePlaces(restStopIds)
}

await main();