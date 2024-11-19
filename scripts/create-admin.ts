const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  try {
    const adminData = {
      email: 'admin@casadrives.com',
      password: 'Admin123!',  // Change this password
      name: 'System Admin',
      role: 'admin'
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: adminData.email,
      password: hashedPassword,
    });

    if (authError) throw authError;

    // Create user in users table with approved status
    const { data: user, error: dbError } = await supabase
      .from('users')
      .insert({
        email: adminData.email,
        name: adminData.name,
        role: adminData.role,
        status: 'approved',
        email_verified: true
      })
      .select()
      .single();

    if (dbError) throw dbError;

    console.log('Admin user created successfully:', user);
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit();
  }
}

createAdminUser();
