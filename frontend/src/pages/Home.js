import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Search, Users, Briefcase, ArrowRight, Star, TrendingUp, Award, Zap, Sparkles, Target, Rocket, Globe } from 'lucide-react';
import AnimatedBackground from '../components/common/AnimatedBackground';

const Home = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Array of icon components for floating icons
  const floatingIcons = [Briefcase, Users, Star, Target];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-primary-600 via-blue-700 to-purple-800 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => {
            const IconComponent = floatingIcons[i % floatingIcons.length];
            return (
              <motion.div
                key={i}
                className="absolute text-white/20"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -100, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: Math.random() * 20 + 20,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 10,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              >
                <IconComponent size={24} />
              </motion.div>
            );
          })}
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center" ref={heroRef}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
            >
              {/* Main Heading */}
              <motion.div variants={itemVariants} className="mb-8">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl mb-6"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                  variants={itemVariants}
                >
                  <span className="block">Find Your</span>
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                    Dream Job
                  </span>
                  <span className="block text-xl md:text-2xl lg:text-3xl font-semibold text-white/90 mt-3">
                    Today
                  </span>
                </motion.h1>
              </motion.div>
              
              {/* Subtitle */}
              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl lg:text-3xl mb-12 max-w-4xl mx-auto text-white/90 leading-relaxed font-light"
              >
                Connect with top employers and discover opportunities that match your skills and aspirations.
                <span className="block mt-2 text-lg md:text-xl text-white/80">
                  Join thousands of professionals who found their perfect career path.
                </span>
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row justify-center gap-6 mb-16"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/jobs"
                    className="group relative inline-flex items-center justify-center px-12 py-4 text-xl font-bold text-primary-600 bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      <Search className="w-6 h-6 mr-3" />
                      Browse Jobs
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-blue-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="group relative inline-flex items-center justify-center px-12 py-4 text-xl font-bold text-white border-2 border-white rounded-2xl hover:bg-white hover:text-primary-600 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Get Started
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap justify-center items-center gap-8 text-white/70"
              >
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium">50K+ Active Users</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium">10K+ Jobs Posted</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium">95% Success Rate</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={featuresRef}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="text-center mb-20"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Why Choose <span className="gradient-text">TalentHub</span>?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              We make job searching and hiring simple, effective, and enjoyable
            </motion.p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Search,
                title: "Smart Search",
                description: "Find jobs that match your skills with our powerful AI-powered search and filter system",
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50"
              },
              {
                icon: Users,
                title: "Top Companies",
                description: "Connect with leading companies and startups looking for talent like you",
                color: "from-green-500 to-green-600",
                bgColor: "bg-green-50"
              },
              {
                icon: TrendingUp,
                title: "Career Growth",
                description: "Advance your career with opportunities from entry-level to executive positions",
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50"
              },
              {
                icon: Award,
                title: "Quality Matches",
                description: "Get personalized job recommendations based on your experience and preferences",
                color: "from-orange-500 to-orange-600",
                bgColor: "bg-orange-50"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="card card-hover text-center group"
              >
                <motion.div 
                  className={`${feature.bgColor} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className={`w-10 h-10 text-${feature.color.split('-')[1]}-600`} />
                </motion.div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-20 bg-gradient-to-r from-primary-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={statsRef}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { number: "10K+", label: "Active Jobs", icon: Briefcase },
              { number: "5K+", label: "Companies", icon: Users },
              { number: "50K+", label: "Job Seekers", icon: TrendingUp },
              { number: "95%", label: "Success Rate", icon: Star }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={statsVariants}
                className="group"
              >
                <motion.div 
                  className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-lg opacity-90">{stat.label}</div>
                <motion.div
                  className="mt-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="w-8 h-8 mx-auto" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" ref={ctaRef}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Ready to Take the <span className="gradient-text">Next Step</span>?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl mb-12 opacity-90 max-w-2xl mx-auto"
            >
              Join thousands of professionals who found their perfect job through TalentHub
            </motion.p>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="btn-primary text-lg px-12 py-4 inline-flex items-center shadow-2xl"
              >
                <Zap className="w-6 h-6 mr-3" />
                Create Your Account
                <ArrowRight className="w-6 h-6 ml-3" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;