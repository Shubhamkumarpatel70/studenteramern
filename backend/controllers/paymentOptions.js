const PaymentOption = require('../models/PaymentOption');

// @desc    Get all payment options
// @route   GET /api/payment-options
// @access  Public
exports.getPaymentOptions = async (req, res) => {
  try {
    const options = await PaymentOption.find();
    res.status(200).json({ success: true, data: options });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create a payment option
// @route   POST /api/payment-options
// @access  Private/Admin
exports.createPaymentOption = async (req, res) => {
  try {
    const option = await PaymentOption.create(req.body);
    res.status(201).json({ success: true, data: option });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update a payment option
// @route   PUT /api/payment-options/:id
// @access  Private/Admin
exports.updatePaymentOption = async (req, res) => {
  try {
    const option = await PaymentOption.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!option) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: option });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete a payment option
// @route   DELETE /api/payment-options/:id
// @access  Private/Admin
exports.deletePaymentOption = async (req, res) => {
  try {
    const option = await PaymentOption.findByIdAndDelete(req.params.id);
    if (!option) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}; 