import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { getProgressSummary, markModuleComplete } from './progress.controller.js';

const progressRouter = Router();

progressRouter.post('/module/:moduleId', requireAuth, markModuleComplete);
progressRouter.get('/summary', requireAuth, getProgressSummary);

export default progressRouter;