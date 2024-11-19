# CasaDrives - Luxembourg's Premier Taxi Platform

A modern, feature-rich taxi booking platform built specifically for Luxembourg's transportation market. This platform provides a seamless experience for booking and tracking taxi rides across Luxembourg.

## 🚀 Features

- **Real-time Ride Booking**
  - Instant driver matching
  - Dynamic surge pricing
  - Multiple payment methods
  - Scheduled rides
  - Special instructions
  - Passenger count selection

- **Live Tracking**
  - Real-time driver location
  - Estimated arrival time
  - Route visualization
  - Driver details

- **Admin Dashboard**
  - User management
  - Driver management
  - Company management
  - Analytics and reporting
  - Payment processing

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: Zustand + React Query
- **Maps**: Mapbox GL
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Analytics**: Sentry + Custom Analytics
- **Payments**: Stripe

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/casadrives/godaddy.git
   cd godaddy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update environment variables in `.env`

5. Start the development server:
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and update the following variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_MAPBOX_TOKEN`: Your Mapbox access token
- `VITE_STRIPE_PUBLIC_KEY`: Your Stripe public key
- `VITE_SENTRY_DSN`: Your Sentry DSN

## 🚀 Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Preview the build:
   ```bash
   npm run preview
   ```

3. Deploy to your hosting service of choice (e.g., Netlify, Vercel)

## 🧪 Testing

- Run unit tests:
  ```bash
  npm test
  ```

- Run E2E tests:
  ```bash
  npm run test:e2e
  ```

- Run tests with coverage:
  ```bash
  npm run test:coverage
  ```

## 📚 Documentation

For detailed documentation, please visit our [Wiki](https://github.com/casadrives/godaddy/wiki).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- Product Owner: [Your Name]
- Lead Developer: [Your Name]
- UI/UX Designer: [Your Name]

## 📞 Support

For support, please email support@casadrives.com or join our [Discord community](https://discord.gg/casadrives).