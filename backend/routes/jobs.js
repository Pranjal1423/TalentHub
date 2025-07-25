const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', jobController.getJobs);           // GET /api/jobs - Browse all jobs
router.get('/:id', jobController.getJobById);    // GET /api/jobs/:id - View single job

// Protected routes (authentication required)
router.post('/', auth, jobController.createJob);                    // POST /api/jobs - Create job
router.get('/my/posted', auth, jobController.getMyJobs);           // GET /api/jobs/my/posted - Employer's jobs
router.get('/my/applications', auth, jobController.getMyApplications); // GET /api/jobs/my/applications - User's applications

router.post('/:jobId/apply', auth, jobController.applyForJob);      // POST /api/jobs/:jobId/apply - Apply for job
router.put('/:id', auth, jobController.updateJob);                 // PUT /api/jobs/:id - Update job
router.delete('/:id', auth, jobController.deleteJob);              // DELETE /api/jobs/:id - Delete job

// Application management routes
router.put('/:jobId/applications/:applicationId/status', auth, jobController.updateApplicationStatus);

module.exports = router;