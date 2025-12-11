/**
 * Send WhatsApp message using Twilio WhatsApp API
 * @param {string} to - Recipient phone number (with country code, e.g., +919876543210)
 * @param {string} message - Message to send
 * @returns {Promise} - Twilio message result
 */

const sendWhatsApp = async (to, message) => {
  try {
    // Check if Twilio is configured - support both TWILIO_WHATSAPP_NUMBER and TWILIO_WHATSAPP_FROM
    const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || process.env.TWILIO_WHATSAPP_FROM;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    // Debug: Log what we have (without exposing sensitive data)
    if (!accountSid || !authToken || !whatsappNumber) {
      console.warn('⚠️  Twilio WhatsApp configuration check:');
      console.warn(`  TWILIO_ACCOUNT_SID: ${accountSid ? '✅ SET' : '❌ NOT SET'}`);
      console.warn(`  TWILIO_AUTH_TOKEN: ${authToken ? '✅ SET' : '❌ NOT SET'}`);
      console.warn(`  TWILIO_WHATSAPP_NUMBER: ${whatsappNumber ? '✅ SET' : '❌ NOT SET'}`);
      console.warn('');
      console.warn('📝 To fix this, add the following to: backend/config/config.env');
      console.warn('   TWILIO_ACCOUNT_SID=your_account_sid');
      console.warn('   TWILIO_AUTH_TOKEN=your_auth_token');
      console.warn('   TWILIO_WHATSAPP_NUMBER=+14155238886');
      console.warn('');
      console.warn('⚠️  After adding the variables, RESTART your server!');
      throw new Error('WhatsApp service not configured');
    }

    // Try to require Twilio
    let twilio;
    try {
      twilio = require('twilio');
    } catch (e) {
      console.error('Twilio package not installed. Install with: npm install twilio');
      throw new Error('Twilio package not installed');
    }

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // Format WhatsApp sender number (ensure it has whatsapp: prefix)
    let fromNumber = whatsappNumber.trim();
    if (!fromNumber.startsWith('whatsapp:')) {
      // If it doesn't have whatsapp: prefix, add it
      if (!fromNumber.startsWith('+')) {
        fromNumber = `+${fromNumber}`;
      }
      fromNumber = `whatsapp:${fromNumber}`;
    }

    // Format recipient phone number (ensure it starts with +)
    let formattedNumber = to.trim();
    if (!formattedNumber.startsWith('+')) {
      // If no country code, assume India (+91)
      if (formattedNumber.length === 10) {
        formattedNumber = `+91${formattedNumber}`;
      } else {
        formattedNumber = `+${formattedNumber}`;
      }
    }

    // Send WhatsApp message
    const result = await client.messages.create({
      from: fromNumber, // Twilio WhatsApp number (with whatsapp: prefix)
      to: `whatsapp:${formattedNumber}`,
      body: message
    });

    console.log(`WhatsApp message sent successfully to ${formattedNumber}. SID: ${result.sid}`);
    return result;
  } catch (error) {
    console.error('WhatsApp send error:', error.message);
    throw error;
  }
};

module.exports = sendWhatsApp;

