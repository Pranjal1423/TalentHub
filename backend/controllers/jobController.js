const Job = require('../models/Job');
const User = require('../models/User');

// CREATE JOB (Only Employers)
exports.createJob = async (req, res) => {
  try {
    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Only employers can create job postings'
      });
    }

    const {
      title, company, description, requirements, salary,
      location, type, category, skills, experience, remote, deadline
    } = req.body;

    // Validate required fields
    if (!title || !company || !description || !requirements || !location || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, company, description, requirements, location, category'
      });
    }

    // Create new job
    const job = new Job({
      title,
      company,
      description,
      requirements,
      salary,
      location,
      type: type || 'full-time',
      category,
      skills: skills || [],
      experience: experience || 'entry',
      remote: remote || false,
      deadline,
      employer: req.user._id  // Link job to current user
    });

    await job.save();

    // Populate employer info for response
    await job.populate('employer', 'name email company');

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating job'
    });
  }
};

// GET ALL JOBS (Public with Search & Filters)
exports.getJobs = async (req, res) => {
  try {
    const { 
      search, location, type, category, remote, 
      experience, minSalary, maxSalary,
      page = 1, limit = 10, sortBy = 'createdAt'
    } = req.query;
    
    // Build search query
    let query = { isActive: true };
    
    // Text search across title, description, and company
    if (search) {
      query.$text = { $search: search };
    }
    
    // Location filter (case-insensitive partial match)
    if (location) {
      query.location = new RegExp(location, 'i');
    }
    
    // Job type filter
    if (type) {
      query.type = type;
    }
    
    // Category filter (case-insensitive partial match)
    if (category) {
      query.category = new RegExp(category, 'i');
    }
    
    // Remote work filter
    if (remote === 'true') {
      query.remote = true;
    }
    
    // Experience level filter
    if (experience) {
      query.experience = experience;
    }
    
    // Salary range filters
    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.min = { $gte: parseInt(minSalary) };
      if (maxSalary) query.salary.max = { $lte: parseInt(maxSalary) };
    }

    // Pagination calculations
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'salary':
        sortOptions = { 'salary.min': -1 };
        break;
      case 'date':
        sortOptions = { createdAt: -1 };
        break;
      case 'title':
        sortOptions = { title: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Execute query with pagination
    const jobs = await Job.find(query)
      .populate('employer', 'name email company')
      .sort(sortOptions)
      .limit(limitNumber)
      .skip(skip);

    // Get total count for pagination
    const total = await Job.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.json({
      success: true,
      jobs,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalJobs: total,
        hasNextPage,
        hasPrevPage,
        limit: limitNumber
      },
      filters: {
        search,
        location,
        type,
        category,
        remote,
        experience,
        minSalary,
        maxSalary
      }
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching jobs'
    });
  }
};

// GET SINGLE JOB BY ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name email company')
      .populate('applications.applicant', 'name email profile');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // If user is the employer, show all application details
    // If user is a job seeker, hide other applications
    let responseJob = job.toObject();
    
    if (req.user && req.user._id.toString() !== job.employer._id.toString()) {
      // Not the employer - hide sensitive application data
      responseJob.applications = responseJob.applications.filter(
        app => app.applicant._id.toString() === req.user._id.toString()
      );
    }

    res.json({
      success: true,
      job: responseJob
    });

  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching job'
    });
  }
};

// APPLY FOR JOB (Only Job Seekers)
exports.applyForJob = async (req, res) => {
  try {
    // Check if user is a job seeker
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({
        success: false,
        message: 'Only job seekers can apply for jobs'
      });
    }

    const { jobId } = req.params;
    const { coverLetter } = req.body;

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if job is still active
    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This job posting is no longer active'
      });
    }

    // Check application deadline
    if (job.deadline && new Date() > job.deadline) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    // Check if user already applied
    const existingApplication = job.applications.find(
      app => app.applicant.toString() === req.user._id.toString()
    );

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Add application to job
    job.applications.push({
      applicant: req.user._id,
      coverLetter: coverLetter || '',
      appliedAt: new Date(),
      status: 'pending'
    });

    await job.save();

    res.json({
      success: true,
      message: 'Application submitted successfully',
      application: {
        jobId: job._id,
        title: job.title,
        company: job.company,
        appliedAt: new Date(),
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting application'
    });
  }
};

// GET JOBS POSTED BY CURRENT EMPLOYER
exports.getMyJobs = async (req, res) => {
  try {
    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Only employers can view their job postings'
      });
    }

    const jobs = await Job.find({ employer: req.user._id })
      .populate('applications.applicant', 'name email profile')
      .sort({ createdAt: -1 });

    // Add application statistics
    const jobsWithStats = jobs.map(job => {
      const jobObj = job.toObject();
      jobObj.applicationStats = {
        total: job.applications.length,
        pending: job.applications.filter(app => app.status === 'pending').length,
        reviewed: job.applications.filter(app => app.status === 'reviewed').length,
        shortlisted: job.applications.filter(app => app.status === 'shortlisted').length,
        rejected: job.applications.filter(app => app.status === 'rejected').length
      };
      return jobObj;
    });

    res.json({
      success: true,
      jobs: jobsWithStats,
      totalJobs: jobs.length
    });

  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your jobs'
    });
  }
};

// GET APPLICATIONS FOR CURRENT JOB SEEKER
exports.getMyApplications = async (req, res) => {
  try {
    // Check if user is a job seeker
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({
        success: false,
        message: 'Only job seekers can view their applications'
      });
    }

    // Find all jobs where user has applied
    const jobs = await Job.find({
      'applications.applicant': req.user._id
    }).populate('employer', 'name email company');

    // Extract application data
    const applications = [];
    jobs.forEach(job => {
      const userApplication = job.applications.find(
        app => app.applicant.toString() === req.user._id.toString()
      );
      
      if (userApplication) {
        applications.push({
          id: userApplication._id,
          job: {
            id: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            salary: job.salary
          },
          employer: job.employer,
          appliedAt: userApplication.appliedAt,
          status: userApplication.status,
          coverLetter: userApplication.coverLetter
        });
      }
    });

    // Sort by application date (newest first)
    applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    res.json({
      success: true,
      applications,
      totalApplications: applications.length,
      statusBreakdown: {
        pending: applications.filter(app => app.status === 'pending').length,
        reviewed: applications.filter(app => app.status === 'reviewed').length,
        shortlisted: applications.filter(app => app.status === 'shortlisted').length,
        rejected: applications.filter(app => app.status === 'rejected').length
      }
    });

  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your applications'
    });
  }
};

// UPDATE APPLICATION STATUS (Only Employers)
exports.updateApplicationStatus = async (req, res) => {
  try {
    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Only employers can update application status'
      });
    }

    const { jobId, applicationId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, reviewed, shortlisted, or rejected'
      });
    }

    // Find the job and verify ownership
    const job = await Job.findOne({ _id: jobId, employer: req.user._id });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you are not authorized to modify it'
      });
    }

    // Find and update the application
    const application = job.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.status = status;
    await job.save();

    res.json({
      success: true,
      message: `Application status updated to ${status}`,
      application: {
        id: application._id,
        status: application.status,
        appliedAt: application.appliedAt
      }
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating application status'
    });
  }
};

// UPDATE JOB (Only Job Owner)
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find job and verify ownership
    const job = await Job.findOne({ _id: id, employer: req.user._id });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you are not authorized to modify it'
      });
    }

    // Update job with new data
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        job[key] = updates[key];
      }
    });

    await job.save();
    await job.populate('employer', 'name email company');

    res.json({
      success: true,
      message: 'Job updated successfully',
      job
    });

  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating job'
    });
  }
};

// DELETE JOB (Only Job Owner)
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Find job and verify ownership
    const job = await Job.findOne({ _id: id, employer: req.user._id });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you are not authorized to delete it'
      });
    }

    // Soft delete - just mark as inactive
    job.isActive = false;
    await job.save();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting job'
    });
  }
};