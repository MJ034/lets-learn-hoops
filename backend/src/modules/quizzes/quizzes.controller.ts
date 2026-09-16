import type { Request, Response } from 'express';
import { pool } from '../../database/pool.js';

type SubmittedAnswer = {
  questionId: string;
  selectedAnswer: string;
};

type QuizQuestionAnswer = {
  id: string;
  correct_answer: string;
};

function parseSubmittedAnswers(body: unknown): SubmittedAnswer[] | null {
  if (!body || typeof body !== 'object' || !('answers' in body)) {
    return null;
  }

  const { answers } = body as { answers: unknown };

  if (!Array.isArray(answers)) {
    return null;
  }

  const seenQuestionIds = new Set<string>();

  for (const answer of answers) {
    if (!answer || typeof answer !== 'object') {
      return null;
    }

    const { questionId, selectedAnswer } = answer as Partial<SubmittedAnswer>;

    if (typeof questionId !== 'string' || typeof selectedAnswer !== 'string') {
      return null;
    }

    if (!questionId.trim() || !selectedAnswer.trim() || seenQuestionIds.has(questionId)) {
      return null;
    }

    seenQuestionIds.add(questionId);
  }

  return answers as SubmittedAnswer[];
}

async function getScoredQuizReview(quizId: string, answers: SubmittedAnswer[]) {
  const questionsResult = await pool.query<QuizQuestionAnswer>(
    `
    SELECT id, correct_answer
    FROM quiz_questions
    WHERE quiz_id = $1
    ORDER BY created_at, id
    `,
    [quizId]
  );

  if (!questionsResult.rowCount) {
    return null;
  }

  const submittedByQuestionId = new Map(
    answers.map((answer) => [answer.questionId, answer.selectedAnswer])
  );
  const quizQuestionIds = new Set(questionsResult.rows.map((question) => question.id));

  const hasAnswersForOtherQuiz = answers.some(
    (answer) => !quizQuestionIds.has(answer.questionId)
  );

  if (hasAnswersForOtherQuiz) {
    return 'INVALID_QUESTION_IDS' as const;
  }

  const review = questionsResult.rows.map((question) => {
    const selectedAnswer = submittedByQuestionId.get(question.id) ?? null;

    return {
      questionId: question.id,
      selectedAnswer,
      correctAnswer: question.correct_answer,
      isCorrect: selectedAnswer === question.correct_answer,
    };
  });

  const score = review.filter((answer) => answer.isCorrect).length;
  const totalQuestions = questionsResult.rows.length;

  return { review, score, totalQuestions };
}

export async function getQuizByModuleSlug(req: Request, res: Response) {
  try {
    const { moduleSlug } = req.params;

    const result = await pool.query(
      `
      SELECT q.id AS quiz_id, q.title AS quiz_title,
             qq.id AS question_id, qq.question, qq.options
      FROM learning_modules lm
            LEFT JOIN quizzes q ON q.module_id = lm.id
      LEFT JOIN quiz_questions qq ON qq.quiz_id = q.id
      WHERE lm.slug = $1
      ORDER BY qq.created_at, qq.id
      `,
      [moduleSlug]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: 'Learning module not found' });
    }

    const firstRow = result.rows[0];

    if (!firstRow.quiz_id) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({
      quiz: {
        id: firstRow.quiz_id,
        title: firstRow.quiz_title,
        questions: result.rows
          .filter((row) => row.question_id)
          .map((row) => ({
            id: row.question_id,
            question: row.question,
            options: row.options,
          })),
      },
    });
  } catch (err) {
    console.error('Error fetching quiz:', err);
    res.status(500).json({ message: 'Failed to fetch quiz' });
  }
}

export async function submitQuiz(req: Request, res: Response) {
  try {
    const { quizId } = req.params;
    const answers = parseSubmittedAnswers(req.body);

    if (!answers) {
      return res.status(400).json({
        message: 'answers must be an array of { questionId, selectedAnswer }',
      });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'unauthorized' });
    }

    const scoredReview = await getScoredQuizReview(quizId, answers);

    if (!scoredReview) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (scoredReview === 'INVALID_QUESTION_IDS') {
      return res.status(400).json({
        message: 'answers contains questionId values that do not belong to this quiz',
      });
    }

    const insertResult = await pool.query(
      `
      INSERT INTO quiz_results (user_id, quiz_id, score, total_questions)
      VALUES ($1, $2, $3, $4)
      RETURNING id, completed_at
      `,
      [req.user.id, quizId, scoredReview.score, scoredReview.totalQuestions]
    );

    res.status(201).json({
      result: {
        id: insertResult.rows[0].id,
        quizId,
        score: scoredReview.score,
        totalQuestions: scoredReview.totalQuestions,
        completedAt: insertResult.rows[0].completed_at,
        answers: scoredReview.review,
      },
    });
  } catch (err) {
    console.error('Error submitting quiz:', err);
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
}

export async function reviewQuiz(req: Request, res: Response) {
  try {
    const { quizId } = req.params;
    const answers = parseSubmittedAnswers(req.body);

    if (!answers) {
      return res.status(400).json({
        message: 'answers must be an array of { questionId, selectedAnswer }',
      });
    }

    const scoredReview = await getScoredQuizReview(quizId, answers);

    if (!scoredReview) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (scoredReview === 'INVALID_QUESTION_IDS') {
      return res.status(400).json({
        message: 'answers contains questionId values that do not belong to this quiz',
      });
    }

    res.json({
      result: {
        id: null,
        quizId,
        score: scoredReview.score,
        totalQuestions: scoredReview.totalQuestions,
        completedAt: null,
        answers: scoredReview.review,
      },
    });
  } catch (err) {
    console.error('Error reviewing quiz:', err);
    res.status(500).json({ message: 'Failed to review quiz' });
  }
}