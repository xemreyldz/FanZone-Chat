import { Request, Response } from 'express';
import { poolPromise } from '../db/mssql';
import { AuthenticatedRequest } from '../middleware/authenticateToken';

export const getAvailableGroupsByTeam = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const pool = await poolPromise;

    // Kullanıcının takımını al
    const userTeamResult = await pool.request()
      .input('UserID', userId)
      .query(`SELECT TeamID FROM Users WHERE UserID = @UserID`);

    if (userTeamResult.recordset.length === 0) {
      res.status(404).json({ error: 'Kullanıcı bulunamadı' });
      return 
    }

    const teamId = userTeamResult.recordset[0].TeamID;

    // Takıma ait ve kullanıcı üyesi olmayan gruplar
    const groupsResult = await pool.request()
      .input('UserID', userId)
      .input('TeamID', teamId)
      .query(`
        SELECT * FROM Groups 
        WHERE TeamID = @TeamID
        AND GroupID NOT IN (SELECT GroupID FROM GroupMembers WHERE UserID = @UserID)
      `);

    res.json(groupsResult.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};
