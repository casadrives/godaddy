import React, { useEffect, useState } from 'react';
import { companyService } from '@/services/companyService';
import { Box, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in production
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface DriverMapProps {
  companyId: string;
}

export const DriverMap: React.FC<DriverMapProps> = ({ companyId }) => {
  const [driverLocations, setDriverLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await companyService.getDriverLocations(companyId);
        setDriverLocations(locations);
      } catch (error) {
        console.error('Error fetching driver locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
    // Update locations every 30 seconds
    const interval = setInterval(fetchLocations, 30000);

    return () => clearInterval(interval);
  }, [companyId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  // Calculate map center based on driver locations or default to Luxembourg City
  const center = driverLocations.length > 0
    ? [
        driverLocations.reduce((sum, loc) => sum + loc.latitude, 0) / driverLocations.length,
        driverLocations.reduce((sum, loc) => sum + loc.longitude, 0) / driverLocations.length
      ]
    : [49.6116, 6.1319]; // Luxembourg City coordinates

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {driverLocations.map((location) => (
        <Marker
          key={location.driver_id}
          position={[location.latitude, location.longitude]}
        >
          <Popup>
            <div>
              <strong>
                {location.drivers.users.first_name} {location.drivers.users.last_name}
              </strong>
              <br />
              Last updated: {new Date(location.last_updated).toLocaleTimeString()}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
