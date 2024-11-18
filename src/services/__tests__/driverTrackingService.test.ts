import { driverTrackingService } from '../driverTrackingService';
import { gpsService } from '../gpsService';
import { Subject } from 'rxjs';

jest.mock('../gpsService');

describe('Driver Tracking Service', () => {
  const mockLocation$ = new Subject();
  const mockRideId = 'test-ride-123';
  const mockLocation = {
    latitude: 49.6116,
    longitude: 6.1319,
    heading: 90,
    speed: 30,
    timestamp: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (gpsService.location$ as any) = mockLocation$;
  });

  afterEach(() => {
    mockLocation$.complete();
  });

  describe('startTracking', () => {
    it('should start GPS tracking and subscribe to location updates', async () => {
      const spy = jest.spyOn(gpsService, 'startTracking');
      
      await driverTrackingService.startTracking(mockRideId);
      expect(spy).toHaveBeenCalled();
    });

    it('should update location when GPS emits new position', (done) => {
      driverTrackingService.startTracking(mockRideId);

      driverTrackingService.currentLocation$.subscribe((location) => {
        expect(location).toEqual(mockLocation);
        done();
      });

      mockLocation$.next(mockLocation);
    });

    it('should send location update to server', async () => {
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      );

      await driverTrackingService.startTracking(mockRideId);
      mockLocation$.next(mockLocation);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/driver/location'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            rideId: mockRideId,
            ...mockLocation,
          }),
        })
      );
    });
  });

  describe('stopTracking', () => {
    it('should stop GPS tracking', () => {
      const spy = jest.spyOn(gpsService, 'stopTracking');
      
      driverTrackingService.stopTracking();
      expect(spy).toHaveBeenCalled();
    });

    it('should complete location subscription', (done) => {
      driverTrackingService.startTracking(mockRideId);
      
      driverTrackingService.currentLocation$.subscribe({
        complete: () => {
          done();
        },
      });

      driverTrackingService.stopTracking();
    });
  });

  describe('error handling', () => {
    it('should handle GPS permission denial', async () => {
      jest.spyOn(gpsService, 'requestPermission').mockResolvedValueOnce(false);
      
      await expect(driverTrackingService.startTracking(mockRideId)).rejects.toThrow(
        'GPS permission denied'
      );
    });

    it('should handle server errors', async () => {
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        })
      );

      await driverTrackingService.startTracking(mockRideId);
      mockLocation$.next(mockLocation);

      // Should continue running despite server error
      expect(gpsService.stopTracking).not.toHaveBeenCalled();
    });
  });
});
