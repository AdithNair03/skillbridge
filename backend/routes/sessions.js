const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Create session request
router.post('/', protect, async (req, res) => {
  try {
    const { provider, sessionType, skillToLearn, skillToTeach, duration, scheduledDate, scheduledTime, message, price } = req.body;
    const session = await Session.create({
      requester: req.user._id, provider, sessionType, skillToLearn, skillToTeach, duration,
      scheduledDate, scheduledTime, message, price
    });
    const populated = await session.populate(['requester', 'provider']);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my sessions
router.get('/my', protect, async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ requester: req.user._id }, { provider: req.user._id }]
    }).populate('requester provider', 'firstName lastName avatar').sort({ scheduledDate: 1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update session status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    session.status = req.body.status;
    if (req.body.meetingLink) session.meetingLink = req.body.meetingLink;
    await session.save();
    if (req.body.status === 'completed') {
      await User.findByIdAndUpdate(session.requester, { $inc: { totalSessions: 1 } });
      await User.findByIdAndUpdate(session.provider, { $inc: { totalSessions: 1 } });
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete/cancel session
router.delete('/:id', protect, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Not found' });
    if (session.requester.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    await session.deleteOne();
    res.json({ message: 'Session cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
