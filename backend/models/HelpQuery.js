const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  from: { type: String, enum: ['user', 'admin'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const HelpQuerySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [MessageSchema],
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HelpQuery', HelpQuerySchema); 