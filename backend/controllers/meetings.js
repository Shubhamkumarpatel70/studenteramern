const Meeting = require('../models/Meeting');
const Application = require('../models/Application');

// @desc    Get meetings relevant to the user
// @route   GET /api/meetings
// @access  Private
exports.getMeetings = async (req, res, next) => {
    try {
        const user = req.user;
        let meetings = [];

        if (user.role === 'admin') {
            // Admin gets all meetings
            meetings = await Meeting.find().populate('user', 'name email').sort({ date: 'asc' });
        } else {
            // Find meetings targeted at 'all'
            const publicMeetings = Meeting.find({ targetType: 'all' });

            // Find meetings for the user's role or specific internships
            let roleSpecificMeetings;
            if (user.role === 'co-admin') {
                roleSpecificMeetings = Meeting.find({ targetType: 'co-admins' });
            } else if (user.role === 'accountant') {
                roleSpecificMeetings = Meeting.find({ targetType: 'accountants' });
            } else { // 'user'
                // Find internships the user is approved for
                const userApplications = await Application.find({ user: user.id, status: 'Approved' }).select('internship');
                const userInternshipIds = userApplications.map(app => app.internship);

                roleSpecificMeetings = Meeting.find({
                    targetType: 'internship',
                    selectedInternship: { $in: userInternshipIds }
                });
            }

            const [publicArr, roleArr] = await Promise.all([publicMeetings, roleSpecificMeetings]);
            meetings = [...publicArr, ...roleArr];
            // Sort combined meetings by date
            meetings.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        res.status(200).json({ success: true, count: meetings.length, data: meetings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new meeting
// @route   POST /api/meetings
// @access  Private/Admin
exports.createMeeting = async (req, res, next) => {
    req.body.user = req.user.id;
    try {
        // Validation for meeting targeting
        if (req.body.targetType === 'users' && (!req.body.selectedUsers || req.body.selectedUsers.length === 0)) {
            return res.status(400).json({ success: false, message: 'Please select at least one user for targeted meetings.' });
        }
        if (req.body.targetType === 'internship' && !req.body.selectedInternship) {
            return res.status(400).json({ success: false, message: 'Please select an internship for targeted meetings.' });
        }
        if (req.body.targetType === 'co-admins' || req.body.targetType === 'accountants') {
            // No additional validation needed for role-based targeting
        }
        const meeting = await Meeting.create(req.body);
        res.status(201).json({ success: true, data: meeting });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: 'Could not create meeting' });
    }
};

// @desc    Update a meeting
// @route   PUT /api/meetings/:id
// @access  Private/Admin
exports.updateMeeting = async (req, res, next) => {
    try {
        let meeting = await Meeting.findById(req.params.id);

        if (!meeting) {
            return res.status(404).json({ success: false, message: 'Meeting not found' });
        }

        // Validation for meeting targeting
        if (req.body.targetType === 'users' && (!req.body.selectedUsers || req.body.selectedUsers.length === 0)) {
            return res.status(400).json({ success: false, message: 'Please select at least one user for targeted meetings.' });
        }
        if (req.body.targetType === 'internship' && !req.body.selectedInternship) {
            return res.status(400).json({ success: false, message: 'Please select an internship for targeted meetings.' });
        }

        meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: meeting });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: 'Could not update meeting' });
    }
};

// @desc    Delete a meeting
// @route   DELETE /api/meetings/:id
// @access  Private/Admin
exports.deleteMeeting = async (req, res, next) => {
    try {
        const meeting = await Meeting.findById(req.params.id);

        if (!meeting) {
            return res.status(404).json({ success: false, message: 'Meeting not found' });
        }

        await meeting.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}; 