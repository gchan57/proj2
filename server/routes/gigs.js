const express = require('express');
const router = express.Router();
const Gig = require('../models/Gig');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// POST a new gig with an image
router.post('/', upload.single('image'), async (req, res) => {
  const { title, description, price, category, freelancerId } = req.body;
  const imageUrl = req.file ? `/${req.file.path.replace(/\\/g, "/")}` : '/default-image.jpg';

  const gig = new Gig({
    title,
    description,
    price,
    category,
    freelancerId,
    imageUrl
  });
  try {
    const newGig = await gig.save();
    res.status(201).json(newGig);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all gigs (with search)
router.get('/', async (req, res) => {
  const category = req.query.category && req.query.category !== 'All' ? { category: req.query.category } : {};
  const search = req.query.search ? {
    title: {
      $regex: req.query.search,
      $options: 'i',
    },
  } : {};

  try {
    const gigs = await Gig.find({ ...category, ...search }).populate('freelancerId', 'username');
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET a single gig by ID
router.get('/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('freelancerId', 'username');
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a gig
router.delete('/:id', async (req, res) => {
  try {
    await Gig.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gig deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;