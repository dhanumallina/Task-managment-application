import { Router } from 'express';
import { getProfile, updateProfile, changePassword, getUserStats, getDashboardData } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody, changePasswordSchema } from '../validators/auth.validator.js';

const router = Router();
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', validateBody(changePasswordSchema), changePassword);
router.get('/stats', getUserStats);
router.get('/dashboard', getDashboardData);

export default router;
