import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { jobAPI } from '../../services/api';
import JobCard from '../../components/jobs/JobCard';
import SearchFilters from '../../components/jobs/SearchFilters';
import AnimatedLoading from '../../components/common/AnimatedLoading';
import Button from '../../components/forms/Button';
import { ChevronLeft, ChevronRight, Briefcase, Search, Filter } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    category: '',
    experience: '',
    remote: false,
    minSalary: '',
    maxSalary: '',
    sortBy: 'date',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    fetchJobs();
  }, [filters.page]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await jobAPI.getJobs(filters);
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({
      ...newFilters,
      page: 1 // Reset to first page when filters change
    });
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      location: '',
      type: '',
      category: '',
      experience: '',
      remote: false,
      minSalary: '',
      maxSalary: '',
      sortBy: 'date',
      page: 1,
      limit: 12
    };
    setFilters(clearedFilters);
    
    // Fetch jobs with cleared filters
    setTimeout(() => {
      fetchJobs();
    }, 100);
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <motion.button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            i === pagination.currentPage
              ? 'bg-primary-600 text-white shadow-lg'
              : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {i}
        </motion.button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-3 mt-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            icon={ChevronLeft}
            className="px-4 py-2"
          >
            Previous
          </Button>
        </motion.div>
        
        <div className="flex space-x-2">
          {pages}
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            icon={ChevronRight}
            className="px-4 py-2"
          >
            Next
          </Button>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your <span className="gradient-text">Next Job</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover {pagination.totalJobs} opportunities waiting for you
          </p>
        </motion.div>

        {/* Search Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onSearch={handleSearch}
          />
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="py-16">
            <AnimatedLoading 
              size="large" 
              text="Finding amazing jobs for you..." 
            />
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Briefcase className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-1">Oops! Something went wrong</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
            <motion.div className="mt-4">
              <Button
                variant="primary"
                onClick={fetchJobs}
                className="bg-red-600 hover:bg-red-700"
              >
                Try Again
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Job Results */}
        {!loading && !error && (
          <>
            {/* Results Summary */}
            <motion.div 
              className="flex items-center justify-between mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center">
                <Search className="w-5 h-5 text-primary-600 mr-2" />
                <p className="text-gray-700 font-medium">
                  Showing <span className="text-primary-600 font-bold">{jobs.length}</span> of{' '}
                  <span className="text-primary-600 font-bold">{pagination.totalJobs}</span> jobs
                  {filters.search && (
                    <span className="text-gray-600"> for "{filters.search}"</span>
                  )}
                </p>
              </div>
              
              {jobs.length > 0 && (
                <div className="flex items-center text-sm text-gray-500">
                  <Filter className="w-4 h-4 mr-2" />
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>
              )}
            </motion.div>

            {/* Job Grid */}
            {jobs.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {jobs.map((job, index) => (
                  <JobCard key={job._id} job={job} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No jobs found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search criteria or clearing filters to find more opportunities.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="primary" onClick={handleClearFilters}>
                    Clear All Filters
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;