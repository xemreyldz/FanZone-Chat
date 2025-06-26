import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken';
import { deleteAccountController } from '../controllers/deleteAccountController';

const router = express.Router();

router.delete('/delete-account', authenticateToken, deleteAccountController);

export default router;