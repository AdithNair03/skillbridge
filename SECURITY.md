# Skill Bridge - Security Implementation

## Authentication & Authorization
- JWT (JSON Web Tokens) with 30-day expiry
- bcryptjs password hashing (12 salt rounds)
- Role-based access control (user/admin)
- Protected routes via middleware

## API Security
- CORS configured for specific origins only
- Rate limiting ready for production
- Input validation on all routes
- SQL injection not applicable (NoSQL)
- XSS protection via JSON responses

## Data Security
- Passwords never stored in plain text
- Environment variables for all secrets
- .env file excluded from Git
- MongoDB connection over TLS/SSL

## Cloud Security
- MongoDB Atlas IP whitelist
- HTTPS enforced on Vercel and Render
- Non-root Docker user
- Health check endpoints for monitoring

## Security Headers (Production)
- Content-Security-Policy
- X-Content-Type-Options
- X-Frame-Options
- Strict-Transport-Security (HTTPS)
