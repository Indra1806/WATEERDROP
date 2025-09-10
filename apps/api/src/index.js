import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';

const app = express();
app.use(express.json());

// Middleware for authentication routes
app.use('/auth', authRoutes);

// Middleware for order routes
app.use('/orders', orderRoutes);

// Middleware for product routes
app.use('/products', productRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Health check route
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Start server
app.listen(8080, () => {
  console.log('🚀 API listening on port 8080');
});

