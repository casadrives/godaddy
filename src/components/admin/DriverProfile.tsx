import React from 'react';
import { Driver, DriverStatus } from '../../types/driver';

interface DriverProfileProps {
  driver: Driver;
  onClose: () => void;
  onStatusChange: (status: DriverStatus) => void;
}

const DriverProfile: React.FC<DriverProfileProps> = ({ driver, onClose, onStatusChange }) => {
  const getStatusColor = (status: DriverStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Driver Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{`${driver.firstName} ${driver.lastName}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{driver.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{driver.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">
                  {`${driver.address.street}, ${driver.address.city}, ${driver.address.postalCode}`}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Vehicle Type</p>
                <p className="font-medium">{driver.vehicle.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Make & Model</p>
                <p className="font-medium">{`${driver.vehicle.make} ${driver.vehicle.model}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">License Plate</p>
                <p className="font-medium">{driver.vehicle.licensePlate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{driver.vehicle.year}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
            <div className="space-y-3">
              {Object.entries(driver.documents).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    value.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {value.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status and Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Actions</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Current Status</p>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(driver.status)}`}>
                  {driver.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Change Status</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onStatusChange('ACTIVE')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    disabled={driver.status === 'ACTIVE'}
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => onStatusChange('SUSPENDED')}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    disabled={driver.status === 'SUSPENDED'}
                  >
                    Suspend
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Registration Date</p>
                <p className="font-medium">
                  {new Date(driver.registrationDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
