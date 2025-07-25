import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Input from '../../components/forms/Input';
import Button from '../../components/forms/Button';
import Select from '../../components/forms/Select';
import { User, Building, Mail, Phone, MapPin, Save, AlertCircle, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profile: {
      phone: '',
      location: '',
      skills: '',
      experience: '',
      education: '',
      resume: ''
    },
    company: {
      name: '',
      description: '',
      website: '',
      location: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        profile: {
          phone: user.profile?.phone || '',
          location: user.profile?.location || '',
          skills: user.profile?.skills?.join(', ') || '',
          experience: user.profile?.experience || '',
          education: user.profile?.education || '',
          resume: user.profile?.resume || ''
        },
        company: {
          name: user.company?.name || '',
          description: user.company?.description || '',
          website: user.company?.website || '',
          location: user.company?.location || ''
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear errors
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (user.role === 'employer' && !formData.company.name.trim()) {
      newErrors['company.name'] = 'Company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const updateData = {
        name: formData.name.trim(),
        profile: user.role === 'jobseeker' ? {
          ...formData.profile,
          skills: formData.profile.skills ? formData.profile.skills.split(',').map(s => s.trim()).filter(Boolean) : []
        } : undefined,
        company: user.role === 'employer' ? formData.company : undefined
      };

      const response = await authAPI.updateProfile(updateData);
      
      // Update user context
      updateUser(response.data.user);
      
      setMessage({
        type: 'success',
        content: 'Profile updated successfully!'
      });

      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage({ type: '', content: '' });
      }, 5000);

    } catch (error) {
      setMessage({
        type: 'error',
        content: error.response?.data?.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and profile information
          </p>
        </div>

        {/* Message */}
        {message.content && (
          <div className={`mb-6 p-4 rounded-md flex items-center ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message.content}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                icon={User}
              />
              
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                disabled
                icon={Mail}
              />
            </div>
          </div>

          {/* Job Seeker Profile */}
          {user?.role === 'jobseeker' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Professional Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input
                  label="Phone Number"
                  name="profile.phone"
                  value={formData.profile.phone}
                  onChange={handleChange}
                  icon={Phone}
                />
                
                <Input
                  label="Location"
                  name="profile.location"
                  value={formData.profile.location}
                  onChange={handleChange}
                  placeholder="City, State, Country"
                  icon={MapPin}
                />
              </div>

              <div className="mb-6">
                <Input
                  label="Skills"
                  name="profile.skills"
                  value={formData.profile.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, Python, etc. (comma separated)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <textarea
                    name="profile.experience"
                    value={formData.profile.experience}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe your work experience..."
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <textarea
                    name="profile.education"
                    value={formData.profile.education}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Your educational background..."
                    className="input-field"
                  />
                </div>
              </div>

              <Input
                label="Resume URL"
                name="profile.resume"
                value={formData.profile.resume}
                onChange={handleChange}
                placeholder="https://example.com/resume.pdf"
              />
            </div>
          )}

          {/* Employer Company Info */}
          {user?.role === 'employer' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Company Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input
                  label="Company Name"
                  name="company.name"
                  value={formData.company.name}
                  onChange={handleChange}
                  error={errors['company.name']}
                  required
                  icon={Building}
                />
                
                <Input
                  label="Company Location"
                  name="company.location"
                  value={formData.company.location}
                  onChange={handleChange}
                  placeholder="City, State, Country"
                  icon={MapPin}
                />
              </div>

              <div className="mb-6">
                <Input
                  label="Company Website"
                  name="company.website"
                  value={formData.company.website}
                  onChange={handleChange}
                  placeholder="https://www.example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description
                </label>
                <textarea
                  name="company.description"
                  value={formData.company.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell candidates about your company..."
                  className="input-field"
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={Save}
              className="px-8"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;