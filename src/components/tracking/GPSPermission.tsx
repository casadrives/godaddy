import React, { useState } from 'react';
import gpsService from '../../services/gpsService';

interface GPSPermissionProps {
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
}

const GPSPermission: React.FC<GPSPermissionProps> = ({
  onPermissionGranted,
  onPermissionDenied,
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    setIsRequesting(true);
    setError(null);

    try {
      // Check if GPS is available
      if (!gpsService.isGPSAvailable()) {
        throw new Error('GPS is not available on this device');
      }

      // Request permission
      const granted = await gpsService.requestPermission();
      if (granted) {
        onPermissionGranted();
      } else {
        onPermissionDenied();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request GPS permission');
      onPermissionDenied();
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
            <svg
              className="h-6 w-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Enable Location Services
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            We need your location to provide accurate ride tracking and ensure a smooth
            experience. Please enable location services to continue.
          </p>

          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <div className="mt-5 sm:mt-6 space-y-2">
            <button
              onClick={requestPermission}
              disabled={isRequesting}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
            >
              {isRequesting ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : null}
              {isRequesting ? 'Requesting Access...' : 'Enable Location Services'}
            </button>
            <button
              onClick={onPermissionDenied}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPSPermission;
