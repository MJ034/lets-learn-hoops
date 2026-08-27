import type { Request, Response } from 'express';
import { pool } from '../../database/pool.js';

export async function markModuleComplete(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: 'unauthorized' });
    }

    const moduleCheck = await pool.query(
      'SELECT id FROM learning_modules WHERE id = $1',
      [moduleId]
    );

    if (!moduleCheck.rowCount) {
      return res.status(404).json({ message: 'Learning module not found' });
    }

    try {
      await pool.query(
        'INSERT INTO user_progress (user_id, module_id) VALUES ($1, $2)',
        [req.user.id, moduleId]
      );

      return res.status(201).json({ message: 'Lesson marked complete' });
    } catch (err) {
      if (err && typeof err === 'object' && 'code' in err && err.code === '23505') {
        return res.status(200).json({ message: 'Lesson already marked complete' });
      }

      console.error('Error marking lesson complete:', err);
      return res.status(500).json({ message: 'Failed to mark lesson complete' });
    }
  } catch (err) {
    console.error('Error checking learning module:', err);
    return res.status(500).json({ message: 'Failed to mark lesson complete' });
  }
}

export async function getProgressSummary(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'unauthorized' });
    }

    const userId = req.user.id;

    const [completedResult, totalResult, quizHistoryResult] = await Promise.all([
      pool.query(
        'SELECT module_id, completed_at FROM user_progress WHERE user_id = $1',
        [userId]
      ),
      pool.query('SELECT COUNT(*) FROM learning_modules'),
      pool.query(
        `
        SELECT qr.score, qr.total_questions, qr.completed_at,
               q.title AS quiz_title, lm.title AS lesson_title
        FROM quiz_results qr
        JOIN quizzes q ON qr.quiz_id = q.id
        JOIN learning_modules lm ON q.module_id = lm.id
        WHERE qr.user_id = $1
        ORDER BY qr.completed_at DESC
        `,
        [userId]
      ),
    ]);

    const lessonsCompleted = completedResult.rows.length;
    const totalLessons = parseInt(totalResult.rows[0].count, 10);
    const completionPercentage = totalLessons > 0
      ? Math.round((lessonsCompleted / totalLessons) * 100)
      : 0;

    return res.json({
      lessonsCompleted,
      totalLessons,
      completionPercentage,
      quizHistory: quizHistoryResult.rows,
    });
  } catch (err) {
    console.error('Error fetching progress summary:', err);
    return res.status(500).json({ message: 'Failed to fetch progress summary' });
  }
}