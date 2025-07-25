import React, { useState, useEffect } from 'react';
import { jobAPI } from '../../services/api';
import JobCard from '../../components/jobs/JobCard';
import SearchFilters from '../../components/jobs/SearchFilters';
import Button from '../../components/forms/Button';
import { ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';

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
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            i === pagination.currentPage
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <Button
          variant="ghost"
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          icon={ChevronLeft}
        >
          Previous
        </Button>
        
        <div className="flex space-x-1">
          {pages}
        </div>
        
        <Button
          variant="ghost"
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          icon={ChevronRight}
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Next Job</h1>
          <p className="text-gray-600">
            Discover {pagination.totalJobs} opportunities waiting for you
          </p>
        </div>

        {/* Search Filters */}
        <SearchFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onSearch={handleSearch}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <Button
              variant="ghost"
              onClick={fetchJobs}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Job Results */}
        {!loading && !error && (
          <>
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {jobs.length} of {pagination.totalJobs} jobs
                {filters.search && ` for "${filters.search}"`}
              </p>
              
              {jobs.length > 0 && (
                <div className="text-sm text-gray-500">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>
              )}
            </div>

            {/* Job Grid */}
            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria or clearing filters.
                </p>
                <div className="mt-6">
                  <Button variant="primary" onClick={handleClearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              </div>
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