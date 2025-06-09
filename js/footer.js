// Footer JavaScript
document.addEventListener('DOMContentLoaded', () => {
    loadFooter();
});

async function loadFooter() {
    try {
        const response = await fetch('../html/footer.html');
        const html = await response.text();
        
        // Create a container for the footer if it doesn't exist
        let footerContainer = document.getElementById('footer-container');
        if (!footerContainer) {
            footerContainer = document.createElement('div');
            footerContainer.id = 'footer-container';
            document.body.appendChild(footerContainer);
        }
        
        // Insert the footer HTML
        footerContainer.innerHTML = html;
        
        // Initialize back to top functionality
        initBackToTop();
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        // Smooth scroll to top when clicked
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}
