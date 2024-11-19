import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

type User = Database['public']['Tables']['users']['Row'];
type Company = Database['public']['Tables']['companies']['Row'];
type Driver = Database['public']['Tables']['drivers']['Row'];

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'your-jwt-secret';
const SMTP_HOST = import.meta.env.VITE_SMTP_HOST;
const SMTP_PORT = import.meta.env.VITE_SMTP_PORT;
const SMTP_USER = import.meta.env.VITE_SMTP_USER;
const SMTP_PASS = import.meta.env.VITE_SMTP_PASS;

// Email configuration
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const authService = {
  // User registration
  async register(userData: {
    email: string;
    password: string;
    name: string;
    role?: 'user' | 'driver' | 'admin' | 'company';
  }) {
    try {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: hashedPassword,
      });

      if (authError) throw authError;

      // Create user in our users table
      const { data: user, error: dbError } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          name: userData.name,
          role: userData.role || 'user',
          status: 'pending',
          email_verified: false,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Send verification email
      await this.sendVerificationEmail(user.id, userData.email);

      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Company registration
  async registerCompany(companyData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    registrationNumber: string;
    taxiLicense: string;
    fleetSize: number;
  }) {
    try {
      // Register the company user first
      const user = await this.register({
        email: companyData.email,
        password: companyData.password,
        name: companyData.name,
        role: 'company',
      });

      // Create company record
      const { data: company, error } = await supabase
        .from('companies')
        .insert({
          name: companyData.name,
          email: companyData.email,
          phone: companyData.phone,
          registration_number: companyData.registrationNumber,
          taxi_license: companyData.taxiLicense,
          fleet_size: companyData.fleetSize,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Update user with company_id
      await supabase
        .from('users')
        .update({ company_id: company.id })
        .eq('id', user.id);

      return { user, company };
    } catch (error) {
      console.error('Company registration error:', error);
      throw error;
    }
  },

  // Driver registration
  async registerDriver(driverData: {
    name: string;
    email: string;
    password: string;
    companyId: string;
    licenseNumber: string;
    licenseExpiry: string;
  }) {
    try {
      // Register the driver user first
      const user = await this.register({
        email: driverData.email,
        password: driverData.password,
        name: driverData.name,
        role: 'driver',
      });

      // Create driver record
      const { data: driver, error } = await supabase
        .from('drivers')
        .insert({
          user_id: user.id,
          company_id: driverData.companyId,
          license_number: driverData.licenseNumber,
          license_expiry: driverData.licenseExpiry,
          status: 'inactive',
          total_rides: 0,
        })
        .select()
        .single();

      if (error) throw error;

      // Update user with company_id
      await supabase
        .from('users')
        .update({ company_id: driverData.companyId })
        .eq('id', user.id);

      return { user, driver };
    } catch (error) {
      console.error('Driver registration error:', error);
      throw error;
    }
  },

  // Login
  async login(email: string, password: string) {
    try {
      // Special case for initial admin login
      const isInitialAdmin = email === 'admin@casadrives.com' && password === 'Admin123!';
      
      if (isInitialAdmin) {
        // Try to sign up first
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              role: 'admin',
              name: 'System Admin'
            }
          }
        });

        console.log('Sign up attempt:', { signUpData, signUpError });

        // Always try to sign in for admin
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        console.log('Sign in attempt:', { signInData, signInError });

        if (signInError) throw signInError;
        if (!signInData.user) throw new Error('No user returned from auth');

        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            role: 'admin',
            name: 'System Admin'
          }
        });

        console.log('Update metadata attempt:', { updateError });

        if (updateError) throw updateError;

        // Create or update user in database
        const { data: dbUser, error: dbError } = await supabase
          .from('users')
          .upsert({
            id: signInData.user.id,
            email: signInData.user.email || '',
            name: 'System Admin',
            role: 'admin',
            status: 'approved',
            email_verified: true
          }, { onConflict: 'id' })
          .select()
          .single();

        console.log('Database operation:', { dbUser, dbError });

        if (dbError) throw dbError;

        return {
          user: dbUser,
          token: signInData.session?.access_token
        };
      }

      // Normal login flow
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;
      if (!signInData.user) throw new Error('No user returned from auth');

      // Get user from database
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', signInData.user.id)
        .single();

      if (userError) throw userError;

      return {
        user,
        token: signInData.session?.access_token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Email verification
  async sendVerificationEmail(userId: string, email: string) {
    try {
      const verificationToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
      const verificationUrl = `${window.location.origin}/verify-email?token=${verificationToken}`;

      await transporter.sendMail({
        from: SMTP_USER,
        to: email,
        subject: 'Verify your email - CasaDrives',
        html: `
          <h1>Welcome to CasaDrives!</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
          <p>This link will expire in 24 hours.</p>
        `,
      });
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  },

  // Verify email
  async verifyEmail(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      
      const { error } = await supabase
        .from('users')
        .update({ email_verified: true, status: 'approved' })
        .eq('id', decoded.userId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  },

  // Password reset request
  async requestPasswordReset(email: string) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (error) throw new Error('User not found');

      const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
      const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`;

      await transporter.sendMail({
        from: SMTP_USER,
        to: email,
        subject: 'Reset your password - CasaDrives',
        html: `
          <h1>Password Reset Request</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });

      return true;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  },

  // Reset password
  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update auth password
      const { error: authError } = await supabase.auth.updateUser({
        password: hashedPassword,
      });

      if (authError) throw authError;

      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
};
