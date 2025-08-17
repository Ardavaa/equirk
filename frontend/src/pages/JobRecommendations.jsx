import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/Logo.png';
import LogoutIcon from '../assets/Logout Button.png';
import { useAuth } from '../contexts/AuthContext';
import { useJobRecommendations } from '../contexts/JobRecommendationsContext';
import { useReducedMotion, getAccessibleTransition } from '../hooks/useReducedMotion';

function JobRecommendations() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, principal, isLoading } = useAuth();
  const { jobRecommendationsData, saveJobRecommendationsData, hasJobRecommendationsData } = useJobRecommendations();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const dropdownRef = useRef(null);
  
  // Get data from navigation state or context
  const stateData = location.state || {};
  const {
    disabilities = [],
    jobs = [],
    skills = [],
    resume = null,
    extractedText = '',
    jobRecommendations = []
  } = stateData;

  // Use context data if location state is empty but context has data
  const currentData = (jobRecommendations.length > 0 || !hasJobRecommendationsData()) 
    ? stateData 
    : jobRecommendationsData;

  // Save data to context when new data comes from location state
  useEffect(() => {
    if (jobRecommendations.length > 0) {
      saveJobRecommendationsData(stateData);
    }
  }, [jobRecommendations, stateData, saveJobRecommendationsData]);

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

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleNavigation = (section) => {
    navigate(`/#${section}`);
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to create monogram from job title
  const createMonogram = (jobTitle) => {
    if (!jobTitle || jobTitle === 'Job Title Not Available') return 'JT';
    
    const stopwords = ['and', 'of', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 'by'];
    const words = jobTitle.trim().split(/\s+/).filter(word => word.length > 0);
    
    if (words.length === 0) return 'JT';
    if (words.length === 1) return words[0].charAt(0).toUpperCase() + words[0].charAt(1).toUpperCase();
    
    // Filter out stopwords except if they are first or last
    const filteredWords = words.filter((word, index) => 
      index === 0 || index === words.length - 1 || !stopwords.includes(word.toLowerCase())
    );
    
    if (filteredWords.length === 0) return words[0].charAt(0).toUpperCase() + words[words.length - 1].charAt(0).toUpperCase();
    if (filteredWords.length === 1) return filteredWords[0].charAt(0).toUpperCase() + filteredWords[0].charAt(1).toUpperCase();
    
    // Take first letter of first word and first letter of last word
    const firstLetter = filteredWords[0].charAt(0).toUpperCase();
    const lastLetter = filteredWords[filteredWords.length - 1].charAt(0).toUpperCase();
    
    return firstLetter + lastLetter;
  };

  return (
         <div className="min-h-screen bg-white">
       {/* Navigation - Fixed like landing page */}
       <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-6 shadow-sm bg-white px-10 border-gray-200 border-1 border-solid">
         <img src={Logo} alt="logo" className="w-[30%] md:w-[10%] h-auto" />
                 <ul className="hidden md:flex space-x-6 text-gray-700 font-normal text-lg">
           <li><button onClick={() => handleNavigation('')} className="hover:text-[#2d6a4f] transition-colors">Home</button></li>
           <li><button onClick={() => handleNavigation('about')} className="hover:text-[#2d6a4f] transition-colors">About</button></li>
           <li><button onClick={() => handleNavigation('features')} className="hover:text-[#2d6a4f] transition-colors">Features</button></li>
           <li><button onClick={() => handleNavigation('career')} className="hover:text-[#2d6a4f] transition-colors">Career</button></li>
           <li><button onClick={() => handleNavigation('contact')} className="hover:text-[#2d6a4f] transition-colors">Contact</button></li>
         </ul>
        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            {/* User Dropdown Button */}
            <motion.button
              onClick={handleUserDropdownToggle}
              className="flex items-center space-x-3 bg-transparent hover:bg-gray-50 rounded-lg px-3 py-2 transition-all duration-200 focus:outline-none focus:shadow-md"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
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
                      onClick={handleBackToDashboard}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 0 01-2-2v-2z" />
                      </svg>
                      Dashboard
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
      </nav>

             {/* Main Content - Following Figma Design */}
       <div className="px-20 py-10 pt-28">
        <div className="max-w-[1280px] mx-auto">
                     {/* Header Section */}
           <div className="mb-10">
              <h1 className="text-4xl font-bold text-[#252525] mb-5">
                Your Career Matches
              </h1>
              <p className="text-xl text-[#777777]">
                 These career suggestions are based on your previous inputs. Not quite right?{' '}
                 <button 
                    onClick={handleBackToDashboard}
                    className="text-[#2D6A4F] underline hover:text-[#1B4332] transition-colors duration-300"
                  >
                    Go back to update your profile
                  </button>
               </p>
            </div>

          {/* Job Cards */}
          {currentData.jobRecommendations && currentData.jobRecommendations.length > 0 ? (
            <div className="flex flex-col gap-4">
              {currentData.jobRecommendations.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-[#EAEAEA] rounded-xl p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    {/* Circular Logo with Monogram */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#81a595] to-[#377056] rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                      <span className="text-white font-bold text-lg">
                        {createMonogram(job.title)}
                      </span>
                    </div>
                    {/* Job Info */}
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-2xl font-semibold text-[#252525] mb-1 text-center sm:text-left">
                        {job.title || 'Job Title Not Available'}
                      </h3>
                      <p className="text-gray-600 mb-4 text-center sm:text-left">
                        Recommended Match #{index + 1}
                      </p>
                      {/* Job Description as Bullet Points */}
                      <div className="space-y-3">
                        {job.description && (
                          <div className="flex items-start gap-3">
                            <span className="text-gray-400 text-sm mt-0.5 flex-shrink-0">•</span>
                            <p className="text-[#777777] text-sm leading-relaxed flex-1">
                              {job.description}
                            </p>
                          </div>
                        )}
                        {job.skills_desc && (
                          <div className="flex items-start gap-3">
                            <span className="text-gray-400 text-sm mt-0.5 flex-shrink-0">•</span>
                            <p className="text-[#777777] text-sm leading-relaxed flex-1">
                              {job.skills_desc}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Bottom Section with Button */}
                  <div className="border-t border-gray-200 pt-4 flex justify-center sm:justify-end">
                    <button
                      className="bg-emerald-800 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-md hover:bg-emerald-700 transition font-medium w-full sm:w-auto"
                      onClick={() => navigate('/course', { 
                        state: { 
                          jobTitle: job.title,
                          disabilities: currentData.disabilities || disabilities
                        } 
                      })}
                    >
                      View Skills Roadmap
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#EAEAEA] rounded-xl p-8 sm:p-12 text-center"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Recommendations Available</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find job recommendations at the moment. This might be because:
              </p>
              <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto mb-6">
                <li>• The job recommendation service is temporarily unavailable</li>
                <li>• Your resume text couldn't be processed</li>
                <li>• No matching jobs were found in our database</li>
              </ul>
              <button 
                onClick={handleBackToDashboard}
                className="bg-gradient-to-b from-[#2D6A4F] to-[#24543E] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </div>
      </div>

                    {/* Footer */}
       <div className="border-t border-gray-300 mt-16 px-4 sm:px-8 md:px-20 py-6">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-base text-gray-500 text-center md:text-left">
            Equirk © 2025. All rights reserved.
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-5 text-center md:text-right">
            <span className="text-base text-gray-500 cursor-pointer hover:text-gray-700">Terms of Service</span>
            <span className="text-base text-gray-500 cursor-pointer hover:text-gray-700">Privacy Policy</span>
            <span className="text-base text-gray-500 cursor-pointer hover:text-gray-700">Cookie Settings</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobRecommendations; 