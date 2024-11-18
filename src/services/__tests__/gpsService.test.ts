import { gpsService } from '../gpsService';

describe('GPS Service', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('requestPermission', () => {
    it('should request geolocation permission', async () => {
      const mockSuccess = { coords: { latitude: 49.6116, longitude: 6.1319 } };
      (navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce((success) =>
        success(mockSuccess)
      );

      const result = await gpsService.requestPermission();
      expect(result).toBe(true);
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    });

    it('should handle permission denial', async () => {
      const mockError = { code: 1 }; // Permission denied
      (navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce((success, error) =>
        error(mockError)
      );

      const result = await gpsService.requestPermission();
      expect(result).toBe(false);
    });
  });

  describe('startTracking', () => {
    it('should start watching position', () => {
      const watchId = 123;
      (navigator.geolocation.watchPosition as jest.Mock).mockReturnValue(watchId);

      gpsService.startTracking();
      expect(navigator.geolocation.watchPosition).toHaveBeenCalled();
    });

    it('should emit position updates', (done) => {
      const mockPosition = {
        coords: {
          latitude: 49.6116,
          longitude: 6.1319,
          heading: 90,
          speed: 30,
        },
        timestamp: Date.now(),
      };

      (navigator.geolocation.watchPosition as jest.Mock).mockImplementationOnce((success) => {
        success(mockPosition);
        return 123;
      });

      gpsService.location$.subscribe((location) => {
        expect(location).toEqual({
          latitude: mockPosition.coords.latitude,
          longitude: mockPosition.coords.longitude,
          heading: mockPosition.coords.heading,
          speed: mockPosition.coords.speed,
          timestamp: mockPosition.timestamp,
        });
        done();
      });

      gpsService.startTracking();
    });
  });

  describe('stopTracking', () => {
    it('should clear watch position', () => {
      const watchId = 123;
      (navigator.geolocation.watchPosition as jest.Mock).mockReturnValue(watchId);

      gpsService.startTracking();
      gpsService.stopTracking();

      expect(navigator.geolocation.clearWatch).toHaveBeenCalledWith(watchId);
    });
  });
});
