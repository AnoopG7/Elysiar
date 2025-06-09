document.addEventListener('DOMContentLoaded', function() {
    // Create header element if it doesn't exist
    if (!document.getElementById('header')) {
        const headerElement = document.createElement('header');
        headerElement.id = 'header';
        headerElement.className = 'header';
        
        // Insert at the beginning of the body
        document.body.insertBefore(headerElement, document.body.firstChild);
    }
    
    // Load navbar using the existing navbar.js functionality
    if (typeof loadNavbar === 'function') {
        loadNavbar();
    } else {
        console.error('navbar.js is not loaded properly. Make sure it is included before include-navbar.js');
    }
});