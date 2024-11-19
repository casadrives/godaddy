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

// Store registered users
const registeredUsers: Record<string, User & { password: string }> = {
  [adminAccount.email]: adminAccount
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
      
      const registeredUser = registeredUsers[email];
      if (!registeredUser || registeredUser.password !== password) {
        throw new Error('Invalid credentials');
      }

      const { password: _, ...userWithoutPassword } = registeredUser;
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
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (registeredUsers[userData.email]) {
        throw new Error('Email already registered');
      }

      const newUser: User & { password: string } = {
        id: `user-${Object.keys(registeredUsers).length + 1}`,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: (userData.role as User['role']) || 'user',
        status: 'pending',
        companyId: userData.companyId
      };

      registeredUsers[userData.email] = newUser;

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('casadriveUser', JSON.stringify(userWithoutPassword));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerCompany = async (companyData: { name: string; email: string; password: string; phone: string; registrationNumber: string; taxiLicense: string; fleetSize: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (registeredUsers[companyData.email]) {
        throw new Error('Email already registered');
      }

      const newCompany: User & { password: string } = {
        id: `company-${Object.keys(registeredUsers).length + 1}`,
        name: companyData.name,
        email: companyData.email,
        password: companyData.password,
        role: 'company',
        status: 'pending',
        paymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      };

      registeredUsers[companyData.email] = newCompany;

      const { password: _, ...companyWithoutPassword } = newCompany;
      setUser(companyWithoutPassword);
      localStorage.setItem('casadriveUser', JSON.stringify(companyWithoutPassword));
      
      return { status: 'pending' };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Company registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerDriver = async (driverData: { name: string; email: string; password: string; companyId: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (registeredUsers[driverData.email]) {
        throw new Error('Email already registered');
      }

      const newDriver: User & { password: string } = {
        id: `driver-${Object.keys(registeredUsers).length + 1}`,
        name: driverData.name,
        email: driverData.email,
        password: driverData.password,
        role: 'driver',
        status: 'pending',
        companyId: driverData.companyId
      };

      registeredUsers[driverData.email] = newDriver;

      const { password: _, ...driverWithoutPassword } = newDriver;
      setUser(driverWithoutPassword);
      localStorage.setItem('casadriveUser', JSON.stringify(driverWithoutPassword));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Driver registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (user?.role === 'company' && user.paymentDue) {
      const now = new Date();
      const paymentDue = new Date(user.paymentDue);
      
      if (now > paymentDue) {
        const updatedUser = {
          ...user,
          status: 'suspended' as const
        };
        setUser(updatedUser);
        localStorage.setItem('casadriveUser', JSON.stringify(updatedUser));
        throw new Error('Account suspended due to missed payment');
      }
    }
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