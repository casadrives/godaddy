import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { adminAuthService } from './adminAuthService';

type User = Database['public']['Tables']['users']['Row'];
type Company = Database['public']['Tables']['companies']['Row'];
type Driver = Database['public']['Tables']['drivers']['Row'];
type Vehicle = Database['public']['Tables']['vehicles']['Row'];
type Ride = Database['public']['Tables']['rides']['Row'];

export const adminService = {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const [
        { count: usersCount, error: usersError },
        { count: driversCount, error: driversError },
        { count: companiesCount, error: companiesError },
        { count: ridesCount, error: ridesError }
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('drivers').select('*', { count: 'exact', head: true }),
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('rides').select('*', { count: 'exact', head: true })
      ]);

      if (usersError || driversError || companiesError || ridesError) {
        throw new Error('Failed to fetch dashboard statistics');
      }

      return {
        usersCount: usersCount || 0,
        driversCount: driversCount || 0,
        companiesCount: companiesCount || 0,
        ridesCount: ridesCount || 0
      };
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  },

  // Get all users with pagination
  async getUsers(page = 1, limit = 10) {
    try {
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .range(start, end);

      if (error) throw error;

      return {
        users: data,
        total: count || 0,
        page,
        limit
      };
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  // Get all companies with pagination
  async getCompanies(page = 1, limit = 10) {
    try {
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      const { data, error, count } = await supabase
        .from('companies')
        .select('*', { count: 'exact' })
        .range(start, end);

      if (error) throw error;

      return {
        companies: data,
        total: count || 0,
        page,
        limit
      };
    } catch (error) {
      console.error('Get companies error:', error);
      throw error;
    }
  },

  // Get all drivers with pagination
  async getDrivers(page = 1, limit = 10) {
    try {
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      const { data, error, count } = await supabase
        .from('drivers')
        .select('*, companies(*)', { count: 'exact' })
        .range(start, end);

      if (error) throw error;

      return {
        drivers: data,
        total: count || 0,
        page,
        limit
      };
    } catch (error) {
      console.error('Get drivers error:', error);
      throw error;
    }
  },

  // Update user status
  async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'banned') {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update user status error:', error);
      throw error;
    }
  },

  // Update company status
  async updateCompanyStatus(companyId: string, status: 'active' | 'suspended' | 'banned') {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update({ status })
        .eq('id', companyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update company status error:', error);
      throw error;
    }
  },

  // Update driver status
  async updateDriverStatus(driverId: string, status: 'active' | 'suspended' | 'banned') {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .update({ status })
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

  // Get system logs
  async getSystemLogs(page = 1, limit = 50) {
    try {
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      const { data, error, count } = await supabase
        .from('system_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) throw error;

      return {
        logs: data,
        total: count || 0,
        page,
        limit
      };
    } catch (error) {
      console.error('Get system logs error:', error);
      throw error;
    }
  },

  // User Management
  async getAllUsers() {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return users;
  },

  async updateUserStatus(userId: string, status: User['status']) {
    const { data: user, error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return user;
  },

  // Company Management
  async getAllCompanies() {
    const { data: companies, error } = await supabase
      .from('companies')
      .select(`
        *,
        users!inner (
          id,
          name,
          email,
          role,
          status
        ),
        drivers (
          id,
          status,
          license_number,
          license_expiry
        ),
        vehicles (
          id,
          make,
          model,
          year,
          status
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return companies;
  },

  async updateCompanyStatus(companyId: string, status: Company['status']) {
    const { data: company, error } = await supabase
      .from('companies')
      .update({ status })
      .eq('id', companyId)
      .select()
      .single();

    if (error) throw error;
    return company;
  },

  // Driver Management
  async getAllDrivers() {
    const { data: drivers, error } = await supabase
      .from('drivers')
      .select(`
        *,
        users!inner (
          id,
          name,
          email,
          status
        ),
        companies!inner (
          id,
          name,
          status
        ),
        vehicles (
          id,
          make,
          model,
          year,
          license_plate,
          status
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return drivers;
  },

  async updateDriverStatus(driverId: string, status: Driver['status']) {
    const { data: driver, error } = await supabase
      .from('drivers')
      .update({ status })
      .eq('id', driverId)
      .select()
      .single();

    if (error) throw error;
    return driver;
  },

  // Vehicle Management
  async getAllVehicles() {
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        companies!inner (
          id,
          name,
          status
        ),
        drivers (
          id,
          users (
            name,
            email
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return vehicles;
  },

  async updateVehicleStatus(vehicleId: string, status: Vehicle['status']) {
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .update({ status })
      .eq('id', vehicleId)
      .select()
      .single();

    if (error) throw error;
    return vehicle;
  },

  // Ride Management
  async getAllRides() {
    const { data: rides, error } = await supabase
      .from('rides')
      .select(`
        *,
        users!inner (
          id,
          name,
          email
        ),
        drivers!inner (
          id,
          users (
            name,
            email
          ),
          companies (
            name
          )
        ),
        vehicles!inner (
          id,
          make,
          model,
          license_plate
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return rides;
  },

  // Dashboard Statistics
  async getDashboardStats() {
    const [
      { count: totalUsers },
      { count: totalCompanies },
      { count: totalDrivers },
      { count: totalVehicles },
      { count: totalRides },
      { count: activeRides },
      { count: completedRides },
      { count: pendingApprovals }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('companies').select('*', { count: 'exact', head: true }),
      supabase.from('drivers').select('*', { count: 'exact', head: true }),
      supabase.from('vehicles').select('*', { count: 'exact', head: true }),
      supabase.from('rides').select('*', { count: 'exact', head: true }),
      supabase.from('rides').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
      supabase.from('rides').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    ]);

    return {
      totalUsers,
      totalCompanies,
      totalDrivers,
      totalVehicles,
      totalRides,
      activeRides,
      completedRides,
      pendingApprovals
    };
  },

  // Recent Activity
  async getRecentActivity() {
    const [recentUsers, recentCompanies, recentRides] = await Promise.all([
      supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('rides')
        .select(`
          *,
          users!inner (name),
          drivers!inner (
            users (name),
            companies (name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    return {
      recentUsers: recentUsers.data,
      recentCompanies: recentCompanies.data,
      recentRides: recentRides.data
    };
  },

  // Payment and Revenue
  async getRevenueStats() {
    const { data: rides, error } = await supabase
      .from('rides')
      .select('fare, created_at, payment_status')
      .eq('payment_status', 'paid');

    if (error) throw error;

    const revenue = rides?.reduce((acc, ride) => acc + (ride.fare || 0), 0) || 0;
    const monthlyRevenue = rides?.reduce((acc, ride) => {
      const month = new Date(ride.created_at).getMonth();
      acc[month] = (acc[month] || 0) + (ride.fare || 0);
      return acc;
    }, {} as Record<number, number>);

    return {
      totalRevenue: revenue,
      monthlyRevenue
    };
  }
};
