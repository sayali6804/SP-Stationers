import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  brand: String,
  price: Number,
  price_range: String,
  color: String,
  material: String,
  status:String,
  stock: {
    available: Boolean,
    quantity: Number
  },
  rating: {
    average: Number,
    reviews_count: Number
  },
  dimensions: {
    height: String,
    width: String,
    depth: String
  },
  discount: {
    active: Boolean,
    percentage: Number,
    valid_till: Date
  },
  features: [String],
  supplier: {
    name: String,
    contact: String,
    location: String
  },
  tags: [String],
  images: [String], // To store image URLs
  date_added: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
