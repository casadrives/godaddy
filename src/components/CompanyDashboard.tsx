import React, { useState } from 'react';
import { MapPin, Users, Car, BarChart2, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CRMPanel } from './company/CRMPanel';
import { AnalyticsPanel } from './company/AnalyticsPanel'; // Import the AnalyticsPanel component

export function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('map');
  const { user, logout } = useAuth();

  const tabs = [
    { id: 'map', label: 'Live Map', icon: MapPin },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'crm', label: 'CRM', icon: BarChart2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 }, // Add the 'Analytics' tab
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Live Map</h2>
            {/* Map component will go here */}
          </div>
        );
      case 'drivers':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Driver Management</h2>
            {/* Driver management component will go here */}
          </div>
        );
      case 'vehicles':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Vehicle Management</h2>
            {/* Vehicle management component will go here */}
          </div>
        );
      case 'crm':
        return <CRMPanel />;
      case 'analytics':
        return <AnalyticsPanel />; // Render the AnalyticsPanel component
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Company Settings</h2>
            {/* Settings component will go here */}
          </div>
        );
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                {user?.companyName || 'Company Dashboard'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2 inline" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}