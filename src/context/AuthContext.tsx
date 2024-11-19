import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { Database } from '@/types/supabase';
import { supabase } from '@/lib/supabase';

type User = Database['public']['Tables']['users']['Row'];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role?: 'user' | 'driver' | 'admin' | 'company';
  }) => Promise<User>;
  registerCompany: (companyData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    registrationNumber: string;
    taxiLicense: string;
    fleetSize: number;
  }) => Promise<{ user: User; company: any }>;
  registerDriver: (driverData: {
    name: string;
    email: string;
    password: string;
    companyId: string;
    licenseNumber: string;
    licenseExpiry: string;
  }) => Promise<{ user: User; driver: any }>;
  verifyEmail: (token: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkAuth();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await fetchUser(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setToken(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUser(session.user.id);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async (userId: string) => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(user);
    } catch (error) {
      console.error('Fetch user error:', error);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user: authUser, token } = await authService.login(email, password);
      setUser(authUser);
      setToken(token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    role?: 'user' | 'driver' | 'admin' | 'company';
  }) => {
    return authService.register(userData);
  };

  const registerCompany = async (companyData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    registrationNumber: string;
    taxiLicense: string;
    fleetSize: number;
  }) => {
    return authService.registerCompany(companyData);
  };

  const registerDriver = async (driverData: {
    name: string;
    email: string;
    password: string;
    companyId: string;
    licenseNumber: string;
    licenseExpiry: string;
  }) => {
    return authService.registerDriver(driverData);
  };

  const verifyEmail = async (token: string) => {
    return authService.verifyEmail(token);
  };

  const requestPasswordReset = async (email: string) => {
    return authService.requestPasswordReset(email);
  };

  const resetPassword = async (token: string, newPassword: string) => {
    return authService.resetPassword(token, newPassword);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    token,
    login,
    logout,
    register,
    registerCompany,
    registerDriver,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};