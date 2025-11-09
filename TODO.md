# TODO: Implement Cloudinary Storage for Certificates and Offer Letters

## Tasks

- [x] Modify backend/controllers/certificates.js: Add Cloudinary upload for generateCertificate and generateSelfCertificate functions
- [x] Modify backend/controllers/offerLetters.js: Add Cloudinary upload for generateOfferLetter function
- [x] Update delete functions in both controllers to remove from Cloudinary
- [x] Test certificate and offer letter generation to verify Cloudinary URLs are stored
- [x] Verify delete functionality removes files from Cloudinary
- [x] Fix Cloudinary access issues by adding type: "upload" parameter

## Status

- Implementation completed
- Access control fixed with type: "upload" parameter
- Ready for testing
