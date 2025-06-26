// controllers/logoutUser.ts

import { Request, Response } from 'express';
import { poolPromise } from '../db/mssql';

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.body.userId; // veya auth middleware ile alınabilir

    if (!userId) {
      res.status(400).json({ error: 'Kullanıcı ID gerekli' });
      return;
    }

    const pool = await poolPromise;
    await pool.request()
      .input('userId', userId)
      .query('UPDATE Users SET IsActive = 0 WHERE UserID = @userId');

    res.status(200).json({ message: 'Çıkış başarılı, kullanıcı pasif yapıldı' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};
