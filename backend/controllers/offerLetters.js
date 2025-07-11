const OfferLetter = require('../models/OfferLetter');
const generateOfferLetterPDF = require('../utils/generateOfferLetterPDF');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

exports.generateOfferLetter = async (req, res, next) => {
    try {
        // Support using internId (student ID) as well as ObjectId for user
        let userId = req.body.user;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            // Try to find user by internId
            const User = require('../models/User');
            const userDoc = await User.findOne({ internId: userId });
            if (!userDoc) {
                return res.status(400).json({ success: false, message: 'User not found for given Student ID or User ID.' });
            }
            userId = userDoc._id;
            req.body.user = userId;
            // Optionally auto-fill candidateName and internId if not provided
            if (!req.body.candidateName) req.body.candidateName = userDoc.name;
            if (!req.body.internId) req.body.internId = userDoc.internId;
        }
        // Optionally, fetch user name for candidateName if not provided
        if (!req.body.candidateName && req.body.user) {
            const User = require('../models/User');
            const userDoc = await User.findById(req.body.user);
            req.body.candidateName = userDoc ? userDoc.name : 'Candidate';
        }

        const { user, candidateName, internId, title, company, issueDate, startDate, techPartner, stipend, hrName } = req.body;
        const offerLetter = new OfferLetter({
            user,
            candidateName,
            internId,
            title,
            company,
            issueDate,
            startDate,
            techPartner,
            stipend,
            hrName
        });

        // Generate PDF
        const pdfDir = path.join(__dirname, '../uploads/offerLetters');
        if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
        const pdfPath = path.join(pdfDir, `${offerLetter._id}.pdf`);
        await generateOfferLetterPDF({ ...offerLetter.toObject(), candidateName }, pdfPath);

        // Update fileUrl (absolute URL)
        offerLetter.fileUrl = `https://studenteramernbackend.onrender.com/uploads/offerLetters/${offerLetter._id}.pdf`;
        await offerLetter.save();

        res.status(201).json({ success: true, data: offerLetter });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all offer letters for the logged-in user
// @route   GET /api/offer-letters/my-offer-letters
// @access  Private
exports.getMyOfferLetters = async (req, res, next) => {
    try {
        const offerLetters = await OfferLetter.find({ user: req.user.id }).populate('user', 'name');
        res.status(200).json({ success: true, count: offerLetters.length, data: offerLetters });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all offer letters (Admin)
// @route   GET /api/offer-letters
// @access  Private/Admin
exports.getAllOfferLetters = async (req, res, next) => {
    try {
        const offerLetters = await OfferLetter.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: offerLetters.length, data: offerLetters });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get offer letter by ID (Admin)
// @route   GET /api/offer-letters/:id
// @access  Private/Admin
exports.getOfferLetterById = async (req, res) => {
    try {
        const offerLetter = await OfferLetter.findById(req.params.id);
        if (!offerLetter) {
            return res.status(404).json({ success: false, message: 'Offer letter not found' });
        }
        res.status(200).json({ success: true, data: offerLetter });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete offer letter by ID (Admin)
// @route   DELETE /api/offer-letters/:id
// @access  Private/Admin
exports.deleteOfferLetter = async (req, res) => {
    try {
        const offerLetter = await OfferLetter.findById(req.params.id);
        if (!offerLetter) {
            return res.status(404).json({ success: false, message: 'Offer letter not found' });
        }
        // Delete PDF file if exists
        if (offerLetter.fileUrl) {
            const filePath = path.join(__dirname, '../uploads/offerLetters', `${offerLetter._id}.pdf`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        await offerLetter.deleteOne();
        res.status(200).json({ success: true, message: 'Offer letter deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}; 