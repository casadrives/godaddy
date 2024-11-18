import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookRide } from './BookRide';
import { RideTracking } from './tracking/RideTracking';
import { useRideStatus } from '../hooks/useRideStatus';
import { rideService, RideRequest, Ride } from '../services/rideService';
import { useToast } from '../hooks/useToast';
import { Loader2 } from 'lucide-react';

export function RideBookingFlow() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [currentRide, setCurrentRide] = React.useState<Ride | null>(null);
  const [isBooking, setIsBooking] = React.useState(false);

  // Handle ride status updates
  const { status, isActive, error: statusError } = useRideStatus({
    rideId: currentRide?.id || '',
    onStatusChange: (newStatus) => {
      if (newStatus === 'completed') {
        showToast({
          title: 'Ride Completed',
          message: 'Thank you for riding with us!',
          type: 'success',
          duration: 8000,
        });
        // Navigate to rating screen
        navigate(`/rides/${currentRide?.id}/rate`);
      } else if (newStatus === 'cancelled') {
        showToast({
          title: 'Ride Cancelled',
          message: 'Your ride has been cancelled.',
          type: 'error',
          duration: 8000,
        });
        setCurrentRide(null);
      } else if (newStatus === 'accepted') {
        showToast({
          title: 'Driver Found',
          message: `${currentRide?.driver?.name} is on their way!`,
          type: 'success',
          duration: 8000,
        });
      }
    }
  });

  // Show error toast if status update fails
  React.useEffect(() => {
    if (statusError) {
      showToast({
        title: 'Connection Error',
        message: 'Unable to get ride updates. Please check your connection.',
        type: 'error',
        duration: 8000,
      });
    }
  }, [statusError, showToast]);

  // Handle booking a new ride
  const handleBookRide = async (request: RideRequest) => {
    setIsBooking(true);
    try {
      const ride = await rideService.requestRide(request);
      setCurrentRide(ride);
      showToast({
        title: 'Ride Requested',
        message: 'Looking for nearby drivers...',
        type: 'info',
        duration: 8000,
      });
    } catch (error) {
      showToast({
        title: 'Booking Failed',
        message: 'Unable to book your ride. Please try again.',
        type: 'error',
        duration: 8000,
      });
    } finally {
      setIsBooking(false);
    }
  };

  // Handle cancelling a ride
  const handleCancelRide = async () => {
    if (!currentRide) return;

    try {
      await rideService.cancelRide(currentRide.id);
      showToast({
        title: 'Ride Cancelled',
        message: 'Your ride has been cancelled.',
        type: 'info',
        duration: 5000,
      });
      setCurrentRide(null);
    } catch (error) {
      showToast({
        title: 'Cancel Failed',
        message: 'Unable to cancel your ride. Please try again.',
        type: 'error',
        duration: 8000,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {!currentRide && !isBooking && (
        <BookRide onSubmit={handleBookRide} />
      )}

      {isBooking && (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4">
            <Loader2 className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Booking Your Ride</h3>
          <p className="text-gray-600">Please wait while we process your request...</p>
        </div>
      )}

      {currentRide && isActive && currentRide.driver && (
        <RideTracking
          rideId={currentRide.id}
          driver={currentRide.driver}
          pickup={currentRide.request.pickupLocation}
          dropoff={currentRide.request.dropoffLocation}
          onCancel={handleCancelRide}
        />
      )}

      {/* Show loading state while waiting for driver */}
      {currentRide && status === 'pending' && (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4">
            <Loader2 className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Finding Your Driver</h3>
          <p className="text-gray-600">We're matching you with the best available driver...</p>
          <button
            onClick={handleCancelRide}
            className="mt-4 px-4 py-2 text-red-500 hover:text-red-600 transition-colors"
          >
            Cancel Request
          </button>
        </div>
      )}
    </div>
  );
}
