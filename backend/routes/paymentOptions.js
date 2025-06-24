const express = require('express');
const { getPaymentOptions, createPaymentOption, updatePaymentOption, deletePaymentOption } = require('../controllers/paymentOptions');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getPaymentOptions);
router.post('/', protect, authorize('admin'), createPaymentOption);
router.put('/:id', protect, authorize('admin'), updatePaymentOption);
router.delete('/:id', protect, authorize('admin'), deletePaymentOption);

module.exports = router; 