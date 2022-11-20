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

xmlHttp.onload = function(e){
    if(this.status == 200){
        const json = JSON.parse(e.target.responseText);
        console.log(json);
       Object.entries(json).forEach((e2)=>{
        array.push(e2);
       })
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
          center:{lat:42.3601,lng:-71.0589},
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