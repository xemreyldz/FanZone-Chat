import express from 'express';
import { poolPromise } from '../db/mssql';
import * as sql from 'mssql';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authenticateToken';

const router = express.Router();

// Grup ID'ye göre mesajları çekme
router.get('/:groupId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { groupId } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('GroupID', sql.Int, parseInt(groupId))
      .query(`
        SELECT M.MessageID, M.UserID, M.GroupID, M.MessageText,M.Image, M.SentAt, U.FirstName, U.LastName, U.Username, U.ProfileImage
        FROM Messages M
        JOIN Users U ON M.UserID = U.UserID
        WHERE M.GroupID = @GroupID
        ORDER BY M.SentAt ASC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Mesajlar çekilirken hata:', error);
    res.status(500).json({ error: 'Mesajlar alınamadı' });
  }
});

// Kullanıcının katıldığı takıma ve gruplara göre son mesajlar
router.get('/last/all', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const teamId = req.user?.teamId;

    const pool = await poolPromise;
    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .input('TeamID', sql.Int, teamId)
      .query(`
        SELECT 
          G.GroupID,
          G.GroupName,
          G.GroupImageUrl,
          G.Description,
          M.MessageText AS LastMessage,
          M.SentAt AS LastMessageTime,
          U.FirstName,
          U.LastName,
          U.Username,
          U.ProfileImage
        FROM Groups G
        INNER JOIN GroupMembers UG ON G.GroupID = UG.GroupID
        OUTER APPLY (
          SELECT TOP 1 M.MessageText, M.SentAt,M.Image, M.UserID
          FROM Messages M
          WHERE M.GroupID = G.GroupID
          ORDER BY M.SentAt DESC
        ) M
        LEFT JOIN Users U ON M.UserID = U.UserID
        WHERE UG.UserID = @UserID
          AND G.TeamID = @TeamID
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Son mesajlar alınırken hata:', error);
    res.status(500).json({ error: 'Son mesajlar alınamadı' });
  }
});

export default router;
