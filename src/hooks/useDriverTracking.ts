import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

interface DriverLocation {
  coordinates: [number, number];
  heading: number;
  speed: number;
  timestamp: number;
}

interface UseDriverTrackingProps {
  driverId: string;
  rideId: string;
  enabled?: boolean;
}

export function useDriverTracking({ driverId, rideId, enabled = true }: UseDriverTrackingProps) {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Get initial driver location
  const { data: initialLocation } = useQuery({
    queryKey: ['driverLocation', driverId],
    queryFn: async () => {
      const response = await api.get(`/drivers/${driverId}/location`);
      return response.data as DriverLocation;
    },
    enabled: enabled && !isConnected,
  });

  // Connect to WebSocket for real-time updates
  useEffect(() => {
    if (!enabled) return;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/tracking/${rideId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('Connected to driver tracking');
    };

    ws.onmessage = (event) => {
      try {
        const location = JSON.parse(event.data) as DriverLocation;
        queryClient.setQueryData(['driverLocation', driverId], location);
      } catch (error) {
        console.error('Error parsing driver location:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from driver tracking');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (enabled) {
          console.log('Attempting to reconnect...');
          setSocket(null);
        }
      }, 5000);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [enabled, driverId, rideId, socket === null]);

  // Calculate ETA
  const calculateETA = useCallback(async (destination: [number, number]) => {
    if (!initialLocation) return null;

    try {
      const response = await api.get('/directions/eta', {
        params: {
          origin: initialLocation.coordinates.join(','),
          destination: destination.join(','),
        },
      });
      return response.data.duration;
    } catch (error) {
      console.error('Error calculating ETA:', error);
      return null;
    }
  }, [initialLocation]);

  return {
    driverLocation: queryClient.getQueryData(['driverLocation', driverId]) as DriverLocation | undefined,
    isConnected,
    calculateETA,
  };
}
