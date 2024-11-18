import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useMockDriverService } from '../../services/mockDriverService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const EnhancedStatistics: React.FC = () => {
  const driverService = useMockDriverService();
  const stats = driverService.getDriverStatistics();

  // Prepare data for status distribution chart
  const statusData = {
    labels: ['Active', 'Pending', 'Suspended'],
    datasets: [
      {
        data: [
          stats.statusDistribution.ACTIVE || 0,
          stats.statusDistribution.PENDING || 0,
          stats.statusDistribution.SUSPENDED || 0,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
      },
    ],
  };

  // Prepare data for car type distribution
  const carTypeData = {
    labels: ['Economic', 'Comfort', 'Luxury', 'Van'],
    datasets: [
      {
        label: 'Number of Cars',
        data: [
          stats.carTypeDistribution.ECONOMIC || 0,
          stats.carTypeDistribution.COMFORT || 0,
          stats.carTypeDistribution.LUXURY || 0,
          stats.carTypeDistribution.VAN || 0,
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
      },
    ],
  };

  // Prepare data for city distribution
  const cityData = {
    labels: Object.keys(stats.cityDistribution).slice(0, 5),
    datasets: [
      {
        label: 'Drivers per City',
        data: Object.values(stats.cityDistribution).slice(0, 5),
        backgroundColor: 'rgba(153, 102, 255, 0.8)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Status Distribution */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Driver Status Distribution</h3>
        <div className="h-64">
          <Doughnut data={statusData} options={options} />
        </div>
      </div>

      {/* Car Type Distribution */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Car Type Distribution</h3>
        <div className="h-64">
          <Bar data={carTypeData} options={options} />
        </div>
      </div>

      {/* City Distribution */}
      <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
        <h3 className="text-lg font-medium mb-4">Top 5 Cities Distribution</h3>
        <div className="h-64">
          <Bar data={cityData} options={options} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Drivers</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalDrivers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Active Rate</h3>
          <p className="text-3xl font-bold text-green-600">
            {Math.round((stats.statusDistribution.ACTIVE / stats.totalDrivers) * 100)}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Cities Covered</h3>
          <p className="text-3xl font-bold text-blue-600">
            {Object.keys(stats.cityDistribution).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStatistics;
