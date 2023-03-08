function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: 40.7128, lng: -74.006 },
  });
  map.setOptions({ draggable: true });
}

document.body.onload = function () {
  initMap();
};

var mapDiv = document.createElement("div");
mapDiv.id = "map";
document.body.appendChild(mapDiv);
