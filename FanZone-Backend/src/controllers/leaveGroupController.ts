import { Response } from 'express';
import { poolPromise } from '../db/mssql';
import { AuthenticatedRequest } from "../middleware/authenticateToken";

export const leaveGroup = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id; // authenticated user id
  const groupId = parseInt(req.params.groupId, 10);

    if (!groupId || !userId) {
     res.status(400).json({ error: 'Eksik veya geçersiz parametre' });
    return
    }

  try {
    const pool = await poolPromise;

    // Kullanıcının rolünü al
    const roleResult = await pool.request()
      .input('GroupID', groupId)
      .input('UserID', userId)
      .query(`
        SELECT Role FROM GroupMembers WHERE GroupID = @GroupID AND UserID = @UserID
      `);

    if (roleResult.recordset.length === 0) {
      res.status(404).json({ error: 'Kullanıcı bu grubun üyesi değil' });
      return 
    }

    const role = roleResult.recordset[0].Role;

    if (role === 'admin') {
      // Eğer admin ise önce başka admin atamamız gerek
      const otherMemberResult = await pool.request()
        .input('GroupID', groupId)
        .input('UserID', userId)
        .query(`
          SELECT TOP 1 UserID FROM GroupMembers 
          WHERE GroupID = @GroupID AND UserID <> @UserID
          ORDER BY JoinedAt ASC
        `);

      if (otherMemberResult.recordset.length === 0) {
  // Grup sadece adminden oluşuyorsa, önce mesajları sil
  await pool.request()
    .input('GroupID', groupId)
    .query(`DELETE FROM Messages WHERE GroupID = @GroupID`);

  // Sonra üyelikleri ve grubu sil
  await pool.request()
    .input('GroupID', groupId)
    .query(`DELETE FROM GroupMembers WHERE GroupID = @GroupID`);

  await pool.request()
    .input('GroupID', groupId)
    .query(`DELETE FROM Groups WHERE GroupID = @GroupID`);

  res.json({ message: 'Grup silindi çünkü başka üye yoktu.' });
  return;
}

      // Yeni admin atama
      const newAdminUserId = otherMemberResult.recordset[0].UserID;
      await pool.request()
        .input('GroupID', groupId)
        .input('UserID', newAdminUserId)
        .query(`
          UPDATE GroupMembers SET Role = 'admin' 
          WHERE GroupID = @GroupID AND UserID = @UserID
        `);

      // Mevcut admin üyeliği sil
      await pool.request()
        .input('GroupID', groupId)
        .input('UserID', userId)
        .query(`
          DELETE FROM GroupMembers WHERE GroupID = @GroupID AND UserID = @UserID
        `);

      // Grup tablosundaki UserID'yi yeni admin yap
      await pool.request()
        .input('GroupID', groupId)
        .input('UserID', newAdminUserId)
        .query(`
          UPDATE Groups SET UserID = @UserID WHERE GroupID = @GroupID
        `);

      res.json({ message: 'Admin değiştirildi ve kullanıcı gruptan çıkarıldı.' });
       return
    } else {
      // Normal üye ise sadece üyeliği sil
      await pool.request()
        .input('GroupID', groupId)
        .input('UserID', userId)
        .query(`
          DELETE FROM GroupMembers WHERE GroupID = @GroupID AND UserID = @UserID
        `);

      res.json({ message: 'Gruptan çıkıldı.' });
       return
    }

  } catch (error) {
    console.error('Gruptan çıkma hatası:', error);
     
    res.status(500).json({ error: 'Sunucu hatası' });
    return
  }
};
