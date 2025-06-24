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
            const totalTransactions = await Transaction.countDocuments();
            const totalTransactionAmount = await Transaction.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
            const totalRegistrations = await Application.countDocuments();
            const approved1 = await Application.countDocuments({ status: 'approved1' });
            const approved2 = await Application.countDocuments({ status: 'approved2' });
            stats = {
                totalUsers,
                totalInternships,
                totalMeetings,
                totalTransactions,
                totalTransactionAmount: totalTransactionAmount[0]?.total || 0,
                totalRegistrations,
                approved1,
                approved2
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