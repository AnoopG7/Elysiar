// Dark Theme JavaScript - Permanently enabled
// This ensures the site always uses dark theme without any toggle functionality

document.addEventListener('DOMContentLoaded', () => {
  // Apply dark theme to any iframe content if possible
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      if (iframe.contentDocument) {
        iframe.contentDocument.body.style.colorScheme = 'dark';
        iframe.contentDocument.body.style.backgroundColor = '#121212';
        iframe.contentDocument.body.style.color = '#FFFFFF';
      }
    } catch (e) {
      // Cross-origin iframe access will fail, which is expected
    }
  });
  
  // Set color-scheme to dark to ensure system controls are styled appropriately
  document.documentElement.style.colorScheme = 'dark';
});
