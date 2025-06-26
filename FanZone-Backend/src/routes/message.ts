// routes/messages.ts
import express from 'express';
import  getMessagesByGroupId  from '../controllers/messagesController';
import getLastMessagesForAllGroups from "../controllers/messagesController"

const router = express.Router();

router.get('/last/all', getLastMessagesForAllGroups)
router.get('/:groupId', getMessagesByGroupId);

export default router;
