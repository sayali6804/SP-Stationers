// models/Customer.js
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {          // Added name field
    type: String,
    required: true, // Make it required or optional based on your need
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
