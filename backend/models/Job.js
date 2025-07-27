const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // Basic Job Information
  title: {
    type: String,
    required: true,
    trim: true              // Remove extra spaces
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true          // Detailed job description
  },
  requirements: {
    type: String,
    required: true          // Job requirements and qualifications
  },
  
  // Salary Information (nested object)
  salary: {
    min: Number,            // Minimum salary
    max: Number,            // Maximum salary
    currency: {
      type: String,
      default: 'INR'        // Default currency
    }
  },
  
  // Job Classification
  location: {
    type: String,
    required: true          // Job location
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    default: 'full-time'
  },
  category: {
    type: String,
    required: true          // e.g., "Technology", "Marketing"
  },
  skills: [String],         // Array of required skills
  experience: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive'],
    default: 'entry'
  },
  remote: {
    type: Boolean,          // true/false for remote work
    default: false
  },
  
  // Relationship to User who posted the job
  employer: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User document
    ref: 'User',                          // Which model to reference
    required: true
  },
  
  // Job Applications (array of objects)
  applications: [{
    applicant: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now       // Automatically set current date
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
      default: 'pending'
    },
    coverLetter: String       // Optional cover letter
  }],
  
  // Job Status
  isActive: {
    type: Boolean,
    default: true             // Job is active by default
  },
  deadline: Date              // Application deadline
}, {
  timestamps: true            // createdAt and updatedAt
});

// TEXT INDEX for search functionality
jobSchema.index({ 
  title: 'text',        // Enable text search on title
  description: 'text',  // Enable text search on description  
  company: 'text'       // Enable text search on company
});

module.exports = mongoose.model('Job', jobSchema);