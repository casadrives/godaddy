import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client with anon key
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createAdminUser() {
  try {
    // Sign up admin user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@casadrives.com',
      password: 'Admin123!',
      options: {
        data: {
          role: 'admin',
          name: 'System Admin'
        }
      }
    });

    if (signUpError) throw signUpError;
    console.log('Created auth user:', signUpData.user);

    // Create user record in database
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .insert({
        id: signUpData.user.id,
        email: signUpData.user.email,
        name: 'System Admin',
        role: 'admin',
        status: 'approved',
        email_verified: true
      })
      .select()
      .single();

    if (dbError) throw dbError;
    console.log('Created database user:', dbUser);

    console.log('Admin user created successfully!');
    console.log('Please login with:');
    console.log('Email: admin@casadrives.com');
    console.log('Password: Admin123!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdminUser();
