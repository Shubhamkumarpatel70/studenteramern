const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  console.log("Attempting to send email...");

  const host = process.env.EMAIL_HOST || "smtp.gmail.com"; // Use EMAIL_HOST from .env, default Gmail
  const user = process.env.EMAIL_USER; // Use EMAIL_USER from .env
  const pass = process.env.SMTP_PASS; // Use SMTP_PASS from .env
  const port = parseInt(process.env.EMAIL_PORT) || 587; // Use EMAIL_PORT from env, default 587
  const secure = port === 465; // For Gmail: 465 uses SSL (secure=true), 587 uses STARTTLS (secure=false)

  if (!user || !pass)
    throw new Error(
      "Missing EMAIL_USER or SMTP_PASS in environment variables."
    );

  console.log(
    `Email config: host=${host}, port=${port}, secure=${secure}, user=${
      user ? "set" : "not set"
    }`
  );

  try {
    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: secure, // Dynamically set based on port
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates for better compatibility
        minVersion: 'TLSv1.2',
      },
      connectionTimeout: 10000, // 10 seconds timeout
      greetingTimeout: 5000, // 5 seconds greeting timeout
      socketTimeout: 10000, // 10 seconds socket timeout
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
    console.error("Email error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });
    
    // Provide more specific error messages
    let errorMessage = "Failed to send email";
    if (error.code === "EAUTH") {
      errorMessage = "Email authentication failed. Please check your email credentials.";
    } else if (error.code === "ECONNECTION" || error.code === "ETIMEDOUT") {
      errorMessage = "Could not connect to email server. Please try again later.";
    } else if (error.message && error.message.includes("Invalid login")) {
      errorMessage = "Invalid email credentials. Please contact support.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

module.exports = sendEmail;
