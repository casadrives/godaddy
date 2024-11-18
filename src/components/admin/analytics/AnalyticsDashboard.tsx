import React from 'react';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Loader2 } from 'lucide-react';

interface AnalyticsData {
  dailyRides: number;
  activeDrivers: number;
  revenue: number;
  completionRate: number;
}

interface ChartData {
  name: string;
  value: number;
}

export function AnalyticsDashboard() {
  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: async () => {
      // Replace with your actual API endpoint
      const response = await fetch('/api/analytics/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      return response.json();
    },
  });

  // Fetch chart data
  const { data: chartData } = useQuery<ChartData[]>({
    queryKey: ['analytics-chart'],
    queryFn: async () => {
      // Replace with your actual API endpoint
      const response = await fetch('/api/analytics/chart');
      if (!response.ok) {
        throw new Error('Failed to fetch chart data');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Daily Rides</h3>
          <p className="text-2xl font-bold">{analyticsData?.dailyRides}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Drivers</h3>
          <p className="text-2xl font-bold">{analyticsData?.activeDrivers}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
          <p className="text-2xl font-bold">${analyticsData?.revenue}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
          <p className="text-2xl font-bold">{analyticsData?.completionRate}%</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Rides Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Revenue Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
