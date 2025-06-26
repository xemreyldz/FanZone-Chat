import { Router } from "express";
import { requestPasswordReset } from "../controllers/forgotPasswordController"
import { resetPassword } from "../controllers/resetPasswordController";

const router = Router();

router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
