import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authenticateToken";
import { poolPromise } from "../db/mssql";

export const getUserGroups = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Kullanıcı doğrulanamadı" });
      return;
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input("userId", userId)
      .query(`
        SELECT g.GroupID, g.GroupName,g.Description, g.GroupImageUrl 
        FROM Groups g
        INNER JOIN GroupMembers gm ON g.GroupID = gm.GroupID
        WHERE gm.UserID = @userId
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error("getUserGroupsController error:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
