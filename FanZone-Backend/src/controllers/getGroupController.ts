import { Request, Response } from 'express';
import { poolPromise } from '../db/mssql';


export const getGroups = async (req:Request, res:Response) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT GroupID, GroupName,Description, GroupImageUrl FROM Groups');

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: 'Veri çekme hatası' });
  }
};
