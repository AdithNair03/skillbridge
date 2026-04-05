const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Create review
router.post('/', protect, async (req, res) => {
  try {
    const { reviewee, session, rating, comment, skillTaught } = req.body;
    const existing = await Review.findOne({ reviewer: req.user._id, session });
    if (existing) return res.status(400).json({ message: 'Already reviewed this session' });

    const review = await Review.create({ reviewer: req.user._id, reviewee, session, rating, comment, skillTaught });

    const reviews = await Review.find({ reviewee });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await User.findByIdAndUpdate(reviewee, { rating: Math.round(avgRating * 10) / 10, reviewsCount: reviews.length });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get reviews for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'firstName lastName avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
