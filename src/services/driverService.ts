import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Driver = Database['public']['Tables']['drivers']['Row'];
type Vehicle = Database['public']['Tables']['vehicles']['Row'];

export const driverService = {
  // Get driver profile
  async getDriverProfile(driverId: string) {
    try {
      const { data: driver, error } = await supabase
        .from('drivers')
        .select(`
          *,
          vehicles (*),
          users!inner (*),
          companies (*)
        `)
        .eq('id', driverId)
        .single();

      if (error) throw error;
      return driver;
    } catch (error) {
      console.error('Get driver profile error:', error);
      throw error;
    }
  },

  // Update driver profile
  async updateDriverProfile(driverId: string, updates: Partial<Driver>) {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .update(updates)
        .eq('id', driverId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update driver profile error:', error);
      throw error;
    }
  },

  // Update driver status (online/offline)
  async updateDriverStatus(driverId: string, isOnline: boolean) {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .update({
          is_online: isOnline,
          last_online: new Date().toISOString()
        })
        .eq('id', driverId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update driver status error:', error);
      throw error;
    }
  },

  // Get driver's vehicles
  async getDriverVehicles(driverId: string) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('driver_id', driverId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get driver vehicles error:', error);
      throw error;
    }
  },

  // Add vehicle to driver
  async addVehicle(driverId: string, vehicleData: Partial<Vehicle>) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          ...vehicleData,
          driver_id: driverId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Add vehicle error:', error);
      throw error;
    }
  },

  // Update vehicle
  async updateVehicle(vehicleId: string, updates: Partial<Vehicle>) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', vehicleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update vehicle error:', error);
      throw error;
    }
  },

  // Get driver's earnings
  async getDriverEarnings(driverId: string, startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('fare, driver_earnings, created_at')
        .eq('driver_id', driverId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;

      const totalEarnings = data.reduce((sum, ride) => sum + (ride.driver_earnings || 0), 0);
      const totalRides = data.length;

      return {
        earnings: totalEarnings,
        rides: totalRides,
        details: data
      };
    } catch (error) {
      console.error('Get driver earnings error:', error);
      throw error;
    }
  },

  // Get driver's upcoming rides
  async getUpcomingRides(driverId: string) {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select(`
          *,
          users!rides_user_id_fkey (name, phone),
          locations!rides_pickup_location_fkey (*)
        `)
        .eq('driver_id', driverId)
        .eq('status', 'scheduled')
        .order('pickup_time', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get upcoming rides error:', error);
      throw error;
    }
  },

  // Get driver's ride history
  async getRideHistory(driverId: string, page = 1, limit = 10) {
    try {
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      const { data, error, count } = await supabase
        .from('rides')
        .select(`
          *,
          users!rides_user_id_fkey (name),
          locations!rides_pickup_location_fkey (*),
          locations!rides_dropoff_location_fkey (*)
        `, { count: 'exact' })
        .eq('driver_id', driverId)
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) throw error;

      return {
        rides: data,
        total: count || 0,
        page,
        limit
      };
    } catch (error) {
      console.error('Get ride history error:', error);
      throw error;
    }
  },

  // Update driver documents
  async updateDriverDocuments(driverId: string, documents: {
    license?: File,
    insurance?: File,
    registration?: File
  }) {
    try {
      const uploads = [];
      const updates: Record<string, string> = {};

      for (const [key, file] of Object.entries(documents)) {
        if (file) {
          const path = `drivers/${driverId}/documents/${key}-${Date.now()}`;
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(path, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(path);

          updates[`${key}_url`] = publicUrl;
          uploads.push(path);
        }
      }

      const { data, error } = await supabase
        .from('drivers')
        .update(updates)
        .eq('id', driverId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update driver documents error:', error);
      throw error;
    }
  }
};
