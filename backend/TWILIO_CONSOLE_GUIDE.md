# Twilio Console Navigation Guide

## What You're Looking At

You're in the **Twilio Console Dashboard**. Here's what each section means:

### 1. **Account Dashboard** (Top Header)
- This is your main dashboard
- Shows account overview, balance, and quick stats

### 2. **Develop Tab** (Currently Active - Left Tab)
- This is where you configure services
- Contains all development tools and settings

### 3. **Monitor Tab** (Right Tab)
- View logs, messages, calls
- Monitor usage and performance
- Check for errors

---

## Step-by-Step: Getting Your WhatsApp Number

### Step 1: Get Your Account Credentials

**From the Dashboard:**
1. Look at the **top right** of the dashboard
2. You'll see:
   - **Account SID** (starts with `AC...`) - Copy this
   - **Auth Token** - Click "View" to reveal it - Copy this

**Alternative Location:**
- Click on your **Account Name** (top right)
- Go to **Settings** → **General**
- Find **Account SID** and **Auth Token**

### Step 2: Get Your WhatsApp Number

**Option A: WhatsApp Sandbox (For Testing)**

1. In the sidebar, click on **"Messaging"** (under Develop tab)
2. Look for **"Try it out"** section
3. Click **"Send a WhatsApp message"**
4. You'll see:
   - A WhatsApp sandbox number (e.g., `+1 415 523 8886`)
   - A join code (e.g., `join <code>`)
5. **Copy the WhatsApp number** (the one that starts with `+1`)

**To Join Sandbox (For Testing):**
- Send a WhatsApp message to that number with the join code
- Example: Send `join <code>` to `+1 415 523 8886`
- Once joined, you can test sending messages to your own number

**Option B: Production WhatsApp Number**

1. Click **"Messaging"** in the sidebar
2. Go to **"Settings"** → **"WhatsApp Senders"**
3. Click **"Request WhatsApp Sender"**
4. Fill out the form and submit
5. Once approved (1-3 days), you'll get a production number

---

## Step 3: Configure Your Application

### Update `backend/config/config.env`:

```env
# Twilio WhatsApp Settings
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```

**Important:**
- Replace with your actual values
- Remove the `#` comment symbol
- For sandbox: Use the sandbox number (e.g., `+14155238886`)
- For production: Use your approved WhatsApp number

---

## Navigation Path Summary

### To Get Account SID & Auth Token:
```
Dashboard → Top Right (Account Info)
OR
Dashboard → Account Name → Settings → General
```

### To Get WhatsApp Number (Sandbox):
```
Sidebar → Messaging → Try it out → Send a WhatsApp message
```

### To Request Production WhatsApp:
```
Sidebar → Messaging → Settings → WhatsApp Senders → Request WhatsApp Sender
```

### To View Message Logs:
```
Sidebar → Monitor → Logs → Messaging
```

### To Check Usage/Billing:
```
Sidebar → Monitor → Usage
OR
Dashboard → Top Right → Billing
```

---

## Quick Checklist

- [ ] Found Account SID (starts with `AC...`)
- [ ] Found Auth Token (clicked "View" to reveal)
- [ ] Found WhatsApp Number (from Messaging → Try it out)
- [ ] Added all three to `backend/config/config.env`
- [ ] Uncommented the variables (removed `#`)
- [ ] Installed Twilio: `npm install twilio`
- [ ] Restarted server

---

## What Each Sidebar Item Does

1. **Phone Numbers** - Manage phone numbers for SMS/Voice
2. **Messaging** ⭐ - **This is where you get WhatsApp settings**
3. **Voice** - Voice call settings
4. **Email** - Email API settings
5. **Verify** - Two-factor authentication service
6. **Flex** - Contact center platform
7. **Video** - Video API settings
8. **Marketplace** - Third-party integrations

---

## Next Steps After Configuration

1. **Test the Setup:**
   ```bash
   # Restart your server
   npm start
   ```

2. **Register a Test User:**
   - Use a mobile number that has joined the sandbox (for testing)
   - Check server logs for success message

3. **Check Twilio Logs:**
   - Go to **Monitor** → **Logs** → **Messaging**
   - See if messages were sent successfully

4. **Monitor Costs:**
   - Go to **Monitor** → **Usage**
   - Set up billing alerts

---

## Troubleshooting

### "Can't find WhatsApp number"
- Make sure you're in **Messaging** → **Try it out**
- Look for "Send a WhatsApp message" section
- The number will be shown there

### "Account SID not found"
- Look at the **top of the dashboard**
- It's usually displayed prominently
- Or go to **Settings** → **General**

### "Auth Token is hidden"
- Click the **"View"** button next to Auth Token
- It will reveal the token
- Copy it immediately (it hides again)

---

## Visual Guide

```
┌─────────────────────────────────┐
│  Account Dashboard              │
├─────────────────────────────────┤
│  [Develop]  Monitor             │
├─────────────────────────────────┤
│  → Phone Numbers                 │
│  → Messaging ⭐ (Click here!)    │
│  → Voice                         │
│  → Email                         │
│  → Verify                        │
│  → Flex                          │
│  → Video                         │
│  → Marketplace                   │
└─────────────────────────────────┘
```

**Click "Messaging" to get your WhatsApp number!**

