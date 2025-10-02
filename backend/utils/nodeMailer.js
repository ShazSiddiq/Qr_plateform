import nodemailer from 'nodemailer';

const sendMail = async (emails, subject, mailContent) => {
  const { ZEPTOMAIL_USER, ZEPTOMAIL_PASS ,MAIL_NAME ,MAIL_EMAIL} = process.env;
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.zeptomail.in', 
    port: 465,
    secure: true, 
    auth: {
      user: ZEPTOMAIL_USER, 
      pass: ZEPTOMAIL_PASS, 
    },
  });
  const mailOptions = {
    from: `"${MAIL_NAME}" <${MAIL_EMAIL}>`,
    to: emails,
    subject: subject,
    html: mailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email with Zoho:', error);
    return false;
  }
};

export default sendMail;
