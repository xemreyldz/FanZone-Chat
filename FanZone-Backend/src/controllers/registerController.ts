// controllers/registerController.ts
import { Request, Response } from 'express';
import { poolPromise } from '../db/mssql';
import bcrypt from 'bcrypt';
import { error } from 'console';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstname, lastname, email, username, password, teamID } = req.body;
    const pool = await poolPromise;

    const existingEmail = await pool.request()
      .input('email', email)
      .query('SELECT 1 FROM Users WHERE Email = @email');

    if (existingEmail.recordset.length > 0) {
      res.status(400).json({ error: 'Bu email zaten kullanılıyor' });
      return;
    }


   const existingUsername = await pool.request()
    .input('username',username)
    .query("SELECT 1 FROM Users WHERE Username = @username");
    if (existingUsername.recordset.length>0){
      res.status(400).json({error:"Bu kullanıcı adı  zaten kullanılıyor"});
      return;
    }


    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.request()
      .input('firstname', firstname)
      .input('lastname', lastname)
      .input('email', email)
      .input('username', username)
      .input('password', hashedPassword)
      .input('teamID', teamID)
      .query(`
        INSERT INTO Users (FirstName, LastName, Email, Username, Password, TeamID)
        VALUES (@firstname, @lastname, @email, @username, @password, @teamID);
      `);

    res.status(201).json({ message: 'Kayıt başarılı!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};
