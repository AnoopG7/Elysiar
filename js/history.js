/* Trip History JavaScript for Ride-Hailing Website */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize history page functionality
    initHistoryPage();
});

// Initialize all history page functionality
function initHistoryPage() {
    // Setup filters
    setupFilters();
    // Setup book again buttons
    setupBookAgainButtons();
    // Setup pagination
    setupPagination();
}

// Setup filters
function setupFilters() {
    let searchTimeout = null;
    const dateFrom = document.getElementById('date-from');
    const dateTo = document.getElementById('date-to');
    const tripType = document.getElementById('trip-type');
    const searchInput = document.querySelector('.search-input input');
    const searchButton = document.querySelector('.search-button');

    // Initialize date range
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    dateTo.valueAsDate = today;
    dateFrom.valueAsDate = thirtyDaysAgo;

    // Add event listeners
    tripType.addEventListener('change', filterTrips);
    
    [dateFrom, dateTo].forEach(input => {
        input.addEventListener('change', filterTrips);
    });

    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(filterTrips, 300);
    });

    searchButton.addEventListener('click', filterTrips);
}

// Filter trips based on selected criteria
function filterTrips() {
    const tripType = document.getElementById('trip-type').value;
    const searchTerm = document.querySelector('.search-input input').value.toLowerCase();
    const dateFrom = document.getElementById('date-from').valueAsDate;
    const dateTo = document.getElementById('date-to').valueAsDate;
    
    // Add one day to dateTo to include the selected day
    const adjustedDateTo = new Date(dateTo);
    adjustedDateTo.setDate(adjustedDateTo.getDate() + 1);

    const tripCards = document.querySelectorAll('.trip-card');
    let visibleTrips = 0;

    tripCards.forEach(card => {
        let showCard = true;

        // Filter by trip type
        if (tripType !== 'all') {
            // For demo, we'll consider rides with "Airport" as business trips
            const isAirport = card.querySelector('.point-address').textContent.toLowerCase().includes('airport');
            const isBusiness = tripType === 'business' && isAirport;
            const isPersonal = tripType === 'personal' && !isAirport;
            showCard = isBusiness || isPersonal;
        }

        // Filter by search term
        if (searchTerm) {
            const cardText = card.textContent.toLowerCase();
            showCard = showCard && cardText.includes(searchTerm);
        }

        // Filter by date range
        if (dateFrom && dateTo) {
            const tripDateStr = card.querySelector('.trip-date .date').textContent;
            const tripDate = new Date(tripDateStr);
            showCard = showCard && tripDate >= dateFrom && tripDate <= adjustedDateTo;
        }

        // Show/hide card
        card.style.display = showCard ? 'flex' : 'none';
        if (showCard) visibleTrips++;
    });

    // Show/hide empty state
    const emptyState = document.querySelector('.empty-state');
    if (emptyState) {
        emptyState.style.display = visibleTrips === 0 ? 'block' : 'none';
    }
}

// Setup book again buttons
function setupBookAgainButtons() {
    const bookAgainButtons = document.querySelectorAll('.book-again-btn');
    
    bookAgainButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tripCard = button.closest('.trip-card');
            const pickup = tripCard.querySelector('.route-point.pickup .point-address').textContent;
            const destination = tripCard.querySelector('.route-point.destination .point-address').textContent;
            
            // Store locations in session storage for booking page
            sessionStorage.setItem('bookAgainPickup', pickup);
            sessionStorage.setItem('bookAgainDestination', destination);
            
            // Redirect to booking page
            window.location.href = 'booking.html';
        });
    });
}

// Setup pagination
function setupPagination() {
    const paginationPages = document.querySelector('.pagination-pages');
    const prevButton = document.querySelector('.pagination-button:first-child');
    const nextButton = document.querySelector('.pagination-button:last-child');

    if (paginationPages && prevButton && nextButton) {
        const pages = paginationPages.querySelectorAll('.pagination-page');

        pages.forEach(page => {
            page.addEventListener('click', () => {
                // Update active state
                pages.forEach(p => p.classList.remove('active'));
                page.classList.add('active');

                // Enable/disable navigation buttons
                const currentPage = parseInt(page.textContent);
                const maxPage = parseInt(pages[pages.length - 1].textContent);

                prevButton.disabled = currentPage === 1;
                nextButton.disabled = currentPage === maxPage;

                // In a real app, we would load the trips for this page
                // For demo, we'll scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        // Previous button click
        prevButton.addEventListener('click', () => {
            const currentPage = document.querySelector('.pagination-page.active');
            const prevPage = currentPage.previousElementSibling;
            if (prevPage && prevPage.classList.contains('pagination-page')) {
                prevPage.click();
            }
        });

        // Next button click
        nextButton.addEventListener('click', () => {
            const currentPage = document.querySelector('.pagination-page.active');
            const nextPage = currentPage.nextElementSibling;
            if (nextPage && nextPage.classList.contains('pagination-page')) {
                nextPage.click();
            }
        });
    }
}
