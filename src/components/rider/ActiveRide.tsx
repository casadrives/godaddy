import React, { useEffect, useState } from 'react';
import { riderService } from '@/services/riderService';
import {
  Box,
  Card,
  Typography,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Message as MessageIcon,
  Cancel as CancelIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface ActiveRideProps {
  userId: string;
  onRideComplete?: () => void;
}

export const ActiveRide: React.FC<ActiveRideProps> = ({ userId, onRideComplete }) => {
  const [ride, setRide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    loadActiveRide();
    // Subscribe to ride updates
    let subscription: any;
    if (ride?.id) {
      subscription = riderService.subscribeToRideUpdates(
        ride.id,
        (payload) => {
          if (payload.new.status === 'completed') {
            setShowRating(true);
          }
          setRide(payload.new);
        }
      );
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [userId, ride?.id]);

  const loadActiveRide = async () => {
    try {
      setLoading(true);
      const activeRide = await riderService.getActiveRide(userId);
      setRide(activeRide);
    } catch (error) {
      console.error('Error loading active ride:', error);
      setError('Failed to load ride details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await riderService.cancelRide(ride.id, cancelReason);
      setShowCancelDialog(false);
      if (onRideComplete) {
        onRideComplete();
      }
    } catch (error) {
      console.error('Error canceling ride:', error);
      setError('Failed to cancel ride');
    }
  };

  const handleRating = async () => {
    if (!rating) return;
    try {
      await riderService.rateRide(ride.id, rating, review);
      setShowRating(false);
      if (onRideComplete) {
        onRideComplete();
      }
    } catch (error) {
      console.error('Error rating ride:', error);
      setError('Failed to submit rating');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!ride) {
    return (
      <Box p={3}>
        <Typography>No active ride found</Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mb: 3 }}>
        <Chip
          label={ride.status.replace('_', ' ').toUpperCase()}
          color={
            ride.status === 'in_progress'
              ? 'success'
              : ride.status === 'accepted'
              ? 'primary'
              : 'default'
          }
          sx={{ mb: 2 }}
        />

        {ride.driver && (
          <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
            <Avatar
              src={ride.driver.users.avatar_url}
              sx={{ width: 60, height: 60, mr: 2 }}
            />
            <Box>
              <Typography variant="h6">
                {ride.driver.users.first_name} {ride.driver.users.last_name}
              </Typography>
              {ride.vehicle && (
                <Typography color="textSecondary">
                  {ride.vehicle.make} {ride.vehicle.model} - {ride.vehicle.license_plate}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <Box sx={{ height: 300, mb: 2 }}>
          <MapContainer
            center={[ride.pickup_latitude, ride.pickup_longitude]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[ride.pickup_latitude, ride.pickup_longitude]}>
              <Popup>Pickup Location</Popup>
            </Marker>
            <Marker position={[ride.dropoff_latitude, ride.dropoff_longitude]}>
              <Popup>Dropoff Location</Popup>
            </Marker>
            {ride.driver_location && (
              <Marker
                position={[
                  ride.driver_location.latitude,
                  ride.driver_location.longitude
                ]}
              >
                <Popup>Driver Location</Popup>
              </Marker>
            )}
          </MapContainer>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Pickup</Typography>
          <Typography color="textSecondary">{ride.pickup_address}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Destination</Typography>
          <Typography color="textSecondary">{ride.dropoff_address}</Typography>
        </Box>

        {ride.driver && (
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<PhoneIcon />}
              href={`tel:${ride.driver.users.phone}`}
            >
              Call Driver
            </Button>
            <Button
              variant="outlined"
              startIcon={<MessageIcon />}
              href={`sms:${ride.driver.users.phone}`}
            >
              Message
            </Button>
          </Box>
        )}

        {ride.status === 'pending' && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => setShowCancelDialog(true)}
            sx={{ mt: 2 }}
          >
            Cancel Ride
          </Button>
        )}
      </Box>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)}>
        <DialogTitle>Cancel Ride</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for cancellation"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelDialog(false)}>Back</Button>
          <Button onClick={handleCancel} color="error">
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={showRating} onClose={() => setShowRating(false)}>
        <DialogTitle>Rate Your Ride</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Rating
              value={rating}
              onChange={(_, value) => setRating(value)}
              size="large"
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Write a review (optional)"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRating(false)}>Skip</Button>
          <Button onClick={handleRating} disabled={!rating} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
