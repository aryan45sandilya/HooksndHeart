const express = require('express');
const router = express.Router();
const { protectUser } = require('../middleware/userAuth');
const { protect } = require('../middleware/auth'); // Admin middleware
const {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

// User routes (protected)
router.post('/', protectUser, createOrder);
router.get('/', protectUser, getUserOrders);
router.get('/:id', protectUser, getOrderById);
router.put('/:id/cancel', protectUser, cancelOrder);

// Admin routes (protected)
router.get('/admin/all', protect, getAllOrders);
router.put('/admin/:id/status', protect, updateOrderStatus);

module.exports = router;
