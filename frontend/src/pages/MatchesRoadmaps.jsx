import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/Logo.png';
import LogoutIcon from '../assets/Logout Button.png';
import EmptyBoxIcon from '../assets/Empty Box.png';
import { useAuth } from '../contexts/AuthContext';
import { useJobRecommendations } from '../contexts/JobRecommendationsContext';
import { useSavedData } from '../contexts/SavedDataContext';
import SavedRoadmapViewer from '../components/SavedRoadmapViewer';
import UploadedCVSection from '../components/UploadedCVSection';
import SkillsDescriptionSection from '../components/SkillsDescriptionSection';
import JobMatchCard from '../components/JobMatchCard';
import { useReducedMotion, getAccessibleTransition } from '../hooks/useReducedMotion';

function MatchesRoadmaps() {
  const navigate = useNavigate();
  const { logout, principal, isLoading } = useAuth();
  const { jobRecommendationsData, hasJobRecommendationsData } = useJobRecommendations();
  const { 
    savedRoadmaps, 
    recentCareerMatches, 
    additionalInfo,
    removeSavedRoadmap,
    updateRecentCareerMatches,
    hasRecentMatches,
    hasSavedRoadmaps 
  } = useSavedData();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('roadmap'); // 'matches' or 'roadmap'
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const dropdownRef = useRef(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sync jobRecommendationsData with SavedDataContext when it changes (guarded)
  const lastSyncSignatureRef = useRef(null);
  useEffect(() => {
    if (!jobRecommendationsData || !jobRecommendationsData.jobRecommendations?.length) return;

    const signature = JSON.stringify({
      jobs: jobRecommendationsData.jobRecommendations,
      resumeName: jobRecommendationsData.resume?.name || null,
      extractedText: jobRecommendationsData.extractedText || null,
      disabilities: jobRecommendationsData.disabilities || null,
    });

    if (lastSyncSignatureRef.current === signature) return; // prevent redundant updates

    const additionalData = {
      disabilities: jobRecommendationsData.disabilities,
      resume: jobRecommendationsData.resume || null,
      skillsText: jobRecommendationsData.resume ? null : (jobRecommendationsData.extractedText || null),
    };

    updateRecentCareerMatches(jobRecommendationsData.jobRecommendations, additionalData);
    lastSyncSignatureRef.current = signature;
  }, [jobRecommendationsData, updateRecentCareerMatches]);

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

  const handleBackToCareerInsights = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log('Navigating to Career Insights...');
    navigate('/career-insights');
  };

  const handleViewJobRecommendations = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log('Navigating to Job Recommendations...');
    navigate('/job-recommendations');
  };

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

  // Function to get job description for roadmaps
  const getJobDescription = (jobTitle) => {
    const descriptions = {
      'Content Writer': 'Master backend development with a focus on server-side logic, databases, and APIs. Learn to build scalable and efficient systems.',
      'Backend Engineer': 'Master backend development with a focus on server-side logic, databases, and APIs. Learn to build scalable and efficient systems.',
      'Copywriter': 'Develop expertise in persuasive writing, brand messaging, and marketing communications. Learn to create compelling content that drives action.',
      'SEO Specialist': 'Learn search engine optimization techniques, keyword research, and content strategy. Master the art of improving website visibility and rankings.',
      'Social Media Manager': 'Develop skills in social media strategy, content creation, and community management. Learn to build and engage online audiences effectively.',
      'Technical Writer': 'Master the art of creating clear, concise technical documentation. Learn to translate complex information into user-friendly guides and manuals.',
      'UI/UX Designer': 'Learn the fundamentals of user interface and user experience design, including design thinking, wireframing, prototyping, and usability testing.',
      'Data Analyst': 'Develop skills in data analysis, including data cleaning, visualization, and statistical analysis. Learn to derive insights from data using tools like Python and SQL.'
    };
    
    return descriptions[jobTitle] || 'Master the essential skills and knowledge needed to excel in this career path. Learn industry best practices and build practical expertise.';
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
                <Link 
                  to="/career-insights"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/career-insights');
                  }}
                  className="text-gray-500 hover:text-[#2D6A4F] font-normal text-lg h-20 flex items-center transition-colors"
                >
                  Career Insights
                </Link>
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
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        navigate('/career-insights');
                      }}
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
          {activeTab === 'matches' ? (
            /* Career Matches Tab */
            <div className="mt-8">
              {hasRecentMatches() ? (
                <div className="space-y-6">
                  {/* Your Uploaded CV or Skills Description Section */}
                  {(() => {

                    
                    // Use the most recent data available
                    // If we have jobRecommendationsData, use it; otherwise use additionalInfo
                    const currentResume = jobRecommendationsData?.resume || additionalInfo?.resume;
                    const currentSkills = jobRecommendationsData?.extractedText || jobRecommendationsData?.manualSkills || additionalInfo?.skillsText;
                    

                    
                    // Prioritize resume over skills if both exist (shouldn't happen, but just in case)
                    if (currentResume) {
                      return (
                        <UploadedCVSection 
                          resumeData={currentResume}
                          onBackToCareerInsights={handleBackToCareerInsights}
                        />
                      );
                    } else if (currentSkills) {
                      return (
                        <SkillsDescriptionSection 
                          skillsText={currentSkills}
                          onBackToCareerInsights={handleBackToCareerInsights}
                        />
                      );
                    }
                    return null;
                  })()}
                  
                  {/* Job Matches List */}
                  <div className="space-y-4">
                    {recentCareerMatches.map((job, index) => (
                      <JobMatchCard
                        key={index}
                        job={job}
                        index={index}
                        disabilities={jobRecommendationsData?.disabilities || additionalInfo?.disabilities}
                        onViewRoadmap={handleViewJobRecommendations}
                        createMonogram={createMonogram}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Empty State for Career Matches */
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="mb-8">
                    <img 
                      src={EmptyBoxIcon} 
                      alt="Empty Box" 
                      className="w-32 h-32 mx-auto"
                    />
                  </div>
                  
                  <div className="text-center max-w-md">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      No Matches Saved
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      Complete your career assessment to discover personalized job matches and save your favorites
                    </p>
                    <button
                      onClick={() => navigate('/career-insights')}
                      className="bg-[#2D6A4F] text-white px-6 py-3 rounded-lg hover:bg-[#22503B] transition-colors font-medium"
                    >
                      Start Career Assessment
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Skill Roadmap Tab */
            <div className="mt-8">
              {hasSavedRoadmaps() ? (
                <div className="space-y-6">
                  {savedRoadmaps.map((roadmap, index) => {
                    // Calculate total steps and resources
                    const totalSteps = (roadmap.roadmapData?.basic?.length || 0) + 
                                     (roadmap.roadmapData?.intermediate?.length || 0) + 
                                     (roadmap.roadmapData?.advanced?.length || 0) +
                                     (roadmap.roadmapData?.disabilityGuidance?.length || 0);
                    
                    // For resources, we'll use a simple calculation or default
                    const totalResources = Math.ceil(totalSteps * 0.8); // Approximate resources count
                    
                    return (
                      <motion.div
                        key={roadmap.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-[#EAEAEA] rounded-lg p-6 relative"
                      >
                        {/* Bookmark Icon and Delete Button */}
                        <div className="absolute top-4 right-4 flex items-center space-x-2">
                          <button
                            onClick={() => removeSavedRoadmap(roadmap.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Remove roadmap"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
                            <svg className="w-4 h-4 text-[#2D6A4F]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                            </svg>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="pr-16">
                          <h3 className="text-xl font-semibold text-[#252525] mb-2">
                            {roadmap.jobTitle}
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-4">
                            {totalSteps} steps • {totalResources} resources
                          </p>
                          
                          <p className="text-gray-700 text-sm leading-relaxed mb-6">
                            {getJobDescription(roadmap.jobTitle)}
                          </p>
                        </div>
                        
                        {/* Bottom Section with Button */}
                        <div className="border-t border-gray-200 pt-4 flex justify-end">
                          <button
                            onClick={() => setSelectedRoadmap(roadmap)}
                            className="bg-[#2D6A4F] text-white px-4 py-2 rounded-lg hover:bg-[#22503B] transition-colors font-medium text-sm"
                          >
                            View skill roadmap
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                /* Empty State for Roadmaps */
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="mb-8">
                    <img 
                      src={EmptyBoxIcon} 
                      alt="Empty Box" 
                      className="w-32 h-32 mx-auto"
                    />
                  </div>
                  
                  <div className="text-center max-w-md">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      No Roadmaps Saved
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {hasRecentMatches() 
                        ? 'Explore the roadmaps from your career matches and save the ones you want to follow'
                        : 'Complete your career assessment first, then save roadmaps from your job recommendations'
                      }
                    </p>
                    <button
                      onClick={() => navigate(hasRecentMatches() ? '/job-recommendations' : '/career-insights')}
                      className="bg-[#2D6A4F] text-white px-6 py-3 rounded-lg hover:bg-[#22503B] transition-colors font-medium"
                    >
                      {hasRecentMatches() ? 'View Job Recommendations' : 'Start Career Assessment'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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

      {/* Saved Roadmap Viewer Modal */}
      {selectedRoadmap && (
        <SavedRoadmapViewer
          roadmap={selectedRoadmap}
          onClose={() => setSelectedRoadmap(null)}
        />
      )}

    </div>
  );
}

export default MatchesRoadmaps;
