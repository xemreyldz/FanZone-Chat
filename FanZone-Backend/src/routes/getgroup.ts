import { Router } from 'express';
import { getGroups } from '../controllers/getGroupController';
const router = Router();
router.get('/', getGroups);
export default router;