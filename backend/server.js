const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database'); // Import our DB connection

// Load environment variables
dotenv.config();

// Connect to database
connectDatabase();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'TalentHub Backend is working!',
    status: 'success',
    database: 'Connected to MongoDB' 
  });
});

// Health check with database status
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'MongoDB Connected'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});