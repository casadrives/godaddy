import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config';

export interface RefreshToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
  revoked: boolean;
}

class RefreshTokenModel {
  private pool: Pool;

  constructor(dbPool: Pool) {
    this.pool = dbPool;
  }

  async createToken(userId: string, expiresInDays: number = 30): Promise<RefreshToken> {
    const token = uuidv4();
    const query = `
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '${expiresInDays} days')
      RETURNING id, user_id, token, expires_at, created_at, revoked
    `;

    const result = await this.pool.query(query, [userId, token]);
    return result.rows[0];
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const query = `
      SELECT id, user_id, token, expires_at, created_at, revoked
      FROM refresh_tokens
      WHERE token = $1 AND revoked = false AND expires_at > NOW()
    `;

    const result = await this.pool.query(query, [token]);
    return result.rows[0] || null;
  }

  async revokeToken(token: string): Promise<void> {
    const query = `
      UPDATE refresh_tokens
      SET revoked = true
      WHERE token = $1
    `;
    await this.pool.query(query, [token]);
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    const query = `
      UPDATE refresh_tokens
      SET revoked = true
      WHERE user_id = $1 AND revoked = false
    `;
    await this.pool.query(query, [userId]);
  }

  async cleanupExpiredTokens(): Promise<void> {
    const query = `
      DELETE FROM refresh_tokens
      WHERE expires_at < NOW() OR revoked = true
    `;
    await this.pool.query(query);
  }
}

export const refreshTokenModel = new RefreshTokenModel(pool);
