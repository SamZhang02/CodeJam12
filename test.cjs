

var http = new XMLHttpRequest();
var params = "text=stuff";
http.open("POST", "http://someurl.net:8080", true);

http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
http.setRequestHeader("Content-length", params.length);
http.setRequestHeader("Connection", "close");

alert(http.onreadystatechange);
http.onreadystatechange = function() {
  if (http.readyState == 4 && http.status == 200) {
    alert(http.responseText);
  }
}

http.send(params);
