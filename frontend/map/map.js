function initMap(){
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom:8,
        center:{lat:42.3601,lng:-71.0589},
        disableDefaultUI: true
    });

//   var marker = new google.maps.Marker({
//     position:{lat:42.4668,lng:-70.9495},
//     map:map,
//     icon:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
//   })

//   addMarker({lat:42.4668,lng:-70.9495});
//   addMarker({lat:42.8584,lng:-70.9300});


//   function addMarker(coords){
//     var marker = new google.maps.Marker({
//         position:coords,
//         map:map,
//         icon:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
//     })
//   }
var markers = [
{
  coords:{lat:42.4668,lng:-70.9495},
  iconImage:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
  content:'<h1>Lynn MA</h1>'
},
{
  coords:{lat:42.8584,lng:-70.9300},
  content:'<h1>Amesbury MA</h1>'
},
{
  coords:{lat:42.7762,lng:-71.0773}
}
];

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

var flightPlanCoordinates = [
{lat: 42.4668, lng: -70.9495},
{lat: 42.8584, lng: -70.9300},
{lat: 42.7762, lng: -71.0773}
];

var flightPath = new google.maps.Polyline({
path: flightPlanCoordinates,
geodesic: true,
strokeColor: '#FF0000',
strokeOpacity: 1.0,
strokeWeight: 2
});

flightPath.setMap(map);
}