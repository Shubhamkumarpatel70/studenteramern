const mongoose = require("mongoose");

const EmailTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  tokenHash: {
    type: String,
    required: false,
    index: true,
  },
  otp: {
    type: String,
    required: false,
    index: true,
  },
  type: {
    type: String,
    enum: ["registration", "forgot_password", "verification"],
    default: "verification",
    index: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.EmailToken || mongoose.model("EmailToken", EmailTokenSchema);
