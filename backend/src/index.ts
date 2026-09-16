import express from 'express';
import { pool } from './database/pool.js';
import cookieParser from 'cookie-parser';
import authRouter from './modules/auth/auth.routes.js';
import learningRoutes from './modules/learning/learning.routes.js';
import quizzesRouter from './modules/quizzes/quizzes.routes.js';
import progressRouter from './modules/progress/progress.routes.js';
import cors from 'cors';
import type { CorsOptions } from 'cors';

const app = express();
const port = Number(process.env.PORT ?? 3000);
const corsOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === 'production' && corsOrigins.length === 0) {
  throw new Error('CORS_ORIGINS must be set in production');
}

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/learning-modules', learningRoutes);
app.use('/api/quizzes', quizzesRouter);
app.use('/api/progress', progressRouter);

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
  console.log(`Backend listening on port ${port}`);
});