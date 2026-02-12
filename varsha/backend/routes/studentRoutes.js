const express = require('express');
const router = express.Router();
const { getAllCounselors, getCounselorSlots, bookSlot, getStudentBookings, updateProfile } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/counselors', protect, getAllCounselors);
router.get('/counselors/:counselorId/slots', protect, getCounselorSlots);
router.post('/bookings', protect, bookSlot);
router.get('/bookings', protect, getStudentBookings);
router.put('/profile', protect, updateProfile);

module.exports = router;
