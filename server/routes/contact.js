const express = require('express');
const router = express.Router();
const { submitContact, getAllContacts } = require('../controllers/contactController');

// Submit contact form
router.post('/', submitContact);

// Get all contacts (for admin)
router.get('/', getAllContacts);

module.exports = router;
