const mongoose = require('mongoose');

const PaymentOptionSchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  upiId: { type: String, required: true },
  qrCodeUrl: { type: String },
  instructions: { type: String }
});

// Add a static method to insert a default payment option if none exist
PaymentOptionSchema.statics.ensureDefault = async function() {
  const count = await this.countDocuments();
  if (count === 0) {
    await this.create({
      displayName: 'Default UPI',
      upiId: 'studentera@pnb',
      instructions: 'Pay using any UPI app and enter the UTR/Transaction ID.'
    });
  }
};

module.exports = mongoose.model('PaymentOption', PaymentOptionSchema); 