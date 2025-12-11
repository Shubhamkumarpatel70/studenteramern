const Application = require('../models/Application');
const Internship = require('../models/Internship'); // Import Internship model
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
exports.createApplication = async (req, res, next) => {
    try {
        const { internshipId, duration, certificateName, utr, paymentScreenshot } = req.body;
        const userId = req.user.id;

        console.log('Creating application with paymentScreenshot:', paymentScreenshot);

        // 1. Fetch the internship to get authorative data (e.g., price logic)
        const internship = await Internship.findById(internshipId);
        if (!internship) {
            return res.status(404).json({ success: false, message: 'Internship not found' });
        }

        // Prevent new applications if positions are filled
        if (internship.currentRegistrations >= internship.totalPositions) {
            internship.isAccepting = false;
            await internship.save();
            return res.status(400).json({ success: false, message: 'All positions for this internship are filled.' });
        }

        // 2. Check if user has already applied and paid
        const existingApplication = await Application.findOne({ user: userId, internship: internshipId, status: 'Approved' });
        if (existingApplication) {
            return res.status(400).json({ success: false, message: 'You have already applied for this internship.' });
        }
        
        // 3. Get amount from internship registrationFee, default to 149
        const amount = internship.registrationFee || 149;

        // 4. Require paymentScreenshot
        if (!paymentScreenshot || paymentScreenshot.trim() === '') {
            return res.status(400).json({ success: false, message: 'Payment screenshot is required.' });
        }

        // 5. Create the application
        const applicationData = {
            user: userId,
            internship: internshipId,
            duration: `${duration} weeks`,
            amount, // Store the calculated amount
            transactionId: utr, // Use UTR as transactionId for now
            status: 'Applied', // Use valid enum value
            certificateName,
            utr,
            paymentScreenshot, // Cloudinary URL
            paymentOptionId: req.body.paymentOptionId
        };

        const application = await Application.create(applicationData);

        // Increment currentRegistrations and close if filled
        internship.currentRegistrations += 1;
        if (internship.currentRegistrations >= internship.totalPositions) {
            internship.isAccepting = false;
        }
        await internship.save();

        // Update user level based on number of applications
        const appCount = await Application.countDocuments({ user: userId });
        let newLevel = 'Beginner';
        if (appCount > 6) newLevel = 'Pro';
        else if (appCount > 2) newLevel = 'Intermediate';
        await User.findByIdAndUpdate(userId, { level: newLevel });

        res.status(201).json({ success: true, data: application });

    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: 'Could not create application' });
    }
};

// @desc    Get a single application by ID
// @route   GET /api/applications/:id
// @access  Private
exports.getApplicationById = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('user', 'name email')
            .populate('internship', 'title company image stipend location duration technologies description shortDescription');

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Ensure the user fetching is the one who owns the application or is an admin
        if (application.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to view this application' });
        }

        res.status(200).json({ success: true, data: application });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all applications for the logged-in user
// @route   GET /api/applications/my-applications
// @access  Private
exports.getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ user: req.user.id }).populate('internship');

        if (!applications) {
            return res.status(200).json({ success: true, count: 0, data: [] });
        }

        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private/Admin
exports.getAllApplications = async (req, res, next) => {
    try {
        const applications = await Application.find()
            .populate('user', 'name email')
            .populate('internship', 'title')
            .populate('paymentOptionId', 'displayName upiId');
            
        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update application status (Admin)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
exports.updateApplicationStatus = async (req, res, next) => {
    try {
        const { status, rejectionReason } = req.body;

        const application = await Application.findByIdAndUpdate(req.params.id, {
            status,
            rejectionReason: status === 'Rejected' ? rejectionReason : undefined
        }, {
            new: true,
            runValidators: true
        });

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Only set transactionId if approved
        if (status === 'Approved') {
            application.transactionId = `SE_txn_${Date.now()}`; // Mock a real transaction ID
        }
        await application.save();

        res.status(200).json({ success: true, data: application });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update payment received status (Admin/Accountant)
// @route   PUT /api/applications/:id/payment-received
// @access  Private/Admin/Accountant
exports.updatePaymentReceived = async (req, res, next) => {
    try {
        const { paymentReceived } = req.body;

        const application = await Application.findByIdAndUpdate(req.params.id, {
            paymentReceived
        }, {
            new: true,
            runValidators: true
        });

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        res.status(200).json({ success: true, data: application });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.uploadPaymentScreenshot = async (req, res) => {
  try {
    console.log('Received uploadPaymentScreenshot request:', {
      applicationId: req.body.applicationId,
      file: req.file ? req.file.originalname : null
    });
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    cloudinary.uploader.upload_stream(
      { folder: 'transaction_screenshots', resource_type: 'image' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary error:', error);
          return res.status(500).json({ message: 'Cloudinary error' });
        }
        if (req.body.applicationId) {
          // Update application if ID is provided
          const application = await Application.findById(req.body.applicationId);
          if (!application) {
            console.error('Application not found for ID:', req.body.applicationId);
            return res.status(404).json({ message: 'Application not found' });
          }
          application.paymentScreenshot = result.secure_url;
          await application.save();
          console.log('Payment screenshot uploaded and application updated:', result.secure_url);
        }
        // Always return the Cloudinary URL
        res.json({ url: result.secure_url });
      }
    ).end(req.file.buffer);
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
};
