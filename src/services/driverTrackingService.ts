import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { BehaviorSubject, Subscription } from 'rxjs';
import { gpsService, Location } from './gpsService';
import { config } from '../config/production';
import { logError, logEvent } from '../utils/monitoring';

type DriverLocation = Database['public']['Tables']['driver_locations']['Row'];

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

export const driverTrackingService = {
  ...new DriverTrackingService(),
  // Update driver location
  async updateLocation(driverId: string, latitude: number, longitude: number) {
    try {
      const { data, error } = await supabase
        .from('driver_locations')
        .upsert({
          driver_id: driverId,
          latitude,
          longitude,
          last_updated: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update location error:', error);
      throw error;
    }
  },

  // Get driver's current location
  async getDriverLocation(driverId: string) {
    try {
      const { data, error } = await supabase
        .from('driver_locations')
        .select('*')
        .eq('driver_id', driverId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get driver location error:', error);
      throw error;
    }
  },

  // Subscribe to driver location updates
  subscribeToLocationUpdates(driverId: string, callback: (location: DriverLocation) => void) {
    return supabase
      .channel(`driver-location-${driverId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'driver_locations',
          filter: `driver_id=eq.${driverId}`
        },
        (payload) => {
          callback(payload.new as DriverLocation);
        }
      )
      .subscribe();
  },

  // Get nearby drivers
  async getNearbyDrivers(latitude: number, longitude: number, radiusKm: number = 5) {
    try {
      // Using PostGIS to calculate nearby drivers
      const { data, error } = await supabase.rpc('get_nearby_drivers', {
        p_latitude: latitude,
        p_longitude: longitude,
        p_radius_km: radiusKm
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get nearby drivers error:', error);
      throw error;
    }
  },

  // Start driver shift
  async startShift(driverId: string) {
    try {
      const { data, error } = await supabase
        .from('driver_shifts')
        .insert({
          driver_id: driverId,
          start_time: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Start shift error:', error);
      throw error;
    }
  },

  // End driver shift
  async endShift(driverId: string, shiftId: string) {
    try {
      const { data, error } = await supabase
        .from('driver_shifts')
        .update({
          end_time: new Date().toISOString()
        })
        .eq('id', shiftId)
        .eq('driver_id', driverId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('End shift error:', error);
      throw error;
    }
  },

  // Get driver's current shift
  async getCurrentShift(driverId: string) {
    try {
      const { data, error } = await supabase
        .from('driver_shifts')
        .select('*')
        .eq('driver_id', driverId)
        .is('end_time', null)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get current shift error:', error);
      throw error;
    }
  }
};
