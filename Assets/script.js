const searchBtn = document.getElementById("search-btn");
const resultsPanel = document.getElementById("results-panel");

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  resultsPanel.classList.remove("hidden");

  let zipInput = document.getElementById("zip").value;

  if (!zipInput) {
    console.error("You need to enter a zip code!");
    return;
  }

  localStorage.setItem("zip", JSON.stringify(zipInput));
});

function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: 37.7749, lng: -122.4194 },
  });
  map.setOptions({ draggable: true });

  console.log("MAP");
}
