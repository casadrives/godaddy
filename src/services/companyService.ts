import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Company = Database['public']['Tables']['companies']['Row'];
type Driver = Database['public']['Tables']['drivers']['Row'];
type Vehicle = Database['public']['Tables']['vehicles']['Row'];

export const companyService = {
  // Get company dashboard stats
  async getDashboardStats(companyId: string) {
    try {
      const [
        driversResult,
        vehiclesResult,
        activeDriversResult,
        revenueResult
      ] = await Promise.all([
        // Total drivers
        supabase
          .from('drivers')
          .select('id')
          .eq('company_id', companyId)
          .count(),
        
        // Total vehicles
        supabase
          .from('vehicles')
          .select('id')
          .eq('company_id', companyId)
          .count(),
        
        // Active drivers (currently online)
        supabase
          .from('drivers')
          .select('id')
          .eq('company_id', companyId)
          .eq('is_online', true)
          .count(),
        
        // Today's revenue
        supabase
          .from('rides')
          .select('fare_amount')
          .eq('company_id', companyId)
          .gte('created_at', new Date().toISOString().split('T')[0])
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum, ride) => 
        sum + (ride.fare_amount || 0), 0) || 0;

      return {
        totalDrivers: driversResult.count || 0,
        totalVehicles: vehiclesResult.count || 0,
        activeDrivers: activeDriversResult.count || 0,
        todayRevenue: totalRevenue,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get company drivers with status
  async getDrivers(companyId: string, options: { 
    status?: 'online' | 'offline' | 'all',
    limit?: number,
    offset?: number
  } = {}) {
    try {
      let query = supabase
        .from('drivers')
        .select(`
          *,
          users!inner (
            id,
            email,
            first_name,
            last_name,
            phone
          ),
          vehicles (
            id,
            make,
            model,
            year,
            license_plate
          )
        `)
        .eq('company_id', companyId);

      if (options.status && options.status !== 'all') {
        query = query.eq('is_online', options.status === 'online');
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return { drivers: data, count };
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  },

  // Get company vehicles
  async getVehicles(companyId: string) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          drivers (
            id,
            users!inner (
              first_name,
              last_name
            )
          )
        `)
        .eq('company_id', companyId);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  // Update company profile
  async updateProfile(companyId: string, updates: Partial<Company>) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', companyId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating company profile:', error);
      throw error;
    }
  },

  // Get company analytics
  async getAnalytics(companyId: string, timeframe: 'day' | 'week' | 'month' = 'day') {
    try {
      const now = new Date();
      let startDate: Date;

      switch (timeframe) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = new Date(now.setHours(0, 0, 0, 0));
      }

      const { data, error } = await supabase
        .from('rides')
        .select(`
          id,
          created_at,
          fare_amount,
          distance,
          duration,
          status
        `)
        .eq('company_id', companyId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  // Add new driver to company
  async addDriver(companyId: string, driverData: Partial<Driver>) {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .insert({
          ...driverData,
          company_id: companyId,
          is_online: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error adding driver:', error);
      throw error;
    }
  },

  // Add new vehicle to company
  async addVehicle(companyId: string, vehicleData: Partial<Vehicle>) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          ...vehicleData,
          company_id: companyId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw error;
    }
  },

  // Get real-time driver locations
  async getDriverLocations(companyId: string) {
    try {
      const { data, error } = await supabase
        .from('driver_locations')
        .select(`
          *,
          drivers!inner (
            id,
            company_id,
            users!inner (
              first_name,
              last_name
            )
          )
        `)
        .eq('drivers.company_id', companyId);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching driver locations:', error);
      throw error;
    }
  }
};
