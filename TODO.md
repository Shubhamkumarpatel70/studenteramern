# Fix User Register Flow in Production

## Issue

- In localhost, user registration works perfectly: data stores in DB and navigates to OTP page
- In production, registration was timing out with "timeout of 60000ms exceeded" error

## Root Cause

- Email sending was blocking the registration response, causing timeouts in production
- SMTP email sending can take longer than the default 60-second timeout
- React Router's `navigate()` function may not work reliably in production environments

## Solution Implemented

1. **Made email sending asynchronous**: Changed from `await sendEmailToUser()` to `sendEmailToUser().catch()` so registration responds immediately
2. **Reduced frontend timeout**: Changed API timeout from 60 seconds to 30 seconds for faster error feedback
3. **Fixed navigation**: Changed from React Router `navigate()` to `window.location.href` for production reliability

## Files Modified

- `backend/controllers/auth.js`: Made email sending asynchronous in both register and resendOtp functions
- `frontend/src/config/api.js`: Reduced timeout from 60000ms to 30000ms
- `frontend/src/pages/Register.js`: Changed navigation method to window.location.href
- `TODO.md`: Updated with fix details

## Testing Required

- Deploy the changes to production
- Test the complete registration flow: user fills form → data saves to DB → navigates to OTP page → OTP verification works
- Verify no regressions in localhost functionality

## Status

- [x] Identified the timeout issue
- [x] Implemented asynchronous email sending
- [x] Reduced frontend timeout
- [x] Fixed navigation issue
- [ ] Deployed and tested in production (pending)
