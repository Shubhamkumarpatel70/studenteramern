const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  console.log("Attempting to send email...");
  // Build transporter with Gmail-specific optimizations for production
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass)
    throw new Error("Missing EMAIL_USER or SMTP_PASS (app password)");
  console.log(
    `Email config: host=${host}, port=${port}, user=${user ? "set" : "not set"}`
  );

  const transporterConfig = {
    host: host,
    port: port,
    secure: true, // SSL
    auth: { user, pass },
    // recommended production timeouts
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    // avoid overly permissive TLS in prod
    tls: { minVersion: "TLSv1.2" },
    // disable pooling to debug; re-enable only after you confirm working
    pool: false,
  };

  const transporter = nodemailer.createTransport(transporterConfig);

  const fromAddress =
    process.env.FROM_EMAIL ||
    process.env.SMTP_USER ||
    `noreply@${process.env.HOSTNAME || "localhost"}`;
  const fromName = process.env.FROM_NAME || "Student Era";

  const message = {
    from: `${fromName} <${fromAddress}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    ...(options.html ? { html: options.html } : {}),
  };

  console.log(
    `Sending email to: ${options.email}, Subject: ${options.subject}`
  );

  // This will throw if sending fails; let callers handle the error so we can inform the user
  try {
    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
    console.log("Email sent successfully.");
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;