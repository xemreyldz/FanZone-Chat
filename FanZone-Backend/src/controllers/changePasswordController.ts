import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { poolPromise } from '../db/mssql';
import { AuthenticatedRequest } from '../middleware/authenticateToken';
import sql from 'mssql';

export const changePasswordController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Kullanıcı doğrulanamadı.' });
      return;
    }

    const pool = await poolPromise;
    const { currentPassword, newPassword } = req.body;

    // Kullanıcının hashlenmiş şifresini çek
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT password FROM Users WHERE UserID = @userId');

    if (result.recordset.length === 0) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
      return;
    }

    const user = result.recordset[0];

    // Eski şifreyi karşılaştır
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Eski şifre yanlış.' });
      return;
    }

    // Yeni şifreyi hashle
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Yeni şifreyi güncelle
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('newPassword', sql.VarChar, hashedPassword)
      .query('UPDATE Users SET password = @newPassword WHERE UserID = @userId');

    res.json({ message: 'Şifre başarıyla güncellendi.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};
