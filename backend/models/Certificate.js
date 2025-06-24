const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    candidateName: {
        type: String,
        required: true
    },
    internshipTitle: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    completionDate: {
        type: Date,
        required: true
    },
    certificateId: {
        type: String,
        required: true,
        unique: true
    },
    fileUrl: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Certificate', CertificateSchema); 