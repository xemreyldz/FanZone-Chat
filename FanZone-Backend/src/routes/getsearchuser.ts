import express from 'express';
import { getSearchUserController } from '../controllers/getSearchUserController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

router.get('/search', authenticateToken, getSearchUserController);

export default router;