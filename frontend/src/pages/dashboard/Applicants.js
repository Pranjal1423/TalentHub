import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Button from '../../components/forms/Button';
import { 
  Users, Eye, CheckCircle, XCircle, Clock, 
  ArrowLeft, Mail, Phone, MapPin, Calendar 
} from 'lucide-react';

const Applicants = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobAPI.getMyJobs();
      const jobsWithApplications = response.data.jobs.filter(job => job.applications.length > 0);
      setJobs(jobsWithApplications);
      
      if (jobsWithApplications.length > 0) {
        setSelectedJob(jobsWithApplications[0]);
        setApplications(jobsWithApplications[0].applications);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setApplications(job.applications);
  };

  const updateApplicationStatus = async (applicationId, status) => {
    setUpdating(true);
    try {
      await jobAPI.updateApplicationStatus(selectedJob._id, applicationId, status);
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId ? { ...app, status } : app
        )
      );
      
      // Update jobs state
      setJobs(prev => 
        prev.map(job => 
          job._id === selectedJob._id 
            ? { ...job, applications: job.applications.map(app => 
                app._id === applicationId ? { ...app, status } : app
              )}
            : job
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    } finally {
      setUpdating(false);
    }
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
        return <Eye className="w-4 h-4" />;
      case 'shortlisted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (jobs.length === 0) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <Users className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">No Applications Yet</h2>
            <p className="mt-2 text-gray-600">
              You haven't received any applications for your job postings yet.
            </p>
            <div className="mt-6">
              <Link to="/post-job">
                <Button variant="primary" icon={Eye}>
                  Post More Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Review Applications</h1>
            <p className="text-gray-600 mt-2">
              Manage and review applications for your job postings
            </p>
          </div>
          <Link to="/dashboard">
            <Button variant="ghost" icon={ArrowLeft}>
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Job</h2>
              <div className="space-y-3">
                {jobs.map((job) => (
                  <button
                    key={job._id}
                    onClick={() => handleJobSelect(job)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedJob?._id === job._id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {job.applications.length} application{job.applications.length !== 1 ? 's' : ''}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {selectedJob ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Applications for {selectedJob.title}
                    </h2>
                    <p className="text-gray-600">
                      {applications.length} application{applications.length !== 1 ? 's' : ''} received
                    </p>
                  </div>

                  {applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <div key={application._id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {application.applicant.name}
                              </h3>
                              <p className="text-gray-600">{application.applicant.email}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(application.status)}`}>
                                {getStatusIcon(application.status)}
                                <span className="ml-1 capitalize">{application.status}</span>
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-4 h-4 mr-2" />
                              {application.applicant.email}
                            </div>
                            {application.applicant.phone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-4 h-4 mr-2" />
                                {application.applicant.phone}
                              </div>
                            )}
                            {application.applicant.location && (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-2" />
                                {application.applicant.location}
                              </div>
                            )}
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              Applied {new Date(application.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          {application.coverLetter && (
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                                {application.coverLetter}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center space-x-3">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => updateApplicationStatus(application._id, 'shortlisted')}
                              disabled={updating || application.status === 'shortlisted'}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Shortlist
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateApplicationStatus(application._id, 'reviewed')}
                              disabled={updating || application.status === 'reviewed'}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Mark Reviewed
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateApplicationStatus(application._id, 'rejected')}
                              disabled={updating || application.status === 'rejected'}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Applications for this job will appear here.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Select a job to view applications</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a job from the list to see its applications.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Applicants; 