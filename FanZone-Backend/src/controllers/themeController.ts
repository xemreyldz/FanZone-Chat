import { Request, RequestHandler, Response } from 'express';
import sql from 'mssql';
import { poolPromise } from "../db/mssql";

export const updateUserMode: RequestHandler = async (req, res) => {
  const userId = Number(req.params.userId);
  const { mode } = req.body;

  if (mode !== 'dark' && mode !== 'light') {
    res.status(400).json({ error: 'Geçersiz tema modu değeri' });
    return;
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('mode', sql.NVarChar(10), mode)
      .input('userId', sql.Int, userId)
      .query('UPDATE Users SET ThemeMode = @mode WHERE UserID = @userId');

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ error: 'Kullanıcı bulunamadı' });
      return;
    }

    res.json({ message: 'Tema modu başarıyla güncellendi' });
  } catch (error) {
    console.error('DB hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

export const getUserMode: RequestHandler = async (req, res) => {
  const userId = Number(req.params.userId);

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT ThemeMode FROM Users WHERE UserID = @userId');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Kullanıcı bulunamadı' });
      return;  
    }

    res.json({ mode: result.recordset[0].ThemeMode });
  } catch (error) {
    console.error('DB hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }

};
