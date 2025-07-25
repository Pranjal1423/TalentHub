import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Briefcase, PlusCircle, Search } from 'lucide-react';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700">
              TalentHub
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/jobs" 
              className="flex items-center text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Search className="w-4 h-4 mr-1" />
              Browse Jobs
            </Link>
            
            {isAuthenticated ? (
              <>
                {/* Employer-specific navigation */}
                {user?.role === 'employer' && (
                  <Link 
                    to="/post-job" 
                    className="flex items-center text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Post Job
                  </Link>
                )}
                
                {/* Dashboard link */}
                <Link 
                  to="/dashboard" 
                  className="flex items-center text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User className="w-4 h-4 mr-1" />
                  Dashboard
                </Link>
                
                {/* User info and logout */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="ml-2 text-sm text-gray-700">
                      {user?.name}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            {/* Add mobile menu implementation here if needed */}
            <button className="text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;