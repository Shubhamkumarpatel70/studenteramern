const Meeting = require('../models/Meeting');
const Notification = require('../models/Notification');
const Certificate = require('../models/Certificate');
const OfferLetter = require('../models/OfferLetter');
const User = require('../models/User');
const Internship = require('../models/Internship');
const Transaction = require('../models/Transaction');
const Application = require('../models/Application');

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
            const totalTransactionAmount = approvedApplications.reduce((sum, app) => sum + (app.amount || 149), 0);
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
            const meetingsCount = await Meeting.countDocuments({ 'attendees.user': userId });
            const notificationsCount = await Notification.countDocuments({ user: userId });
            const certificatesCount = await Certificate.countDocuments({ user: userId });
            const offerLettersCount = await OfferLetter.countDocuments({ user: userId });
            stats = {
                meetings: meetingsCount,
                notifications: notificationsCount,
                certificates: certificatesCount,
                offerLetters: offerLettersCount
            };
        }

        res.status(200).json({ success: true, data: stats });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}; 