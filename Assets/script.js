const searchBtn = document.getElementById("search-btn");
const resultsPanel = document.getElementById("results-panel");
const apiKey = "S3hkm2FnFATqM68Z3lvSHRxUVozGGlHX";

let searchList = [];

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  resultsPanel.classList.remove("hidden");

  // &postalCode=${postalCode}&startDateTime=${date}T00:00:00Z&endDateTime=${date}T23:59:59Z`;

  let cityInput = document.getElementById("city").value;

  if (!cityInput) {
    console.error("You need to enter a zip code!");
    return;
  }

  localStorage.setItem("city", JSON.stringify(cityInput));
  searchTicketmasterApi(cityInput);
  // populateGoogleMaps(cityInput);
});

function searchTicketmasterApi(cityInput) {
  var apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${cityInput}&classificationName=music&sort=relevance,desc&size=5`;
  console.log("URL:", apiUrl);
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(
        `Found ${data.page.totalElements} events in ${city}, on ${data._embedded.events[0].dates.start.localDate}`
      );
      data._embedded.events.forEach((event) => {
        console.log(`- ${event.name} at ${event._embedded.venues[0].name}`);
      });
    })
    .catch((error) => console.log(error));
}

function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: 37.7749, lng: -122.4194 },
  });
  map.setOptions({ draggable: true });

  console.log("MAP");
}
