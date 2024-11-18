import React from 'react';
import { Phone, MessageCircle, Navigation2, Clock, AlertCircle } from 'lucide-react';
import { LocationMap } from '../LocationMap';
import { useDriverTracking } from '../../hooks/useDriverTracking';
import { Driver } from '../../services/rideService';
import { format } from 'date-fns';

interface RideTrackingProps {
  rideId: string;
  driver: Driver;
  pickup: {
    address: string;
    coordinates: [number, number];
  };
  dropoff: {
    address: string;
    coordinates: [number, number];
  };
  onCancel: () => void;
}

export function RideTracking({
  rideId,
  driver,
  pickup,
  dropoff,
  onCancel,
}: RideTrackingProps) {
  const { driverLocation, isConnected, calculateETA } = useDriverTracking({
    driverId: driver.id,
    rideId,
  });

  const [eta, setEta] = React.useState<number | null>(null);

  // Update ETA when driver location changes
  React.useEffect(() => {
    if (driverLocation) {
      calculateETA(pickup.coordinates).then(setEta);
    }
  }, [driverLocation, pickup.coordinates, calculateETA]);

  const markers = [
    { coordinates: pickup.coordinates, type: 'pickup' as const },
    { coordinates: dropoff.coordinates, type: 'dropoff' as const },
    ...(driverLocation
      ? [{ coordinates: driverLocation.coordinates, type: 'driver' as const }]
      : []),
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Map */}
      <div className="h-64 relative">
        <LocationMap markers={markers} showRoute />
        
        {!isConnected && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span>Reconnecting to driver location...</span>
            </div>
          </div>
        )}
      </div>

      {/* Driver info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{driver.name}</h3>
            <p className="text-sm text-gray-500">
              {driver.vehicle.make} {driver.vehicle.model} • {driver.vehicle.licensePlate}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => window.open(`tel:${driver.phone}`)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Phone className="h-5 w-5" />
            </button>
            <button
              onClick={() => {/* Implement chat */}}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ETA */}
        {eta !== null && (
          <div className="mt-4 bg-blue-50 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Navigation2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Driver is on the way</p>
                <p className="text-sm text-gray-600">
                  Arriving in approximately {Math.round(eta / 60)} minutes
                </p>
              </div>
            </div>
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
        )}

        {/* Locations */}
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-sm text-gray-500">Pickup</p>
            <p className="font-medium">{pickup.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Dropoff</p>
            <p className="font-medium">{dropoff.address}</p>
          </div>
        </div>

        {/* Cancel button */}
        <button
          onClick={onCancel}
          className="mt-4 w-full py-2 px-4 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
        >
          Cancel Ride
        </button>
      </div>
    </div>
  );
}
