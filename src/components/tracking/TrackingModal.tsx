import React from 'react';
import LiveTracking from './LiveTracking';
import { ActiveRide } from '../../services/driverTrackingService';

interface TrackingModalProps {
  ride: ActiveRide;
  onClose: () => void;
}

const TrackingModal: React.FC<TrackingModalProps> = ({ ride, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[40rem]">
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Live Tracking</h2>
              <p className="text-sm text-gray-500">
                Ride #{ride.rideId} • Driver #{ride.driverId}
              </p>
            </div>
            <button
              onClick={onClose}
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
          <div className="flex-1 p-6">
            <LiveTracking ride={ride} className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingModal;
