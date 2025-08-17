import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/Logo.png';
import LogoutIcon from '../assets/Logout Button.png';
import { useAuth } from '../contexts/AuthContext';
import { useJobRecommendations } from '../contexts/JobRecommendationsContext';
import { useReducedMotion, getAccessibleTransition } from '../hooks/useReducedMotion';

function Course() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, principal, isLoading } = useAuth();
  const { hasJobRecommendationsData } = useJobRecommendations();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const dropdownRef = useRef(null);

  // Accept job title and disabilities via state or query param
  const jobTitle = location.state?.jobTitle || 'Content Writer';
  const disabilities = location.state?.disabilities || [];

  // Track which skill is open per section
  const [openIndexes, setOpenIndexes] = useState({ basic: 0, intermediate: 0, advanced: 0 });

  // Roadmap state
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Section meta info
  const sectionList = [
    { key: 'basic', label: 'Basic', description: 'Learn what content writing is, how to express ideas clearly, and understand basic tools and formats.' },
    { key: 'intermediate', label: 'Intermediate', description: 'Dive into copywriting techniques, adapt tone and format for different platforms, and start building strategy into your writing.' },
    { key: 'advanced', label: 'Advanced', description: 'Learn how to plan content strategically, write for global audiences, and build a portfolio that helps you land freelance or remote jobs.' },
    ...(disabilities.length > 0 ? [{ key: 'disability', label: 'Accessibility & Inclusion', description: 'Specialized guidance for working in this field with your specific disability considerations and accommodations.' }] : [])
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);
    console.log('Fetching roadmap for:', jobTitle, 'with disabilities:', disabilities);
    
    const params = new URLSearchParams({
      job: jobTitle,
      ...(disabilities.length > 0 && { disabilities: disabilities.join(',') })
    });
    
    fetch(`/api/roadmap?${params}`)
      .then(res => {
        console.log('Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Roadmap data received:', data);
        console.log('Disability guidance received:', data.disabilityGuidance);
        console.log('Disabilities sent:', disabilities);
        setRoadmap(data);
        setLoading(false);
      })
      .catch(e => {
        console.error('Fetch error:', e);
        setError(e.message);
        setLoading(false);
      });
  }, [jobTitle, disabilities]); // Add disabilities to dependency array

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

  const handleNavigation = (section) => {
    navigate(`/#${section}`);
  };

  const handleAccordion = (section, idx) => {
    setOpenIndexes((prev) => ({ ...prev, [section]: prev[section] === idx ? null : idx }));
  };

  const handleBackToJobRecommendations = () => {
    if (hasJobRecommendationsData()) {
      navigate('/job-recommendations');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Fixed like landing page */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-6 shadow-sm bg-white px-10 border-gray-200 border-1 border-solid">
        <img src={Logo} alt="logo" className="w-[9%] h-auto" />
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
                        navigate(hasJobRecommendationsData() ? '/job-recommendations' : '/dashboard');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      {hasJobRecommendationsData() ? 'Job Recommendations' : 'Dashboard'}
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

      {/* Main Content - Figma-aligned layout */}
      <div className="px-20 py-10 pt-28">
        <div className="max-w-[1280px] mx-auto">
          {/* Header with Action Bar */}
          <div className="flex justify-between items-start mb-12">
            <div>
              {/* Back button */}
              <button 
                onClick={handleBackToJobRecommendations}
                className="flex items-center gap-2 text-[#2D6A4F] hover:text-[#22503B] transition-colors mb-4 group"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {hasJobRecommendationsData() ? 'Back to Job Recommendations' : 'Back to Dashboard'}
              </button>
              
              <h1 className="text-4xl font-bold text-[#252525] mb-2">{jobTitle} Skill Roadmap</h1>
              <p className="text-gray-600">Your personalized learning path to become a {jobTitle}</p>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="min-h-[600px]">
            {loading ? (
              <div className="flex flex-col gap-16">
                {/* Loading skeleton for each section */}
                {sectionList.map((section, idx) => (
                  <div key={section.key} className="flex gap-16 items-start">
                    {/* Left column: Section header skeleton */}
                    <div className="w-1/3 flex-shrink-0">
                      <div className="h-6 bg-gray-200 rounded-md mb-2 w-24 animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                    
                    {/* Right column: Skills skeleton */}
                    <div className="flex-1">
                      <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((skillIdx) => (
                          <div key={skillIdx} className="flex items-center py-4 border-b border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-gray-200 mr-5 animate-pulse"></div>
                            <div className="flex-1">
                              <div className="h-5 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                            </div>
                            <div className="w-5 h-5 bg-gray-200 rounded-md animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Loading text with spinner */}
                <div className="flex items-center justify-center py-8">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#2D6A4F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-lg text-gray-500">Loading roadmap...</span>
                </div>
              </div>
            ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : roadmap ? (
            <div className="flex flex-col gap-16">
              {sectionList.map((section, sIdx) => {
                // Handle disability section differently - it contains markdown content instead of skills array
                if (section.key === 'disability') {
                  return (
                    <div key={section.key} className="flex gap-16 items-start">
                      {/* Left column: Section header */}
                      <div className="w-1/3 flex-shrink-0">
                        <h2 className="text-xl font-semibold text-[#252525] mb-2">{section.label}</h2>
                        <p className="text-base text-[#888] max-w-xs">{section.description}</p>
                      </div>
                      
                      {/* Right column: Disability guidance content */}
                      <div className="flex-1">
                        {roadmap && roadmap.disabilityGuidance ? (
                          <div className="prose prose-gray max-w-none">
                            <div 
                              className="text-base text-gray-700 leading-relaxed space-y-4 markdown-content"
                              dangerouslySetInnerHTML={{ 
                                __html: roadmap.disabilityGuidance
                                  .replace(/\n\n/g, '</p><p>')
                                  .replace(/\n/g, '<br />')
                                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                  .replace(/^(.+)$/gm, '<p>$1</p>')
                                  .replace(/^#\s+(.+)$/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
                                  .replace(/^##\s+(.+)$/gm, '<h4 class="text-base font-semibold text-gray-800 mt-4 mb-2">$1</h4>')
                                  .replace(/^-\s+(.+)$/gm, '<li class="ml-4">$1</li>')
                                  .replace(/(<li.*?>.*?<\/li>)/gs, '<ul class="list-disc pl-5 space-y-1 my-3">$1</ul>')
                              }} 
                            />
                          </div>
                        ) : !loading && disabilities.length > 0 ? (
                          <div className="text-gray-500">
                            <p className="mb-2">Accessibility guidance could not be generated at this time.</p>
                            <p className="text-sm">Please try refreshing the page or contact support if the issue persists.</p>
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
                    {/* Left column: Section header */}
                    <div className="w-1/3 flex-shrink-0">
                      <h2 className="text-xl font-semibold text-[#252525] mb-2">{section.label}</h2>
                      <p className="text-base text-[#888] max-w-xs">{section.description}</p>
                    </div>
                    
                    {/* Right column: Skills for this section */}
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
                            {/* Expanded content */}
                            {openIndexes[section.key] === idx && (
                              <div className="pl-16 pb-4">
                                {skill.description && (
                                  <p className="text-[#888] text-base mb-2">{skill.description}</p>
                                )}
                                {/* Optional: resources, if LLM returns */}
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
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 mt-16 px-20 py-6 bg-white">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center">
          <div className="text-base text-gray-500">Equirk © 2025. All rights reserved.</div>
          <div className="flex gap-5">
            <span className="text-base text-gray-500 cursor-pointer hover:text-gray-700">Terms of Service</span>
            <span className="text-base text-gray-500 cursor-pointer hover:text-gray-700">Privacy Policy</span>
            <span className="text-base text-gray-500 cursor-pointer hover:text-gray-700">Cookie Settings</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Course; 