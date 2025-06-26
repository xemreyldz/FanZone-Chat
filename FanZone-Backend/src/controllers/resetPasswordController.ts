import { RequestHandler } from "express";
import sql from "mssql";
import bcrypt from "bcrypt";
import { poolPromise } from "../db/mssql";

export const resetPassword: RequestHandler = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    res.status(400).json({ message: "Token ve yeni şifre gerekli" });
    return;
  }

  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("token", sql.NVarChar, token)
      .query(
        "SELECT * FROM Users WHERE ResetToken = @token AND ResetTokenExpiry > GETDATE()"
      );

    if (result.recordset.length === 0) {
      res.status(400).json({ message: "Token geçersiz veya süresi dolmuş" });
      return;
    }

    // Şifreyi hashle (örneğin 10 tur)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool
      .request()
      .input("newPassword", sql.NVarChar, hashedPassword)
      .input("token", sql.NVarChar, token)
      .query(`
        UPDATE Users
        SET Password = @newPassword, ResetToken = NULL, ResetTokenExpiry = NULL
        WHERE ResetToken = @token
      `);

    res.json({ message: "Şifre başarıyla değiştirildi" });
  } catch (err) {
    console.error("Şifre sıfırlama hatası:", err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
