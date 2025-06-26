import express from 'express';
import { leaveGroup } from '../controllers/leaveGroupController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

router.delete('/:groupId/leave', authenticateToken, leaveGroup);

export default router;
