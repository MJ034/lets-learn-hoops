import express from 'express';
import { pool } from './database/pool.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.get('/health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', dbTime: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'DB connection failed' });
  }
});

app.listen(port, () => {
  console.log(`Backend listening in dev mode on http://localhost:${port}`);
});
