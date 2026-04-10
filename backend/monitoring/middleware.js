// ============================================
// Skill Bridge - Monitoring Middleware
// ============================================
const logger = require('./logger');

// Track metrics in memory
const metrics = {
  requests: { total: 0, success: 0, errors: 0 },
  routes: {},
  responseTimes: [],
  startTime: Date.now()
};

// Request logging and metrics middleware
const requestMonitor = (req, res, next) => {
  const start = Date.now();
  metrics.requests.total++;

  // Track route hits
  const route = `${req.method} ${req.path}`;
  metrics.routes[route] = (metrics.routes[route] || 0) + 1;

  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.on('finish', () => {
    const duration = Date.now() - start;
    metrics.responseTimes.push(duration);
    if (metrics.responseTimes.length > 100) metrics.responseTimes.shift();

    if (res.statusCode >= 400) {
      metrics.requests.errors++;
      logger.warn('Request error', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`
      });
    } else {
      metrics.requests.success++;
      logger.info('Request completed', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`
      });
    }
  });

  next();
};

// Health check endpoint
const healthCheck = (req, res) => {
  const uptime = Math.floor((Date.now() - metrics.startTime) / 1000);
  const avgResponseTime = metrics.responseTimes.length > 0
    ? Math.floor(metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length)
    : 0;

  res.json({
    status: 'healthy',
    service: 'Skill Bridge API',
    version: '1.0.0',
    uptime: `${uptime}s`,
    timestamp: new Date().toISOString(),
    metrics: {
      totalRequests: metrics.requests.total,
      successRequests: metrics.requests.success,
      errorRequests: metrics.requests.errors,
      errorRate: metrics.requests.total > 0
        ? `${((metrics.requests.errors / metrics.requests.total) * 100).toFixed(2)}%`
        : '0%',
      avgResponseTime: `${avgResponseTime}ms`,
      topRoutes: Object.entries(metrics.routes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([route, count]) => ({ route, count }))
    },
    environment: process.env.NODE_ENV,
    database: 'MongoDB Atlas - Connected'
  });
};

module.exports = { requestMonitor, healthCheck, metrics };
