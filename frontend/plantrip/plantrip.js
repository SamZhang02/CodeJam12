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
xmlHttp.send( null );
const json = JSON.parse(xmlHttp.responseText)
console.log(json)