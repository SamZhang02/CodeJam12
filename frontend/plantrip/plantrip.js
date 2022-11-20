function getCurrentURL(){
    return window.location.href;
}

const url = getCurrentURL();

const queryString = url.split('?')[1];
const elems = queryString.split('&');
dataObj = {}
for (let i = 0; i < elems.length; i++) {
    const key = elems[i].split('=')[0];
    const value = elems[i].split('=')[1];
    dataObj[key] = value;
}

const JSONtoURL = (obj) => {
    var queryString = Object.keys(obj).map(key => key + '=' + encodeURIComponent(obj[key])).join('&');
    return queryString
}
//console.log(dataObject)
const query = JSONtoURL(dataObj)

var xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", `http://127.0.0.1:8000/json?${query}`, false); // false for synchronous request

let array = [];
let num = [];
let exp;
xmlHttp.onload = function(e){
    if(this.status == 200){
        const json = JSON.parse(e.target.responseText);
        var n = Object.keys(json);
        var m = Object.entries(json);
        console.log(n);
        console.log(m);

        n.forEach((e2)=>{
            if(e2 != "endTime" && e2 != "startTime" && e2 != "stops" && e2 != "suggestedStops"){
                num.push(n.indexOf(e2));
                console.log(e2);
                console.log(n.indexOf(e2))
            }
        })

        for (let i=0; i<num.length; i++){
            array.push(m[i]);
        }
        exp= {...exp, json};
        console.log(exp);
    }
}

xmlHttp.send()

// const json = JSON.parse(xmlHttp.responseText)


function initMap(){

    //size of the array
    // var size = Object.keys(array).length;
    // console.log(size);

    var flightPlanCoordinates = [];
    let array1 = [];
    var markers = [];
    Object.entries(array).forEach((c)=>{
        let title = c[1][0];
        let address = c[1][1]['formatted_address'];
        let lati = c[1][1]['geometry']['location']['lat'];
        let lnge = c[1][1]['geometry']['location']['lng'];
        let url = c[1][1]['url'];

        let grouped = {coords: {lat: lati, lng: lnge}, content: `<h1>${title}</h1></br><h2>${address}</h2></br><h2><a href=${url}>${url}<a></h2>`};
        array1.push([title, address, lati, lnge, url]);
        markers.push(grouped);
        flightPlanCoordinates.push({lat: lati, lng: lnge});
    })
    console.log(flightPlanCoordinates);
    console.log(markers);
    console.log(array1);
      var map = new google.maps.Map(document.getElementById('map'), {
          zoom:8,
          center: flightPlanCoordinates[0],
          disableDefaultUI: true
      });


  
  // Loop through markers
  for(var i = 0;i < markers.length;i++){
  // Add marker
  addMarker(markers[i]);
  }
  
  // Add Marker Function
  function addMarker(props){
  var marker = new google.maps.Marker({
    position:props.coords,
    map:map,
    //icon:props.iconImage
  });
  
  
  // Check content
  if(props.content){
    var infoWindow = new google.maps.InfoWindow({
      content:props.content
    });
  
    marker.addListener('click', function(){
      infoWindow.open(map, marker);
    });
  }
  }
  
  
  var flightPath = new google.maps.Polyline({
  path: flightPlanCoordinates,
  geodesic: true,
  strokeColor: '#FF0000',
  strokeOpacity: 1.0,
  strokeWeight: 2
  });
  
  flightPath.setMap(map);
}

const objectsArray = Object.values(exp['json'])

const potentialStops = [];

const stopTimes = []

const startAndEndTimes = []

objectsArray.forEach(object => {
    if(Object.hasOwn(object, 'formatted_address')) {
        potentialStops.push(object)
    } else if (Array.isArray(object)){
        stopTimes.push(object)
    } else {
        startAndEndTimes.push(object)
    }
})

console.log(potentialStops, stopTimes, startAndEndTimes)

const Stops = [];

const startTime = startAndEndTimes[1];

for (let i=0; i<stopTimes.length; i++) {
    const Stop = {}
    Stop.name = potentialStops[i].name;
    Stop.url = potentialStops[i].url;
    Stop.time = formatTime(startTime, stopTimes[i])
    Stops.push(Stop)
}

console.log(Stops)

function formatTime(start, scheduleStop) {

    console.log(start, scheduleStop)

    let updatedMinutes

    let timeOfStop = Number(start) + Number(scheduleStop)

    console.log(timeOfStop)

    const decimals = (timeOfStop - Math.floor(timeOfStop));

    console.log(decimals)

    timeOfStop = timeOfStop - decimals

    console.log(timeOfStop)
    
    const minutes = decimals * 60;

    console.log(minutes)

    if(minutes >= 60) {
        updatedMinutes = String(minutes % 60)
        const carryOver = (minutes - updatedMinutes) / 60
        timeOfStop = timeOfStop + carryOver
        console.log(timeOfStop)
    } else {
        updatedMinutes = String(minutes)
    }

    if(timeOfStop > 24) {
        timeOfStop = timeOfStop % 24
        console.log(timeOfStop)

    }
    const displayTime = (String(timeOfStop)).padStart(2, '0') + ':' + updatedMinutes.padStart(2, '0')

    return displayTime
}

const planTable = document.getElementById('plan-container');

for(let i=0; i<Stops.length; i++) {
    addStop(Stops[i].time, Stops[i].name, Stops[i].url)
}

function addStop(time, stop, url) {

  const stopListing = planTable.insertRow()

  const timeOfStop = stopListing.insertCell(0);
  const Stop = stopListing.insertCell(1);

  timeOfStop.innerHTML = `${time}`;
  Stop.innerHTML = `<a href="${url}">${stop}</a>`
}
