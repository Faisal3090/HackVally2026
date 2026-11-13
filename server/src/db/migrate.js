import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const files = (await fs.readdir(path.join(dir, 'migrations'))).filter(f => f.endsWith('.sql')).sort();
try {
  await pool.query('CREATE TABLE IF NOT EXISTS schema_migrations (filename TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())');
  for (const filename of files) {
    const exists = await pool.query('SELECT 1 FROM schema_migrations WHERE filename=$1', [filename]);
    if (!exists.rowCount) { await pool.query(await fs.readFile(path.join(dir, 'migrations', filename), 'utf8')); await pool.query('INSERT INTO schema_migrations(filename) VALUES($1)', [filename]); console.log(`Applied ${filename}`); }
  }
} finally { await pool.end(); }
