const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT tokens
const generateToken = (userId) => {
  return jwt.sign(
    { userId },                    // Payload (data to include)
    process.env.JWT_SECRET,        // Secret key for signing
    { expiresIn: process.env.JWT_EXPIRE || '7d' } // Token expires in 7 days
  );
};

// USER REGISTRATION
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, profile, company } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user (password will be automatically hashed by our User model)
    const user = new User({
      name,
      email,
      password,
      role: role || 'jobseeker', // Default to jobseeker if not specified
      profile: role === 'jobseeker' ? profile : undefined,
      company: role === 'employer' ? company : undefined
    });

    // Save user to database
    await user.save();

    // Generate JWT token for immediate login
    const token = generateToken(user._id);

    // Send response (don't include password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// USER LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password using our User model method
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Send success response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        company: user.company
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// GET USER PROFILE (Protected Route)
exports.getProfile = async (req, res) => {
  try {
    // req.user is set by our auth middleware
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
};

// UPDATE USER PROFILE (Protected Route)
exports.updateProfile = async (req, res) => {
  try {
    const { name, profile, company } = req.body;
    
    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (profile && req.user.role === 'jobseeker') updateData.profile = profile;
    if (company && req.user.role === 'employer') updateData.company = company;

    // Update user in database
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};