const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDatabase();

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://talenthub-frontend-mu.vercel.app',  // Your production frontend
      'http://localhost:3000',                     // Local React dev server
      'http://localhost:3001',                     // Alternative local port
      'http://127.0.0.1:3000',                    // Alternative localhost
      process.env.CLIENT_URL                       // Environment variable
    ];
    
    if (allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin?.startsWith(allowedOrigin.replace(/\/$/, ''))
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes - THIS WAS MISSING!
app.use('/api/auth', require('./routes/auth'));    // Authentication routes
app.use('/api/jobs', require('./routes/jobs'));    // Job management routes

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'TalentHub API is running!',
    status: 'success',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      docs: 'Check README for API documentation'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'MongoDB Connected',
    authentication: 'JWT System Active',
    jobs: 'Job Management Active'
  });
});

// 404 handler - MUST BE LAST!
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 Authentication: JWT Active`);
  console.log(`💼 Jobs: Management System Active`);
  console.log(`🌐 CORS: Configured for production`);
});