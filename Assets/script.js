const form = document.querySelector('form');
const input = document.querySelector('input[type="text"]');
const button = document.querySelector('button[type="submit"]');
const searchBtn = document.getElementById('search-btn');
const resultsPanel = document.getElementById('results-panel');

searchBtn.addEventListener('click', function(event) {
  event.preventDefault(); 
  resultsPanel.classList.remove('hidden');
});

//Prevent page refresh when clicking search button
form.addEventListener('submit', function(event) {
  event.preventDefault();
});

//Adds an event listener to the window to detect changes in screen size for search bar
window.addEventListener('resize', function() {
  if (window.innerWidth <= 768) {
    input.style.maxWidth = 'none';
    button.style.borderRadius = '5px';
  } else {
    input.style.maxWidth = '400px';
    button.style.borderRadius = '0 5px 5px 0';
  }
});

function initMap() {
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: { lat: 37.7749, lng: -122.4194 },
    });
    map.setOptions({ draggable: true });

    console.log("MAP");
  }

