/**
 * Email Templates for Student Era
 * Professional, responsive email templates
 */

const getOTPEmailTemplate = (userName, otp, expiryMinutes = 10) => {
  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'https://studentera.live';
  
  return {
    subject: "Student Era - Verify Your Email Address",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - Student Era</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa; padding: 20px 0;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0A2463 0%, #1a3d7a 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                Student Era
                            </h1>
                            <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 16px; font-weight: 400;">
                                Email Verification
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">
                                Hello ${userName}! 👋
                            </h2>
                            
                            <p style="margin: 0 0 24px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                Thank you for registering with Student Era! To complete your registration and secure your account, please verify your email address using the OTP code below.
                            </p>
                            
                            <!-- OTP Box -->
                            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px dashed #0A2463; border-radius: 12px; padding: 30px; text-align: center; margin: 32px 0;">
                                <p style="margin: 0 0 12px 0; color: #2d3748; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                                    Your Verification Code
                                </p>
                                <div style="font-size: 42px; font-weight: 700; color: #0A2463; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 16px 0;">
                                    ${otp}
                                </div>
                                <p style="margin: 12px 0 0 0; color: #718096; font-size: 13px;">
                                    Valid for ${expiryMinutes} minutes
                                </p>
                            </div>
                            
                            <!-- Security Notice -->
                            <div style="background-color: #fff5f5; border-left: 4px solid #fc8181; padding: 16px; margin: 24px 0; border-radius: 6px;">
                                <p style="margin: 0; color: #742a2a; font-size: 14px; line-height: 1.5;">
                                    <strong>🔒 Security Tip:</strong> Never share this code with anyone. Student Era staff will never ask for your OTP.
                                </p>
                            </div>
                            
                            <p style="margin: 24px 0 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                                If you didn't create an account with Student Era, please ignore this email or contact our support team.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 12px 0; color: #4a5568; font-size: 14px; font-weight: 500;">
                                Need Help?
                            </p>
                            <p style="margin: 0 0 20px 0; color: #718096; font-size: 13px; line-height: 1.6;">
                                If you're having trouble verifying your email, please contact our support team or visit our help center.
                            </p>
                            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                                    © ${new Date().getFullYear()} Student Era. All rights reserved.
                                </p>
                                <p style="margin: 8px 0 0 0; color: #a0aec0; font-size: 12px;">
                                    This is an automated email, please do not reply.
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `,
    text: `Hello ${userName}!

Thank you for registering with Student Era! To complete your registration, please use the following OTP code to verify your email address:

Your Verification Code: ${otp}

This code will expire in ${expiryMinutes} minutes.

🔒 Security Tip: Never share this code with anyone. Student Era staff will never ask for your OTP.

If you didn't create an account with Student Era, please ignore this email or contact our support team.

© ${new Date().getFullYear()} Student Era. All rights reserved.
This is an automated email, please do not reply.`
  };
};

const getOfferLetterEmailTemplate = (userName, offerLetterDetails, downloadUrl) => {
  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'https://studentera.live';
  
  return {
    subject: "Student Era - Your Offer Letter is Ready!",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offer Letter - Student Era</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa; padding: 20px 0;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0A2463 0%, #1a3d7a 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                Student Era
                            </h1>
                            <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 16px; font-weight: 400;">
                                Offer Letter
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">
                                Congratulations, ${userName}! 🎉
                            </h2>
                            
                            <p style="margin: 0 0 24px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                We're excited to inform you that your offer letter has been generated and is ready for download!
                            </p>
                            
                            ${offerLetterDetails ? `
                            <div style="background: #f0f9ff; border-left: 4px solid #0A2463; padding: 20px; margin: 24px 0; border-radius: 8px;">
                                <p style="margin: 0 0 8px 0; color: #2d3748; font-size: 14px; font-weight: 600;">Offer Details:</p>
                                <p style="margin: 4px 0; color: #4a5568; font-size: 14px;"><strong>Position:</strong> ${offerLetterDetails.title || 'N/A'}</p>
                                <p style="margin: 4px 0; color: #4a5568; font-size: 14px;"><strong>Company:</strong> ${offerLetterDetails.company || 'N/A'}</p>
                                ${offerLetterDetails.startDate ? `<p style="margin: 4px 0; color: #4a5568; font-size: 14px;"><strong>Start Date:</strong> ${new Date(offerLetterDetails.startDate).toLocaleDateString()}</p>` : ''}
                            </div>
                            ` : ''}
                            
                            <!-- Download Button -->
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="${downloadUrl}" style="background: linear-gradient(135deg, #0A2463 0%, #1a3d7a 100%); color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(10, 36, 99, 0.3);">
                                    📄 Download Offer Letter
                                </a>
                            </div>
                            
                            <p style="margin: 24px 0 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                                You can also access your offer letter anytime from your dashboard.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 12px 0; color: #4a5568; font-size: 14px; font-weight: 500;">
                                Need Help?
                            </p>
                            <p style="margin: 0 0 20px 0; color: #718096; font-size: 13px; line-height: 1.6;">
                                If you have any questions about your offer letter, please contact our support team.
                            </p>
                            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                                    © ${new Date().getFullYear()} Student Era. All rights reserved.
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `,
    text: `Congratulations, ${userName}!

We're excited to inform you that your offer letter has been generated and is ready for download!

${offerLetterDetails ? `
Offer Details:
Position: ${offerLetterDetails.title || 'N/A'}
Company: ${offerLetterDetails.company || 'N/A'}
${offerLetterDetails.startDate ? `Start Date: ${new Date(offerLetterDetails.startDate).toLocaleDateString()}` : ''}
` : ''}

Download your offer letter: ${downloadUrl}

You can also access your offer letter anytime from your dashboard.

© ${new Date().getFullYear()} Student Era. All rights reserved.`
  };
};

const getCertificateEmailTemplate = (userName, certificateDetails, downloadUrl) => {
  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'https://studentera.live';
  
  return {
    subject: "Student Era - Your Certificate is Ready!",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate - Student Era</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa; padding: 20px 0;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0A2463 0%, #1a3d7a 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                Student Era
                            </h1>
                            <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 16px; font-weight: 400;">
                                Certificate of Completion
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">
                                Congratulations, ${userName}! 🎓
                            </h2>
                            
                            <p style="margin: 0 0 24px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                We're delighted to inform you that your certificate has been generated and is ready for download!
                            </p>
                            
                            ${certificateDetails ? `
                            <div style="background: #f0f9ff; border-left: 4px solid #0A2463; padding: 20px; margin: 24px 0; border-radius: 8px;">
                                <p style="margin: 0 0 8px 0; color: #2d3748; font-size: 14px; font-weight: 600;">Certificate Details:</p>
                                <p style="margin: 4px 0; color: #4a5568; font-size: 14px;"><strong>Internship:</strong> ${certificateDetails.internshipTitle || 'N/A'}</p>
                                <p style="margin: 4px 0; color: #4a5568; font-size: 14px;"><strong>Duration:</strong> ${certificateDetails.duration || 'N/A'}</p>
                                ${certificateDetails.completionDate ? `<p style="margin: 4px 0; color: #4a5568; font-size: 14px;"><strong>Completion Date:</strong> ${new Date(certificateDetails.completionDate).toLocaleDateString()}</p>` : ''}
                                ${certificateDetails.certificateId ? `<p style="margin: 4px 0; color: #4a5568; font-size: 14px;"><strong>Certificate ID:</strong> ${certificateDetails.certificateId}</p>` : ''}
                            </div>
                            ` : ''}
                            
                            <!-- Download Button -->
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="${downloadUrl}" style="background: linear-gradient(135deg, #0A2463 0%, #1a3d7a 100%); color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(10, 36, 99, 0.3);">
                                    🏆 Download Certificate
                                </a>
                            </div>
                            
                            <p style="margin: 24px 0 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                                You can also access your certificate anytime from your dashboard. This certificate can be verified using the Certificate ID.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 12px 0; color: #4a5568; font-size: 14px; font-weight: 500;">
                                Need Help?
                            </p>
                            <p style="margin: 0 0 20px 0; color: #718096; font-size: 13px; line-height: 1.6;">
                                If you have any questions about your certificate, please contact our support team.
                            </p>
                            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                                    © ${new Date().getFullYear()} Student Era. All rights reserved.
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `,
    text: `Congratulations, ${userName}!

We're delighted to inform you that your certificate has been generated and is ready for download!

${certificateDetails ? `
Certificate Details:
Internship: ${certificateDetails.internshipTitle || 'N/A'}
Duration: ${certificateDetails.duration || 'N/A'}
${certificateDetails.completionDate ? `Completion Date: ${new Date(certificateDetails.completionDate).toLocaleDateString()}` : ''}
${certificateDetails.certificateId ? `Certificate ID: ${certificateDetails.certificateId}` : ''}
` : ''}

Download your certificate: ${downloadUrl}

You can also access your certificate anytime from your dashboard. This certificate can be verified using the Certificate ID.

© ${new Date().getFullYear()} Student Era. All rights reserved.`
  };
};

module.exports = {
  getOTPEmailTemplate,
  getOfferLetterEmailTemplate,
  getCertificateEmailTemplate
};

