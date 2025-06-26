import express from 'express';
import { getAvailableGroupsByTeam,} from "../controllers/getAvailableGroupsByTeamController";
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

router.get('/available-by-team', authenticateToken, getAvailableGroupsByTeam);

export default router;
