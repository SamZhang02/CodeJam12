
function getCurrentURL(){
    return window.location.href;
}

const url = getCurrentURL();

const queryString = url.split('?')[1];
const elems = queryString.split('&');
json = {}
for (let i = 0; i < elems.length; i++) {
    const key = elems[i].split('=')[0];
    const value = elems[i].split('=')[1];
    json[key] = value;
}

for (let key in json) {
  console.log(key) 
  document.getElementById(key).value = json[key];
}

console.log(json)