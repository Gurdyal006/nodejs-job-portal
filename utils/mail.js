import nodemailer from "nodemailer";

export const sendEmailSMTP = async ({ to, subject, text, message, from }) => {
  // create transporter object with smtp server details
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // send email
  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html: message,
  });
};
