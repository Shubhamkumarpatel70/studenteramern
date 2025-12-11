const express = require('express');
const { generateCaptcha, verifyCaptcha } = require('../controllers/captcha');

const router = express.Router();

router.get('/generate', generateCaptcha);
router.post('/verify', verifyCaptcha);

module.exports = router;

