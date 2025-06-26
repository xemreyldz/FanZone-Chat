import { Request, Response } from 'express';
import { poolPromise } from '../db/mssql';
import { AuthenticatedRequest } from "../middleware/authenticateToken"

export const getUserInfoController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
       res.status(401).json({ message: 'Kullanıcı doğrulanamadı' });
      return
    }

    const userId = req.user.id;

    const pool = await poolPromise;
    const result = await pool.request()
    .input('userId', userId)
    .query(`
    SELECT TOP 1
        Firstname AS name,
        Lastname AS surname,
        Username AS username,
        Email AS email,
        ProfileImage AS avatarUrl,
        TeamID as teamID
    FROM [Users]
    WHERE UserID = @userId
    `);

    if (result.recordset.length === 0) {
       res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    return
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};
