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

// module.exports = { sendEmailSMTP };

// // Create a transporter using SMTP
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "your@gmail.com", // Replace with your Gmail address
//     pass: "your_password", // Replace with your Gmail password or an application-specific password
//   },
// });

// // Set up email data
// const mailOptions = {
//   from: "your@gmail.com", // Sender address
//   to: "recipient@example.com", // List of recipients
//   subject: "Test Email", // Subject line
//   text: "Hello, this is a test email!", // Plain text body
//   html: "<p>Hello, this is a <strong>test</strong> email!</p>", // HTML body
// };

// // Send the email
// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.error("Error:", error.message);
//   } else {
//     console.log("Email sent:", info.response);
//   }
// });
