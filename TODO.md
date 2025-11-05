# Testing Plan for Registration and OTP Verification Flow

## Information Gathered

- **Backend**: `auth.js` handles registration, OTP verification, and resend endpoints. OTP emails are sent asynchronously.
- **Frontend**: `Register.js` for registration form, `OTPVerify.js` for OTP input, `AuthContext.js` for authentication state.
- **Email**: `sendEmail.js` handles email sending with nodemailer.
- **API**: `api.js` configures axios with interceptors for auth tokens.
- **Flow**: Register → Navigate to OTP page → Enter OTP → Verify → Success/Login

## Plan

### Backend API Testing

- [ ] Test registration endpoint with valid data
- [ ] Test registration with duplicate email
- [ ] Test OTP verification with correct OTP
- [ ] Test OTP verification with incorrect OTP
- [ ] Test OTP verification with expired OTP
- [ ] Test resend OTP functionality

### Frontend Flow Testing

- [ ] Test registration form submission and navigation to OTP page
- [ ] Test OTP page display with email parameter
- [ ] Test OTP input and submission
- [ ] Test resend button functionality
- [ ] Test success modal and navigation to login
- [ ] Test error handling for invalid OTP

### Integration Testing

- [ ] Test complete flow: Register → OTP → Verify → Login
- [ ] Test resend flow when email fails
- [ ] Test token persistence and auth context updates

## Dependent Files to be edited

None - this is testing only. Any issues found will be addressed in subsequent updates.

## Followup steps

- [ ] Document any bugs or issues found
- [ ] Fix identified issues if any
- [ ] Re-test after fixes
- [ ] Confirm deployment readiness
