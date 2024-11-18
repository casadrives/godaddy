import React, { useState } from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-hot-toast';

interface SettingsForm {
  general: {
    companyName: string;
    supportEmail: string;
    baseCurrency: string;
    timezone: string;
  };
  ride: {
    basePrice: number;
    pricePerKm: number;
    pricePerMinute: number;
    surgePricingMultiplier: number;
    maxActiveRidesPerDriver: number;
    maxCancellationsPerDay: number;
    autoAssignmentRadius: number;
    minimumDriverRating: number;
  };
  notifications: {
    enableEmailNotifications: boolean;
    enablePushNotifications: boolean;
    enableSMSNotifications: boolean;
    notificationRadius: number;
  };
}

export function Settings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SettingsForm>({
    general: {
      companyName: 'CasaDrive',
      supportEmail: 'support@casadrive.lu',
      baseCurrency: 'EUR',
      timezone: 'Europe/Luxembourg',
    },
    ride: {
      basePrice: 5,
      pricePerKm: 1.5,
      pricePerMinute: 0.3,
      surgePricingMultiplier: 1.5,
      maxActiveRidesPerDriver: 1,
      maxCancellationsPerDay: 3,
      autoAssignmentRadius: 5000,
      minimumDriverRating: 4.5,
    },
    notifications: {
      enableEmailNotifications: true,
      enablePushNotifications: true,
      enableSMSNotifications: true,
      notificationRadius: 10000,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update pricing configuration
      await adminService.updatePricing({
        basePrice: settings.ride.basePrice,
        pricePerKm: settings.ride.pricePerKm,
        pricePerMinute: settings.ride.pricePerMinute,
        surgePricingMultiplier: settings.ride.surgePricingMultiplier,
      });

      // Update system settings
      await adminService.updateSystemSettings({
        maxActiveRidesPerDriver: settings.ride.maxActiveRidesPerDriver,
        maxCancellationsPerDay: settings.ride.maxCancellationsPerDay,
        autoAssignmentRadius: settings.ride.autoAssignmentRadius,
        minimumDriverRating: settings.ride.minimumDriverRating,
      });

      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section: keyof SettingsForm, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                value={settings.general.companyName}
                onChange={(e) => handleChange('general', 'companyName', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Support Email
              </label>
              <input
                type="email"
                value={settings.general.supportEmail}
                onChange={(e) => handleChange('general', 'supportEmail', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Base Currency
              </label>
              <select
                value={settings.general.baseCurrency}
                onChange={(e) => handleChange('general', 'baseCurrency', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <select
                value={settings.general.timezone}
                onChange={(e) => handleChange('general', 'timezone', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Europe/Luxembourg">Europe/Luxembourg</option>
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ride Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ride Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Base Price
              </label>
              <input
                type="number"
                value={settings.ride.basePrice}
                onChange={(e) => handleChange('ride', 'basePrice', parseFloat(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price per Kilometer
              </label>
              <input
                type="number"
                value={settings.ride.pricePerKm}
                onChange={(e) => handleChange('ride', 'pricePerKm', parseFloat(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price per Minute
              </label>
              <input
                type="number"
                value={settings.ride.pricePerMinute}
                onChange={(e) => handleChange('ride', 'pricePerMinute', parseFloat(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Surge Pricing Multiplier
              </label>
              <input
                type="number"
                value={settings.ride.surgePricingMultiplier}
                onChange={(e) => handleChange('ride', 'surgePricingMultiplier', parseFloat(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Active Rides per Driver
              </label>
              <input
                type="number"
                value={settings.ride.maxActiveRidesPerDriver}
                onChange={(e) => handleChange('ride', 'maxActiveRidesPerDriver', parseInt(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Cancellations per Day
              </label>
              <input
                type="number"
                value={settings.ride.maxCancellationsPerDay}
                onChange={(e) => handleChange('ride', 'maxCancellationsPerDay', parseInt(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Auto Assignment Radius (meters)
              </label>
              <input
                type="number"
                value={settings.ride.autoAssignmentRadius}
                onChange={(e) => handleChange('ride', 'autoAssignmentRadius', parseInt(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Driver Rating
              </label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={settings.ride.minimumDriverRating}
                onChange={(e) => handleChange('ride', 'minimumDriverRating', parseFloat(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.notifications.enableEmailNotifications}
                  onChange={(e) => handleChange('notifications', 'enableEmailNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Enable Email Notifications</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.notifications.enablePushNotifications}
                  onChange={(e) => handleChange('notifications', 'enablePushNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Enable Push Notifications</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.notifications.enableSMSNotifications}
                  onChange={(e) => handleChange('notifications', 'enableSMSNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Enable SMS Notifications</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notification Radius (meters)
              </label>
              <input
                type="number"
                value={settings.notifications.notificationRadius}
                onChange={(e) => handleChange('notifications', 'notificationRadius', parseInt(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Changes to these settings will affect all future rides and system behavior.
                Please review carefully before saving.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`btn-primary flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}