const searchBtn = document.getElementById("search-btn");
const resultsContainer = document.getElementById("results-container");

const apiKey = "S3hkm2FnFATqM68Z3lvSHRxUVozGGlHX";

let searchList = [];

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  resultsContainer.classList.remove("hidden");

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
  var apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${cityInput}&classificationName=music&sort=date,asc&size=5`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const events = data._embedded.events;
      console.log(`Found ${events.length} events in ${cityInput}`);

      resultsContainer.innerHTML = "";

      events.forEach((event) => {
        const eventName = event.name;
        const eventDate = new Date(event.dates.start.localDate);
        const eventLocation = event._embedded.venues[0].name;
        const eventImage = event.images[0].url;
        const eventUrl = event.url;

        // Format the date
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
        const day = eventDate.getDate();
        const suffix =
          suffixes[(day - 20) % 10] || suffixes[day] || suffixes[0];
        const formattedDate = `${
          monthNames[eventDate.getMonth()]
        } ${day}${suffix}, ${eventDate.getFullYear()}`;

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
        eventImageEl.classList.add("w-full", "h-52", "object-contain", "mb-2");
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

        resultsContainer.appendChild(eventCard);
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
