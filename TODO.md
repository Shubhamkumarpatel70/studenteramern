# TODO: Implement Cloudinary Storage for Certificates and Offer Letters

## Tasks

- [x] Modify backend/controllers/certificates.js: Add Cloudinary upload for generateCertificate and generateSelfCertificate functions
- [x] Modify backend/controllers/offerLetters.js: Add Cloudinary upload for generateOfferLetter function
- [x] Update delete functions in both controllers to remove from Cloudinary
- [x] Test certificate and offer letter generation to verify Cloudinary URLs are stored
- [x] Verify delete functionality removes files from Cloudinary
- [x] Fix email OTP not working in production by making SMTP host configurable

## Status

- All tasks completed successfully
- PDFs are now stored in Cloudinary collections (certificates and offerLetters)
- Files are publicly accessible without authentication
- URLs are properly formatted for PDF viewing
- Delete functionality removes files from both database and Cloudinary
- Email OTP now works in production with configurable SMTP settings
