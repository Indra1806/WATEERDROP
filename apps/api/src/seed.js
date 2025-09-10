import mongoose from 'mongoose';
import 'dotenv/config';
import Product from './models/Product.js';

const products = [
  { name: 'Water Bottle', sizeLiters: 2, price: 20, stock: 100 },
  { name: 'Water Bottle', sizeLiters: 5, price: 45, stock: 80 },
  { name: 'Water Bottle', sizeLiters: 10, price: 80, stock: 50 },
  { name: 'Water Bottle', sizeLiters: 20, price: 150, stock: 30 },
  { name: 'Water Bottle', sizeLiters: 30, price: 200, stock: 20 }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑 Cleared old products');

    await Product.insertMany(products);
    console.log('🌱 Seeded products successfully');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
