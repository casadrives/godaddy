import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { rideService, Ride } from '../services/rideService';

interface UseRideStatusProps {
  rideId: string;
  onStatusChange?: (status: Ride['status']) => void;
  enabled?: boolean;
}

export function useRideStatus({ rideId, onStatusChange, enabled = true }: UseRideStatusProps) {
  const [lastStatus, setLastStatus] = useState<Ride['status'] | null>(null);

  // Query for initial ride status
  const { data: ride, error } = useQuery({
    queryKey: ['ride', rideId],
    queryFn: () => rideService.getRideStatus(rideId),
    enabled: enabled && Boolean(rideId),
    refetchInterval: 10000, // Refetch every 10 seconds as backup
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!enabled || !rideId) return;

    const unsubscribe = rideService.subscribeToRideUpdates(rideId, (updatedRide) => {
      // Check if status has changed
      if (updatedRide.status !== lastStatus) {
        setLastStatus(updatedRide.status);
        onStatusChange?.(updatedRide.status);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [rideId, enabled, lastStatus, onStatusChange]);

  const isActive = ride?.status !== 'completed' && ride?.status !== 'cancelled';

  return {
    ride,
    status: ride?.status,
    isActive,
    error,
  };
}
