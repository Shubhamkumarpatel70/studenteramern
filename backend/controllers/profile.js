const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

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
        if (user.profilePicture && user.profilePicture !== 'dafaultava.jpg') completedFields++;
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

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    cloudinary.uploader.upload_stream(
      { folder: 'profile_pictures', resource_type: 'image' },
      async (error, result) => {
        if (error) return res.status(500).json({ message: 'Cloudinary error' });
        await User.findByIdAndUpdate(req.user.id, { profilePicture: result.secure_url });
        res.json({ url: result.secure_url });
      }
    ).end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
}; 