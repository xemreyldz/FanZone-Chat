import express from 'express';
import { changePasswordController } from '../controllers/changePasswordController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

// Şifre değiştirme endpointi
router.put('/change-password', authenticateToken, changePasswordController);

export default router;
