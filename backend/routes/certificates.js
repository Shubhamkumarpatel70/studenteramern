const express = require('express');
const { generateCertificate, getAllCertificates, verifyCertificate, generateSelfCertificate, getCertificateById, updateCertificate, deleteCertificate } = require('../controllers/certificates');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getMyCertificates } = require('../controllers/certificates');

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

router
    .route('/:id')
    .get(protect, authorize('admin'), getCertificateById)
    .put(protect, authorize('admin'), updateCertificate)
    .delete(protect, authorize('admin'), deleteCertificate);

module.exports = router;