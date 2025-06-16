# Elysiar - Premium Ride-Hailing Service

## Project Overview
Elysiar is a fully responsive and visually enhanced ride-hailing website, built using only HTML, CSS, and Vanilla JavaScript (no frameworks or libraries). The website offers a modern and appealing UI/UX with smooth animations, clean layouts, and intuitive navigation designed for optimal user experience across all devices.

![Elysiar Logo](/images/logo.png)

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

4. **Loyalty Points Program**
   - Earn 10 points for every ride above ₹100
   - Additional 2 points for rating drivers or being rated
   - 1 point = ₹1 redemption value
   - Points can be applied to future rides
   - Points balance tracking in user profile
   - Points redemption at checkout

## User Interface & Design

### Modern UI Elements
- **Clean, Minimalist Design**: Sleek interface with ample white space for better readability
- **Card-Based Layout**: Information organized in elegant card components for better visual hierarchy
- **Subtle Animations**: Smooth micro-interactions and transitions for enhanced user engagement
- **Custom Icons & Graphics**: Premium iconography and illustrations for a unique brand identity
- **Intuitive Navigation**: User-friendly menu structure with logical information architecture

### Visual Design Features
- **Color Scheme**: Modern palette with primary brand colors and complementary accents
- **Typography**: Contemporary sans-serif fonts optimized for both headings and body text
- **Gradient Elements**: Subtle color gradients applied to key UI components
- **Shadow Effects**: Layered design with subtle shadows for depth and hierarchy
- **Consistent Components**: Unified design language across all pages and elements

### Responsive Behaviors
- **Mobile-First Approach**: Optimized for smartphone screens with adaptive layouts
- **Touch-Friendly Controls**: Larger tap targets and swipe gestures on mobile
- **Conditional Rendering**: Different component layouts based on screen size
- **Flexible Grid System**: Fluid layout that adjusts gracefully across breakpoints
- **Optimized Images**: Responsive image loading based on device capabilities

## Project Structure

### HTML Files
- `index.html` - Landing page with service overview
- `booking.html` - Ride booking interface with map integration
- `login.html` - User login page with validation
- `signup.html` - User registration page with multi-step flow
- `history.html` - Trip history with receipt access
- `profile.html` - User profile with loyalty points dashboard
- `settings.html` - User preferences and account settings
- `support.html` - Customer support interface
- `faq.html` - Frequently asked questions
- `contact.html` - Contact form and information
- `payment.html` - Payment methods and loyalty points redemption
- `standard_ride.html` - Standard ride service details
- `premium_ride.html` - Premium ride service details
- `airport_transfers.html` - Airport transfer service details
- `intercity_travel.html` - Intercity travel service details
- `navbar.html` - Navigation bar component for inclusion
- `footer.html` - Footer component for inclusion

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
- `profile.css` - User profile styles
- `settings.css` - Settings page styles
- `support.css` - Support page styles
- `faq.css` - FAQ page styles
- `contact.css` - Contact page styles
- `payments.css` - Payment methods page styles
- `components.css` - Reusable component styles
- `ride-types.css` - Ride type selection styles
- `vehicle-gallery.css` - Vehicle gallery styles
- `custom.css` - Custom overrides and additional styles
- `dashboard.css` - User dashboard styles

### JavaScript Files
- `main.js` - Main application logic
- `maps.js` - Google Maps integration
- `booking.js` - Ride booking functionality
- `auth.js` - Authentication functionality
- `history.js` - Trip history functionality
- `dark-theme.js` - Dark theme implementation
- `profile.js` - User profile management
- `payments.js` - Payment processing and loyalty points
- `ride-types.js` - Ride type selection logic
- `settings.js` - User settings management
- `faq.js` - FAQ accordion functionality
- `navbar.js` - Navigation bar behavior
- `footer.js` - Footer functionality
- `include-navbar.js` - Dynamic navbar inclusion
- `path-helper.js` - Path manipulation utilities
- `update_css.js` - CSS update utilities

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

## Loyalty Points System Implementation

The Elysiar Loyalty Program rewards users for their continued patronage with points that can be redeemed for ride discounts.

### Point Earning
- **Ride Completion**: 10 points awarded for every ride with fare above ₹100
- **Rating Engagement**: 2 points for rating a driver after a ride
- **Driver Ratings**: 2 points when the user receives a rating from the driver

### Point Redemption
- **Conversion Rate**: 1 point = ₹1 value when applied to rides
- **Redemption Flow**: Points can be selected for use during checkout
- **Minimum Balance**: No minimum balance required for redemption
- **Partial Redemption**: Users can choose how many points to redeem
- **Balance Tracking**: Real-time points balance visible in user profile

### Technical Implementation
- Points are stored in user profile data
- Points history is maintained with transaction details
- Points expiration set to 12 months from earning date
- Points balance is prominently displayed in the user dashboard
- Notification system for point earnings and approaching expiration

## Usage Instructions
1. Open `index.html` to view the landing page
2. Navigate to "Book a Ride" to access the booking functionality
3. Use the login/signup pages to simulate authentication
4. View trip history and receipts in the history page
5. Check your loyalty points balance in the profile section
6. Redeem points during checkout by selecting the "Use Points" option
7. Toggle between light and dark theme using the theme switch in settings
8. Explore different ride types through the vehicle selection screen

## Running Locally
1. Clone the repository to your local machine
2. Navigate to the project root directory
3. To test mobile responsive design, run:
   ```
   python -m http.server 8000
   ```
4. Open your browser and navigate to `http://localhost:8000`
5. Or simply open the index.html file in your preferred browser

## Browser Compatibility
The website is compatible with:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Safari (latest)
- Microsoft Edge (latest)
- Mobile browsers (Chrome for Android, Safari for iOS)

## Future Enhancements
Potential areas for future development:
- Backend integration for real authentication and data persistence
- Real-time notifications system
- In-app chat with driver
- Multiple language support
- Accessibility improvements
- Loyalty points tier system with premium benefits
- Referral program integration with loyalty points
- Corporate account management with loyalty program analytics

## Credits
- Font Awesome for icons
- Google Maps Platform for mapping functionality
- Placeholder images used for demonstration purposes only
- Custom UI components built in-house for optimal performance
