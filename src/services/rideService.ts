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
  private maxRetries = 3;
  private retryDelay = 1000;

  private async retryOperation<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: any;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        if (attempt === this.maxRetries) break;
        
        console.log(`Attempt ${attempt} failed, retrying in ${this.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }
    throw lastError;
  }

  private handleError(error: any, context: string): never {
    console.error(`${context} error:`, error);
    throw {
      message: error.response?.data?.message || `Failed to ${context.toLowerCase()}. Please try again.`,
      status: error.response?.status || 500,
      errors: error.response?.data?.errors
    };
  }

  async requestRide(request: RideRequest): Promise<Ride> {
    try {
      return await this.retryOperation(async () => {
        const response = await api.post('/rides', request);
        return response.data;
      });
    } catch (error) {
      this.handleError(error, 'Request ride');
    }
  }

  async cancelRide(rideId: string): Promise<void> {
    try {
      await this.retryOperation(async () => {
        await api.post(`/rides/${rideId}/cancel`);
      });
      this.unsubscribeFromRideUpdates(rideId);
    } catch (error) {
      this.handleError(error, 'Cancel ride');
    }
  }

  async getRideStatus(rideId: string): Promise<Ride> {
    try {
      return await this.retryOperation(async () => {
        const response = await api.get(`/rides/${rideId}`);
        return response.data;
      });
    } catch (error) {
      this.handleError(error, 'Get ride status');
    }
  }

  subscribeToRideUpdates(rideId: string, onUpdate: (ride: Ride) => void): () => void {
    this.unsubscribeFromRideUpdates(rideId);

    const handleError = (error: any) => {
      console.error('Ride update subscription error:', error);
      onUpdate({ ...error, status: 'error' } as Ride);
    };

    try {
      wsService.connect();
      const unsubscribe = wsService.subscribe<Ride>(`ride:${rideId}`, 
        (ride) => {
          try {
            onUpdate(ride);
          } catch (error) {
            handleError(error);
          }
        }
      );

      this.activeSubscriptions.set(rideId, unsubscribe);
      return () => this.unsubscribeFromRideUpdates(rideId);
    } catch (error) {
      handleError(error);
      return () => {};
    }
  }

  private unsubscribeFromRideUpdates(rideId: string): void {
    const unsubscribe = this.activeSubscriptions.get(rideId);
    if (unsubscribe) {
      unsubscribe();
      this.activeSubscriptions.delete(rideId);
    }
  }

  async getDriverLocation(driverId: string): Promise<{ coordinates: [number, number]; heading: number }> {
    try {
      return await this.retryOperation(async () => {
        const response = await api.get(`/drivers/${driverId}/location`);
        return response.data;
      });
    } catch (error) {
      this.handleError(error, 'Get driver location');
    }
  }

  subscribeToDriverLocation(driverId: string, onUpdate: (location: { coordinates: [number, number]; heading: number }) => void): () => void {
    try {
      wsService.connect();
      return wsService.subscribe<{ coordinates: [number, number]; heading: number }>(`driver:${driverId}:location`, onUpdate);
    } catch (error) {
      console.error('Driver location subscription error:', error);
      return () => {};
    }
  }
}

export const rideService = new RideService();
