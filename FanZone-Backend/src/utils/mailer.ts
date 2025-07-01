import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'emre.9.st@gmail.com',
    pass: 'jzzhuxaxazohgmgr',
  },
});

export default transporter;
