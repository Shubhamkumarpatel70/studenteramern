const Meeting = require('../models/Meeting');
const Notification = require('../models/Notification');
const Certificate = require('../models/Certificate');
const OfferLetter = require('../models/OfferLetter');
const User = require('../models/User');
const Internship = require('../models/Internship');
const Transaction = require('../models/Transaction');
const Application = require('../models/Application');
const AssignedTask = require('../models/AssignedTask');

// @desc    Get statistics for the dashboard
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
    try {
        let stats;
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole === 'admin' || userRole === 'co-admin') {
            const totalUsers = await User.countDocuments();
            const totalInternships = await Internship.countDocuments();
            const totalMeetings = await Meeting.countDocuments();
            // Count only approved applications as transactions
            const totalTransactions = await Application.countDocuments({ status: 'Approved' });
            // Sum the amount field for all approved applications
            const approvedApplications = await Application.find({ status: 'Approved' });
            const totalTransactionAmount = approvedApplications.reduce((sum, app) => {
                // Use the actual amount from the application, or fallback to 149
                return sum + (app.amount || 149);
            }, 0);
            const totalRegistrations = await Application.countDocuments();
            stats = {
                totalUsers,
                totalInternships,
                totalMeetings,
                totalTransactions,
                totalTransactionAmount,
                totalRegistrations
            };
        } else {
            // Regular user stats
            // Count meetings relevant to the user (similar logic as getMeetings)
            const orConditions = [ { targetType: 'all' }, { targetType: 'users', selectedUsers: userId } ];
            if (req.user.role === 'co-admin') {
                orConditions.push({ targetType: 'co-admins' });
            }
            if (req.user.role === 'accountant') {
                orConditions.push({ targetType: 'accountants' });
            }
            if (req.user.role === 'user') {
                const userApplications = await Application.find({ user: userId, status: 'Approved' }).select('internship');
                const userInternshipIds = userApplications.map(app => app.internship).filter(Boolean);
                if (userInternshipIds.length > 0) {
                    orConditions.push({ targetType: 'internship', selectedInternship: { $in: userInternshipIds } });
                }
            }
            const meetingsCount = await Meeting.countDocuments({ $or: orConditions });
            const notificationsCount = await Notification.countDocuments({ user: userId, read: false });
            const totalNotificationsCount = await Notification.countDocuments({ user: userId });
            const certificatesCount = await Certificate.countDocuments({ user: userId });
            const offerLettersCount = await OfferLetter.countDocuments({ user: userId });
            
            // Get application stats
            const totalApplications = await Application.countDocuments({ user: userId });
            const approvedApplications = await Application.countDocuments({ user: userId, status: 'Approved' });
            const pendingApplications = await Application.countDocuments({ user: userId, status: { $in: ['Applied', 'Under Review'] } });
            
            // Get task stats
            const totalTasks = await AssignedTask.countDocuments({ user: userId });
            const completedTasks = await AssignedTask.countDocuments({ user: userId, status: 'Completed' });
            const pendingTasks = await AssignedTask.countDocuments({ user: userId, status: { $in: ['Pending', 'In Progress'] } });
            
            stats = {
                meetings: meetingsCount,
                notifications: notificationsCount,
                totalNotifications: totalNotificationsCount,
                certificates: certificatesCount,
                offerLetters: offerLettersCount,
                applications: totalApplications,
                approvedApplications: approvedApplications,
                pendingApplications: pendingApplications,
                tasks: totalTasks,
                completedTasks: completedTasks,
                pendingTasks: pendingTasks
            };
        }

        res.status(200).json({ success: true, data: stats });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}; 