const Certificate = require('../models/Certificate');
const generateCertificatePDF = require('../utils/generateCertificatePDF');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// @desc    Generate a new certificate
// @route   POST /api/certificates
// @access  Private/Admin
exports.generateCertificate = async (req, res, next) => {
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
            // Optionally auto-fill candidateName if not provided
            if (!req.body.candidateName) req.body.candidateName = userDoc.name;
        }
        const { user, candidateName, internshipTitle, duration, completionDate, certificateId, signatureName } = req.body;
        const certificate = await Certificate.create({
            user,
            candidateName,
            internshipTitle,
            duration,
            completionDate,
            certificateId,
            signatureName
        });
        // Generate PDF
        const pdfDir = path.join(__dirname, '../uploads/certificates');
        if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
        const pdfPath = path.join(pdfDir, `${certificate._id}.pdf`);
        await generateCertificatePDF({
            candidateName,
            internshipTitle,
            duration,
            completionDate,
            certificateId,
            signatureName
        }, pdfPath);
        // Update fileUrl
        certificate.fileUrl = `https://studenteramernbackend.onrender.com/uploads/certificates/${certificate._id}.pdf`;
        await certificate.save();
        res.status(201).json({ success: true, data: certificate });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all certificates (Admin)
// @route   GET /api/certificates
// @access  Private/Admin
exports.getAllCertificates = async (req, res, next) => {
    try {
        const certificates = await Certificate.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: certificates.length, data: certificates });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all certificates for the logged-in user
// @route   GET /api/certificates/my-certificates
// @access  Private
exports.getMyCertificates = async (req, res, next) => {
    try {
        const certificates = await Certificate.find({ user: req.user.id }).populate('user', 'name');
        res.status(200).json({ success: true, count: certificates.length, data: certificates });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Verify a certificate by ID
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
exports.verifyCertificate = async (req, res, next) => {
    try {
        const { certificateId } = req.params;
        let certificate;
        if (mongoose.Types.ObjectId.isValid(certificateId)) {
            certificate = await Certificate.findById(certificateId);
        }
        if (!certificate) {
            // Case-insensitive, trimmed search for certificateId
            certificate = await Certificate.findOne({ certificateId: { $regex: `^${certificateId.trim()}$`, $options: 'i' } });
        }
        if (!certificate) {
            return res.status(404).json({ success: false, valid: false, message: 'Certificate not found.' });
        }
        res.status(200).json({ success: true, valid: true, data: {
            name: certificate.candidateName,
            internshipTitle: certificate.internshipTitle,
            duration: certificate.duration,
            completionDate: certificate.completionDate,
            certificateId: certificate.certificateId,
        }});
    } catch (err) {
        res.status(400).json({ success: false, valid: false, message: 'Invalid certificate ID.' });
    }
};

// @desc    User generates their own certificate for a completed internship
// @route   POST /api/certificates/generate-self
// @access  Private
exports.generateSelfCertificate = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { internshipId } = req.body;
        if (!internshipId) {
            return res.status(400).json({ success: false, message: 'Internship ID is required.' });
        }
        // Get user and internship details
        const AssignedTask = require('../models/AssignedTask');
        const Internship = require('../models/Internship');
        const User = require('../models/User');
        const user = await User.findById(userId);
        const internship = await Internship.findById(internshipId);
        if (!user || !internship) {
            return res.status(404).json({ success: false, message: 'User or Internship not found.' });
        }
        // Check if certificate already exists
        const existing = await Certificate.findOne({ user: userId, internshipTitle: internship.title });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Certificate already exists for this internship.' });
        }
        // Check if all tasks for this internship are completed
        const tasks = await AssignedTask.find({ user: userId, internship: internshipId });
        if (!tasks.length || tasks.some(t => t.status !== 'completed')) {
            return res.status(400).json({ success: false, message: 'You must complete all tasks for this internship.' });
        }
        // Create certificate
        const certificateId = `${internshipId}-${userId}`;
        const certificate = await Certificate.create({
            user: userId,
            candidateName: user.name,
            internshipTitle: internship.title,
            duration: internship.duration,
            completionDate: new Date(),
            certificateId
        });
        // Generate PDF
        const pdfDir = require('path').join(__dirname, '../uploads/certificates');
        if (!require('fs').existsSync(pdfDir)) require('fs').mkdirSync(pdfDir, { recursive: true });
        const pdfPath = require('path').join(pdfDir, `${certificate._id}.pdf`);
        await generateCertificatePDF(certificate.toObject(), pdfPath);
        certificate.fileUrl = `https://studenteramernbackend.onrender.com/uploads/certificates/${certificate._id}.pdf`;
        await certificate.save();
        res.status(201).json({ success: true, data: certificate });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete a certificate by ID
// @route   DELETE /api/certificates/:id
// @access  Private/Admin
exports.deleteCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findById(req.params.id);
        if (!certificate) {
            return res.status(404).json({ success: false, message: 'Certificate not found' });
        }
        // Remove PDF file if exists
        if (certificate.fileUrl) {
            const fileName = certificate.fileUrl.split('/').pop();
            const filePath = require('path').join(__dirname, '../uploads/certificates', fileName);
            const fs = require('fs');
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        await certificate.deleteOne();
        res.status(200).json({ success: true, message: 'Certificate deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};