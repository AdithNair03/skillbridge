// ============================================
// Skill Bridge - Production Logger & Monitor
// ============================================
const fs = require('fs');
const path = require('path');

const LOG_LEVELS = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 };
const currentLevel = process.env.LOG_LEVEL || 'INFO';

const formatLog = (level, message, meta = {}) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    service: 'skillbridge-api',
    message,
    ...meta,
    environment: process.env.NODE_ENV || 'development'
  });
};

const logger = {
  error: (msg, meta) => {
    const log = formatLog('ERROR', msg, meta);
    console.error(log);
  },
  warn: (msg, meta) => {
    const log = formatLog('WARN', msg, meta);
    console.warn(log);
  },
  info: (msg, meta) => {
    const log = formatLog('INFO', msg, meta);
    console.log(log);
  },
  debug: (msg, meta) => {
    if (LOG_LEVELS[currentLevel] >= LOG_LEVELS.DEBUG) {
      const log = formatLog('DEBUG', msg, meta);
      console.log(log);
    }
  }
};

module.exports = logger;
