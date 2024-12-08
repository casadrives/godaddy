import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type User = Database['public']['Tables']['users']['Row'];
type Driver = Database['public']['Tables']['drivers']['Row'];

export const authService = {
  // Login with role-based authentication
  async login(email: string, password: string, role: 'user' | 'driver' | 'admin' | 'company' = 'user') {
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Debug: Log authentication attempt (without sensitive data)
      console.log('Login attempt for:', email, 'with role:', role);
      
      // Authenticate with Supabase
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error('Authentication error:', signInError.message);
        throw new Error(signInError.message);
      }

      if (!session || !session.user) {
        throw new Error('No session or user data returned');
      }

      // Get user profile based on role
      let userData;
      let additionalData = null;

      switch (role) {
        case 'driver':
          // Get driver profile
          const { data: driverData, error: driverError } = await supabase
            .from('drivers')
            .select(`
              *,
              users!inner (*),
              vehicles (*),
              companies (*)
            `)
            .eq('user_id', session.user.id)
            .single();

          if (driverError) {
            console.error('Driver data fetch error:', driverError);
            throw new Error('Failed to fetch driver data');
          }

          userData = driverData;
          additionalData = {
            vehicles: driverData.vehicles,
            company: driverData.companies
          };
          break;

        case 'admin':
          // Get admin profile
          const { data: adminData, error: adminError } = await supabase
            .from('users')
            .select('*, admin_permissions(*)')
            .eq('id', session.user.id)
            .eq('role', 'admin')
            .single();

          if (adminError) {
            console.error('Admin data fetch error:', adminError);
            throw new Error('Failed to fetch admin data');
          }

          userData = adminData;
          break;

        case 'company':
          // Get company profile
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('*, users!inner(*)')
            .eq('user_id', session.user.id)
            .single();

          if (companyError) {
            console.error('Company data fetch error:', companyError);
            throw new Error('Failed to fetch company data');
          }

          userData = companyData;
          break;

        default:
          // Get regular user profile
          const { data: userProfile, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('User data fetch error:', userError);
            throw new Error('Failed to fetch user data');
          }

          userData = userProfile;
      }

      // Set role in session
      await supabase.auth.updateUser({
        data: { role }
      });

      return {
        user: userData,
        additionalData,
        token: session.access_token,
        role
      };

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Check auth state
  async checkAuth() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (!session) {
        return { user: null, role: null };
      }

      const role = session.user?.user_metadata?.role || 'user';
      return { user: session.user, role };
    } catch (error) {
      console.error('Check auth error:', error);
      throw error;
    }
  },

  // Reset password
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // Update password
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  },

  // Register user
  async register(email: string, password: string, userData: Partial<User>) {
    try {
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: userData.role || 'user'
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error('No user returned from auth');

      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email,
          ...userData,
          email_verified: false
        })
        .select()
        .single();

      if (profileError) throw profileError;

      return profile;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }
};
