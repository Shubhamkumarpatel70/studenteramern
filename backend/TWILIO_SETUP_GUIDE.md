# Twilio WhatsApp Setup - Complete Step-by-Step Guide

This guide will walk you through setting up Twilio WhatsApp API for sending OTP messages to users.

## Step 1: Create a Twilio Account

1. Go to **https://www.twilio.com/try-twilio**
2. Click **"Sign up"** or **"Start Free Trial"**
3. Fill in your details:
   - Email address
   - Password
   - Full name
   - Phone number
4. Verify your email address
5. Verify your phone number (they'll send a verification code)

## Step 2: Get Your Twilio Credentials

1. After logging in, you'll see the **Twilio Console Dashboard**
2. On the dashboard, you'll see:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (click "View" to reveal it)
3. **Copy both values** - you'll need them later

   **Location:**
   - Dashboard → Account Info section
   - Or: Console → Settings → General → Account SID & Auth Token

## Step 3: Set Up WhatsApp Sandbox (For Testing)

### Option A: WhatsApp Sandbox (Free - For Testing)

1. In Twilio Console, go to **"Messaging"** → **"Try it out"** → **"Send a WhatsApp message"**
2. You'll see a WhatsApp sandbox number (e.g., `whatsapp:+14155238886`)
3. To join the sandbox, send a WhatsApp message to that number with the code shown
   - Example: Send `join <code>` to `+1 415 523 8886`
4. Once joined, you can send messages to your own WhatsApp number for testing

**Limitations:**
- Only works with numbers you've added to the sandbox
- Good for development and testing
- Free to use

### Option B: Production WhatsApp (For Real Users)

1. Go to **"Messaging"** → **"Settings"** → **"WhatsApp Senders"**
2. Click **"Request WhatsApp Sender"**
3. Fill out the form:
   - Business name
   - Business website
   - Business description
   - Use case description
4. Submit for approval (can take 1-3 business days)
5. Once approved, you'll get a production WhatsApp number

## Step 4: Install Twilio Package

Open your terminal in the `backend` folder and run:

```bash
cd backend
npm install twilio
```

Or if you want it as an optional dependency:

```bash
npm install --save-optional twilio
```

## Step 5: Configure Environment Variables

1. Open `backend/config/config.env`
2. **Uncomment** and add your Twilio credentials:

```env
# Twilio WhatsApp Settings (for OTP via WhatsApp)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```

**Important Notes:**
- Replace with your actual credentials
- For sandbox: Use the sandbox number (e.g., `+14155238886`)
- For production: Use your approved WhatsApp number
- The number should include country code with `+` (e.g., `+91` for India)

## Step 6: Restart Your Server

After adding the credentials, **restart your Node.js server**:

```bash
# Stop the server (Ctrl+C)
# Then start it again
npm start
# or
npm run dev
```

## Step 7: Test WhatsApp OTP

1. **Register a new user** with a mobile number
2. The system will:
   - Generate an OTP
   - Send it via WhatsApp to the user's mobile number
   - If WhatsApp fails, fallback to email

3. **Check the server logs** - you should see:
   ```
   WhatsApp message sent successfully to +91XXXXXXXXXX. SID: SM...
   ```

4. **Check your WhatsApp** - you should receive the OTP message

## Step 8: Verify It's Working

### Success Indicators:
✅ Server logs show: `WhatsApp message sent successfully`
✅ User receives WhatsApp message with OTP
✅ No error messages in console

### If It's Not Working:

1. **Check Environment Variables:**
   - Verify credentials are in `backend/config/config.env`
   - Make sure they're NOT commented (no `#` at the start)
   - Restart server after changes

2. **Check Twilio Console:**
   - Go to **"Monitor"** → **"Logs"** → **"Messaging"**
   - Check for any error messages
   - Verify your account has credits

3. **Check Phone Number Format:**
   - Must include country code: `+91XXXXXXXXXX`
   - No spaces or dashes
   - For sandbox: Recipient must have joined the sandbox

4. **Check Twilio Package:**
   ```bash
   npm list twilio
   ```
   If not installed, run: `npm install twilio`

## Step 9: Understanding Twilio Costs

### Free Trial:
- Twilio gives you **$15.50 free credit**
- WhatsApp messages cost approximately **$0.005 per message** (half a cent)
- You can send ~3,100 messages with free credit

### After Free Trial:
- Pay-as-you-go pricing
- WhatsApp: ~$0.005 per message
- SMS: ~$0.0075 per message

### Monitor Usage:
- Go to **Twilio Console** → **Monitor** → **Usage**
- Set up billing alerts to avoid surprises

## Step 10: Production Checklist

Before going live:

- [ ] Request and get approved for production WhatsApp number
- [ ] Update `TWILIO_WHATSAPP_NUMBER` with production number
- [ ] Test with real user numbers
- [ ] Set up billing alerts
- [ ] Monitor message delivery rates
- [ ] Have email fallback working (already implemented)

## Troubleshooting Common Issues

### Issue: "WhatsApp service not configured"
**Solution:** 
- Check `backend/config/config.env` has all three variables
- Make sure they're not commented out
- Restart server

### Issue: "Twilio package not installed"
**Solution:**
```bash
cd backend
npm install twilio
```

### Issue: "Invalid phone number"
**Solution:**
- Ensure number includes country code: `+91XXXXXXXXXX`
- No spaces, dashes, or parentheses
- For sandbox: Recipient must join sandbox first

### Issue: "Message not received"
**Solution:**
- Check Twilio Console → Logs for errors
- Verify recipient number is correct
- For sandbox: Ensure recipient joined sandbox
- Check account has credits

### Issue: "401 Unauthorized"
**Solution:**
- Verify `TWILIO_ACCOUNT_SID` is correct
- Verify `TWILIO_AUTH_TOKEN` is correct (not expired)
- Check for extra spaces in config.env

## Security Best Practices

1. **Never commit credentials to Git:**
   - `config.env` should be in `.gitignore`
   - Use environment variables in production

2. **Rotate Auth Token regularly:**
   - Twilio Console → Settings → General
   - Click "Regenerate" for Auth Token

3. **Use different credentials for dev/prod:**
   - Development: Sandbox credentials
   - Production: Production credentials

4. **Monitor usage:**
   - Set up billing alerts
   - Check logs regularly for suspicious activity

## Next Steps

1. ✅ Add your credentials to `backend/config/config.env`
2. ✅ Uncomment the Twilio variables
3. ✅ Restart your server
4. ✅ Test with a registration
5. ✅ Monitor Twilio Console for message logs

## Support Resources

- **Twilio Documentation:** https://www.twilio.com/docs/whatsapp
- **Twilio Support:** https://support.twilio.com
- **WhatsApp Business API:** https://www.twilio.com/whatsapp
- **Twilio Console:** https://console.twilio.com

---

**Quick Reference:**

```env
# Add to backend/config/config.env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```

**Remember:** Restart your server after adding these variables!

