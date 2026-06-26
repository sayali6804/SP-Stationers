import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'E:\\stationery-shop-website-master\\frontend\\public\\Image');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

export const upload = multer({ storage }); // Export this if used in route

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      price,
      price_range,
      color,
      material,
      stock,
      rating,
      dimensions,
      discount,
      features,
      supplier,
      tags,
      available,
      status,
      date_added,
    } = req.body;

    console.log("🌟 Raw Incoming Fields:");
    console.log("Name:", name);
    console.log("Features (raw):", features);
    console.log("Tags (raw):", tags);

    const parsedProduct = {
      name,
      category,
      brand,
      price: Number(price),
      price_range,
      color,
      material,
      available: available === 'true',
      status,
      // Save only the filename without '/images/'
      images: req.files.map(file => file.filename),
      date_added: date_added ? new Date(date_added) : new Date()
    };

    // Safe parsing of nested JSON fields
    try { parsedProduct.stock = JSON.parse(stock); } catch { parsedProduct.stock = { available: false, quantity: 0 }; }
    try { parsedProduct.rating = JSON.parse(rating); } catch { parsedProduct.rating = { average: 0, reviews_count: 0 }; }
    try { parsedProduct.dimensions = JSON.parse(dimensions); } catch { parsedProduct.dimensions = {}; }
    try { parsedProduct.discount = JSON.parse(discount); } catch { parsedProduct.discount = { active: false, percentage: 0 }; }
    try { parsedProduct.features = JSON.parse(features); } catch { parsedProduct.features = []; }
    try { parsedProduct.supplier = JSON.parse(supplier); } catch { parsedProduct.supplier = {}; }
    try { parsedProduct.tags = JSON.parse(tags); } catch { parsedProduct.tags = []; }

    const newProduct = new Product(parsedProduct);
    const saved = await newProduct.save();

    console.log("✅ Product Saved:", saved);
    res.status(201).json(saved);

  } catch (error) {
    console.error("❌ Error in createProduct:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Error in getProducts:", err.message);
    res.status(500).json({ error: err.message });
  }
};
