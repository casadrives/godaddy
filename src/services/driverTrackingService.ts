import { BehaviorSubject, Subscription } from 'rxjs';
import { gpsService, Location } from './gpsService';
import { config } from '../config/production';
import { logError, logEvent } from '../utils/monitoring';

interface TrackingState {
  isTracking: boolean;
  currentLocation: Location | null;
  rideId: string | null;
}

class DriverTrackingService {
  private state = new BehaviorSubject<TrackingState>({
    isTracking: false,
    currentLocation: null,
    rideId: null,
  });

  private locationSubscription: Subscription | null = null;

  public async startTracking(rideId: string): Promise<void> {
    const hasPermission = await gpsService.requestPermission();
    if (!hasPermission) {
      throw new Error('GPS permission denied');
    }

    this.state.next({
      isTracking: true,
      currentLocation: null,
      rideId,
    });

    gpsService.startTracking();

    this.locationSubscription = gpsService.location$.subscribe({
      next: async (location) => {
        if (location) {
          this.state.next({
            ...this.state.value,
            currentLocation: location,
          });

          try {
            await this.updateLocationOnServer(rideId, location);
          } catch (error) {
            logError(error as Error, {
              context: 'Location Update',
              rideId,
              location,
            });
          }
        }
      },
      error: (error) => {
        logError(error, {
          context: 'GPS Tracking',
          rideId,
        });
      },
    });

    logEvent('tracking_started', { rideId });
  }

  public stopTracking(): void {
    const { rideId } = this.state.value;
    
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
      this.locationSubscription = null;
    }

    gpsService.stopTracking();

    this.state.next({
      isTracking: false,
      currentLocation: null,
      rideId: null,
    });

    if (rideId) {
      logEvent('tracking_stopped', { rideId });
    }
  }

  private async updateLocationOnServer(rideId: string, location: Location): Promise<void> {
    const response = await fetch(`${config.api.baseUrl}/api/${config.api.version}/driver/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rideId,
        ...location,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update location: ${response.statusText}`);
    }
  }

  public get state$() {
    return this.state.asObservable();
  }
}

export const driverTrackingService = new DriverTrackingService();
