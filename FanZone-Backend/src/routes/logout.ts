// routes/authRoutes.ts gibi bir dosyada
import express from 'express';
import { logoutUser } from '../controllers/logoutController';

const router = express.Router();

router.post('/', logoutUser);

export default router;
