/**
 * Express Application Setup
 * Configures middleware and routes
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

// something randon

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors(config.cors));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: {
      message: 'Too many requests, please try again later',
      code: 'RATE_LIMITED',
      status: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts, please try again later',
      code: 'AUTH_RATE_LIMITED',
      status: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Request logging
if (config.env === 'development' || config.env === 'test' || config.env === 'staging' || config.env === 'local' || config.env === 'development') {
  app.use(morgan('dev'));
} else if (config.env === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// API routes
app.use(`/api/${config.apiVersion}`, routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'AuthX API',
    version: config.apiVersion,
    description: 'Production-grade authentication and authorization service',
    documentation: `/api/${config.apiVersion}/docs`,
    health: `/api/${config.apiVersion}/health`,
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
