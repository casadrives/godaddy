import React, { useState, useCallback } from 'react';
import PendingDriversList from '../../components/admin/PendingDriversList';
import EnhancedStatistics from '../../components/admin/EnhancedStatistics';
import DriverFilters from '../../components/admin/DriverFilters';
import DriverProfile from '../../components/admin/DriverProfile';
import DriverActions from '../../components/admin/DriverActions';
import DriverCommunication from '../../components/admin/DriverCommunication';
import { useMockDriverService } from '../../services/mockDriverService';
import { driverCommunicationService } from '../../services/driverCommunicationService';
import { Driver, FilterState, DriverStatus } from '../../types/driver';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';

const DriversManagement: React.FC = () => {
  const driverService = useMockDriverService();
  const [selectedDrivers, setSelectedDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showCommunication, setShowCommunication] = useState(false);
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

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    driverService.applyFilters(newFilters);
  };

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
  };

  const handleDriverStatusChange = useCallback((driverId: string, status: DriverStatus) => {
    driverService.updateDriverStatus(driverId, status);
    setSelectedDriver(null);
  }, [driverService]);

  const handleBatchStatusChange = useCallback((status: DriverStatus) => {
    selectedDrivers.forEach(driver => {
      driverService.updateDriverStatus(driver.id, status);
    });
    setSelectedDrivers([]);
  }, [selectedDrivers, driverService]);

  const handleExportData = (format: 'csv' | 'json') => {
    const driversToExport = selectedDrivers.length > 0 ? selectedDrivers : driverService.drivers;
    if (format === 'csv') {
      exportToCSV(driversToExport);
    } else {
      exportToJSON(driversToExport);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (selectedDriver) {
      await driverCommunicationService.sendMessage(selectedDriver.id, message);
      // Optionally update UI or show notification
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Drivers Management</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Filters Section */}
          <div className="py-4">
            <DriverFilters onFilterChange={handleFilterChange} />
          </div>

          {/* Enhanced Statistics Section */}
          <div className="py-4">
            <EnhancedStatistics />
          </div>

          {/* Pending Drivers Section */}
          <div className="py-4">
            <PendingDriversList
              onDriverSelect={handleDriverSelect}
              onDriversSelect={setSelectedDrivers}
              selectedDrivers={selectedDrivers}
            />
          </div>

          {/* Driver Actions */}
          <DriverActions
            selectedDrivers={selectedDrivers}
            onBatchStatusChange={handleBatchStatusChange}
            onExportData={handleExportData}
            onClearSelection={() => setSelectedDrivers([])}
          >
            <button
              onClick={() => {
                setSelectedDriver(driver);
                setShowCommunication(true);
              }}
              className="text-indigo-600 hover:text-indigo-900"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z"
                />
              </svg>
            </button>
          </DriverActions>

          {/* Driver Profile Modal */}
          {selectedDriver && (
            <DriverProfile
              driver={selectedDriver}
              onClose={() => setSelectedDriver(null)}
              onStatusChange={(status) => handleDriverStatusChange(selectedDriver.id, status)}
            />
          )}

          {/* Communication Modal */}
          {showCommunication && selectedDriver && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[32rem]">
                <div className="h-full flex flex-col">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">
                      Driver Communication
                    </h2>
                    <button
                      onClick={() => setShowCommunication(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <DriverCommunication
                      driver={selectedDriver}
                      onSendMessage={handleSendMessage}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriversManagement;
