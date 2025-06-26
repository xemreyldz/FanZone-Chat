import express from 'express';
import { getUserInfoController } from '../controllers/getUserInfoController';
import { authenticateToken } from "../middleware/authenticateToken"

const router = express.Router();

router.get('/user/me', authenticateToken, getUserInfoController);

export default router;