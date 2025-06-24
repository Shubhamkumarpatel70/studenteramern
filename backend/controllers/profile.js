const User = require('../models/User');

// @desc    Update user profile details
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update fields from request body
        Object.assign(user, req.body);
        
        // Recalculate profile completeness
        const fields = ['name', 'profilePicture', 'tagline', 'skills', 'college'];
        let completedFields = 0;
        
        if (user.name) completedFields++;
        if (user.profilePicture && user.profilePicture !== 'default-avatar.png') completedFields++;
        if (user.tagline) completedFields++;
        if (user.skills && user.skills.length > 0) completedFields++;
        if (user.college) completedFields++;

        user.profileCompleteness = Math.round((completedFields / fields.length) * 100);

        await user.save();

        // Send back the updated user, excluding the password
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({ success: true, data: userObj });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}; 