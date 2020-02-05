// ISS API
const issURL = 'https://api.wheretheiss.at/v1/satellites/25544?units=';

// Velocity Unit Change

let isMetric = true;

document.getElementById('change-units').addEventListener('click', function() {
	isMetric = !isMetric;
});

// Initialize Google Map
let currPos = { lat: 40.7306, lng: -73.9352 };
let map;
let marker;
let maxZoomService;
let zoom;
let counter = 0;
let zoomOut;
let zoomIn;

async function initMap() {
	await getISS();

	const myOptions = {
		zoom: 1,
		mapTypeId: 'satellite',
		center: currPos
	};

	map = new google.maps.Map(document.getElementById('map'), myOptions);
	map.setTilt(45);

	maxZoomService = new google.maps.MaxZoomService();

	marker = new google.maps.Marker({
		position: currPos,
		map: map
	});
}

async function getISS() {
	const response = await fetch(issURL + (isMetric ? 'kilometers' : 'miles'));
	const location = await response.json();

	const { latitude, longitude, velocity, altitude } = location;

	currPos.lat = latitude;
	currPos.lng = longitude;

	const altUnit = isMetric ? 'km' : 'mi';
	const velUnit = isMetric ? 'kph' : 'mph';

	document.getElementById('lat').textContent = latitude.toFixed(2);
	document.getElementById('lon').textContent = longitude.toFixed(2);

	document.getElementById('alt').textContent = `${altitude.toFixed(
		2
	)} ${altUnit}`;
	document.getElementById('vel').textContent = `${velocity.toFixed(
		2
	)} ${velUnit}`;
}

function updatePos() {
	marker.setPosition(currPos);
	map.setCenter(currPos);
}

function checkMaxZoom() {
	maxZoomService.getMaxZoomAtLatLng(currPos, function(response) {
		if (response.status !== 'OK') {
			console.log('Error');
		} else {
			zoom = response.zoom;
		}
	});
}

function resetZoom() {
	if (!counter) {
    map.zoom = zoom - 3;
	}
}

function countdown() {
	if (counter) {
		console.log(counter);
		counter--;
	}
}

setInterval(getISS, 1000);
setInterval(checkMaxZoom, 1000);
setInterval(resetZoom, 1000);

google.maps.event.addDomListener(window, 'load', initMap);

// TODO: fix event listeners on map zoom buttons to allow user a window to move freely
async function setZooms() {
  await initMap;
  
  zoomOut = document.querySelector('[title="Zoom out"]');
  console.log(zoomOut)
	zoomIn = document.querySelector('[title="Zoom in"]');

	zoomOut.addEventListener('click', setCounter);
	zoomIn.addEventListener('click', setCounter);
}

setZooms()


function setCounter() {
	counter = 8;
}

setInterval(countdown, 1000);
setInterval(updatePos, 1000);
