const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || '+919027880288';

const client = new twilio(accountSid, authToken);

const sendWhatsAppOTP = async (to, otp) => {
    try {
        const message = await client.messages.create({
            from: `whatsapp:${whatsappNumber}`,
            to: `whatsapp:+91${to}`,
            body: `Your OTP for Student Era registration is: ${otp}. This OTP will expire in 10 minutes.`
        });
        console.log('WhatsApp OTP sent successfully:', message.sid);
        return { success: true, messageId: message.sid };
    } catch (error) {
        console.error('Error sending WhatsApp OTP:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendWhatsAppOTP };
