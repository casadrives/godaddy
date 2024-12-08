import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type User = Database['public']['Tables']['users']['Row'];

export const adminAuthService = {
  // Verify admin status
  async verifyAdminStatus(userId: string): Promise<boolean> {
    try {
      // Check user role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Admin verification error:', userError);
        return false;
      }

      if (userData?.role !== 'admin') {
        return false;
      }

      // Check admin permissions
      const { data: adminData, error: adminError } = await supabase
        .from('admin_permissions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (adminError) {
        console.error('Admin permissions check error:', adminError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Admin verification error:', error);
      return false;
    }
  },

  // Get admin permissions
  async getAdminPermissions(userId: string) {
    try {
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Get admin permissions error:', error);
      throw error;
    }
  },

  // Update admin permissions
  async updateAdminPermissions(userId: string, permissions: any) {
    try {
      const { data, error } = await supabase
        .from('admin_permissions')
        .upsert({
          user_id: userId,
          permissions,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Update admin permissions error:', error);
      throw error;
    }
  },

  // Create admin user
  async createAdminUser(email: string, password: string, name: string) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin',
            name
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from auth');

      // Create user record
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name,
          role: 'admin',
          status: 'approved',
          email_verified: true
        })
        .select()
        .single();

      if (userError) throw userError;

      // Create admin permissions
      const { error: permError } = await supabase
        .from('admin_permissions')
        .insert({
          user_id: authData.user.id,
          permissions: {},
          is_super_admin: false
        });

      if (permError) throw permError;

      return userData;
    } catch (error) {
      console.error('Create admin user error:', error);
      throw error;
    }
  }
};
