import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import http from 'http';
import { WebSocketServer } from 'ws';
import { URL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ 
  server,
  path: '/ws'
});

app.use(cors());
app.use(express.json());

// Store active rides and their WebSocket connections
const activeRides = new Map();
const activeDrivers = new Map();

// Mock driver data
const drivers = [
  {
    id: 'driver1',
    name: 'John Smith',
    phone: '+352 691 123 456',
    vehicle: {
      make: 'Mercedes',
      model: 'E-Class',
      licensePlate: 'LU 1234',
    },
  },
  {
    id: 'driver2',
    name: 'Marie Weber',
    phone: '+352 691 789 012',
    vehicle: {
      make: 'BMW',
      model: '5 Series',
      licensePlate: 'LU 5678',
    },
  },
];

// Helper function to send WebSocket updates
const sendUpdate = (rideId, data) => {
  const ws = activeRides.get(rideId);
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify(data));
  }
};

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const rideId = pathname.split('/').pop();
  
  console.log(`New WebSocket connection for ride: ${rideId}`);
  
  if (rideId) {
    activeRides.set(rideId, ws);
    
    // Send initial connection success message
    ws.send(JSON.stringify({ type: 'connected', rideId }));
    
    ws.on('close', () => {
      console.log(`WebSocket closed for ride: ${rideId}`);
      activeRides.delete(rideId);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for ride ${rideId}:`, error);
    });
  }
});

// API Routes
app.post('/api/rides', (req, res) => {
  const { pickupLocation, dropoffLocation } = req.body;
  const rideId = Math.random().toString(36).substring(7);
  const driver = drivers[Math.floor(Math.random() * drivers.length)];
  
  console.log('New ride request:', { pickupLocation, dropoffLocation });
  
  const ride = {
    id: rideId,
    request: {
      pickupLocation,
      dropoffLocation,
    },
    driver: null,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Simulate finding a driver after 3 seconds
  setTimeout(() => {
    ride.driver = driver;
    ride.status = 'accepted';
    ride.updatedAt = new Date().toISOString();
    
    console.log(`Driver ${driver.name} accepted ride ${rideId}`);
    sendUpdate(rideId, ride);

    // Simulate driver arriving after 10 seconds
    setTimeout(() => {
      ride.status = 'arrived';
      ride.updatedAt = new Date().toISOString();
      
      console.log(`Driver arrived for ride ${rideId}`);
      sendUpdate(rideId, ride);

      // Simulate ride completion after 20 seconds
      setTimeout(() => {
        ride.status = 'completed';
        ride.updatedAt = new Date().toISOString();
        
        console.log(`Ride ${rideId} completed`);
        sendUpdate(rideId, ride);
      }, 20000);
    }, 10000);
  }, 3000);

  res.json(ride);
});

app.post('/api/rides/:id/cancel', (req, res) => {
  const { id } = req.params;
  console.log(`Cancelling ride ${id}`);
  
  const ride = {
    id,
    status: 'cancelled',
    updatedAt: new Date().toISOString(),
  };
  
  sendUpdate(id, ride);
  res.sendStatus(200);
});

app.get('/api/rides/:id', (req, res) => {
  const { id } = req.params;
  const driver = drivers[Math.floor(Math.random() * drivers.length)];
  
  const ride = {
    id,
    driver,
    status: 'pending',
    updatedAt: new Date().toISOString(),
  };
  
  console.log(`Fetching ride ${id}:`, ride);
  res.json(ride);
});

app.get('/api/drivers/:id/location', (req, res) => {
  const { id } = req.params;
  // Return a random location near Luxembourg City
  const baseLat = 49.6116;
  const baseLng = 6.1319;
  
  const location = {
    coordinates: [
      baseLng + (Math.random() - 0.5) * 0.02,
      baseLat + (Math.random() - 0.5) * 0.02,
    ],
    heading: Math.random() * 360,
    speed: 30 + Math.random() * 20,
    timestamp: Date.now(),
  };
  
  console.log(`Driver ${id} location:`, location);
  res.json(location);
});

const PORT = process.env.PORT || 9174;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
