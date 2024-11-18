import api from '../utils/api';
import { wsService } from './websocketService';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: {
    make: string;
    model: string;
    licensePlate: string;
  };
}

export interface RideRequest {
  pickupLocation: {
    address: string;
    coordinates: [number, number];
  };
  dropoffLocation: {
    address: string;
    coordinates: [number, number];
  };
}

export interface Ride {
  id: string;
  request: RideRequest;
  driver: Driver | null;
  status: 'pending' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

class RideService {
  private activeSubscriptions: Map<string, () => void> = new Map();

  async requestRide(request: RideRequest): Promise<Ride> {
    const response = await api.post('/rides', request);
    return response.data;
  }

  async cancelRide(rideId: string): Promise<void> {
    await api.post(`/rides/${rideId}/cancel`);
    this.unsubscribeFromRideUpdates(rideId);
  }

  async getRideStatus(rideId: string): Promise<Ride> {
    const response = await api.get(`/rides/${rideId}`);
    return response.data;
  }

  subscribeToRideUpdates(rideId: string, onUpdate: (ride: Ride) => void): () => void {
    // Unsubscribe from any existing subscription for this ride
    this.unsubscribeFromRideUpdates(rideId);

    // Connect WebSocket if not already connected
    wsService.connect();

    // Subscribe to ride updates
    const unsubscribe = wsService.subscribe<Ride>(`ride:${rideId}`, (ride) => {
      onUpdate(ride);
    });

    // Store the unsubscribe function
    this.activeSubscriptions.set(rideId, unsubscribe);

    return () => this.unsubscribeFromRideUpdates(rideId);
  }

  private unsubscribeFromRideUpdates(rideId: string): void {
    const unsubscribe = this.activeSubscriptions.get(rideId);
    if (unsubscribe) {
      unsubscribe();
      this.activeSubscriptions.delete(rideId);
    }
  }

  async getDriverLocation(driverId: string): Promise<{ coordinates: [number, number]; heading: number }> {
    const response = await api.get(`/drivers/${driverId}/location`);
    return response.data;
  }

  subscribeToDriverLocation(driverId: string, onUpdate: (location: { coordinates: [number, number]; heading: number }) => void): () => void {
    wsService.connect();
    return wsService.subscribe<{ coordinates: [number, number]; heading: number }>(`driver:${driverId}:location`, onUpdate);
  }
}

export const rideService = new RideService();
