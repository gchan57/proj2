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

// PUT /api/gigs/:id - Update an existing gig
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const gigId = req.params.id;
    const { title, description, price, category } = req.body;

    const updateFields = { title, description, price, category };

    if (req.file) {
      updateFields.imageUrl = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    const updatedGig = await Gig.findByIdAndUpdate(
      gigId,
      { $set: updateFields },
      { new: true, runValidators: true } 
    );

    if (!updatedGig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    res.json(updatedGig);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// NEW ROUTE: POST /api/gigs/:id/reviews - Submit a review
router.post('/:id/reviews', async (req, res) => {
    const { rating, comment, userId, username } = req.body;
    const gigId = req.params.id;

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    try {
        const gig = await Gig.findById(gigId);
        if (!gig) return res.status(404).json({ message: 'Gig not found' });

        // Check if the user has already reviewed this gig
        const alreadyReviewed = gig.reviews.find(r => r.user.toString() === userId);

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Gig already reviewed by this user' });
        }

        const review = {
            user: userId,
            username: username,
            rating: Number(rating),
            comment: comment || '',
        };

        gig.reviews.push(review);
        gig.numReviews = gig.reviews.length;

        // Calculate new average rating
        gig.rating = gig.reviews.reduce((acc, item) => item.rating + acc, 0) / gig.numReviews;
        
        await gig.save();
        res.status(201).json({ message: 'Review added successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
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