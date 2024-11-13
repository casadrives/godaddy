import React, { useState } from 'react';
import { Save, Lock, Eye, EyeOff } from 'lucide-react';

export function Settings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Validate passwords
      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }

      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // In production, make API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Settings</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleResetPassword} className="space-y-6 max-w-md">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="block w-full pr-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="block w-full pr-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="block w-full pr-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Lock className="h-5 w-5 mr-2" />
                Update Password
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                defaultValue="CasaDrive"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Support Email
              </label>
              <input
                type="email"
                defaultValue="support@casadrive.lu"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Base Currency
              </label>
              <select className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary flex items-center"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}