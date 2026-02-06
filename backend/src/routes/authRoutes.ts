import express from 'express';
import { login, logout, forgotPassword, resetPassword } from '../controllers/auth/authController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
 
export default router;