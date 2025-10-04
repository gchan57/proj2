const express = require('express');
const router = express.Router();
const Order = require('../models/Order.js'); 

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  const { gigId, clientId, freelancerId, price } = req.body;
  try {
    const newOrder = new Order({ gigId, clientId, freelancerId, price });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/user/:userId - Get all orders for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ clientId: req.params.userId }, { freelancerId: req.params.userId }],
    }).populate('gigId', 'title imageUrl');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  // Basic validation for the status
  const allowedStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;