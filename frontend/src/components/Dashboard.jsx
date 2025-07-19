import React, { useState } from 'react';
import Logo from '../assets/Logo.png';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { isAuthenticated, principal, logout, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedDisabilities, setSelectedDisabilities] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]); // New state for skills
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

  const jobOptions = [
    'Frontend Developer',
    'Backend Developer',
    'UI/UX Designer',
    'Customer Support',
    'Data Analyst'
  ];

  const skillOptions = [
    'User  Interface',
    'User  Experience',
    'CS',
    'SI',
    'Leadership'
  ];

  const handleDisabilitySelect = (disability) => {
    if (!selectedDisabilities.includes(disability)) {
      setSelectedDisabilities([...selectedDisabilities, disability]);
    }
  };

  const handleJobSelect = (job) => {
    if (!selectedJobs.includes(job)) {
      setSelectedJobs([...selectedJobs, job]);
    }
  };

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const truncatePrincipal = (principal) => {
    if (!principal) return '';
    return `${principal.slice(0, 8)}...${principal.slice(-4)}`;
  };

  const handleLogout = () => {
    logout();
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/skills');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex justify-between items-center py-6 shadow-sm bg-white px-10 border-gray-200 border-1 border-solid">
        <img src={Logo} alt="logo" className="w-[9%] h-auto" />
        <ul className="hidden md:flex space-x-6 text-gray-700 font-normal text-lg">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Features</a></li>
          <li><a href="#">Career</a></li>
          <li><a href="#">Contact</a></li>
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

      <div className="px-20 py-8">
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
              <div className="text-sm font-medium text-custom-dark">Job Interests</div>
            </div>
          </div>

          <div className="flex flex-col bg-white px-4">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 mb-2 ${step >= 3 ? 'bg-green-700' : 'bg-white border border-gray-300'}`}>
              {step === 4 ? <span className="text-white">✔</span> : <div className="w-3 h-3 rounded-full" style={{ backgroundColor: step >= 3 ? '#eaf1ee' : 'transparent' }}></div>}
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-gray-400">STEP 3</div>
              <div className="text-sm font-medium text-custom-dark">Skills You Have</div>
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
                              className={`flex items-center gap-2 px-3 py-[6px] border rounded-lg transition-colors ${
                                selectedDisabilities.includes(disability)
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
                  <h2 className="text-3xl font-medium text-custom-dark mb-4">What job interests you most?</h2>
                  <p className="text-base text-gray-500">This helps us match you with the right kind of job and support.</p>
                </div>
                <div className="space-y-5">
                  <div className="border border-gray-300 rounded-lg p-3 min-h-[52px] flex items-center flex-wrap gap-2">
                    {selectedJobs.map((job, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-emerald-700 text-white text-sm px-3 py-1 rounded-full"
                      >
                        <span>{job}</span>
                        <button
                          className="ml-2 text-white hover:text-gray-200"
                          onClick={() =>
                            setSelectedJobs(selectedJobs.filter((item) => item !== job))
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-base font-medium text-custom-dark mb-3">Job Options</label>
                    <div className="space-y-2">
                      {[0, 1].map(i => (
                        <div className="flex gap-2" key={i}>
                          {jobOptions.slice(i * 3, i * 3 + 3).map((job, index) => (
                            <button
                              key={index}
                              onClick={() => handleJobSelect(job)}
                              disabled={selectedJobs.includes(job)}
                              className={`flex items-center gap-2 px-3 py-[6px] border rounded-lg transition-colors ${
                                selectedJobs.includes(job)
                                  ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                                  : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-500'
                              }`}
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M7 0.875V13.125M0.875 7H13.125" stroke="#777777" strokeWidth="1.05" strokeLinecap="round" />
                              </svg>
                              <span className="text-sm">{job}</span>
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-medium text-custom-dark mb-4">What skills do you have?</h2>
                  <p className="text-base text-gray-500">Select the skills that apply to you.</p>
                </div>
                <div className="space-y-5">
                  <div className="border border-gray-300 rounded-lg p-3 min-h-[52px] flex items-center flex-wrap gap-2">
                    {selectedSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-emerald-700 text-white text-sm px-3 py-1 rounded-full"
                      >
                        <span>{skill}</span>
                        <button
                          className="ml-2 text-white hover:text-gray-200"
                          onClick={() =>
                            setSelectedSkills(selectedSkills.filter((item) => item !== skill))
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-base font-medium text-custom-dark mb-3">Skill Options</label>
                    <div className="space-y-2">
                      {[0, 1].map(i => (
                        <div className="flex gap-2" key={i}>
                          {skillOptions.slice(i * 3, i * 3 + 3).map((skill, index) => (
                            <button
                              key={index}
                              onClick={() => handleSkillSelect(skill)}
                              disabled={selectedSkills.includes(skill)}
                              className={`flex items-center gap-2 px-3 py-[6px] border rounded-lg transition-colors ${
                                selectedSkills.includes(skill)
                                  ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                                  : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-500'
                              }`}
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M7 0.875V13.125M0.875 7H13.125" stroke="#777777" strokeWidth="1.05" strokeLinecap="round" />
                              </svg>
                              <span className="text-sm">{skill}</span>
                            </button>
                          ))}
                        </div>
                      ))}
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
                className="bg-emerald-800 text-white px-5 py-2 rounded-md shadow hover:bg-emerald-700 transition"
              >
                {step === 3 ? 'Finish' : 'Next'}
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
