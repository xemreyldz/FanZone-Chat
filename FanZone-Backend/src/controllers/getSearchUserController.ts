import { Request, Response } from 'express';
import { poolPromise } from '../db/mssql';
import { AuthenticatedRequest } from '../middleware/authenticateToken';

export const getSearchUserController = async (req: AuthenticatedRequest, res: Response) => {
  const query = req.query.query as string;
  const teamId = req.user?.teamId;
  const currentUserId = req.user?.id;

  if (!query || !teamId || !currentUserId) {
     res.status(400).json({ error: 'Gerekli parametreler eksik.' });
  return
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('query', `%${query}%`)
      .input('teamId', teamId)
      .input('currentUserId', currentUserId)
      .query(`
        SELECT UserID, Username, ProfileImage
        FROM Users
        WHERE Username LIKE @query
          AND TeamID = @teamId
          AND UserID != @currentUserId
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Arama hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};
