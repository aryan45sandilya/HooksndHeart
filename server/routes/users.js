const express = require('express');
const router = express.Router();
const { protectUser } = require('../middleware/userAuth');
const {
  register,
  login,
  getMe,
  updateProfile,
  logout
} = require('../controllers/userAuthController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protectUser, getMe);
router.put('/profile', protectUser, updateProfile);
router.post('/logout', protectUser, logout);

module.exports = router;
