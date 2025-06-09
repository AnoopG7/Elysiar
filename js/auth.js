/* Authentication JavaScript for Ride-Hailing Website */

// Check server environment
const authServerInfo = {
  currentPort: window.location.port,
  isLiveServer: window.location.port === '5501',
  isPythonServer: window.location.port === '8000',
  currentPath: window.location.pathname
};

console.log('Auth.js - Server info:', authServerInfo);

document.addEventListener('DOMContentLoaded', () => {
  // Fix navigation paths based on server
  fixAuthNavigationPaths();
  
  // Initialize authentication functionality
  initAuthFunctionality();
  
  // Update UI based on auth status
  updateAuthUI();
  
  // Check if we need to redirect
  handleAuthRedirects();
});

// Fix paths based on the current server
function fixAuthNavigationPaths() {
  if (authServerInfo.isLiveServer) {
    console.log('Auth.js - Fixing navigation paths for Live Server');
    
    // Fix links in auth pages for Live Server
    document.querySelectorAll('.auth-footer a, .forgot-password').forEach(link => {
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (href && href.includes('.html')) {
        const filename = href.substring(href.lastIndexOf('/') + 1);
        link.setAttribute('href', `./${filename}`);
        console.log(`Auth.js - Fixed link: ${href} → ./${filename}`);
      }
    });
  }
};

// Initialize all authentication functionality
function initAuthFunctionality() {
  // Setup password toggle
  setupPasswordToggle();
  
  // Setup password strength meter
  setupPasswordStrength();
  
  // Setup form validation
  setupFormValidation();
  
  // Setup signup form steps
  setupSignupSteps();
  
  // Setup verification code input
  setupVerificationCodeInput();
  
  // Setup resend code timer
  setupResendCodeTimer();
}

// Toggle password visibility
function setupPasswordToggle() {
  const toggleButtons = document.querySelectorAll('.password-toggle');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const input = button.previousElementSibling;
      const icon = button.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
}

// Password strength meter
function setupPasswordStrength() {
  const passwordInput = document.getElementById('signup-password');
  if (!passwordInput) return;
  
  const strengthMeter = document.querySelector('.strength-meter-fill');
  const strengthText = document.getElementById('password-strength-text');
  
  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const strength = calculatePasswordStrength(password);
    
    // Update strength meter
    strengthMeter.style.width = `${strength.percentage}%`;
    
    // Update strength text and class
    strengthText.textContent = strength.label;
    
    // Remove all strength classes
    document.querySelector('.password-strength').className = 'password-strength';
    
    // Add appropriate strength class
    document.querySelector('.password-strength').classList.add(`strength-${strength.label.toLowerCase()}`);
  });
}

// Calculate password strength
function calculatePasswordStrength(password) {
  // Empty password
  if (!password) {
    return { percentage: 0, label: 'Weak' };
  }
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 25;
  
  // Contains lowercase letters
  if (/[a-z]/.test(password)) strength += 25;
  
  // Contains uppercase letters
  if (/[A-Z]/.test(password)) strength += 25;
  
  // Contains numbers or special characters
  if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
  
  // Determine label based on strength
  let label = 'Weak';
  if (strength >= 100) label = 'Strong';
  else if (strength >= 75) label = 'Good';
  else if (strength >= 50) label = 'Fair';
  
  return { percentage: strength, label };
}

// Form validation
function setupFormValidation() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Simulate login
      simulateLogin(email, password);
    });
  }
  
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate signup
      simulateSignup();
    });
  }
}

// Simulate login
function simulateLogin(email, password) {
  // Show loading state
  const submitButton = document.querySelector('#login-form button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
  
  // Simulate API call delay
  setTimeout(() => {
    // For demo purposes, any credentials will work
    // In a real app, this would validate against a backend
    
    // Get redirect param from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPage = urlParams.get('redirect');
    
    // Create a more complete demo user profile
    const user = {
      email,
      name: 'John Doe',
      isLoggedIn: true,
      createdAt: '2024-01-15T12:00:00',
      phoneNumber: '+1 (555) 123-4567',
      rating: 4.9,
      loyaltyPoints: 240,
      photoUrl: '' // No photo by default
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    
    // Redirect to dashboard or specified page
    if (redirectPage) {
      window.location.href = redirectPage;
    } else {
      window.location.href = 'dashboard.html';
    }
  }, 1500);
}

// Simulate signup
function simulateSignup() {
  // Show loading state
  const submitButton = document.querySelector('#signup-form button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
  
  // Simulate API call delay
  setTimeout(() => {
    // For demo purposes, any input will work
    // In a real app, this would send data to a backend
    
    // Get values from form
    const email = document.getElementById('signup-email').value;
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const phone = document.getElementById('signup-phone').value;
    const birthDate = document.getElementById('birth-date')?.value || '';
    
    // Store user info in localStorage to simulate being logged in
    const user = {
      email: email,
      name: `${firstName} ${lastName}`,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phone,
      birthDate: birthDate,
      isLoggedIn: true,
      createdAt: new Date().toISOString(),
      rating: 5.0, // New users start with perfect rating
      loyaltyPoints: 50, // Welcome bonus
      // Add demo addresses
      addresses: [
        {
          id: 'addr_1',
          name: 'Home',
          address: '123 Main St, San Francisco, CA'
        },
        {
          id: 'addr_2',
          name: 'Work',
          address: '456 Market St, San Francisco, CA'
        }
      ],
      // Add demo payment method
      paymentMethods: [
        {
          id: 'pm_1',
          type: 'credit-card',
          brand: 'Visa',
          last4: '4242',
          expMonth: 12,
          expYear: 2026,
          isDefault: true
        }
      ]
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
  }, 1500);
}

// Setup signup form steps
function setupSignupSteps() {
  const nextButtons = document.querySelectorAll('.next-step');
  const prevButtons = document.querySelectorAll('.prev-step');
  
  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentStep = parseInt(button.closest('.signup-form-step').getAttribute('data-step'));
      const nextStep = parseInt(button.getAttribute('data-next'));
      
      // Validate current step before proceeding
      if (validateStep(currentStep)) {
        goToStep(nextStep);
      }
    });
  });
  
  prevButtons.forEach(button => {
    button.addEventListener('click', () => {
      const prevStep = parseInt(button.getAttribute('data-prev'));
      goToStep(prevStep);
    });
  });
}

// Validate form step
function validateStep(step) {
  const stepElement = document.querySelector(`.signup-form-step[data-step="${step}"]`);
  if (!stepElement) return true;
  
  const inputs = stepElement.querySelectorAll('input[required], select[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add('input-error');
      
      // Add error message if it doesn't exist
      let errorMessage = input.nextElementSibling;
      if (!errorMessage || !errorMessage.classList.contains('form-error')) {
        errorMessage = document.createElement('div');
        errorMessage.classList.add('form-error');
        errorMessage.textContent = 'This field is required';
        input.parentNode.appendChild(errorMessage);
      }
    } else {
      input.classList.remove('input-error');
      
      // Remove error message if it exists
      const errorMessage = input.nextElementSibling;
      if (errorMessage && errorMessage.classList.contains('form-error')) {
        errorMessage.remove();
      }
    }
  });
  
  // Special validation for step 1
  if (step === 1) {
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox && !termsCheckbox.checked) {
      isValid = false;
      termsCheckbox.classList.add('input-error');
      
      // Add error message if it doesn't exist
      let errorMessage = termsCheckbox.parentNode.nextElementSibling;
      if (!errorMessage || !errorMessage.classList.contains('form-error')) {
        errorMessage = document.createElement('div');
        errorMessage.classList.add('form-error');
        errorMessage.textContent = 'You must agree to the terms';
        termsCheckbox.parentNode.parentNode.appendChild(errorMessage);
      }
    } else if (termsCheckbox) {
      termsCheckbox.classList.remove('input-error');
      
      // Remove error message if it exists
      const errorMessage = termsCheckbox.parentNode.nextElementSibling;
      if (errorMessage && errorMessage.classList.contains('form-error')) {
        errorMessage.remove();
      }
    }
  }
  
  return isValid;
}

// Go to specified step
function goToStep(step) {
  // Hide all steps
  document.querySelectorAll('.signup-form-step').forEach(el => {
    el.classList.remove('active');
  });
  
  // Show target step
  document.querySelector(`.signup-form-step[data-step="${step}"]`).classList.add('active');
  
  // Update progress indicators
  document.querySelectorAll('.progress-step').forEach(el => {
    const stepNum = parseInt(el.getAttribute('data-step'));
    
    el.classList.remove('active', 'completed');
    
    if (stepNum === step) {
      el.classList.add('active');
    } else if (stepNum < step) {
      el.classList.add('completed');
    }
  });
  
  // If step is 3, start the verification code timer
  if (step === 3) {
    startResendTimer();
  }
}

// Setup verification code input
function setupVerificationCodeInput() {
  const codeInputs = document.querySelectorAll('.code-input');
  if (codeInputs.length === 0) return;
  
  codeInputs.forEach((input, index) => {
    // Focus first input on load
    if (index === 0) {
      input.addEventListener('focus', function() {
        this.select();
      });
    }
    
    // Handle input
    input.addEventListener('input', function() {
      // Only allow numbers
      this.value = this.value.replace(/[^0-9]/g, '');
      
      // Auto focus next input
      if (this.value && index < codeInputs.length - 1) {
        codeInputs[index + 1].focus();
      }
    });
    
    // Handle backspace
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Backspace' && !this.value && index > 0) {
        codeInputs[index - 1].focus();
      }
    });
    
    // Handle paste
    input.addEventListener('paste', function(e) {
      e.preventDefault();
      
      // Get pasted data
      const pastedData = (e.clipboardData || window.clipboardData).getData('text');
      
      // Only use numbers
      const numbers = pastedData.replace(/[^0-9]/g, '').split('');
      
      // Fill inputs with pasted numbers
      codeInputs.forEach((input, i) => {
        if (numbers[i]) {
          input.value = numbers[i];
        }
      });
      
      // Focus last filled input or next empty input
      const lastFilledIndex = Math.min(numbers.length - 1, codeInputs.length - 1);
      codeInputs[lastFilledIndex].focus();
    });
  });
}

// Setup resend code timer
function setupResendCodeTimer() {
  const resendButton = document.getElementById('resend-button');
  if (!resendButton) return;
  
  resendButton.addEventListener('click', () => {
    // Simulate resending code
    resendButton.disabled = true;
    resendButton.textContent = 'Sending...';
    
    setTimeout(() => {
      resendButton.textContent = 'Resend Code';
      startResendTimer();
      
      // Show notification
      showNotification('Verification code resent!', 'success');
    }, 1500);
  });
}

// Start resend timer
function startResendTimer() {
  const timerElement = document.getElementById('timer');
  const resendButton = document.getElementById('resend-button');
  if (!timerElement || !resendButton) return;
  
  let seconds = 60;
  timerElement.textContent = seconds;
  
  const timerInterval = setInterval(() => {
    seconds--;
    timerElement.textContent = seconds;
    
    if (seconds <= 0) {
      clearInterval(timerInterval);
      
      // Hide timer, show button
      document.querySelector('.resend-timer').style.display = 'none';
      resendButton.disabled = false;
      resendButton.style.display = 'inline-block';
    }
  }, 1000);
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

// Check if user is logged in
function checkAuth() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (user.isLoggedIn) {
    // User is logged in
    return true;
  } else {
    // User is not logged in
    return false;
  }
}

// Update UI based on authentication status
function updateAuthUI() {
  const isLoggedIn = checkAuth();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Get all auth button sections
  const authButtonSections = document.querySelectorAll('.nav-buttons, .mobile-nav-buttons');
  
  if (isLoggedIn && user.name) {
    // Replace login/signup buttons with user info
    authButtonSections.forEach(section => {
      // Skip if this section has already been processed
      if (section.querySelector('.user-profile-button')) return;
      
      // Clear existing buttons
      section.innerHTML = '';
      
      // Add user profile button
      const userButton = document.createElement('div');
      userButton.className = 'user-profile-button';
      userButton.innerHTML = `
        <span class="user-greeting">Hello, ${user.name.split(' ')[0]}</span>
        <div class="user-avatar">
          ${user.photoUrl 
            ? `<img src="${user.photoUrl}" alt="${user.name}">`
            : `<div class="avatar-placeholder">${user.name.charAt(0)}</div>`
          }
        </div>
      `;
      
      // Add the button
      section.appendChild(userButton);
      
      // Add logout button
      const logoutButton = document.createElement('button');
      logoutButton.className = 'btn btn-outline logout-btn';
      logoutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
      logoutButton.addEventListener('click', logout);
      section.appendChild(logoutButton);
    });
  }
}

// Logout function
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// Handle redirections based on auth status
function handleAuthRedirects() {
  const isLoggedIn = checkAuth();
  const currentPath = window.location.pathname;
  
  // Get page name from path
  const pageName = currentPath.split('/').pop();
  
  // Protected pages (require login)
  const protectedPages = [
    'profile.html',
    'history.html',
    'settings.html',
    'payments.html'
  ];
  
  // Auth pages (already logged in users should be redirected away)
  const authPages = [
    'login.html',
    'signup.html'
  ];
  
  // If not logged in and trying to access protected page
  if (!isLoggedIn && protectedPages.includes(pageName)) {
    // Store intended destination for after login
    localStorage.setItem('redirectAfterLogin', pageName);
    // Redirect to login
    window.location.href = 'login.html?redirect=' + encodeURIComponent(pageName);
    return;
  }
  
  // If logged in and trying to access auth pages
  if (isLoggedIn && authPages.includes(pageName)) {
    // If there was a stored redirect, use it
    const redirectTo = localStorage.getItem('redirectAfterLogin');
    if (redirectTo) {
      localStorage.removeItem('redirectAfterLogin');
      window.location.href = redirectTo;
    } else {
      // Default redirect to home
      window.location.href = 'index.html';
    }
    return;
  }
}

// Expose functions to global scope
window.authFunctions = {
  checkAuth,
  logout,
  updateAuthUI
};
