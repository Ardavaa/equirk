import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import { useAuth } from '../contexts/AuthContext';

const SKILL_MAP = [
  {
    section: 'Basic',
    description: 'Learn what content writing is, how to express ideas clearly, and understand basic tools and formats.',
    skills: [
      {
        title: 'What is Content Writing',
        description: 'Learn the purpose of content writing and how it differs from other types of writing like journalism or copywriting.',
        resources: 'See resources here',
      },
      {
        title: 'SEO basics',
        description: '',
        resources: '',
      },
      {
        title: 'Short-form writing practice',
        description: '',
        resources: '',
      },
      {
        title: 'Grammar & clarity tools',
        description: '',
        resources: '',
      },
    ],
  },
  {
    section: 'Intermediate',
    description: 'Dive into copywriting techniques, adapt tone and format for different platforms, and start building strategy into your writing.',
    skills: [
      {
        title: 'Copywriting techniques',
        description: 'Understand the core principles of persuasive writing from crafting compelling headlines.',
        resources: 'See resources here',
      },
      {
        title: 'Tone & style variation',
        description: '',
        resources: '',
      },
      {
        title: 'Writing for different platforms',
        description: '',
        resources: '',
      },
    ],
  },
  {
    section: 'Advanced',
    description: 'Learn how to plan content strategically, write for global audiences, and build a portfolio that helps you land freelance or remote jobs.',
    skills: [
      {
        title: 'Content strategy & editorial planning',
        description: 'Learn how to plan, organize, and manage content ideas that align with audience needs and business goals.',
        resources: 'See resources here',
      },
      {
        title: 'Writing for global audiences',
        description: '',
        resources: '',
      },
      {
        title: 'Building a portfolio',
        description: '',
        resources: '',
      },
      {
        title: 'Finding freelance/remote job opportunities',
        description: '',
        resources: '',
      },
    ],
  },
];

function Course() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, principal, isLoading } = useAuth();

  // Accept job title via state or query param
  const jobTitle = location.state?.jobTitle || 'Content Writer';

  // Track which skill is open per section
  const [openIndexes, setOpenIndexes] = useState({ Basic: 0, Intermediate: 0, Advanced: 0 });

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
          <div className="flex gap-16 items-start">
            {/* Left column: Section headers */}
            <div className="w-1/3 flex flex-col gap-24">
              {SKILL_MAP.map((section) => (
                <div key={section.section}>
                  <h2 className="text-xl font-semibold text-[#252525] mb-2">{section.section}</h2>
                  <p className="text-base text-[#888] max-w-xs">{section.description}</p>
                </div>
              ))}
            </div>
            {/* Right column: Skills accordions */}
            <div className="flex-1 flex flex-col gap-24">
              {SKILL_MAP.map((section, sIdx) => (
                <div key={section.section}>
                  <div className="flex flex-col gap-3">
                    {section.skills.map((skill, idx) => (
                      <div key={skill.title}>
                        <button
                          className={`w-full flex items-center text-left px-0 py-4 border-b border-gray-100 focus:outline-none transition group ${openIndexes[section.section] === idx ? 'bg-gray-50' : ''}`}
                          onClick={() => handleAccordion(section.section, idx)}
                        >
                          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#eaf1ee] text-emerald-800 font-bold text-lg mr-5 border border-[#eaf1ee]">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="text-lg font-medium text-[#252525]">{skill.title}</span>
                          <span className={`ml-auto transition-transform ${openIndexes[section.section] === idx ? 'rotate-180' : ''}`}>
                            <svg width="20" height="20" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                          </span>
                        </button>
                        {/* Expanded content */}
                        {openIndexes[section.section] === idx && (
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
              ))}
            </div>
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