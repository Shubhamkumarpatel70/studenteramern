const express = require('express');
const { generateCertificate, getAllCertificates, verifyCertificate, generateSelfCertificate, getMyCertificates } = require('../controllers/certificates');
const router = express.Router();
const protect = require('../middleware/auth');
const authorize = require('../middleware/auth').authorize;

router
    .route('/')
    .post(protect, authorize('admin'), generateCertificate)
    .get(protect, authorize('admin'), getAllCertificates);

router
    .route('/my-certificates')
    .get(protect, getMyCertificates);

// Public route to verify certificate
router.get('/verify/:certificateId', verifyCertificate);

// User self-certificate generation
router.post('/generate-self', protect, generateSelfCertificate);

module.exports = router;