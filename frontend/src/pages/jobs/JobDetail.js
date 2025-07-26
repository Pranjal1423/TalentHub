import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobAPI } from '../../services/api';
import Button from '../../components/forms/Button';
import { 
  MapPin, Clock, IndianRupee, Building, Users, Calendar,
  ArrowLeft, ExternalLink, Briefcase, CheckCircle, AlertCircle
} from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await jobAPI.getJobById(id);
      setJob(response.data.job);
      
      // Check if user has already applied
      if (isAuthenticated && user && response.data.job.applications) {
        const userApplication = response.data.job.applications.find(
          app => app.applicant._id === user.id
        );
        if (userApplication) {
          setApplicationStatus(userApplication.status);
        }
      }
    } catch (err) {
      setError('Failed to fetch job details. Please try again.');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }

    if (user.role !== 'jobseeker') {
      alert('Only job seekers can apply for jobs.');
      return;
    }

    setApplying(true);
    
    try {
      await jobAPI.applyForJob(id, { coverLetter });
      setApplicationStatus('pending');
      setShowApplicationForm(false);
      setCoverLetter('');
      
      // Refresh job data to get updated applications
      fetchJob();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit application. Please try again.';
      alert(message);
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Salary not specified';
    
    const min = salary.min ? `₹${salary.min.toLocaleString()}` : '';
    const max = salary.max ? `₹${salary.max.toLocaleString()}` : '';
    
    if (min && max) return `${min} - ${max}`;
    if (min) return `From ${min}`;
    if (max) return `Up to ${max}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'reviewed': 'bg-blue-100 text-blue-800',
      'shortlisted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'reviewed':
        return <Users className="w-4 h-4" />;
      case 'shortlisted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button variant="primary" onClick={() => navigate('/jobs')}>
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Button variant="primary" onClick={() => navigate('/jobs')}>
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/jobs')}
            icon={ArrowLeft}
          >
            Back to Jobs
          </Button>
        </div>

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center text-lg text-gray-600 mb-4">
                <Building className="w-5 h-5 mr-2" />
                <span className="font-medium">{job.company}</span>
              </div>
              
              {/* Key Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{job.location}</span>
                  {job.remote && (
                    <span className="ml-2 bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">
                      Remote
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-gray-600">
                  <IndianRupee className="w-5 h-5 mr-2" />
                  <span>{formatSalary(job.salary)}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="capitalize">{job.experience} Level</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Job Type and Category */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {job.type.replace('-', ' ').toUpperCase()}
                </span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {job.category}
                </span>
              </div>
            </div>

            {/* Application Status or Button */}
            <div className="lg:ml-8 mt-6 lg:mt-0">
              {applicationStatus ? (
                <div className={`px-4 py-2 rounded-lg ${getStatusColor(applicationStatus)} flex items-center`}>
                  {getStatusIcon(applicationStatus)}
                  <span className="ml-2 font-medium capitalize">
                    Application {applicationStatus}
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  {!showApplicationForm ? (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => setShowApplicationForm(true)}
                      disabled={user?.role === 'employer'}
                      className="w-full lg:w-auto"
                    >
                      Apply Now
                    </Button>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-3">Cover Letter (Optional)</h3>
                      <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Tell the employer why you're interested in this position..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <div className="flex space-x-2 mt-3">
                        <Button
                          variant="primary"
                          onClick={handleApply}
                          loading={applying}
                          className="flex-1"
                        >
                          Submit Application
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setShowApplicationForm(false);
                            setCoverLetter('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {user?.role === 'employer' && (
                    <p className="text-sm text-gray-500 text-center">
                      Employers cannot apply for jobs
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Job Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                  {job.requirements}
                </p>
              </div>
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">{job.company}</p>
                  <p className="text-gray-600">{job.location}</p>
                </div>
                
                {job.employer?.company?.website && (
                  <a
                    href={job.employer.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Visit Website
                  </a>
                )}
                
                {job.employer?.company?.description && (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {job.employer.company.description}
                  </p>
                )}
              </div>
            </div>

            {/* Job Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Job Type:</span>
                  <span className="font-medium capitalize">{job.type.replace('-', ' ')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium capitalize">{job.experience} Level</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Remote Work:</span>
                  <span className="font-medium">{job.remote ? 'Yes' : 'No'}</span>
                </div>
                
                {job.deadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadline:</span>
                    <span className="font-medium">
                      {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted:</span>
                  <span className="font-medium">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Share Job */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this Job</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Job link copied to clipboard!');
                  }}
                >
                  Copy Link
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    const text = `Check out this job: ${job.title} at ${job.company}`;
                    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
                    window.open(url, '_blank');
                  }}
                >
                  Share on Twitter
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
                    window.open(url, '_blank');
                  }}
                >
                  Share on LinkedIn
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;