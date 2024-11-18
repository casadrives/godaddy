import { BehaviorSubject } from 'rxjs';
import { Driver, ActiveRide } from './rideService';

export interface DriverLocation {
  coordinates: [number, number];
  heading: number;
  speed: number;
  timestamp: Date;
}

export interface TrackingUpdate {
  driver: Driver;
  location: DriverLocation;
  ride: ActiveRide;
  estimatedArrival: Date;
}

class TrackingService {
  private static instance: TrackingService;
  private trackingSubject = new BehaviorSubject<TrackingUpdate | null>(null);
  private updateInterval: NodeJS.Timer | null = null;

  private constructor() {}

  public static getInstance(): TrackingService {
    if (!TrackingService.instance) {
      TrackingService.instance = new TrackingService();
    }
    return TrackingService.instance;
  }

  public startTracking(ride: ActiveRide) {
    // In a real app, this would connect to a WebSocket or use server-sent events
    // For demo purposes, we'll simulate movement with setInterval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    const startLocation: [number, number] = [6.13, 49.61];
    const endLocation: [number, number] = ride.status === 'arriving' 
      ? [ride.pickup.coordinates[0], ride.pickup.coordinates[1]]
      : [ride.dropoff.coordinates[0], ride.dropoff.coordinates[1]];
    
    let progress = 0;
    const totalSteps = 100;

    this.updateInterval = setInterval(() => {
      progress = Math.min(progress + 1, totalSteps);
      
      // Interpolate between start and end locations
      const currentLocation: [number, number] = [
        startLocation[0] + (endLocation[0] - startLocation[0]) * (progress / totalSteps),
        startLocation[1] + (endLocation[1] - startLocation[1]) * (progress / totalSteps)
      ];

      // Calculate heading (angle between points)
      const heading = Math.atan2(
        endLocation[1] - startLocation[1],
        endLocation[0] - startLocation[0]
      ) * (180 / Math.PI);

      const update: TrackingUpdate = {
        driver: ride.driver,
        location: {
          coordinates: currentLocation,
          heading,
          speed: 30 + Math.random() * 10, // Random speed between 30-40 km/h
          timestamp: new Date()
        },
        ride,
        estimatedArrival: new Date(Date.now() + ride.estimatedTime * 60000)
      };

      this.trackingSubject.next(update);

      if (progress === totalSteps) {
        this.stopTracking();
      }
    }, 1000);
  }

  public stopTracking() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.trackingSubject.next(null);
  }

  public get trackingUpdates() {
    return this.trackingSubject.asObservable();
  }

  public get currentUpdate() {
    return this.trackingSubject.value;
  }
}

export const trackingService = TrackingService.getInstance();
