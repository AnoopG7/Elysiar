# Elysiar Project Restructuring Documentation

## Changes Implemented

### 1. CSS Restructuring
- Moved all inline styles from HTML files to external CSS files in the css folder
- Created dedicated CSS files for each HTML page (e.g., settings.css for settings.html)
- Updated CSS references in HTML files to use relative paths (`../css/`)

### 2. HTML Organization
- Created a dedicated `html` folder to store all HTML files
- Copied all HTML files from the root directory to the `html` folder
- Updated all resource paths in the HTML files:
  - CSS paths: `href="../css/file.css"`
  - JavaScript paths: `src="../js/file.js"`
  - Image paths: `src="../images/image.jpg"`
  - HTML internal links: kept as `href="file.html"` since they're all in the same directory

### 3. Scripts & Tools
- Created and used `update_paths.sh` script to automatically update file paths in HTML files

## Project Structure

```
Elysiar/
├── html/               # All HTML files
│   ├── booking.html
│   ├── dashboard.html
│   ├── history.html
│   ├── index.html
│   ├── login.html
│   ├── payments.html
│   ├── profile.html
│   ├── settings.html
│   └── signup.html
├── css/                # All CSS files
│   ├── auth.css
│   ├── base.css
│   ├── booking.css
│   ├── custom.css
│   ├── dark-theme.css
│   ├── footer.css
│   ├── header.css
│   ├── history.css
│   ├── landing.css
│   ├── maps.css
│   ├── profile-dropdown.css
│   ├── profile.css
│   └── settings.css
├── js/                 # JavaScript files
│   ├── auth.js
│   ├── booking.js
│   ├── dark-theme.js
│   ├── history.js
│   ├── main.js
│   ├── maps.js
│   ├── navigation.js
│   ├── profile.js
│   └── settings.js
└── images/             # Image files
```

## Completed Tasks

1. ✅ **Clean up root directory**: Original HTML files have been removed from the root directory.
2. ✅ **Updated paths**: All resource paths in HTML files have been updated to use relative paths.
3. ✅ **File organization**: Files have been properly organized by type into dedicated directories.

## TODO

1. **Update entry point**: If the application has a specific entry point or is deployed through a server, update configuration to point to the HTML files in the html directory.
2. **Testing**: Thoroughly test all pages to ensure that all links, images, and functionality work correctly after the restructuring.
3. **Update documentation**: Update any project documentation to reflect the new file structure.

## Notes on File Organization

### Benefits of the New Structure
- **Separation of Concerns**: Clear separation between HTML, CSS, JavaScript, and images
- **Improved Maintainability**: Easier to find and update files
- **Cleaner Root Directory**: Less clutter in the root directory
- **Better for Version Control**: Clearer differentiation between file types when looking at changes
- **Scalability**: Easier to add new features and pages with a consistent structure
