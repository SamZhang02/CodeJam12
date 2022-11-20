import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require('express');
const cors = require('cors')
const app = express();
const PORT = 8000;
const querystring = require('querystring');
import {main} from './main.js'
import {getDirections,
  getStops,
  getDuration,
  getStopInterval,
  findStops,
} from './directions.js'

function queryStringToJSON(qs) {
  qs = qs || location.search.slice(1);

  const pairs = qs.split('&');
  var result = {};
  pairs.forEach(function(p) {
      var pair = p.split('=');
      var key = pair[0];
      var value = decodeURIComponent(pair[1] || '');

      if( result[key] ) {
          if( Object.prototype.toString.call( result[key] ) === '[object Array]' ) {
              result[key].push( value );
          } else {
              result[key] = [ result[key], value ];
          }
      } else {
          result[key] = value;
      }
  });

  return JSON.parse(JSON.stringify(result));
};

const getAddress = (country,street,city,region,zip) => {
  const formattedStreet= street.split('%2B').join(' ')
  const formattedCity = city.split('%2B').join(' ')
  const formattedRegion = region.split('%2B').join(' ')
  const formattedCountry = country.split('%2B').join(' ')
  const formattedZip = zip.split('%2B').join(' ')
  return `${formattedStreet} ${formattedCity} ${formattedRegion} ${formattedCountry} ${formattedZip}`
}

const getTime = (time) => {
  const temp = time.split('%253A').join('')
  if (temp.slice(temp.length-2,temp.length) === 'PM'){
    const temp2 = temp.slice(0,5)
    const formattedTime = Number.parseFloat(temp2.slice(0,2)) + 12 + Number.parseFloat(temp2.slice(2,5)) / 60
    return Math.round(formattedTime * 100) / 100
  }
  else{
    const formattedTime = Number.parseFloat(temp.slice(0,2)) + Number.parseFloat(temp.slice(2,5)) / 60
    return Math.round(formattedTime * 100) / 100
  }
}

app.use(express.static('.'))
app.use(express.json())
app.use(cors())

app.get ('/json', async (req, res) => {
<<<<<<< HEAD
  const qstring = querystring.decode(req._parsedUrl.query);
  const origin = getAddress(qstring.orgCountry,qstring.orgStreetAddress,qstring.orgCity,qstring.orgRegion,qstring.orgPostalCode)
  const destination= getAddress(qstring.dstCountry,qstring.dstStreetAddress,qstring.dstCity,qstring.dstRegion,qstring.dstPostalCode)
  let json = (await main(origin, destination))

  const endTime = getTime(qstring.time) % 24 
  const hoursSlept = parseInt(qstring.hours)
  const tripDuration = await getDuration(origin, destination)
  const stopInterval = getStopInterval(hoursSlept)
  const stops = findStops(tripDuration, stopInterval)
  json['stops'] = stops
  json['endTime'] = endTime
  json['startTime'] = ((endTime - tripDuration - stops.length * 0.5) % 24 + 24) % 24
  console.log(endTime, tripDuration)
  json = JSON.stringify(json) 
=======
  // const qstring = querystring.decode(req._parsedUrl.query);
  const json = JSON.stringify(await main('Montreal, QC', 'Toronto, ON'))
>>>>>>> abb37fe... Added polylines and stop point on the map
  res.setHeader('Content-Type', 'application/json');
  res.send(json)
})

app.listen(PORT, () => {
  console.log(`Server connected at port ${PORT}`);
})

