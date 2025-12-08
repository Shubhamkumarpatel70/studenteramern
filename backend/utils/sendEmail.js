const nodemailer = require("nodemailer");

// Retry function with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const waitTime = delay * Math.pow(2, i);
      console.log(`Email send attempt ${i + 1} failed, retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

const sendEmail = async (options) => {
  console.log("Attempting to send email...");

  // Check for alternative email services first
  // Resend API (recommended for production on cloud platforms)
  if (process.env.RESEND_API_KEY) {
    try {
      let resend;
      try {
        resend = require('resend');
      } catch (e) {
        console.log("Resend package not installed. Install with: npm install resend");
      }
      
      if (resend) {
        const resendClient = new resend.Resend(process.env.RESEND_API_KEY);
        
        const result = await resendClient.emails.send({
          from: process.env.FROM_EMAIL || process.env.EMAIL_USER || 'onboarding@resend.dev',
          to: options.email,
          subject: options.subject,
          html: options.html,
          text: options.message,
        });
        
        console.log("Email sent via Resend:", result.id || result.data?.id);
        return result;
      }
    } catch (error) {
      console.error("Resend email error:", error.message);
      // Fall through to SMTP
    }
  }

  // SendGrid API
  if (process.env.SENDGRID_API_KEY) {
    try {
      let sgMail;
      try {
        sgMail = require('@sendgrid/mail');
      } catch (e) {
        console.log("SendGrid package not installed. Install with: npm install @sendgrid/mail");
      }
      
      if (sgMail) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const msg = {
          to: options.email,
          from: process.env.FROM_EMAIL || process.env.EMAIL_USER || 'noreply@studentera.live',
          subject: options.subject,
          text: options.message,
          html: options.html,
        };
        
        const result = await sgMail.send(msg);
        console.log("Email sent via SendGrid");
        return result;
      }
    } catch (error) {
      console.error("SendGrid email error:", error.message);
      // Fall through to SMTP
    }
  }

  // Fallback to SMTP
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const user = process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.EMAIL_PORT) || 587;
  const secure = port === 465;

  if (!user || !pass) {
    throw new Error(
      "Missing EMAIL_USER or SMTP_PASS in environment variables. Consider using RESEND_API_KEY or SENDGRID_API_KEY for better reliability."
    );
  }

  console.log(
    `Email config: host=${host}, port=${port}, secure=${secure}, user=${
      user ? "set" : "not set"
    }`
  );

  // Try SMTP with Gmail-optimized configuration
  let lastError;
  
  // Try multiple Gmail configurations for better compatibility
  const gmailConfigs = host.includes('gmail.com') ? [
    // Configuration 1: Standard Gmail SMTP with TLS
    {
      service: 'gmail', // Use service name instead of host for better compatibility
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2',
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    },
    // Configuration 2: Direct host connection (fallback)
    {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2',
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      requireTLS: true,
    },
    // Configuration 3: SSL port (alternative)
    {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2',
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    },
  ] : [
    // Non-Gmail configuration
    {
      host: host,
      port: port,
      secure: secure,
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2',
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      requireTLS: !secure,
    },
  ];

  for (const config of gmailConfigs) {
    try {
      const transporter = nodemailer.createTransport(config);

      // Send email directly without verification (verification often times out on cloud platforms)
      // Use retry logic for sending
      const info = await retryWithBackoff(async () => {
        return await transporter.sendMail({
          from: process.env.FROM_NAME ? `${process.env.FROM_NAME} <${user}>` : user,
          to: options.email,
          subject: options.subject,
          text: options.message,
          html: options.html,
        });
      }, 2, 3000); // 2 retries with 3s, 6s delays

      console.log("Message sent: %s", info.messageId);
      console.log(`Email sent successfully via SMTP (${config.service || config.host}).`);
      return info;
    } catch (error) {
      console.error(`SMTP config failed (${config.service || config.host}:${config.port}):`, error.message);
      lastError = error;
      continue; // Try next configuration
    }
  }

  // If SMTP failed, throw error with helpful message
  if (lastError) {
    console.error("All email sending methods failed");
    console.error("Last error details:", {
      message: lastError.message,
      code: lastError.code,
      command: lastError.command,
      response: lastError.response,
      responseCode: lastError.responseCode,
    });
    
    // Provide more specific error messages
    let errorMessage = "Failed to send email";
    if (lastError.code === "EAUTH") {
      errorMessage = "Email authentication failed. Please check your email credentials.";
    } else if (lastError.code === "ECONNECTION" || lastError.code === "ETIMEDOUT") {
      errorMessage = "Could not connect to email server. Gmail SMTP often blocks cloud platforms like Render. For reliable email delivery, please configure RESEND_API_KEY (recommended) or SENDGRID_API_KEY. See: https://resend.com or https://sendgrid.com";
    } else if (lastError.message && lastError.message.includes("Invalid login")) {
      errorMessage = "Invalid email credentials. Please contact support.";
    } else if (lastError.message) {
      errorMessage = lastError.message;
    }
    
    throw new Error(errorMessage);
  }
  
  throw new Error("Email sending failed - no configuration available");
};

module.exports = sendEmail;
