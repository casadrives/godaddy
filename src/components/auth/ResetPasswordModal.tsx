import React, { useState } from 'react';
import { X, Mail, Lock, Loader, ArrowRight } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: 'user' | 'company' | 'driver' | 'admin';
}

export function ResetPasswordModal({ isOpen, onClose, role = 'user' }: ResetPasswordModalProps) {
  const [step, setStep] = useState<'email' | 'code' | 'newPassword'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // In production, make API call to send reset code
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('code');
    } catch (err) {
      setError('Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // In production, verify the reset code
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('newPassword');
    } catch (err) {
      setError('Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // In production, make API call to reset password
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Password reset successful! You can now log in with your new password.');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <form onSubmit={handleSubmitEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Sending Code...
                </>
              ) : (
                <>
                  Send Reset Code
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        );

      case 'code':
        return (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reset Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the code sent to your email"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Code
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        );

      case 'newPassword':
        return (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {renderStep()}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            Remember your password?{' '}
            <button 
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={onClose}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}