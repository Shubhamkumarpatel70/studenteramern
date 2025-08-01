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
    internId: {
        type: String,
        required: false
    },
    startDate: {
        type: Date,
        required: false
    },
    techPartner: {
        type: String,
        required: false
    },
    stipend: {
        type: Number,
        required: false
    },
    hrName: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('OfferLetter', OfferLetterSchema); 