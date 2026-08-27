import express from 'express';
import { pool } from './database/pool.js';
import cookieParser from 'cookie-parser';
import authRouter from './modules/auth/auth.routes.js';
import learningRoutes from './modules/learning/learning.routes.js';
import quizzesRouter from './modules/quizzes/quizzes.routes.js';
import progressRouter from './modules/progress/progress.routes.js';
import cors from 'cors';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

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
  console.log(`Backend listening in dev mode on http://localhost:${port}`);
});