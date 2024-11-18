import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import driverTrackingService, {
  LocationUpdate,
  ActiveRide,
} from '../../services/driverTrackingService';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom car icon for the driver
const carIcon = new L.Icon({
  iconUrl: '/car-icon.png', // Add this icon to your public folder
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

interface LiveTrackingProps {
  ride: ActiveRide;
  className?: string;
}

const LiveTracking: React.FC<LiveTrackingProps> = ({ ride, className }) => {
  const [driverLocation, setDriverLocation] = useState<LocationUpdate | null>(
    null
  );
  const [path, setPath] = useState<[number, number][]>([]);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Subscribe to location updates
    const subscription = driverTrackingService.subscribeToRide(
      ride.rideId,
      (update) => {
        setDriverLocation(update);
        setPath((prevPath) => [...prevPath, [update.latitude, update.longitude]]);

        // Center map on driver's location
        if (mapRef.current) {
          mapRef.current.setView([update.latitude, update.longitude]);
        }
      }
    );

    // Initialize path with start location
    setPath([[ride.startLocation.latitude, ride.startLocation.longitude]]);

    return () => {
      subscription.unsubscribe();
    };
  }, [ride.rideId]);

  const formatTime = (date?: Date) => {
    return date ? new Date(date).toLocaleTimeString() : 'N/A';
  };

  const formatDuration = (startTime?: Date, endTime?: Date) => {
    if (!startTime) return 'N/A';
    const end = endTime || new Date();
    const duration = Math.floor(
      (end.getTime() - startTime.getTime()) / 1000 / 60
    );
    return `${duration} minutes`;
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Ride Status</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {ride.status}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Duration</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {formatDuration(ride.startTime, ride.endTime)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Start Time</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {formatTime(ride.startTime)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">ETA</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {formatTime(ride.estimatedArrival)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        <MapContainer
          center={[
            ride.startLocation.latitude,
            ride.startLocation.longitude,
          ]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Start Location Marker */}
          <Marker
            position={[
              ride.startLocation.latitude,
              ride.startLocation.longitude,
            ]}
          >
            <Popup>Pickup Location: {ride.startLocation.address}</Popup>
          </Marker>

          {/* End Location Marker */}
          <Marker
            position={[
              ride.endLocation.latitude,
              ride.endLocation.longitude,
            ]}
          >
            <Popup>Destination: {ride.endLocation.address}</Popup>
          </Marker>

          {/* Driver Location Marker */}
          {driverLocation && (
            <Marker
              position={[driverLocation.latitude, driverLocation.longitude]}
              icon={carIcon}
              rotationAngle={driverLocation.heading}
            >
              <Popup>
                <div>
                  <p>Driver is on the way</p>
                  <p>Speed: {Math.round(driverLocation.speed)} km/h</p>
                  <p>
                    Last Update:{' '}
                    {new Date(driverLocation.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Path Line */}
          <Polyline
            positions={path}
            color="#4F46E5"
            weight={3}
            opacity={0.7}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default LiveTracking;
