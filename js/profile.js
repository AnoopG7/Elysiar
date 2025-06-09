/* Profile JavaScript for Elysiar Ride-Hailing Website */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize profile functionality
  initProfileFunctionality();
});

// Initialize all profile functionality
function initProfileFunctionality() {
  // Check if we're on the profile page
  if (document.querySelector('.profile-page')) {
    // Load user profile data
    loadUserProfile();
    
    // Setup profile form submission
    setupProfileForm();
    
    // Setup profile image upload
    setupProfileImageUpload();
    
    // Setup address management
    setupAddressManagement();
    
    // Setup profile tabs
    setupProfileTabs();
  }
  
  // Initialize profile dropdown in header if it exists
  initProfileDropdown();
}

// Load user profile data from localStorage
function loadUserProfile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // If not logged in, redirect to login
  if (!user.isLoggedIn) {
    window.location.href = 'login.html?redirect=profile.html';
    return;
  }
  
  // Fill profile form fields
  const profileFields = document.querySelectorAll('[data-profile-field]');
  profileFields.forEach(field => {
    const fieldName = field.getAttribute('data-profile-field');
    if (user[fieldName]) {
      if (field.tagName === 'INPUT' || field.tagName === 'SELECT' || field.tagName === 'TEXTAREA') {
        field.value = user[fieldName];
      } else {
        field.textContent = user[fieldName];
      }
    }
  });
  
  // Set profile header info
  const profileName = document.querySelector('.profile-name');
  const profileEmail = document.querySelector('.profile-email');
  const profileMemberSince = document.querySelector('.profile-member-since');
  const profileRating = document.querySelector('.profile-rating');
  
  if (profileName) {
    profileName.textContent = user.name || 'User';
  }
  
  if (profileEmail) {
    profileEmail.textContent = user.email || '';
  }
  
  if (profileMemberSince) {
    // Format date if available or use current date for demo
    const memberSince = user.createdAt ? new Date(user.createdAt) : new Date();
    profileMemberSince.textContent = `Member since ${memberSince.toLocaleDateString()}`;
  }
  
  if (profileRating) {
    // Set dummy rating for demo
    profileRating.textContent = user.rating || '4.9';
  }
  
  // Set profile image
  const profileImage = document.querySelector('.profile-image img');
  if (profileImage) {
    if (user.photoUrl) {
      profileImage.src = user.photoUrl;
    } else {
      // Set placeholder with initials
      const initials = getInitials(user.name || 'User');
      const placeholderDiv = document.createElement('div');
      placeholderDiv.className = 'profile-image-placeholder';
      placeholderDiv.textContent = initials;
      profileImage.parentNode.replaceChild(placeholderDiv, profileImage);
    }
  }
  
  // Populate saved addresses if available
  loadSavedAddresses(user);
  
  // Load ride history if available
  loadRideHistory(user);
  
  // Load payment methods if available
  loadPaymentMethods(user);
  
  // Set any preferences/settings
  loadUserPreferences(user);
}

// Setup profile form submission
function setupProfileForm() {
  const profileForm = document.getElementById('profile-form');
  if (!profileForm) return;
  
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get current user data
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Update with form values
    const formData = new FormData(profileForm);
    
    // Convert FormData to object
    formData.forEach((value, key) => {
      user[key] = value;
    });
    
    // Save updated user
    localStorage.setItem('user', JSON.stringify(user));
    
    // Show success message
    showNotification('Profile updated successfully!', 'success');
    
    // Update UI throughout the app
    window.authFunctions?.updateAuthUI();
  });
}

// Setup profile image upload
function setupProfileImageUpload() {
  const imageInput = document.getElementById('profile-image-upload');
  const imagePreview = document.querySelector('.profile-image img');
  
  if (!imageInput || !imagePreview) return;
  
  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      showNotification('Please select an image file', 'error');
      return;
    }
    
    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      // Update preview
      imagePreview.src = e.target.result;
      
      // Store in user object
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.photoUrl = e.target.result;
      localStorage.setItem('user', JSON.stringify(user));
      
      // Replace placeholder if it exists
      const placeholder = document.querySelector('.profile-image-placeholder');
      if (placeholder) {
        const newImg = document.createElement('img');
        newImg.src = e.target.result;
        newImg.alt = 'Profile Image';
        placeholder.parentNode.replaceChild(newImg, placeholder);
      }
      
      // Update UI throughout the app
      window.authFunctions?.updateAuthUI();
      
      showNotification('Profile picture updated!', 'success');
    };
    reader.readAsDataURL(file);
  });
  
  // Add click handler for the profile image area
  const imageArea = document.querySelector('.profile-image-container');
  if (imageArea) {
    imageArea.addEventListener('click', () => {
      imageInput.click();
    });
  }
}

// Setup address management
function setupAddressManagement() {
  const addressList = document.querySelector('.saved-addresses-list');
  const addAddressForm = document.getElementById('add-address-form');
  
  if (!addressList || !addAddressForm) return;
  
  // Add new address
  addAddressForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('address-name');
    const addressInput = document.getElementById('address-detail');
    
    if (!nameInput.value || !addressInput.value) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    
    // Get user data
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Initialize addresses array if needed
    if (!user.addresses) user.addresses = [];
    
    // Add new address
    const newAddress = {
      id: Date.now().toString(),
      name: nameInput.value,
      address: addressInput.value
    };
    
    user.addresses.push(newAddress);
    
    // Save updated user
    localStorage.setItem('user', JSON.stringify(user));
    
    // Reset form
    nameInput.value = '';
    addressInput.value = '';
    
    // Refresh addresses display
    loadSavedAddresses(user);
    
    showNotification('Address added successfully!', 'success');
  });
  
  // Setup address deletion (using event delegation)
  addressList.addEventListener('click', (e) => {
    const deleteButton = e.target.closest('.delete-address-btn');
    if (!deleteButton) return;
    
    const addressId = deleteButton.getAttribute('data-id');
    if (!addressId) return;
    
    // Get user data
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Remove address
    if (user.addresses) {
      user.addresses = user.addresses.filter(addr => addr.id !== addressId);
      
      // Save updated user
      localStorage.setItem('user', JSON.stringify(user));
      
      // Refresh addresses display
      loadSavedAddresses(user);
      
      showNotification('Address removed', 'info');
    }
  });
}

// Load saved addresses
function loadSavedAddresses(user) {
  const addressList = document.querySelector('.saved-addresses-list');
  if (!addressList) return;
  
  // Clear existing addresses
  addressList.innerHTML = '';
  
  // Check if user has addresses
  if (user.addresses && user.addresses.length > 0) {
    // Add each address to the list
    user.addresses.forEach(address => {
      const addressItem = document.createElement('div');
      addressItem.className = 'saved-address-item';
      addressItem.innerHTML = `
        <div class="saved-address-icon">
          <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="saved-address-details">
          <h4>${address.name}</h4>
          <p>${address.address}</p>
        </div>
        <div class="saved-address-actions">
          <button class="edit-address-btn" data-id="${address.id}" aria-label="Edit address">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="delete-address-btn" data-id="${address.id}" aria-label="Delete address">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      addressList.appendChild(addressItem);
    });
  } else {
    // Show empty state
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <div class="empty-state-icon">
        <i class="fas fa-map-signs"></i>
      </div>
      <h3>No saved addresses</h3>
      <p>Add your frequently visited locations for quicker booking.</p>
    `;
    addressList.appendChild(emptyState);
  }
}

// Load ride history
function loadRideHistory(user) {
  const historyList = document.querySelector('.ride-history-list');
  if (!historyList) return;
  
  // Demo data if no history available
  if (!user.rideHistory || user.rideHistory.length === 0) {
    const demoHistory = [
      {
        id: 'RIDE123456',
        date: '2025-05-25T14:30:00',
        pickup: '123 Main St, San Francisco, CA',
        destination: 'SFO Airport, San Francisco, CA',
        fare: 35.50,
        driver: 'Michael Johnson',
        rating: 5,
        vehicleType: 'Premium'
      },
      {
        id: 'RIDE123455',
        date: '2025-05-20T09:15:00',
        pickup: 'SFO Airport, San Francisco, CA',
        destination: '123 Main St, San Francisco, CA',
        fare: 32.75,
        driver: 'Sarah Williams',
        rating: 4,
        vehicleType: 'Economy'
      },
      {
        id: 'RIDE123454',
        date: '2025-05-15T18:45:00',
        pickup: '123 Main St, San Francisco, CA',
        destination: 'Golden Gate Park, San Francisco, CA',
        fare: 18.25,
        driver: 'David Lee',
        rating: 5,
        vehicleType: 'Standard'
      }
    ];
    
    // Save demo history to user
    user.rideHistory = demoHistory;
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  // Clear existing history
  historyList.innerHTML = '';
  
  // Add each ride to the list
  user.rideHistory.forEach(ride => {
    const rideDate = new Date(ride.date);
    
    const rideItem = document.createElement('div');
    rideItem.className = 'ride-history-item';
    rideItem.innerHTML = `
      <div class="ride-history-header">
        <div class="ride-history-id">
          <span class="label">Ride ID:</span>
          <span class="value">${ride.id}</span>
        </div>
        <div class="ride-history-date">
          <span class="label">Date:</span>
          <span class="value">${rideDate.toLocaleDateString()} at ${rideDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>
      <div class="ride-history-details">
        <div class="ride-route">
          <div class="route-point pickup">
            <i class="fas fa-circle location-icon pickup-icon"></i>
            <span>${ride.pickup}</span>
          </div>
          <div class="route-line"></div>
          <div class="route-point destination">
            <i class="fas fa-map-marker-alt location-icon destination-icon"></i>
            <span>${ride.destination}</span>
          </div>
        </div>
        <div class="ride-info">
          <div class="ride-driver">
            <span class="label">Driver:</span>
            <span class="value">${ride.driver}</span>
          </div>
          <div class="ride-type">
            <span class="label">Vehicle:</span>
            <span class="value">${ride.vehicleType}</span>
          </div>
          <div class="ride-fare">
            <span class="label">Fare:</span>
            <span class="value">$${ride.fare.toFixed(2)}</span>
          </div>
          <div class="ride-rating">
            <span class="label">Rating:</span>
            <div class="stars">
              ${getRatingStars(ride.rating)}
            </div>
          </div>
        </div>
      </div>
      <div class="ride-actions">
        <button class="btn btn-outline btn-sm">Get Receipt</button>
        <button class="btn btn-outline btn-sm">Report Issue</button>
        <button class="btn btn-outline btn-sm">Rebook</button>
      </div>
    `;
    historyList.appendChild(rideItem);
  });
}

// Load payment methods
function loadPaymentMethods(user) {
  const paymentList = document.querySelector('.payment-methods-list');
  if (!paymentList) return;
  
  // Demo data if no payment methods available
  if (!user.paymentMethods || user.paymentMethods.length === 0) {
    const demoPayments = [
      {
        id: 'pm_1',
        type: 'credit-card',
        brand: 'Visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2026,
        isDefault: true
      },
      {
        id: 'pm_2',
        type: 'credit-card',
        brand: 'Mastercard',
        last4: '5555',
        expMonth: 8,
        expYear: 2025,
        isDefault: false
      }
    ];
    
    // Save demo payment methods to user
    user.paymentMethods = demoPayments;
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  // Clear existing payment methods
  paymentList.innerHTML = '';
  
  // Add each payment method to the list
  user.paymentMethods.forEach(payment => {
    const paymentItem = document.createElement('div');
    paymentItem.className = `payment-method-item ${payment.isDefault ? 'default' : ''}`;
    
    // Set icon based on card type
    let cardIcon = 'fa-credit-card';
    if (payment.type === 'credit-card') {
      switch (payment.brand.toLowerCase()) {
        case 'visa':
          cardIcon = 'fa-cc-visa';
          break;
        case 'mastercard':
          cardIcon = 'fa-cc-mastercard';
          break;
        case 'amex':
          cardIcon = 'fa-cc-amex';
          break;
        case 'discover':
          cardIcon = 'fa-cc-discover';
          break;
        default:
          cardIcon = 'fa-credit-card';
      }
    } else if (payment.type === 'paypal') {
      cardIcon = 'fa-paypal';
    } else if (payment.type === 'apple-pay') {
      cardIcon = 'fa-apple-pay';
    } else if (payment.type === 'google-pay') {
      cardIcon = 'fa-google-pay';
    }
    
    paymentItem.innerHTML = `
      <div class="payment-method-icon">
        <i class="fab ${cardIcon}"></i>
      </div>
      <div class="payment-method-details">
        <h4>${payment.brand}</h4>
        <p>•••• ${payment.last4}</p>
        <p>Expires ${payment.expMonth}/${payment.expYear}</p>
        ${payment.isDefault ? '<span class="default-badge">Default</span>' : ''}
      </div>
      <div class="payment-method-actions">
        ${!payment.isDefault ? `
          <button class="set-default-payment-btn" data-id="${payment.id}" aria-label="Set as default">
            <i class="fas fa-check-circle"></i>
          </button>
        ` : ''}
        <button class="edit-payment-btn" data-id="${payment.id}" aria-label="Edit payment">
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button class="delete-payment-btn" data-id="${payment.id}" aria-label="Delete payment">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    paymentList.appendChild(paymentItem);
  });
  
  // Add event listeners for payment actions
  setupPaymentMethodActions();
}

// Setup payment method actions
function setupPaymentMethodActions() {
  const paymentList = document.querySelector('.payment-methods-list');
  if (!paymentList) return;
  
  // Event delegation
  paymentList.addEventListener('click', (e) => {
    // Handle setting default payment method
    const defaultButton = e.target.closest('.set-default-payment-btn');
    if (defaultButton) {
      const paymentId = defaultButton.getAttribute('data-id');
      setDefaultPaymentMethod(paymentId);
      return;
    }
    
    // Handle deleting payment method
    const deleteButton = e.target.closest('.delete-payment-btn');
    if (deleteButton) {
      const paymentId = deleteButton.getAttribute('data-id');
      deletePaymentMethod(paymentId);
      return;
    }
  });
}

// Set default payment method
function setDefaultPaymentMethod(paymentId) {
  // Get user data
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (user.paymentMethods) {
    // Update default status
    user.paymentMethods = user.paymentMethods.map(payment => {
      return {
        ...payment,
        isDefault: payment.id === paymentId
      };
    });
    
    // Save updated user
    localStorage.setItem('user', JSON.stringify(user));
    
    // Refresh payment methods display
    loadPaymentMethods(user);
    
    showNotification('Default payment method updated', 'success');
  }
}

// Delete payment method
function deletePaymentMethod(paymentId) {
  // Get user data
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (user.paymentMethods) {
    // Check if attempting to delete the default method
    const isDefault = user.paymentMethods.some(p => p.id === paymentId && p.isDefault);
    if (isDefault) {
      showNotification('Cannot delete default payment method.', 'error');
      return;
    }
    
    // Remove payment method
    user.paymentMethods = user.paymentMethods.filter(p => p.id !== paymentId);
    
    // Save updated user
    localStorage.setItem('user', JSON.stringify(user));
    
    // Refresh payment methods display
    loadPaymentMethods(user);
    
    showNotification('Payment method removed', 'info');
  }
}

// Setup profile tabs
function setupProfileTabs() {
  const tabButtons = document.querySelectorAll('.profile-tab-btn');
  const tabContents = document.querySelectorAll('.profile-tab-content');
  
  if (!tabButtons.length || !tabContents.length) return;
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Get the target tab
      const targetTab = button.getAttribute('data-tab');
      
      // Remove active class from all tabs
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to selected tab
      button.classList.add('active');
      document.querySelector(`.profile-tab-content[data-tab="${targetTab}"]`).classList.add('active');
      
      // Update URL hash for direct linking
      window.location.hash = targetTab;
    });
  });
  
  // Check for hash in URL to set active tab
  const hash = window.location.hash.replace('#', '');
  if (hash && document.querySelector(`.profile-tab-btn[data-tab="${hash}"]`)) {
    document.querySelector(`.profile-tab-btn[data-tab="${hash}"]`).click();
  } else {
    // Default to first tab
    tabButtons[0].click();
  }
}

// Load user preferences
function loadUserPreferences(user) {
  // Set theme preference
  const themeSwitch = document.getElementById('theme-preference');
  if (themeSwitch && user.darkMode !== undefined) {
    themeSwitch.checked = user.darkMode;
  }
  
  // Set notification preferences
  const notifToggles = document.querySelectorAll('[data-notif-type]');
  notifToggles.forEach(toggle => {
    const type = toggle.getAttribute('data-notif-type');
    if (user.notifications && user.notifications[type] !== undefined) {
      toggle.checked = user.notifications[type];
    }
  });
}

// Initialize profile dropdown in header
function initProfileDropdown() {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.isLoggedIn) return;
  
  // Create profile dropdown toggle
  const navButtons = document.querySelector('.nav-buttons');
  if (navButtons) {
    // Check if profile dropdown already exists
    if (document.querySelector('.profile-dropdown-toggle')) return;
    
    // Create profile dropdown toggle
    const dropdownToggle = document.createElement('div');
    dropdownToggle.className = 'profile-dropdown-toggle';
    dropdownToggle.innerHTML = `
      <div class="user-avatar">
        ${user.photoUrl 
          ? `<img src="${user.photoUrl}" alt="${user.name}">`
          : `<div class="avatar-placeholder">${getInitials(user.name || 'User')}</div>`
        }
      </div>
    `;
    
    // Create dropdown menu
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'profile-dropdown-menu';
    dropdownMenu.innerHTML = `
      <div class="profile-dropdown-header">
        <div class="profile-dropdown-user">
          <div class="user-avatar">
            ${user.photoUrl 
              ? `<img src="${user.photoUrl}" alt="${user.name}">`
              : `<div class="avatar-placeholder">${getInitials(user.name || 'User')}</div>`
            }
          </div>
          <div class="user-info">
            <h4>${user.name || 'User'}</h4>
            <p>${user.email || ''}</p>
          </div>
        </div>
      </div>
      <div class="profile-dropdown-body">
        <a href="profile.html" class="profile-dropdown-item">
          <i class="fas fa-user"></i>
          <span>My Profile</span>
        </a>
        <a href="history.html" class="profile-dropdown-item">
          <i class="fas fa-history"></i>
          <span>Trip History</span>
        </a>
        <a href="payments.html" class="profile-dropdown-item">
          <i class="fas fa-credit-card"></i>
          <span>Payment Methods</span>
        </a>
        <a href="settings.html" class="profile-dropdown-item">
          <i class="fas fa-cog"></i>
          <span>Settings</span>
        </a>
        <button class="profile-dropdown-item logout-btn">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    `;
    
    // Append dropdown toggle to nav buttons
    navButtons.appendChild(dropdownToggle);
    
    // Append dropdown menu
    document.body.appendChild(dropdownMenu);
    
    // Toggle dropdown
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('active');
      
      // Position dropdown below toggle
      const rect = dropdownToggle.getBoundingClientRect();
      dropdownMenu.style.top = `${rect.bottom}px`;
      dropdownMenu.style.right = `${window.innerWidth - rect.right}px`;
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      dropdownMenu.classList.remove('active');
    });
    
    // Prevent clicks inside dropdown from closing it
    dropdownMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    // Handle logout click
    const logoutBtn = dropdownMenu.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.authFunctions?.logout();
      });
    }
  }
}

// Helper: Get user initials
function getInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Helper: Get rating stars HTML
function getRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let starsHtml = '';
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star"></i>';
  }
  
  // Add half star if needed
  if (halfStar) {
    starsHtml += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star"></i>';
  }
  
  return starsHtml;
}

// Show notification (reused from auth.js)
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