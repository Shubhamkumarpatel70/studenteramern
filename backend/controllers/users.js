const User = require("../models/User");

// @desc    Get all users with pagination
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    // Fetch users with pagination and plainPasswordForAdmin field explicitly selected
    const users = await User.find()
      .select('+plainPasswordForAdmin')
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);
    
    // Convert to plain objects and ensure plainPasswordForAdmin is included
    const usersData = users.map(user => {
      const userObj = user.toObject();
      // Ensure plainPasswordForAdmin is included (even if null/undefined)
      if (!userObj.hasOwnProperty('plainPasswordForAdmin')) {
        userObj.plainPasswordForAdmin = null;
      }
      return userObj;
    });
    
    res.status(200).json({ 
      success: true, 
      count: usersData.length,
      totalUsers,
      totalPages,
      currentPage: page,
      data: usersData 
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(400).json({ success: false, message: 'Failed to fetch users' });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin/Co-admin
exports.updateUser = async (req, res, next) => {
  try {
    const { role, ...updateData } = req.body;

    // If co-admin is trying to update role, check restrictions
    if (role && req.user.role === "co-admin") {
      // Co-admin cannot change admin roles
      const targetUser = await User.findById(req.params.id);
      if (!targetUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      if (targetUser.role === "admin") {
        return res.status(403).json({
          success: false,
          message: "Co-admin cannot modify admin role",
        });
      }
      // Allow co-admin to change role for non-admin users
      updateData.role = role;
    } else if (role && req.user.role === "admin") {
      // Admin can change any role
      updateData.role = role;
    }
    // If no role in request or user is co-admin without role change, proceed with other updates

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res
        .status(400)
        .json({ success: false, message: "Role is required" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to update role" });
  }
};

// @desc    Permanently delete a user (admin action)
// @route   DELETE /api/users/:id/permanent
// @access  Private/Admin
exports.permanentlyDeleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    await user.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "User permanently deleted." });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to delete user." });
  }
};

// @desc    Get all users with pending deletion
// @route   GET /api/users/deletion-requests
// @access  Private/Admin
exports.getDeletionRequests = async (req, res) => {
  try {
    console.log("getDeletionRequests called by user:", req.user);
    const users = await User.find({ deletionRequested: true });
    console.log("Found deletion requests:", users.length);
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    console.error("Error in getDeletionRequests:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};
