import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
          <h1 className="text-4xl font-bold text-[#252525] mb-12">{jobTitle} Skill Roadmap</h1>
          {loading ? (
            <div className="text-lg text-gray-500">Loading roadmap...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : roadmap ? (
            <div className="flex gap-16 items-start">
              {/* Left column: Section headers */}
              <div className="w-1/3 flex flex-col gap-24">
                {sectionList.map(section => (
                  <div key={section.key}>
                    <h2 className="text-xl font-semibold text-[#252525] mb-2">{section.label}</h2>
                    <p className="text-base text-[#888] max-w-xs">{section.description}</p>
                  </div>
                ))}
              </div>
              {/* Right column: Skills accordions */}
              <div className="flex-1 flex flex-col gap-24">
                {sectionList.map((section, sIdx) => {
                  const skills = Array.isArray(roadmap[section.key]) ? roadmap[section.key] : [];
                  return (
                    <div key={section.key}>
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
                  );
                })}
              </div>
            </div>
          ) : null}
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