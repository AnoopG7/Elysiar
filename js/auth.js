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
  
  // Add input validation listeners to all required inputs
  document.querySelectorAll('input[required]').forEach(input => {
    input.addEventListener('blur', () => validateInput(input));
  });
  
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Validate all inputs before submission
      const inputs = loginForm.querySelectorAll('input[required]');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });
      
      if (isValid) {
        // Simulate login only if form is valid
        simulateLogin(email, password);
      }
    });
  }
  
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validate all inputs before submission
      const allInputs = signupForm.querySelectorAll('input[required]');
      let isValid = true;
      
      allInputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });
      
      if (isValid) {
        // Simulate signup only if form is valid
        simulateSignup();
      }
    });
    
    // Special handling for password strength
    const passwordInput = document.getElementById('signup-password');
    if (passwordInput) {
      passwordInput.addEventListener('input', () => {
        const strength = calculatePasswordStrength(passwordInput.value);
        // Provide feedback if password is weak
        if (strength.percentage < 50) {
          showInputError(passwordInput, 'Password is too weak - add uppercase, lowercase, numbers, and special characters');
        } else {
          clearInputError(passwordInput);
        }
      });
    }
  }
}

// Setup signup form steps
function setupSignupSteps() {
  const nextButtons = document.querySelectorAll('.next-step');
  const prevButtons = document.querySelectorAll('.prev-step');
  
  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentStep = parseInt(button.closest('.signup-form-step').getAttribute('data-step'));
      const nextStep = parseInt(button.getAttribute('data-next'));
      
      // Use our enhanced validation before proceeding to next step
      const stepElement = document.querySelector(`.signup-form-step[data-step="${currentStep}"]`);
      if (!stepElement) return;
      
      // Get all required inputs in this step
      const inputs = stepElement.querySelectorAll('input[required], select[required]');
      let isValid = true;
      
      // Validate each input
      inputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });
      
      // Only proceed if all inputs are valid
      if (isValid) {
        goToStep(nextStep);
      } else {
        // Add shake animation to the step container to indicate validation error
        stepElement.classList.add('shake');
        setTimeout(() => {
          stepElement.classList.remove('shake');
        }, 500);
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

// Validate individual input
function validateInput(input) {
  const value = input.value.trim();
  const id = input.id;
  
  // Check if empty first (required fields)
  if (!value) {
    showInputError(input, 'This field is required');
    return false;
  }
  
  // Email validation
  if (id === 'email' || id === 'signup-email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showInputError(input, 'Please enter a valid email address');
      return false;
    }
  }
  
  // Password validation
  if (id === 'password') {
    if (value.length < 8) {
      showInputError(input, 'Password must be at least 8 characters long');
      return false;
    }
  }
  
  // Password strength for signup
  if (id === 'signup-password') {
    const strength = calculatePasswordStrength(value);
    if (strength.percentage < 50) {
      showInputError(input, 'Password is too weak - use a stronger password');
      return false;
    }
  }
  
  // Phone validation
  if (id === 'signup-phone') {
    // Allow common phone formats with optional country code
    const phoneRegex = /^(\+\d{1,3}[\s.-]?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/;
    if (!phoneRegex.test(value)) {
      showInputError(input, 'Please enter a valid phone number');
      return false;
    }
  }
  
  // Name validation
  if (id === 'first-name' || id === 'last-name') {
    const nameRegex = /^[A-Za-z\s'-]+$/;
    if (!nameRegex.test(value)) {
      showInputError(input, 'Names should only contain letters, spaces, hyphens and apostrophes');
      return false;
    }
  }
  
  // Date of birth validation
  if (id === 'birth-date') {
    const today = new Date();
    const birthDate = new Date(value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 13) {
      showInputError(input, 'You must be at least 18 years old to sign up');
      return false;
    }
    
    if (birthDate > today) {
      showInputError(input, 'Birth date cannot be in the future');
      return false;
    }
  }
  
  // Terms checkbox validation
  if (id === 'terms') {
    if (!input.checked) {
      const errorMsg = document.createElement('div');
      errorMsg.classList.add('form-error');
      errorMsg.textContent = 'You must agree to the terms';
      
      // Check if error already exists
      const existingError = input.parentNode.parentNode.querySelector('.form-error');
      if (!existingError) {
        input.parentNode.parentNode.appendChild(errorMsg);
      }
      return false;
    } else {
      // Remove any existing error
      const existingError = input.parentNode.parentNode.querySelector('.form-error');
      if (existingError) existingError.remove();
    }
  }
  
  // Clear any previous errors if all validations passed
  clearInputError(input);
  return true;
}

// Show input error
function showInputError(input, message) {
  input.classList.add('input-error');
  
  // Check if input is inside an input-with-icon div
  const parentElement = input.closest('.input-with-icon') || input.parentElement;
  
  // Check if error message already exists
  let errorElement = parentElement.nextElementSibling;
  if (!errorElement || !errorElement.classList.contains('form-error')) {
    // Create new error message
    errorElement = document.createElement('div');
    errorElement.classList.add('form-error');
    parentElement.parentNode.insertBefore(errorElement, parentElement.nextSibling);
  }
  
  errorElement.textContent = message;
}

// Clear input error
function clearInputError(input) {
  input.classList.remove('input-error');
  
  // Check if input is inside an input-with-icon div
  const parentElement = input.closest('.input-with-icon') || input.parentElement;
  
  // Find and remove error message if it exists
  const errorElement = parentElement.nextElementSibling;
  if (errorElement && errorElement.classList.contains('form-error')) {
    errorElement.remove();
  }
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Add icon based on type
  const icon = document.createElement('i');
  
  if (type === 'success') {
    icon.className = 'fas fa-check-circle';
  } else if (type === 'error') {
    icon.className = 'fas fa-exclamation-circle';
  } else if (type === 'warning') {
    icon.className = 'fas fa-exclamation-triangle';
  } else {
    icon.className = 'fas fa-info-circle';
  }
  
  notification.insertBefore(icon, notification.firstChild);
  
  // Add to the document
  document.body.appendChild(notification);
  
  // Add active class to trigger animation
  setTimeout(() => {
    notification.classList.add('active');
  }, 10);
  
  // Remove after 4 seconds
  setTimeout(() => {
    notification.classList.remove('active');
    
    // Remove from DOM after fade out
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 4000);
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
  
  // Make sure timer is visible and button is hidden
  document.querySelector('.resend-timer').style.display = 'inline-block';
  resendButton.style.display = 'none';
  
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
    const language = document.getElementById('language')?.value || 'en';
    const currency = document.getElementById('currency')?.value || 'inr';
    const notifications = document.getElementById('notifications')?.checked || false;
    const locationServices = document.getElementById('location')?.checked || false;
    
    // Store user info in localStorage to simulate being logged in
    const user = {
      email: email,
      name: `${firstName} ${lastName}`,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phone,
      birthDate: birthDate,
      language: language,
      currency: currency,
      notifications: notifications,
      locationServices: locationServices,
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
    
    // Show success notification
    showNotification('Account created successfully!', 'success');
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  }, 1500);
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
    
    // Show success notification
    showNotification('Logged in successfully!', 'success');
    
    // Redirect to dashboard or specified page after a short delay
    setTimeout(() => {
      if (redirectPage) {
        window.location.href = redirectPage;
      } else {
        window.location.href = 'dashboard.html';
      }
    }, 1000);
  }, 1500);
}
