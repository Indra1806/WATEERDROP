import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'delivered', 'cancelled'], default: 'pending' },
  statusHistory: [
    {
      status: { type: String, enum: ['pending', 'delivered', 'cancelled'] },
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
