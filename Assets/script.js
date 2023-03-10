const searchBtn = document.getElementById("search-btn");
const resultsContainer = document.getElementById("results-container");

const apiKey = "S3hkm2FnFATqM68Z3lvSHRxUVozGGlHX";

let searchList = [];

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  resultsContainer.classList.remove("hidden");

  let cityInput = document.getElementById("city").value;

  if (!cityInput) {
    console.error("You need to enter a valid city!");
    return;
  }

  localStorage.setItem("city", JSON.stringify(cityInput));
  searchTicketmasterApi(cityInput);
  // populateGoogleMaps(cityInput);
});

function formatDate(eventDate) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const suffixes = ["th", "st", "nd", "rd"];
  const day = 1 + eventDate.getDate();
  const suffix = suffixes[(day - 20) % 10] || suffixes[day] || suffixes[0];
  const formattedDate = `${
    monthNames[eventDate.getMonth()]
  } ${day}${suffix}, ${eventDate.getFullYear()}`;
  return formattedDate;
}

// Get the modal element
var modal = document.getElementById("popup-modal");

// Close the modal when the user clicks on the close button or anywhere outside of the modal
// TODO: this needs to be edited. Just a basic way to close the modal window for now. 
window.onclick = function (event) {
  if (event.target == modal) {
    modal.classList.add("hidden");
  }
};

function createEventCard(event) {
  const eventName = event.name;
  const eventDate = new Date(event.dates.start.localDate);
  const eventLocation = event._embedded.venues[0].name;
  const eventImage = event.images[0].url;
  const eventUrl = event.url;

  const formattedDate = formatDate(eventDate);

  const eventCard = document.createElement("div");
  eventCard.classList.add(
    "rounded-lg",
    "overflow-hidden",
    "shadow-md",
    "p-6",
    "bg-white",
    "mt-6"
  );

  const eventImageEl = document.createElement("img");
  eventImageEl.classList.add(
    "w-full",
    "h-52",
    "object-contain",
    "mb-2",
    "event-image"
  );
  eventImageEl.src = eventImage;
  eventImageEl.alt = eventName;
  eventCard.appendChild(eventImageEl);

  const eventNameEl = document.createElement("h3");
  eventNameEl.classList.add("text-lg", "font-bold", "mb-2");
  eventNameEl.textContent = eventName;
  eventCard.appendChild(eventNameEl);

  const eventDateEl = document.createElement("p");
  eventDateEl.classList.add("text-gray-600", "text-base", "mb-2");
  eventDateEl.textContent = `Date: ${formattedDate}`;
  eventCard.appendChild(eventDateEl);

  const eventLocationEl = document.createElement("p");
  eventLocationEl.classList.add("text-gray-600", "text-base", "mb-2");
  eventLocationEl.textContent = `Location: ${eventLocation}`;
  eventCard.appendChild(eventLocationEl);

  const purchaseTicketsBtn = document.createElement("a");
  purchaseTicketsBtn.classList.add(
    "bg-red-500",
    "hover:bg-red-600",
    "text-white",
    "font-bold",
    "py-2",
    "px-4",
    "mt-4",
    "rounded"
  );
  purchaseTicketsBtn.textContent = "Purchase Tickets";
  purchaseTicketsBtn.href = eventUrl;
  purchaseTicketsBtn.target = "_blank";
  eventCard.appendChild(purchaseTicketsBtn);

  return eventCard;
}

function searchTicketmasterApi(cityInput) {
  const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${cityInput}&classificationName=music&sort=relevance,desc&size=25`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const events = data._embedded.events;
      console.log(`Found ${events.length} events in ${cityInput}`);

      resultsContainer.innerHTML = "";

      events.forEach((event) => {
        const eventCard = createEventCard(event);
        resultsContainer.appendChild(eventCard);
      });
      populateGoogleMaps(data);
    })
    .catch((error) => console.log(error));
}

// document.addEventListener("DOMContentLoaded", function () {
//   let lastCitySearched = localStorage.getItem("city");
//   console.log(lastCitySearched);
//   searchTicketmasterApi(lastCitySearched);
//   console.log("Last searched city: " + lastCitySearched);
// });

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: 37.7749, lng: -122.4194 },
  });
  map.setOptions({ draggable: true });

  console.log("map info: ", map);
}

// function showEvents(json) {
//   for (var i = 0; i < json.page.size; i++) {
//     $("#events").append("<p>" + json._embedded.events[i].name + "</p>");
//   }
// }

function populateGoogleMaps(data) {
  let events = data._embedded.events;
  let cityLat = JSON.parse(events[0]._embedded.venues[0].location.latitude);
  let cityLong = JSON.parse(events[0]._embedded.venues[0].location.longitude);
  console.log(cityLat, cityLong);
  var mapDiv = document.getElementById("map");
  var map = new google.maps.Map(mapDiv, {
    center: { lat: cityLat, lng: cityLong },
    zoom: 10,
  });

  events.forEach((event) => {
    const venue = event._embedded.venues[0];
    const venueLat = JSON.parse(venue.location.latitude);
    const venueLong = JSON.parse(venue.location.longitude);
    const marker = new google.maps.Marker({
      position: { lat: venueLat, lng: venueLong },
      map: map,
      title: venue.name,
    });
  });
}

addEventListener("click", function () {
  for (let i = 0; i < venues.length; i++) {
    let marker = new google.maps.Marker({
      position: venues[i].location,
      map: map,
    });
  }
});
// for (var i = 0; i < json.page.size; i++) {
//   addMarker(map, json._embedded.events[i]);
// }

// function addMarker(map, event) {
//   var marker = new google.maps.Marker({
//     position: new google.maps.LatLng(
//       event._embedded.venues[0].location.latitude,
//       event._embedded.venues[0].location.longitude
//     ),
//     map: map,
//   });
//   marker.setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
//   console.log(marker);
// }
