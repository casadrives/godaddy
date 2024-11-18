import React, { useState } from 'react';
import { CarType, DriverStatus } from '../../types/driver';

interface DriverFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  status: DriverStatus | 'ALL';
  carType: CarType | 'ALL';
  city: string;
  searchQuery: string;
  dateRange: {
    start: string;
    end: string;
  };
}

const DriverFilters: React.FC<DriverFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    status: 'ALL',
    carType: 'ALL',
    city: '',
    searchQuery: '',
    dateRange: {
      start: '',
      end: '',
    },
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Search by name, email, or phone"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        {/* Car Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Car Type</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={filters.carType}
            onChange={(e) => handleFilterChange('carType', e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value="ECONOMIC">Economic</option>
            <option value="COMFORT">Comfort</option>
            <option value="LUXURY">Luxury</option>
            <option value="VAN">Van</option>
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter city"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          />
        </div>

        {/* Date Range */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Date Range</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={filters.dateRange.start}
              onChange={(e) =>
                handleFilterChange('dateRange', {
                  ...filters.dateRange,
                  start: e.target.value,
                })
              }
            />
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={filters.dateRange.end}
              onChange={(e) =>
                handleFilterChange('dateRange', {
                  ...filters.dateRange,
                  end: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverFilters;
