const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema defines the structure of our user documents
const userSchema = new mongoose.Schema({
  // Basic Authentication Fields
  name: {
    type: String,        // Data type must be text
    required: true,      // This field is mandatory
    trim: true          // Removes extra spaces
  },
  email: {
    type: String,
    required: true,
    unique: true,        // No duplicate emails allowed
    lowercase: true      // Converts to lowercase automatically
  },
  password: {
    type: String,
    required: true,
    minlength: 6        // Password must be at least 6 characters
  },
  
  // User Role System
  role: {
    type: String,
    enum: ['jobseeker', 'employer'], // Only these values allowed
    default: 'jobseeker'             // Default role if not specified
  },
  
  // Job Seeker Profile (nested object)
  profile: {
    resume: String,           // URL to resume file
    skills: [String],         // Array of skill strings
    experience: String,       // Years of experience
    education: String,        // Educational background
    phone: String,           // Contact number
    location: String         // Current location
  },
  
  // Employer Company Info (nested object)
  company: {
    name: String,            // Company name
    description: String,     // Company description
    website: String,         // Company website URL
    location: String         // Company headquarters
  }
}, {
  timestamps: true           // Automatically adds createdAt and updatedAt
});

// PRE-SAVE MIDDLEWARE - Runs before saving user to database
userSchema.pre('save', async function(next) {
  // Only hash password if it's been modified
  if (!this.isModified('password')) return next();
  
  // Hash the password with salt rounds = 12
  this.password = await bcrypt.hash(this.password, 12);
  next(); // Continue with save operation
});

// INSTANCE METHOD - Can be called on any user document
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Compare plain text password with hashed password
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the model
module.exports = mongoose.model('User', userSchema);