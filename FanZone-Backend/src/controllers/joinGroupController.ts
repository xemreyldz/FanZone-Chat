import { Request, Response } from 'express';
import { poolPromise } from '../db/mssql'; 
import * as sql from 'mssql';

import { AuthenticatedRequest } from '../middleware/authenticateToken';

export const joinGroup = async (req: AuthenticatedRequest, res: Response) => {
  const { groupId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Kullanıcı doğrulanamadı." });
    return
  }

  try {
    const pool = await poolPromise;

    // Kullanıcı zaten gruba katılmış mı kontrol et
    const checkResult = await pool.request()
      .input('groupId', sql.Int, Number(groupId))
      .input('userId', sql.Int, Number(userId))
      .query(`
        SELECT * FROM GroupMembers WHERE GroupID = @groupId AND UserID = @userId
      `);

    if (checkResult.recordset.length > 0) {
      res.status(400).json({ message: "Zaten bu gruba katıldınız." });
       return
    }

    // Kullanıcıyı gruba ekle
    await pool.request()
      .input('groupId', sql.Int, Number(groupId))
      .input('userId', sql.Int, Number(userId))
      .query(`
        INSERT INTO GroupMembers (GroupID, UserID)
        VALUES (@groupId, @userId)
      `);

    res.status(200).json({ message: "Gruba başarıyla katıldınız." });
    return

  } catch (error) {
    console.error("joinGroup error:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
