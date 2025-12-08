# Gmail SMTP Issues & Solutions

## Common Gmail SMTP Issues on Cloud Platforms

### 1. **Connection Timeouts (ETIMEDOUT)**
**Problem:** Gmail SMTP servers often block or timeout connections from cloud hosting platforms like Render, Heroku, AWS, etc.

**Why it happens:**
- Gmail has strict security policies that block connections from unknown IP addresses
- Cloud platforms use shared IP addresses that may be flagged
- Network routing issues between cloud providers and Google's servers
- Firewall restrictions on cloud platforms

**Symptoms:**
```
Error: Connection timeout
code: 'ETIMEDOUT'
command: 'CONN'
```

### 2. **Authentication Failures**
**Problem:** Even with correct credentials, authentication may fail.

**Common causes:**
- Using regular Gmail password instead of App Password
- 2FA not enabled (required for App Passwords)
- App Password not generated correctly
- Account security restrictions

### 3. **Rate Limiting**
**Problem:** Gmail limits the number of emails you can send per day.

**Limits:**
- Free Gmail: 500 emails/day
- Google Workspace: 2000 emails/day
- Exceeding limits results in temporary blocks

## Solutions

### ✅ Solution 1: Use Gmail App Password (Required)

1. **Enable 2-Step Verification:**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Student Era Backend"
   - Copy the 16-character password (no spaces)

3. **Update Environment Variables:**
   ```
   EMAIL_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   ```

### ✅ Solution 2: Use Alternative Email Services (Recommended for Production)

**Why:** More reliable on cloud platforms, better deliverability, higher limits.

#### Option A: Resend (Recommended)
- **Free tier:** 3,000 emails/month
- **Setup:**
  1. Sign up at https://resend.com
  2. Get API key
  3. Add to environment:
     ```
     RESEND_API_KEY=re_xxxxxxxxxxxxx
     FROM_EMAIL=noreply@yourdomain.com
     ```
  4. Install: `npm install resend`

#### Option B: SendGrid
- **Free tier:** 100 emails/day
- **Setup:**
  1. Sign up at https://sendgrid.com
  2. Get API key
  3. Add to environment:
     ```
     SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
     FROM_EMAIL=noreply@yourdomain.com
     ```
  4. Install: `npm install @sendgrid/mail`

#### Option C: Mailgun
- **Free tier:** 5,000 emails/month (first 3 months)
- Similar setup process

### ✅ Solution 3: Configuration Improvements (Applied)

The code now includes:

1. **Multiple Gmail Configurations:**
   - Tries `service: 'gmail'` first (most compatible)
   - Falls back to direct host connection
   - Tries SSL port (465) as alternative

2. **Increased Timeouts:**
   - Connection: 60 seconds (was 10s)
   - Greeting: 30 seconds (was 5s)
   - Socket: 60 seconds (was 10s)

3. **Retry Logic:**
   - Automatic retries with exponential backoff
   - 2 retries with 3s and 6s delays

4. **Better TLS Configuration:**
   - Removed outdated SSLv3 cipher
   - Uses modern TLS 1.2+ with secure ciphers

### ✅ Solution 4: Network/Firewall Workarounds

If you must use Gmail SMTP:

1. **Use Port 465 (SSL) instead of 587 (TLS):**
   ```
   EMAIL_PORT=465
   ```
   - Sometimes more reliable on cloud platforms

2. **Use OAuth2 instead of App Password:**
   - More complex but more secure
   - Requires additional setup

3. **Use a VPN or Proxy:**
   - Route traffic through a different IP
   - Not recommended for production

## Testing Your Configuration

### Test SMTP Connection:
```bash
curl https://your-backend.onrender.com/api/test-smtp
```

### Check Logs:
Look for these messages:
- ✅ "Email sent successfully via SMTP"
- ✅ "Email sent via Resend"
- ❌ "Connection timeout" - indicates Gmail blocking

## Best Practices

1. **For Development:** Gmail SMTP is fine if it works
2. **For Production:** Use Resend, SendGrid, or Mailgun
3. **Always use App Passwords** (never regular passwords)
4. **Monitor email delivery** and have fallback options
5. **Set up proper FROM_EMAIL** domain for better deliverability

## Current Configuration Status

✅ **Fixed Issues:**
- Removed outdated SSLv3 cipher
- Added multiple Gmail configuration attempts
- Increased timeouts for cloud platforms
- Added retry logic
- Support for Resend and SendGrid APIs

✅ **Working Features:**
- Automatic fallback to alternative email services
- Multiple SMTP configuration attempts
- Better error messages with solutions

## Troubleshooting

### Still getting timeouts?
1. Check if App Password is correct (16 chars, no spaces)
2. Verify 2FA is enabled on Gmail account
3. Try Resend or SendGrid instead
4. Check Render logs for specific error codes

### Authentication errors?
1. Regenerate App Password
2. Ensure EMAIL_USER matches the account with App Password
3. Check if account is locked or restricted

### Rate limit errors?
1. Switch to Resend/SendGrid for higher limits
2. Implement email queuing
3. Use multiple Gmail accounts (not recommended)

## Recommended Setup for Production

```env
# Option 1: Resend (Best for most cases)
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Student Era

# Option 2: SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com

# Option 3: Gmail (if you must)
EMAIL_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

---

**Last Updated:** Based on current codebase configuration
**Status:** ✅ All known issues addressed

