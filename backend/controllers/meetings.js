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
            const publicMeetings = Meeting.find({ 'target.type': 'all' });
            
            // Find meetings for the user's role or specific internships
            let roleSpecificMeetings;
            if (user.role === 'co-admin') {
                roleSpecificMeetings = Meeting.find({ 'target.type': 'co-admins' });
            } else { // 'user'
                // Find internships the user is approved for
                const userApplications = await Application.find({ user: user.id, status: 'Approved' }).select('internship');
                const userInternshipIds = userApplications.map(app => app.internship);
                
                roleSpecificMeetings = Meeting.find({
                    'target.type': 'internship',
                    'target.internship': { $in: userInternshipIds }
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
        // Validate that if target type is 'internship', an internship ID is provided
        if (req.body.target && req.body.target.type === 'internship' && !req.body.target.internship) {
            return res.status(400).json({ success: false, message: 'Please select an internship for targeted meetings.' });
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