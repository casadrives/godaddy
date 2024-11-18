import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/home/Hero';
import { Features } from './components/home/Features';
import { About } from './components/home/About';
import { Contact } from './components/home/Contact';
import { CallToAction } from './components/home/CallToAction';
import { DownloadApp } from './components/home/DownloadApp';
import { DemoAccess } from './components/demo/DemoAccess';
import { DriverSignupModal } from './components/auth/DriverSignupModal';
import { SignInModal } from './components/auth/SignInModal';
import { CompanySignupModal } from './components/auth/CompanySignupModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CompanyDashboard } from './components/company/CompanyDashboard';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { ClientDashboard } from './components/ClientDashboard';
import { useStore } from './store/useStore';
import { AirportTransfer } from './components/home/AirportTransfer';
import { Sponsors } from './components/home/Sponsors';
import { Reviews } from './components/home/Reviews';
import { WeatherForecast } from './components/home/WeatherForecast';
import { ToastProvider } from './components/ToastProvider';
import { RideBookingFlow } from './components/RideBookingFlow';

const scrollToBooking = () => {
  const bookingSection = document.getElementById('booking-section');
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const HomePage = () => (
  <>
    <Hero onBookRide={scrollToBooking} />
    <Features />
    <AirportTransfer />
    <WeatherForecast />
    <About />
    <div id="booking-section" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RideBookingFlow />
      </div>
    </div>
    <Reviews />
    <Sponsors />
    <DemoAccess />
    <Contact />
    <CallToAction 
      onBookRide={scrollToBooking}
      onBecomeDriver={() => {}}
      onCompanyAccess={() => {}}
      onAdminAccess={() => {}}
    />
    <DownloadApp />
  </>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'company' | 'driver' | 'user';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  const [showDriverSignup, setShowDriverSignup] = React.useState(false);
  const [showCompanySignup, setShowCompanySignup] = React.useState(false);
  const [showSignIn, setShowSignIn] = React.useState(false);
  const [signInRole, setSignInRole] = React.useState<'user' | 'company' | 'driver' | 'admin'>('user');

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <Header 
          onDriverAccess={() => setShowDriverSignup(true)}
          onCompanyAccess={() => {
            setSignInRole('company');
            setShowSignIn(true);
          }}
          onAdminAccess={() => {
            setSignInRole('admin');
            setShowSignIn(true);
          }}
        />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/book" 
            element={
              <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <RideBookingFlow />
                </div>
              </div>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/*" 
            element={
              <ProtectedRoute requiredRole="company">
                <CompanyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/driver/*" 
            element={
              <ProtectedRoute requiredRole="driver">
                <DriverDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/client/*" 
            element={
              <ProtectedRoute requiredRole="user">
                <ClientDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>

        {showDriverSignup && (
          <DriverSignupModal isOpen={true} onClose={() => setShowDriverSignup(false)} />
        )}
        
        {showCompanySignup && (
          <CompanySignupModal isOpen={true} onClose={() => setShowCompanySignup(false)} />
        )}
        
        {showSignIn && (
          <SignInModal 
            isOpen={true}
            onClose={() => setShowSignIn(false)} 
            role={signInRole}
          />
        )}
      </div>
    </ToastProvider>
  );
}