import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'driver' | 'admin' | 'company';
  avatar?: string;
  companyId?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'suspended';
  paymentDue?: string;
  lastPaymentDate?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: { name: string; email: string; password: string; role?: string; companyId?: string }) => Promise<void>;
  registerCompany: (companyData: { name: string; email: string; password: string; phone: string; registrationNumber: string; taxiLicense: string; fleetSize: string }) => Promise<void>;
  registerDriver: (driverData: { name: string; email: string; password: string; companyId: string }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  checkPaymentStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial admin account
const adminAccount = {
  id: 'admin-1',
  name: 'Super Admin',
  email: 'admin@casadrives.lu',
  role: 'admin' as const,
  status: 'approved' as const,
  password: 'Admin@2024!',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('casadriveUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Only allow admin login for now
      if (email !== adminAccount.email || password !== adminAccount.password) {
        throw new Error('Invalid credentials');
      }

      const { password: _, ...userWithoutPassword } = adminAccount;
      setUser(userWithoutPassword);
      localStorage.setItem('casadriveUser', JSON.stringify(userWithoutPassword));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('casadriveUser');
  };

  const register = async (userData: { name: string; email: string; password: string; role?: string; companyId?: string }) => {
    setError('Registration is currently disabled');
    throw new Error('Registration is currently disabled');
  };

  const registerCompany = async (companyData: { name: string; email: string; password: string; phone: string; registrationNumber: string; taxiLicense: string; fleetSize: string }) => {
    setError('Company registration is currently disabled');
    throw new Error('Company registration is currently disabled');
  };

  const registerDriver = async (driverData: { name: string; email: string; password: string; companyId: string }) => {
    setError('Driver registration is currently disabled');
    throw new Error('Driver registration is currently disabled');
  };

  const checkPaymentStatus = async () => {
    // Payment status check is disabled
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      register,
      registerCompany,
      registerDriver,
      isLoading,
      error,
      checkPaymentStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}