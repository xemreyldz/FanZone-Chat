import express from 'express';
import { getGroupMembers } from '../controllers/getGroupMembersController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

router.get('/:groupId/members', authenticateToken, getGroupMembers); // /api/groups/1/members gibi

export default router;
