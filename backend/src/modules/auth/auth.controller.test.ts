import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import { pool } from '../../database/pool.js';
import { SESSION_COOKIE_NAME } from '../../config/cookie.js';
import { register, login, logout } from './auth.controller.js';

function createMockRes() {
    return {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        cookie: vi.fn().mockReturnThis(),
        clearCookie: vi.fn().mockReturnThis(),
    };
}

describe('auth controller', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('registers a user and sets a session cookie', async () => {
        vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password' as never);
        vi.spyOn(pool, 'query').mockImplementation(async (sql: string) => {
            if (sql.includes('SELECT id FROM users')) {
                return { rowCount: 0, rows: [] } as any;
            }

            if (sql.includes('INSERT INTO users')) {
                return {
                    rowCount: 1,
                    rows: [
                        {
                            id: 42,
                            name: 'Jane Doe',
                            email: 'jane@example.com',
                            created_at: new Date(),
                        },
                    ],
                } as any;
            }

            if (sql.includes('INSERT INTO sessions')) {
                return { rowCount: 1, rows: [] } as any;
            }

            return { rowCount: 0, rows: [] } as any;
        });

        const req = {
            body: {
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'password123',
            },
        } as any;

        const res = createMockRes() as any;

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.cookie).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            user: {
                id: 42,
                name: 'Jane Doe',
                email: 'jane@example.com',
            },
        });
    });

    it('rejects an invalid login', async () => {
        vi.spyOn(pool, 'query').mockResolvedValue({
            rowCount: 1,
            rows: [
                {
                    id: 7,
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    password_hash: 'hashed_password',
                },
            ],
        } as any);

        vi.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

        const req = {
            body: {
                email: 'jane@example.com',
                password: 'wrongpass',
            },
        } as any;

        const res = createMockRes() as any;

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('logs a user out and clears the cookie', async () => {
        vi.spyOn(pool, 'query').mockResolvedValue({ rowCount: 1, rows: [] } as any);

        const req = {
            cookies: {
                [SESSION_COOKIE_NAME]: 'session-123',
            },
        } as any;

        const res = createMockRes() as any;

        await logout(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.clearCookie).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ message: 'logged out' });
    });

    it('returns 400 when registration payload is missing required fields', async () => {
        const req = {
            body: {
                name: 'Jane Doe',
                email: 'jane@example.com',
            },
        } as any;

        const res = createMockRes() as any;

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'name, email, and password are required',
        });
    });

    it('returns 400 when email format is invalid during registration', async () => {
        const req = {
            body: {
                name: 'Jane Doe',
                email: 'not-an-email',
                password: 'password123',
            },
        } as any;

        const res = createMockRes() as any;

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'invalid email format',
        });
    });

    it('returns 409 when the email is already registered', async () => {
        vi.spyOn(pool, 'query').mockResolvedValue({
            rowCount: 1,
            rows: [{ id: 123 }],
        } as any);

        const req = {
            body: {
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'password123',
            },
        } as any;

        const res = createMockRes() as any;

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            message: 'email already in use',
        });
    });

    it('returns 400 when login request is missing email or password', async () => {
        const req = {
            body: {
                email: '   ',
                password: '',
            },
        } as any;

        const res = createMockRes() as any;

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'email and password are required',
        });
    });

    it('logs a user in successfully when credentials are valid', async () => {
        vi.spyOn(pool, 'query').mockResolvedValue({
            rowCount: 1,
            rows: [
                {
                    id: 7,
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    password_hash: 'hashed_password',
                },
            ],
        } as any);

        vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

        const req = {
            body: {
                email: 'jane@example.com',
                password: 'password123',
            },
        } as any;

        const res = createMockRes() as any;

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.cookie).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            user: {
                id: 7,
                name: 'Jane Doe',
                email: 'jane@example.com',
            },
        });
    });
});