window.onload = function() {
    var myOptions = {
        center: new google.maps.LatLng(40.744556,-73.987378),
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    };

    var map = new google.maps.Map(document.getElementById("map"), myOptions);
}