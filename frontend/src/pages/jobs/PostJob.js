import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { jobAPI } from '../../services/api';
import Input from '../../components/forms/Input';
import Button from '../../components/forms/Button';
import Select from '../../components/forms/Select';
import { Briefcase, Building, MapPin, IndianRupee, Users, Calendar, Plus } from 'lucide-react';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    company: user?.company?.name || '',
    description: '',
    requirements: '',
    location: '',
    type: 'full-time',
    category: '',
    skills: '',
    experience: 'entry',
    remote: false,
    salaryMin: '',
    salaryMax: '',
    deadline: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const categories = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Design', label: 'Design' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'Customer Service', label: 'Customer Service' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Education', label: 'Education' },
    { value: 'Other', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.requirements.trim()) newErrors.requirements = 'Job requirements are required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.category) newErrors.category = 'Category is required';

    // Description length
    if (formData.description.trim() && formData.description.trim().length < 100) {
      newErrors.description = 'Description must be at least 100 characters';
    }

    // Requirements length
    if (formData.requirements.trim() && formData.requirements.trim().length < 50) {
      newErrors.requirements = 'Requirements must be at least 50 characters';
    }

    // Salary validation
    if (formData.salaryMin && formData.salaryMax) {
      const min = parseInt(formData.salaryMin);
      const max = parseInt(formData.salaryMax);
      if (min >= max) {
        newErrors.salaryMax = 'Maximum salary must be greater than minimum salary';
      }
    }

    // Deadline validation
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate <= today) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const jobData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
        location: formData.location.trim(),
        type: formData.type,
        category: formData.category,
        skills: formData.skills ? formData.skills.split(',').map(skill => skill.trim()).filter(Boolean) : [],
        experience: formData.experience,
        remote: formData.remote,
        deadline: formData.deadline || null
      };

      // Add salary if provided
      if (formData.salaryMin || formData.salaryMax) {
        jobData.salary = {
          min: formData.salaryMin ? parseInt(formData.salaryMin) : null,
          max: formData.salaryMax ? parseInt(formData.salaryMax) : null,
          currency: 'INR'
        };
      }

      const response = await jobAPI.createJob(jobData);
      
      // Redirect to the created job
      navigate(`/jobs/${response.data.job._id}`);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create job. Please try again.';
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="mb-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Post a New Job
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Find the perfect candidate for your team by creating a detailed job posting.
          </motion.p>
        </motion.div>

        {/* Form */}
        <motion.div 
          className="glass rounded-2xl shadow-xl p-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          {errors.submit && (
            <motion.div 
              className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-red-800 font-medium">{errors.submit}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <motion.div 
              className="border-b border-gray-200 pb-8"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-primary-600" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Job Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  placeholder="e.g. Senior React Developer"
                  required
                  icon={Briefcase}
                />
                
                <Input
                  label="Company Name"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  error={errors.company}
                  placeholder="Your company name"
                  required
                  icon={Building}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  error={errors.location}
                  placeholder="e.g. Mumbai, Maharashtra"
                  required
                  icon={MapPin}
                />
                
                <Select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  options={categories}
                  error={errors.category}
                  required
                />
              </div>
            </motion.div>

            {/* Job Details */}
            <motion.div 
              className="border-b border-gray-200 pb-8"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
                Job Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Select
                  label="Job Type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  options={jobTypes}
                  required
                />
                
                <Select
                  label="Experience Level"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  options={experienceLevels}
                  required
                />
                
                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    id="remote"
                    name="remote"
                    checked={formData.remote}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remote" className="ml-2 text-sm text-gray-700 font-medium">
                    Remote work available
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <Input
                  label="Required Skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, TypeScript (comma separated)"
                />
              </div>
            </motion.div>

            {/* Salary */}
            <motion.div 
              className="border-b border-gray-200 pb-8"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <IndianRupee className="w-5 h-5 mr-2 text-primary-600" />
                Salary Range (Optional)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Input
                    label="Minimum Salary (₹)"
                    name="salaryMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    error={errors.salaryMin}
                    placeholder="50000"
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-10 text-gray-500">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="relative">
                  <Input
                    label="Maximum Salary (₹)"
                    name="salaryMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    error={errors.salaryMax}
                    placeholder="80000"
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-10 text-gray-500">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-500 text-center">
                💡 Salary amounts are in Indian Rupees (₹). Use numbers only (e.g., 50000 for ₹50,000)
              </div>
            </motion.div>

            {/* Description */}
            <motion.div 
              className="border-b border-gray-200 pb-8"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary-600" />
                Job Description
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.description.length}/100 characters minimum
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  placeholder="List the required qualifications, experience, and skills..."
                  className={`input-field ${errors.requirements ? 'border-red-500' : ''}`}
                />
                {errors.requirements && (
                  <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.requirements.length}/50 characters minimum
                </p>
              </div>
            </motion.div>

            {/* Application Deadline */}
            <motion.div 
              className="pb-8"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                Application Deadline (Optional)
              </h2>
              
              <Input
                label="Deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                error={errors.deadline}
                icon={Calendar}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              className="flex justify-end space-x-4 pt-8 border-t border-gray-200"
              variants={itemVariants}
            >
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="px-8"
              >
                Post Job
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PostJob;