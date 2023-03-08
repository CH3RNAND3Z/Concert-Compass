const form = document.querySelector('form');
const input = document.querySelector('input[type="text"]');
const button = document.querySelector('button[type="submit"]');
const searchBtn = document.getElementById('search-btn');
const resultsPanel = document.getElementById('results-panel');

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

searchBtn.addEventListener('click', function(event) {
  event.preventDefault(); 
  resultsPanel.classList.remove('hidden');
});

//Adds an event listener to the window to detect changes in screen size for search bar
// window.addEventListener('resize', function() {
//   if (window.innerWidth <= 768) {
//     input.style.maxWidth = 'none';
//     button.style.borderRadius = '5px';
//   } else {
//     input.style.maxWidth = '400px';
//     button.style.borderRadius = '0 5px 5px 0';
//   }
// });

function initMap() {
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: { lat: 37.7749, lng: -122.4194 },
    });
    map.setOptions({ draggable: true });

    console.log("MAP");
  }

