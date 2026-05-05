const express = require('express');
const router = express.Router();
const { requestOTP, verifyAndUpdate } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

// All routes protected - admin must be logged in
router.post('/request-otp', protect, requestOTP);
router.post('/verify-and-update', protect, verifyAndUpdate);

module.exports = router;
