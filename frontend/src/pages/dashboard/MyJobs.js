import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Button from '../../components/forms/Button';
import { 
  Briefcase, Plus, Users, Eye, Edit, Trash2, 
  Calendar, MapPin, IndianRupee, MoreVertical 
} from 'lucide-react';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobAPI.getMyJobs();
      setJobs(response.data.jobs);
      
      // Calculate stats
      const totalJobs = response.data.jobs.length;
      const activeJobs = response.data.jobs.filter(job => job.isActive).length;
      const totalApplications = response.data.jobs.reduce((sum, job) => sum + job.applications.length, 0);
      
      setStats({ totalJobs, activeJobs, totalApplications });
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.deleteJob(jobId);
        setJobs(jobs.filter(job => job._id !== jobId));
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job. Please try again.');
      }
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    if (filter === 'active') return job.isActive;
    if (filter === 'inactive') return !job.isActive;
    return true;
  });

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Not specified';
    
    const min = salary.min ? `${salary.min.toLocaleString()}` : '';
    const max = salary.max ? `${salary.max.toLocaleString()}` : '';
    
    if (min && max) return `${min} - ${max}`;
    if (min) return `From ${min}`;
    if (max) return `Up to ${max}`;
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

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Job Postings</h1>
            <p className="text-gray-600">Manage your job listings and track applications</p>
          </div>
          <Link to="/post-job">
            <Button variant="primary" icon={Plus}>
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs || 0}</p>
              </div>
              <Briefcase className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeJobs || 0}</p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalApplications || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'All Jobs' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 mr-3">
                            {job.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {job.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{job.location}</span>
                            {job.remote && (
                              <span className="ml-2 bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                                Remote
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center">
                            <IndianRupee className="w-4 h-4 mr-2" />
                            <span>{formatSalary(job.salary)}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {job.description.length > 200 
                            ? `${job.description.substring(0, 200)}...` 
                            : job.description
                          }
                        </p>

                        {/* Application Stats */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                              <p className="text-lg font-semibold text-gray-900">
                                {job.applicationStats?.total || 0}
                              </p>
                              <p className="text-xs text-gray-600">Total</p>
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-yellow-600">
                                {job.applicationStats?.pending || 0}
                              </p>
                              <p className="text-xs text-gray-600">Pending</p>
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-green-600">
                                {job.applicationStats?.shortlisted || 0}
                              </p>
                              <p className="text-xs text-gray-600">Shortlisted</p>
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-red-600">
                                {job.applicationStats?.rejected || 0}
                              </p>
                              <p className="text-xs text-gray-600">Rejected</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:ml-6 mt-4 lg:mt-0 flex flex-col space-y-2">
                    <Link to={`/jobs/${job._id}`}>
                      <Button variant="ghost" size="sm" icon={Eye} className="w-full lg:w-auto">
                        View
                      </Button>
                    </Link>
                    
                    <Link to={`/dashboard/jobs/${job._id}/edit`}>
                      <Button variant="ghost" size="sm" icon={Edit} className="w-full lg:w-auto">
                        Edit
                      </Button>
                    </Link>
                    
                    <Link to={`/dashboard/jobs/${job._id}/applicants`}>
                      <Button variant="ghost" size="sm" icon={Users} className="w-full lg:w-auto">
                        Applicants
                      </Button>
                    </Link>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon={Trash2} 
                      onClick={() => handleDeleteJob(job._id)}
                      className="w-full lg:w-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No jobs posted yet' : `No ${filter} jobs`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Get started by posting your first job listing.' 
                : `You don't have any ${filter} jobs at the moment.`
              }
            </p>
            <Link to="/post-job">
              <Button variant="primary" icon={Plus}>
                Post Your First Job
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyJobs;