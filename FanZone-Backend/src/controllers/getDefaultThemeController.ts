import { Request, Response } from 'express';
import { poolPromise } from '../db/mssql';
import { AuthenticatedRequest } from '../middleware/authenticateToken';

export const getDefaultTheme = async (req: Request, res: Response) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .query(`
        SELECT TOP 1 TeamID, Name, PrimaryColor, SecondaryColor, ThemeLightUrl, ThemeDarkUrl, IsDefaultTheme
        FROM Teams
        WHERE IsDefaultTheme = 1
        ORDER BY TeamID 
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ message: 'Varsayılan tema bulunamadı.' });
      return;
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Varsayılan tema alma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

export const getTeamTheme = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const teamId = req.user?.teamId;
    if (!teamId) {
      res.status(400).json({ message: 'Kullanıcının takım ID bilgisi yok.' });
      return;
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('teamId', teamId)
      .query(`
        SELECT TOP 1 TeamID, Name, PrimaryColor, SecondaryColor, ThemeLightUrl, ThemeDarkUrl, IsDefaultTheme
        FROM Teams
        WHERE TeamID = @teamId AND IsDefaultTheme = 0
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ message: 'Takım teması bulunamadı.' });
      return;
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Takım teması alma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
