import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Button from '../../components/forms/Button';
import { 
  TrendingUp, BarChart3, Users, Eye, 
  ArrowLeft, Calendar, MapPin, Briefcase,
  CheckCircle, XCircle, Clock, Activity
} from 'lucide-react';

const Analytics = () => {
  const [jobs, setJobs] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await jobAPI.getMyJobs();
      const jobsData = response.data.jobs;
      setJobs(jobsData);
      
      // Calculate analytics
      const totalJobs = jobsData.length;
      const activeJobs = jobsData.filter(job => job.isActive).length;
      const totalApplications = jobsData.reduce((sum, job) => sum + job.applications.length, 0);
      
      // Application status breakdown
      const applicationStatuses = jobsData.reduce((acc, job) => {
        job.applications.forEach(app => {
          acc[app.status] = (acc[app.status] || 0) + 1;
        });
        return acc;
      }, {});
      
      // Top performing jobs
      const topJobs = jobsData
        .sort((a, b) => b.applications.length - a.applications.length)
        .slice(0, 5);
      
      // Recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - parseInt(timeRange));
      
      const recentApplications = jobsData.reduce((sum, job) => {
        return sum + job.applications.filter(app => 
          new Date(app.createdAt) >= thirtyDaysAgo
        ).length;
      }, 0);
      
      const recentJobs = jobsData.filter(job => 
        new Date(job.createdAt) >= thirtyDaysAgo
      ).length;
      
      setAnalytics({
        totalJobs,
        activeJobs,
        totalApplications,
        applicationStatuses,
        topJobs,
        recentApplications,
        recentJobs,
        averageApplicationsPerJob: totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : 0
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
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

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
            <p className="text-gray-600 mt-2">
              Track the performance of your job postings and applications
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <Link to="/dashboard">
              <Button variant="ghost" icon={ArrowLeft}>
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalJobs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeJobs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalApplications}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Applications</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.averageApplicationsPerJob}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Application Status Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Status</h2>
            <div className="space-y-4">
              {Object.entries(analytics.applicationStatuses || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                      <span className="ml-1 capitalize">{status}</span>
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{count}</span>
                </div>
              ))}
              {Object.keys(analytics.applicationStatuses || {}).length === 0 && (
                <p className="text-gray-500 text-center py-4">No applications yet</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">New Applications</p>
                    <p className="text-sm text-gray-600">Last {timeRange} days</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-600">{analytics.recentApplications}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">New Jobs Posted</p>
                    <p className="text-sm text-gray-600">Last {timeRange} days</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">{analytics.recentJobs}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Jobs */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Jobs</h2>
            {analytics.topJobs && analytics.topJobs.length > 0 ? (
              <div className="space-y-4">
                {analytics.topJobs.map((job, index) => (
                  <div key={job._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold mr-4">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{job.applications.length}</p>
                        <p className="text-sm text-gray-600">applications</p>
                      </div>
                      <Link to={`/jobs/${job._id}`}>
                        <Button variant="ghost" size="sm" icon={Eye}>
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs posted yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start posting jobs to see analytics and insights.
                </p>
                <div className="mt-6">
                  <Link to="/post-job">
                    <Button variant="primary" icon={Briefcase}>
                      Post Your First Job
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics; 