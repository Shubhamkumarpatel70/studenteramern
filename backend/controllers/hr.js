const HR = require('../models/HR');

// @desc    Get all HRs
// @route   GET /api/hr
// @access  Private/Admin
exports.getAllHRs = async (req, res, next) => {
    try {
        const hrs = await HR.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: hrs.length,
            data: hrs
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get HR by ID
// @route   GET /api/hr/:id
// @access  Private/Admin
exports.getHRById = async (req, res, next) => {
    try {
        const hr = await HR.findById(req.params.id);
        if (!hr) {
            return res.status(404).json({
                success: false,
                message: 'HR not found'
            });
        }
        res.status(200).json({ success: true, data: hr });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get HR by internship category
// @route   GET /api/hr/category/:category
// @access  Private/Admin
exports.getHRByCategory = async (req, res, next) => {
    try {
        const category = req.params.category;
        const hr = await HR.findOne({ 
            internshipCategory: { $regex: new RegExp(category, 'i') },
            isActive: true
        });
        
        if (!hr) {
            return res.status(404).json({
                success: false,
                message: 'HR not found for this category'
            });
        }
        
        res.status(200).json({ success: true, data: hr });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create HR
// @route   POST /api/hr
// @access  Private/Admin
exports.createHR = async (req, res, next) => {
    try {
        const hr = await HR.create(req.body);
        res.status(201).json({ success: true, data: hr });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update HR
// @route   PUT /api/hr/:id
// @access  Private/Admin
exports.updateHR = async (req, res, next) => {
    try {
        let hr = await HR.findById(req.params.id);
        
        if (!hr) {
            return res.status(404).json({
                success: false,
                message: 'HR not found'
            });
        }
        
        hr = await HR.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({ success: true, data: hr });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: 'Could not update HR' });
    }
};

// @desc    Delete HR
// @route   DELETE /api/hr/:id
// @access  Private/Admin
exports.deleteHR = async (req, res, next) => {
    try {
        const hr = await HR.findById(req.params.id);
        
        if (!hr) {
            return res.status(404).json({
                success: false,
                message: 'HR not found'
            });
        }
        
        await hr.deleteOne();
        
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

