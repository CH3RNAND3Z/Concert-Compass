function initMap() {
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: { lat: 37.7749, lng: -122.4194 },
    });
    map.setOptions({ draggable: true });

    console.log("MAP");
  }