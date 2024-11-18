export const config = {
  api: {
    baseUrl: process.env.REACT_APP_API_URL || '',
    version: process.env.REACT_APP_API_VERSION || 'v1',
    timeout: 30000,
    retryAttempts: 3,
  },

  maps: {
    provider: 'mapbox',
    apiKey: process.env.REACT_APP_MAPBOX_TOKEN || '',
    defaultCenter: {
      latitude: 49.6116,  // Luxembourg City center
      longitude: 6.1319,
    },
    defaultZoom: 12,
  },

  tracking: {
    gps: {
      updateInterval: parseInt(process.env.REACT_APP_GPS_UPDATE_INTERVAL || '5000', 10),
      highAccuracy: true,
      timeout: parseInt(process.env.REACT_APP_GPS_TIMEOUT || '10000', 10),
      maximumAge: 0,
    },
    features: {
      enableLiveTracking: true,
      enableRealGPS: true,
      enableMockData: false,
    },
  },

  auth: {
    domain: process.env.REACT_APP_AUTH0_DOMAIN || '',
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || '',
    audience: process.env.REACT_APP_AUTH0_AUDIENCE || '',
  },

  monitoring: {
    sentry: {
      dsn: process.env.REACT_APP_SENTRY_DSN || '',
      environment: 'production',
      tracesSampleRate: 0.1,
    },
    analytics: {
      googleAnalyticsId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID || '',
    },
  },

  region: {
    timezone: process.env.REACT_APP_DEFAULT_TIMEZONE || 'Europe/Luxembourg',
    locale: process.env.REACT_APP_DEFAULT_LOCALE || 'fr-LU',
    supportedLanguages: (process.env.REACT_APP_SUPPORTED_LANGUAGES || 'en,fr,de,lu').split(','),
  },

  security: {
    sessionTimeout: 3600000, // 1 hour
    maxLoginAttempts: 5,
    passwordMinLength: 8,
  },
};
