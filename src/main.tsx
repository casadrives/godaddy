import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Style } from 'mapbox-gl';

// Initialize Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || ''

const queryClient = new QueryClient()

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
    // Log error but don't prevent app from loading
    console.warn('Capacitor initialization skipped:', error);
  }
};

// Initialize app
initializeApp().catch(console.warn);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <AppComponent />
            <Toaster position="top-right" toastOptions={{ style: Style.Dark }} />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)