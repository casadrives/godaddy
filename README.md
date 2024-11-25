# Pantera Ride-Sharing Application

A modern, secure, and scalable ride-sharing platform built with React, TypeScript, and Node.js.

## Features

- 🚗 Real-time ride tracking and matching
- 👤 Multi-role user system (Riders, Drivers, Companies, Admins)
- 💳 Secure payment processing
- 📱 Responsive web design
- 🔒 Advanced security features
- 📊 Comprehensive admin dashboard
- 🗺️ Real-time location tracking
- ⭐ Rating and review system

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Redux Toolkit
  - React Router 6

- **Backend:**
  - Node.js
  - Express.js
  - PostgreSQL with PostGIS
  - TypeORM
  - JWT Authentication

- **DevOps:**
  - Docker
  - GitHub Actions
  - AWS/Digital Ocean
  - Nginx

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+ with PostGIS
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pantera.git
cd pantera
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
# Create database
createdb pantera_db

# Run migrations
npm run migrate
```

5. Start the development server:
```bash
npm run dev
```

### Database Setup

1. Install PostgreSQL and PostGIS:
```bash
# Windows (using Chocolatey)
choco install postgresql
choco install postgis
```

2. Create the database:
```sql
CREATE DATABASE pantera_db;
```

3. Run migrations:
```bash
npm run migrate
```

## Development

### Branch Strategy

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `release/*`: Release preparation

### Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e

# Run with coverage
npm run test:coverage
```

### Building

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## Deployment

The application uses GitHub Actions for CI/CD:

1. Push to `develop` branch:
   - Runs tests
   - Builds application
   - Deploys to staging

2. Push to `main` branch:
   - Runs tests
   - Builds application
   - Deploys to production

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- SQL injection protection
- XSS protection
- CSRF protection
- Security headers
- Input validation
- Output sanitization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@pantera.com or join our Slack channel.

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [PostGIS](https://postgis.net/)
- [Tailwind CSS](https://tailwindcss.com/)
