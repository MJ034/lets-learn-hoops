import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pool } from '../../database/pool.js';
import { getQuizByModuleSlug, reviewQuiz, submitQuiz } from './quizzes.controller.js';

function createMockRes() {
    return {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
    };
}

describe('quizzes controller', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('fetches a quiz for a module without exposing correct answers', async () => {
        vi.spyOn(pool, 'query').mockResolvedValue({
            rowCount: 2,
            rows: [
                {
                    quiz_id: 'quiz-1',
                    quiz_title: 'Traveling Quiz',
                    question_id: 'question-1',
                    question: 'What is a pivot foot?',
                    options: ['Keep foot', 'Back foot'],
                    correct_answer: 'Keep foot',
                },
                {
                    quiz_id: 'quiz-1',
                    quiz_title: 'Traveling Quiz',
                    question_id: 'question-2',
                    question: 'How many steps?',
                    options: ['One', 'Two'],
                    correct_answer: 'Two',
                },
            ],
        } as any);

        const req = {
            params: {
                moduleSlug: 'what-is-a-travel',
            },
        } as any;

        const res = createMockRes() as any;

        await getQuizByModuleSlug(req, res);

        expect(res.json).toHaveBeenCalledWith({
            quiz: {
                id: 'quiz-1',
                title: 'Traveling Quiz',
                questions: [
                    {
                        id: 'question-1',
                        question: 'What is a pivot foot?',
                        options: ['Keep foot', 'Back foot'],
                    },
                    {
                        id: 'question-2',
                        question: 'How many steps?',
                        options: ['One', 'Two'],
                    },
                ],
            },
        });

        const serializedJsonCalls = JSON.stringify((res.json as ReturnType<typeof vi.fn>).mock.calls);
        expect(serializedJsonCalls).not.toContain('correct_answer');
        expect(serializedJsonCalls).not.toContain('correctAnswer');
    });

    it('returns 404 when a module exists but has no quiz', async () => {
        vi.spyOn(pool, 'query').mockResolvedValue({
            rowCount: 1,
            rows: [
                {
                    quiz_id: null,
                    quiz_title: null,
                    question_id: null,
                    question: null,
                    options: null,
                },
            ],
        } as any);

        const req = {
            params: {
                moduleSlug: 'court-dimensions',
            },
        } as any;

        const res = createMockRes() as any;

        await getQuizByModuleSlug(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Quiz not found' });
    });

    it('returns 404 when the module slug does not exist', async () => {
        vi.spyOn(pool, 'query').mockResolvedValue({
            rowCount: 0,
            rows: [],
        } as any);

        const req = {
            params: {
                moduleSlug: 'not-a-real-module',
            },
        } as any;

        const res = createMockRes() as any;

        await getQuizByModuleSlug(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Learning module not found' });
    });

    it('scores submitted answers server-side and stores the result', async () => {
        vi.spyOn(pool, 'query').mockImplementation(async (sql: string) => {
            if (sql.includes('FROM quiz_questions')) {
                return {
                    rowCount: 3,
                    rows: [
                        { id: 'question-1', correct_answer: 'A' },
                        { id: 'question-2', correct_answer: 'B' },
                        { id: 'question-3', correct_answer: 'C' },
                    ],
                } as any;
            }

            if (sql.includes('INSERT INTO quiz_results')) {
                return {
                    rowCount: 1,
                    rows: [{ id: 'result-1', completed_at: '2026-08-26T00:00:00.000Z' }],
                } as any;
            }

            return { rowCount: 0, rows: [] } as any;
        });

        const req = {
            params: {
                quizId: 'quiz-1',
            },
            user: {
                id: 'user-1',
                name: 'Jane Doe',
                email: 'jane@example.com',
            },
            body: {
                answers: [
                    { questionId: 'question-1', selectedAnswer: 'A' },
                    { questionId: 'question-2', selectedAnswer: 'wrong' },
                ],
            },
        } as any;

        const res = createMockRes() as any;

        await submitQuiz(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO quiz_results'),
            ['user-1', 'quiz-1', 1, 3]
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            result: {
                id: 'result-1',
                quizId: 'quiz-1',
                score: 1,
                totalQuestions: 3,
                completedAt: '2026-08-26T00:00:00.000Z',
                answers: [
                    {
                        questionId: 'question-1',
                        selectedAnswer: 'A',
                        correctAnswer: 'A',
                        isCorrect: true,
                    },
                    {
                        questionId: 'question-2',
                        selectedAnswer: 'wrong',
                        correctAnswer: 'B',
                        isCorrect: false,
                    },
                    {
                        questionId: 'question-3',
                        selectedAnswer: null,
                        correctAnswer: 'C',
                        isCorrect: false,
                    },
                ],
            },
        });
    });

    it('rejects malformed submitted answers', async () => {
        const req = {
            params: {
                quizId: 'quiz-1',
            },
            user: {
                id: 'user-1',
                name: 'Jane Doe',
                email: 'jane@example.com',
            },
            body: {
                answers: [{ questionId: 'question-1' }],
            },
        } as any;

        const res = createMockRes() as any;

        await submitQuiz(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'answers must be an array of { questionId, selectedAnswer }',
        });
    });

    it('reviews quiz answers without storing a result', async () => {
        vi.spyOn(pool, 'query').mockResolvedValue({
            rowCount: 2,
            rows: [
                { id: 'question-1', correct_answer: 'A' },
                { id: 'question-2', correct_answer: 'B' },
            ],
        } as any);

        const req = {
            params: {
                quizId: 'quiz-1',
            },
            body: {
                answers: [
                    { questionId: 'question-1', selectedAnswer: 'A' },
                    { questionId: 'question-2', selectedAnswer: 'wrong' },
                ],
            },
        } as any;

        const res = createMockRes() as any;

        await reviewQuiz(req, res);

        expect(pool.query).not.toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO quiz_results'),
            expect.any(Array)
        );
        expect(res.json).toHaveBeenCalledWith({
            result: {
                id: null,
                quizId: 'quiz-1',
                score: 1,
                totalQuestions: 2,
                completedAt: null,
                answers: [
                    {
                        questionId: 'question-1',
                        selectedAnswer: 'A',
                        correctAnswer: 'A',
                        isCorrect: true,
                    },
                    {
                        questionId: 'question-2',
                        selectedAnswer: 'wrong',
                        correctAnswer: 'B',
                        isCorrect: false,
                    },
                ],
            },
        });
    });

    it('rejects answers for questions that do not belong to this quiz', async () => {
        vi.spyOn(pool, 'query').mockResolvedValue({
            rowCount: 2,
            rows: [
                { id: 'question-1', correct_answer: 'A' },
                { id: 'question-2', correct_answer: 'B' },
            ],
        } as any);

        const req = {
            params: {
                quizId: 'quiz-1',
            },
            user: {
                id: 'user-1',
                name: 'Jane Doe',
                email: 'jane@example.com',
            },
            body: {
                answers: [
                    { questionId: 'question-1', selectedAnswer: 'A' },
                    { questionId: 'other-quiz-question', selectedAnswer: 'C' },
                ],
            },
        } as any;

        const res = createMockRes() as any;

        await submitQuiz(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'answers contains questionId values that do not belong to this quiz',
        });
        expect(pool.query).not.toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO quiz_results'),
            expect.any(Array)
        );
    });

    it('allows a user to submit the same quiz multiple times', async () => {
        vi.spyOn(pool, 'query').mockImplementation(async (sql: string) => {
            if (sql.includes('FROM quiz_questions')) {
                return {
                    rowCount: 1,
                    rows: [{ id: 'question-1', correct_answer: 'A' }],
                } as any;
            }

            if (sql.includes('INSERT INTO quiz_results')) {
                return {
                    rowCount: 1,
                    rows: [{ id: 'result-1', completed_at: '2026-08-26T00:00:00.000Z' }],
                } as any;
            }

            return { rowCount: 0, rows: [] } as any;
        });

        const req = {
            params: {
                quizId: 'quiz-1',
            },
            user: {
                id: 'user-1',
                name: 'Jane Doe',
                email: 'jane@example.com',
            },
            body: {
                answers: [{ questionId: 'question-1', selectedAnswer: 'A' }],
            },
        } as any;

        await submitQuiz(req, createMockRes() as any);
        await submitQuiz(req, createMockRes() as any);

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO quiz_results'),
            ['user-1', 'quiz-1', 1, 1]
        );
        expect(
            (pool.query as ReturnType<typeof vi.fn>).mock.calls.filter(([sql]) =>
                String(sql).includes('INSERT INTO quiz_results')
            )
        ).toHaveLength(2);
    });
});