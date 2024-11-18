import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import amplitude from 'amplitude-js';
import { config } from '../config/production';

export const initializeMonitoring = () => {
  // Initialize Sentry
  if (config.monitoring.sentry.dsn) {
    Sentry.init({
      dsn: config.monitoring.sentry.dsn,
      integrations: [new BrowserTracing()],
      tracesSampleRate: config.monitoring.sentry.tracesSampleRate,
      environment: config.monitoring.sentry.environment,
      beforeSend(event) {
        // Don't send events in development
        if (process.env.NODE_ENV === 'development') {
          return null;
        }
        return event;
      },
    });
  }

  // Initialize Amplitude
  if (config.monitoring.analytics.googleAnalyticsId) {
    amplitude.getInstance().init(config.monitoring.analytics.googleAnalyticsId);
  }
};

export const logError = (error: Error, context?: Record<string, any>) => {
  console.error(error);
  
  if (config.monitoring.sentry.dsn) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
};

export const logEvent = (eventName: string, properties?: Record<string, any>) => {
  if (config.monitoring.analytics.googleAnalyticsId) {
    amplitude.getInstance().logEvent(eventName, properties);
  }
};

export const setUserContext = (userId: string, userProperties?: Record<string, any>) => {
  if (config.monitoring.sentry.dsn) {
    Sentry.setUser({ id: userId, ...userProperties });
  }

  if (config.monitoring.analytics.googleAnalyticsId) {
    amplitude.getInstance().setUserId(userId);
    if (userProperties) {
      amplitude.getInstance().setUserProperties(userProperties);
    }
  }
};
