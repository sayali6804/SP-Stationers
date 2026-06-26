import mongoose from 'mongoose';
import fs from 'fs';
import Product from '../models/Product.js'; // adjust path
import Order from '../models/Order.js';     // adjust path

await mongoose.connect('mongodb://localhost:27017/your-db-name');

// Export products
const products = await Product.find();
fs.writeFileSync('./flask_app/data/products.json', JSON.stringify(products, null, 2));

// Export orders
const orders = await Order.find();
fs.writeFileSync('./flask_app/data/orders.json', JSON.stringify(orders, null, 2));

console.log("Data exported.");
await mongoose.disconnect();
