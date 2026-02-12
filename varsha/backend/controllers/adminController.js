const User = require('../models/User');
const Counselor = require('../models/Counselor');
const Booking = require('../models/Booking');

// @desc    Add a new counselor
// @route   POST /api/admin/counselor
// @access  Private/Admin
const addCounselor = async (req, res) => {
    const {
        name, email, password, specialization,
        phone, education, certifications, experience,
        languages, bio, photo, approach
    } = req.body;

    const counselorExists = await Counselor.findOne({ email });

    if (counselorExists) {
        res.status(400).json({ message: 'Counselor already exists' });
        return;
    }

    const counselor = await Counselor.create({
        name,
        email,
        password, // Pre-save hook will hash this
        specialization,
        phone,
        education,
        certifications,
        experience,
        languages: languages ? (Array.isArray(languages) ? languages : languages.split(',').map(l => l.trim())) : [],
        bio,
        photo,
        approach,
        isActive: true
    });

    if (counselor) {
        res.status(201).json({
            _id: counselor._id,
            name: counselor.name,
            email: counselor.email,
            specialization: counselor.specialization,
        });
    } else {
        res.status(400).json({ message: 'Invalid counselor data' });
    }
};

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalCounselors = await Counselor.countDocuments({});
    const totalBookings = await Booking.countDocuments({});

    // Maybe some breakdown by status
    // Breakdown by status
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const approvedBookings = await Booking.countDocuments({ status: 'approved' });
    const declinedBookings = await Booking.countDocuments({ status: 'declined' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    // Monthly Bookings for Line Chart
    const monthlyBookings = await Booking.aggregate([
        {
            $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Format monthly data for frontend [ {name: 'Jan', bookings: 10}, ... ]
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = monthlyBookings.map(item => ({
        name: months[item._id - 1],
        bookings: item.count
    }));

    res.json({
        totalUsers,
        totalCounselors,
        totalBookings,
        pendingBookings,
        approvedBookings,
        declinedBookings,
        completedBookings,
        monthlyData
    });
};

// @desc    Get all users (students)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({ role: 'student' }).select('-password');
    res.json(users);
};

module.exports = {
    addCounselor,
    getStats,
    getUsers,
};
