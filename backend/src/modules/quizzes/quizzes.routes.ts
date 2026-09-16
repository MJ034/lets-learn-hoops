import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { getQuizByModuleSlug, reviewQuiz, submitQuiz } from './quizzes.controller.js';

const quizzesRouter = Router();

quizzesRouter.get('/module/:moduleSlug', getQuizByModuleSlug);
quizzesRouter.post('/:quizId/review', reviewQuiz);
quizzesRouter.post('/:quizId/submit', requireAuth, submitQuiz);

export default quizzesRouter;