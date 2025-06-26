import express from 'express';
import { getUserGroups } from "../controllers/getUserGroupsController"
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

router.get('/', authenticateToken, getUserGroups);

export default router;