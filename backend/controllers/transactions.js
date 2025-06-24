const Transaction = require('../models/Transaction');

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions/my-transactions
// @access  Private
exports.getMyTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });

        res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}; 