import { Request, Response } from 'express';
import { poolPromise } from '../db/mssql';

export const getGroupMembers = async (req: Request, res: Response) => {
  const groupId = parseInt(req.params.groupId); // /api/groups/:groupId/members gibi

  if (isNaN(groupId)) {
     res.status(400).json({ error: 'Geçersiz GroupID' });
    return
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('GroupID', groupId)
      .query(`
        SELECT 
          u.UserID AS id,
          u.FirstName + ' ' + u.LastName AS name,
          u.Username,
          u.ProfileImage AS profileImage,
          CAST(u.IsActive AS INT) AS isActive
        FROM GroupMembers gm
        JOIN Users u ON gm.UserID = u.UserID
        WHERE gm.GroupID = @GroupID
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Grup üyeleri alınırken hata:', error);
    res.status(500).json({ error: 'Grup üyeleri alınamadı' });
  }
};
