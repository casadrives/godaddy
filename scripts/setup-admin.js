import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://elnivtyeewhhynrxzfed.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsbml2dHllZXdoaHlucnh6ZmVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwODIwMzk4OCwiZXhwIjoyMDIzNzc5OTg4fQ.eBPZGGKXUUxkAjkJNbBxEqXyHGQGvyQIYpEGHPxgGJo';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  try {
    // Create admin user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@casadrives.com',
      password: 'Admin123!',
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        name: 'System Admin'
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }

    if (!authData.user) {
      console.error('No user returned from auth');
      return;
    }

    // Create admin in users table
    const { data: user, error: dbError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'admin@casadrives.com',
        name: 'System Admin',
        role: 'admin',
        status: 'approved',
        email_verified: true
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error creating admin in database:', dbError);
      return;
    }

    console.log('Admin user created successfully:', user);
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupAdmin();
