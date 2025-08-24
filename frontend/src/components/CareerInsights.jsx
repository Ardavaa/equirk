import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/Logo.png';
import LogoutIcon from '../assets/Logout Button.png';
import { useAuth } from '../contexts/AuthContext';
import { useJobRecommendations } from '../contexts/JobRecommendationsContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ResumeUpload from './ResumeUpload';
import { useReducedMotion, getAccessibleTransition } from '../hooks/useReducedMotion';

function CareerInsights() {
  const { isAuthenticated, principal, logout, isLoading } = useAuth();
  const { saveJobRecommendationsData } = useJobRecommendations();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [selectedDisabilities, setSelectedDisabilities] = useState([]);
  const [skillsText, setSkillsText] = useState(''); // Changed to text input for skills
  const [selectedResume, setSelectedResume] = useState(null); // New state for resume
  const [extractedText, setExtractedText] = useState(''); // New state for extracted text
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [isGettingManualRecommendations, setIsGettingManualRecommendations] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const dropdownRef = useRef(null);

  const getJobRecommendationsFromManualSkills = async (skillsText) => {
    const response = await fetch(`${import.meta.env.VITE_ML_API_URL || 'http://localhost:5000'}/recommend-jobs-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cv_text: skillsText // Use the manual skills text as CV text
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get job recommendations');
    }

    const data = await response.json();
    return data.recommendations || [];
  }; // New state for job recommendations
  const navigate = useNavigate();

  // Scroll to top and reset state when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    // Reset to step 1 when navigating to this component
    setStep(1);
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



  const disabilityTypes = [
    'Visual impairment',
    'Hearing impairment',
    'Physical disability',
    'Neurodivergent',
    'Learning disability',
    'Mobility Impairment',
    'Chronic illness'
  ];

  const handleDisabilitySelect = (disability) => {
    if (!selectedDisabilities.includes(disability)) {
      setSelectedDisabilities([...selectedDisabilities, disability]);
    }
  };

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

  const handleNavigation = (section) => {
    navigate(`/#${section}`);
  };

  const handleMatchesRoadmaps = () => {
    navigate('/matches-roadmaps');
  };

  const handleNext = async () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Final completion - navigate to job recommendations page
      // Use CV data if resume is uploaded, otherwise use manual skills input
      const finalSkillsData = selectedResume && extractedText ? extractedText : skillsText;
      let finalJobRecommendations = jobRecommendations;

      // If no CV was uploaded but manual skills exist, get job recommendations
      if (!selectedResume && !extractedText && skillsText.trim()) {
        try {
          setIsGettingManualRecommendations(true);

          const manualRecommendations = await getJobRecommendationsFromManualSkills(skillsText);
          finalJobRecommendations = manualRecommendations;
          setJobRecommendations(manualRecommendations);
        } catch (error) {
          console.error('Failed to get job recommendations for manual skills:', error);
          // Continue with empty recommendations on error
        } finally {
          setIsGettingManualRecommendations(false);
        }
      }

      // Save job recommendations data
      saveJobRecommendationsData({
        disabilities: selectedDisabilities,
        skillsSource: selectedResume && extractedText ? 'resume' : 'manual',
        skillsData: finalSkillsData,
        resume: selectedResume,
        extractedText: extractedText,
        manualSkills: skillsText,
        jobRecommendations: finalJobRecommendations
      });

      // Scroll to top before navigation
      window.scrollTo(0, 0);

      // Navigate to job recommendations page with all data
      navigate('/job-recommendations', {
        state: {
          disabilities: selectedDisabilities,
          skillsSource: selectedResume && extractedText ? 'resume' : 'manual',
          skillsData: finalSkillsData,
          resume: selectedResume,
          extractedText: extractedText,
          manualSkills: skillsText,
          jobRecommendations: finalJobRecommendations
        }
      });
    }
  };

  const handleResumeSelect = (file) => {
    setSelectedResume(file);
  };

  const handleTextExtracted = (text, fileData) => {
    setExtractedText(text);
    
    // Store file data for later use
    if (fileData) {
      setSelectedResume(prev => ({
        ...prev,
        fileContent: fileData.content,
        originalname: fileData.originalname,
        mimetype: fileData.mimetype,
        size: fileData.size
      }));
    }
  };

  const handleJobRecommendations = (recommendations, fileData) => {
    setJobRecommendations(recommendations);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
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
                  <span className="text-[#2D6A4F] font-medium text-lg cursor-pointer">
                    Career Insights
                  </span>
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
              {isAuthenticated && (
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
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="px-20 py-8 pt-28">
        <div className="relative flex justify-between items-start max-w-[1280px] mx-auto">
          <div className="absolute top-3 h-0.5 bg-[#eaf1ee] left-[33%] right-[45%] sm:left-[31%] sm:right-[32%] md:left-[3%] md:right-[10%]"></div>

          {/* Step Indicators */}
          <div className="flex flex-col bg-white px-4 pl-10 md:pl-0">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 mb-2 ${step >= 1 ? 'bg-green-700' : 'bg-white border border-gray-300'}`}>
              {step > 1 ? <span className="text-white">✔</span> : <div className="w-3 h-3 bg-white rounded-full"></div>}
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-gray-400">STEP 1</div>
              <div className="text-sm font-medium text-custom-dark">Disability Type</div>
            </div>
          </div>

          <div className="flex flex-col bg-white px-4">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 mb-2 ${step >= 2 ? 'bg-green-700' : 'bg-white border border-gray-300'}`}>
              {step > 2 ? <span className="text-white">✔</span> : <div className="w-3 h-3 rounded-full" style={{ backgroundColor: step >= 2 ? '#eaf1ee' : 'transparent' }}></div>}
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-gray-400">STEP 2</div>
              <div className="text-sm font-medium text-custom-dark">Skills & Resume</div>
            </div>
          </div>
        </div>
      </div>


      <div className="flex justify-center px-20 mt-12">
        <div className="w-[300px] md:w-[660px] bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-10">
            {step === 1 && (
              <>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-medium text-custom-dark mb-4">What's your disability type?</h2>
                  <p className="text-base text-gray-500">This helps us match you with the right kind of job and support.</p>
                </div>
                <div className="space-y-5">
                  <div className="border border-gray-300 rounded-lg p-3 min-h-[52px] flex items-center flex-wrap gap-2">
                    {selectedDisabilities.map((disability, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-[#2d6a4f] text-[#FFFFFF] text-sm px-3 py-2 rounded-lg font-medium"
                      >
                        <button
                          className="mr-2 text-[#FFFFFF] hover:text-gray-200 flex items-center justify-center w-4 h-4"
                          onClick={() =>
                            setSelectedDisabilities(selectedDisabilities.filter((item) => item !== disability))
                          }
                        >
                          ×
                        </button>
                        <span>{disability}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    {/* Dropdown for mobile */}
                    <div className="block sm:hidden mb-4">
                      <label className="block text-base font-medium text-custom-dark mb-2">Select Disability Type</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                        value=""
                        onChange={e => handleDisabilitySelect(e.target.value)}
                      >
                        <option value="" disabled>Select...</option>
                        {disabilityTypes.map((disability, index) => (
                          <option key={index} value={disability} disabled={selectedDisabilities.includes(disability)}>
                            {disability}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Buttons for desktop/tablet */}
                    <div className="hidden sm:flex flex-wrap gap-2 justify-center px-2">
                      {disabilityTypes.map((disability, index) => (
                        <button
                          key={index}
                          onClick={() => handleDisabilitySelect(disability)}
                          disabled={selectedDisabilities.includes(disability)}
                          className={`flex items-center gap-2 px-3 py-[6px] border rounded-lg transition-colors w-full sm:w-auto
                            ${selectedDisabilities.includes(disability)
                              ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-500'
                            }`}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 0.875V13.125M0.875 7H13.125" stroke="#777777" strokeWidth="1.05" strokeLinecap="round" />
                          </svg>
                          <span className="text-sm">{disability}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-medium text-custom-dark mb-4">What skills do you have?</h2>
                  <p className="text-base text-gray-500">You can either describe your skills manually or upload your resume - we'll extract skills from it.</p>
                </div>
                <div className="space-y-8">
                  {/* Manual Skills Input Section */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-base font-medium text-custom-dark mb-3">
                        Describe Your Skills
                        {selectedResume && extractedText && (
                          <span className="text-sm font-normal text-gray-500 ml-2">(This will be ignored if you upload a resume)</span>
                        )}
                      </label>
                      <textarea
                        value={skillsText}
                        onChange={(e) => setSkillsText(e.target.value)}
                        placeholder="Describe your skills, experience, and expertise. For example: 'I have 3 years of experience in React and JavaScript development, proficient in UI/UX design, familiar with Node.js and MongoDB...'"
                        className={`w-full p-4 border border-gray-300 rounded-lg resize-none transition-colors focus:ring-2 focus:ring-emerald-600 focus:border-transparent ${selectedResume && extractedText
                          ? 'bg-gray-50 text-gray-500'
                          : 'bg-white text-gray-900'
                          }`}
                        rows={6}
                        disabled={selectedResume && extractedText}
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  {/* Resume Upload Section */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-base font-medium text-custom-dark mb-3">Upload Resume/CV</label>
                      <p className="text-sm text-gray-500 mb-4">Upload your resume and we'll automatically extract your skills.</p>
                      <ResumeUpload
                        onFileSelect={handleResumeSelect}
                        onTextExtracted={handleTextExtracted}
                        onJobRecommendations={handleJobRecommendations}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 mt-6">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-2 rounded-lg font-medium border border-[#2C6A4F] bg-white text-[#2C6A4F] hover:bg-gray-50 transition-all duration-200"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={isGettingManualRecommendations || (step === 1 && selectedDisabilities.length === 0) || (step === 2 && !skillsText.trim() && !selectedResume)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isGettingManualRecommendations
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : (step === 1 && selectedDisabilities.length === 0) || (step === 2 && !skillsText.trim() && !selectedResume)
                    ? 'bg-[#EAEAEA] text-[#777777] cursor-not-allowed'
                    : 'bg-[#2c6a4f] text-[#FFFFFF] hover:bg-[#245a43] shadow-sm'
                  }`}
              >
                {isGettingManualRecommendations ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Getting Job Recommendations...
                  </span>
                ) : (
                  step === 2 ? 'Save and Continue' : 'Save and Continue'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

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

export default CareerInsights;
