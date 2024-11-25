import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Plus, DollarSign, Ban, CheckCircle, Mail, Calendar, FileText, Car, AlertTriangle } from 'lucide-react';
import { adminService, DriverRegistration, DriverPerformance } from '../../services/adminService';
import { DriverRegistrationModal } from './DriverRegistrationModal';
import { DriverPerformanceModal } from './DriverPerformanceModal';
import toast from 'react-hot-toast';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  licenseNumber: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    class: string;
  };
  performance?: DriverPerformance;
}

export function DriversManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<Set<string>>(new Set());
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedDriverPerformance, setSelectedDriverPerformance] = useState<DriverPerformance | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    vehicleClass: 'all',
    performanceRating: 'all',
    documentStatus: 'all'
  });
  const [sortBy, setSortBy] = useState<{
    field: string;
    direction: 'asc' | 'desc';
  }>({ field: 'name', direction: 'asc' });

  useEffect(() => {
    loadDrivers();
  }, [currentPage, statusFilter, searchTerm, filters, sortBy]);

  const loadDrivers = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getDrivers(currentPage, 10, {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined,
        vehicleClass: filters.vehicleClass !== 'all' ? filters.vehicleClass : undefined,
        performanceRating: filters.performanceRating !== 'all' ? filters.performanceRating : undefined,
        documentStatus: filters.documentStatus !== 'all' ? filters.documentStatus : undefined,
        sortBy: sortBy.field,
        sortDirection: sortBy.direction
      });
      setDrivers(response.data);
      setTotalPages(Math.ceil(response.total / 10));
    } catch (error) {
      toast.error('Failed to load drivers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'suspend') => {
    if (selectedDrivers.size === 0) return;

    try {
      setIsLoading(true);
      const status = action === 'activate' ? 'active' : action === 'deactivate' ? 'inactive' : 'suspended';
      await Promise.all(
        Array.from(selectedDrivers).map(driverId =>
          adminService.updateDriverStatus({ driverId, status })
        )
      );
      toast.success(`Successfully ${action}d ${selectedDrivers.size} drivers`);
      setSelectedDrivers(new Set());
      loadDrivers();
    } catch (error) {
      toast.error(`Failed to ${action} drivers`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: string) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleSelectAll = () => {
    if (selectedDrivers.size === drivers.length) {
      setSelectedDrivers(new Set());
    } else {
      setSelectedDrivers(new Set(drivers.map(d => d.id)));
    }
  };

  const toggleSelectDriver = (driverId: string) => {
    const newSelected = new Set(selectedDrivers);
    if (newSelected.has(driverId)) {
      newSelected.delete(driverId);
    } else {
      newSelected.add(driverId);
    }
    setSelectedDrivers(newSelected);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Driver Management</h1>
        <button
          onClick={() => setShowRegistrationModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={filters.vehicleClass}
            onChange={(e) => setFilters(prev => ({ ...prev, vehicleClass: e.target.value }))}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Vehicle Classes</option>
            <option value="economy">Economy</option>
            <option value="comfort">Comfort</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedDrivers.size > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
          <span className="text-sm text-blue-700">
            {selectedDrivers.size} drivers selected
          </span>
          <div className="space-x-2">
            <button
              onClick={() => handleBulkAction('activate')}
              className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-md hover:bg-green-200"
            >
              Activate
            </button>
            <button
              onClick={() => handleBulkAction('deactivate')}
              className="px-3 py-1 text-sm text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200"
            >
              Deactivate
            </button>
            <button
              onClick={() => handleBulkAction('suspend')}
              className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded-md hover:bg-red-200"
            >
              Suspend
            </button>
          </div>
        </div>
      )}

      {/* Drivers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedDrivers.size === drivers.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              {[
                { label: 'Name', field: 'name' },
                { label: 'Status', field: 'status' },
                { label: 'Vehicle', field: 'vehicleInfo.class' },
                { label: 'License', field: 'licenseNumber' },
                { label: 'Performance', field: 'performance.rating' }
              ].map(({ label, field }) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    {sortBy.field === field && (
                      <span className="text-gray-400">
                        {sortBy.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  <Loader className="h-6 w-6 animate-spin text-blue-500 mx-auto" />
                </td>
              </tr>
            ) : drivers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No drivers found
                </td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedDrivers.has(driver.id)}
                      onChange={() => toggleSelectDriver(driver.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                      <div className="text-sm text-gray-500">{driver.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      driver.status === 'active' ? 'bg-green-100 text-green-800' :
                      driver.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                      driver.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {driver.vehicleInfo.make} {driver.vehicleInfo.model}
                    <div className="text-xs text-gray-400">{driver.vehicleInfo.plateNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {driver.licenseNumber}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => loadDriverPerformance(driver.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Performance
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedDriver(driver)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      {showRegistrationModal && (
        <DriverRegistrationModal
          onClose={() => setShowRegistrationModal(false)}
          onSubmit={handleDriverRegistration}
        />
      )}
      {showPerformanceModal && selectedDriverPerformance && (
        <DriverPerformanceModal
          performance={selectedDriverPerformance}
          onClose={() => setShowPerformanceModal(false)}
        />
      )}
    </div>
  );
}