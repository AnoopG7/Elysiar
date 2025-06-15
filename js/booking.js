/* Booking Page JavaScript for Ride-Hailing Website */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize booking page functionality
  initBookingPage();
});

// Initialize all booking page functionality
function initBookingPage() {
  // Set up event listeners
  setupScheduleToggle();
  setupAddStopToggle();
  setupPromoCodeToggle();
  setupSavedLocations();
  setupPaymentOptions();
  setupVehicleSelection();
  setupBookingButton();
  setupModalFunctionality();
  
  // Set minimum date for schedule to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('schedule-date-input')?.setAttribute('min', today);
}

// Setup schedule toggle functionality
function setupScheduleToggle() {
  const scheduleToggle = document.getElementById('schedule-toggle');
  const scheduleOptions = document.getElementById('schedule-options');
  
  if (scheduleToggle && scheduleOptions) {
    scheduleToggle.addEventListener('change', () => {
      scheduleOptions.classList.toggle('active', scheduleToggle.checked);
    });
  }
}

// Setup add stop toggle functionality
function setupAddStopToggle() {
  const addStopToggle = document.getElementById('add-stop-toggle');
  const addStopContainer = document.getElementById('add-stop-container');
  
  if (addStopToggle && addStopContainer) {
    addStopToggle.addEventListener('change', () => {
      addStopContainer.classList.toggle('active', addStopToggle.checked);
    });
  }
}

// Setup promo code toggle functionality
function setupPromoCodeToggle() {
  const promoCodeToggle = document.getElementById('promo-code-toggle');
  const promoCodeInputContainer = document.getElementById('promo-code-input-container');
  
  if (promoCodeToggle && promoCodeInputContainer) {
    promoCodeToggle.addEventListener('click', () => {
      promoCodeInputContainer.classList.toggle('active');
      
      if (promoCodeInputContainer.classList.contains('active')) {
        promoCodeInputContainer.querySelector('input').focus();
      }
    });
    
    // Setup promo code apply button
    const applyButton = promoCodeInputContainer.querySelector('.promo-code-apply');
    if (applyButton) {
      applyButton.addEventListener('click', () => {
        const promoInput = promoCodeInputContainer.querySelector('input');
        const promoCode = promoInput.value.trim();
        
        if (promoCode) {
          // Simulate promo code application
          applyPromoCode(promoCode);
          
          // Reset input and hide container
          promoInput.value = '';
          promoCodeInputContainer.classList.remove('active');
        }
      });
    }
  }
}

// Apply promo code and update fare
function applyPromoCode(code) {
  // Simulate different promo codes
  let discount = 0;
  let message = '';
  
  switch(code.toUpperCase()) {
    case 'WELCOME10':
      discount = 0.1; // 10% off
      message = '10% discount applied!';
      break;
    case 'RIDE20':
      discount = 0.2; // 20% off
      message = '20% discount applied!';
      break;
    case 'FIRST50':
      discount = 0.5; // 50% off
      message = '50% discount applied for first ride!';
      break;
    default:
      message = 'Invalid promo code';
      break;
  }
  
  if (discount > 0) {
    // Get current fare
    const totalFareElement = document.getElementById('total-fare');
    if (totalFareElement) {
      const currentFare = parseFloat(totalFareElement.textContent.replace('$', ''));
      const discountedFare = (currentFare * (1 - discount)).toFixed(2);
      
      // Update fare display
      totalFareElement.textContent = `$${discountedFare}`;
      
      // Add discount line item
      const fareBreakdown = document.querySelector('.fare-breakdown');
      if (fareBreakdown) {
        // Check if discount item already exists
        let discountItem = document.querySelector('.fare-item.discount');
        
        if (!discountItem) {
          // Create new discount item
          discountItem = document.createElement('div');
          discountItem.className = 'fare-item discount';
          
          const discountLabel = document.createElement('span');
          discountLabel.textContent = 'Promo discount';
          
          const discountValue = document.createElement('span');
          discountValue.id = 'discount-value';
          
          discountItem.appendChild(discountLabel);
          discountItem.appendChild(discountValue);
          
          // Insert before total
          const totalItem = document.querySelector('.fare-item.total');
          fareBreakdown.insertBefore(discountItem, totalItem);
        }
        
        // Update discount value
        const discountValue = document.getElementById('discount-value');
        if (discountValue) {
          const discountAmount = (currentFare * discount).toFixed(2);
          discountValue.textContent = `-$${discountAmount}`;
        }
      }
      
      // Show success message
      showNotification(message, 'success');
      
      // Update selected fare
      document.getElementById('selected-fare').value = `$${discountedFare}`;
    }
  } else {
    showNotification(message, 'error');
  }
}

// Setup saved locations functionality
function setupSavedLocations() {
  const savedLocationButtons = document.querySelectorAll('.saved-location-btn:not(.add-new)');
  
  savedLocationButtons.forEach(button => {
    button.addEventListener('click', () => {
      const address = button.getAttribute('data-address');
      if (address) {
        // Determine which input to fill (pickup or destination)
        const destinationInput = document.getElementById('destination-location');
        const pickupInput = document.getElementById('pickup-location');
        
        if (destinationInput.value === '') {
          destinationInput.value = address;
          // Trigger a change event to simulate user input
          const event = new Event('change');
          destinationInput.dispatchEvent(event);
        } else if (pickupInput.value === '') {
          pickupInput.value = address;
          // Trigger a change event to simulate user input
          const event = new Event('change');
          pickupInput.dispatchEvent(event);
        }
      }
    });
  });
  
  // Add new saved location button
  const addNewButton = document.querySelector('.saved-location-btn.add-new');
  if (addNewButton) {
    addNewButton.addEventListener('click', () => {
      // In a real app, this would open a modal to add a new saved location
      showNotification('This feature would allow adding a new saved location', 'info');
    });
  }
}

// Setup payment options functionality
function setupPaymentOptions() {
  const paymentOptions = document.querySelectorAll('.payment-option:not(.add-payment)');
  
  paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove active class from all options
      paymentOptions.forEach(opt => {
        opt.classList.remove('active');
      });
      
      // Add active class to clicked option
      option.classList.add('active');
    });
  });
  
  // Add new payment method button
  const addPaymentButton = document.querySelector('.payment-option.add-payment');
  if (addPaymentButton) {
    addPaymentButton.addEventListener('click', () => {
      // In a real app, this would open a modal to add a new payment method
      showNotification('This feature would allow adding a new payment method', 'info');
    });
  }
}

// Setup vehicle selection functionality
function setupVehicleSelection() {
  const vehicleOptions = document.querySelectorAll('.vehicle-option');
  
  vehicleOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove active class from all options
      vehicleOptions.forEach(opt => {
        opt.classList.remove('active');
      });
      
      // Add active class to clicked option
      option.classList.add('active');
      
      // Update selected vehicle type
      const vehicleType = option.getAttribute('data-type');
      document.getElementById('selected-vehicle-type').value = vehicleType;
      
      // Update selected fare
      const fareElement = option.querySelector('.vehicle-option-price');
      if (fareElement) {
        document.getElementById('selected-fare').value = fareElement.textContent;
        document.getElementById('total-fare').textContent = fareElement.textContent;
      }
    });
  });
}

// Setup booking button functionality
function setupBookingButton() {
  const bookButton = document.getElementById('book-ride-btn');
  
  if (bookButton) {
    bookButton.addEventListener('click', () => {
      // Validate inputs
      const pickupInput = document.getElementById('pickup-location');
      const destinationInput = document.getElementById('destination-location');
      
      if (!pickupInput.value.trim()) {
        showNotification('Please enter a pickup location', 'error');
        pickupInput.focus();
        return;
      }
      
      if (!destinationInput.value.trim()) {
        showNotification('Please enter a destination', 'error');
        destinationInput.focus();
        return;
      }
      
      // Show booking confirmation modal
      showBookingConfirmation();
    });
  }
}

// Show booking confirmation modal
function showBookingConfirmation() {
  const modal = document.getElementById('booking-confirmation-modal');
  
  if (modal) {
    // Update confirmation details
    document.getElementById('confirmation-pickup').textContent = document.getElementById('pickup-location').value;
    document.getElementById('confirmation-destination').textContent = document.getElementById('destination-location').value;
    document.getElementById('confirmation-fare').textContent = document.getElementById('selected-fare').value || document.getElementById('total-fare').textContent;
    
    // Show modal
    modal.classList.add('active');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
  }
}

// Setup modal functionality
function setupModalFunctionality() {
  const modal = document.getElementById('booking-confirmation-modal');
  const closeButton = document.getElementById('modal-close');
  const cancelRideButton = document.getElementById('cancel-ride-btn');
  
  if (modal && closeButton) {
    closeButton.addEventListener('click', () => {
      closeModal(modal);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  }
  
  if (cancelRideButton) {
    cancelRideButton.addEventListener('click', () => {
      showNotification('Ride cancelled successfully', 'success');
      closeModal(modal);
    });
  }
}

// Close modal
function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Add icon based on type
  const icon = document.createElement('i');
  switch (type) {
    case 'success':
      icon.className = 'fas fa-check-circle';
      break;
    case 'error':
      icon.className = 'fas fa-exclamation-circle';
      break;
    case 'info':
    default:
      icon.className = 'fas fa-info-circle';
      break;
  }
  
  notification.prepend(icon);
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.className = 'notification-close';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => {
    notification.remove();
  });
  
  notification.appendChild(closeButton);
  
  // Add to document
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

// Update fare estimate based on distance
function updateFareEstimate(distanceInMeters) {
  const fareEstimateElement = document.getElementById('fare-estimate');
  if (!fareEstimateElement) return;
  
  // Convert meters to kilometers
  const distanceInKm = distanceInMeters / 1000;
  
  // Basic fare calculation (in INR)
  const baseFare = 100;  // Base fare in rupees
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
  document.getElementById('base-fare').textContent = `₹${baseFare}`;
  document.getElementById('distance-fare').textContent = `₹${Math.round(distanceInKm * perKmRate)}`;
  document.getElementById('surge-multiplier').textContent = `${surgeMultiplier}x`;
  document.getElementById('total-fare').textContent = `₹${finalFare}`;
  
  // Update fare for different vehicle types
  updateVehicleTypeFares(finalFare);
}

// Update fares for different vehicle types
function updateVehicleTypeFares(baseFare) {
  // Following the price hierarchy: bike < bus < green < economy < sedan < premium < SUV
  const bikeFare = Math.round(baseFare * 0.6);  // Lowest fare
  const busFare = Math.round(baseFare * 0.7);   // Slightly higher than bike
  const greenFare = Math.round(baseFare * 0.8);  // Higher than bus
  const economyFare = Math.round(baseFare * 0.9); // Higher than green
  const sedanFare = baseFare;                    // Base fare (sedan is our reference)
  const premiumFare = Math.round(baseFare * 1.5); // Higher than sedan
  const suvFare = Math.round(baseFare * 2);      // Highest fare
  
  // Update the price displays
  document.getElementById('bike-fare').textContent = `₹${bikeFare}`;
  if (document.getElementById('bus-fare')) {
    document.getElementById('bus-fare').textContent = `₹${busFare}`;
  }
  document.getElementById('green-fare').textContent = `₹${greenFare}`;
  document.getElementById('economy-fare').textContent = `₹${economyFare}`;
  if (document.getElementById('sedan-fare')) {
    document.getElementById('sedan-fare').textContent = `₹${sedanFare}`;
  }
  document.getElementById('premium-fare').textContent = `₹${premiumFare}`;
  document.getElementById('suv-fare').textContent = `₹${suvFare}`;
  
  // Update selected fare if economy is selected (default)
  const selectedVehicleType = document.getElementById('selected-vehicle-type').value;
  if (selectedVehicleType === 'economy') {
    document.getElementById('selected-fare').value = `₹${economyFare}`;
  }
}
