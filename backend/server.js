const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDatabase();

const app = express();

// CORS Middleware - Handle multiple deployment URLs
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://talenthub-frontend-mu.vercel.app',
      'https://talenthub-frontend-11n8b8cfx-pranjal1423s-projects.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.CLIENT_URL
    ];
    
    // Allow any Vercel deployment URL for your project
    const isVercelDomain = origin && (
      origin.includes('talenthub-frontend') && 
      origin.includes('vercel.app')
    );
    
    if (allowedOrigins.includes(origin) || isVercelDomain) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Body parsing middleware - CRITICAL
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TalentHub API is running!',
    status: 'success',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      health: '/health'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Connected',
    authentication: 'JWT System Active',
    jobs: 'Job Management Active',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler - Must be after all routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler - Must be last
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  // CORS error
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: 'CORS policy error'
    });
  }
  
  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  // Validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // Default server error
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 Authentication: JWT Active`);
  console.log(`💼 Jobs: Management System Active`);
  console.log(`🌐 CORS: Configured for production`);
});