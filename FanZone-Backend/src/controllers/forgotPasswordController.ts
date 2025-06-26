import { Request, RequestHandler, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import sql from "mssql";
import { poolPromise } from "../db/mssql";
import transporter from "../utils/mailer";

export const requestPasswordReset: RequestHandler = async (req, res) => {
  const { email } = req.body;
  const token = uuidv4();
  const expiry = new Date(Date.now() + 1000 * 60 *60* 24);

  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM Users WHERE Email = @email");

    if (result.recordset.length === 0) {
      res.status(404).json({ message: "Email bulunamadı" });
      return;
    }

    await pool
      .request()
      .input("token", sql.NVarChar, token)
      .input("expiry", sql.DateTime2, expiry)
      .input("email", sql.NVarChar, email)
      .query(`
        UPDATE Users
        SET ResetToken = @token, ResetTokenExpiry = @expiry
        WHERE Email = @email
      `);

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    // Mail gönderme işlemi
    const mailOptions = {
      from: '"FanZone Destek" <senin-email@gmail.com>',
      to: email,
      subject: 'Şifre Sıfırlama Talebi',
      html: `
        <p>Şifre sıfırlama talebinde bulundunuz. Şifrenizi yenilemek için aşağıdaki linke tıklayın:</p>
        <a href="${resetLink}">Şifreyi Sıfırla</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Şifre sıfırlama bağlantısı e-postaya gönderildi." });
  } catch (err) {
    console.error("Şifre sıfırlama hatası:", err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};