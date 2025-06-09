# Elysiar Server Compatibility Guide

## Overview

This document explains how to ensure the Elysiar website works correctly across different local development servers, specifically:
- VS Code Live Server (running on port 5501)
- Python HTTP Server (running on port 8000)

## Known Issues

The navigation between pages, particularly the login and signup pages, can be problematic due to path resolution differences between servers.

## Solution Implemented

We've added several scripts to ensure consistent navigation behavior:

1. **server-compatibility.js**: Detects server type and adjusts behavior accordingly
2. **path-helper.js**: Fixes relative paths in links throughout the site
3. **auth-server-fix.js**: Specifically handles authentication page links (login/signup)
4. **navbar-fix.js**: Fixes navigation links in the navbar
5. **navigation-validator.js**: Validates all navigation links for correctness
6. **link-test.js**: Provides a visual testing tool for checking all links on a page

## How to Test

### Using VS Code Live Server
1. Right-click on any HTML file and select "Open with Live Server"
2. The site should open on port 5501
3. Use the "Test Links" button in the bottom right to verify all links

### Using Python HTTP Server
1. Run `python -m http.server 8000` in the project root directory
2. Open http://localhost:8000 in your browser
3. Navigate through the site

## Troubleshooting

If you encounter navigation issues:

1. Check the browser console for error messages
2. Use the "Test Links" button to check for incorrect links
3. Verify that all HTML files include the necessary scripts:
   - server-compatibility.js
   - path-helper.js
   - navbar.js
   - navbar-fix.js (for pages with navbar)
   - auth-server-fix.js (for login/signup pages)

## Technical Details

### Path Resolution Logic

The site handles paths differently based on:
1. Which server is being used
2. Whether the current page is in the /html/ folder or not

For VS Code Live Server:
- In /html/ folder: links to other HTML pages use `./page.html` format
- At root: links to HTML pages use `html/page.html` format

For Python Server:
- Similar path handling but with different detection mechanisms

### Navigation Test Tool

The site includes a link testing tool (link-test.js) that:
1. Shows a "Test Links" button in the bottom right corner
2. When clicked, analyzes all links on the page
3. Displays a report of any issues found
4. Helps identify incorrectly formatted paths

## Future Improvements

Consider:
1. Moving all HTML files to the root directory to simplify navigation
2. Using absolute paths consistently throughout the site
3. Implementing a proper routing system for a production environment
