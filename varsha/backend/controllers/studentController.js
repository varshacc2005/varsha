const Counselor = require('../models/Counselor');
const Booking = require('../models/Booking');
const { sendBookingRequestEmail } = require('../utils/emailService');

// @desc    Get all counselors
// @route   GET /api/student/counselors
// @access  Private/Student
const getAllCounselors = async (req, res) => {
    // Return all counselors, maybe only active ones?
    // User schema doesn't have isActive, Counselor schema has.
    const counselors = await Counselor.find({ isActive: true }).select('-password');
    res.json(counselors);
};

// @desc    Get slots for a counselor
// @route   GET /api/student/counselors/:counselorId/slots
// @access  Private/Student
const getCounselorSlots = async (req, res) => {
    const counselor = await Counselor.findById(req.params.counselorId);
    if (counselor) {
        // Filter out past slots? Or just return all? 
        // User might want to see history? Usually only future available slots.
        // For simple project, return all or filter by date >= today.
        // Let's return all for now to keep it simple for Viva demo.
        res.json(counselor.availability);
    } else {
        res.status(404).json({ message: 'Counselor not found' });
    }
};

// @desc    Book a slot
// @route   POST /api/student/bookings
// @access  Private/Student
const bookSlot = async (req, res) => {
    const { counselorId, slotId } = req.body;

    // Find the counselor and the slot
    const counselor = await Counselor.findById(counselorId);
    if (!counselor) {
        res.status(404).json({ message: 'Counselor not found' });
        return;
    }

    // Find slot in availability array
    const slot = counselor.availability.id(slotId);
    // Mongoose subdocuments have _id by default unless disabled.
    // In Counselor schema: availability: [{ date, startTime, ... }] -> Mongoose adds _id.

    if (!slot) {
        res.status(404).json({ message: 'Slot not found' });
        return;
    }

    if (slot.isBooked) {
        res.status(400).json({ message: 'Slot already booked' });
        return;
    }

    // Create booking
    const booking = await Booking.create({
        studentId: req.user._id,
        counselorId,
        slot: {
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
        },
        status: 'pending',
    });

    if (booking) {
        // Mark slot as booked
        slot.isBooked = true;
        await counselor.save();

        // Send email to counselor
        await sendBookingRequestEmail(
            counselor.email,
            req.user.name,
            slot.date,
            slot.startTime
        );

        res.status(201).json(booking);
    } else {
        res.status(400).json({ message: 'Invalid booking data' });
    }
};

// @desc    Get my bookings
// @route   GET /api/student/bookings
// @access  Private/Student
const getStudentBookings = async (req, res) => {
    const bookings = await Booking.find({ studentId: req.user._id })
        .populate('counselorId', 'name email specialization')
        .sort({ createdAt: -1 });
    res.json(bookings);
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private/Student
const updateProfile = async (req, res) => {
    const user = await require('../models/User').findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        // Update additional fields
        const fields = ['phone', 'education', 'course', 'year', 'college', 'areaOfInterest', 'goal', 'mood', 'photo'];
        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            education: updatedUser.education,
            course: updatedUser.course,
            year: updatedUser.year,
            college: updatedUser.college,
            areaOfInterest: updatedUser.areaOfInterest,
            goal: updatedUser.goal,
            mood: updatedUser.mood,
            photo: updatedUser.photo
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    getAllCounselors,
    getCounselorSlots,
    bookSlot,
    getStudentBookings,
    updateProfile,
};
