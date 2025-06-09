# Ride-Hailing Website Clone Project Documentation

## Project Overview
This project is a fully responsive and visually enhanced clone of Uber/Ola ride-hailing websites, built using only HTML, CSS, and Vanilla JavaScript (no frameworks or libraries). The website offers a modern and appealing UI/UX with smooth animations, clean layouts, and intuitive navigation.

## Features Implemented

### Core Features
1. **Ride Booking System**
   - Pickup & drop location selection with Google Maps integration
   - Vehicle type selection with pricing
   - Fare estimates based on distance and vehicle type
   - Booking confirmation flow

2. **Authentication System**
   - Login and signup pages with validation
   - Multi-step registration process
   - Password strength meter
   - Social login options

3. **Trip History & Receipts**
   - Comprehensive trip history page
   - Detailed receipt modal with fare breakdown
   - Filtering and search functionality
   - Export options for receipts

4. **Responsive Design**
   - Fully responsive layout for desktop, tablet, and mobile
   - Bottom navigation for mobile devices
   - Optimized UI components for different screen sizes

### Value-Added Features
1. **Dark Theme**
   - Exclusive dark theme design across all pages
   - Optimized contrast ratios for better readability
   - Elegant dark UI components (inputs, cards, buttons, etc.)
   - OLED/AMOLED screen optimization

2. **Ride Sharing**
   - Pool option for sharing with strangers
   - Split fare option for sharing with friends
   - Interactive seat selection slider
   - Dynamic fare adjustment based on sharing options

3. **Driver Rating System**
   - Star rating interface
   - Feedback tags for quick feedback
   - Comment section for detailed feedback
   - Rating submission flow

## Project Structure

### HTML Files
- `index.html` - Landing page
- `booking.html` - Ride booking page
- `login.html` - User login page
- `signup.html` - User registration page
- `history.html` - Trip history page

### CSS Files
- `base.css` - Reset, common styles, and core color variables
- `dark-theme.css` - Dark theme specific styles
- `header.css` - Header and navigation styles
- `footer.css` - Footer styles
- `landing.css` - Landing page styles
- `booking.css` - Booking page styles
- `auth.css` - Authentication pages styles
- `history.css` - Trip history page styles
- `maps.css` - Google Maps integration styles

### JavaScript Files
- `main.js` - Main application logic
- `maps.js` - Google Maps integration
- `booking.js` - Ride booking functionality
- `auth.js` - Authentication functionality
- `history.js` - Trip history functionality
- `dark-theme.js` - Dark theme implementation

### Documentation Files
- `project_outline.md` - Initial project outline
- `design_system.md` - Design system documentation
- `ui_ux_mockups.md` - UI/UX mockups
- `todo.md` - Project task checklist

## Google Maps Integration
The website integrates with Google Maps API for:
- Location autocomplete for pickup/drop
- Route visualization and distance calculation
- Live location pin on map
- Fare estimation based on distance

To use the Google Maps functionality with your own API key:
1. Open `maps.js`
2. Replace `YOUR_API_KEY` with your actual Google Maps API key
3. Ensure you have enabled the necessary Google Maps APIs in your Google Cloud Console

## Usage Instructions
1. Open `index.html` to view the landing page
2. Navigate to "Book a Ride" to access the booking functionality
3. Use the login/signup pages to simulate authentication
4. View trip history and receipts in the history page
5. Enjoy the elegant dark theme design throughout the application

## Browser Compatibility
The website is compatible with:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Safari (latest)
- Microsoft Edge (latest)

## Future Enhancements
Potential areas for future development:
- Backend integration for real authentication and data persistence
- Real-time notifications system
- In-app chat with driver
- Multiple language support
- Accessibility improvements

## Credits
- Font Awesome for icons
- Google Maps Platform for mapping functionality
- Placeholder images used for demonstration purposes only
