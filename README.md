# Luxembourg Taxi Platform 

A modern, feature-rich taxi booking platform built specifically for Luxembourg's transportation market. This platform provides a seamless experience for booking and tracking taxi rides across Luxembourg.

[Edit in StackBlitz next generation editor ](https://stackblitz.com/~/github.com/casadrives/godaddy)

## Features

- **Real-time Ride Booking**
  - Instant driver matching
  - Dynamic surge pricing
  - Multiple payment methods (Card/Cash)
  - Scheduled rides
  - Special instructions for drivers
  - Passenger count selection

- **Live Tracking**
  - Real-time driver location
  - Estimated arrival time
  - Route visualization
  - Driver details and vehicle information

- **Admin Dashboard**
  - Secure authentication system
  - Ride management
  - Driver oversight
  - Analytics and reporting

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/luxembourg-taxi-platform.git
cd luxembourg-taxi-platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add:
```env
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - RxJS
  - Lucide Icons
  - MapBox

- **State Management**
  - RxJS BehaviorSubject
  - React Context

- **Authentication**
  - Custom JWT implementation
  - Secure session management

## Key Components

- `BookRide`: Main ride booking interface
- `DriverTrackingModal`: Real-time driver tracking
- `AdminDashboard`: Administrative control panel
- `AdminLogin`: Secure admin authentication

## Security Features

- Secure admin authentication
- Password hashing
- Session management
- Protected routes
- Input validation

## Localization

Currently supports:
- English
- French
- German
- Luxembourgish

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Default Credentials

For testing purposes:
- **Admin Login**
  - Username: `admincasa`
  - Password: `admin123`

Remember to change these credentials in production!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Mapbox for mapping services
- Lucide for beautiful icons
- The Luxembourg transportation community

## Support

For support, email support@luxembourgtaxi.com or join our Slack channel.