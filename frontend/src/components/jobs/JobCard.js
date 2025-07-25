import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Building, Users, Calendar } from 'lucide-react';

const JobCard = ({ job, showApplications = false }) => {
  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Salary not specified';
    
    const min = salary.min ? `$${salary.min.toLocaleString()}` : '';
    const max = salary.max ? `$${salary.max.toLocaleString()}` : '';
    
    if (min && max) return `${min} - ${max}`;
    if (min) return `From ${min}`;
    if (max) return `Up to ${max}`;
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-purple-100 text-purple-800',
      'internship': 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getExperienceLevel = (level) => {
    const levels = {
      'entry': 'Entry Level',
      'mid': 'Mid Level',
      'senior': 'Senior Level',
      'executive': 'Executive'
    };
    return levels[level] || level;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
            <Link to={`/jobs/${job._id}`}>
              {job.title}
            </Link>
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Building className="w-4 h-4 mr-2" />
            <span className="font-medium">{job.company}</span>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.type)}`}>
            {job.type.replace('-', ' ').toUpperCase()}
          </span>
          {job.remote && (
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">
              Remote
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
        {job.description.length > 150 
          ? `${job.description.substring(0, 150)}...` 
          : job.description
        }
      </p>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 5).map((skill, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 5 && (
              <span className="text-gray-500 text-sm">
                +{job.skills.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{job.location}</span>
        </div>
        
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          <span>{formatSalary(job.salary)}</span>
        </div>
        
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2" />
          <span>{getExperienceLevel(job.experience)}</span>
        </div>
        
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Applications count for employers */}
      {showApplications && job.applications && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Applications:</span>
            <span className="font-medium text-gray-900">
              {job.applications.length} candidate{job.applications.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
        
        <Link
          to={`/jobs/${job._id}`}
          className="btn-primary text-sm px-4 py-2"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;