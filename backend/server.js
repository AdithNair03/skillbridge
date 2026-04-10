const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { requestMonitor, healthCheck } = require('./monitoring/middleware');

dotenv.config();
connectDB();

const app = express();

// ─── MONITORING MIDDLEWARE ───────────────────────────────────
app.use(requestMonitor);

// ─── CORE MIDDLEWARE ─────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── HEALTH CHECK (for monitoring) ──────────────────────────
app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

// ─── API ROUTES ──────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));

// ─── ROOT ────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({
  message: '🚀 Skill Bridge API is running!',
  version: '1.0.0',
  docs: '/health',
  environment: process.env.NODE_ENV
}));

// ─── ERROR HANDLER ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});
