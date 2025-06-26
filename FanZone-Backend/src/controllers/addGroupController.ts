import { Response } from "express";
import { poolPromise } from "../db/mssql";
import path from "path";
import fs from "fs";
import { AuthenticatedRequest } from "../middleware/authenticateToken";  // authenticateToken'dan import et

export const createGroup = async (req: AuthenticatedRequest, res: Response) => {
  console.log("POST /addgroup endpoint hit");
  const { name, description } = req.body;
  const image = req.file;

  let imageUrl: string | null = null;

  try {
    if (image) {
      const uploadPath = path.join(__dirname, "..", "public", "groupImage");
      const filename = `${Date.now()}_${image.originalname}`;
      const fullPath = path.join(uploadPath, filename);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      fs.writeFileSync(fullPath, image.buffer);
      imageUrl = `/groupImage/${filename}`;
    }

    const pool = await poolPromise;

    const userId = req.user?.id;
    const teamId = req.user?.teamId || null;


    
// ❗ Aynı isimde grup var mı kontrolü
const checkGroupResult = await pool
  .request()
  .input("GroupName", name)
  .query(`
    SELECT GroupID FROM Groups WHERE GroupName = @GroupName
  `);

if (checkGroupResult.recordset.length > 0) {
  res.status(400).json({ error: "Bu grup adı zaten kullanılıyor." });
  return;
}




    // Grup ekleme, ve Inserted GroupID'yi alma
    const result = await pool
      .request()
      .input("GroupName", name)
      .input("Description", description)
      .input("GroupImageUrl", imageUrl)
      .input("TeamID", teamId)
      .input("UserID", userId)
      .query(`
        INSERT INTO Groups (GroupName, Description, GroupImageUrl, TeamID, UserID)
        OUTPUT INSERTED.GroupID
        VALUES (@GroupName, @Description, @GroupImageUrl, @TeamID, @UserID)
      `);

    const newGroupId = result.recordset[0].GroupID;

    // Grup üyeliği ekle
    await pool
      .request()
      .input("GroupID", newGroupId)
      .input("UserID", userId)
      .input("Role", 'admin') // burası eklendi
      .query(`
        INSERT INTO GroupMembers (GroupID, UserID,Role)
        VALUES (@GroupID, @UserID,@Role)
      `);

    res.status(201).json({ message: "Grup başarıyla oluşturuldu.", groupId: newGroupId });
  } catch (error) {
    console.error("❌ Grup ekleme hatası:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
