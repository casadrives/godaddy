import api from '../utils/api';
import { wsService } from './websocketService';

export interface AdminStats {
  totalUsers: number;
  totalDrivers: number;
  activeRides: number;
  completedRides: number;
  cancelledRides: number;
  totalRevenue: number;
  averageRating: number;
}

export interface UserActivity {
  userId: string;
  action: string;
  timestamp: string;
  details: Record<string, any>;
}

export interface DriverStats {
  id: string;
  name: string;
  totalRides: number;
  averageRating: number;
  totalEarnings: number;
  onlineHours: number;
  completionRate: number;
  status: 'online' | 'offline' | 'busy';
}

export interface RideAnalytics {
  hourlyStats: Array<{
    hour: number;
    rides: number;
    revenue: number;
  }>;
  popularLocations: Array<{
    location: string;
    count: number;
    revenue: number;
  }>;
  peakHours: Array<{
    hour: number;
    demand: number;
  }>;
}

export interface CompanyRegistration {
  name: string;
  email: string;
  phone: string;
  registrationNumber: string;
  taxiLicense: string;
  fleetSize: number;
  vehicleClasses: {
    first: number;
    business: number;
    economy: number;
    ambulance: number;
  };
  documents: {
    businessLicense: File;
    taxiPermit: File;
    insurance: File;
  };
}

export interface CompanyUpdateStatus {
  companyId: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

export interface DriverRegistration {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    class: 'first' | 'business' | 'economy' | 'ambulance';
  };
  documents: {
    driverLicense: File;
    vehicleRegistration: File;
    insurance: File;
    backgroundCheck: File;
    profilePhoto: File;
  };
  companyId?: string;
}

export interface DriverUpdateStatus {
  driverId: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  reason?: string;
}

export interface DriverPerformance {
  id: string;
  totalRides: number;
  completionRate: number;
  averageRating: number;
  totalEarnings: number;
  onlineHours: number;
  acceptanceRate: number;
  cancellationRate: number;
  complaints: number;
  compliments: number;
  lastRideDate: string;
  weeklyStats: {
    rides: number;
    earnings: number;
    onlineHours: number;
    rating: number;
  }[];
}

class AdminService {
  // Dashboard Statistics
  async getStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats');
    return response.data;
  }

  // Real-time Monitoring
  subscribeToLiveUpdates(onUpdate: (stats: Partial<AdminStats>) => void): () => void {
    wsService.connect();
    return wsService.subscribe<Partial<AdminStats>>('admin:stats', onUpdate);
  }

  // User Management
  async getUsers(page: number = 1, limit: number = 10, filters?: Record<string, any>) {
    const response = await api.get('/admin/users', { params: { page, limit, ...filters } });
    return response.data;
  }

  async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'banned') {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  }

  // Driver Management
  async getDrivers(page: number = 1, limit: number = 10, filters?: Record<string, any>) {
    const response = await api.get('/admin/drivers', { params: { page, limit, ...filters } });
    return response.data;
  }

  async getDriverStats(driverId: string): Promise<DriverStats> {
    const response = await api.get(`/admin/drivers/${driverId}/stats`);
    return response.data;
  }

  async updateDriverVerification(driverId: string, status: 'pending' | 'verified' | 'rejected', notes?: string) {
    const response = await api.patch(`/admin/drivers/${driverId}/verification`, { status, notes });
    return response.data;
  }

  // Enhanced Driver Management
  async registerDriver(data: DriverRegistration): Promise<{ success: boolean; driverId: string }> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'documents') {
        Object.entries(value).forEach(([docKey, file]) => {
          formData.append(`documents.${docKey}`, file);
        });
      } else if (key === 'vehicleInfo') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });
    
    const response = await api.post('/admin/drivers/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async updateDriverStatus(data: DriverUpdateStatus): Promise<{ success: boolean }> {
    const response = await api.post('/admin/drivers/status', data);
    return response.data;
  }

  async getDriverPerformance(driverId: string): Promise<DriverPerformance> {
    const response = await api.get(`/admin/drivers/${driverId}/performance`);
    return response.data;
  }

  async assignDriverToCompany(driverId: string, companyId: string): Promise<{ success: boolean }> {
    const response = await api.post(`/admin/drivers/${driverId}/assign-company`, { companyId });
    return response.data;
  }

  async updateDriverDocuments(driverId: string, documents: Partial<DriverRegistration['documents']>): Promise<{ success: boolean }> {
    const formData = new FormData();
    Object.entries(documents).forEach(([key, file]) => {
      formData.append(key, file);
    });
    
    const response = await api.post(`/admin/drivers/${driverId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async getDriverSchedule(driverId: string, startDate: string, endDate: string) {
    const response = await api.get(`/admin/drivers/${driverId}/schedule`, {
      params: { startDate, endDate }
    });
    return response.data;
  }

  async setDriverSchedule(driverId: string, schedule: Array<{
    day: string;
    shifts: Array<{ start: string; end: string }>;
  }>): Promise<{ success: boolean }> {
    const response = await api.post(`/admin/drivers/${driverId}/schedule`, { schedule });
    return response.data;
  }

  async getDriverViolations(driverId: string): Promise<Array<{
    id: string;
    type: string;
    description: string;
    date: string;
    status: 'pending' | 'reviewed' | 'resolved';
    severity: 'low' | 'medium' | 'high';
  }>> {
    const response = await api.get(`/admin/drivers/${driverId}/violations`);
    return response.data;
  }

  // Ride Management
  async getRides(page: number = 1, limit: number = 10, filters?: Record<string, any>) {
    const response = await api.get('/admin/rides', { params: { page, limit, ...filters } });
    return response.data;
  }

  async getRideDetails(rideId: string) {
    const response = await api.get(`/admin/rides/${rideId}`);
    return response.data;
  }

  async resolveDispute(rideId: string, resolution: {
    decision: 'refund' | 'partial_refund' | 'no_refund';
    amount?: number;
    notes: string;
  }) {
    const response = await api.post(`/admin/rides/${rideId}/resolve-dispute`, resolution);
    return response.data;
  }

  // Analytics
  async getRideAnalytics(timeframe: 'day' | 'week' | 'month' | 'year'): Promise<RideAnalytics> {
    const response = await api.get('/admin/analytics/rides', { params: { timeframe } });
    return response.data;
  }

  async getRevenueReport(startDate: string, endDate: string) {
    const response = await api.get('/admin/reports/revenue', {
      params: { startDate, endDate }
    });
    return response.data;
  }

  // System Configuration
  async updatePricing(config: {
    basePrice: number;
    pricePerKm: number;
    pricePerMinute: number;
    surgePricingMultiplier: number;
  }) {
    const response = await api.put('/admin/config/pricing', config);
    return response.data;
  }

  async updateSystemSettings(settings: {
    maxActiveRidesPerDriver?: number;
    maxCancellationsPerDay?: number;
    autoAssignmentRadius?: number;
    minimumDriverRating?: number;
  }) {
    const response = await api.put('/admin/config/settings', settings);
    return response.data;
  }

  // Activity Logs
  async getActivityLogs(page: number = 1, limit: number = 10, filters?: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    actionType?: string;
  }): Promise<{
    logs: UserActivity[];
    total: number;
  }> {
    const response = await api.get('/admin/logs', { params: { page, limit, ...filters } });
    return response.data;
  }

  // Support & Notifications
  async sendNotification(target: {
    type: 'all' | 'drivers' | 'users' | 'specific';
    userIds?: string[];
  }, notification: {
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
  }) {
    const response = await api.post('/admin/notifications', { target, notification });
    return response.data;
  }

  async getSupportTickets(page: number = 1, limit: number = 10, status?: 'open' | 'in_progress' | 'resolved') {
    const response = await api.get('/admin/support/tickets', {
      params: { page, limit, status }
    });
    return response.data;
  }

  async respondToSupportTicket(ticketId: string, responseData: {
    message: string;
    status: 'in_progress' | 'resolved';
  }) {
    const response = await api.post(`/admin/support/tickets/${ticketId}/respond`, responseData);
    return response.data;
  }

  // Company Management
  async registerCompany(data: CompanyRegistration): Promise<{ success: boolean; companyId: string }> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'documents') {
        Object.entries(value).forEach(([docKey, file]) => {
          formData.append(`documents.${docKey}`, file);
        });
      } else if (key === 'vehicleClasses') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });
    
    const response = await api.post('/admin/companies/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async updateCompanyStatus(data: CompanyUpdateStatus): Promise<{ success: boolean }> {
    const response = await api.post('/admin/companies/status', data);
    return response.data;
  }

  async getCompanyList(filters?: { status?: string; search?: string }): Promise<any[]> {
    const response = await api.get('/admin/companies', { params: filters });
    return response.data;
  }

  async getCompanyDetails(companyId: string): Promise<any> {
    const response = await api.get(`/admin/companies/${companyId}`);
    return response.data;
  }
}

export const adminService = new AdminService();
