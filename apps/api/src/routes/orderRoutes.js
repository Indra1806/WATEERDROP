import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  res.json({ message: `Hello user ${req.user.userId}, here are your orders.` });
});

export default router;
