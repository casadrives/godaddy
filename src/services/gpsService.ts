import { BehaviorSubject, Observable } from 'rxjs';
import { logError } from '../utils/monitoring';

export interface Location {
  latitude: number;
  longitude: number;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

class GPSService {
  private locationSubject = new BehaviorSubject<Location | null>(null);
  private watchId: number | null = null;

  public location$: Observable<Location | null> = this.locationSubject.asObservable();

  public async requestPermission(): Promise<boolean> {
    try {
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });
      return true;
    } catch (error) {
      logError(error as Error, { context: 'GPS Permission Request' });
      return false;
    }
  }

  public startTracking(): void {
    if (this.watchId !== null) {
      this.stopTracking();
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.locationSubject.next({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        logError(error as Error, { context: 'GPS Tracking' });
        this.locationSubject.error(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  public stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.locationSubject.next(null);
  }
}

export const gpsService = new GPSService();
