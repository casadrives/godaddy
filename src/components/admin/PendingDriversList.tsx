import React, { useState, useEffect } from 'react';
import { mockDriverService } from '../../services/mockDriverService';
import { Driver, DriverStatus } from '../../types/driver';

const PendingDriversList: React.FC = () => {
  const [pendingDrivers, setPendingDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const drivers = mockDriverService.getPendingDrivers();
    setPendingDrivers(drivers);
  }, []);

  const handleApprove = (driverId: string) => {
    const updatedDriver = mockDriverService.updateDriverStatus(driverId, DriverStatus.ACTIVE);
    if (updatedDriver) {
      setPendingDrivers(prev => prev.filter(d => d.id !== driverId));
    }
  };

  const handleReject = (driverId: string) => {
    const updatedDriver = mockDriverService.updateDriverStatus(driverId, DriverStatus.SUSPENDED);
    if (updatedDriver) {
      setPendingDrivers(prev => prev.filter(d => d.id !== driverId));
    }
  };

  const viewDriverDetails = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Pending Drivers ({pendingDrivers.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingDrivers.map(driver => (
          <div key={driver.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {driver.firstName} {driver.lastName}
                </h3>
                <p className="text-gray-600">{driver.email}</p>
                <p className="text-gray-600">{driver.phone}</p>
              </div>
              <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                Pending
              </span>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Vehicle Information</h4>
              <p className="text-gray-700">
                {driver.vehicle.year} {driver.vehicle.make} {driver.vehicle.model}
              </p>
              <p className="text-gray-600">
                License Plate: {driver.vehicle.licensePlate}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Location</h4>
              <p className="text-gray-700">{driver.city}, {driver.country}</p>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => viewDriverDetails(driver)}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
              >
                View Details
              </button>
              <div>
                <button
                  onClick={() => handleReject(driver.id)}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800 mr-2"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(driver.id)}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Driver Details Modal */}
      {isModalOpen && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Driver Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Personal Information</h3>
                <p><span className="font-medium">Name:</span> {selectedDriver.firstName} {selectedDriver.lastName}</p>
                <p><span className="font-medium">Email:</span> {selectedDriver.email}</p>
                <p><span className="font-medium">Phone:</span> {selectedDriver.phone}</p>
                <p><span className="font-medium">Address:</span> {selectedDriver.address}</p>
                <p><span className="font-medium">License:</span> {selectedDriver.licenseNumber}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Vehicle Information</h3>
                <p><span className="font-medium">Make:</span> {selectedDriver.vehicle.make}</p>
                <p><span className="font-medium">Model:</span> {selectedDriver.vehicle.model}</p>
                <p><span className="font-medium">Year:</span> {selectedDriver.vehicle.year}</p>
                <p><span className="font-medium">Color:</span> {selectedDriver.vehicle.color}</p>
                <p><span className="font-medium">License Plate:</span> {selectedDriver.vehicle.licensePlate}</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Documents Status</h3>
              <div className="grid grid-cols-2 gap-2">
                <p>
                  <span className="font-medium">Driver License:</span>
                  <span className={selectedDriver.documents.driverLicense ? 'text-green-600' : 'text-red-600'}>
                    {selectedDriver.documents.driverLicense ? ' Verified' : ' Missing'}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Insurance:</span>
                  <span className={selectedDriver.documents.insurance ? 'text-green-600' : 'text-red-600'}>
                    {selectedDriver.documents.insurance ? ' Verified' : ' Missing'}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Registration:</span>
                  <span className={selectedDriver.documents.registration ? 'text-green-600' : 'text-red-600'}>
                    {selectedDriver.documents.registration ? ' Verified' : ' Missing'}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Photo:</span>
                  <span className={selectedDriver.documents.photo ? 'text-green-600' : 'text-red-600'}>
                    {selectedDriver.documents.photo ? ' Verified' : ' Missing'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => handleReject(selectedDriver.id)}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-800 mr-2"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedDriver.id)}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingDriversList;
