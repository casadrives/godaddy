import React, { useEffect, useState } from 'react';
import { adminService, AdminStats, RideAnalytics } from '../../services/adminService';
import {
  Users,
  Car,
  Route,
  DollarSign,
  Star,
  TrendingUp,
  MapPin,
  Clock,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analytics, setAnalytics] = useState<RideAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, analyticsData] = await Promise.all([
          adminService.getStats(),
          adminService.getRideAnalytics('day'),
        ]);
        setStats(statsData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time updates
    const unsubscribe = adminService.subscribeToLiveUpdates((update) => {
      setStats((prev) => prev ? { ...prev, ...update } : null);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats?.totalUsers || 0, color: 'blue' },
    { icon: Car, label: 'Total Drivers', value: stats?.totalDrivers || 0, color: 'green' },
    { icon: Route, label: 'Active Rides', value: stats?.activeRides || 0, color: 'yellow' },
    { icon: DollarSign, label: 'Total Revenue', value: `$${stats?.totalRevenue.toFixed(2) || '0.00'}`, color: 'purple' },
    { icon: Star, label: 'Average Rating', value: stats?.averageRating.toFixed(1) || '0.0', color: 'orange' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4"
          >
            <div className={`p-3 rounded-full bg-${color}-100`}>
              <Icon className={`w-6 h-6 text-${color}-600`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-semibold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Rides Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Hourly Rides</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.hourlyStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rides"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Locations */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Popular Locations</h2>
          <div className="space-y-4">
            {analytics?.popularLocations.slice(0, 5).map((location) => (
              <div
                key={location.location}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{location.location}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {location.count} rides
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    ${location.revenue.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Peak Hours</h2>
          <div className="space-y-4">
            {analytics?.peakHours.slice(0, 5).map((peak) => (
              <div
                key={peak.hour}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>
                    {peak.hour.toString().padStart(2, '0')}:00 -{' '}
                    {((peak.hour + 1) % 24).toString().padStart(2, '0')}:00
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp
                    className={`w-5 h-5 ${
                      peak.demand > 1.5
                        ? 'text-red-500'
                        : peak.demand > 1.2
                        ? 'text-yellow-500'
                        : 'text-green-500'
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {(peak.demand * 100).toFixed(0)}% demand
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
