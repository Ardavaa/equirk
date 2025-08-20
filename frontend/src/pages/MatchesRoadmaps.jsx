import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/Logo.png';
import LogoutIcon from '../assets/Logout Button.png';
import EmptyBoxIcon from '../assets/Empty Box.png';
import { useAuth } from '../contexts/AuthContext';
import { useJobRecommendations } from '../contexts/JobRecommendationsContext';
import { useReducedMotion, getAccessibleTransition } from '../hooks/useReducedMotion';

function MatchesRoadmaps() {
  const navigate = useNavigate();
  const { logout, principal, isLoading } = useAuth();
  const { jobRecommendationsData, hasJobRecommendationsData } = useJobRecommendations();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('roadmap'); // 'matches' or 'roadmap'
  const [isScrolled, setIsScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const dropdownRef = useRef(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track scroll position for navbar shadow effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const truncatePrincipal = (principal) => {
    if (!principal) return '';
    return `${principal.slice(0, 8)}...${principal.slice(-4)}`;
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
  };

  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleBackToCareerInsights = () => {
    navigate('/career-insights');
  };

  const handleViewJobRecommendations = () => {
    navigate('/job-recommendations');
  };

  // Get data from context if available
  const currentData = hasJobRecommendationsData() ? jobRecommendationsData : null;
  const jobRecommendations = currentData?.jobRecommendations || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-200 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img src={Logo} alt="logo" className="h-8 w-auto" />
            </div>
            
            {/* Center Navigation */}
            <div className="hidden md:block">
              <div className="flex space-x-8">
                <button 
                  onClick={handleBackToCareerInsights}
                  className="text-gray-500 hover:text-[#2D6A4F] font-normal text-lg h-20 flex items-center transition-colors"
                >
                  Career Insights
                </button>
                <div className="relative flex items-center h-20">
                  <span className="text-[#2D6A4F] font-medium text-lg cursor-pointer">
                    Matches & Roadmaps
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D6A4F]"></div>
                </div>
              </div>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            {/* User Dropdown Button */}
            <motion.button
              onClick={handleUserDropdownToggle}
              className="flex items-center space-x-3 bg-transparent rounded-lg px-3 py-2 focus:outline-none"
              aria-expanded={isUserDropdownOpen}
              aria-haspopup="true"
            >
              {/* User Avatar */}
              <img 
                src="https://avatar.iran.liara.run/public" 
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              
              {/* User Info */}
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-gray-900">
                  {truncatePrincipal(principal)}
                </span>
                <span className="text-xs text-gray-500">Internet Identity</span>
              </div>
              
              {/* Dropdown Arrow */}
              <motion.svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isUserDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isUserDropdownOpen && (
                <motion.div
                  className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={getAccessibleTransition(prefersReducedMotion, { duration: 0.2 })}
                >
                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={handleBackToCareerInsights}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Career Insights
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <img src={LogoutIcon} alt="Logout" className="w-4 h-4 mr-3" />
                      {isLoading ? 'Signing out...' : 'Logout'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
              </div>
             </div>
           </div>
         </div>
       </nav>

      {/* Main Content */}
      <div className="px-6 md:px-20 py-10 pt-28">
        <div className="max-w-[1280px] mx-auto">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Saved Roadmaps & Job Matches
            </h1>
            
            {/* Tab Navigation */}
            <div className="flex space-x-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('matches')}
                className={`pb-3 px-1 text-sm font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === 'matches'
                    ? 'text-[#2D6A4F] border-[#2D6A4F]'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                Career Matches
              </button>
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`pb-3 px-1 text-sm font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === 'roadmap'
                    ? 'text-[#2D6A4F] border-[#2D6A4F]'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                Skill Roadmap
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex flex-col items-center justify-center py-16">
            {/* Empty Box Icon */}
            <div className="mb-8">
              <img 
                src={EmptyBoxIcon} 
                alt="Empty Box" 
                className="w-32 h-32 mx-auto"
              />
            </div>
            
            {/* Empty State Content */}
            <div className="text-center max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {activeTab === 'roadmap' ? 'No Roadmaps Saved' : 'No Matches Saved'}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {activeTab === 'roadmap' 
                  ? 'Explore the roadmaps from your career matches and save the ones you want to follow'
                  : 'Complete your career assessment to discover personalized job matches and save your favorites'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 py-6">
        <div className="max-w-[1280px] mx-auto px-6 md:px-20">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Equirk © 2025. All rights reserved.</span>
            <div className="flex space-x-6">
              <button className="hover:text-gray-700 transition-colors">Terms of Service</button>
              <button className="hover:text-gray-700 transition-colors">Privacy Policy</button>
              <button className="hover:text-gray-700 transition-colors">Cookie Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchesRoadmaps;
