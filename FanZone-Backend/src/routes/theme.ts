import express from 'express';
import { updateUserMode, getUserMode } from '../controllers/themeController';

const router = express.Router();

router.put('/users/:userId/mode', updateUserMode);
router.get('/users/:userId/mode', getUserMode);

export default router;
