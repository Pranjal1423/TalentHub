import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Button from '../../components/forms/Button';
import { 
  FileText, Clock, Eye, CheckCircle, AlertCircle, 
  Calendar, MapPin, Building, ExternalLink, Filter 
} from 'lucide-react';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, filter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await jobAPI.getMyApplications();
      setApplications(response.data.applications);
      setStats(response.data.statusBreakdown);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    if (filter === 'all') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter(app => app.status === filter));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'reviewed':
        return <Eye className="w-5 h-5 text-blue-500" />;
      case 'shortlisted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'reviewed': 'bg-blue-100 text-blue-800 border-blue-200',
      'shortlisted': 'bg-green-100 text-green-800 border-green-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusMessage = (status) => {
    const messages = {
      'pending': 'Your application is under review',
      'reviewed': 'Your application has been reviewed',
      'shortlisted': 'Congratulations! You\'ve been shortlisted',
      'rejected': 'Unfortunately, your application was not selected'
    };
    return messages[status] || 'Status unknown';
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track the status of your job applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
              </div>
              <FileText className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-green-600">{stats.shortlisted || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected || 0}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Filter by status:</span>
            
            <div className="flex space-x-2">
              {[
                { value: 'all', label: 'All Applications' },
                { value: 'pending', label: 'Pending' },
                { value: 'reviewed', label: 'Reviewed' },
                { value: 'shortlisted', label: 'Shortlisted' },
                { value: 'rejected', label: 'Rejected' }
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
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {application.job.title}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Building className="w-4 h-4 mr-2" />
                          <span className="font-medium">{application.job.company}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{application.job.location}</span>
                          {application.job.type && (
                            <span className="ml-4 bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                              {application.job.type.replace('-', ' ').toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className={`px-4 py-2 rounded-lg border ${getStatusColor(application.status)} flex items-center`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-2 font-medium capitalize">{application.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Applied on {new Date(application.appliedAt).toLocaleDateString()}</span>
                      </div>
                      
                      {application.job.salary && (
                        <div className="flex items-center">
                          <span>Salary: ${application.job.salary.min?.toLocaleString()} - ${application.job.salary.max?.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700">{getStatusMessage(application.status)}</p>
                    </div>

                    {application.coverLetter && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Your Cover Letter:</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded p-3">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="lg:ml-6 mt-4 lg:mt-0">
                    <Link to={`/jobs/${application.job.id}`}>
                      <Button variant="ghost" icon={ExternalLink}>
                        View Job
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Start applying for jobs to see them here.' 
                : `You don't have any ${filter} applications at the moment.`
              }
            </p>
            <Link to="/jobs">
              <Button variant="primary" icon={ExternalLink}>
                Browse Jobs
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applications;