import { Router } from "express";
import multer from "multer";
import { createGroup } from "../controllers/addGroupController";
import { authenticateToken } from "../middleware/authenticateToken"; // eksikti

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// middleware sırası önemli: önce token, sonra upload, sonra controller
router.post("/", authenticateToken, upload.single("image"), createGroup);

export default router;
