const SocialLink = require('../models/SocialLink');

// @desc    Get all social links
// @route   GET /api/social-links
// @access  Public (for active links) / Private (for admin)
exports.getSocialLinks = async (req, res, next) => {
    try {
        // If admin, return all links; otherwise, return only active links
        const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'co-admin');
        const query = isAdmin ? {} : { isActive: true };
        
        const links = await SocialLink.find(query).sort({ createdAt: 1 });
        
        res.status(200).json({
            success: true,
            count: links.length,
            data: links
        });
    } catch (err) {
        console.error('Get social links error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get single social link
// @route   GET /api/social-links/:id
// @access  Private/Admin
exports.getSocialLink = async (req, res, next) => {
    try {
        const link = await SocialLink.findById(req.params.id);
        
        if (!link) {
            return res.status(404).json({
                success: false,
                message: 'Social link not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: link
        });
    } catch (err) {
        console.error('Get social link error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Create or update social link
// @route   POST /api/social-links
// @route   PUT /api/social-links/:id
// @access  Private/Admin
exports.createOrUpdateSocialLink = async (req, res, next) => {
    try {
        const { platform, url, isActive } = req.body;
        
        if (!platform || !url) {
            return res.status(400).json({
                success: false,
                message: 'Please provide platform and URL'
            });
        }
        
        if (!['whatsapp', 'instagram', 'linkedin'].includes(platform)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid platform. Must be whatsapp, instagram, or linkedin'
            });
        }
        
        // Validate URL format
        try {
            new URL(url);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Invalid URL format'
            });
        }
        
        // Check if link exists for this platform
        const existingLink = await SocialLink.findOne({ platform });
        
        let link;
        if (existingLink) {
            // Update existing link
            existingLink.url = url;
            existingLink.isActive = isActive !== undefined ? isActive : false;
            link = await existingLink.save();
        } else {
            // Create new link
            link = await SocialLink.create({
                platform,
                url,
                isActive: isActive !== undefined ? isActive : false
            });
        }
        
        res.status(200).json({
            success: true,
            data: link
        });
    } catch (err) {
        console.error('Create/Update social link error:', err);
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Social link for this platform already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Update social link status
// @route   PATCH /api/social-links/:id/status
// @access  Private/Admin
exports.updateSocialLinkStatus = async (req, res, next) => {
    try {
        const { isActive } = req.body;
        
        const link = await SocialLink.findById(req.params.id);
        
        if (!link) {
            return res.status(404).json({
                success: false,
                message: 'Social link not found'
            });
        }
        
        link.isActive = isActive !== undefined ? isActive : false;
        await link.save();
        
        res.status(200).json({
            success: true,
            data: link
        });
    } catch (err) {
        console.error('Update social link status error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Delete social link
// @route   DELETE /api/social-links/:id
// @access  Private/Admin
exports.deleteSocialLink = async (req, res, next) => {
    try {
        const link = await SocialLink.findById(req.params.id);
        
        if (!link) {
            return res.status(404).json({
                success: false,
                message: 'Social link not found'
            });
        }
        
        await link.deleteOne();
        
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error('Delete social link error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

