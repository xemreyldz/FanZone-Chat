import express from 'express';
import { getDefaultTheme, getTeamTheme } from "../controllers/getDefaultThemeController";
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

// Varsayılan tema
router.get('/default', authenticateToken, getDefaultTheme);

// Kullanıcının takım teması
router.get('/team', authenticateToken, getTeamTheme);

export default router;
