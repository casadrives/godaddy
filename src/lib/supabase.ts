import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Debug: Log environment loading
console.log('Environment:', {
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV,
  prod: import.meta.env.PROD
});

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: Log raw environment variables
console.log('Supabase Configuration:', {
  url: supabaseUrl,
  keyPrefix: supabaseAnonKey?.substring(0, 8),
  keyLength: supabaseAnonKey?.length,
  fullKey: supabaseAnonKey // Temporarily log full key for debugging
});

if (!supabaseUrl || supabaseUrl === 'undefined') {
  throw new Error('Invalid VITE_SUPABASE_URL: ' + supabaseUrl);
}
if (!supabaseAnonKey || supabaseAnonKey === 'undefined') {
  throw new Error('Invalid VITE_SUPABASE_ANON_KEY: ' + supabaseAnonKey);
}

// Create Supabase client with explicit configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Verify client configuration
console.log('Supabase Client:', {
  hasAuth: !!supabase.auth,
  hasStorage: !!supabase.storage,
  hasFrom: !!supabase.from
});

export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;
  return data;
};

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
