# WhatsApp OTP Setup Guide

This guide explains how to set up WhatsApp OTP functionality using Twilio WhatsApp API.

## Prerequisites

1. A Twilio account (sign up at https://www.twilio.com)
2. A verified WhatsApp Business number from Twilio
3. Node.js backend with Twilio package installed

## Step 1: Install Twilio Package

```bash
npm install twilio
```

Or if you want it as an optional dependency (recommended):

```bash
npm install --save-optional twilio
```

## Step 2: Get Twilio Credentials

1. Log in to your Twilio Console: https://console.twilio.com
2. Navigate to **Account** → **API Keys & Tokens**
3. Copy your **Account SID** and **Auth Token**
4. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
5. Copy your WhatsApp sender number (format: `whatsapp:+14155238886`)

## Step 3: Configure Environment Variables

Add the following to your `.env` file:

```env
# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```

**Important Notes:**
- Replace `your_account_sid_here` with your actual Account SID
- Replace `your_auth_token_here` with your actual Auth Token
- Replace `+14155238886` with your Twilio WhatsApp number (with country code)
- You can use just the number (e.g., `+14155238886`) or with `whatsapp:` prefix (e.g., `whatsapp:+14155238886`)
- The system will automatically add the `whatsapp:` prefix if it's missing

## Step 4: Test WhatsApp OTP

1. Start your backend server
2. Register a new user with a valid mobile number (include country code, e.g., +919876543210)
3. The OTP will be sent to the user's WhatsApp number
4. If WhatsApp fails, the system will automatically fallback to email

## How It Works

### Registration Flow

1. User registers with name, email, password, and mobile number
2. System generates a 6-digit OTP
3. OTP is sent via WhatsApp to the user's mobile number
4. If WhatsApp fails, system automatically falls back to email
5. User receives OTP and enters it to verify account
6. Once verified, `isVerified` is set to `true`

### Resend OTP Flow

1. User requests to resend OTP
2. System generates a new OTP
3. OTP is sent via WhatsApp (preferred) or email (fallback)
4. User receives the new OTP

## Phone Number Format

The system automatically formats phone numbers:
- If number starts with `+`, it uses it as-is
- If number is 10 digits, it assumes India (+91) and adds the country code
- Example: `9876543210` becomes `+919876543210`

## Fallback Mechanism

If WhatsApp fails to send (e.g., Twilio not configured, network issues), the system automatically:
1. Logs the error
2. Falls back to email OTP
3. Sends OTP via email using the existing email service

## Troubleshooting

### Error: "WhatsApp service not configured"
- Check that all three environment variables are set in `.env`:
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_WHATSAPP_NUMBER` (or `TWILIO_WHATSAPP_FROM` for backward compatibility)
- Restart your server after adding environment variables

### Error: "Twilio package not installed"
- Run: `npm install twilio`
- Or: `npm install --save-optional twilio`

### Error: "Invalid phone number"
- Ensure phone numbers include country code (e.g., +91 for India)
- Check that the number is in E.164 format

### WhatsApp messages not received
- Verify your Twilio WhatsApp number is active
- Check Twilio Console for message logs and errors
- Ensure the recipient number has opted in to receive WhatsApp messages (for production)
- In sandbox mode, you can only send to pre-approved numbers

## Twilio Sandbox vs Production

### Sandbox Mode (Free Trial)
- Limited to pre-approved numbers
- Good for testing
- No cost for testing

### Production Mode
- Requires WhatsApp Business API approval
- Can send to any verified number
- Pay-per-message pricing
- Requires business verification

## Cost Considerations

- Twilio offers a free trial with credits
- WhatsApp messages are charged per message
- Check Twilio pricing: https://www.twilio.com/pricing

## Security Notes

- Never commit `.env` file to version control
- Keep your Auth Token secret
- Use environment variables for all sensitive data
- OTPs expire after 10 minutes
- OTPs are hashed in the database (similar to passwords)

## Support

For Twilio-specific issues:
- Twilio Documentation: https://www.twilio.com/docs/whatsapp
- Twilio Support: https://support.twilio.com

For application-specific issues:
- Check server logs for detailed error messages
- Verify all environment variables are set correctly

