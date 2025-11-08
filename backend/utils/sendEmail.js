const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  console.log("Attempting to send email...");

  const user = process.env.EMAIL_USER; // Use EMAIL_USER from .env
  const pass = process.env.SMTP_PASS; // Use SMTP_PASS from .env

  if (!user || !pass)
    throw new Error("Missing EMAIL_USER or SMTP_PASS in environment variables.");

  console.log(`Email config: host=smtp.gmail.com, port=587, user=${user ? "set" : "not set"}`);

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use 'true' if port is 465, 'false' for 587 with STARTTLS
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false // This is often needed for local development or specific SMTP setups
      }
    });
    const info = await transporter.sendMail({
      from: process.env.FROM_NAME ? `${process.env.FROM_NAME} <${user}>` : user,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Email sent successfully.");
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error( error.message || "Failed to send email");
  }
};

module.exports = sendEmail;