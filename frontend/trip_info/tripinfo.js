const tripInfo = document.getElementById('trip-info')

//console.log(tripInfo)

const inputs = document.querySelectorAll('.required-input')

tripInfo.addEventListener('submit', () => {
  
  event.preventDefault();

  const dataArray = []

  inputs.forEach(input => {

    dataArray.push(input.id)

    dataArray.push(input.value)
    
  });

  //console.log(dataArray)

  const dataObject = {}

  dataArray.forEach(function(value, index, key) {
    if(index % 2) {
      dataObject[key[index - 1]] = value;
    }
  })

const JSONtoURL = (obj) => {
  var queryString = Object.keys(obj).map(key => key + '=' + encodeURIComponent(obj[key])).join('&');
  return queryString
}
  //console.log(dataObject)
const query = JSONtoURL(dataObject)

var xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", `http://127.0.0.1:8000/json?${query}`, false); // false for synchronous request
xmlHttp.send( null );
const json = JSON.parse(xmlHttp.responseText)
console.log(json)
})


