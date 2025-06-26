import express from 'express';
import { joinGroup } from '../controllers/joinGroupController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

router.post('/:groupId/join', authenticateToken, joinGroup);

export default router;