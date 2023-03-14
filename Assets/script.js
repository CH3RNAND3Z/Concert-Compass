// global selectors
const searchBtn = document.getElementById("search-btn");
const resultsContainer = document.getElementById("results-container");
const modal = document.getElementById("popup-modal");
const closeModalBtn = document.getElementById("close-modal-btn");

let venueModalEl = document.getElementById("venueModalEl");
let addressModalEl = document.getElementById("addressModalEl");
let adaModalEl = document.getElementById("adaModalEl");
let parkingModalEl = document.getElementById("parkingModalEl");

// Ticketmaster API key
const apiKey = "S3hkm2FnFATqM68Z3lvSHRxUVozGGlHX";

// date formatting
function formatDate(eventDate) {
  const adjustedDate = new Date(eventDate);
  adjustedDate.setDate(adjustedDate.getDate() + 1);

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
  const day = adjustedDate.getDate();
  const suffix = suffixes[(day - 20) % 10] || suffixes[day] || suffixes[0];
  const formattedDate = `${
    monthNames[eventDate.getMonth()]
  } ${day}${suffix}, ${eventDate.getFullYear()}`;
  return formattedDate;
}

// populate initial map upon page load
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: { lat: 39.95493, lng: -100.78789 },
  });
  map.setOptions({ draggable: true });

  console.log("map info: ", map);
}

// event listener that kicks off the entire page's functions when search button is clicked
searchBtn.addEventListener("click", function (event) {
  event.preventDefault();

  let cityInput = document.getElementById("city").value;

  if (!cityInput) {
    console.error("You need to enter a valid city!");
    return;
  }

  searchTicketmasterApi(cityInput);
});

// fire off request to Ticketmaster API
function searchTicketmasterApi(cityInput) {
  const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${cityInput}&classificationName=music&sort=relevance,desc&size=25`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("Event Data: ", data);

      if (data._embedded) {
        const events = data._embedded.events;
        let cityInput = document.getElementById("city").value;

        populateGoogleMaps(data);

        resultsContainer.classList.remove("hidden");
        resultsContainer.innerHTML = "";
        localStorage.setItem("city", JSON.stringify(cityInput));

        events.forEach((event) => {
          const eventCard = createEventCard(event);
          resultsContainer.appendChild(eventCard);
        });
      } else {
        console.log("Please enter a valid city!");
        modal.classList.remove("hidden");
        venueModalEl.textContent = "";
        addressModalEl.textContent = "";
        adaModalEl.textContent = "";
        parkingModalEl.textContent = "";
        venueModalEl.textContent = "Please enter a valid city!";
        document.getElementById("city").value = JSON.parse(localStorage.getItem("city"))
      }
    })
    .catch((error) => console.error(error));
}

// create search result cards based on data received from Ticketmaster API
function createEventCard(event) {
  const eventName = event.name;
  const eventDate = new Date(event.dates.start.localDate);
  const eventLocation = event._embedded.venues[0].name;
  const eventImage = event.images[0].url;
  const eventUrl = event.url;
  let eventLineup = "";
  if (event._embedded.attractions && event._embedded.attractions.length > 0) {
    for (let i = 0; i < event._embedded.attractions.length; i++) {
      if (event._embedded.attractions[i].name) {
        eventLineup +=
          (i === 0 ? "" : ", ") + event._embedded.attractions[i].name;
      }
    }
  }

  const formattedDate = formatDate(eventDate);

  const eventCard = document.createElement("div");
  eventCard.classList.add(
    "rounded-lg",
    "overflow-hidden",
    "shadow-md",
    "p-6",
    "bg-white",
    "mt-6",
    "text-center"
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

  if (eventLineup.length > 0) {
    const eventLineupEl = document.createElement("p");
    eventLineupEl.classList.add("text-gray-600", "text-base", "mb-2");
    eventLineupEl.textContent = `Lineup: ${eventLineup}`;
    eventCard.appendChild(eventLineupEl);
  }

  const eventDateEl = document.createElement("p");
  eventDateEl.classList.add("text-gray-600", "text-base", "mb-2");
  eventDateEl.textContent = `Date: ${formattedDate}`;
  eventCard.appendChild(eventDateEl);

  const eventLocationEl = document.createElement("p");
  eventLocationEl.classList.add("text-gray-600", "text-base", "mb-2");
  eventLocationEl.textContent = `Location: ${eventLocation}`;
  eventCard.appendChild(eventLocationEl);

  const purchaseTicketsDiv = document.createElement("div");
  purchaseTicketsDiv.classList.add(
    "mt-4",
    "flex",
    "flex-col",
    "max-w-xs",
    "mx-auto"
  );

  const purchaseTicketsBtn = document.createElement("a");
  purchaseTicketsBtn.classList.add(
    "bg-red-500",
    "hover:bg-red-600",
    "text-white",
    "font-bold",
    "py-2",
    "px-4",
    "rounded",
    "max-w-8"
  );
  purchaseTicketsBtn.textContent = "Purchase Tickets";
  purchaseTicketsBtn.href = eventUrl;
  purchaseTicketsBtn.target = "_blank";
  purchaseTicketsDiv.appendChild(purchaseTicketsBtn);

  eventCard.appendChild(purchaseTicketsDiv);

  return eventCard;
}

// populate Google Maps with data received from Ticketmaster API
function populateGoogleMaps(data) {
  let events = data._embedded.events;
  let cityLat = JSON.parse(events[0]._embedded.venues[0].location.latitude);
  let cityLong = JSON.parse(events[0]._embedded.venues[0].location.longitude);
  var mapDiv = document.getElementById("map");
  var map = new google.maps.Map(mapDiv, {
    center: { lat: cityLat, lng: cityLong },
    zoom: 12,
  });

  // place markers for each event
  events.forEach((event) => {
    const venue = event._embedded.venues[0];
    const venueLat = JSON.parse(venue.location.latitude);
    const venueLong = JSON.parse(venue.location.longitude);
    const marker = new google.maps.Marker({
      position: { lat: venueLat, lng: venueLong },
      map: map,
      title: venue.name,
    });

    // add onclick function to marker that opens modal
    marker.addListener("click", () => {
      //clears modal content upon click
      venueModalEl.textContent = "";
      addressModalEl.textContent = "";
      adaModalEl.textContent = "";
      parkingModalEl.textContent = "";

      // un-hides modal and populates with specific venue information
      modal.classList.remove("hidden");

      venueModalEl.textContent = "Welcome to " + venue.name;
      addressModalEl.textContent =
        venue.address.line1 +
        ", " +
        venue.city.name +
        " " +
        venue.state.stateCode +
        ", " +
        venue.postalCode;
      if (venue.ada) {
        adaModalEl.textContent =
          "Phone number for ADA ticketing: " + venue.ada.adaPhones;
      } else {
        console.log("No ADA Information");
      }
      if (venue.parkingDetail) {
        parkingModalEl.textContent =
          "Parking information: " + venue.parkingDetail;
      } else {
        console.log("No Parking Information");
      }
    });
  });
}

// Close modal on closeModalBtn click
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// upon reload, populate page with last city searched
document.addEventListener("DOMContentLoaded", function () {
  let lastCitySearched = localStorage.getItem("city");

  console.log(lastCitySearched);

  if (lastCitySearched !== null) {
    searchTicketmasterApi(JSON.parse(lastCitySearched));
    document.getElementById("city").value = JSON.parse(lastCitySearched);
  }

  console.log("Last searched city: " + lastCitySearched);
});
