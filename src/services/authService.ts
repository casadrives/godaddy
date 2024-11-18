import { CompanyRegistrationData, DriverRegistrationData, User } from '../types';

class AuthService {
  private apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  private tokenKey = 'authToken';

  async login(email: string, password: string, role: 'driver' | 'admin' | 'company' | 'user'): Promise<{ user: User }> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem(this.tokenKey, data.token);
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(data: { email: string; password: string }): Promise<{ user: User }> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const responseData = await response.json();
      if (responseData.token) {
        localStorage.setItem(this.tokenKey, responseData.token);
      }
      return responseData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async registerCompany(data: CompanyRegistrationData): Promise<{ user: User }> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/register/company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Company registration failed');
      }

      const responseData = await response.json();
      if (responseData.token) {
        localStorage.setItem(this.tokenKey, responseData.token);
      }
      return responseData;
    } catch (error) {
      console.error('Company registration error:', error);
      throw error;
    }
  }

  async registerDriver(data: DriverRegistrationData): Promise<{ user: User }> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/register/driver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Driver registration failed');
      }

      const responseData = await response.json();
      if (responseData.token) {
        localStorage.setItem(this.tokenKey, responseData.token);
      }
      return responseData;
    } catch (error) {
      console.error('Driver registration error:', error);
      throw error;
    }
  }

  async updateProfile(data: Partial<User>): Promise<{ user: User }> {
    try {
      const token = localStorage.getItem(this.tokenKey);
      const response = await fetch(`${this.apiUrl}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}

export const authService = new AuthService();
