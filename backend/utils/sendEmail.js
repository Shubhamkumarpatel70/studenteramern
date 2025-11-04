const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Build transporter with reasonable defaults and TLS options.
    const host = process.env.EMAIL_HOST;
    const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
    const user = process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS;

    const transporterConfig = {
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: {},
        tls: {
            // Allow self-signed certs (useful for some SMTP providers); you can enable stricter checks in production
            rejectUnauthorized: false
        }
    };

    if (user && pass) {
        transporterConfig.auth = { user, pass };
    } else {
        // If no auth provided, delete the auth key
        delete transporterConfig.auth;
    }

    const transporter = nodemailer.createTransport(transporterConfig);

    const fromAddress = process.env.FROM_EMAIL || process.env.SMTP_USER || `noreply@${process.env.HOSTNAME || 'localhost'}`;
    const fromName = process.env.FROM_NAME || 'Student Era';

    const message = {
        from: `${fromName} <${fromAddress}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        ...(options.html ? { html: options.html } : {})
    };

    // This will throw if sending fails; let callers handle the error so we can inform the user
    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    return info;
};

module.exports = sendEmail;