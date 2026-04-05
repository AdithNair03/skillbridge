const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Beginner' },
  category: String,
  studentsCount: { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  skillsOffered: [skillSchema],
  skillsWanted: [skillSchema],
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  totalSessions: { type: Number, default: 0 },
  totalStudents: { type: Number, default: 0 },
  responseTime: { type: String, default: '< 24 hrs' },
  successRate: { type: Number, default: 100 },
  isVerified: { type: Boolean, default: false },
  isTopRated: { type: Boolean, default: false },
  isPro: { type: Boolean, default: false },
  hourlyRate: { type: Number, default: 0 },
  memberSince: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
