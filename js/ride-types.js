// Ride Types JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Common functionality across ride types
  setupRideTypeBasics();
  
  // Page specific initializations
  if(document.body.classList.contains('premium-ride-page')) {
    initializePremiumRide();
  } else if(document.body.classList.contains('airport-transfer-page')) {
    initializeAirportTransfer();
  } else if(document.body.classList.contains('intercity-travel-page')) {
    initializeIntercityTravel();
  }
});

function setupRideTypeBasics() {
  // Setup promo code toggle
  const promoToggle = document.getElementById('promo-code-toggle');
  const promoContainer = document.getElementById('promo-code-input-container');
  
  if(promoToggle && promoContainer) {
    promoToggle.addEventListener('click', function() {
      promoContainer.style.display = promoContainer.style.display === 'block' ? 'none' : 'block';
    });
  }
  
  // Route info toggle
  const routeInfoToggle = document.getElementById('route-info-toggle');
  const routeInfoContent = document.getElementById('route-info-content');
  
  if(routeInfoToggle && routeInfoContent) {
    routeInfoToggle.addEventListener('click', function() {
      routeInfoContent.classList.toggle('expanded');
      routeInfoToggle.querySelector('i').classList.toggle('fa-chevron-up');
      routeInfoToggle.querySelector('i').classList.toggle('fa-chevron-down');
    });
  }
  
  // Vehicle selection
  const vehicleOptions = document.querySelectorAll('.vehicle-option');
  
  vehicleOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove active class from all options
      vehicleOptions.forEach(o => o.classList.remove('active'));
      // Add active class to clicked option
      this.classList.add('active');
      
      // Update hidden field
      const vehicleType = this.getAttribute('data-type');
      document.getElementById('selected-vehicle-type').value = vehicleType;
      
      // Update fare estimate based on vehicle type
      updateFareEstimate(vehicleType);
    });
  });
  
  // Book button click handler
  const bookButton = document.getElementById('book-ride-btn');
  if(bookButton) {
    bookButton.addEventListener('click', function() {
      // Show booking confirmation modal
      const modal = document.getElementById('booking-confirmation-modal');
      if(modal) {
        modal.style.display = 'block';
        
        // Set confirmation details
        const pickup = document.querySelector('#pickup-location, #origin-city').value;
        const destination = document.querySelector('#destination-location, #destination-city').value;
        const fare = document.getElementById('total-fare').textContent;
        
        document.getElementById('confirmation-pickup').textContent = pickup || 'Custom pickup location';
        document.getElementById('confirmation-destination').textContent = destination || 'Custom destination';
        document.getElementById('confirmation-fare').textContent = fare;
      }
    });
  }
  
  // Close modal
  const closeBtn = document.getElementById('modal-close');
  if(closeBtn) {
    closeBtn.addEventListener('click', function() {
      document.getElementById('booking-confirmation-modal').style.display = 'none';
    });
  }
  
  // Cancel ride
  const cancelBtn = document.getElementById('cancel-ride-btn');
  if(cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      document.getElementById('booking-confirmation-modal').style.display = 'none';
      alert('Your ride has been cancelled.');
    });
  }
}

// Premium Ride specific functionality
function initializePremiumRide() {
  console.log('Premium Ride page initialized');
  
  // Example function to update fare based on premium options
  function updatePremiumFare() {
    const basePrice = 400; // Base price for premium sedan
    let totalFare = basePrice;
    
    // Get selected vehicle
    const selectedVehicle = document.querySelector('.vehicle-option.active').getAttribute('data-type');
    
    switch(selectedVehicle) {
      case 'premium-sedan':
        totalFare = 600;
        break;
      case 'executive':
        totalFare = 700;
        break;
      case 'luxury-suv':
        totalFare = 800;
        break;
    }
    
    // Update fare components
    document.getElementById('base-fare').textContent = `₹${Math.round(totalFare * 0.6)}`;
    document.getElementById('premium-fee').textContent = `₹${Math.round(totalFare * 0.25)}`;
    document.getElementById('distance-fare').textContent = `₹${Math.round(totalFare * 0.15)}`;
    document.getElementById('total-fare').textContent = `₹${totalFare}`;
  }
  
  // Update fare when page loads
  updatePremiumFare();
  
  // Add event listener for vehicle option changes
  document.querySelectorAll('.vehicle-option').forEach(option => {
    option.addEventListener('click', updatePremiumFare);
  });
}

// Airport Transfer specific functionality
function initializeAirportTransfer() {
  console.log('Airport Transfer page initialized');
  
  // Initialize flight date and time inputs
  const flightDateInput = document.getElementById('flight-date');
  const flightTimeInput = document.getElementById('flight-time');
  
  if (flightDateInput) {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    flightDateInput.value = formattedDate;
    
    // Add event listener to ensure proper display
    flightDateInput.addEventListener('change', function() {
      if (this.value) {
        this.classList.add('has-value');
      } else {
        this.classList.remove('has-value');
      }
    });
    
    // Trigger change event to set initial state
    flightDateInput.dispatchEvent(new Event('change'));
  }
  
  if (flightTimeInput) {
    // Set default time to noon
    flightTimeInput.value = '12:00';
    
    // Add event listener to ensure proper display
    flightTimeInput.addEventListener('change', function() {
      if (this.value) {
        this.classList.add('has-value');
      } else {
        this.classList.remove('has-value');
      }
    });
    
    // Trigger change event to set initial state
    flightTimeInput.dispatchEvent(new Event('change'));
  }
  
  // Toggle between To and From Airport
  const tripTypeOptions = document.querySelectorAll('input[name="trip-type"]');
  const pickupIcon = document.querySelector('.pickup-icon');
  const destinationIcon = document.querySelector('.destination-icon');
  const pickupPlaceholder = document.getElementById('pickup-location');
  const destinationPlaceholder = document.getElementById('destination-location');
  
  tripTypeOptions.forEach(option => {
    option.addEventListener('change', function() {
      if(this.value === 'to-airport') {
        pickupIcon.className = 'fas fa-home location-input-icon pickup-icon';
        destinationIcon.className = 'fas fa-plane location-input-icon destination-icon';
        pickupPlaceholder.placeholder = 'Enter pickup location';
        destinationPlaceholder.placeholder = 'Enter airport';
      } else {
        pickupIcon.className = 'fas fa-plane location-input-icon pickup-icon';
        destinationIcon.className = 'fas fa-home location-input-icon destination-icon';
        pickupPlaceholder.placeholder = 'Enter airport';
        destinationPlaceholder.placeholder = 'Enter destination';
      }
    });
  });
  
  // Update fare based on vehicle and services
  function updateAirportFare() {
    const baseRates = {
      'sedan': 400,
      'premium': 600,
      'suv': 800
    };
    
    let selectedVehicle = document.querySelector('.vehicle-option.active').getAttribute('data-type');
    let baseFare = baseRates[selectedVehicle] || 450;
    
    // Calculate airport fee (always the same)
    const airportFee = 100;
    
    // Calculate distance fare (simulated)
    const distanceFare = Math.round(baseFare * 0.3);
    
    // Calculate any additional services
    let additionalServices = 0;
    document.querySelectorAll('input[name="services"]:checked').forEach(service => {
      switch(service.value) {
        case 'meet-greet':
          additionalServices += 150;
          break;
        case 'wait-time':
          additionalServices += 100;
          break;
        case 'child-seat':
          additionalServices += 50;
          break;
        case 'extra-luggage':
          additionalServices += 100;
          break;
      }
    });
    
    // Calculate total
    const totalFare = baseFare - distanceFare - airportFee + additionalServices;
    
    // Update fare components
    document.getElementById('base-fare').textContent = `₹${baseFare - distanceFare - airportFee}`;
    document.getElementById('airport-fee').textContent = `₹${airportFee}`;
    document.getElementById('distance-fare').textContent = `₹${distanceFare}`;
    document.getElementById('total-fare').textContent = `₹${totalFare}`;
  }
  
  // Add event listeners for fare updates
  document.querySelectorAll('.vehicle-option').forEach(option => {
    option.addEventListener('click', updateAirportFare);
  });
  
  document.querySelectorAll('input[name="services"]').forEach(service => {
    service.addEventListener('change', updateAirportFare);
  });
}

// Intercity Travel specific functionality
function initializeIntercityTravel() {
  console.log('Intercity Travel page initialized');
  
  // Trip type selection
  const tripTypeOptions = document.querySelectorAll('input[name="trip-type"]');
  const returnDateContainer = document.querySelector('.return-date-container');
  const returnTimeContainer = document.querySelector('.return-time-container');
  const returnDateInput = document.getElementById('return-date');
  const returnTimeInput = document.getElementById('return-time');
  
  tripTypeOptions.forEach(option => {
    option.addEventListener('change', function() {
      if(this.value === 'round-trip') {
        returnDateContainer.style.opacity = '1';
        returnTimeContainer.style.opacity = '1';
        returnDateInput.disabled = false;
        returnTimeInput.disabled = false;
      } else {
        returnDateContainer.style.opacity = '0.5';
        returnTimeContainer.style.opacity = '0.5';
        returnDateInput.disabled = true;
        returnTimeInput.disabled = true;
      }
    });
  });
  
  // Passenger count
  const decreaseBtn = document.getElementById('decrease-passengers');
  const increaseBtn = document.getElementById('increase-passengers');
  const passengerCount = document.getElementById('passenger-count-value');
  let currentPassengers = 2;
  
  if (decreaseBtn && increaseBtn && passengerCount) {
    decreaseBtn.addEventListener('click', function() {
      if(currentPassengers > 1) {
        currentPassengers--;
        passengerCount.textContent = currentPassengers;
        updateIntercityFare();
      }
    });
    
    increaseBtn.addEventListener('click', function() {
      if(currentPassengers < 12) {
        currentPassengers++;
        passengerCount.textContent = currentPassengers;
        updateIntercityFare();
      }
    });
  }
  
  // Update fare based on distance, vehicle, and passengers
  function updateIntercityFare() {
    const ratePerKm = {
      'bike': 6,
      'bus': 7,
      'green': 8,
      'economy': 9,
      'premium': 15,
      'suv': 20
    };
    
    // Get estimated distance in km
    const distance = parseInt(document.getElementById('estimated-distance').value) || 150;
    
    // Get selected vehicle
    const selectedVehicle = document.querySelector('.vehicle-option.active').getAttribute('data-type');
    const rate = ratePerKm[selectedVehicle] || 12;
    
    // Calculate base fare
    const baseFare = distance * rate;
    
    // Driver allowance - fixed
    const driverAllowance = 500;
    
    // Tolls and taxes - 10% of base fare approximately
    const tollsTaxes = Math.round(baseFare * 0.1);
    
    // Additional services
    let additionalServices = 0;
    document.querySelectorAll('input[name="services"]:checked').forEach(service => {
      switch(service.value) {
        case 'rest-stops':
          additionalServices += 500;
          break;
        case 'wifi':
          additionalServices += 200;
          break;
        case 'child-seat':
          additionalServices += 100;
          break;
        case 'refreshments':
          additionalServices += 300;
          break;
        case 'extra-luggage':
          additionalServices += 200;
          break;
      }
    });
    
    // Calculate total fare
    const totalFare = baseFare + driverAllowance + tollsTaxes + additionalServices;
    
    // Update fare display
    document.getElementById('base-fare').textContent = `₹${baseFare.toLocaleString()}`;
    document.getElementById('driver-allowance').textContent = `₹${driverAllowance.toLocaleString()}`;
    document.getElementById('tolls-taxes').textContent = `₹${tollsTaxes.toLocaleString()}`;
    document.getElementById('total-fare').textContent = `₹${totalFare.toLocaleString()}`;
  }
  
  // Add event listeners for fare updates
  document.querySelectorAll('.vehicle-option').forEach(option => {
    option.addEventListener('click', updateIntercityFare);
  });
  
  document.querySelectorAll('input[name="services"]').forEach(service => {
    service.addEventListener('change', updateIntercityFare);
  });
  
  // Initialize fare on page load
  updateIntercityFare();
}

// Generic fare update function - calls the appropriate specific function
function updateFareEstimate(vehicleType) {
  if(document.body.classList.contains('premium-ride-page')) {
    initializePremiumRide();
  } else if(document.body.classList.contains('airport-transfer-page')) {
    initializeAirportTransfer();
  } else if(document.body.classList.contains('intercity-travel-page')) {
    initializeIntercityTravel();
  }
}
