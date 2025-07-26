import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Github, Linkedin, Twitter, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-500 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, threshold: 0.1 }}
        >
          {/* Company Info */}
          <motion.div className="col-span-1 md:col-span-2" variants={itemVariants}>
            <Link to="/" className="flex items-center space-x-2 mb-6 group">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-3xl font-bold gradient-text">TalentHub</span>
            </Link>
            <p className="text-gray-300 mb-8 max-w-md leading-relaxed text-lg">
              Connecting talented professionals with amazing opportunities. 
              Find your dream job or hire the perfect candidate with our innovative platform.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center text-gray-300">
                <Mail className="w-5 h-5 mr-3 text-primary-400" />
                <span>support@talenthub.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-5 h-5 mr-3 text-primary-400" />
                <span>+91 99654 82310</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 mr-3 text-primary-400" />
                <span> India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Twitter, href: "#", label: "Twitter" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-12 h-12 bg-gray-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all duration-300 group"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* For Job Seekers */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-6 text-white">For Job Seekers</h3>
            <ul className="space-y-4">
              {[
                { to: "/jobs", label: "Browse Jobs" },
                { to: "/register", label: "Create Account" },
                { to: "/dashboard", label: "My Applications" },
                { to: "/jobs", label: "Career Advice" }
              ].map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-primary-400 transition-all duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* For Employers */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-6 text-white">For Employers</h3>
            <ul className="space-y-4">
              {[
                { to: "/post-job", label: "Post a Job" },
                { to: "/register", label: "Employer Signup" },
                { to: "/dashboard", label: "Manage Jobs" },
                { to: "/jobs", label: "Pricing Plans" }
              ].map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-primary-400 transition-all duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, threshold: 0.1 }}
        >
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 TalentHub. All rights reserved.
          </div>
          <motion.div 
            className="flex items-center text-gray-400 text-sm"
            whileHover={{ scale: 1.05 }}
          >
            Made with{' '}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mx-1"
            >
              <Heart className="w-4 h-4 text-red-500" />
            </motion.div>
            {' '}for connecting talent
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;