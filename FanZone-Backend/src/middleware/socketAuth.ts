import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "fallback_secret";

interface JwtPayload {
  userId: number;
  username: string;
  profileImage: string;
  isActive: boolean;
  themeMode: "light" | "dark";
  iat: number;
  exp: number;
}

export function socketAuthMiddleware(socket: Socket, next: (err?: any) => void) {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: Token bulunamadı"));
    }

    const payload = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
    (socket as any).user = {
      id: payload.userId,
      username: payload.username,
    };

    next();
  } catch (error) {
    next(new Error("Authentication error: Token geçersiz veya süresi dolmuş"));
  }
}
