const sendEmail = require("./sendEmail");

// Alternative email providers configuration
const emailProviders = {
  gmail: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
  },
  zoho: {
    host: "smtp.zoho.in",
    port: 587,
    secure: false,
  },
  outlook: {
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
  },
  // Add more providers as needed
};

// Function to test email configuration
const testEmailConfig = async (provider = "gmail") => {
  const config = emailProviders[provider];
  if (!config) {
    throw new Error(`Unknown email provider: ${provider}`);
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      "Missing EMAIL_USER or SMTP_PASS in environment variables."
    );
  }

  // Temporarily override env vars for testing
  const originalHost = process.env.EMAIL_HOST;
  const originalPort = process.env.EMAIL_PORT;

  process.env.EMAIL_HOST = config.host;
  process.env.EMAIL_PORT = config.port;

  try {
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user, pass },
      tls: { rejectUnauthorized: process.env.NODE_ENV === "production" },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
    });

    await transporter.verify();
    return { success: true, provider, message: "SMTP connection successful" };
  } catch (error) {
    return { success: false, provider, error: error.message };
  } finally {
    // Restore original env vars
    process.env.EMAIL_HOST = originalHost;
    process.env.EMAIL_PORT = originalPort;
  }
};

// Function to send email with fallback providers
const sendEmailWithFallback = async (
  options,
  providers = ["gmail", "zoho", "outlook"]
) => {
  let lastError;

  for (const provider of providers) {
    try {
      const config = emailProviders[provider];
      if (!config) continue;

      // Temporarily set env vars
      const originalHost = process.env.EMAIL_HOST;
      const originalPort = process.env.EMAIL_PORT;

      process.env.EMAIL_HOST = config.host;
      process.env.EMAIL_PORT = config.port;

      await sendEmail(options);

      // Restore env vars
      process.env.EMAIL_HOST = originalHost;
      process.env.EMAIL_PORT = originalPort;

      console.log(`Email sent successfully using ${provider}`);
      return { success: true, provider };
    } catch (error) {
      lastError = error;
      console.error(`Failed to send email using ${provider}:`, error.message);

      // Restore env vars on error
      process.env.EMAIL_HOST = originalHost;
      process.env.EMAIL_PORT = originalPort;
    }
  }

  throw new Error(
    `All email providers failed. Last error: ${lastError.message}`
  );
};

module.exports = {
  testEmailConfig,
  sendEmailWithFallback,
  emailProviders,
};
