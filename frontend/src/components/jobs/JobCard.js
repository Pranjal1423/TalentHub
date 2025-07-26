import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Building, Users, Calendar, ExternalLink, Star, IndianRupee } from 'lucide-react';
import { formatSalaryRange } from '../../utils/currency';

const JobCard = ({ job, showApplications = false, index = 0 }) => {
  const getJobTypeColor = (type) => {
    const colors = {
      'full-time': 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
      'part-time': 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
      'contract': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
      'internship': 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white'
    };
    return colors[type] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="card card-hover group"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <motion.h3 
            className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200"
            whileHover={{ x: 5 }}
          >
            <Link to={`/jobs/${job._id}`} className="flex items-center">
              {job.title}
              <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>
          </motion.h3>
          <div className="flex items-center text-gray-600 mb-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg flex items-center justify-center mr-3"
            >
              <Building className="w-4 h-4 text-white" />
            </motion.div>
            <span className="font-semibold text-gray-800">{job.company}</span>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <motion.span 
            className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${getJobTypeColor(job.type)}`}
            whileHover={{ scale: 1.05 }}
          >
            {job.type.replace('-', ' ').toUpperCase()}
          </motion.span>
          {job.remote && (
            <motion.span 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              Remote
            </motion.span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="text-gray-700 mb-6 leading-relaxed text-sm">
        <p className="line-clamp-3">
          {job.description.length > 200 
            ? `${job.description.substring(0, 200)}...` 
            : job.description
          }
        </p>
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 5).map((skill, index) => (
              <motion.span 
                key={index}
                className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200"
                whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
              >
                {skill}
              </motion.span>
            ))}
            {job.skills.length > 5 && (
              <span className="text-gray-500 text-sm font-medium">
                +{job.skills.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div 
          className="flex items-center p-3 bg-gray-50 rounded-lg"
          whileHover={{ backgroundColor: "#f3f4f6" }}
        >
          <MapPin className="w-4 h-4 mr-3 text-primary-600" />
          <span className="text-sm font-medium text-gray-700">{job.location}</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center p-3 bg-gray-50 rounded-lg"
          whileHover={{ backgroundColor: "#f3f4f6" }}
        >
          <IndianRupee className="w-4 h-4 mr-3 text-green-600" />
          <span className="text-sm font-medium text-gray-700">
            {formatSalaryRange(job.salary?.min, job.salary?.max)}
          </span>
        </motion.div>
        
        <motion.div 
          className="flex items-center p-3 bg-gray-50 rounded-lg"
          whileHover={{ backgroundColor: "#f3f4f6" }}
        >
          <Users className="w-4 h-4 mr-3 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">{getExperienceLevel(job.experience)}</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center p-3 bg-gray-50 rounded-lg"
          whileHover={{ backgroundColor: "#f3f4f6" }}
        >
          <Calendar className="w-4 h-4 mr-3 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">
            {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </motion.div>
      </div>

      {/* Applications count for employers */}
      {showApplications && job.applications && (
        <motion.div 
          className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-100"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Applications:</span>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-primary-600" />
              <span className="font-bold text-primary-700">
                {job.applications.length} candidate{job.applications.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-2" />
          <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to={`/jobs/${job._id}`}
            className="btn-primary text-sm px-6 py-2 inline-flex items-center"
          >
            View Details
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default JobCard;