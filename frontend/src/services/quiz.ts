import type { Quiz, QuizResponse, QuizResult, SubmitAnswer, SubmitQuizResponse } from '../types/quiz';
import { apiPath } from '../config/api';

const BASE_URL = apiPath('/quizzes');

export async function getQuizByModuleSlug(moduleSlug: string): Promise<Quiz> {
  const res = await fetch(`${BASE_URL}/module/${moduleSlug}`, {
    credentials: 'include',
  });

  if (res.status === 404) {
    throw new Error('NO_QUIZ');
  }

  if (!res.ok) throw new Error('Failed to load quiz');

  const data: QuizResponse = await res.json();
  return data.quiz;
}

export async function submitQuiz(quizId: string, answers: SubmitAnswer[]): Promise<QuizResult> {
  const res = await fetch(`${BASE_URL}/${quizId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ answers }),
  });

  if (res.status === 401) {
    throw new Error('AUTH_REQUIRED');
  }

  if (!res.ok) throw new Error('Failed to submit quiz');

  const data: SubmitQuizResponse = await res.json();
  return data.result;
}

export async function reviewQuiz(quizId: string, answers: SubmitAnswer[]): Promise<QuizResult> {
  const res = await fetch(`${BASE_URL}/${quizId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ answers }),
  });

  if (!res.ok) throw new Error('Failed to review quiz');

  const data: SubmitQuizResponse = await res.json();
  return data.result;
}