# Elysiar - Modern Ride-Hailing Service

Elysiar is a comprehensive web-based ride-hailing platform that provides users with a seamless transportation experience. The application offers various vehicle options, real-time tracking, multiple payment methods, and a user-friendly interface.

![Elysiar Logo](images/logo.png)

## Table of Contents

- [Features](#features)
- [Pages and Functionality](#pages-and-functionality)
- [Vehicle Types](#vehicle-types)
- [Loyalty Points System](#loyalty-points-system)
- [User Interface](#user-interface)
- [Installation and Setup](#installation-and-setup)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Features

- **Multiple Ride Options**: Standard rides, premium rides, airport transfers, and intercity travel
- **Real-Time Tracking**: Live tracking of drivers with ETA updates
- **Booking Management**: Schedule rides in advance, add stops, and select special requirements
- **User Profiles**: Save addresses, manage payment methods, and view ride history
- **Loyalty Points System**: Earn and redeem points for discounts on rides
- **Dark Mode Support**: Toggle between light and dark themes for better user experience
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Payment Integration**: Multiple payment methods including credit cards and PayPal
- **Safety Features**: Driver verification, trip sharing, and emergency assistance

## Pages and Functionality

### Main Pages
- **Home/Landing Page**: Overview of services with call-to-action buttons
- **Booking**: Main interface for booking rides with options for vehicle selection
- **Premium Ride**: Luxury ride options with additional amenities
- **Airport Transfers**: Specialized service for airport pickups and drop-offs
- **Intercity Travel**: Long-distance travel between cities
- **Dashboard**: User statistics, recent rides, and quick booking
- **Profile**: Manage personal information, saved addresses, and preferences
- **History**: Detailed ride history with receipts and rebooking options
- **Payments**: Add and manage payment methods
- **Settings**: App preferences, notification settings, and privacy controls
- **FAQ**: Commonly asked questions and answers
- **Support**: Contact options and help resources

### Authentication
- **Login**: User authentication with email/password
- **Signup**: New user registration with welcome bonus points
- **Password Recovery**: Reset forgotten passwords

## Vehicle Types

Elysiar offers a diverse fleet of vehicles to meet different user needs:

1. **Bike**: Quick and eco-friendly option for solo travelers
2. **Economy**: Affordable rides for everyday travel (up to 4 passengers)
3. **Premium**: High-end vehicles with extra comfort (up to 4 passengers)
4. **SUV**: Spacious vehicles for larger groups (up to 6 passengers)
5. **Green**: Eco-friendly electric vehicles (up to 4 passengers)
6. **Bus**: Perfect for large groups and events (up to 20 passengers)

## Loyalty Points System

Elysiar features a comprehensive loyalty program that rewards users for their rides:

### Earning Points
- **Ride Completion**: Each ride above ₹100 earns 10 points
- **Ratings**: Earn 2 points when you rate a driver
- **Driver Ratings**: Earn 2 points when a driver rates you
- **Welcome Bonus**: New users receive 50 points upon signing up

### Point Value
- Each loyalty point is worth ₹1 in ride credit

### Redemption
- Points can be applied during the booking process
- Users can see their current point balance and the equivalent monetary value
- The "Apply Loyalty Points" button in the booking interface allows for easy redemption
- Points can be applied to reduce the fare of the current ride

### Benefits
- Encourages customer retention and repeat bookings
- Promotes positive interactions through the rating system
- Creates a rewarding experience for frequent users

## User Interface

Elysiar features a modern, intuitive user interface designed for ease of use:

### Design Elements
- **Clean Layout**: Minimalist design with well-organized sections
- **Intuitive Navigation**: Easy-to-use header navigation and logical user flows
- **Visual Feedback**: Interactive elements provide clear feedback on user actions
- **Consistent Styling**: Unified color schemes and component designs across all pages

### UI Components
- **Cards**: For displaying vehicle options, history items, and features
- **Toggle Switches**: For enabling/disabling options like scheduling and dark mode
- **Interactive Maps**: For visualizing routes and driver locations
- **Rating System**: Star-based ratings for drivers and rides
- **Form Controls**: User-friendly inputs for location selection and preferences

### Responsive Design
- Mobile-first approach ensures usability on smartphones
- Adaptive layouts for tablets and desktop devices
- Touch-optimized controls for mobile users

### Dark Mode
- Toggle between light and dark themes
- Automatic detection of system preferences
- Reduced eye strain in low-light environments

## Installation and Setup

1. Clone the repository
2. No build process required - this is a static HTML/CSS/JS website
3. Open `index.html` in a web browser to view the site
4. For testing mobile navigation, use the provided VS Code task:
   - Run the task "Test Mobile Navigation" to open the site at http://localhost:8000

## Technology Stack

- **Frontend**:
  - HTML5
  - CSS3 (with custom properties for theming)
  - JavaScript (ES6+)
  - Font Awesome for icons
  - Google Fonts for typography

- **No Backend Required**:
  - The project uses local storage for demo functionality
  - In a production environment, this would connect to a backend service

## Project Structure

```
Elysiar/
├── css/                  # Stylesheet files
│   ├── auth.css          # Authentication styling
│   ├── base.css          # Base styles and variables
│   ├── booking.css       # Booking page styles
│   ├── components.css    # Reusable component styles
│   ├── dark-theme.css    # Dark mode styling
│   └── ...               # Additional page-specific styles
├── html/                 # HTML files for all pages
│   ├── airport_transfers.html
│   ├── booking.html
│   ├── dashboard.html
│   ├── index.html        # Landing page
│   └── ...               # Additional page files
├── images/               # Image assets
│   ├── bike.jpg
│   ├── car1.jpg
│   └── ...               # Additional image files
├── js/                   # JavaScript files
│   ├── auth.js           # Authentication functionality
│   ├── booking.js        # Booking page functionality
│   ├── maps.js           # Maps integration
│   └── ...               # Additional functionality files
├── index.html            # Redirect to main page
├── cleanup_root.sh       # Utility script
└── update_paths.sh       # Utility script
```

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request
