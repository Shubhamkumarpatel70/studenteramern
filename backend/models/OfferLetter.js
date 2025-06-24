const mongoose = require('mongoose');

const OfferLetterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    company: {
        type: String,
        required: [true, 'Please add a company name']
    },
    issueDate: {
        type: Date,
        required: true
    },
    // In a real app, this would point to a generated PDF file
    fileUrl: {
        type: String,
        default: '/path/to/placeholder-offer-letter.pdf'
    },
    candidateName: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('OfferLetter', OfferLetterSchema); 