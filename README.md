# CasaDrives 🚗

A modern ride-sharing platform built with React, TypeScript, and Mapbox.

## Features 🌟

- Real-time ride tracking with WebSocket
- Interactive map interface using Mapbox
- Toast notifications for ride updates
- PWA support for mobile installation
- Responsive design for all devices
- WebSocket-based real-time updates
- Modern UI with Tailwind CSS and Framer Motion

## Tech Stack 💻

- **Frontend:**
  - React 18 with TypeScript
  - Vite for fast development
  - TailwindCSS for styling
  - Framer Motion for animations
  - React Query for data fetching
  - Zustand for state management
  - Mapbox GL for maps

- **Backend:**
  - Express.js server
  - WebSocket for real-time communication
  - CORS support
  - Mock API endpoints

## Prerequisites 📋

- Node.js 18+ and npm
- Mapbox API key
- Modern web browser
- VS Code with recommended extensions

## Getting Started 🚀

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd casadrives
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update the Mapbox token and other configurations

4. **Start development servers:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## Development 🛠️

### VS Code Setup

1. Install recommended extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - And more (see `.vscode/extensions.json`)

2. Enable format on save:
   - Already configured in `.vscode/settings.json`
   - Uses Prettier for formatting
   - ESLint for code quality

### Available Scripts

- `npm run dev` - Start development servers (frontend + backend)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run server` - Run backend server only

### Project Structure

```
casadrives/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── server.js              # Backend server
├── public/                # Static assets
└── scripts/               # Build scripts
```

## Features in Detail 📝

### Ride Booking Flow

1. User enters pickup and destination
2. System finds nearby drivers
3. Real-time driver location tracking
4. Live ETA updates
5. Ride status notifications

### Real-time Updates

- WebSocket connection for live updates
- Automatic reconnection
- Efficient data synchronization
- Status change notifications

### Map Integration

- Interactive Mapbox maps
- Real-time location tracking
- Route visualization
- Custom markers and overlays

## Contributing 🤝

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- Mapbox for mapping services
- React team for the awesome framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and supporters

---

Made with ❤️ by the CasaDrives team
