import { Response } from 'express';
import { poolPromise } from '../db/mssql';
import { AuthenticatedRequest } from '../middleware/authenticateToken';
import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret_key';

export const updateUserController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Kimlik doğrulama başarısız' });
      return;
    }

    const { username, email } = req.body;

    if (!username || !email) {
      res.status(400).json({ message: 'Kullanıcı adı ve e-mail zorunludur' });
      return;
    }

    const profileImageUrl = req.file ? `/profileImage/${req.file.filename}` : null;

    const pool = await poolPromise;

    // Güncelleme sorgusu
    await pool.request()
      .input('userId', userId)
      .input('username', username)
      .input('email', email)
      .input('profileImageUrl', profileImageUrl)
      .query(`
        UPDATE Users
        SET Username = @username,
            Email = @email,
            ProfileImage = COALESCE(@profileImageUrl, ProfileImage)
        WHERE UserID = @userId
      `);

    // Güncellenmiş kullanıcı bilgilerini tekrar çek
    const result = await pool.request()
      .input('userId', userId)
      .query(`
        SELECT UserID, Username, Email, ProfileImage, TeamID, IsActive, ThemeMode
        FROM Users
        WHERE UserID = @userId
      `);

    if (result.recordset.length === 0) {
       res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
      return
    }

    const updatedUser = result.recordset[0];

    // Yeni token oluştur
    const tokenPayload = {
      userId: updatedUser.UserID,
      username: updatedUser.Username,
      email: updatedUser.Email,
      profileImage: updatedUser.ProfileImage,
      teamId: updatedUser.TeamID,
      isActive: updatedUser.IsActive,
      themeMode: updatedUser.ThemeMode,
    };

    const newToken = jwt.sign(tokenPayload, JWT_SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Kullanıcı bilgileri başarıyla güncellendi',
      token: newToken,
      user: updatedUser,
    });

  } catch (err: any) {
    console.error('Kullanıcı güncelleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası oluştu', error: err.message });
  }
};
