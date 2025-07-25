import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/Logo.png';
import { useAuth } from '../contexts/AuthContext';

function Course() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, principal, isLoading } = useAuth();

  // Accept job title via state or query param
  const jobTitle = location.state?.jobTitle || 'Content Writer';

  // Track which skill is open per section
  const [openIndexes, setOpenIndexes] = useState({ basic: 0, intermediate: 0, advanced: 0 });

  // Roadmap state
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Save roadmap state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveState, setSaveState] = useState('idle'); // idle, saving, saved
  const [roadmapName, setRoadmapName] = useState('');
  const [roadmapNotes, setRoadmapNotes] = useState('');

  // Section meta info
  const sectionList = [
    { key: 'basic', label: 'Basic', description: 'Learn what content writing is, how to express ideas clearly, and understand basic tools and formats.' },
    { key: 'intermediate', label: 'Intermediate', description: 'Dive into copywriting techniques, adapt tone and format for different platforms, and start building strategy into your writing.' },
    { key: 'advanced', label: 'Advanced', description: 'Learn how to plan content strategically, write for global audiences, and build a portfolio that helps you land freelance or remote jobs.' }
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);
    console.log('Fetching roadmap for:', jobTitle);
    fetch(`/api/roadmap?job=${encodeURIComponent(jobTitle)}`)
      .then(res => {
        console.log('Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Roadmap data received:', data);
        setRoadmap(data);
        setLoading(false);
      })
      .catch(e => {
        console.error('Fetch error:', e);
        setError(e.message);
        setLoading(false);
      });
  }, [jobTitle]);

  // Set default roadmap name when jobTitle changes
  useEffect(() => {
    setRoadmapName(`${jobTitle} Learning Path`);
  }, [jobTitle]);

  const truncatePrincipal = (principal) => {
    if (!principal) return '';
    return `${principal.slice(0, 8)}...${principal.slice(-4)}`;
  };

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (section) => {
    navigate(`/#${section}`);
  };

  const handleAccordion = (section, idx) => {
    setOpenIndexes((prev) => ({ ...prev, [section]: prev[section] === idx ? null : idx }));
  };

  const handleSaveRoadmap = () => {
    setShowSaveModal(true);
  };

  const handleSaveConfirm = async () => {
    setSaveState('saving');
    
    try {
      // Simulate API call - replace with actual save logic later
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const roadmapData = {
        jobTitle,
        roadmapName,
        roadmapNotes,
        roadmap,
        savedAt: new Date().toISOString(),
        principalId: principal
      };
      
      console.log('Saving roadmap:', roadmapData);
      
      setSaveState('saved');
      
      // Close modal after showing success state
      setTimeout(() => {
        setShowSaveModal(false);
        setSaveState('idle');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving roadmap:', error);
      setSaveState('idle');
    }
  };

  const handleModalClose = () => {
    setShowSaveModal(false);
    setSaveState('idle');
  };

  const getTotalSkills = () => {
    if (!roadmap) return 0;
    return Object.values(roadmap).reduce((total, skills) => {
      return total + (Array.isArray(skills) ? skills.length : 0);
    }, 0);
  };

  const getButtonState = () => {
    switch (saveState) {
      case 'saving':
        return { text: 'Saving...', disabled: true, icon: 'spinner' };
      case 'saved':
        return { text: 'Saved ✓', disabled: false, icon: 'check' };
      default:
        return { text: 'Save Roadmap', disabled: false, icon: 'bookmark' };
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Fixed like landing page */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-6 shadow-sm bg-white px-10 border-gray-200 border-1 border-solid">
        <img src={Logo} alt="logo" className="w-[9%] h-auto" />
        <ul className="hidden md:flex space-x-6 text-gray-700 font-normal text-lg">
          <li><button onClick={() => handleNavigation('')} className="hover:text-emerald-700 transition-colors">Home</button></li>
          <li><button onClick={() => handleNavigation('about')} className="hover:text-emerald-700 transition-colors">About</button></li>
          <li><button onClick={() => handleNavigation('features')} className="hover:text-emerald-700 transition-colors">Features</button></li>
          <li><button onClick={() => handleNavigation('career')} className="hover:text-emerald-700 transition-colors">Career</button></li>
          <li><button onClick={() => handleNavigation('contact')} className="hover:text-emerald-700 transition-colors">Contact</button></li>
          <li><button onClick={() => navigate('/library')} className="hover:text-emerald-700 transition-colors">Library</button></li>
        </ul>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <span>Welcome:</span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
              {truncatePrincipal(principal)}
            </span>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-emerald-800 text-white px-5 py-2 rounded-md shadow hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Logout'}
          </button>
        </div>
      </nav>

      {/* Main Content - Figma-aligned layout */}
      <div className="px-20 py-10 pt-28">
        <div className="max-w-[1280px] mx-auto">
          {/* Header with Action Bar */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold text-[#252525] mb-2">{jobTitle} Skill Roadmap</h1>
              <p className="text-gray-600">Your personalized learning path to become a {jobTitle}</p>
            </div>
            
            {/* Action buttons */}
            {!loading && !error && roadmap && (
              <motion.button 
                  onClick={handleSaveRoadmap}
                  disabled={getButtonState().disabled}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all shadow-lg hover:shadow-xl ${
                    saveState === 'saved' 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gradient-to-r from-[#2D6A4F] to-[#22503B] hover:from-[#285f47] hover:to-[#1e4634] text-white'
                  } ${getButtonState().disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  whileHover={!getButtonState().disabled ? { scale: 1.02 } : {}}
                  whileTap={!getButtonState().disabled ? { scale: 0.98 } : {}}
                >
                  {getButtonState().icon === 'spinner' && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {getButtonState().icon === 'check' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {getButtonState().icon === 'bookmark' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  )}
                  {getButtonState().text}
                </motion.button>
            )}
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

      {/* Save Roadmap Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleModalClose}
          >
            <motion.div 
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {saveState === 'saved' ? (
                // Success State
                <div className="text-center">
                  <motion.div 
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-[#252525] mb-2">Roadmap Saved!</h3>
                  <p className="text-gray-600 mb-4">Your learning path has been saved to your profile</p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800 font-medium">{roadmapName}</p>
                    <p className="text-xs text-green-600">{getTotalSkills()} skills • 3 sections</p>
                  </div>
                </div>
              ) : (
                // Save Form State
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#81a595] to-[#377056] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-[#252525] mb-2">Save Your Roadmap</h3>
                    <p className="text-gray-600">Keep track of your learning progress and access it anytime</p>
                  </div>
                  
                  {/* Roadmap Preview */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#81a595] to-[#377056] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {jobTitle.split(' ').map(word => word[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-[#252525] text-sm">{jobTitle}</p>
                        <p className="text-xs text-gray-500">{getTotalSkills()} skills • 3 sections</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Roadmap Name</label>
                      <input 
                        type="text" 
                        value={roadmapName}
                        onChange={(e) => setRoadmapName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-colors text-[#252525]"
                        placeholder="Enter roadmap name..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Add Notes (Optional)</label>
                      <textarea 
                        value={roadmapNotes}
                        onChange={(e) => setRoadmapNotes(e.target.value)}
                        placeholder="Add personal notes about your learning goals..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent h-20 resize-none transition-colors text-[#252525]"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={handleModalClose}
                      disabled={saveState === 'saving'}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[#252525]"
                    >
                      Cancel
                    </button>
                    <motion.button 
                      onClick={handleSaveConfirm}
                      disabled={saveState === 'saving' || !roadmapName.trim()}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        saveState === 'saving' || !roadmapName.trim()
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#2D6A4F] text-white hover:bg-[#22503B]'
                      }`}
                      whileHover={saveState !== 'saving' && roadmapName.trim() ? { scale: 1.02 } : {}}
                      whileTap={saveState !== 'saving' && roadmapName.trim() ? { scale: 0.98 } : {}}
                    >
                      {saveState === 'saving' && (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {saveState === 'saving' ? 'Saving...' : 'Save Roadmap'}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Course; 