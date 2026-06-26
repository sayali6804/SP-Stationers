import express from 'express';
import { createOrder, getOrders } from '../controllers/orderController.js';
import Order from '../models/Order.js';
const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
// Express.js (example)
// PUT /api/orders/:id
router.put('/:id', async (req, res) => {
    const { status } = req.body;
  
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      order.order_status = status;
      await order.save();
  
      res.json(order);
    } catch (err) {
      console.error('Error updating order:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
export default router;