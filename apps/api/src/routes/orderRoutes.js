import express from 'express';
import authMiddleware, { requireAdmin } from '../middlewares/authMiddleware.js';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { createOrderValidation, updateStatusValidation, validate } from '../middlewares/validators.js';

const router = express.Router();

// Create a new order
router.post('/', authMiddleware, createOrderValidation, validate, createOrder);

// Get orders for the logged-in user
router.get('/', authMiddleware, getMyOrders);

// Get all orders (admin only)
router.get('/all', authMiddleware, getAllOrders);

// Update order status (admin only)
router.patch('/:id/status', authMiddleware, requireAdmin, updateStatusValidation, validate, updateOrderStatus);

// Cancel order
router.patch('/:id/cancel', authMiddleware, cancelOrder);

export default router;
