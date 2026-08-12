import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { pool } from '../../database/pool.js';
import {
    SESSION_COOKIE_NAME,
    SESSION_COOKIE_MAX_AGE_MS,
    sessionCookieOptions,
} from '../../config/cookie.js';


function getRegisterValues(body: Request['body']) {
    const { name, email, password } = body ?? {};

    if (
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string'
    ) {
        return null;
    }

    return { name, email, password };
}

export async function register(req: Request, res: Response) {
    try {
        const values = getRegisterValues(req.body);

        if (!values) {
            return res.status(400).json({
                message: 'name, email, and password are required',
            });
        }

        const { name, email, password } = values;

        const normalizedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedName) {
            return res.status(400).json({ message: 'name is required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({ message: 'invalid email format' });
        }

        if (!password.trim()) {
            return res.status(400).json({
                message: 'password is required',
            });
        }

        if (password.length < 8) {
            return res
                .status(400)
                .json({ message: 'password must be at least 8 characters long' });
        }

        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1 LIMIT 1',
            [normalizedEmail]
        );

        if (existingUser.rowCount && existingUser.rowCount > 0) {
            return res.status(409).json({ message: 'email already in use' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const insertedUser = await pool.query(
            `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
      `,
            [normalizedName, normalizedEmail, passwordHash]
        );

        const user = insertedUser.rows[0];

        const sessionId = randomUUID();
        const expiresAt = new Date(Date.now() + SESSION_COOKIE_MAX_AGE_MS);

        await pool.query(
            `
        INSERT INTO sessions (id, user_id, expires_at)
        VALUES ($1, $2, $3)
      `,
            [sessionId, user.id, expiresAt]
        );

        res.cookie(SESSION_COOKIE_NAME, sessionId, sessionCookieOptions);

        return res.status(201).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('register error:', error);
        return res.status(500).json({ message: 'internal server error' });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body ?? {};

        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({
                message: 'email and password are required',
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail || !password.trim()) {
            return res.status(400).json({
                message: 'email and password are required',
            });
        }

        const invalidCredentials = { message: 'Invalid credentials' };

        const result = await pool.query(
            `
            SELECT id, name, email, password_hash
            FROM users
            WHERE email = $1
            LIMIT 1
            `,
            [normalizedEmail]
        );

        if (!result.rowCount) {
            return res.status(401).json(invalidCredentials);
        }

        const user = result.rows[0];

        if (!user.password_hash) {
            return res.status(401).json(invalidCredentials);
        }

        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return res.status(401).json(invalidCredentials);
        }

        const sessionId = randomUUID();
        const expiresAt = new Date(Date.now() + SESSION_COOKIE_MAX_AGE_MS);

        await pool.query(
            `
            INSERT INTO sessions (id, user_id, expires_at)
            VALUES ($1, $2, $3)
            `,
            [sessionId, user.id, expiresAt]
        );

        res.cookie(SESSION_COOKIE_NAME, sessionId, sessionCookieOptions);

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('login error:', error);
        return res.status(500).json({ message: 'internal server error' });
    }
}

export async function logout(req: Request, res: Response) {
  try {
    const sessionId = req.cookies?.[SESSION_COOKIE_NAME];

    // Idempotent: if no cookie, still clear client cookie and return success.
    if (typeof sessionId === 'string' && sessionId) {
      await pool.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
    }

    // Must match attributes used when setting the cookie.
    res.clearCookie(SESSION_COOKIE_NAME, sessionCookieOptions);

    return res.status(200).json({ message: 'logged out' });
  } catch (error) {
    console.error('logout error:', error);
    return res.status(500).json({ message: 'internal server error' });
  }
}