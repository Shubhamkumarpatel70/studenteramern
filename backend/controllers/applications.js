const Application = require('../models/Application');
const Internship = require('../models/Internship'); // Import Internship model

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
exports.createApplication = async (req, res, next) => {
    try {
        const { internshipId, duration, certificateName, utr } = req.body;
        const userId = req.user.id;

        // 1. Fetch the internship to get authorative data (e.g., price logic)
        const internship = await Internship.findById(internshipId);
        if (!internship) {
            return res.status(404).json({ success: false, message: 'Internship not found' });
        }

        // 2. Check if user has already applied and paid
        const existingApplication = await Application.findOne({ user: userId, internship: internshipId, status: 'Approved' });
        if (existingApplication) {
            return res.status(400).json({ success: false, message: 'You have already applied for this internship.' });
        }
        
        // 3. Calculate amount on the backend
        const amount = parseInt(duration, 10) * 500; // Example fee logic

        // 4. Create the application
        const applicationData = {
            user: userId,
            internship: internshipId,
            duration: `${duration} weeks`,
            amount, // Store the calculated amount
            transactionId: utr, // Use UTR as transactionId for now
            status: 'Applied', // Use valid enum value
            certificateName,
            utr,
            paymentScreenshot: req.file ? req.file.path.replace(/\\/g, "/") : undefined
        };

        const application = await Application.create(applicationData);
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
            .populate('internship', 'title');
            
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

        // Here you would integrate with a real payment gateway.
        // For now, we'll just confirm the payment and update the status.
        application.status = 'Approved';
        application.transactionId = `txn_${Date.now()}`; // Mock a real transaction ID
        await application.save();

        res.status(200).json({ success: true, data: application });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}; 