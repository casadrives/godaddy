import { createContext, useContext, useState } from 'react';
import { User, CompanyRegistrationData, DriverRegistrationData } from '../types';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'driver' | 'admin' | 'company' | 'user') => Promise<void>;
  logout: () => void;
  register: (data: { email: string; password: string }) => Promise<void>;
  registerCompany: (data: CompanyRegistrationData) => Promise<void>;
  registerDriver: (data: DriverRegistrationData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: 'driver' | 'admin' | 'company' | 'user') => {
    try {
      const response = await authService.login(email, password, role);
      if (response.user) {
        setUser({
          ...response.user,
          avatar: response.user.avatar || undefined
        });
        toast.success('Successfully logged in!');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please check your credentials.');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    authService.logout();
    toast.success('Successfully logged out!');
  };

  const register = async (data: { email: string; password: string }) => {
    try {
      const response = await authService.register(data);
      if (response.user) {
        setUser({
          ...response.user,
          avatar: response.user.avatar || undefined
        });
        toast.success('Successfully registered!');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register. Please try again.');
      throw error;
    }
  };

  const registerCompany = async (data: CompanyRegistrationData) => {
    try {
      const response = await authService.registerCompany(data);
      if (response.user) {
        setUser({
          ...response.user,
          avatar: response.user.avatar || undefined
        });
        toast.success('Company successfully registered!');
      }
    } catch (error) {
      console.error('Company registration error:', error);
      toast.error('Failed to register company. Please try again.');
      throw error;
    }
  };

  const registerDriver = async (data: DriverRegistrationData) => {
    try {
      const response = await authService.registerDriver(data);
      if (response.user) {
        setUser({
          ...response.user,
          avatar: response.user.avatar || undefined
        });
        toast.success('Driver successfully registered!');
      }
    } catch (error) {
      console.error('Driver registration error:', error);
      toast.error('Failed to register driver. Please try again.');
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await authService.updateProfile(data);
      if (response.user) {
        setUser({
          ...response.user,
          avatar: response.user.avatar || undefined
        });
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    registerCompany,
    registerDriver,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}