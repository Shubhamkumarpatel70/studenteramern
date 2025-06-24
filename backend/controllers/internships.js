const Internship = require('../models/Internship');

// @desc    Create new internship
// @route   POST /api/internships
// @access  Private/Admin
exports.createInternship = async (req, res, next) => {
    try {
        const internship = await Internship.create(req.body);
        res.status(201).json({
            success: true,
            data: internship
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: 'Could not create internship' });
    }
};

// @desc    Get all public internships
// @route   GET /api/internships/public
// @access  Public
exports.getPublicInternships = async (req, res, next) => {
    try {
        const internships = await Internship.find({ isAccepting: true }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: internships.length,
            data: internships
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get a single public internship by ID
// @route   GET /api/internships/public/:id
// @access  Public
exports.getPublicInternshipById = async (req, res, next) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship || !internship.isAccepting) {
            return res.status(404).json({ success: false, message: 'Internship not found or not accepting applications' });
        }
        
        res.status(200).json({
            success: true,
            data: internship
        });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
             return res.status(404).json({ success: false, message: 'Internship not found' });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all internships (Admin)
// @route   GET /api/internships
// @access  Private/Admin
exports.getInternships = async (req, res, next) => {
    try {
        const internships = await Internship.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: internships.length,
            data: internships
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private/Admin
exports.updateInternship = async (req, res, next) => {
    try {
        let internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ success: false, message: 'Internship not found' });
        }

        internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: internship });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: 'Could not update internship' });
    }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private/Admin
exports.deleteInternship = async (req, res, next) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ success: false, message: 'Internship not found' });
        }

        await internship.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};