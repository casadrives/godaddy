import { Database } from 'sqlite3';
import { open } from 'sqlite';

// Open a database connection
async function openDb() {
  return open({
    filename: './database.db',
    driver: Database,
  });
}

// Initialize the database and create the users table
async function setupDatabase() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    );
  `);

  // Insert the new admin user
  await db.run(
    `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
    '621177744',
    '112233',
    'admin'
  );

  console.log('Database setup complete with new admin user.');
}

setupDatabase().catch(console.error);
