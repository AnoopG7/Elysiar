async function loadNavbar() {
    try {
        // Get the absolute base URL and server info
        const baseUrl = window.location.origin;
        const currentPath = window.location.pathname;
        const currentPort = window.location.port;
        
        // Detect which server we're using
        const isLiveServer = currentPort === '5501'; // VS Code Live Server
        const isPythonServer = currentPort === '8000'; // Python http.server
        
        // More reliable method to determine if we're in the html folder
        const pathParts = currentPath.split('/');
        const isInHtmlFolder = pathParts[pathParts.length - 2] === 'html' || 
                              currentPath.includes('/html/');
        
        console.log(`Server detection - Live Server: ${isLiveServer}, Python Server: ${isPythonServer}`);
        console.log(`Current path: ${currentPath}, In HTML folder: ${isInHtmlFolder}`);
        
        // Set path based on current location and server type
        let navbarPath;
        
        if (isLiveServer) {
            // VS Code Live Server specific path handling
            navbarPath = isInHtmlFolder ? './navbar.html' : 'html/navbar.html';
        } else if (isPythonServer) {
            // Python server specific path handling
            navbarPath = isInHtmlFolder ? './navbar.html' : 'html/navbar.html';
        } else {
            // Default path handling for other servers
            navbarPath = isInHtmlFolder ? './navbar.html' : 'html/navbar.html';
        }
        
        console.log('Loading navbar from path:', navbarPath);
        let response;
        
        try {
            response = await fetch(navbarPath);
        } catch (error) {
            console.error('Error fetching navbar:', error);
            // Try multiple fallback paths in case the first one fails
            const fallbackPaths = [
                './navbar.html',
                '../html/navbar.html',
                '/html/navbar.html',
                'navbar.html'
            ];
            
            for (const path of fallbackPaths) {
                if (path === navbarPath) continue; // Skip the already tried path
                
                try {
                    console.log(`Trying fallback path: ${path}`);
                    response = await fetch(path);
                    if (response.ok) {
                        console.log(`Successfully loaded navbar from fallback path: ${path}`);
                        break;
                    }
                } catch (fallbackError) {
                    console.log(`Fallback path ${path} failed:`, fallbackError);
                }
            }
            
            if (!response || !response.ok) {
                throw new Error(`Failed to load navbar: Unable to find a working path`);
            }
        }
        
        const html = await response.text();
        
        // Insert the navbar HTML
        document.getElementById('header').innerHTML = html;
        
        // Set active state based on current page
        const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        
        // Remove all active classes first
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelectorAll('.nav-dropdown-link').forEach(link => link.classList.remove('active'));
        
        // Fix relative paths based on current location
        if (!isInHtmlFolder) {
            // If we're not in the html folder, need to prepend html/ to relative paths
            document.querySelectorAll('a[href^="./"]').forEach(link => {
                const href = link.getAttribute('href');
                link.setAttribute('href', `html/${href.substring(2)}`);
            });
        }
        
        // Special handling for Live Server
        if (currentPort === '5501') {
            console.log('VS Code Live Server detected in navbar.js - applying specific fixes');
            
            // Fix auth links for Live Server
            const authLinks = document.querySelectorAll('a[href*="login.html"], a[href*="signup.html"]');
            authLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    if (isInHtmlFolder) {
                        // If in html folder, use ./
                        if (!href.startsWith('./')) {
                            const filename = href.substring(href.lastIndexOf('/') + 1);
                            link.setAttribute('href', `./${filename}`);
                            console.log(`Fixed auth link in navbar: ${href} → ./${filename}`);
                        }
                    } else {
                        // If not in html folder, ensure html/ prefix
                        if (!href.includes('html/')) {
                            link.setAttribute('href', `html/${href}`);
                            console.log(`Fixed auth link in navbar: ${href} → html/${href}`);
                        }
                    }
                }
            });
        }
        
        // Use path-helper.js if available to further ensure links work
        if (typeof fixRelativeLinks === 'function') {
            fixRelativeLinks();
        }
        
        // Set active state
        const navLinks = document.querySelectorAll('.nav-link, .nav-dropdown-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Check if the href matches the current page, accounting for different path formats
            // (e.g., "login.html", "./login.html", or "/html/login.html")
            const hrefFilename = href.substring(href.lastIndexOf('/') + 1);
            if (hrefFilename === filename || (filename === '' && hrefFilename === 'index.html')) {
                link.classList.add('active');
                
                // If it's a dropdown item, also set the parent dropdown as active
                const dropdownParent = link.closest('.nav-item');
                if (dropdownParent) {
                    const dropdownTrigger = dropdownParent.querySelector('.dropdown-trigger');
                    if (dropdownTrigger) {
                        dropdownTrigger.classList.add('active');
                    }
                }
            }
        });
        
        // Initialize dropdowns
        initializeDropdowns();
        
        // Initialize mobile navigation
        initializeMobileNavigation();
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

function initializeDropdowns() {
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdownContainer = trigger.parentElement;
            const dropdown = dropdownContainer.querySelector('.nav-dropdown');
            const arrow = trigger.querySelector('.dropdown-arrow');
            
            // Close other dropdowns
            dropdownTriggers.forEach(otherTrigger => {
                if (otherTrigger !== trigger) {
                    const otherContainer = otherTrigger.parentElement;
                    const otherDropdown = otherContainer.querySelector('.nav-dropdown');
                    const otherArrow = otherTrigger.querySelector('.dropdown-arrow');
                    otherContainer.classList.remove('active');
                    otherArrow?.classList.remove('rotated');
                }
            });
            
            // Toggle current dropdown
            dropdownContainer.classList.toggle('active');
            arrow?.classList.toggle('rotated');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item')) {
            dropdownTriggers.forEach(trigger => {
                const dropdownContainer = trigger.parentElement;
                const arrow = trigger.querySelector('.dropdown-arrow');
                dropdownContainer.classList.remove('active');
                arrow?.classList.remove('rotated');
            });
        }
    });
}

const MobileNavManager = {
    init() {
        this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        this.mobileMenu = document.getElementById('mobile-menu');
        
        if (this.mobileMenuToggle && this.mobileMenu) {
            this.setupMenuToggle();
            this.setupSubmenuToggles();
            this.setupOutsideClickHandler();
        }
    },

    setupMenuToggle() {
        this.mobileMenuToggle.addEventListener('click', () => this.toggleMenu());
    },

    toggleMenu() {
        this.mobileMenuToggle.classList.toggle('active');
        this.mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Accessibility
        const isExpanded = this.mobileMenu.classList.contains('active');
        this.mobileMenuToggle.setAttribute('aria-expanded', isExpanded.toString());
    },

    setupSubmenuToggles() {
        const submenuTriggers = this.mobileMenu.querySelectorAll('.mobile-nav-link.has-submenu');
        submenuTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => this.toggleSubmenu(e, trigger));
        });
    },

    toggleSubmenu(e, trigger) {
        e.preventDefault();
        const submenu = trigger.nextElementSibling;
        
        // Check if this submenu is already active
        const isActive = submenu.classList.contains('active');
        
        // Close all open submenus first
        this.closeAllSubmenus();
        
        // Toggle this submenu if it wasn't already active
        if (!isActive) {
            submenu.classList.add('active');
            trigger.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
        }
    },

    closeAllSubmenus() {
        const allSubmenus = this.mobileMenu.querySelectorAll('.mobile-submenu.active');
        allSubmenus.forEach(sub => {
            sub.classList.remove('active');
            sub.previousElementSibling.classList.remove('active');
            sub.previousElementSibling.setAttribute('aria-expanded', 'false');
        });
    },

    setupOutsideClickHandler() {
        document.addEventListener('click', (e) => {
            if (this.mobileMenu.classList.contains('active') && 
                !this.mobileMenu.contains(e.target) && 
                !this.mobileMenuToggle.contains(e.target)) {
                this.toggleMenu();
            }
        });
    }
};

// Consolidated keyboard navigation manager
const KeyboardNavigationManager = {
    init() {
        this.setupKeyboardShortcuts();
        this.setupDropdownKeyboardNavigation();
        this.setupMobileMenuKeyboardNavigation();
        this.addExpandedStates();
    },

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + H for Home
            if (e.altKey && e.key.toLowerCase() === 'h') {
                e.preventDefault();
                window.location.href = 'index.html';
            }
            
            // Alt + B for Book a Ride
            if (e.altKey && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                window.location.href = 'booking.html';
            }
            
            // Alt + L for Login
            if (e.altKey && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                window.location.href = 'login.html';
            }
            
            // Escape to close all dropdowns and mobile menu
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
                MobileNavManager.closeAllSubmenus();
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu?.classList.contains('active')) {
                    MobileNavManager.toggleMenu();
                }
            }
        });
    },

    setupDropdownKeyboardNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const trigger = item.querySelector('.dropdown-trigger');
            const dropdown = item.querySelector('.nav-dropdown');
            
            if (trigger && dropdown) {
                // Add ARIA attributes
                trigger.setAttribute('aria-haspopup', 'true');
                trigger.setAttribute('aria-expanded', 'false');
                
                // Handle keyboard navigation
                trigger.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleDropdown(trigger, dropdown);
                    }

                    if (e.key === 'ArrowDown' && trigger.getAttribute('aria-expanded') === 'true') {
                        e.preventDefault();
                        const firstLink = dropdown.querySelector('.nav-dropdown-link');
                        firstLink?.focus();
                    }
                });
                
                // Add keyboard navigation within dropdown
                const dropdownLinks = dropdown.querySelectorAll('.nav-dropdown-link');
                dropdownLinks.forEach((link, index) => {
                    link.addEventListener('keydown', (e) => {
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            const nextIndex = (index + 1) % dropdownLinks.length;
                            dropdownLinks[nextIndex].focus();
                        }
                        
                        if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            const prevIndex = (index - 1 + dropdownLinks.length) % dropdownLinks.length;
                            dropdownLinks[prevIndex].focus();
                        }
                        
                        if (e.key === 'Escape') {
                            e.preventDefault();
                            this.closeDropdown(trigger);
                            trigger.focus();
                        }

                        if (e.key === 'Tab' && !e.shiftKey && index === dropdownLinks.length - 1) {
                            this.closeDropdown(trigger);
                        }
                        
                        if (e.key === 'Tab' && e.shiftKey && index === 0) {
                            this.closeDropdown(trigger);
                        }
                    });
                });
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-item')) {
                this.closeAllDropdowns();
            }
        });
    },

    setupMobileMenuKeyboardNavigation() {
        const mobileMenuItems = document.querySelectorAll('.mobile-nav-link');
        mobileMenuItems.forEach((item, index) => {
            if (item.classList.contains('has-submenu')) {
                item.setAttribute('aria-haspopup', 'true');
                item.setAttribute('aria-expanded', 'false');
            }

            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (item.classList.contains('has-submenu')) {
                        const submenu = item.nextElementSibling;
                        if (submenu) {
                            MobileNavManager.toggleSubmenu(e, item);
                        }
                    } else {
                        item.click();
                    }
                }

                if (e.key === 'Escape') {
                    e.preventDefault();
                    if (item.classList.contains('has-submenu') && item.getAttribute('aria-expanded') === 'true') {
                        MobileNavManager.closeAllSubmenus();
                    } else {
                        MobileNavManager.toggleMenu();
                    }
                }
            });
        });
    },

    addExpandedStates() {
        // Add aria-expanded state to dropdowns
        document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
            if (!trigger.hasAttribute('aria-expanded')) {
                trigger.setAttribute('aria-expanded', 'false');
            }
        });

        // Add aria-expanded state to mobile submenus
        document.querySelectorAll('.mobile-nav-link.has-submenu').forEach(trigger => {
            if (!trigger.hasAttribute('aria-expanded')) {
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    },

    toggleDropdown(trigger, dropdown) {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        
        // Close all other dropdowns
        this.closeAllDropdowns();
        
        // Toggle current dropdown
        trigger.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
            const firstLink = dropdown.querySelector('.nav-dropdown-link');
            firstLink?.focus();
        }
    },

    closeDropdown(trigger) {
        trigger.setAttribute('aria-expanded', 'false');
    },

    closeAllDropdowns() {
        document.querySelectorAll('.nav-item .dropdown-trigger').forEach(trigger => {
            this.closeDropdown(trigger);
        });
    }
};

// Initialize MobileNavManager and KeyboardNavigationManager after navbar is loaded
document.addEventListener('DOMContentLoaded', () => {
    MobileNavManager.init();
    KeyboardNavigationManager.init();
});

// Helper function to ensure mobile navigation works after DOM changes
function reinitializeEventListeners() {
    // Re-initialize mobile navigation toggling
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        // Remove old event listeners
        const oldToggle = mobileMenuToggle.cloneNode(true);
        mobileMenuToggle.parentNode.replaceChild(oldToggle, mobileMenuToggle);
        
        // Add new event listener
        oldToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            oldToggle.classList.toggle('active');
            document.body.classList.toggle('mobile-menu-open');
        });
    }
}

// Load navbar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create header element if it doesn't exist
    if (!document.getElementById('header')) {
        const headerElement = document.createElement('header');
        headerElement.id = 'header';
        headerElement.className = 'header';
        
        // Insert at the beginning of the body
        document.body.insertBefore(headerElement, document.body.firstChild);
    }
    
    loadNavbar().then(() => {
        // Make sure event listeners are reattached after navbar is loaded
        reinitializeEventListeners();
    });
});
