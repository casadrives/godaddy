import { Database } from 'sqlite3';
import { open } from 'sqlite';

// Open a database connection
async function openDb() {
  return open({
    filename: './dashboard.db',
    driver: Database,
  });
}

// Initialize the database and create the necessary tables
async function setupDashboardDatabase() {
  const db = await openDb();

  // Create Companies table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      contact_email TEXT,
      contact_phone TEXT
    );
  `);

  // Create Drivers table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      license_number TEXT UNIQUE NOT NULL,
      vehicle_type TEXT,
      status TEXT,
      company_id INTEGER,
      FOREIGN KEY (company_id) REFERENCES companies(id)
    );
  `);

  // Optional: Create Driver Logs table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS driver_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      driver_id INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      activity TEXT,
      FOREIGN KEY (driver_id) REFERENCES drivers(id)
    );
  `);

  console.log('Dashboard database setup complete.');
}

setupDashboardDatabase().catch(console.error);
