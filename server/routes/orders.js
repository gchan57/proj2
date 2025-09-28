const express = require('express');
const router = express.Router();
// The path here ensures Node.js finds the model file correctly.
const Order = require('../models/Order.js'); 

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  const { gigId, clientId, freelancerId, price } = req.body;
  try {
    const newOrder = new Order({
      gigId,
      clientId,
      freelancerId,
      price,
    });
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

module.exports = router;