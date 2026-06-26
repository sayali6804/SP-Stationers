// routes/auth.js
import express from 'express';
import Customer from '../models/Customer.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { name, mobile, password, address, email } = req.body;

  try {
    const existing = await Customer.findOne({ mobile });
    if (existing) return res.status(400).json({ message: 'Mobile already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = new Customer({ name, mobile, password: hashedPassword, address, email });
    await newCustomer.save();

    res.status(201).json({ message: 'Signup successful', customerId: newCustomer._id });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { mobile, password } = req.body;

  try {
    const customer = await Customer.findOne({ mobile });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({
      message: 'Login successful',
      customerId: customer._id,
      name: customer.name,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Fetch All Customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
});

// ✅ Fetch Single Customer by ID
// ✅ Fetch Single Customer by ID (safe version)
router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select('-password'); // exclude password
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error });
  }
});


export default router;
