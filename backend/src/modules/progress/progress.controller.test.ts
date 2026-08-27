import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pool } from '../../database/pool.js';
import { getProgressSummary, markModuleComplete } from './progress.controller.js';

function createMockRes() {
    return {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
    };
}

describe('progress controller', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('marks a module complete when the module exists', async () => {
        vi.spyOn(pool, 'query').mockImplementation(async (sql: string) => {
            if (sql.includes('SELECT id FROM learning_modules')) {
                return { rowCount: 1, rows: [{ id: 'module-1' }] } as any;
            }

            if (sql.includes('INSERT INTO user_progress')) {
                return { rowCount: 1, rows: [] } as any;
            }

            return { rowCount: 0, rows: [] } as any;
        });

        const req = {
            params: {
                moduleId: 'module-1',
            },
            user: {
                id: 'user-1',
                name: 'Jane Doe',
                email: 'jane@example.com',
            },
        } as any;

        const res = createMockRes() as any;

        await markModuleComplete(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            'INSERT INTO user_progress (user_id, module_id) VALUES ($1, $2)',
            ['user-1', 'module-1']
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Lesson marked complete' });
    });

    it('treats an already-completed module as a successful idempotent request', async () => {
        vi.spyOn(pool, 'query').mockImplementation(async (sql: string) => {
            if (sql.includes('SELECT id FROM learning_modules')) {
                return { rowCount: 1, rows: [{ id: 'module-1' }] } as any;
            }

            if (sql.includes('INSERT INTO user_progress')) {
                throw { code: '23505' };
            }

            return { rowCount: 0, rows: [] } as any;
        });

        const req = {
            params: {
                moduleId: 'module-1',
            },
            user: {
                id: 'user-1',
                name: 'Jane Doe',
                email: 'jane@example.com',
            },
        } as any;

        const res = createMockRes() as any;

        await markModuleComplete(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Lesson already marked complete' });
    });

    it('returns 404 when completing a module that does not exist', async () => {
        vi.spyOn(pool, 'query').mockResolvedValue({ rowCount: 0, rows: [] } as any);

        const req = {
            params: {
                moduleId: 'missing-module',
            },
            user: {
                id: 'user-1',
                name: 'Jane Doe',
                email: 'jane@example.com',
            },
        } as any;

        const res = createMockRes() as any;

        await markModuleComplete(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Learning module not found' });
        expect(pool.query).not.toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO user_progress'),
            expect.any(Array)
        );
    });

    it('returns lesson completion and quiz history summary', async () => {
        vi.spyOn(pool, 'query').mockImplementation(async (sql: string) => {
            if (sql.includes('FROM user_progress')) {
                return {
                    rowCount: 2,
                    rows: [
                        { module_id: 'module-1', completed_at: '2026-08-26T00:00:00.000Z' },
                        { module_id: 'module-2', completed_at: '2026-08-27T00:00:00.000Z' },
                    ],
                } as any;
            }

            if (sql.includes('COUNT(*) FROM learning_modules')) {
                return { rowCount: 1, rows: [{ count: '3' }] } as any;
            }

            if (sql.includes('FROM quiz_results')) {
                return {
                    rowCount: 1,
                    rows: [
                        {
                            score: 4,
                            total_questions: 5,
                            completed_at: '2026-08-27T00:00:00.000Z',
                            quiz_title: 'Traveling Quiz',
                            lesson_title: 'Traveling',
                        },
                    ],
                } as any;
            }

            return { rowCount: 0, rows: [] } as any;
        });

        const req = {
            user: {
                id: 'user-1',
                name: 'Jane Doe',
                email: 'jane@example.com',
            },
        } as any;

        const res = createMockRes() as any;

        await getProgressSummary(req, res);

        expect(res.json).toHaveBeenCalledWith({
            lessonsCompleted: 2,
            totalLessons: 3,
            completionPercentage: 67,
            quizHistory: [
                {
                    score: 4,
                    total_questions: 5,
                    completed_at: '2026-08-27T00:00:00.000Z',
                    quiz_title: 'Traveling Quiz',
                    lesson_title: 'Traveling',
                },
            ],
        });
    });
});