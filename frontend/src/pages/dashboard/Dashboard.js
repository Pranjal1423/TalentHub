import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobAPI } from '../../services/api';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import JobCard from '../../components/jobs/JobCard';
import Button from '../../components/forms/Button';
import { 
  Briefcase, FileText, Users, TrendingUp, 
  Plus, Eye, Clock, CheckCircle, AlertCircle 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (user?.role === 'employer') {
        // Fetch employer data
        const jobsResponse = await jobAPI.getMyJobs();
        const jobs = jobsResponse.data.jobs;
        
        setRecentJobs(jobs.slice(0, 3));
        
        // Calculate stats
        const totalJobs = jobs.length;
        const activeJobs = jobs.filter(job => job.isActive).length;
        const totalApplications = jobs.reduce((sum, job) => sum + job.applications.length, 0);
        const pendingApplications = jobs.reduce((sum, job) => 
          sum + job.applications.filter(app => app.status === 'pending').length, 0
        );
        
        setStats({
          totalJobs,
          activeJobs,
          totalApplications,
          pendingApplications
        });
      } else {
        // Fetch job seeker data
        const applicationsResponse = await jobAPI.getMyApplications();
        const applications = applicationsResponse.data.applications;
        
        setRecentApplications(applications.slice(0, 5));
        
        // Calculate stats
        const totalApplications = applications.length;
        const pendingApplications = applications.filter(app => app.status === 'pending').length;
        const shortlistedApplications = applications.filter(app => app.status === 'shortlisted').length;
        const rejectedApplications = applications.filter(app => app.status === 'rejected').length;
        
        setStats({
          totalApplications,
          pendingApplications,
          shortlistedApplications,
          rejectedApplications
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getApplicationStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'reviewed':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'shortlisted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getApplicationStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'reviewed': 'bg-blue-100 text-blue-800',
      'shortlisted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'employer' 
              ? 'Manage your job postings and track applicants' 
              : 'Track your applications and discover new opportunities'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user?.role === 'employer' ? (
            <>
              <StatsCard
                title="Total Jobs Posted"
                value={stats.totalJobs || 0}
                icon={Briefcase}
                color="primary"
              />
              <StatsCard
                title="Active Jobs"
                value={stats.activeJobs || 0}
                icon={TrendingUp}
                color="green"
              />
              <StatsCard
                title="Total Applications"
                value={stats.totalApplications || 0}
                icon={FileText}
                color="blue"
              />
              <StatsCard
                title="Pending Reviews"
                value={stats.pendingApplications || 0}
                icon={Clock}
                color="orange"
              />
            </>
          ) : (
            <>
              <StatsCard
                title="Applications Sent"
                value={stats.totalApplications || 0}
                icon={FileText}
                color="primary"
              />
              <StatsCard
                title="Pending"
                value={stats.pendingApplications || 0}
                icon={Clock}
                color="orange"
              />
              <StatsCard
                title="Shortlisted"
                value={stats.shortlistedApplications || 0}
                icon={CheckCircle}
                color="green"
              />
              <StatsCard
                title="Rejected"
                value={stats.rejectedApplications || 0}
                icon={AlertCircle}
                color="red"
              />
            </>
          )}
        </div>

        {/* Content based on user role */}
        {user?.role === 'employer' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Jobs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Job Postings</h2>
                <Link to="/post-job">
                  <Button variant="primary" size="sm" icon={Plus}>
                    Post New Job
                  </Button>
                </Link>
              </div>
              
              {recentJobs.length > 0 ? (
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div key={job._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{job.company} • {job.location}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {job.applications.length} application{job.applications.length !== 1 ? 's' : ''}
                        </span>
                        <Link 
                          to={`/jobs/${job._id}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs posted yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by posting your first job.</p>
                  <div className="mt-6">
                    <Link to="/post-job">
                      <Button variant="primary" icon={Plus}>
                        Post Your First Job
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
              
              {recentJobs.length > 0 && (
                <div className="mt-6">
                  <Link to="/dashboard/jobs">
                    <Button variant="ghost" className="w-full">
                      View All Jobs
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-4">
                <Link to="/post-job">
                  <Button variant="primary" className="w-full justify-start" icon={Plus}>
                    Post a New Job
                  </Button>
                </Link>
                
                <Link to="/dashboard/jobs">
                  <Button variant="ghost" className="w-full justify-start" icon={Briefcase}>
                    Manage Job Postings
                  </Button>
                </Link>
                
                <Link to="/dashboard/applicants">
                  <Button variant="ghost" className="w-full justify-start" icon={Users}>
                    Review Applications
                  </Button>
                </Link>
                
                <Link to="/dashboard/analytics">
                  <Button variant="ghost" className="w-full justify-start" icon={TrendingUp}>
                    View Analytics
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
                <Link to="/jobs">
                  <Button variant="primary" size="sm" icon={Briefcase}>
                    Browse Jobs
                  </Button>
                </Link>
              </div>
              
              {recentApplications.length > 0 ? (
                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{application.job.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getApplicationStatusColor(application.status)}`}>
                          {getApplicationStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {application.job.company} • {application.job.location}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Applied {new Date(application.appliedAt).toLocaleDateString()}
                        </span>
                        <Link 
                          to={`/jobs/${application.job.id}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          View Job
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Start applying for jobs to see them here.</p>
                  <div className="mt-6">
                    <Link to="/jobs">
                      <Button variant="primary" icon={Briefcase}>
                        Browse Jobs
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
              
              {recentApplications.length > 0 && (
                <div className="mt-6">
                  <Link to="/dashboard/applications">
                    <Button variant="ghost" className="w-full">
                      View All Applications
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-4">
                <Link to="/jobs">
                  <Button variant="primary" className="w-full justify-start" icon={Briefcase}>
                    Browse Available Jobs
                  </Button>
                </Link>
                
                <Link to="/dashboard/applications">
                  <Button variant="ghost" className="w-full justify-start" icon={FileText}>
                    Track Applications
                  </Button>
                </Link>
                
                <Link to="/dashboard/profile">
                  <Button variant="ghost" className="w-full justify-start" icon={Users}>
                    Update Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;