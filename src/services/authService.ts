import { CompanyRegistrationData, DriverRegistrationData } from '../types';
import { userModel, User } from '../database/models/User';
import { refreshTokenModel } from '../database/models/RefreshToken';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '1h';
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_TIMEOUT_MINUTES = 30;

class AuthService {
  private generateToken(user: User): string {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  async login(email: string, password: string, role: 'driver' | 'admin' | 'company' | 'user', ipAddress: string): Promise<{ user: User; token: string; refreshToken: string }> {
    try {
      // Check for too many failed attempts
      const failedAttempts = await userModel.getFailedLoginAttempts(null, ipAddress);
      if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
        throw new Error(`Too many failed login attempts. Please try again after ${LOGIN_TIMEOUT_MINUTES} minutes`);
      }

      // Find user
      const user = await userModel.findByEmail(email);
      if (!user) {
        await userModel.recordFailedLoginAttempt(null, ipAddress);
        throw new Error('Invalid email or password');
      }

      // Verify role
      if (user.role !== role) {
        await userModel.recordFailedLoginAttempt(user.id, ipAddress);
        throw new Error('Invalid role for this user');
      }

      // Check user status
      if (user.status !== 'active') {
        throw new Error(`Account is ${user.status}. Please contact support.`);
      }

      // Verify password
      const isValid = await userModel.verifyPassword(email, password);
      if (!isValid) {
        await userModel.recordFailedLoginAttempt(user.id, ipAddress);
        throw new Error('Invalid email or password');
      }

      // Clear failed attempts on successful login
      await userModel.clearFailedLoginAttempts(user.id);

      // Update last login
      await userModel.updateLastLogin(user.id);

      // Generate tokens
      const token = this.generateToken(user);
      const refreshToken = await refreshTokenModel.createToken(user.id);

      return {
        user,
        token,
        refreshToken: refreshToken.token
      };
    } catch (error: any) {
      console.error('Login error:', error);
      throw {
        message: error.message || 'An error occurred during login',
        status: error.status || 401
      };
    }
  }

  async register(data: { email: string; password: string }): Promise<{ user: User; token: string }> {
    try {
      const user = await userModel.createUser({
        ...data,
        role: 'user'
      });

      const token = this.generateToken(user);
      return { user, token };
    } catch (error: any) {
      console.error('Registration error:', error);
      throw {
        message: error.message || 'An error occurred during registration',
        status: error.status || 400
      };
    }
  }

  async registerCompany(data: CompanyRegistrationData): Promise<{ user: User; token: string }> {
    try {
      const user = await userModel.createUser({
        email: data.email,
        password: data.password,
        role: 'company',
        first_name: data.companyName,
        phone_number: data.phone
      });

      const token = this.generateToken(user);
      return { user, token };
    } catch (error: any) {
      console.error('Company registration error:', error);
      throw {
        message: error.message || 'An error occurred during company registration',
        status: error.status || 400
      };
    }
  }

  async registerDriver(data: DriverRegistrationData): Promise<{ user: User; token: string }> {
    try {
      const user = await userModel.createUser({
        email: data.email,
        password: data.password,
        role: 'driver',
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phone
      });

      const token = this.generateToken(user);
      return { user, token };
    } catch (error: any) {
      console.error('Driver registration error:', error);
      throw {
        message: error.message || 'An error occurred during driver registration',
        status: error.status || 400
      };
    }
  }

  async refreshToken(token: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const refreshTokenData = await refreshTokenModel.findByToken(token);
      if (!refreshTokenData) {
        throw new Error('Invalid refresh token');
      }

      const user = await userModel.findByEmail(refreshTokenData.user_id);
      if (!user) {
        throw new Error('User not found');
      }

      // Revoke the old refresh token and create a new one
      await refreshTokenModel.revokeToken(token);
      const newRefreshToken = await refreshTokenModel.createToken(user.id);
      const newToken = this.generateToken(user);

      return {
        token: newToken,
        refreshToken: newRefreshToken.token
      };
    } catch (error: any) {
      console.error('Token refresh error:', error);
      throw {
        message: error.message || 'An error occurred while refreshing the token',
        status: error.status || 401
      };
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await refreshTokenModel.revokeToken(refreshToken);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw {
        message: error.message || 'An error occurred during logout',
        status: error.status || 500
      };
    }
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await userModel.findByEmail(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isValid = await userModel.verifyPassword(user.email, currentPassword);
      if (!isValid) {
        throw new Error('Current password is incorrect');
      }

      await userModel.updatePassword(userId, newPassword);
      await refreshTokenModel.revokeAllUserTokens(userId); // Force logout from all devices
    } catch (error: any) {
      console.error('Password update error:', error);
      throw {
        message: error.message || 'An error occurred while updating the password',
        status: error.status || 400
      };
    }
  }
}

export const authService = new AuthService();
