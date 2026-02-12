const Counselor = require('../models/Counselor');
const Booking = require('../models/Booking');
const SessionNote = require('../models/SessionNote'); // Need to create this model
const { sendBookingConfirmationEmail } = require('../utils/emailService');

// @desc    Add availability slots
// @route   POST /api/counselor/slots
// @access  Private/Counselor
// @desc    Add availability slots (Calendly-style)
// @route   POST /api/counselor/slots
// @access  Private/Counselor
const addSlots = async (req, res) => {
    const { date, startTime, endTime, duration } = req.body; // duration in minutes
    const counselor = await Counselor.findById(req.user._id);

    if (counselor) {
        // Parse start and end times
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        let currentHour = startHour;
        let currentMinute = startMinute;

        const newSlots = [];

        // Loop to create slots
        while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
            // Format current start time
            const slotStart = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

            // Calculate next slot time
            let nextMinute = currentMinute + parseInt(duration);
            let nextHour = currentHour + Math.floor(nextMinute / 60);
            nextMinute = nextMinute % 60;

            // Check if slot exceeds end time
            if (nextHour > endHour || (nextHour === endHour && nextMinute > endMinute)) {
                break;
            }

            const slotEnd = `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`;

            newSlots.push({
                date,
                startTime: slotStart,
                endTime: slotEnd,
                isBooked: false,
            });

            // Update current time for next iteration
            currentHour = nextHour;
            currentMinute = nextMinute;
        }

        counselor.availability.push(...newSlots);
        await counselor.save();
        res.status(201).json(counselor.availability);
    } else {
        res.status(404).json({ message: 'Counselor not found' });
    }
};

// @desc    Get bookings for counselor
// @route   GET /api/counselor/bookings
// @access  Private/Counselor
const getCounselorBookings = async (req, res) => {
    const bookings = await Booking.find({ counselorId: req.user._id })
        .populate('studentId', 'name email')
        .sort({ createdAt: -1 });
    res.json(bookings);
};

// @desc    Approve/Decline booking
// @route   PUT /api/counselor/bookings/:id
// @access  Private/Counselor
const updateBookingStatus = async (req, res) => {
    const { status } = req.body; // approved, declined
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        if (booking.counselorId.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        booking.status = status;
        await booking.save();

        // If declined, free up the slot? 
        // Logic: specific slot in counselor availability should be marked unbooked?
        // My schema has 'isBooked' in Counselor.availability.
        // I need to find the specific slot index or ID.
        // But Booking model has 'slot' object copy, not reference.
        // Ideally Booking should reference the slot subdocument or I should match 
        // date/time to find the slot in counselor.availability.
        // For simplicity, let's assume we just update status for now. 
        // If I want to sync availability, I need to lookup counselor.availability.

        // Let's implement slot release if declined.
        if (status === 'declined' || status === 'cancelled') {
            const counselor = await Counselor.findById(req.user._id);
            const slotToFree = counselor.availability.find(
                s => s.date.toISOString() === booking.slot.date.toISOString() &&
                    s.startTime === booking.slot.startTime
            );
            if (slotToFree) {
                slotToFree.isBooked = false;
                await counselor.save();
            }
        }

        // Send email to student
        // Use populate to get student email if not already populated? 
        // We only have studentId in booking, need to fetch user details properly.
        // Booking.findById(req.params.id) does not populate student by default unless told.
        // Re-fetch booking with populate to get student email
        const populatedBooking = await Booking.findById(req.params.id).populate('studentId', 'name email').populate('counselorId', 'name');

        if (populatedBooking && populatedBooking.studentId) {
            await sendBookingConfirmationEmail(
                populatedBooking.studentId.email,
                populatedBooking.counselorId.name,
                populatedBooking.slot.date,
                populatedBooking.slot.startTime,
                status
            );
        }

        res.json(booking);
    } else {
        res.status(404).json({ message: 'Booking not found' });
    }
};

// @desc    Add session note
// @route   POST /api/counselor/notes
// @access  Private/Counselor
const addSessionNote = async (req, res) => {
    const { bookingId, notes } = req.body;

    // Create new note
    const sessionNote = await SessionNote.create({
        bookingId,
        counselorId: req.user._id,
        notes,
    });

    res.status(201).json(sessionNote);
};

// @desc    Update counselor profile
// @route   PUT /api/counselor/profile
// @access  Private/Counselor
const updateProfile = async (req, res) => {
    const counselor = await Counselor.findById(req.user._id);

    if (counselor) {
        counselor.name = req.body.name || counselor.name;
        counselor.email = req.body.email || counselor.email;
        counselor.specialization = req.body.specialization || counselor.specialization;

        // New Profile Fields
        if (req.body.bio !== undefined) counselor.bio = req.body.bio;
        if (req.body.skills) counselor.skills = req.body.skills;
        if (req.body.services) counselor.services = req.body.services;
        if (req.body.experience !== undefined) counselor.experience = req.body.experience;
        if (req.body.languages) counselor.languages = req.body.languages;
        if (req.body.price !== undefined) counselor.price = req.body.price;
        if (req.body.photo) counselor.photo = req.body.photo;

        // Added fields
        if (req.body.phone) counselor.phone = req.body.phone;
        if (req.body.education) counselor.education = req.body.education;
        if (req.body.certifications) counselor.certifications = req.body.certifications;
        if (req.body.approach) counselor.approach = req.body.approach;

        if (req.body.password) {
            counselor.password = req.body.password;
        }

        const updatedCounselor = await counselor.save();

        res.json({
            _id: updatedCounselor._id,
            name: updatedCounselor.name,
            email: updatedCounselor.email,
            specialization: updatedCounselor.specialization,
            bio: updatedCounselor.bio,
            skills: updatedCounselor.skills,
            services: updatedCounselor.services,
            experience: updatedCounselor.experience,
            languages: updatedCounselor.languages,
            price: updatedCounselor.price,
            photo: updatedCounselor.photo,
        });
    } else {
        res.status(404).json({ message: 'Counselor not found' });
    }
};

module.exports = {
    addSlots,
    getCounselorBookings,
    updateBookingStatus,
    addSessionNote,
    updateProfile,
};
