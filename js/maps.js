/* Google Maps Integration JavaScript for Ride-Hailing Website */

// Global variables
let map;
let autocompletePickup;
let autocompleteDestination;
let directionsService;
let directionsRenderer;
let pickupMarker;
let destinationMarker;
let driverMarker;
let currentRoute;
let simulationInterval;
let driverPath = [];
let driverPathIndex = 0;

// Initialize Google Maps
function initMap() {
  // Check if Google Maps API is loaded
  if (!window.google || !window.google.maps) {
    console.error('Google Maps API not loaded');
    showMapError();
    return;
  }

  // Map configuration
  const mapOptions = {
    center: { lat: 37.7749, lng: -122.4194 }, // Default center (San Francisco)
    zoom: 13,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP
    },
    styles: getMapStyles()
  };

  // Initialize the map
  const mapElement = document.getElementById('map');
  if (!mapElement) return;
  
  map = new google.maps.Map(mapElement, mapOptions);

  // Initialize directions service and renderer
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: true, // We'll use custom markers
    polylineOptions: {
      strokeColor: '#1A73E8',
      strokeWeight: 5,
      strokeOpacity: 0.7
    }
  });

  // Initialize autocomplete for pickup and destination inputs
  initAutocomplete();

  // Add map controls
  addMapControls();

  // Check if we're on the tracking page
  const isTrackingPage = document.body.classList.contains('tracking-page');
  if (isTrackingPage) {
    initDriverTracking();
  }

  // Add event listeners
  setupEventListeners();
}

// Initialize Google Places Autocomplete
function initAutocomplete() {
  const pickupInput = document.getElementById('pickup-location');
  const destinationInput = document.getElementById('destination-location');

  if (!pickupInput || !destinationInput) return;

  // Options for the autocomplete
  const options = {
    types: ['address'],
    fields: ['place_id', 'geometry', 'name', 'formatted_address']
  };

  // Initialize autocomplete for pickup
  autocompletePickup = new google.maps.places.Autocomplete(pickupInput, options);
  autocompletePickup.addListener('place_changed', () => {
    const place = autocompletePickup.getPlace();
    if (!place.geometry) return;
    
    // Update pickup marker
    updatePickupMarker(place.geometry.location);
    
    // If we have both pickup and destination, calculate route
    if (pickupMarker && destinationMarker) {
      calculateRoute();
    }
  });

  // Initialize autocomplete for destination
  autocompleteDestination = new google.maps.places.Autocomplete(destinationInput, options);
  autocompleteDestination.addListener('place_changed', () => {
    const place = autocompleteDestination.getPlace();
    if (!place.geometry) return;
    
    // Update destination marker
    updateDestinationMarker(place.geometry.location);
    
    // If we have both pickup and destination, calculate route
    if (pickupMarker && destinationMarker) {
      calculateRoute();
    }
  });
}

// Update pickup marker on the map
function updatePickupMarker(location) {
  if (pickupMarker) {
    pickupMarker.setMap(null);
  }

  pickupMarker = new google.maps.Marker({
    position: location,
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#34A853',
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 8
    },
    title: 'Pickup Location'
  });

  map.panTo(location);
  map.setZoom(15);
}

// Update destination marker on the map
function updateDestinationMarker(location) {
  if (destinationMarker) {
    destinationMarker.setMap(null);
  }

  destinationMarker = new google.maps.Marker({
    position: location,
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#EA4335',
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 8
    },
    title: 'Destination Location'
  });

  map.panTo(location);
  map.setZoom(15);
}

// Calculate route between pickup and destination
function calculateRoute() {
  if (!pickupMarker || !destinationMarker) return;

  const request = {
    origin: pickupMarker.getPosition(),
    destination: destinationMarker.getPosition(),
    travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
      currentRoute = result;
      
      // Update route information
      updateRouteInfo(result);
      
      // Fit map to show the entire route
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(pickupMarker.getPosition());
      bounds.extend(destinationMarker.getPosition());
      map.fitBounds(bounds);
      
      // Show route info panel
      document.querySelector('.route-info')?.classList.add('active');
    } else {
      console.error('Directions request failed due to ' + status);
      showRouteError();
    }
  });
}

// Update route information panel
function updateRouteInfo(route) {
  const routeInfoElement = document.getElementById('route-info');
  if (!routeInfoElement) return;

  const leg = route.routes[0].legs[0];
  const distance = leg.distance.text;
  const duration = leg.duration.text;
  
  // Update distance and duration
  document.getElementById('route-distance')?.textContent = distance;
  document.getElementById('route-duration')?.textContent = duration;
  
  // Update fare estimate based on distance
  updateFareEstimate(leg.distance.value);
  
  // Update route steps if the element exists
  const routeStepsElement = document.getElementById('route-steps');
  if (routeStepsElement) {
    routeStepsElement.innerHTML = '';
    
    leg.steps.forEach((step, index) => {
      const stepElement = document.createElement('div');
      stepElement.className = 'route-step';
      
      // Create step HTML
      stepElement.innerHTML = `
        <div class="route-step-icon">
          <i class="fas fa-arrow-right"></i>
        </div>
        <div class="route-step-line"></div>
        <div class="route-step-content">
          <div class="route-step-instruction">${step.instructions}</div>
          <div class="route-step-distance">${step.distance.text}</div>
          ${step.fare ? `<div class="route-step-fare">₹${(step.fare * 82).toFixed(2)}</div>` : ''}
        </div>
      `;
      
      routeStepsElement.appendChild(stepElement);
    });
  }
}

// Update fare estimate based on distance
function updateFareEstimate(distanceInMeters) {
  const fareEstimateElement = document.getElementById('fare-estimate');
  if (!fareEstimateElement) return;
  
  // Convert meters to kilometers
  const distanceInKm = distanceInMeters / 1000;
  
  // Basic fare calculation (in INR)
  const baseFare = 210;  // Base fare in rupees
  const perKmRate = 15; // Per km rate in rupees
  const fare = baseFare + (distanceInKm * perKmRate);
  
  // Apply surge pricing if it's rush hour
  const now = new Date();
  const hour = now.getHours();
  let surgeMultiplier = 1;
  
  if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19)) {
    surgeMultiplier = 1.5;
  }
  
  const finalFare = Math.round(fare * surgeMultiplier);
  
  // Update fare estimate elements
  document.getElementById('base-fare')?.textContent = `₹${baseFare}`;
  document.getElementById('distance-fare')?.textContent = `₹${Math.round(distanceInKm * perKmRate)}`;
  document.getElementById('surge-multiplier')?.textContent = `${surgeMultiplier}x`;
  document.getElementById('total-fare')?.textContent = `₹${finalFare}`;
  
  // Update fare for different vehicle types
  updateVehicleTypeFares(finalFare);
}

// Update fares for different vehicle types
function updateVehicleTypeFares(baseFare) {
  const economyFare = baseFare;
  const premiumFare = Math.round(baseFare * 1.5);
  const suvFare = Math.round(baseFare * 2);
  const greenFare = Math.round(baseFare * 1.2);
  const bikeFare = Math.round(baseFare * 0.6);
  
  document.getElementById('economy-fare')?.textContent = `₹${economyFare}`;
  document.getElementById('premium-fare')?.textContent = `₹${premiumFare}`;
  document.getElementById('suv-fare')?.textContent = `₹${suvFare}`;
  document.getElementById('green-fare')?.textContent = `₹${greenFare}`;
  document.getElementById('bike-fare')?.textContent = `₹${bikeFare}`;
}

// Initialize driver tracking simulation
function initDriverTracking() {
  if (!currentRoute || !pickupMarker) return;
  
  // Create driver marker
  const driverStartPosition = getRandomPointNearLocation(pickupMarker.getPosition(), 1000);
  
  driverMarker = new google.maps.Marker({
    position: driverStartPosition,
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#1A73E8',
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 10
    },
    title: 'Your Driver'
  });
  
  // Generate path from driver to pickup
  generateDriverPath(driverStartPosition, pickupMarker.getPosition(), (path) => {
    driverPath = path;
    
    // Start simulation
    startDriverSimulation();
    
    // Update ETA
    updateDriverEta();
  });
}

// Generate a path for the driver to follow
function generateDriverPath(start, end, callback) {
  const request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  
  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      // Extract path from route
      const path = [];
      const route = result.routes[0];
      
      route.legs.forEach(leg => {
        leg.steps.forEach(step => {
          step.path.forEach(point => {
            path.push(point);
          });
        });
      });
      
      callback(path);
    } else {
      console.error('Failed to generate driver path');
      callback([start, end]);
    }
  });
}

// Start driver movement simulation
function startDriverSimulation() {
  if (driverPath.length === 0) return;
  
  // Clear any existing interval
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }
  
  driverPathIndex = 0;
  
  // Update driver position every 500ms
  simulationInterval = setInterval(() => {
    if (driverPathIndex >= driverPath.length) {
      clearInterval(simulationInterval);
      
      // If driver reached pickup, start trip simulation
      if (driverMarker.getPosition().equals(pickupMarker.getPosition())) {
        startTripSimulation();
      }
      
      return;
    }
    
    // Move driver marker
    driverMarker.setPosition(driverPath[driverPathIndex]);
    driverPathIndex++;
    
    // Update ETA
    updateDriverEta();
  }, 500);
}

// Start trip simulation after pickup
function startTripSimulation() {
  if (!currentRoute) return;
  
  // Extract path from current route
  const path = [];
  const route = currentRoute.routes[0];
  
  route.legs.forEach(leg => {
    leg.steps.forEach(step => {
      step.path.forEach(point => {
        path.push(point);
      });
    });
  });
  
  // Set new driver path
  driverPath = path;
  driverPathIndex = 0;
  
  // Update trip status
  document.getElementById('trip-status')?.textContent = 'En Route to Destination';
  
  // Start simulation
  startDriverSimulation();
}

// Update driver ETA
function updateDriverEta() {
  const etaElement = document.getElementById('driver-eta');
  if (!etaElement) return;
  
  // Calculate remaining points in path
  const remainingPoints = driverPath.length - driverPathIndex;
  
  // Estimate time based on remaining points (simplified)
  const estimatedSeconds = remainingPoints * 0.5;
  
  let etaText;
  if (estimatedSeconds < 60) {
    etaText = 'Less than a minute';
  } else {
    const minutes = Math.ceil(estimatedSeconds / 60);
    etaText = `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  etaElement.textContent = etaText;
}

// Get a random point near a location (for driver starting position)
function getRandomPointNearLocation(location, maxDistance) {
  const lat = location.lat();
  const lng = location.lng();
  
  // Convert max distance from meters to degrees (approximate)
  const maxLat = maxDistance / 111000;
  const maxLng = maxDistance / (111000 * Math.cos(lat * (Math.PI / 180)));
  
  // Generate random offsets
  const latOffset = (Math.random() * 2 - 1) * maxLat;
  const lngOffset = (Math.random() * 2 - 1) * maxLng;
  
  return new google.maps.LatLng(lat + latOffset, lng + lngOffset);
}

// Add custom controls to the map
function addMapControls() {
  // Create control container
  const controlDiv = document.createElement('div');
  controlDiv.className = 'map-controls';
  
  // Add zoom in button
  const zoomInButton = document.createElement('button');
  zoomInButton.className = 'map-control-button';
  zoomInButton.innerHTML = '<i class="fas fa-plus"></i>';
  zoomInButton.title = 'Zoom In';
  zoomInButton.addEventListener('click', () => {
    map.setZoom(map.getZoom() + 1);
  });
  
  // Add zoom out button
  const zoomOutButton = document.createElement('button');
  zoomOutButton.className = 'map-control-button';
  zoomOutButton.innerHTML = '<i class="fas fa-minus"></i>';
  zoomOutButton.title = 'Zoom Out';
  zoomOutButton.addEventListener('click', () => {
    map.setZoom(map.getZoom() - 1);
  });
  
  // Add current location button
  const currentLocationButton = document.createElement('button');
  currentLocationButton.className = 'map-control-button';
  currentLocationButton.innerHTML = '<i class="fas fa-location-arrow"></i>';
  currentLocationButton.title = 'Current Location';
  currentLocationButton.addEventListener('click', () => {
    getCurrentLocation();
  });
  
  // Add fullscreen toggle button
  const fullscreenButton = document.createElement('button');
  fullscreenButton.className = 'map-control-button';
  fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
  fullscreenButton.title = 'Toggle Fullscreen';
  fullscreenButton.addEventListener('click', () => {
    toggleFullscreen();
  });
  
  // Add buttons to control div
  controlDiv.appendChild(zoomInButton);
  controlDiv.appendChild(zoomOutButton);
  controlDiv.appendChild(currentLocationButton);
  controlDiv.appendChild(fullscreenButton);
  
  // Add control div to map
  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(controlDiv);
}

// Get current location
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        
        map.panTo(currentLocation);
        map.setZoom(15);
        
        // If on booking page, set pickup location
        const pickupInput = document.getElementById('pickup-location');
        if (pickupInput) {
          // Reverse geocode to get address
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: currentLocation }, (results, status) => {
            if (status === 'OK' && results[0]) {
              pickupInput.value = results[0].formatted_address;
              updatePickupMarker(currentLocation);
              
              // If we have destination, calculate route
              if (destinationMarker) {
                calculateRoute();
              }
            }
          });
        }
      },
      (error) => {
        console.error('Error getting current location:', error);
        showLocationError();
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser');
    showLocationError();
  }
}

// Toggle fullscreen map
function toggleFullscreen() {
  const mapContainer = document.querySelector('.map-container');
  if (!mapContainer) return;
  
  mapContainer.classList.toggle('fullscreen');
  
  // Trigger resize event to make sure map renders correctly
  google.maps.event.trigger(map, 'resize');
}

// Setup event listeners
function setupEventListeners() {
  // Current location buttons
  document.querySelectorAll('.current-location-button').forEach(button => {
    button.addEventListener('click', () => {
      getCurrentLocation();
    });
  });
  
  // Route info toggle
  const routeInfoToggle = document.querySelector('.route-info-toggle');
  if (routeInfoToggle) {
    routeInfoToggle.addEventListener('click', () => {
      routeInfoToggle.classList.toggle('collapsed');
      document.querySelector('.route-info-content').classList.toggle('expanded');
    });
  }
  
  // Vehicle type selection
  document.querySelectorAll('.vehicle-option').forEach(option => {
    option.addEventListener('click', () => {
      // Remove active class from all options
      document.querySelectorAll('.vehicle-option').forEach(opt => {
        opt.classList.remove('active');
      });
      
      // Add active class to selected option
      option.classList.add('active');
      
      // Update selected vehicle type
      const vehicleType = option.dataset.type;
      document.getElementById('selected-vehicle-type').value = vehicleType;
      
      // Update fare display
      updateSelectedFare(vehicleType);
    });
  });
}

// Update selected fare based on vehicle type
function updateSelectedFare(vehicleType) {
  const fareElement = document.getElementById(`${vehicleType}-fare`);
  if (!fareElement) return;
  
  const fare = fareElement.textContent;
  document.getElementById('selected-fare').textContent = fare;
}

// Show error when map fails to load
function showMapError() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;
  
  mapElement.innerHTML = `
    <div class="map-error">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>Map Failed to Load</h3>
      <p>Please check your internet connection or try again later.</p>
    </div>
  `;
}

// Show error when route calculation fails
function showRouteError() {
  const routeInfoElement = document.getElementById('route-info');
  if (!routeInfoElement) return;
  
  routeInfoElement.innerHTML = `
    <div class="route-error">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>Route Calculation Failed</h3>
      <p>We couldn't calculate a route between these locations. Please try different locations.</p>
    </div>
  `;
}

// Show error when geolocation fails
function showLocationError() {
  alert('Unable to get your current location. Please check your browser settings and try again.');
}

// Get map styles for dark/light mode
function getMapStyles() {
  // Check if dark mode is enabled
  const isDarkMode = document.body.classList.contains('dark-mode') || 
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (isDarkMode) {
    return [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ];
  } else {
    return [
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi",
        stylers: [{ visibility: "simplified" }],
      },
      {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        stylers: [{ visibility: "off" }],
      },
    ];
  }
}

// Load Google Maps API
function loadGoogleMapsAPI() {
  // Check if API is already loaded
  if (window.google && window.google.maps) {
    initMap();
    return;
  }
  
  // Create script element
  const script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap';
  script.defer = true;
  script.async = true;
  
  // Add error handler
  script.onerror = () => {
    console.error('Failed to load Google Maps API');
    showMapError();
  };
  
  // Append script to document
  document.head.appendChild(script);
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if map element exists
  if (document.getElementById('map')) {
    loadGoogleMapsAPI();
  }
});

// Make initMap function globally available for callback
window.initMap = initMap;
