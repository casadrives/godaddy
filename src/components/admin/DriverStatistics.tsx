import React, { useEffect, useState } from 'react';
import { mockDriverService } from '../../services/mockDriverService';

interface Statistics {
  total: number;
  pending: number;
  active: number;
  suspended: number;
  vehicleTypes: {
    economic: number;
    comfort: number;
    luxury: number;
    van: number;
  };
  cityCounts: Record<string, number>;
}

const DriverStatistics: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);

  useEffect(() => {
    const statistics = mockDriverService.getDriverStatistics();
    setStats(statistics);
  }, []);

  if (!stats) return <div>Loading statistics...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Driver Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Overall Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Overall Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Drivers</span>
              <span className="font-semibold">{stats.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold text-yellow-600">{stats.pending}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active</span>
              <span className="font-semibold text-green-600">{stats.active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Suspended</span>
              <span className="font-semibold text-red-600">{stats.suspended}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Types */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Vehicle Types</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Economic</span>
              <span className="font-semibold">{stats.vehicleTypes.economic}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Comfort</span>
              <span className="font-semibold">{stats.vehicleTypes.comfort}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Luxury</span>
              <span className="font-semibold">{stats.vehicleTypes.luxury}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Van</span>
              <span className="font-semibold">{stats.vehicleTypes.van}</span>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                  Pending
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-yellow-600">
                  {((stats.pending / stats.total) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
              <div
                style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
              ></div>
            </div>

            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                  Active
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-green-600">
                  {((stats.active / stats.total) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
              <div
                style={{ width: `${(stats.active / stats.total) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              ></div>
            </div>

            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                  Suspended
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-red-600">
                  {((stats.suspended / stats.total) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
              <div
                style={{ width: `${(stats.suspended / stats.total) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
              ></div>
            </div>
          </div>
        </div>

        {/* City Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">City Distribution</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {Object.entries(stats.cityCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([city, count]) => (
                <div key={city} className="flex justify-between">
                  <span className="text-gray-600">{city}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverStatistics;
