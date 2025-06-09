/* Settings JavaScript for Elysiar Ride-Hailing Application */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize settings functionality
    initSettings();
});

/**
 * Initialize all settings functionality
 */
function initSettings() {
    // Initialize the settings navigation
    initSettingsNavigation();

    // Initialize all toggle switches
    initToggleSwitches();

    // Load saved settings
    loadSavedSettings();

    // Add event listeners to settings form elements
    addSettingsEventListeners();

    // Initialize tab content visibility
    showActiveSettingsSection();
}

/**
 * Initialize the settings navigation functionality
 */
function initSettingsNavigation() {
    const navLinks = document.querySelectorAll('.settings-nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show the corresponding section
            const sectionId = this.getAttribute('href').substring(1);
            showSettingsSection(sectionId);
            
            // Save the active section to localStorage
            saveActiveSectionPreference(sectionId);
            
            // Scroll to the section (especially important on mobile)
            scrollToSection(sectionId);
        });
    });
}

/**
 * Scroll to a specific settings section
 * @param {string} sectionId - The ID of the section to scroll to
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Account for the fixed header
        const headerHeight = document.getElementById('header').offsetHeight;
        const topOffset = section.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
            top: topOffset,
            behavior: 'smooth'
        });
    }
}

/**
 * Initialize toggle switches functionality
 */
function initToggleSwitches() {
    const toggleSwitches = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
    
    toggleSwitches.forEach(toggle => {
        // Skip the dark mode toggle as it's handled separately
        if (toggle.id === 'dark-mode-toggle') return;
        
        toggle.addEventListener('change', function() {
            const settingName = getSwitchSettingName(this);
            saveSettingToLocalStorage(settingName, this.checked);
        });
    });
}

/**
 * Get the setting name from a toggle switch element
 * @param {HTMLElement} toggleElement - The toggle switch input element
 * @returns {string} The setting name
 */
function getSwitchSettingName(toggleElement) {
    // Get the closest toggle-switch-container parent
    const container = toggleElement.closest('.toggle-switch-container');
    if (!container) return 'unknown-setting';
    
    // Get the label text
    const label = container.querySelector('.toggle-label');
    if (!label) return 'unknown-setting';
    
    // Convert label text to camelCase setting name
    return convertToCamelCase(label.textContent.trim());
}

/**
 * Convert a string to camelCase (for use as setting names)
 * @param {string} str - The string to convert
 * @returns {string} The camelCase string
 */
function convertToCamelCase(str) {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

/**
 * Load all saved settings from localStorage and apply them
 */
function loadSavedSettings() {
    // Get all settings from localStorage
    const settings = getAllSettings();
    
    // Apply settings to UI elements
    applySettingsToUI(settings);
    
    // Apply functional settings
    applyAccessibilitySettings(settings);
}

/**
 * Get all settings from localStorage
 * @returns {Object} An object containing all settings
 */
function getAllSettings() {
    const settings = {};
    
    // Get dark mode setting
    settings.darkMode = localStorage.getItem('darkMode') === 'true';
    
    // Get all other settings with 'elysiar_setting_' prefix
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('elysiar_setting_')) {
            const settingName = key.replace('elysiar_setting_', '');
            const value = localStorage.getItem(key) === 'true';
            settings[settingName] = value;
        }
    }
    
    return settings;
}

/**
 * Apply saved settings to the UI elements
 * @param {Object} settings - An object containing all settings
 */
function applySettingsToUI(settings) {
    // Apply each setting to its corresponding UI element
    Object.keys(settings).forEach(setting => {
        // Skip dark mode as it's handled separately
        if (setting === 'darkMode') return;
        
        // Find the toggle switch for this setting
        const toggle = findToggleSwitchBySetting(setting);
        if (toggle) {
            toggle.checked = settings[setting];
        }
    });
    
    // Apply dark mode setting separately
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.checked = settings.darkMode || false;
    }
    
    // Load active section preference
    loadActiveSection();
}

/**
 * Find a toggle switch element by setting name
 * @param {string} settingName - The name of the setting
 * @returns {HTMLElement|null} The toggle switch input element or null if not found
 */
function findToggleSwitchBySetting(settingName) {
    // Convert camelCase setting name to regular text for matching
    const settingText = settingName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, function(str) { return str.toUpperCase(); });
    
    // Find all toggle labels
    const toggleLabels = document.querySelectorAll('.toggle-label');
    
    // Find the label that matches our setting
    for (const label of toggleLabels) {
        if (label.textContent.trim() === settingText) {
            // Return the associated toggle input
            const container = label.closest('.toggle-switch-container');
            return container ? container.querySelector('input[type="checkbox"]') : null;
        }
    }
    
    return null;
}

/**
 * Save a setting to localStorage
 * @param {string} settingName - The name of the setting
 * @param {boolean} value - The value of the setting
 */
function saveSettingToLocalStorage(settingName, value) {
    // Store with prefix to avoid conflicts with other settings
    localStorage.setItem(`elysiar_setting_${settingName}`, value);
    
    // Apply any immediate effects based on the setting
    applySettingEffect(settingName, value);
}

/**
 * Apply any immediate effects when a setting changes
 * @param {string} settingName - The name of the setting
 * @param {boolean} value - The value of the setting
 */
function applySettingEffect(settingName, value) {
    // Handle specific settings that need immediate effects
    switch(settingName) {
        case 'mapAnimation':
            // Update any active maps with new animation setting
            const mapEvent = new CustomEvent('mapAnimationSettingChanged', { 
                detail: { enabled: value } 
            });
            document.dispatchEvent(mapEvent);
            break;
            
        case 'rideHistorySync':
            // Trigger sync if enabled
            if (value) {
                const syncEvent = new CustomEvent('syncRideHistory');
                document.dispatchEvent(syncEvent);
            }
            break;
            
        case 'reducedMotion':
            applyReducedMotion(value);
            break;
            
        case 'highContrast':
            applyHighContrast(value);
            break;
            
        case 'screenReader':
            applyScreenReaderOptimizations(value);
            break;
            
        // Add more cases as needed for other settings
    }
}

/**
 * Apply reduced motion setting
 * @param {boolean} enabled - Whether reduced motion is enabled
 */
function applyReducedMotion(enabled) {
    if (!document.getElementById('reduced-motion-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'reduced-motion-styles';
        document.head.appendChild(styleEl);
    }
    
    const styleEl = document.getElementById('reduced-motion-styles');
    
    if (enabled) {
        styleEl.textContent = `
            * {
                animation-duration: 0.001s !important;
                transition-duration: 0.001s !important;
            }
        `;
    } else {
        styleEl.textContent = '';
    }
    
    // Add class to body for additional CSS targeting if needed
    if (enabled) {
        document.body.classList.add('reduced-motion');
    } else {
        document.body.classList.remove('reduced-motion');
    }
}

/**
 * Apply high contrast setting
 * @param {boolean} enabled - Whether high contrast is enabled
 */
function applyHighContrast(enabled) {
    if (!document.getElementById('high-contrast-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'high-contrast-styles';
        document.head.appendChild(styleEl);
    }
    
    const styleEl = document.getElementById('high-contrast-styles');
    
    if (enabled) {
        styleEl.textContent = `
            body {
                --text-primary: #000000;
                --text-secondary: #000000;
                --background-color: #ffffff;
                --surface-color: #ffffff;
                --border-color: #000000;
                --primary-blue: #0000ee;
                --primary-green: #008000;
                --primary-red: #ee0000;
                --shadow-sm: none;
                --shadow-md: none;
                --shadow-lg: none;
            }
            
            body.dark-mode {
                --text-primary: #ffffff;
                --text-secondary: #ffffff;
                --background-color: #000000;
                --surface-color: #000000;
                --border-color: #ffffff;
                --shadow-sm: none;
                --shadow-md: none;
                --shadow-lg: none;
            }
            
            * {
                border-color: var(--border-color) !important;
            }
            
            a, button, input, select {
                outline: 2px solid var(--border-color) !important;
            }
            
            a:focus, button:focus, input:focus, select:focus {
                outline: 4px solid var(--primary-blue) !important;
            }
        `;
    } else {
        styleEl.textContent = '';
    }
    
    // Add class to body for additional CSS targeting if needed
    if (enabled) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }
}

/**
 * Apply screen reader optimizations
 * @param {boolean} enabled - Whether screen reader optimizations are enabled
 */
function applyScreenReaderOptimizations(enabled) {
    // Add aria attributes and additional assistance for screen readers
    if (enabled) {
        // Add skip to content link at the top of the page
        if (!document.getElementById('skip-to-content')) {
            const skipLink = document.createElement('a');
            skipLink.id = 'skip-to-content';
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to content';
            skipLink.style.position = 'absolute';
            skipLink.style.top = '-40px';
            skipLink.style.left = '0';
            skipLink.style.backgroundColor = 'var(--background-color)';
            skipLink.style.padding = '8px 16px';
            skipLink.style.zIndex = '9999';
            skipLink.style.transition = 'top 0.3s ease';
            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '0';
            });
            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-40px';
            });
            document.body.insertBefore(skipLink, document.body.firstChild);
            
            // Add main content ID if it doesn't exist
            const mainContent = document.querySelector('main');
            if (mainContent && !mainContent.id) {
                mainContent.id = 'main-content';
            }
        }
        
        // Add additional aria attributes
        document.querySelectorAll('input, button, a, select').forEach(el => {
            if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && el.textContent) {
                el.setAttribute('aria-label', el.textContent.trim() || el.value || el.placeholder);
            }
        });
        
        document.body.classList.add('screen-reader-optimized');
    } else {
        // Remove skip to content link
        const skipLink = document.getElementById('skip-to-content');
        if (skipLink) {
            skipLink.remove();
        }
        
        document.body.classList.remove('screen-reader-optimized');
    }
}

/**
 * Show a specific settings section and hide others
 * @param {string} sectionId - The ID of the section to show
 */
function showSettingsSection(sectionId) {
    const allSections = document.querySelectorAll('.settings-section');
    
    allSections.forEach(section => {
        if (section.id === sectionId) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

/**
 * Show the currently active settings section based on the active nav link
 */
function showActiveSettingsSection() {
    const activeLink = document.querySelector('.settings-nav-link.active');
    
    if (activeLink) {
        const sectionId = activeLink.getAttribute('href').substring(1);
        showSettingsSection(sectionId);
    } else {
        // Default to general settings if no active link
        showSettingsSection('general');
    }
}

/**
 * Save the active section preference to localStorage
 * @param {string} sectionId - The ID of the active section
 */
function saveActiveSectionPreference(sectionId) {
    localStorage.setItem('elysiar_active_settings_section', sectionId);
}

/**
 * Load the active section preference from localStorage
 */
function loadActiveSection() {
    const activeSection = localStorage.getItem('elysiar_active_settings_section');
    
    if (activeSection) {
        // Find the nav link for this section
        const navLink = document.querySelector(`.settings-nav-link[href="#${activeSection}"]`);
        
        if (navLink) {
            // Remove active class from all links
            document.querySelectorAll('.settings-nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to the saved section link
            navLink.classList.add('active');
            
            // Show the corresponding section
            showSettingsSection(activeSection);
        }
    }
}

/**
 * Add event listeners to all settings form elements
 */
function addSettingsEventListeners() {
    // Add event listeners for any form elements that aren't toggle switches
    const formInputs = document.querySelectorAll('.settings-content input:not([type="checkbox"]), .settings-content select');
    
    formInputs.forEach(input => {
        input.addEventListener('change', function() {
            const settingName = input.id || input.name;
            let value;
            
            // Get the appropriate value based on input type
            if (input.type === 'radio') {
                if (!input.checked) return; // Only save checked radio buttons
                value = input.value;
            } else if (input.type === 'checkbox') {
                value = input.checked;
            } else {
                value = input.value;
            }
            
            // Save the setting
            saveFormSettingToLocalStorage(settingName, value);
            
            // Show feedback to the user
            showToast(`Setting saved: ${getFormattedSettingName(settingName)}`, 'success');
        });
    });
    
    // Initialize specific form elements
    initSpecificFormElements();
    
    // Add event listeners for buttons with specific actions
    initActionButtons();
}

/**
 * Format a setting name for display
 * @param {string} settingName - The camelCase setting name
 * @returns {string} A formatted setting name
 */
function getFormattedSettingName(settingName) {
    return settingName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Initialize specific form elements with additional functionality
 */
function initSpecificFormElements() {
    // Language selector
    const languageSelect = document.getElementById('app-language');
    if (languageSelect) {
        // Load saved language preference
        const savedLanguage = localStorage.getItem('elysiar_setting_app-language');
        if (savedLanguage) {
            languageSelect.value = JSON.parse(savedLanguage);
        }
    }
    
    // Currency selector
    const currencySelect = document.getElementById('currency');
    if (currencySelect) {
        // Load saved currency preference
        const savedCurrency = localStorage.getItem('elysiar_setting_currency');
        if (savedCurrency) {
            currencySelect.value = JSON.parse(savedCurrency);
        }
    }
    
    // Text size selector
    const textSizeSelect = document.getElementById('text-size');
    if (textSizeSelect) {
        // Load saved text size preference
        const savedTextSize = localStorage.getItem('elysiar_setting_text-size');
        if (savedTextSize) {
            textSizeSelect.value = JSON.parse(savedTextSize);
            // Apply text size
            applyTextSize(JSON.parse(savedTextSize));
        }
        
        // Add change event
        textSizeSelect.addEventListener('change', function() {
            applyTextSize(this.value);
        });
    }
    
    // Default car type
    const carTypeSelect = document.getElementById('default-car-type');
    if (carTypeSelect) {
        // Load saved car type preference
        const savedCarType = localStorage.getItem('elysiar_setting_default-car-type');
        if (savedCarType) {
            carTypeSelect.value = JSON.parse(savedCarType);
        }
    }
}

/**
 * Apply text size to the document
 * @param {string} size - The text size (small, medium, large, x-large)
 */
function applyTextSize(size) {
    // Remove any existing text size classes
    document.body.classList.remove('text-small', 'text-medium', 'text-large', 'text-x-large');
    
    // Add the new text size class
    document.body.classList.add(`text-${size}`);
    
    // Add custom CSS if it doesn't exist
    if (!document.getElementById('text-size-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'text-size-styles';
        styleEl.textContent = `
            .text-small {
                --text-body-sm: 0.75rem;
                --text-body-md: 0.875rem;
                --text-body-lg: 1rem;
                --text-heading-sm: 1rem;
                --text-heading-md: 1.125rem;
                --text-heading-lg: 1.25rem;
                --text-heading-xl: 1.5rem;
            }
            
            .text-medium {
                /* Default sizes */
            }
            
            .text-large {
                --text-body-sm: 0.875rem;
                --text-body-md: 1rem;
                --text-body-lg: 1.125rem;
                --text-heading-sm: 1.125rem;
                --text-heading-md: 1.25rem;
                --text-heading-lg: 1.5rem;
                --text-heading-xl: 1.75rem;
            }
            
            .text-x-large {
                --text-body-sm: 1rem;
                --text-body-md: 1.125rem;
                --text-body-lg: 1.25rem;
                --text-heading-sm: 1.25rem;
                --text-heading-md: 1.5rem;
                --text-heading-lg: 1.75rem;
                --text-heading-xl: 2rem;
            }
        `;
        document.head.appendChild(styleEl);
    }
}

/**
 * Initialize action buttons in the settings page
 */
function initActionButtons() {
    // Download My Data button
    const downloadDataBtn = document.getElementById('download-data-btn');
    if (downloadDataBtn) {
        downloadDataBtn.addEventListener('click', function() {
            downloadUserData();
        });
    }
    
    // Change Password button
    const changePasswordBtn = document.getElementById('change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            showPasswordChangeModal();
        });
    }
    
    // Log Out of All Devices button
    const logoutAllBtn = document.getElementById('logout-all-devices-btn');
    if (logoutAllBtn) {
        logoutAllBtn.addEventListener('click', function() {
            logoutAllDevices();
        });
    }
    
    // Reset All Settings button
    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', function() {
            confirmResetAllSettings();
        });
    }
}

/**
 * Download user data as a JSON file
 */
function downloadUserData() {
    // Simulate collecting comprehensive user data
    const mockRideHistory = [
        { id: 'R123456', date: '2025-05-30', pickup: '123 Main St', dropoff: 'Downtown Mall', fare: '$15.75' },
        { id: 'R123457', date: '2025-05-28', pickup: 'Office Tower', dropoff: 'Home Address', fare: '$22.50' },
        { id: 'R123458', date: '2025-05-25', pickup: 'Airport Terminal', dropoff: 'Grand Hotel', fare: '$35.25' }
    ];
    
    // Mock payment methods (with sensitive info masked)
    const mockPaymentMethods = [
        { type: 'credit_card', last4: '4242', expiry: '03/26', name: 'JOHN DOE' },
        { type: 'paypal', email: 'j***e@example.com' }
    ];
    
    // Collect user data from localStorage and include mock data
    const userData = {
        userInfo: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            memberSince: '2023-05-01'
        },
        settings: getAllSettings(),
        rideHistory: mockRideHistory,
        savedLocations: [
            { name: 'Home', address: '123 Residential Ave, Hometown' },
            { name: 'Work', address: '456 Office Park, Business District' }
        ],
        paymentMethods: mockPaymentMethods
    };
    
    // Convert to JSON string
    const dataStr = JSON.stringify(userData, null, 2);
    
    // Create a download link
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'elysiar-user-data.json';
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 100);
    
    // Show a confirmation message with a toast
    showToast('Your data has been downloaded successfully.', 'success');
}

/**
 * Save a form setting to localStorage
 * @param {string} settingName - The name of the setting
 * @param {any} value - The value of the setting
 */
function saveFormSettingToLocalStorage(settingName, value) {
    // Store with prefix to avoid conflicts with other settings
    localStorage.setItem(`elysiar_setting_${settingName}`, JSON.stringify(value));
    
    // Apply any immediate effects based on the setting
    applyFormSettingEffect(settingName, value);
}

/**
 * Apply immediate effects for form settings
 * @param {string} settingName - The name of the setting
 * @param {any} value - The value of the setting
 */
function applyFormSettingEffect(settingName, value) {
    // Handle specific form settings that need immediate effects
    switch(settingName) {
        case 'language':
            // Implement language change logic if needed
            break;
            
        // Add cases for other settings as needed
    }
}

/**
 * Show a modal for changing password
 */
function showPasswordChangeModal() {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.id = 'password-change-modal';
    
    // Create modal content
    modalContainer.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Change Password</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="password-change-form">
                    <div class="form-group">
                        <label for="old-password">Current Password</label>
                        <input type="password" id="old-password" class="input-field" required>
                    </div>
                    <div class="form-group">
                        <label for="new-password">New Password</label>
                        <input type="password" id="new-password" class="input-field" required>
                        <div class="password-strength" id="password-strength">
                            <div class="strength-meter">
                                <div class="strength-meter-fill" id="strength-meter-fill"></div>
                            </div>
                            <span class="strength-text" id="strength-text">Password strength</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">Confirm New Password</label>
                        <input type="password" id="confirm-password" class="input-field" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" id="password-cancel">Cancel</button>
                        <button type="submit" class="btn btn-primary">Change Password</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add modal to the page
    document.body.appendChild(modalContainer);
    
    // Add modal styles if they don't already exist
    addModalStyles();
    
    // Add event listeners for the modal
    initPasswordModalEvents(modalContainer);
    
    // Show the modal
    setTimeout(() => {
        modalContainer.classList.add('active');
    }, 10);
}

/**
 * Add styles for the modal if they don't already exist
 */
function addModalStyles() {
    // Check if styles already exist
    if (document.getElementById('modal-styles')) return;
    
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.id = 'modal-styles';
    
    // Add modal styles
    styleEl.textContent = `
        .modal-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
            backdrop-filter: blur(3px);
        }
        
        .modal-container.active {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-content {
            background-color: var(--surface-color);
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow-lg);
            width: 90%;
            max-width: 500px;
            transform: translateY(-20px);
            transition: transform 0.3s ease;
            overflow: hidden;
        }
        
        .modal-container.active .modal-content {
            transform: translateY(0);
        }
        
        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .modal-header h2 {
            margin: 0;
            font-size: var(--text-heading-md);
            color: var(--text-primary);
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-secondary);
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s ease;
        }
        
        .modal-close:hover {
            background-color: rgba(0, 0, 0, 0.05);
            color: var(--text-primary);
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .password-strength {
            margin-top: 0.5rem;
        }
        
        .strength-meter {
            height: 5px;
            background-color: var(--border-color);
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 0.25rem;
        }
        
        .strength-meter-fill {
            height: 100%;
            width: 0;
            transition: width 0.3s ease, background-color 0.3s ease;
        }
        
        .strength-text {
            font-size: var(--text-body-sm);
            color: var(--text-secondary);
        }
        
        /* Toast notification */
        .toast-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }
        
        .toast {
            background-color: var(--surface-color);
            color: var(--text-primary);
            padding: 12px 20px;
            border-radius: var(--border-radius-md);
            box-shadow: var(--shadow-lg);
            margin-top: 10px;
            display: flex;
            align-items: center;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            max-width: 350px;
        }
        
        .toast.show {
            transform: translateX(0);
        }
        
        .toast-icon {
            margin-right: 10px;
            font-size: 20px;
        }
        
        .toast-success {
            border-left: 4px solid var(--success-color);
        }
        
        .toast-error {
            border-left: 4px solid var(--error-color);
        }
        
        .toast-info {
            border-left: 4px solid var(--primary-blue);
        }
        
        .toast-success .toast-icon {
            color: var(--success-color);
        }
        
        .toast-error .toast-icon {
            color: var(--error-color);
        }
        
        .toast-info .toast-icon {
            color: var(--primary-blue);
        }
    `;
    
    // Add to document
    document.head.appendChild(styleEl);
}

/**
 * Initialize events for the password change modal
 * @param {HTMLElement} modalContainer - The modal container element
 */
function initPasswordModalEvents(modalContainer) {
    // Close button
    const closeBtn = modalContainer.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modalContainer));
    }
    
    // Cancel button
    const cancelBtn = modalContainer.querySelector('#password-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => closeModal(modalContainer));
    }
    
    // Close on background click
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            closeModal(modalContainer);
        }
    });
    
    // Form submission
    const form = modalContainer.querySelector('#password-change-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handlePasswordChange(modalContainer);
        });
    }
    
    // Password strength meter
    const newPasswordInput = modalContainer.querySelector('#new-password');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', updatePasswordStrength);
    }
}

/**
 * Close a modal
 * @param {HTMLElement} modalContainer - The modal container element
 */
function closeModal(modalContainer) {
    modalContainer.classList.remove('active');
    setTimeout(() => {
        modalContainer.remove();
    }, 300);
}

/**
 * Handle password change form submission
 * @param {HTMLElement} modalContainer - The modal container element
 */
function handlePasswordChange(modalContainer) {
    const oldPasswordInput = modalContainer.querySelector('#old-password');
    const newPasswordInput = modalContainer.querySelector('#new-password');
    const confirmPasswordInput = modalContainer.querySelector('#confirm-password');
    
    const oldPassword = oldPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Check if new passwords match
    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match.', 'error');
        return;
    }
    
    // Check password strength
    if (getPasswordStrength(newPassword) < 2) {
        showToast('Please choose a stronger password.', 'error');
        return;
    }
    
    // Simulate password verification and change
    // In a real app, this would be an API call to verify and change the password
    setTimeout(() => {
        // Close the modal
        closeModal(modalContainer);
        
        // Show success message
        showToast('Password changed successfully.', 'success');
    }, 1000);
}

/**
 * Update password strength meter
 * @param {Event} event - The input event
 */
function updatePasswordStrength(event) {
    const password = event.target.value;
    const strength = getPasswordStrength(password);
    
    const strengthFill = document.getElementById('strength-meter-fill');
    const strengthText = document.getElementById('strength-text');
    
    if (!strengthFill || !strengthText) return;
    
    // Set width and color based on strength
    let width = '0%';
    let color = '';
    let text = '';
    
    switch (strength) {
        case 0:
            width = '0%';
            text = 'Password strength';
            break;
        case 1:
            width = '25%';
            color = 'var(--error-color)';
            text = 'Weak';
            break;
        case 2:
            width = '50%';
            color = 'var(--warning-color)';
            text = 'Fair';
            break;
        case 3:
            width = '75%';
            color = 'var(--primary-blue)';
            text = 'Good';
            break;
        case 4:
            width = '100%';
            color = 'var(--success-color)';
            text = 'Strong';
            break;
    }
    
    strengthFill.style.width = width;
    strengthFill.style.backgroundColor = color;
    strengthText.textContent = text;
}

/**
 * Calculate password strength (0-4)
 * @param {string} password - The password to check
 * @returns {number} Strength score (0-4)
 */
function getPasswordStrength(password) {
    if (!password) return 0;
    
    let score = 0;
    
    // Length
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Complexity
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password) && /[\W_]/.test(password)) score++;
    
    return score;
}

/**
 * Show a toast notification
 * @param {string} message - The message to show
 * @param {string} type - The type of toast (success, error, info)
 */
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Set icon based on type
    let icon = '';
    switch (type) {
        case 'success':
            icon = 'fa-check-circle';
            break;
        case 'error':
            icon = 'fa-times-circle';
            break;
        case 'info':
        default:
            icon = 'fa-info-circle';
            break;
    }
    
    // Set toast content
    toast.innerHTML = `
        <span class="toast-icon">
            <i class="fas ${icon}"></i>
        </span>
        <span class="toast-message">${message}</span>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Show the toast with a slight delay
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
}

/**
 * Log out from all devices
 */
function logoutAllDevices() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to log out from all devices? This will end all active sessions.')) {
        // Show loading state
        const logoutBtn = document.getElementById('logout-all-devices-btn');
        if (logoutBtn) {
            logoutBtn.disabled = true;
            logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
        }

        try {
            // Clear all auth tokens and session data
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            
            // Clear any session cookies
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            
            // Show success message
            showToast('Successfully logged out from all devices.', 'success');
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            
        } catch (error) {
            console.error('Error during logout:', error);
            showToast('Failed to log out from all devices. Please try again.', 'error');
            
            // Reset button state
            if (logoutBtn) {
                logoutBtn.disabled = false;
                logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Log Out of All Devices';
            }
        }
    }
}

/**
 * Confirm and reset all settings to default
 */
function confirmResetAllSettings() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
        resetAllSettings();
    }
}

/**
 * Reset all settings to their default values
 */
function resetAllSettings() {
    // Get all settings keys from localStorage
    const settingsKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('elysiar_setting_') || key.startsWith('elysiar_preference_'))) {
            settingsKeys.push(key);
        }
    }
    
    // Remove all settings from localStorage
    settingsKeys.forEach(key => {
        localStorage.removeItem(key);
    });
    
    // Default values for toggle switches (default is checked)
    const defaultCheckedSwitches = [
        'ride-history-sync',
        'map-animation',
        'automatic-updates',
        'push-notifications',
        'email-notifications',
        'location-sharing',
        'data-collection',
        'preferred-drivers',
        'quick-book',
        'saved-destinations'
    ];
    
    // Default values for toggle switches (default is unchecked)
    const defaultUncheckedSwitches = [
        'sms-notifications',
        'marketing-communications',
        'share-ride-status',
        'two-factor-auth',
        'biometric-login',
        'screen-reader',
        'reduced-motion',
        'high-contrast'
    ];
    
    // Set default values for toggle switches
    defaultCheckedSwitches.forEach(id => {
        const toggle = document.getElementById(id);
        if (toggle) {
            toggle.checked = true;
            saveSettingToLocalStorage(convertToCamelCase(id), true);
        }
    });
    
    defaultUncheckedSwitches.forEach(id => {
        const toggle = document.getElementById(id);
        if (toggle) {
            toggle.checked = false;
            saveSettingToLocalStorage(convertToCamelCase(id), false);
        }
    });
    
    // Default values for select inputs
    const defaultSelectValues = {
        'app-language': 'en',
        'currency': 'USD',
        'text-size': 'medium',
        'default-car-type': 'economy',
        'theme': 'system'
    };
    
    // Set default values for select inputs
    Object.entries(defaultSelectValues).forEach(([id, value]) => {
        const select = document.getElementById(id);
        if (select) {
            select.value = value;
            saveFormSettingToLocalStorage(id, value);
        }
    });
    
    // Theme is permanently set to dark
    document.documentElement.style.colorScheme = 'dark';
    
    // Apply text size
    applyTextSize('medium');
    
    // Apply animations reset
    document.documentElement.style.setProperty('--transition-standard', '0.3s ease');
    
    // Show success message
    showToast('All settings have been reset to default values.', 'success');
    
    // Reload the page after a short delay to ensure all settings are applied
    setTimeout(() => {
        location.reload();
    }, 1500);
}

/**
 * Apply accessibility settings from the saved settings
 * @param {Object} settings - An object containing all settings
 */
function applyAccessibilitySettings(settings) {
    // Apply text size
    const textSize = localStorage.getItem('elysiar_setting_text-size');
    if (textSize) {
        applyTextSize(JSON.parse(textSize));
    }
    
    // Apply reduced motion setting
    if (settings.reducedMotion) {
        applyReducedMotion(settings.reducedMotion);
    }
    
    // Apply high contrast setting
    if (settings.highContrast) {
        applyHighContrast(settings.highContrast);
    }
    
    // Apply screen reader optimizations
    if (settings.screenReader) {
        applyScreenReaderOptimizations(settings.screenReader);
    }
}

// jQuery-like contains selector polyfill
if (!HTMLElement.prototype.contains) {
    HTMLElement.prototype.contains = function(text) {
        return Array.from(this.querySelectorAll('*')).some(el => 
            el.textContent.trim().includes(text)
        );
    };
}
