const express = require('express');
const router = express.Router();
const { addCounselor, getStats, getUsers } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/counselor', protect, admin, addCounselor);
router.get('/stats', protect, admin, getStats);
router.get('/users', protect, admin, getUsers);

module.exports = router;
