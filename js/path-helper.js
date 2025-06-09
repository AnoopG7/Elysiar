
/**
 * Helper script to ensure proper path resolution across the site
 * This should be included in all HTML files to ensure consistent path handling
 * Works with both VS Code Live Server (port 5501) and Python http.server (port 8000)
 */

// Executes after the window has fully loaded
window.addEventListener('load', function() {
    // Fix relative links in the page
    fixRelativeLinks();
});

/**
 * Checks and fixes relative links on the page that might be broken
 * due to different folder structures and access methods
 */
function fixRelativeLinks() {
    // Get all links on the page
    const links = document.querySelectorAll('a[href]');
    
    // Get current path and server info
    const currentPath = window.location.pathname;
    const currentPort = window.location.port;
    const isLiveServer = currentPort === '5501'; // VS Code Live Server
    const isPythonServer = currentPort === '8000'; // Python http.server
    
    // Different servers handle paths differently
    const isInHtmlFolder = currentPath.includes('/html/');
    console.log(`Current path: ${currentPath}, Port: ${currentPort}, In HTML folder: ${isInHtmlFolder}`);
    
    // Check each link
    links.forEach(link => {
        const href = link.getAttribute('href');
        
        // Only process relative links that aren't already fixed
        if (href && !href.startsWith('http') && !href.startsWith('/') && !href.startsWith('#')) {
            // Handle VS Code Live Server path specifics
            if (isLiveServer) {
                if (isInHtmlFolder) {
                    // If we're already in html folder and link doesn't have ./ prefix for html files
                    if (href.includes('.html') && !href.startsWith('./')) {
                        link.setAttribute('href', `./${href}`);
                    }
                }
            } 
            // Handle Python server path specifics
            else if (isPythonServer) {
                if (isInHtmlFolder) {
                    // In html folder with Python server
                    if (href.includes('.html') && !href.startsWith('./')) {
                        link.setAttribute('href', `./${href}`);
                    }
                } else {
                    // At root with Python server
                    if (href.includes('.html') && !href.includes('html/')) {
                        link.setAttribute('href', `html/${href}`);
                    }
                }
            } 
            // Default behavior for any other server
            else {
                if (isInHtmlFolder && href.includes('.html') && !href.startsWith('./')) {
                    link.setAttribute('href', `./${href}`);
                } else if (!isInHtmlFolder && href.includes('.html') && !href.includes('html/')) {
                    link.setAttribute('href', `html/${href}`);
                }
            }
        }
    });
    
    console.log('Relative links fixed for proper path resolution');
}
