import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "fallback_secret";

interface JwtPayload {
  userId: number;
  username: string;
  teamId?: number;
  profileImage: string;
  isActive: boolean;
  themeMode: "light" | "dark";
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    teamId?: number;
    profileImage?: string;
    isActive?: boolean;
    themeMode?: "light" | "dark";
  };
  file?: Express.Multer.File;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void { // ✅ BURASI ÖNEMLİ
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token bulunamadı" });
    return; // ✅ RETURN EKLİYORUZ
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;

    req.user = {
      id: payload.userId,
      username: payload.username,
      teamId: payload.teamId,
      profileImage: payload.profileImage,
      isActive: payload.isActive,
      themeMode: payload.themeMode,
    };

    next();
  } catch (error) {
    res.status(403).json({ message: "Token geçersiz veya süresi dolmuş" });
    return; // ✅ RETURN EKLİYORUZ
  }
}
