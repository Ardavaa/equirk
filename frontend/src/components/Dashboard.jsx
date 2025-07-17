import React, { useState } from 'react';
import Logo from '../assets/Logo.png';
import { useAuth } from '../contexts/AuthContext';

/**
 * Dashboard page for authenticated users - Disability Type step.
 *
 * @component
 * @returns {JSX.Element} The disability type dashboard page content.
 *
 * @example
 * return <Dashboard />
 */
function Dashboard() {
  const { isAuthenticated, principal, logout, isLoading } = useAuth();
  const [disabilityInput, setDisabilityInput] = useState('');
  const [selectedDisabilities, setSelectedDisabilities] = useState([]);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Section */}
      <nav className="flex justify-between items-center py-6 shadow-sm bg-white px-10 border-gray-200 border-1 border-solid">
        <img src={Logo} alt="logo" className="w-[9%] h-auto" />

        <ul className="hidden md:flex space-x-6 text-gray-700 font-normal text-lg">
          <li><a href="#" onClick={isAuthenticated ? undefined : () => {}}>Home</a></li>
          <li><a href="#" onClick={isAuthenticated ? undefined : () => {}}>About</a></li>
          <li><a href="#" onClick={isAuthenticated ? undefined : () => {}}>Features</a></li>
          <li><a href="#" onClick={isAuthenticated ? undefined : () => {}}>Career</a></li>
          <li><a href="#" onClick={isAuthenticated ? undefined : () => {}}>Contact</a></li>
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

      {/* Progress Steps */}
      <div className="px-20 py-8">
        <div className="relative flex justify-between items-start max-w-[1280px] mx-auto">
          {/* Connecting Line */}
          <div className="absolute top-3 h-0.5" style={{left: '9%', right: '12%', backgroundColor: '#eaf1ee'}}></div>
          
          {/* Step 1 - Current */}
          <div className="flex flex-col bg-white px-4">
            <div className="w-6 h-6 bg-green-700 rounded-full flex items-center justify-center relative z-10 mb-2">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-gray-400">STEP 1</div>
              <div className="text-sm font-medium text-gray-900">Disability Type</div>
            </div>
          </div>

          {/* Step 2 - Pending */}
          <div className="flex flex-col bg-white px-4">
            <div className="w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center relative z-10 mb-2">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#eaf1ee'}}></div>
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-gray-400">STEP 2</div>
              <div className="text-sm font-medium text-gray-900">Job Interests</div>
            </div>
          </div>

          {/* Step 3 - Pending */}
          <div className="flex flex-col bg-white px-4">
            <div className="w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center relative z-10 mb-2">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#eaf1ee'}}></div>
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-gray-400">STEP 3</div>
              <div className="text-sm font-medium text-gray-900">Skills You Have</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="flex justify-center px-20 mt-12">
        <div className="w-[660px] bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-medium text-black mb-4">
                What's your disability type?
              </h2>
              <p className="text-base text-gray-500">
                This helps us match you with the right kind of job and support.
              </p>
            </div>

            {/* Form Content */}
            <div className="space-y-5">
              {/* Disability Input */}
              <div>
                <label className="block text-base font-medium text-black mb-3">
                  Disability
                </label>
                <div className="border border-gray-300 rounded-lg p-3 h-[52px] flex items-center">
                  <input
                    type="text"
                    placeholder="Enter disability type"
                    value={disabilityInput}
                    onChange={(e) => setDisabilityInput(e.target.value)}
                    className="w-full text-base text-gray-500 placeholder-gray-500 outline-none"
                  />
                </div>
              </div>

              {/* Common Disability Types */}
              <div>
                <label className="block text-base font-medium text-black mb-3">
                  Common Disability Types
                </label>
                <div className="space-y-2">
                  {/* Row 1 */}
                  <div className="flex gap-2">
                    {disabilityTypes.slice(0, 3).map((disability, index) => (
                      <button
                        key={index}
                        onClick={() => handleDisabilitySelect(disability)}
                        className="flex items-center gap-2 px-3 py-[6px] bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M7 0.875V13.125M0.875 7H13.125" stroke="#777777" strokeWidth="1.05" strokeLinecap="round"/>
                        </svg>
                        <span className="text-sm text-gray-500">{disability}</span>
                      </button>
                    ))}
                  </div>

                  {/* Row 2 */}
                  <div className="flex gap-2">
                    {disabilityTypes.slice(3, 6).map((disability, index) => (
                      <button
                        key={index + 3}
                        onClick={() => handleDisabilitySelect(disability)}
                        className="flex items-center gap-2 px-3 py-[6px] bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M7 0.875V13.125M0.875 7H13.125" stroke="#777777" strokeWidth="1.05" strokeLinecap="round"/>
                        </svg>
                        <span className="text-sm text-gray-500">{disability}</span>
                      </button>
                    ))}
                  </div>

                  {/* Row 3 */}
                  <div className="flex gap-2">
                    {disabilityTypes.slice(6, 7).map((disability, index) => (
                      <button
                        key={index + 6}
                        onClick={() => handleDisabilitySelect(disability)}
                        className="flex items-center gap-2 px-3 py-[6px] bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M7 0.875V13.125M0.875 7H13.125" stroke="#777777" strokeWidth="1.05" strokeLinecap="round"/>
                        </svg>
                        <span className="text-sm text-gray-500">{disability}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="border-t border-gray-300 p-4 rounded-b-xl flex justify-end gap-3">
            <button className="px-6 py-4 bg-gray-200 border border-gray-300 rounded-lg text-base font-medium text-gray-600 shadow-sm hover:bg-gray-300 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 mt-16 px-20 py-6">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center">
          <div className="text-base text-gray-500">
            Equirk © 2025. All rights reserved.
          </div>
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