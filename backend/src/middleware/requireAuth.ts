import type { NextFunction, Request, Response } from 'express';
import { pool } from '../database/pool.js';
import { SESSION_COOKIE_NAME, sessionCookieOptions } from '../config/cookie.js';

function unauthorized(res: Response, clearCookie = false) {
  if (clearCookie) {
    res.clearCookie(SESSION_COOKIE_NAME, sessionCookieOptions);
  }
  return res.status(401).json({ message: 'unauthorized' });
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.cookies?.[SESSION_COOKIE_NAME];

    if (typeof sessionId !== 'string' || !sessionId) {
      return unauthorized(res);
    }

    const sessionResult = await pool.query(
      `
      SELECT user_id, expires_at
      FROM sessions
      WHERE id = $1
      LIMIT 1
      `,
      [sessionId]
    );

    if (!sessionResult.rowCount) {
      return unauthorized(res, true);
    }

    const session = sessionResult.rows[0];
    const expiresAt = new Date(session.expires_at);

    if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
      await pool.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
      return unauthorized(res, true);
    }

    const userResult = await pool.query(
      `
      SELECT id, name, email
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [session.user_id]
    );

    if (!userResult.rowCount) {
      await pool.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
      return unauthorized(res, true);
    }

    const user = userResult.rows[0];

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return next();
  } catch (error) {
    console.error('requireAuth error:', error);
    return res.status(500).json({ message: 'internal server error' });
  }
}