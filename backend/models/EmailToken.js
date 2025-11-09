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
    required: true,
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
