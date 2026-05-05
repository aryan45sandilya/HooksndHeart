const Admin = require('../models/Admin');
const crypto = require('crypto');

// In-memory OTP store (expires in 5 minutes)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Fast2SMS
const sendOTP = async (phone, otp) => {
  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey || apiKey === 'your_fast2sms_api_key_here') {
    console.log(`\n=============================`);
    console.log(`OTP for ${phone}: ${otp}`);
    console.log(`=============================\n`);
    return { success: true, dev: true };
  }

  try {
    const https = require('https');
    const params = new URLSearchParams({
      authorization: apiKey,
      variables_values: otp,
      route: 'otp',
      numbers: phone,
    });

    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'www.fast2sms.com',
        path: `/dev/bulkV2?${params.toString()}`,
        method: 'GET',
        headers: { 'cache-control': 'no-cache' }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log(`SMS sent to ${phone}:`, data);
          resolve({ success: true });
        });
      });

      req.on('error', (err) => {
        console.error('SMS Error:', err.message);
        reject(new Error('Failed to send OTP SMS'));
      });

      req.end();
    });
  } catch (error) {
    console.error('SMS Error:', error.message);
    throw new Error('Failed to send OTP SMS');
  }
};

// @desc    Request OTP to change credentials
// @route   POST /api/settings/request-otp
// @access  Private (Admin)
exports.requestOTP = async (req, res) => {
  try {
    const { changeType } = req.body; // 'username', 'email', or 'password'

    if (!['username', 'email', 'password'].includes(changeType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid change type'
      });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP with admin ID and change type
    const key = `${req.admin._id}_${changeType}`;
    otpStore.set(key, { otp, expiresAt, adminId: req.admin._id.toString() });

    // Send OTP to both registered phones
    const phone1 = process.env.ADMIN_PHONE_1;
    const phone2 = process.env.ADMIN_PHONE_2;

    const results = [];

    if (phone1) {
      const r1 = await sendOTP(phone1, otp);
      results.push({ phone: `******${phone1.slice(-4)}`, sent: r1.success });
    }
    if (phone2) {
      const r2 = await sendOTP(phone2, otp);
      results.push({ phone: `******${phone2.slice(-4)}`, sent: r2.success });
    }

    const isDev = !process.env.FAST2SMS_API_KEY || process.env.FAST2SMS_API_KEY === 'your_fast2sms_api_key_here';

    res.json({
      success: true,
      message: isDev
        ? 'OTP generated (check server console - SMS API not configured)'
        : `OTP sent to registered phone numbers`,
      sentTo: results,
      expiresIn: '5 minutes',
      devMode: isDev
    });

  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error sending OTP'
    });
  }
};

// @desc    Verify OTP and update credentials
// @route   POST /api/settings/verify-and-update
// @access  Private (Admin)
exports.verifyAndUpdate = async (req, res) => {
  try {
    const { changeType, otp, newValue, currentPassword } = req.body;

    if (!changeType || !otp || !newValue) {
      return res.status(400).json({
        success: false,
        message: 'changeType, otp, and newValue are required'
      });
    }

    // Check OTP
    const key = `${req.admin._id}_${changeType}`;
    const stored = otpStore.get(key);

    if (!stored) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request a new OTP.'
      });
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(key);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    if (stored.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }

    // OTP valid — now update
    const admin = await Admin.findById(req.admin._id).select('+password');

    // For password change, verify current password first
    if (changeType === 'password') {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to change password'
        });
      }
      const isMatch = await admin.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      if (newValue.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters'
        });
      }
    }

    // Check uniqueness for username/email
    if (changeType === 'username') {
      const exists = await Admin.findOne({ username: newValue.toLowerCase(), _id: { $ne: admin._id } });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Username already taken' });
      }
      admin.username = newValue.toLowerCase().trim();
    } else if (changeType === 'email') {
      const exists = await Admin.findOne({ email: newValue.toLowerCase(), _id: { $ne: admin._id } });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      admin.email = newValue.toLowerCase().trim();
    } else if (changeType === 'password') {
      admin.password = newValue; // will be hashed by pre-save hook
    }

    await admin.save();

    // Delete used OTP
    otpStore.delete(key);

    res.json({
      success: true,
      message: `${changeType.charAt(0).toUpperCase() + changeType.slice(1)} updated successfully!`,
      data: {
        username: admin.username,
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Verify and update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating credentials'
    });
  }
};
