import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useMockDriverService } from '../../services/mockDriverService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdvancedAnalytics: React.FC = () => {
  const driverService = useMockDriverService();
  const stats = driverService.getAdvancedStatistics();

  // Registration Trend Data
  const registrationTrendData = {
    labels: stats.registrationTrend.map(item => item.date),
    datasets: [
      {
        label: 'New Registrations',
        data: stats.registrationTrend.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  // Document Verification Rate Data
  const documentVerificationData = {
    labels: Object.keys(stats.documentVerification),
    datasets: [
      {
        label: 'Verification Rate (%)',
        data: Object.values(stats.documentVerification),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
      },
    ],
  };

  // Vehicle Age Distribution
  const vehicleAgeData = {
    labels: Object.keys(stats.vehicleAgeDistribution),
    datasets: [
      {
        data: Object.values(stats.vehicleAgeDistribution),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Analytics</h2>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-600 mb-1">Average Vehicle Age</p>
            <p className="text-2xl font-bold text-indigo-900">{stats.averageVehicleAge.toFixed(1)} years</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Document Verification Rate</p>
            <p className="text-2xl font-bold text-green-900">{stats.overallVerificationRate.toFixed(1)}%</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Active Driver Rate</p>
            <p className="text-2xl font-bold text-blue-900">{stats.activeDriverRate.toFixed(1)}%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 mb-1">Cities Coverage</p>
            <p className="text-2xl font-bold text-purple-900">{stats.citiesCount}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registration Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Registration Trend</h3>
          <div className="h-64">
            <Line
              data={registrationTrendData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Document Verification Rates */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Document Verification Rates</h3>
          <div className="h-64">
            <Bar
              data={documentVerificationData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Vehicle Age Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Age Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={vehicleAgeData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            {Object.entries(stats.performanceMetrics).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex items-center">
                  <div className="w-48 h-2 bg-gray-200 rounded-full mr-2">
                    <div
                      className="h-2 bg-indigo-600 rounded-full"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.insights.map((insight, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors"
            >
              <p className="text-sm font-medium text-gray-900 mb-1">{insight.title}</p>
              <p className="text-sm text-gray-500">{insight.description}</p>
              {insight.trend && (
                <div className={`flex items-center mt-2 ${
                  insight.trend > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {insight.trend > 0 ? '↑' : '↓'} {Math.abs(insight.trend)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
