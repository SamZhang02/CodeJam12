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
let suggested_Stops = [];
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

            suggested_Stops.push(n['suggestedStops']);
            
        })

        console.log(suggested_Stops);
        for (let i=0; i<num.length; i++){
            array.push(m[i]);
        }
        exp= {...exp, json};
        console.log(exp);
    }
}

xmlHttp.send()

// const json = JSON.parse(xmlHttp.responseText)


// const objectsArray = Object.values(exp['json'])

const tripData = JSON.parse(xmlHttp.responseText)
//console.log(tripData)

const suggestedStopsCoordsArray = tripData.suggestedStops

//console.log(suggestedStopsCoordsArray)

const objectsArray = Object.values(tripData)

//console.log(objectsArray)

const suggestedStops = []

const tripStartTime = objectsArray[(objectsArray.length -2)]

const tripEndTime = objectsArray[(objectsArray.length -3)]

const stopTimes = objectsArray[(objectsArray.length - 4)]

objectsArray.forEach(object => {
    if(Object.hasOwn(object, 'formatted_address')) {
        const coordinates = `${object.geometry.location.lat} ${object.geometry.location.lng}`
        if(suggestedStopsCoordsArray.includes(coordinates)) {
            suggestedStops.push(object)
        }
    }
})

//console.log(stopTimes)
//console.log(tripEndTime, tripStartTime)
//console.log(suggestedStops)

const Stops = [];

for (let i=0; i<suggestedStops.length; i++) {
    const Stop = {}
    Stop.name = suggestedStops[i].name;
    Stop.url = suggestedStops[i].url;
    Stop.time = formatTime(tripStartTime, stopTimes[i])
    Stops.push(Stop)
}

//console.log(Stops)

function formatTime(start, scheduleStop) {

    //console.log(start, scheduleStop)

    let updatedMinutes

    let timeOfStop = Number(start) + Number(scheduleStop)

    //console.log(timeOfStop)

    const decimals = (timeOfStop - Math.floor(timeOfStop));

    //console.log(decimals)

    timeOfStop = timeOfStop - decimals

    //console.log(timeOfStop)
    
    const minutes = decimals * 60;

    //console.log(minutes)

    if(minutes >= 60) {
        updatedMinutes = String(minutes % 60)
        const carryOver = (minutes - updatedMinutes) / 60
        timeOfStop = timeOfStop + carryOver
        //console.log(timeOfStop)
    } else {
        updatedMinutes = String(minutes)
    }

    if(timeOfStop > 24) {
        timeOfStop = timeOfStop % 24
       // console.log(timeOfStop)

    }
    const displayTime = (String(timeOfStop)).padStart(2, '0') + ':' + updatedMinutes.padStart(2, '0')

    return displayTime
}

const planTable = document.getElementById('plan-container');

addStop(formatTime(tripStartTime, 0), dataObj["orgCity"].replaceAll("%2B","") + " <strong>(DEPARTURE)</strong>", " ")
for(let i=0; i<Stops.length; i++) {
    addStop(Stops[i].time, Stops[i].name.replaceAll("%2B",""), Stops[i].url)
}

addStop(formatTime(tripEndTime, 0), dataObj["dstCity"].replaceAll("%2B","") + " <strong>(ARRIVAL)</strong>", " ")

function addStop(time, stop, url) {

  const stopListing = planTable.insertRow()

  const timeOfStop = stopListing.insertCell(0);
  const Stop = stopListing.insertCell(1);

  timeOfStop.innerHTML = `${time}`;
  Stop.innerHTML = `<a href="${url}">${stop}</a>`
}


function initMap(){

    //size of the array
    // var size = Object.keys(array).length;
    // console.log(size);

    var flightPlanCoordinates = [];
    let array1 = [];
    var markers = [];
    var markers1 = [];


    let arr4 = [];
  Object.entries(arr4).forEach((c)=>{
    let lati=c[0];
    let lnge=c[1];
        flightPlanCoordinates.push({lat: lati, lng: lnge});
    })


    let vari; 
    suggestedStopsCoordsArray.forEach((element)=>{
          arr4.push(element.split(" "));
          console.log(arr4);
          arr4.forEach((element2,idx)=>{
            console.log(element2);
              const obj = {}
              obj[1] = element2[0],
              obj[2] = element2[1]
              vari = {...vari, [idx]:obj};
          })
          
    })
    Object.entries(vari).forEach((element)=>{
        let s1 = parseFloat(element[1][1]);
        let s2 = parseFloat(element[1][2]);
        console.log(s1);
        console.log(s2);
        let gp = {coords: {lat: s1, lng: s2}};
        console.log(gp);
        markers1.push(gp);
        
    });
    
//   console.log(Object.entries(vari));
  
        console.log(array)
    Object.entries(array).forEach((c)=>{
        let title = c[1][0];
        let address = c[1][1]['formatted_address'];
        let lati = c[1][1]['geometry']['location']['lat'];
        let lnge = c[1][1]['geometry']['location']['lng'];
        let url = c[1][1]['url'];
        let grouped = {coords: {lat: lati, lng: lnge}, content: `<h1>${title}</h1></br><h2>${address}</h2></br><h2><a href=${url}>${url}<a></h2>`};
        array1.push([title, address, lati, lnge, url]);
        markers.push(grouped);
        i = 0
        let flightCoodinate = {lat: lati, lng: lnge}
        if ( i === 0 || i === array1.length - 1  || arr4.includes(flightCoodinate)) {
            i += 1
            flightPlanCoordinates.push({lat: lati, lng: lnge});
        }
    })
      var map = new google.maps.Map(document.getElementById('map'), {
          zoom:8,
          center: {lat: Number.parseFloat(arr4[1][0]), lng: Number.parseFloat(arr4[1][1])},
          disableDefaultUI: true
      });

      console.log(flightPlanCoordinates)
      var flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
        });
      
  
  // Loop through markers
  console.log(flightPlanCoordinates[0])
  addMarker({coords: flightPlanCoordinates[0]});
  for(var i = 0;i < markers1.length;i++){
  // Add marker
    console.log(markers1[i])
    addMarker(markers1[i]);
  }
  console.log(flightPlanCoordinates[1])
  addMarker({coords: flightPlanCoordinates[1]});
  
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
 
  
  flightPath.setMap(map);
}
