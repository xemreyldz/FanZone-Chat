import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken';
import { inviteToGroupController } from '../controllers/inviteToGroupController';

const router = express.Router();

router.post('/invite', authenticateToken, inviteToGroupController);

export default router;
