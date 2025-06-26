import { Request, Response } from 'express';

export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
     res.status(400).json({ error: 'Dosya yüklenmedi' });
     return
  }

  const filePath = `/uploads/${req.file.filename}`;
  res.json({ filePath }); // frontend'e gönderilecek path
};
