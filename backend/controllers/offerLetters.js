const OfferLetter = require("../models/OfferLetter");
const generateOfferLetterPDF = require("../utils/generateOfferLetterPDF");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");
const { getOfferLetterEmailTemplate } = require("../utils/emailTemplates");
const createNotification = require("../utils/createNotification");

exports.generateOfferLetter = async (req, res, next) => {
  try {
    // Support using internId (student ID) as well as ObjectId for user
    let userId = req.body.user;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      // Try to find user by internId
      const User = require("../models/User");
      const userDoc = await User.findOne({ internId: userId });
      if (!userDoc) {
        return res.status(400).json({
          success: false,
          message: "User not found for given Student ID or User ID.",
        });
      }
      userId = userDoc._id;
      req.body.user = userId;
      // Optionally auto-fill candidateName and internId if not provided
      if (!req.body.candidateName) req.body.candidateName = userDoc.name;
      if (!req.body.internId) req.body.internId = userDoc.internId;
    }
    // Optionally, fetch user name for candidateName if not provided
    if (!req.body.candidateName && req.body.user) {
      const User = require("../models/User");
      const userDoc = await User.findById(req.body.user);
      req.body.candidateName = userDoc ? userDoc.name : "Candidate";
    }

    const {
      user,
      candidateName,
      internId,
      title,
      company,
      issueDate,
      startDate,
      techPartner,
      stipend,
      hrName,
    } = req.body;

    // Check if offer letter already exists for same user and job title
    const existing = await OfferLetter.findOne({
      user: userId,
      title: title,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Offer letter already exists for this student and job title. Please edit the existing offer letter instead.",
      });
    }

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
      hrName,
    });

    // Generate PDF
    const pdfDir = path.join(__dirname, "../uploads/offerLetters");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
    const pdfPath = path.join(pdfDir, `${offerLetter._id}.pdf`);
    await generateOfferLetterPDF(
      { ...offerLetter.toObject(), candidateName },
      pdfPath
    );

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(pdfPath, {
      folder: "offerLetters",
      resource_type: "raw",
      public_id: `${offerLetter._id}.pdf`,
      type: "upload",
      access_mode: "public",
      use_filename: true,
      unique_filename: false,
    });

    // Update fileUrl with Cloudinary URL
    offerLetter.fileUrl = result.secure_url;
    await offerLetter.save();

    // Send email to user with offer letter
    try {
      const User = require("../models/User");
      const user = await User.findById(userId);
      if (user && user.email) {
        const emailTemplate = getOfferLetterEmailTemplate(
          user.name,
          {
            title: offerLetter.title,
            company: offerLetter.company,
            startDate: offerLetter.startDate,
          },
          result.secure_url
        );

        await sendEmail({
          email: user.email,
          subject: emailTemplate.subject,
          message: emailTemplate.text,
          html: emailTemplate.html,
        });

        console.log(`Offer letter email sent successfully to ${user.email}`);
      }
    } catch (emailError) {
      console.error("Failed to send offer letter email:", emailError);
      // Don't fail the request if email fails
    }

    // Create notification for offer letter generation
    await createNotification(
      userId,
      `Congratulations! Your offer letter for "${title}" at ${company || 'the company'} has been issued. You can view and download it from your dashboard.`
    );

    // Remove local file after upload
    fs.unlinkSync(pdfPath);

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
    const offerLetters = await OfferLetter.find({ user: req.user.id }).populate(
      "user",
      "name"
    );
    res
      .status(200)
      .json({ success: true, count: offerLetters.length, data: offerLetters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get all offer letters (Admin)
// @route   GET /api/offer-letters
// @access  Private/Admin
exports.getAllOfferLetters = async (req, res, next) => {
  try {
    const offerLetters = await OfferLetter.find().sort({ createdAt: -1 }).populate('user', 'name email internId');
    res
      .status(200)
      .json({ success: true, count: offerLetters.length, data: offerLetters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get offer letter by ID (Admin)
// @route   GET /api/offer-letters/:id
// @access  Private/Admin
exports.getOfferLetterById = async (req, res) => {
  try {
    const offerLetter = await OfferLetter.findById(req.params.id).populate('user', 'name email internId');
    if (!offerLetter) {
      return res
        .status(404)
        .json({ success: false, message: "Offer letter not found" });
    }
    res.status(200).json({ success: true, data: offerLetter });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update offer letter by ID (Admin)
// @route   PUT /api/offer-letters/:id
// @access  Private/Admin
exports.updateOfferLetter = async (req, res, next) => {
  try {
    let offerLetter = await OfferLetter.findById(req.params.id);
    if (!offerLetter) {
      return res
        .status(404)
        .json({ success: false, message: "Offer letter not found" });
    }

    // Support using internId (student ID) as well as ObjectId for user if provided
    let userId = req.body.user || offerLetter.user.toString();
    if (req.body.user && !mongoose.Types.ObjectId.isValid(req.body.user)) {
      const User = require("../models/User");
      const userDoc = await User.findOne({ internId: req.body.user });
      if (!userDoc) {
        return res.status(400).json({
          success: false,
          message: "User not found for given Student ID or User ID.",
        });
      }
      userId = userDoc._id;
    }

    const {
      candidateName,
      internId,
      title,
      company,
      issueDate,
      startDate,
      techPartner,
      stipend,
      hrName,
    } = req.body;

    // Update offer letter fields
    if (candidateName) offerLetter.candidateName = candidateName;
    if (internId) offerLetter.internId = internId;
    if (title) offerLetter.title = title;
    if (company) offerLetter.company = company;
    if (issueDate) offerLetter.issueDate = issueDate;
    if (startDate) offerLetter.startDate = startDate;
    if (techPartner) offerLetter.techPartner = techPartner;
    if (stipend !== undefined) offerLetter.stipend = stipend;
    if (hrName) offerLetter.hrName = hrName;
    if (req.body.user) offerLetter.user = userId;

    await offerLetter.save();

    // Regenerate PDF with updated data
    const pdfDir = path.join(__dirname, "../uploads/offerLetters");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
    const pdfPath = path.join(pdfDir, `${offerLetter._id}.pdf`);
    await generateOfferLetterPDF(
      { ...offerLetter.toObject(), candidateName: offerLetter.candidateName },
      pdfPath
    );

    // Upload updated PDF to Cloudinary
    const result = await cloudinary.uploader.upload(pdfPath, {
      folder: "offerLetters",
      resource_type: "raw",
      public_id: `${offerLetter._id}.pdf`,
      type: "upload",
      access_mode: "public",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    // Update fileUrl with new Cloudinary URL
    offerLetter.fileUrl = result.secure_url;
    await offerLetter.save();

    // Send email to user with updated offer letter
    try {
      const User = require("../models/User");
      const userDoc = await User.findById(offerLetter.user);
      if (userDoc && userDoc.email) {
        const emailTemplate = getOfferLetterEmailTemplate(
          userDoc.name,
          {
            title: offerLetter.title,
            company: offerLetter.company,
            startDate: offerLetter.startDate,
          },
          result.secure_url
        );

        await sendEmail({
          email: userDoc.email,
          subject: `Updated: ${emailTemplate.subject}`,
          message: emailTemplate.text,
          html: emailTemplate.html,
        });

        console.log(`Updated offer letter email sent successfully to ${userDoc.email}`);
      }
    } catch (emailError) {
      console.error("Failed to send updated offer letter email:", emailError);
    }

    // Create notification for offer letter update
    await createNotification(
      offerLetter.user,
      `Your offer letter for "${offerLetter.title}" at ${offerLetter.company || 'the company'} has been updated. You can view and download it from your dashboard.`
    );

    // Remove local file after upload
    fs.unlinkSync(pdfPath);
    res.status(200).json({ success: true, data: offerLetter });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete offer letter by ID (Admin)
// @route   DELETE /api/offer-letters/:id
// @access  Private/Admin
exports.deleteOfferLetter = async (req, res) => {
  try {
    const offerLetter = await OfferLetter.findById(req.params.id);
    if (!offerLetter) {
      return res
        .status(404)
        .json({ success: false, message: "Offer letter not found" });
    }
    // Remove PDF file from Cloudinary if exists
    if (offerLetter.fileUrl && offerLetter.fileUrl.includes("cloudinary")) {
      const publicId = `offerLetters/${offerLetter._id}.pdf`;
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
      }
    }
    await offerLetter.deleteOne();
    res.status(200).json({ success: true, message: "Offer letter deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
