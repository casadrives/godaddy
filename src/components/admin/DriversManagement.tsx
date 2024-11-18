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
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedDriverPerformance, setSelectedDriverPerformance] = useState<DriverPerformance | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadDrivers();
  }, [currentPage, statusFilter, searchTerm]);

  const loadDrivers = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getDrivers(currentPage, 10, {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined
      });
      setDrivers(response.data);
      setTotalPages(Math.ceil(response.total / 10));
    } catch (error) {
      toast.error('Failed to load drivers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (driverId: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      await adminService.updateDriverStatus({ driverId, status });
      toast.success('Driver status updated successfully');
      loadDrivers();
    } catch (error) {
      toast.error('Failed to update driver status');
    }
  };

  const handleDocumentUpdate = async (driverId: string, documents: FormData) => {
    try {
      await adminService.updateDriverDocuments(driverId, documents);
      toast.success('Documents updated successfully');
      loadDrivers();
    } catch (error) {
      toast.error('Failed to update documents');
    }
  };

  const handleDriverRegistration = async (data: DriverRegistration) => {
    try {
      setIsLoading(true);
      await adminService.registerDriver(data);
      toast.success('Driver registered successfully');
      loadDrivers();
    } catch (error) {
      toast.error('Failed to register driver');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDriverPerformance = async (driverId: string) => {
    try {
      setIsLoading(true);
      const performance = await adminService.getDriverPerformance(driverId);
      setSelectedDriverPerformance(performance);
      setShowPerformanceModal(true);
    } catch (error) {
      toast.error('Failed to load driver performance');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CasaDrives Driver Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor your driver fleet</p>
        </div>
        <button
          onClick={() => setShowRegistrationModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Driver
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search drivers..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="border rounded-lg px-4 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium text-gray-900">{driver.name}</div>
                      <div className="text-sm text-gray-500">{driver.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{driver.vehicleInfo.make} {driver.vehicleInfo.model}</div>
                  <div className="text-sm text-gray-500">{driver.vehicleInfo.plateNumber}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    driver.status === 'active' ? 'bg-green-100 text-green-800' :
                    driver.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    driver.status === 'suspended' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {driver.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => loadDriverPerformance(driver.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Performance
                  </button>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(driver.id, driver.status === 'active' ? 'inactive' : 'active')}
                      className={`p-1 rounded-full ${
                        driver.status === 'active' ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {driver.status === 'active' ? <Ban className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setSelectedDriver(driver)}
                      className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Registration Modal */}
      <DriverRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSubmit={handleDriverRegistration}
      />

      {/* Performance Modal */}
      {selectedDriverPerformance && (
        <DriverPerformanceModal
          isOpen={showPerformanceModal}
          onClose={() => {
            setShowPerformanceModal(false);
            setSelectedDriverPerformance(null);
          }}
          performance={selectedDriverPerformance}
        />
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}