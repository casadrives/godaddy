import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type User = Database['public']['Tables']['users']['Row'];
type Company = Database['public']['Tables']['companies']['Row'];
type Driver = Database['public']['Tables']['drivers']['Row'];

export const authService = {
  // Login
  async login(email: string, password: string) {
    try {
      // Debug: Log environment variables and authentication attempt
      console.log('Login attempt:', {
        email,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length
      });
      
      // Special case for initial admin login
      const isInitialAdmin = email === 'admin@casadrives.com' && password === 'Admin123!';
      
      if (isInitialAdmin) {
        console.log('Attempting initial admin login...');
        
        // Try to sign in first
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          console.error('Initial admin sign in error:', signInError);
          
          // If user doesn't exist, create them
          if (signInError.status === 400) {
            console.log('Admin user not found, creating...');
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  role: 'admin',
                  name: 'System Admin'
                }
              }
            });

            if (signUpError) {
              console.error('Admin signup error:', signUpError);
              throw signUpError;
            }

            // Try signing in again after signup
            const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
              email,
              password
            });

            if (newSignInError) {
              console.error('Post-signup sign in error:', newSignInError);
              throw newSignInError;
            }
            
            if (!newSignInData.user) {
              console.error('No user returned after signup');
              throw new Error('Failed to authenticate after signup');
            }

            // Create admin user in database
            const { data: dbUser, error: dbError } = await supabase
              .from('users')
              .upsert({
                id: newSignInData.user.id,
                email: email,
                name: 'System Admin',
                role: 'admin',
                status: 'approved',
                email_verified: true
              })
              .select()
              .single();

            if (dbError) {
              console.error('Database user creation error:', dbError);
              throw dbError;
            }

            return {
              user: dbUser,
              token: newSignInData.session?.access_token
            };
          }
          
          throw signInError;
        }

        // Get or create admin user in database
        const { data: dbUser, error: dbError } = await supabase
          .from('users')
          .upsert({
            id: signInData.user.id,
            email: email,
            name: 'System Admin',
            role: 'admin',
            status: 'approved',
            email_verified: true
          })
          .select()
          .single();

        if (dbError) {
          console.error('Database user update error:', dbError);
          throw dbError;
        }

        return {
          user: dbUser,
          token: signInData.session?.access_token
        };
      }

      // Normal login flow
      console.log('Attempting normal user login...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error('Normal login error:', signInError);
        throw signInError;
      }
      
      if (!signInData.user) {
        console.error('No user returned from auth');
        throw new Error('No user returned from auth');
      }

      // Get user from database
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select()
        .eq('id', signInData.user.id)
        .single();

      if (dbError) {
        console.error('Database user fetch error:', dbError);
        throw dbError;
      }

      return {
        user: dbUser,
        token: signInData.session?.access_token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
