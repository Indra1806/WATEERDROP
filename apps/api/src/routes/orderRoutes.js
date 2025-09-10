import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Create a new order
router.post('/', authMiddleware, createOrder);

// Get orders for the logged-in user
router.get('/', authMiddleware, getMyOrders);

// Get all orders (admin only)
router.get('/all', authMiddleware, getAllOrders);

// Update order status (admin only)
router.patch('/:id/status', authMiddleware, updateOrderStatus);

// Cancel order
router.patch('/:id/cancel', authMiddleware, cancelOrder);

export default router;
