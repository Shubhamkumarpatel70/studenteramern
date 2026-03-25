const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  internship: {
    type: mongoose.Schema.ObjectId,
    ref: "Internship",
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Applied",
      "Under Review",
      "Interviewing",
      "Offered",
      "Rejected",
      "Approved",
    ],
    default: "Applied",
  },
  duration: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: false,
  },
  rejectionReason: {
    type: String,
  },
  dateApplied: {
    type: Date,
    default: Date.now,
  },
  certificateName: {
    type: String,
    required: true,
  },
  utr: {
    type: String,
    required: false,
  },
  paymentScreenshot: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    default: 149,
  },
  paymentReceived: {
    type: Boolean,
    default: false,
  },
  paymentOptionId: {
    type: mongoose.Schema.ObjectId,
    ref: "PaymentOption",
  },
  refundUtr: {
    type: String,
    required: false,
  },
  refundStatus: {
    type: String,
    enum: ["Not Initiated", "Processing", "Completed"],
    default: "Not Initiated",
  },
  refundDate: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model("Application", ApplicationSchema);
