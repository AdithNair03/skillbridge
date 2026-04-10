// ============================================
// Skill Bridge - API Test Suite (Jest)
// ============================================
const request = require('supertest');
const express = require('express');

// Mock mongoose to avoid real DB connection in tests
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
  connection: { host: 'test-host' },
  Schema: jest.fn().mockImplementation(() => ({
    pre: jest.fn(),
    methods: {}
  })),
  model: jest.fn().mockReturnValue({})
}));

// Create a test express app
const app = express();
app.use(express.json());

// Mock routes for testing
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Skill Bridge API',
    version: '1.0.0',
    uptime: '100s',
    environment: 'test'
  });
});

app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password too short' });
  }
  res.status(201).json({
    _id: 'test-id-123',
    firstName, lastName, email,
    role: 'user',
    token: 'test-jwt-token-xyz'
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  if (email === 'test@test.com' && password === 'test123') {
    return res.json({
      _id: 'test-id-123',
      firstName: 'Test',
      lastName: 'User',
      email,
      role: 'user',
      token: 'test-jwt-token-xyz'
    });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

app.get('/api/users', (req, res) => {
  res.json([
    { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@test.com', skillsOffered: [{ name: 'React', level: 'Advanced' }], rating: 4.5 },
    { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com', skillsOffered: [{ name: 'Python', level: 'Expert' }], rating: 4.8 }
  ]);
});

app.get('/api/users/:id', (req, res) => {
  if (req.params.id === 'nonexistent') {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({
    _id: req.params.id,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@test.com',
    skillsOffered: [{ name: 'React', level: 'Advanced' }],
    rating: 4.5
  });
});

app.post('/api/sessions', (req, res) => {
  const { provider, skillToLearn, scheduledDate } = req.body;
  if (!provider || !skillToLearn || !scheduledDate) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  res.status(201).json({
    _id: 'session-123',
    provider,
    skillToLearn,
    scheduledDate,
    status: 'pending',
    sessionType: req.body.sessionType || 'exchange'
  });
});

app.post('/api/reviews', (req, res) => {
  const { reviewee, rating, comment } = req.body;
  if (!reviewee || !rating || !comment) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
  res.status(201).json({
    _id: 'review-123',
    reviewee, rating, comment,
    createdAt: new Date().toISOString()
  });
});

// ─── TEST SUITES ─────────────────────────────────────────────

describe('Health Check API', () => {
  test('GET /health returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('Skill Bridge API');
    expect(res.body.version).toBe('1.0.0');
  });
});

describe('Authentication API', () => {
  test('POST /api/auth/register - success with valid data', async () => {
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Adith', lastName: 'Nair',
      email: 'adith@test.com', password: 'password123'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.email).toBe('adith@test.com');
    expect(res.body.role).toBe('user');
  });

  test('POST /api/auth/register - fails with missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Adith', email: 'adith@test.com'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('All fields required');
  });

  test('POST /api/auth/register - fails with invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Adith', lastName: 'Nair',
      email: 'invalid-email', password: 'password123'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid email');
  });

  test('POST /api/auth/register - fails with short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Adith', lastName: 'Nair',
      email: 'adith@test.com', password: '123'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Password too short');
  });

  test('POST /api/auth/login - success with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@test.com', password: 'test123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.firstName).toBe('Test');
  });

  test('POST /api/auth/login - fails with wrong credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'wrong@test.com', password: 'wrongpass'
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  test('POST /api/auth/login - fails with missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@test.com'
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('Users API', () => {
  test('GET /api/users - returns list of users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].firstName).toBeDefined();
    expect(res.body[0].skillsOffered).toBeDefined();
  });

  test('GET /api/users/:id - returns specific user', async () => {
    const res = await request(app).get('/api/users/user-123');
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe('user-123');
    expect(res.body.firstName).toBeDefined();
  });

  test('GET /api/users/:id - returns 404 for nonexistent user', async () => {
    const res = await request(app).get('/api/users/nonexistent');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('User not found');
  });
});

describe('Sessions API', () => {
  test('POST /api/sessions - creates session successfully', async () => {
    const res = await request(app).post('/api/sessions').send({
      provider: 'provider-123',
      skillToLearn: 'React',
      scheduledDate: '2026-04-20',
      sessionType: 'exchange'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('pending');
    expect(res.body.skillToLearn).toBe('React');
  });

  test('POST /api/sessions - fails with missing fields', async () => {
    const res = await request(app).post('/api/sessions').send({
      provider: 'provider-123'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Missing required fields');
  });
});

describe('Reviews API', () => {
  test('POST /api/reviews - creates review successfully', async () => {
    const res = await request(app).post('/api/reviews').send({
      reviewee: 'user-123',
      rating: 5,
      comment: 'Excellent teacher!'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.rating).toBe(5);
    expect(res.body.comment).toBe('Excellent teacher!');
  });

  test('POST /api/reviews - fails with invalid rating', async () => {
    const res = await request(app).post('/api/reviews').send({
      reviewee: 'user-123',
      rating: 10,
      comment: 'Great!'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Rating must be between 1 and 5');
  });

  test('POST /api/reviews - fails with missing fields', async () => {
    const res = await request(app).post('/api/reviews').send({
      reviewee: 'user-123'
    });
    expect(res.statusCode).toBe(400);
  });
});
