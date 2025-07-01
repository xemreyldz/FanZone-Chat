import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken';
import {
  getNotificationsController,
  acceptInvitationController,
  ignoreInvitationController,
} from '../controllers/getNotificationsController';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getNotificationsController);
router.post('/accept-invitation', acceptInvitationController);
router.post('/ignore', ignoreInvitationController);

export default router;
