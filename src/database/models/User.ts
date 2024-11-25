import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import pool from '../config';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'driver' | 'company' | 'user';
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  status: 'active' | 'inactive' | 'suspended';
  email_verified: boolean;
  two_factor_enabled: boolean;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  role: User['role'];
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

class UserModel {
  private pool: Pool;
  private saltRounds = 12;

  constructor(dbPool: Pool) {
    this.pool = dbPool;
  }

  async createUser(data: CreateUserData): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, this.saltRounds);

    const query = `
      INSERT INTO users (
        email, password_hash, role, first_name, last_name, phone_number
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, role, first_name, last_name, phone_number, status, 
                email_verified, two_factor_enabled, created_at, updated_at, last_login
    `;

    const values = [
      data.email,
      passwordHash,
      data.role,
      data.first_name,
      data.last_name,
      data.phone_number
    ];

    try {
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error: any) {
      if (error.code === '23505') { // unique_violation
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, email, role, first_name, last_name, phone_number, status,
             email_verified, two_factor_enabled, created_at, updated_at, last_login
      FROM users
      WHERE email = $1
    `;

    const result = await this.pool.query(query, [email]);
    return result.rows[0] || null;
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const query = 'SELECT password_hash FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    
    if (!result.rows[0]) {
      return false;
    }

    return bcrypt.compare(password, result.rows[0].password_hash);
  }

  async updateLastLogin(userId: string): Promise<void> {
    const query = `
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await this.pool.query(query, [userId]);
  }

  async recordFailedLoginAttempt(userId: string | null, ipAddress: string): Promise<void> {
    const query = `
      INSERT INTO failed_login_attempts (user_id, ip_address)
      VALUES ($1, $2)
    `;
    await this.pool.query(query, [userId, ipAddress]);
  }

  async getFailedLoginAttempts(userId: string | null, ipAddress: string, minutes: number = 30): Promise<number> {
    const query = `
      SELECT COUNT(*)
      FROM failed_login_attempts
      WHERE (user_id = $1 OR ip_address = $2)
      AND attempt_time > NOW() - INTERVAL '${minutes} minutes'
    `;
    const result = await this.pool.query(query, [userId, ipAddress]);
    return parseInt(result.rows[0].count);
  }

  async clearFailedLoginAttempts(userId: string): Promise<void> {
    const query = `
      DELETE FROM failed_login_attempts
      WHERE user_id = $1
    `;
    await this.pool.query(query, [userId]);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, this.saltRounds);
    const query = `
      UPDATE users
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    await this.pool.query(query, [passwordHash, userId]);
  }

  async updateStatus(userId: string, status: User['status']): Promise<void> {
    const query = `
      UPDATE users
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    await this.pool.query(query, [status, userId]);
  }
}

export const userModel = new UserModel(pool);
