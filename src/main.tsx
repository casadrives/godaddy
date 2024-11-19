import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import * as Sentry from "@sentry/react";
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import AppComponent from './App';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Initialize Sentry
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false
    }
  }
});

// Initialize Capacitor plugins with proper error handling
const initializeApp = async () => {
  try {
    // Only initialize Capacitor plugins if running in native app context
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isNative = userAgent.includes('capacitor');

    if (isNative) {
      await StatusBar.setStyle({ style: 'dark' });
      await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
      
      // Hide splash screen with fade
      await SplashScreen.hide({
        fadeOutDuration: 500
      });

      // Handle back button
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp();
        }
      });
    }
  } catch (error) {
    console.warn('Capacitor initialization skipped:', error);
    Sentry.captureException(error);
  }
};

// Initialize app
initializeApp().catch((error) => {
  console.error('App initialization failed:', error);
  Sentry.captureException(error);
});

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<div>An error has occurred</div>}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <AppProvider>
              <AppComponent />
              <Toaster position="top-right" expand={true} richColors />
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  </StrictMode>
);