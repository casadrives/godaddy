import { http, HttpResponse } from 'msw';
import { config } from '../../config/production';

export const handlers = [
  // Driver location update
  http.post(`${config.api.baseUrl}/api/${config.api.version}/driver/location`, async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({ success: true, data });
  }),

  // Get driver location
  http.get(`${config.api.baseUrl}/api/${config.api.version}/driver/:driverId/location`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        latitude: 49.6116,
        longitude: 6.1319,
        heading: 90,
        speed: 30,
        timestamp: new Date().toISOString(),
      },
    });
  }),

  // Get ride tracking info
  http.get(`${config.api.baseUrl}/api/${config.api.version}/ride/:rideId/tracking`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        status: 'in_progress',
        startLocation: {
          latitude: 49.6116,
          longitude: 6.1319,
        },
        endLocation: {
          latitude: 49.6200,
          longitude: 6.1300,
        },
        currentLocation: {
          latitude: 49.6150,
          longitude: 6.1310,
        },
        estimatedArrival: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      },
    });
  }),

  // Update ride status
  http.patch(`${config.api.baseUrl}/api/${config.api.version}/ride/:rideId/status`, async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({ success: true, data });
  }),
];
