import React from 'react';
import { X, Star, Clock, TrendingUp, AlertTriangle, ThumbsUp } from 'lucide-react';
import { DriverPerformance } from '../../services/adminService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  performance: DriverPerformance;
}

export function DriverPerformanceModal({ isOpen, onClose, performance }: Props) {
  if (!isOpen) return null;

  const {
    totalRides,
    completionRate,
    averageRating,
    totalEarnings,
    onlineHours,
    acceptanceRate,
    cancellationRate,
    complaints,
    compliments,
    weeklyStats
  } = performance;

  const stats = [
    {
      label: 'Total Rides',
      value: totalRides,
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      label: 'Average Rating',
      value: averageRating.toFixed(1),
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      label: 'Online Hours',
      value: onlineHours,
      icon: Clock,
      color: 'text-green-600'
    },
    {
      label: 'Completion Rate',
      value: `${(completionRate * 100).toFixed(1)}%`,
      icon: ThumbsUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">CasaDrives Driver Performance</h2>
            <p className="text-gray-600 mt-1">Comprehensive performance metrics and analytics</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white p-4 rounded-lg border">
              <div className={`flex items-center mb-2 ${color}`}>
                <Icon className="w-5 h-5 mr-2" />
                <span className="font-medium">{label}</span>
              </div>
              <div className="text-2xl font-bold">{value}</div>
            </div>
          ))}
        </div>

        {/* Weekly Performance Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Weekly Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="rides"
                  stroke="#2563eb"
                  name="Rides"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="earnings"
                  stroke="#16a34a"
                  name="Earnings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-8">
          {/* Acceptance & Cancellation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ride Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Acceptance Rate</span>
                  <span className="font-medium">{(acceptanceRate * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${acceptanceRate * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Cancellation Rate</span>
                  <span className="font-medium">{(cancellationRate * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${cancellationRate * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Feedback</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-green-600">
                  <ThumbsUp className="w-5 h-5 mr-2" />
                  <span>Compliments</span>
                </div>
                <span className="font-medium">{compliments}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  <span>Complaints</span>
                </div>
                <span className="font-medium">{complaints}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
