const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  console.log("Attempting to send email...");

  const user = process.env.EMAIL_USER; // Use EMAIL_USER from .env
  const pass = process.env.SMTP_PASS; // Use SMTP_PASS from .env
  const port = parseInt(process.env.EMAIL_PORT) || 587; // Use EMAIL_PORT from env, default 587
  const secure = port === 465; // For Gmail: 465 uses SSL (secure=true), 587 uses STARTTLS (secure=false)

  if (!user || !pass)
    throw new Error(
      "Missing EMAIL_USER or SMTP_PASS in environment variables."
    );

  console.log(
    `Email config: host=smtp.gmail.com, port=${port}, secure=${secure}, user=${
      user ? "set" : "not set"
    }`
  );

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.in",
      port: port,
      secure: secure, // Dynamically set based on port
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production", // Only allow in production for security
      },
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
    throw new Error(error.message || "Failed to send email");
  }
};

module.exports = sendEmail;
