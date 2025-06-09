// This script ensures that all CSS files are loaded in the correct order
// and that the components.css file is loaded on all pages

document.addEventListener('DOMContentLoaded', function() {
  // Check if components.css is already loaded
  let componentsLoaded = false;
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  
  links.forEach(link => {
    if (link.href.includes('components.css')) {
      componentsLoaded = true;
    }
  });
  
  // If components.css is not loaded, add it
  if (!componentsLoaded) {
    const componentsLink = document.createElement('link');
    componentsLink.rel = 'stylesheet';
    componentsLink.href = '../css/components.css';
    
    // Insert it right after base.css
    const baseLink = document.querySelector('link[href*="base.css"]');
    if (baseLink) {
      baseLink.parentNode.insertBefore(componentsLink, baseLink.nextSibling);
    } else {
      document.head.appendChild(componentsLink);
    }
  }
  
  // Ensure dark-theme.css is loaded last
  let darkThemeLink = document.querySelector('link[href*="dark-theme.css"]');
  
  if (!darkThemeLink) {
    darkThemeLink = document.createElement('link');
    darkThemeLink.rel = 'stylesheet';
    darkThemeLink.href = '../css/dark-theme.css';
    document.head.appendChild(darkThemeLink);
  } else {
    // Move it to the end
    document.head.appendChild(darkThemeLink);
  }
});
