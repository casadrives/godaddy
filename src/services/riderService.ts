import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { calculatePrice } from '@/utils/pricing';

type Ride = Database['public']['Tables']['rides']['Row'];
type RideRequest = Omit<Ride, 'id' | 'created_at' | 'status'>;

export const riderService = {
  // Request a new ride
  async requestRide(rideData: RideRequest) {
    try {
      // Calculate estimated price
      const estimatedPrice = await calculatePrice({
        distance: rideData.distance,
        duration: rideData.duration,
        timeOfDay: new Date(),
        serviceType: rideData.service_type
      });

      const { data: ride, error } = await supabase
        .from('rides')
        .insert({
          ...rideData,
          status: 'pending',
          estimated_price: estimatedPrice,
          created_at: new Date().toISOString()
        })
        .select('*, driver:drivers(*), company:companies(*)')
        .single();

      if (error) throw error;

      // Notify nearby drivers
      await this.notifyNearbyDrivers(ride.id, {
        pickup_latitude: ride.pickup_latitude,
        pickup_longitude: ride.pickup_longitude,
        radius_km: 5
      });

      return ride;
    } catch (error) {
      console.error('Error requesting ride:', error);
      throw error;
    }
  },

  // Get nearby drivers
  async getNearbyDrivers(latitude: number, longitude: number, radius_km: number = 5) {
    try {
      const { data: drivers, error } = await supabase
        .rpc('get_nearby_drivers', {
          p_latitude: latitude,
          p_longitude: longitude,
          p_radius_km: radius_km
        });

      if (error) throw error;

      return drivers;
    } catch (error) {
      console.error('Error getting nearby drivers:', error);
      throw error;
    }
  },

  // Cancel a ride
  async cancelRide(rideId: string, reason?: string) {
    try {
      const { data: ride, error } = await supabase
        .from('rides')
        .update({
          status: 'canceled',
          cancellation_reason: reason,
          canceled_at: new Date().toISOString()
        })
        .eq('id', rideId)
        .select()
        .single();

      if (error) throw error;

      return ride;
    } catch (error) {
      console.error('Error canceling ride:', error);
      throw error;
    }
  },

  // Get ride history
  async getRideHistory(userId: string, options: {
    limit?: number;
    offset?: number;
    status?: string[];
  } = {}) {
    try {
      let query = supabase
        .from('rides')
        .select(`
          *,
          driver:drivers(
            id,
            users(
              first_name,
              last_name,
              avatar_url
            )
          ),
          vehicle:vehicles(
            id,
            make,
            model,
            color,
            license_plate
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (options.status && options.status.length > 0) {
        query = query.in('status', options.status);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      const { data: rides, error, count } = await query;

      if (error) throw error;

      return { rides, count };
    } catch (error) {
      console.error('Error getting ride history:', error);
      throw error;
    }
  },

  // Get active ride
  async getActiveRide(userId: string) {
    try {
      const { data: ride, error } = await supabase
        .from('rides')
        .select(`
          *,
          driver:drivers(
            id,
            users(
              first_name,
              last_name,
              avatar_url,
              phone
            )
          ),
          vehicle:vehicles(
            id,
            make,
            model,
            color,
            license_plate
          ),
          driver_location:driver_locations!inner(
            latitude,
            longitude,
            last_updated
          )
        `)
        .eq('user_id', userId)
        .in('status', ['pending', 'accepted', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return ride;
    } catch (error) {
      console.error('Error getting active ride:', error);
      throw error;
    }
  },

  // Rate and review a ride
  async rateRide(rideId: string, rating: number, review?: string) {
    try {
      const { data: ride, error } = await supabase
        .from('rides')
        .update({
          rating,
          review,
          rated_at: new Date().toISOString()
        })
        .eq('id', rideId)
        .select()
        .single();

      if (error) throw error;

      // Update driver's average rating
      if (ride.driver_id) {
        const { error: statsError } = await supabase.rpc('update_driver_stats', {
          p_driver_id: ride.driver_id
        });

        if (statsError) throw statsError;
      }

      return ride;
    } catch (error) {
      console.error('Error rating ride:', error);
      throw error;
    }
  },

  // Save favorite locations
  async saveFavoriteLocation(userId: string, location: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    type?: 'home' | 'work' | 'other';
  }) {
    try {
      const { data: savedLocation, error } = await supabase
        .from('favorite_locations')
        .insert({
          user_id: userId,
          ...location
        })
        .select()
        .single();

      if (error) throw error;

      return savedLocation;
    } catch (error) {
      console.error('Error saving favorite location:', error);
      throw error;
    }
  },

  // Get favorite locations
  async getFavoriteLocations(userId: string) {
    try {
      const { data: locations, error } = await supabase
        .from('favorite_locations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return locations;
    } catch (error) {
      console.error('Error getting favorite locations:', error);
      throw error;
    }
  },

  // Subscribe to ride updates
  subscribeToRideUpdates(rideId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`ride:${rideId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rides',
          filter: `id=eq.${rideId}`
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to driver location updates
  subscribeToDriverLocation(driverId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`driver_location:${driverId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'driver_locations',
          filter: `driver_id=eq.${driverId}`
        },
        callback
      )
      .subscribe();
  },

  // Notify nearby drivers (private method)
  private async notifyNearbyDrivers(rideId: string, {
    pickup_latitude,
    pickup_longitude,
    radius_km = 5
  }: {
    pickup_latitude: number;
    pickup_longitude: number;
    radius_km?: number;
  }) {
    try {
      const nearbyDrivers = await this.getNearbyDrivers(
        pickup_latitude,
        pickup_longitude,
        radius_km
      );

      // Create notifications for each nearby driver
      const notifications = nearbyDrivers.map(driver => ({
        user_id: driver.user_id,
        type: 'new_ride_request',
        title: 'New Ride Request',
        message: 'A new ride request is available near you',
        data: { ride_id: rideId },
        created_at: new Date().toISOString()
      }));

      if (notifications.length > 0) {
        const { error } = await supabase
          .from('notifications')
          .insert(notifications);

        if (error) throw error;
      }

      return notifications.length;
    } catch (error) {
      console.error('Error notifying drivers:', error);
      throw error;
    }
  }
};
