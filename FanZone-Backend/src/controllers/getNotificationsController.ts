import { Request, Response } from 'express';
import { poolPromise } from '../db/mssql';
import * as sql from 'mssql';
import { AuthenticatedRequest } from '../middleware/authenticateToken';

export const getNotificationsController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
     res.status(401).json({ message: 'Yetkilendirme hatası' });
    return
  }

  try {
    const pool = await poolPromise;
  const result = await pool.request()
  .input('UserID', sql.Int, userId)
  .query(`
    SELECT 
      n.NotificationID, 
      n.UserID, 
      n.Type, 
      n.Message, 
      n.RelatedGroupID, 
      g.GroupName,                 -- Grup adı
      n.SenderUserID, 
      u.Username AS SenderUsername,         
      u.ProfileImage AS SenderProfileImage, 
      n.IsRead, 
      n.CreatedAt
    FROM Notifications n
    LEFT JOIN Users u ON n.SenderUserID = u.UserID
    LEFT JOIN Groups g ON n.RelatedGroupID = g.GroupID   -- Grup bilgisi için join
    WHERE n.UserID = @UserID
    ORDER BY n.CreatedAt DESC
  `);

    res.json(result.recordset);
    return 
  } catch (error) {
    console.error('Bildirimler alınırken hata:', error);
     res.status(500).json({ message: 'Sunucu hatası' });
    return
  }
};

export const acceptInvitationController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { groupId, notificationId } = req.body;

  if (!userId || !groupId || !notificationId) {
     res.status(400).json({ message: 'Eksik parametreler' });
    return;
  }

  try {
    const pool = await poolPromise;

    // Kullanıcıyı gruba ekle
    await pool.request()
      .input('GroupID', sql.Int, groupId)
      .input('UserID', sql.Int, userId)
      .query(`INSERT INTO GroupMembers (GroupID, UserID) VALUES (@GroupID, @UserID)`);

    // Bildirimi sil
    await pool.request()
      .input('NotificationID', sql.Int, notificationId)
      .query(`DELETE FROM Notifications WHERE NotificationID = @NotificationID`);

    // Davet durumunu güncelle
    await pool.request()
      .input('GroupID', sql.Int, groupId)
      .input('UserID', sql.Int, userId)
      .query(`UPDATE GroupInvitations SET Status = 'Accepted' WHERE GroupID = @GroupID AND UserID = @UserID`);

    res.json({ message: 'Davet kabul edildi ve kullanıcı gruba eklendi' });
  } catch (error) {
    console.error('Davet kabul etme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

export const ignoreInvitationController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { groupId, notificationId } = req.body;

  if (!userId || !notificationId || !groupId) {
    res.status(400).json({ message: 'Eksik parametreler' });
    return;
  }

  try {
    const pool = await poolPromise;

    // Bildirimi tamamen sil
    await pool.request()
      .input('NotificationID', sql.Int, notificationId)
      .query(`DELETE FROM Notifications WHERE NotificationID = @NotificationID`);

    // Daveti reddet (Status = 'Rejected' olarak güncelle)
    await pool.request()
      .input('GroupID', sql.Int, groupId)
      .input('UserID', sql.Int, userId)
      .query(`UPDATE GroupInvitations SET Status = 'Rejected' WHERE GroupID = @GroupID AND UserID = @UserID`);

    res.json({ message: 'Davet reddedildi' });
  } catch (error) {
    console.error('Davet reddetme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
