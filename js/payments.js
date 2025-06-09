// Payments Page JavaScript for Elysiar

document.addEventListener('DOMContentLoaded', function() {
    initializePaymentPage();
});

function initializePaymentPage() {
    setupCardNumberInput();
    setupPaymentMethodSelection();
    setupAddCardButton();
    setupFormValidation();
}

// Format and validate card number input
function setupCardNumberInput() {
    const cardNumberInput = document.getElementById('card-number');
    const cardTypeIndicator = document.querySelector('.card-type-indicator i');
    
    if (!cardNumberInput || !cardTypeIndicator) return;

    cardNumberInput.addEventListener('input', function(e) {
        // Format the card number with spaces
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
        
        // Detect card type and update indicator
        if (value.startsWith('4')) {
            cardTypeIndicator.className = 'fab fa-cc-visa';
        } else if (/^5[1-5]/.test(value)) {
            cardTypeIndicator.className = 'fab fa-cc-mastercard';
        } else if (/^3[47]/.test(value)) {
            cardTypeIndicator.className = 'fab fa-cc-amex';
        } else {
            cardTypeIndicator.className = 'far fa-credit-card';
        }
    });
}

// Handle payment method selection
function setupPaymentMethodSelection() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function(e) {
            // Don't select if clicking on action buttons
            if (e.target.closest('.payment-actions')) {
                return;
            }
            
            // Toggle active class
            paymentMethods.forEach(m => m.classList.remove('active'));
            method.classList.add('active');
            
            // Show visual feedback
            showNotification('Payment method selected', 'success');
        });
    });
}

// Add new card button functionality
function setupAddCardButton() {
    const addCardBtn = document.querySelector('.add-card-btn');
    
    if (!addCardBtn) return;
    
    addCardBtn.addEventListener('click', function() {
        // Validate form (simplified)
        const cardName = document.getElementById('card-name').value;
        const cardNumber = document.getElementById('card-number').value;
        
        if (!cardName || !cardNumber) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Simulate success (in real app would submit to server)
        showNotification('Card added successfully', 'success');
        
        // Reset form
        setTimeout(() => {
            document.querySelectorAll('.payment-form .input-field').forEach(input => {
                input.value = '';
            });
            document.getElementById('set-default').checked = false;
        }, 1500);
    });
}

// Simple form validation
function setupFormValidation() {
    const inputs = document.querySelectorAll('.payment-form .input-field');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(input);
        });
    });
}

function validateInput(input) {
    if (!input.value.trim()) {
        input.classList.add('error');
        const formGroup = input.closest('.form-group');
        
        // Add error message if it doesn't exist
        if (!formGroup.querySelector('.error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'This field is required';
            formGroup.appendChild(errorMsg);
        }
        
        return false;
    } else {
        input.classList.remove('error');
        const errorMsg = input.closest('.form-group').querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
        return true;
    }
}

// Show notification toast
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = document.createElement('i');
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
    } else {
        icon.className = 'fas fa-info-circle';
    }
    
    const text = document.createElement('span');
    text.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(text);
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
