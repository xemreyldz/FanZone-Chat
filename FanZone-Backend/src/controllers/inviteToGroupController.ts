import { Request, Response } from 'express';
import { poolPromise } from '../db/mssql';  
import * as sql from 'mssql';
import { AuthenticatedRequest } from '../middleware/authenticateToken';

export const inviteToGroupController = async (req: AuthenticatedRequest, res: Response) => {
  const { userId, groupId } = req.body;
const invitedByUserId = req.user?.id;

  if (!userId || !groupId) {
    res.status(400).json({ message: 'Eksik parametreler' });
    return 
  }
  if (!invitedByUserId) {
     res.status(401).json({ message: 'Yetkilendirme hatası' });
    return
  }

  try {
    const pool = await poolPromise;

    const checkMembership = await pool.request()
      .input('GroupID', sql.Int, groupId)
      .input('UserID', sql.Int, userId)
      .query('SELECT COUNT(*) as count FROM GroupMembers WHERE GroupID = @GroupID AND UserID = @UserID');

    if (checkMembership.recordset[0].count > 0) {
       res.status(400).json({ message: 'Kullanıcı zaten grupta' });
      return
    }

    const checkInvitation = await pool.request()
      .input('GroupID', sql.Int, groupId)
      .input('UserID', sql.Int, userId)
      .query(`SELECT COUNT(*) as count FROM GroupInvitations WHERE GroupID = @GroupID AND UserID = @UserID AND Status = 'Pending'`);

    if (checkInvitation.recordset[0].count > 0) {
       res.status(400).json({ message: 'Kullanıcı zaten davet edilmiş' });
      return
    }

  await pool.request()
  .input('GroupID', sql.Int, groupId)
  .input('UserID', sql.Int, userId)
  .input('InvitedByUserID', sql.Int, invitedByUserId)
  .query(`INSERT INTO GroupInvitations (GroupID, UserID, InvitedByUserID) VALUES (@GroupID, @UserID, @InvitedByUserID)`);

// ➕ Bildirim oluştur
await pool.request()
  .input('UserID', sql.Int, userId) // Bildirimi alacak kullanıcı
  .input('SenderUserID', sql.Int, invitedByUserId)
  .input('RelatedGroupID', sql.Int, groupId)
  .input('Type', sql.NVarChar, 'group_invite')
  .input('Message', sql.NVarChar, 'Sizi bir gruba davet etti.')
  .query(`
    INSERT INTO Notifications (UserID, SenderUserID, RelatedGroupID, Type, Message)
    VALUES (@UserID, @SenderUserID, @RelatedGroupID, @Type, @Message)
  `);

     res.status(200).json({ message: 'Davet gönderildi' });
    return
  } catch (error) {
    console.error('Davet gönderme hatası:', error);
     res.status(500).json({ message: 'Sunucu hatası' });
    return
  }
};
