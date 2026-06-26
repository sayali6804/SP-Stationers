import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number
    }
  ],
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  order_status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Complete', 'Cancelled']
  },
  total_price: Number,
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
