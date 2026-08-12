import { Router } from 'express';
import { getLearningModules, getLearningModuleBySlug } from './learning.controller.js';

const learningRouter = Router();

learningRouter.get('/', getLearningModules);
learningRouter.get('/:slug', getLearningModuleBySlug);

export default learningRouter;