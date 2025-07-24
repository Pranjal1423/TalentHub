const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This function will run before protected routes
const auth = async (req, res, next) => {
  try {
    // Extract token from request header
    // Expected format: "Bearer your_jwt_token_here"
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user associated with this token
    const user = await User.findById(decoded.userId).select('-password');

    // Check if user still exists
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Token is valid but user no longer exists.' 
      });
    }

    // Add user info to request object (available in next functions)
    req.user = user;
    
    // Continue to the actual route handler
    next();
    
  } catch (error) {
    // Token is invalid or expired
    res.status(401).json({ 
      success: false,
      message: 'Invalid or expired token.' 
    });
  }
};

module.exports = auth;