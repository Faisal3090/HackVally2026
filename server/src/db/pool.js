import pg from 'pg';
import { config } from '../config/index.js';

export const pool = new pg.Pool({ connectionString: config.DATABASE_URL });
export const query = (text, params) => pool.query(text, params);
