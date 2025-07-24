const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (authentication required)
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);

// Health check for auth system
router.get('/check', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Authentication is working',
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role
    }
  });
});

module.exports = router;