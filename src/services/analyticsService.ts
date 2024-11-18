import { api } from '@/lib/axios';

export interface AnalyticsData {
  dailyRides: number;
  activeDrivers: number;
  revenue: number;
  completionRate: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export const analyticsService = {
  async getDashboardData(): Promise<AnalyticsData> {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  async getChartData(): Promise<ChartData[]> {
    const response = await api.get('/analytics/chart');
    return response.data;
  },

  async getDriverPerformance(driverId: string) {
    const response = await api.get(`/analytics/driver/${driverId}`);
    return response.data;
  },

  async getRevenueReport(startDate: string, endDate: string) {
    const response = await api.get('/analytics/revenue', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  async getCustomerMetrics() {
    const response = await api.get('/analytics/customers');
    return response.data;
  },

  async getServiceAreaPerformance(areaId: string) {
    const response = await api.get(`/analytics/area/${areaId}`);
    return response.data;
  },
};
