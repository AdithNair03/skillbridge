const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get all users (for explore)
router.get('/', async (req, res) => {
  try {
    const { search, category, level, minRating } = req.query;
    let query = { isActive: true };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { 'skillsOffered.name': { $regex: search, $options: 'i' } }
      ];
    }
    if (level) query['skillsOffered.level'] = level;
    if (minRating) query.rating = { $gte: parseFloat(minRating) };

    const users = await User.find(query).select('-password').sort({ rating: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { firstName, lastName, bio, location, hourlyRate, skillsOffered, skillsWanted, avatar } = req.body;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (hourlyRate !== undefined) user.hourlyRate = hourlyRate;
    if (avatar !== undefined) user.avatar = avatar;
    if (skillsOffered) user.skillsOffered = skillsOffered;
    if (skillsWanted) user.skillsWanted = skillsWanted;
    const updated = await user.save();
    res.json({ ...updated.toObject(), password: undefined });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add skill offered
router.post('/skills/offer', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, level, category } = req.body;
    user.skillsOffered.push({ name, level, category });
    await user.save();
    res.json(user.skillsOffered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add skill wanted
router.post('/skills/want', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, level, category } = req.body;
    user.skillsWanted.push({ name, level, category });
    await user.save();
    res.json(user.skillsWanted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete skill
router.delete('/skills/:type/:skillId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.params.type === 'offer') {
      user.skillsOffered = user.skillsOffered.filter(s => s._id.toString() !== req.params.skillId);
    } else {
      user.skillsWanted = user.skillsWanted.filter(s => s._id.toString() !== req.params.skillId);
    }
    await user.save();
    res.json({ message: 'Skill removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
