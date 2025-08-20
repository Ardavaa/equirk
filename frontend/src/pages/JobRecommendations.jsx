import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Logo from '../assets/Logo.png';
import LogoutIcon from '../assets/Logout Button.png';
import { useAuth } from '../contexts/AuthContext';
import { useJobRecommendations } from '../contexts/JobRecommendationsContext';
import { useReducedMotion, getAccessibleTransition } from '../hooks/useReducedMotion';

// Simple Error Boundary for ReactMarkdown
class MarkdownErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('MarkdownErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
          {this.props.fallbackContent || 'Error rendering markdown content'}
        </div>
      );
    }

    return this.props.children;
  }
}

function JobRecommendations() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, principal, isLoading } = useAuth();
  const { jobRecommendationsData, saveJobRecommendationsData, hasJobRecommendationsData } = useJobRecommendations();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const dropdownRef = useRef(null);
  
  // Roadmap state
  const [selectedJobForRoadmap, setSelectedJobForRoadmap] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapError, setRoadmapError] = useState(null);
  const [openIndexes, setOpenIndexes] = useState({ basic: 0, intermediate: 0, advanced: 0 });
  
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

  // Track scroll position for navbar shadow effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackToCareerInsights = () => {
    navigate('/career-insights');
  };

  const handleMatchesRoadmaps = () => {
    navigate('/matches-roadmaps');
  };

  const handleNavigation = (section) => {
    navigate(`/#${section}`);
  };

  // Roadmap functions
  const handleViewRoadmap = async (job) => {
    // Scroll to top before showing roadmap
    window.scrollTo(0, 0);
    
    setSelectedJobForRoadmap(job);
    setRoadmapLoading(true);
    setRoadmapError(null);
    
    console.log('Fetching roadmap for:', job.title, 'with disabilities:', currentData.disabilities || disabilities);
    
    const params = new URLSearchParams({
      job: job.title,
      ...(currentData.disabilities?.length > 0 && { disabilities: currentData.disabilities.join(',') })
    });
    
    try {
      const response = await fetch(`/api/roadmap?${params}`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Roadmap data received:', data);
      setRoadmap(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setRoadmapError(error.message);
    } finally {
      setRoadmapLoading(false);
    }
  };

  const handleCloseRoadmap = () => {
    setSelectedJobForRoadmap(null);
    setRoadmap(null);
    setRoadmapError(null);
  };

  const handleAccordion = (section, idx) => {
    setOpenIndexes((prev) => ({ ...prev, [section]: prev[section] === idx ? null : idx }));
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
                 <div className="relative flex items-center h-20">
                   <button 
                     onClick={handleBackToCareerInsights}
                     className="text-[#2D6A4F] font-medium text-lg cursor-pointer"
                   >
                     Career Insights
                   </button>
                   <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D6A4F]"></div>
                 </div>
                 <button 
                   onClick={handleMatchesRoadmaps}
                   className="text-gray-500 hover:text-[#2D6A4F] font-normal text-lg h-20 flex items-center transition-colors"
                 >
                   Matches & Roadmaps
                 </button>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 0 01-2-2v-2z" />
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

             {/* Main Content - Following Figma Design */}
       <div className="px-20 py-10 pt-28">
        <div className="max-w-[1280px] mx-auto">
          {selectedJobForRoadmap ? (
            /* Roadmap View */
            <>
              {/* Roadmap Header */}
              <div className="flex justify-between items-start mb-12">
                <div>
                  <button 
                    onClick={handleCloseRoadmap}
                    className="flex items-center gap-2 text-[#2D6A4F] hover:text-[#22503B] transition-colors mb-4 group"
                  >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Job Recommendations
                  </button>
                  
                  <h1 className="text-4xl font-bold text-[#252525] mb-2">{selectedJobForRoadmap.title} Skill Roadmap</h1>
                  <p className="text-gray-600">Your personalized learning path to become a {selectedJobForRoadmap.title}</p>
                </div>
              </div>
              
              {/* Roadmap Content */}
              <div className="min-h-[600px]">
                {roadmapLoading ? (
                  <div className="flex flex-col gap-16">
                    {/* Loading skeleton */}
                    {[1, 2, 3].map((idx) => (
                      <div key={idx} className="flex gap-16 items-start">
                        <div className="w-1/3 flex-shrink-0">
                          <div className="h-6 bg-gray-200 rounded-md mb-2 w-24 animate-pulse"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col gap-3">
                            {[1, 2, 3].map((skillIdx) => (
                              <div key={skillIdx} className="flex items-center py-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-gray-200 mr-5 animate-pulse"></div>
                                <div className="flex-1">
                                  <div className="h-5 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex items-center justify-center py-8">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#2D6A4F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-lg text-gray-500">Loading roadmap...</span>
                    </div>
                  </div>
                ) : roadmapError ? (
                  <div className="text-red-500 text-center py-8">
                    <p className="mb-4">Error loading roadmap: {roadmapError}</p>
                    <button 
                      onClick={() => handleViewRoadmap(selectedJobForRoadmap)}
                      className="bg-[#2D6A4F] text-white px-4 py-2 rounded-md hover:bg-[#22503B] transition"
                    >
                      Try Again
                    </button>
                  </div>
                ) : roadmap ? (
                  <div className="flex flex-col gap-16">
                    {[
                      { key: 'basic', label: 'Basic', description: 'Learn fundamental concepts and basic tools.' },
                      { key: 'intermediate', label: 'Intermediate', description: 'Dive deeper into techniques and build practical skills.' },
                      { key: 'advanced', label: 'Advanced', description: 'Master advanced concepts and build professional expertise.' },
                      ...((currentData.disabilities || disabilities).length > 0 ? [{ key: 'disability', label: 'Accessibility & Inclusion', description: 'Specialized guidance for working in this field with your specific disability considerations and accommodations.' }] : [])
                    ].map((section) => {
                      // Handle disability section the same as other sections
                      if (section.key === 'disability') {
                        const skills = Array.isArray(roadmap.disabilityGuidance) ? roadmap.disabilityGuidance : [];
                        return (
                          <div key={section.key} className="flex gap-16 items-start">
                            <div className="w-1/3 flex-shrink-0">
                              <h2 className="text-xl font-semibold text-[#252525] mb-2">{section.label}</h2>
                              <p className="text-base text-[#888] max-w-xs">{section.description}</p>
                            </div>
                            
                            <div className="flex-1">
                              {skills.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                  {skills.map((skill, idx) => (
                                    <div key={skill.title || idx}>
                                      <button
                                        className={`w-full flex items-center text-left px-0 py-4 border-b border-gray-100 focus:outline-none transition group ${openIndexes[section.key] === idx ? 'bg-gray-50' : ''}`}
                                        onClick={() => handleAccordion(section.key, idx)}
                                      >
                                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#eaf1ee] text-emerald-800 font-bold text-lg mr-5 border border-[#eaf1ee]">
                                          {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <span className="text-lg font-medium text-[#252525]">{skill.title}</span>
                                        <span className={`ml-auto transition-transform ${openIndexes[section.key] === idx ? 'rotate-180' : ''}`}>
                                          <svg width="20" height="20" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                                        </span>
                                      </button>
                                      {openIndexes[section.key] === idx && (
                                        <div className="pl-16 pb-4">
                                          {skill.description && (
                                            <p className="text-[#888] text-base mb-2">{skill.description}</p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-gray-500">No specific accessibility guidance available for this job role.</div>
                              )}
                            </div>
                          </div>
                        );
                      }
                      
                      // Handle regular skill sections
                      const skills = Array.isArray(roadmap[section.key]) ? roadmap[section.key] : [];
                      return (
                        <div key={section.key} className="flex gap-16 items-start">
                          <div className="w-1/3 flex-shrink-0">
                            <h2 className="text-xl font-semibold text-[#252525] mb-2">{section.label}</h2>
                            <p className="text-base text-[#888] max-w-xs">{section.description}</p>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-col gap-3">
                              {skills.map((skill, idx) => (
                                <div key={skill.title || idx}>
                                  <button
                                    className={`w-full flex items-center text-left px-0 py-4 border-b border-gray-100 focus:outline-none transition group ${openIndexes[section.key] === idx ? 'bg-gray-50' : ''}`}
                                    onClick={() => handleAccordion(section.key, idx)}
                                  >
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#eaf1ee] text-emerald-800 font-bold text-lg mr-5 border border-[#eaf1ee]">
                                      {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-lg font-medium text-[#252525]">{skill.title}</span>
                                    <span className={`ml-auto transition-transform ${openIndexes[section.key] === idx ? 'rotate-180' : ''}`}>
                                      <svg width="20" height="20" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                                    </span>
                                  </button>
                                  {openIndexes[section.key] === idx && (
                                    <div className="pl-16 pb-4">
                                      {skill.description && (
                                        <p className="text-[#888] text-base mb-2">{skill.description}</p>
                                      )}
                                      {skill.resources && (
                                        <a href="#" className="text-emerald-800 font-medium flex items-center gap-1 hover:underline">
                                          {skill.resources}
                                          <svg width="16" height="16" fill="none" stroke="#377056" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            /* Job Recommendations View */
            <>
              {/* Header Section */}
              <div className="mb-10">
                 <h1 className="text-4xl font-bold text-[#252525] mb-5">
                   Your Career Matches
                 </h1>
                 <p className="text-xl text-[#777777]">
                    These career suggestions are based on your previous inputs. Not quite right?{' '}
                    <button 
                       onClick={handleBackToCareerInsights}
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
                      onClick={() => handleViewRoadmap(job)}
                      disabled={roadmapLoading}
                    >
                      {roadmapLoading && selectedJobForRoadmap?.title === job.title ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading Roadmap...
                        </span>
                      ) : (
                        'View Skills Roadmap'
                      )}
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
                onClick={handleBackToCareerInsights}
                className="bg-gradient-to-b from-[#2D6A4F] to-[#24543E] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
              >
                Try Again
              </button>
            </motion.div>
          )}
            </>
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