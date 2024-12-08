import React, { useState, useEffect } from 'react';
import { riderService } from '@/services/riderService';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface RideRequestProps {
  userId: string;
  onRideRequested?: (ride: any) => void;
}

export const RideRequest: React.FC<RideRequestProps> = ({ userId, onRideRequested }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rideData, setRideData] = useState({
    pickup_address: '',
    pickup_latitude: 0,
    pickup_longitude: 0,
    dropoff_address: '',
    dropoff_latitude: 0,
    dropoff_longitude: 0,
    service_type: 'standard',
    notes: ''
  });
  const [nearbyDrivers, setNearbyDrivers] = useState([]);

  useEffect(() => {
    if (rideData.pickup_latitude && rideData.pickup_longitude) {
      loadNearbyDrivers();
    }
  }, [rideData.pickup_latitude, rideData.pickup_longitude]);

  const loadNearbyDrivers = async () => {
    try {
      const drivers = await riderService.getNearbyDrivers(
        rideData.pickup_latitude,
        rideData.pickup_longitude
      );
      setNearbyDrivers(drivers);
    } catch (error) {
      console.error('Error loading nearby drivers:', error);
    }
  };

  const handleLocationSelect = async (type: 'pickup' | 'dropoff', location: any) => {
    setRideData(prev => ({
      ...prev,
      [`${type}_address`]: location.address,
      [`${type}_latitude`]: location.latitude,
      [`${type}_longitude`]: location.longitude
    }));
  };

  const handleRequestRide = async () => {
    try {
      setLoading(true);
      setError(null);

      const ride = await riderService.requestRide({
        user_id: userId,
        ...rideData
      });

      if (onRideRequested) {
        onRideRequested(ride);
      }

      setActiveStep(3); // Success step
    } catch (error: any) {
      setError(error.message || 'Failed to request ride');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Set Pickup', 'Set Destination', 'Confirm'];

  return (
    <Card sx={{ p: 3 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 2 }}>
        {activeStep === 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Set Pickup Location
            </Typography>
            <TextField
              fullWidth
              label="Pickup Address"
              value={rideData.pickup_address}
              onChange={(e) => setRideData(prev => ({
                ...prev,
                pickup_address: e.target.value
              }))}
              sx={{ mb: 2 }}
            />
            <Box sx={{ height: 300, mb: 2 }}>
              <MapContainer
                center={[49.6116, 6.1319]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {nearbyDrivers.map((driver: any) => (
                  <Marker
                    key={driver.id}
                    position={[driver.latitude, driver.longitude]}
                  />
                ))}
              </MapContainer>
            </Box>
          </>
        )}

        {activeStep === 1 && (
          <>
            <Typography variant="h6" gutterBottom>
              Set Destination
            </Typography>
            <TextField
              fullWidth
              label="Dropoff Address"
              value={rideData.dropoff_address}
              onChange={(e) => setRideData(prev => ({
                ...prev,
                dropoff_address: e.target.value
              }))}
              sx={{ mb: 2 }}
            />
            <Box sx={{ height: 300, mb: 2 }}>
              <MapContainer
                center={[49.6116, 6.1319]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              </MapContainer>
            </Box>
          </>
        )}

        {activeStep === 2 && (
          <>
            <Typography variant="h6" gutterBottom>
              Confirm Ride Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Pickup</Typography>
              <Typography color="textSecondary">{rideData.pickup_address}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Destination</Typography>
              <Typography color="textSecondary">{rideData.dropoff_address}</Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Additional Notes"
              value={rideData.notes}
              onChange={(e) => setRideData(prev => ({
                ...prev,
                notes: e.target.value
              }))}
              sx={{ mb: 2 }}
            />
          </>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={() => setActiveStep(prev => prev - 1)}
          >
            Back
          </Button>
          <Button
            variant="contained"
            disabled={loading}
            onClick={activeStep === steps.length - 1 ? handleRequestRide : () => setActiveStep(prev => prev + 1)}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : activeStep === steps.length - 1 ? (
              'Request Ride'
            ) : (
              'Next'
            )}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};
