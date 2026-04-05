const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionType: { type: String, enum: ['exchange', 'paid'], required: true },
  skillToLearn: { type: String, required: true },
  skillToTeach: { type: String },
  duration: { type: Number, default: 60 }, // in minutes
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  message: { type: String, default: '' },
  price: { type: Number, default: 0 },
  meetingLink: { type: String, default: '' },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
