import { Router } from 'express';
import { register, login, logout, refreshToken, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody, registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login',    validateBody(loginSchema),    login);
router.post('/logout',   authenticate,                 logout);
router.post('/refresh-token',                          refreshToken);
router.get ('/me',       authenticate,                 getMe);

export default router;
