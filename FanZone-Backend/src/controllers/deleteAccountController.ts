import { Request, Response } from 'express';
import { poolPromise } from '../db/mssql';
import { AuthenticatedRequest } from '../middleware/authenticateToken';
import sql from 'mssql';

export const deleteAccountController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Kullanıcı doğrulanamadı.' });
      return;
    }

    const pool = await poolPromise;
    const transaction = pool.transaction();

    try {
      await transaction.begin();

      // Kullanıcının sahip olduğu tüm grupları getir
      const groupsResult = await transaction.request()
        .input('userId', sql.Int, userId)
        .query(`SELECT GroupID FROM Groups WHERE UserID = @userId`);
      
      const groups = groupsResult.recordset;

      for (const group of groups) {
        const groupId = group.GroupID;

        // Grup üyeleri (admin hariç) alalım
        const otherMembersResult = await transaction.request()
          .input('GroupID', sql.Int, groupId)
          .input('UserID', sql.Int, userId)
          .query(`
            SELECT TOP 1 UserID FROM GroupMembers 
            WHERE GroupID = @GroupID AND UserID <> @UserID
            ORDER BY JoinedAt ASC
          `);

        if (otherMembersResult.recordset.length === 0) {
          // Grup sadece silinen kullanıcıdan ibaret, mesajları ve üyelikleri temizle
          await transaction.request()
            .input('GroupID', sql.Int, groupId)
            .query(`DELETE FROM Messages WHERE GroupID = @GroupID`);
          await transaction.request()
            .input('GroupID', sql.Int, groupId)
            .query(`DELETE FROM GroupMembers WHERE GroupID = @GroupID`);
          await transaction.request()
            .input('GroupID', sql.Int, groupId)
            .query(`DELETE FROM Groups WHERE GroupID = @GroupID`);
        } else {
          // Yeni admin ataması yap
          const newAdminUserId = otherMembersResult.recordset[0].UserID;

          await transaction.request()
            .input('GroupID', sql.Int, groupId)
            .input('UserID', sql.Int, newAdminUserId)
            .query(`
              UPDATE GroupMembers SET Role = 'admin'
              WHERE GroupID = @GroupID AND UserID = @UserID
            `);

          // Grup tablosundaki UserID'yi yeni admin yap
          await transaction.request()
            .input('GroupID', sql.Int, groupId)
            .input('UserID', sql.Int, newAdminUserId)
            .query(`UPDATE Groups SET UserID = @UserID WHERE GroupID = @GroupID`);
        }
      }

      // Kullanıcıya ait mesajları sil
      await transaction.request()
        .input('userId', sql.Int, userId)
        .query(`DELETE FROM Messages WHERE UserID = @userId`);

      // Kullanıcının grup üyeliklerini sil
      await transaction.request()
        .input('userId', sql.Int, userId)
        .query(`DELETE FROM GroupMembers WHERE UserID = @userId`);

      // Son olarak kullanıcıyı sil
      await transaction.request()
        .input('userId', sql.Int, userId)
        .query(`DELETE FROM Users WHERE UserID = @userId`);

      await transaction.commit();

      res.json({ message: 'Hesap başarıyla silindi ve grup adminliği devredildi.' });
      return;

    } catch (error) {
      await transaction.rollback();
      console.error('⛔ Silme sırasında hata:', error);
      res.status(500).json({ message: 'Hesap silinirken hata oluştu.' });
      return;
    }

  } catch (error) {
    console.error('⛔ Sunucu hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
    return;
  }
};
