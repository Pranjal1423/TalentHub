import React from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';
import Input from '../forms/Input';
import Select from '../forms/Select';
import Button from '../forms/Button';

const SearchFilters = ({ filters, onFilterChange, onClearFilters, onSearch }) => {
  const jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'executive', label: 'Executive' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Most Recent' },
    { value: 'salary', label: 'Highest Salary' },
    { value: 'title', label: 'Job Title A-Z' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFilterChange({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== false && value !== null
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              name="search"
              value={filters.search || ''}
              onChange={handleInputChange}
              placeholder="Job title, company, or keywords..."
              icon={Search}
            />
          </div>
          <div>
            <Input
              type="text"
              name="location"
              value={filters.location || ''}
              onChange={handleInputChange}
              placeholder="City, state, or remote"
              icon={MapPin}
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select
            name="type"
            value={filters.type || ''}
            onChange={handleInputChange}
            options={jobTypes}
            placeholder="Job Type"
          />
          
          <Select
            name="experience"
            value={filters.experience || ''}
            onChange={handleInputChange}
            options={experienceLevels}
            placeholder="Experience"
          />
          
          <Input
            type="text"
            name="category"
            value={filters.category || ''}
            onChange={handleInputChange}
            placeholder="Category"
          />
          
          <Select
            name="sortBy"
            value={filters.sortBy || 'date'}
            onChange={handleInputChange}
            options={sortOptions}
            placeholder="Sort By"
          />
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remote"
              name="remote"
              checked={filters.remote || false}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="remote" className="text-sm text-gray-700">
              Remote only
            </label>
          </div>
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            type="number"
            name="minSalary"
            value={filters.minSalary || ''}
            onChange={handleInputChange}
            placeholder="Min Salary"
          />
          
          <Input
            type="number"
            name="maxSalary"
            value={filters.maxSalary || ''}
            onChange={handleInputChange}
            placeholder="Max Salary"
          />
          
          <div className="flex space-x-2">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              icon={Search}
            >
              Search Jobs
            </Button>
            
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                onClick={onClearFilters}
                icon={X}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;