import express from 'express';
import multer from 'multer';
import path from 'path';
import { updateUserController } from '../controllers/updateUserController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'profileImage')); 
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });



router.put('/update-profile', authenticateToken, upload.single('profileImage'), updateUserController);

export default router;
