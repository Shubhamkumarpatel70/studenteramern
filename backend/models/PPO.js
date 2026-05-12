const mongoose = require('mongoose');

const PPOSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    candidateName: {
        type: String,
        required: [true, 'Please add a candidate name']
    },
    internId: {
        type: String,
        required: false
    },
    jobTitle: {
        type: String,
        required: [true, 'Please add a job title']
    },
    department: {
        type: String,
        required: [true, 'Please add a department']
    },
    company: {
        type: String,
        default: 'Student Era'
    },
    ctc: {
        type: String,
        required: [true, 'Please add CTC details']
    },
    joiningDate: {
        type: Date,
        required: [true, 'Please add a joining date']
    },
    workLocation: {
        type: String,
        default: 'Remote / Patna Office'
    },
    probationPeriod: {
        type: String,
        default: '6 Months'
    },
    referenceNo: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    fileUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['Issued', 'Accepted', 'Rejected'],
        default: 'Issued'
    },
    hrName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PPO', PPOSchema);
