const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const getConversationId = (id1, id2) => [id1, id2].sort().join('_');

// Get conversations list
router.get('/conversations', protect, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    }).populate('sender receiver', 'firstName lastName avatar').sort({ createdAt: -1 });

    const conversationMap = {};
    messages.forEach(msg => {
      const otherId = msg.sender._id.toString() === userId ? msg.receiver._id.toString() : msg.sender._id.toString();
      if (!conversationMap[otherId]) {
        conversationMap[otherId] = {
          user: msg.sender._id.toString() === userId ? msg.receiver : msg.sender,
          lastMessage: msg,
          unreadCount: (!msg.isRead && msg.receiver._id.toString() === userId) ? 1 : 0
        };
      } else if (!msg.isRead && msg.receiver._id.toString() === userId) {
        conversationMap[otherId].unreadCount++;
      }
    });
    res.json(Object.values(conversationMap));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get messages between two users
router.get('/:userId', protect, async (req, res) => {
  try {
    const conversationId = getConversationId(req.user._id.toString(), req.params.userId);
    const messages = await Message.find({ conversationId }).populate('sender receiver', 'firstName lastName avatar').sort({ createdAt: 1 });
    await Message.updateMany({ conversationId, receiver: req.user._id, isRead: false }, { isRead: true });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send message
router.post('/:userId', protect, async (req, res) => {
  try {
    const conversationId = getConversationId(req.user._id.toString(), req.params.userId);
    const message = await Message.create({
      sender: req.user._id, receiver: req.params.userId,
      content: req.body.content, conversationId
    });
    const populated = await message.populate('sender receiver', 'firstName lastName avatar');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
