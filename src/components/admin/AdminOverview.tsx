import React, { useState, useEffect } from 'react';
import { Users, Car, DollarSign, AlertTriangle, Activity, MessageSquare, Loader } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalUsers: number;
  activeDrivers: number;
  revenue: number;
  supportTickets: number;
  recentActivity: Array<{
    id: number;
    type: string;
    action: string;
    user: string;
    time: string;
  }>;
}

interface SuspendedCompany {
  id: string;
  name: string;
  email: string;
  paymentDue: string;
  status: string;
}

interface AdminOverviewProps {
  suspendedCompanies: SuspendedCompany[];
}

export function AdminOverview({ suspendedCompanies }: AdminOverviewProps) {
  const { formatAmount } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <p className="ml-3 text-red-700">{error}</p>
        </div>
        <button
          onClick={loadDashboardData}
          className="mt-3 text-sm text-red-600 hover:text-red-500"
        >
          Try again
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers.toLocaleString() || '0',
      change: '+12%',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Active Drivers',
      value: stats?.activeDrivers.toLocaleString() || '0',
      change: '+5%',
      icon: Car,
      color: 'green',
    },
    {
      title: 'Revenue',
      value: formatAmount(stats?.revenue || 0),
      change: '+23%',
      icon: DollarSign,
      color: 'yellow',
    },
    {
      title: 'Support Tickets',
      value: stats?.supportTickets.toLocaleString() || '0',
      change: '-8%',
      icon: MessageSquare,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-gray-900">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {stats?.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Suspended Companies */}
      {suspendedCompanies.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Suspended Companies</h2>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {suspendedCompanies.map((company) => (
              <div key={company.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{company.name}</p>
                  <p className="text-xs text-gray-500">{company.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">Payment Due: {company.paymentDue}</p>
                  <p className="text-xs text-gray-500">{company.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}