// sendEmail.js
const nodemailer = require('nodemailer');

const SENSITIVE_ENV_VARS = ['EMAIL_USER', 'SMTP_PASS', 'GMAIL_CLIENT_ID', 'GMAIL_CLIENT_SECRET'];

// Mask a value for logs
function mask(val) {
  if (!val) return 'not-set';
  if (val.length <= 6) return '******';
  return `${val.slice(0, 3)}***${val.slice(-3)}`;
}

function isTransientError(code) {
  // common transient/connectivity errors
  return ['ETIMEDOUT', 'ECONNRESET', 'EAI_AGAIN', 'ENOTFOUND', 'ECONNREFUSED', 'ENETUNREACH'].includes(code);
}

/**
 * options: { email, subject, message, html }
 */
const sendEmail = async (options) => {
  console.log('Attempting to send email...');

  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const envPort = process.env.EMAIL_PORT;
  const parsedPort = envPort ? parseInt(envPort, 10) : undefined;
  // Prefer explicit env port, otherwise try typical ports (465 then 587 then 2525)
  const tryPorts = parsedPort ? [parsedPort] : [465, 587, 2525];

  const user = process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('Missing EMAIL_USER or SMTP_PASS (app password / smtp credential) in environment');
  }

  console.log(
    `Email config (masked): host=${host}, ports=[${tryPorts.join(',')}], user=${mask(user)}`
  );

  const fromAddress =
    process.env.FROM_EMAIL || process.env.SMTP_USER || `noreply@${process.env.HOSTNAME || 'localhost'}`;
  const fromName = process.env.FROM_NAME || 'Student Era';

  const message = {
    from: `${fromName} <${fromAddress}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    ...(options.html ? { html: options.html } : {}),
  };

  console.log(`Sending email to: ${options.email}, Subject: ${options.subject}`);

  // We'll attempt up to 3 send attempts (including re-creating transporter), with backoff for transient errors
  const maxSendAttempts = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxSendAttempts; attempt++) {
    const port = tryPorts[Math.min(attempt - 1, tryPorts.length - 1)];
    const secure = port === 465; // 465 = SMTPS, 587/2525 = STARTTLS (secure: false + requireTLS)
    const transporterConfig = {
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      tls: { minVersion: 'TLSv1.2' },
      pool: false,
      requireTLS: port !== 465, // use STARTTLS on non-465 ports
    };

    // do not log transporterConfig.auth.pass; only indicate present
    console.log(`Attempt #${attempt}: creating transporter (port=${port}, secure=${secure})`);

    const transporter = nodemailer.createTransport(transporterConfig);

    // verify connection/auth before sending (gives earlier, clearer errors)
    try {
      await transporter.verify();
      console.log(`Transporter verify OK (port=${port}). Proceeding to send...`);
    } catch (verifyErr) {
      // If verify fails, log details and decide whether to retry
      console.error(`Transporter verify failed (port=${port})`);
      console.error('verifyErr.code=', verifyErr && verifyErr.code);
      console.error('verifyErr.response=', verifyErr && verifyErr.response);
      console.error('verifyErr.message=', verifyErr && verifyErr.message);

      lastError = verifyErr;
      if (isTransientError(verifyErr && verifyErr.code) && attempt < maxSendAttempts) {
        const backoffMs = 500 * attempt;
        console.log(`Transient verify error; retrying after ${backoffMs}ms...`);
        await new Promise((res) => setTimeout(res, backoffMs));
        continue; // try next port/attempt
      }

      // Non-transient verify failure: throw a helpful error
      throw new Error(
        `Email transporter verification failed (code=${verifyErr && verifyErr.code}). ` +
        `Check network (outbound SMTP ports) and credentials. Original: ${verifyErr && verifyErr.message}`
      );
    }

    // send the mail
    try {
      const info = await transporter.sendMail(message);
      console.log('Message sent: %s', info.messageId);
      console.log('Email sent successfully.');
      return info;
    } catch (sendErr) {
      // capture error details (don't log secrets)
      console.error(`sendMail failed on attempt #${attempt} (port=${port})`);
      console.error('sendErr.code=', sendErr && sendErr.code);
      console.error('sendErr.response=', sendErr && sendErr.response);
      console.error('sendErr.responseCode=', sendErr && sendErr.responseCode);
      console.error('sendErr.message=', sendErr && sendErr.message);
      lastError = sendErr;

      if (isTransientError(sendErr && sendErr.code) && attempt < maxSendAttempts) {
        const backoffMs = 500 * attempt;
        console.log(`Transient send error; retrying after ${backoffMs}ms...`);
        await new Promise((res) => setTimeout(res, backoffMs));
        continue;
      }

      // If not transient or we've exhausted attempts, break and raise
      break;
    }
  } // end attempts loop

  // If we reach here, everything failed
  // Throw a helpful error that encourages checking network/host blocking
  const debugMsg = lastError
    ? `Last error code=${lastError.code || 'N/A'} message=${lastError.message || 'N/A'} response=${lastError.response || 'N/A'}`
    : 'Unknown failure';

  console.error('All send attempts failed. ' + debugMsg);

  // If it's clearly a connection timeout, include a specific hint
  if (lastError && lastError.code === 'ETIMEDOUT') {
    throw new Error(
      `Failed to connect to SMTP host (${host}). ETIMEDOUT. Likely cause: outbound SMTP ports blocked by hosting provider. ` +
      `Try using an email-sending API (SendGrid/Mailgun/SES/Postmark) or an SMTP relay on port 2525. ${debugMsg}`
    );
  }

  // Generic failure
  throw new Error(`Failed to send email. ${debugMsg}`);
};

module.exports = sendEmail;
