const express = require('express');
const { getPaymentOptions, createPaymentOption, updatePaymentOption, deletePaymentOption } = require('../controllers/paymentOptions');
const protect = require('../middleware/auth');
const authorize = require('../middleware/auth').authorize;

const router = express.Router();

router.get('/', getPaymentOptions);
router.post('/', protect, authorize('admin'), createPaymentOption);
router.put('/:id', protect, authorize('admin'), updatePaymentOption);
router.delete('/:id', protect, authorize('admin'), deletePaymentOption);

module.exports = router; 