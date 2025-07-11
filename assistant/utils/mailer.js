import nodemailer from 'nodemailer';

export const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: process.env.MAILTRAP_SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true', 
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `HelpHive <${process.env.MAILTRAP_SMTP_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
    };

    const info=await transporter.sendMail(mailOptions);
    console.log('Email sent successfully',info.id);
    return info;
  } catch (error) {
    console.error('❌❌❌Error sending email:', error);
    throw new Error('Error sending email');
  }
}