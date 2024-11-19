import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://elnivtyeewhhynrxzfed.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsbml2dHllZXdoaHlucnh6ZmVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwODIwMzk4OCwiZXhwIjoyMDIzNzc5OTg4fQ.eBPZGGKXUUxkAjkJNbBxEqXyHGQGvyQIYpEGHPxgGJo';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigrations() {
  try {
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      if (!file.endsWith('.sql')) continue;

      console.log(`Applying migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      const { error } = await supabase.rpc('exec_sql', { sql });
      if (error) {
        console.error(`Error applying migration ${file}:`, error);
        process.exit(1);
      }

      console.log(`Successfully applied migration: ${file}`);
    }

    console.log('All migrations applied successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

applyMigrations();
