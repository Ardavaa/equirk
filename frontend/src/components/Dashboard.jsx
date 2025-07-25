import React, { useState, useEffect } from 'react';
import Logo from '../assets/Logo.png';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ResumeUpload from './ResumeUpload';

function Dashboard() {
  const { isAuthenticated, principal, logout, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedDisabilities, setSelectedDisabilities] = useState([]);
  const [skillsText, setSkillsText] = useState(''); // Changed to text input for skills
  const [selectedResume, setSelectedResume] = useState(null); // New state for resume
  const [extractedText, setExtractedText] = useState(''); // New state for extracted text
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [isGettingManualRecommendations, setIsGettingManualRecommendations] = useState(false);

  const getJobRecommendationsFromManualSkills = async (skillsText) => {
    const response = await fetch('http://localhost:5000/recommend-jobs-batch', {
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
  };

  const handleNavigation = (section) => {
    navigate(`/#${section}`);
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
          console.log('Getting job recommendations for manual skills:', skillsText);
          
          const manualRecommendations = await getJobRecommendationsFromManualSkills(skillsText);
          finalJobRecommendations = manualRecommendations;
          setJobRecommendations(manualRecommendations);
          
          console.log('Manual job recommendations received:', manualRecommendations);
        } catch (error) {
          console.error('Failed to get job recommendations for manual skills:', error);
          // Continue with empty recommendations on error
        } finally {
          setIsGettingManualRecommendations(false);
        }
      }
      
      console.log('Onboarding completed!', {
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
    console.log('Resume selected:', file);
  };

  const handleTextExtracted = (text) => {
    setExtractedText(text);
    console.log('Text extracted from PDF:', text);
  };

  const handleJobRecommendations = (recommendations) => {
    setJobRecommendations(recommendations);
    console.log('Job recommendations received:', recommendations);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-6 shadow-sm bg-white px-10 border-gray-200 border-1 border-solid">
        <img src={Logo} alt="logo" className="w-[9%] h-auto" />
        <ul className="hidden md:flex space-x-6 text-gray-700 font-normal text-lg">
          <li><button onClick={() => handleNavigation('')} className="hover:text-emerald-700 transition-colors">Home</button></li>
          <li><button onClick={() => handleNavigation('about')} className="hover:text-emerald-700 transition-colors">About</button></li>
          <li><button onClick={() => handleNavigation('features')} className="hover:text-emerald-700 transition-colors">Features</button></li>
          <li><button onClick={() => handleNavigation('career')} className="hover:text-emerald-700 transition-colors">Career</button></li>
          <li><button onClick={() => handleNavigation('contact')} className="hover:text-emerald-700 transition-colors">Contact</button></li>
        </ul>
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span>Welcome:</span>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                {truncatePrincipal(principal)}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-emerald-800 text-white px-5 py-2 rounded-md shadow hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </nav>

      <div className="px-20 py-8 pt-28">
        <div className="relative flex justify-between items-start max-w-[1280px] mx-auto">
          <div className="absolute top-3 h-0.5" style={{ left: '9%', right: '12%', backgroundColor: '#eaf1ee' }}></div>

          {/* Step Indicators */}
          <div className="flex flex-col bg-white px-4">
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
        <div className="w-[660px] bg-white rounded-xl shadow-sm border border-gray-100">
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
                        className="flex items-center bg-emerald-700 text-white text-sm px-3 py-1 rounded-full"
                      >
                        <span>{disability}</span>
                        <button
                          className="ml-2 text-white hover:text-gray-200"
                          onClick={() =>
                            setSelectedDisabilities(selectedDisabilities.filter((item) => item !== disability))
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-base font-medium text-custom-dark mb-3">Common Disability Types</label>
                    <div className="space-y-2">
                      {[0, 1, 2].map(i => (
                        <div className="flex gap-2" key={i}>
                          {disabilityTypes.slice(i * 3, i * 3 + 3).map((disability, index) => (
                            <button
                              key={index}
                              onClick={() => handleDisabilitySelect(disability)}
                              disabled={selectedDisabilities.includes(disability)}
                              className={`flex items-center gap-2 px-3 py-[6px] border rounded-lg transition-colors ${selectedDisabilities.includes(disability)
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
                        className={`w-full p-4 border border-gray-300 rounded-lg resize-none transition-colors focus:ring-2 focus:ring-emerald-600 focus:border-transparent ${
                          selectedResume && extractedText 
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

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={isGettingManualRecommendations}
                className={`px-5 py-2 rounded-md shadow transition ${
                  isGettingManualRecommendations 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-emerald-800 text-white hover:bg-emerald-700'
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
                  step === 2 ? 'Complete Setup' : 'Next'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>



      <div className="border-t border-gray-300 mt-16 px-20 py-6">
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

export default Dashboard;
