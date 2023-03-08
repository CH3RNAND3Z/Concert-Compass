const searchBtn = document.getElementById("search-btn");
const resultsPanel = document.getElementById("results-panel");

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  resultsPanel.classList.remove("hidden");

  //API Key and Fetch 
let apiKey = 'S3hkm2FnFATqM68Z3lvSHRxUVozGGlHX';
let city = 'Portland';
let postalCode = '97035';
// let date = ;

var apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${city}`
console.log("URL:", apiUrl);

// &postalCode=${postalCode}&startDateTime=${date}T00:00:00Z&endDateTime=${date}T23:59:59Z`;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    console.log(`Found ${data.page.totalElements} events in ${city}, ${postalCode} on ${data._embedded.events[0].dates.start.localDate}`);
    data._embedded.events.forEach(event => {
      console.log(`- ${event.name} at ${event._embedded.venues[0].name}`);
    });
  })
  .catch(error => console.log(error));

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
