import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * Create a new order
 */
export const createOrder = async (req, res) => {
  try {
    const { products } = req.body; // [{ productId, quantity }]
    const userId = req.user.userId;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;
      orderItems.push({ product: product._id, quantity: item.quantity });
    }

    const order = await Order.create({
      user: userId,
      products: orderItems,
      totalAmount,
      status: 'pending',
      statusHistory: [{ status: 'pending' }]
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update order status (admin only)
 */
export const updateOrderStatus = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({ status });
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Cancel an order (owner or admin). Restores stock for products.
 */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only the order owner or an admin can cancel
    if (req.user.role !== 'admin' && order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only pending orders can be cancelled
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    // Restock products
    for (const item of order.products) {
      const productId = item.product?._id || item.product;
      const product = await Product.findById(productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Update status and history
    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled' });
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get orders for the logged-in user
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all orders (admin only)
 */
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { status } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('products.product', 'name price')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      orders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
