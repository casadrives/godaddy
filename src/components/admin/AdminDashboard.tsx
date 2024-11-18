import React, { useState, useEffect } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminOverview } from './AdminOverview';
import { DriversManagement } from './DriversManagement';
import { RidesManagement } from './RidesManagement';
import { Settings } from './Settings';
import { SupportDashboard } from './support/SupportDashboard';
import { FinanceDashboard } from './finance/FinanceDashboard';
import { ClientsPanel } from './ClientsPanel';
import { CompanyPanel } from './CompanyPanel';
import { DispatchConsole } from '../dispatch/DispatchConsole';
import { AnalyticsDashboard } from './analytics/AnalyticsDashboard';
import { ContentDashboard } from './content/ContentDashboard';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';
import { useInView } from 'react-intersection-observer';
import { adminAuthService } from '../../services/adminAuthService';
import { AdminPasswordReset } from './AdminPasswordReset';
import { Settings as SettingsIcon, LogOut } from 'lucide-react';

interface SuspendedCompany {
  id: string;
  name: string;
  email: string;
  paymentDue: string;
  status: string;
}

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState('overview');
  const { user, logout } = useAuth();
  const [suspendedCompanies, setSuspendedCompanies] = useState<SuspendedCompany[]>([]);
  const { theme, setTheme } = useTheme();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time data updates
      // In production, this would be replaced with WebSocket or Server-Sent Events
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <AdminOverview suspendedCompanies={suspendedCompanies} />;
      case 'drivers':
        return <DriversManagement />;
      case 'rides':
        return <RidesManagement />;
      case 'finance':
        return <FinanceDashboard />;
      case 'clients':
        return <ClientsPanel />;
      case 'companies':
        return <CompanyPanel />;
      case 'support':
        return <SupportDashboard />;
      case 'settings':
        return <Settings />;
      case 'dispatch':
        return <DispatchConsole />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'content':
        return <ContentDashboard />;
      default:
        return <AdminOverview suspendedCompanies={suspendedCompanies} />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Toaster position="top-right" />
        
        <AdminHeader 
          user={user} 
          onLogout={handleLogout}
          theme={theme}
          onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        />

        <div className="flex h-[calc(100vh-4rem)]">
          <AdminSidebar 
            currentView={currentView} 
            setCurrentView={setCurrentView} 
          />

          <main 
            ref={ref}
            className="flex-1 p-6 overflow-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                  <div className="space-x-4">
                    <button
                      onClick={() => setShowPasswordReset(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <SettingsIcon className="h-5 w-5 mr-2" />
                      Change Password
                    </button>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>

                {showPasswordReset ? (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                      <button
                        onClick={() => setShowPasswordReset(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                    <AdminPasswordReset />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {renderView()}
                  </div>
                )}
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}