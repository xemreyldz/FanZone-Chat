import { Request, Response } from 'express';
import { poolPromise } from '../db/mssql';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "secret_key";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('username', username)
      .query('SELECT * FROM Users WHERE Username = @username');

    if (result.recordset.length === 0) {
      res.status(401).json({ error: 'Kullanıcı bulunamadı' });
      return;
    }

    const user = result.recordset[0];
    const isPasswordValid = await bcrypt.compare(password, user.Password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Şifre yanlış' });
      return;
    }


    await pool.request()
  .input('userId', user.UserID)
  .query('UPDATE Users SET IsActive = 1 WHERE UserID = @userId');

    // Token payload içine teamId ve diğer bilgileri de ekleyelim
    const tokenPayload = {
      userId: user.UserID,           // Veritabanında UserID diye varsayıyorum
      username: user.Username,
      teamId: user.TeamID,           // Eğer TeamID varsa
      profileImage: user.ProfileImage,
      isActive: user.IsActive,
      themeMode: user.ThemeMode,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({
      message: 'Giriş başarılı',
      token,
      user: {
        userId: user.UserID,
        username: user.Username,
        teamId: user.TeamID,
        profileImage: user.ProfileImage,
        isActive: 1,
        themeMode: user.ThemeMode,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};
