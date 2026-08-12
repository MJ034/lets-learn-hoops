import { Router } from 'express';
import { register, login, logout } from './auth.controller.js';
import { requireAuth } from '../../middleware/requireAuth.js';


const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

authRouter.get('/me', requireAuth, (req, res) => {
  return res.status(200).json({ user: req.user });
});

export default authRouter;