import React, { useState } from 'react';
import { motion } from 'framer-motion';

function SavedRoadmapViewer({ roadmap, onClose }) {
  const [openIndexes, setOpenIndexes] = useState({ basic: 0, intermediate: 0, advanced: 0, disability: 0 });

  const handleAccordion = (section, idx) => {
    setOpenIndexes((prev) => ({ ...prev, [section]: prev[section] === idx ? null : idx }));
  };

  if (!roadmap) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-[#252525]">{roadmap.jobTitle} Roadmap</h2>
            <p className="text-gray-600">Saved on {new Date(roadmap.savedAt).toLocaleDateString()}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-8">
            {[
              { key: 'basic', label: 'Basic', description: 'Learn fundamental concepts and basic tools.' },
              { key: 'intermediate', label: 'Intermediate', description: 'Dive deeper into techniques and build practical skills.' },
              { key: 'advanced', label: 'Advanced', description: 'Master advanced concepts and build professional expertise.' },
              ...(roadmap.roadmapData?.disabilityGuidance?.length > 0 ? [{ key: 'disability', label: 'Accessibility & Inclusion', description: 'Specialized guidance for working in this field with your specific disability considerations and accommodations.' }] : [])
            ].map((section) => {
              const skills = section.key === 'disability' 
                ? (Array.isArray(roadmap.roadmapData.disabilityGuidance) ? roadmap.roadmapData.disabilityGuidance : [])
                : (Array.isArray(roadmap.roadmapData[section.key]) ? roadmap.roadmapData[section.key] : []);

              if (skills.length === 0) return null;

              return (
                <div key={section.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-[#252525] mb-1">{section.label}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {skills.map((skill, idx) => (
                      <div key={skill.title || idx} className="border border-gray-100 rounded-lg">
                        <button
                          className={`w-full flex items-center text-left px-4 py-3 focus:outline-none transition ${openIndexes[section.key] === idx ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                          onClick={() => handleAccordion(section.key, idx)}
                        >
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#eaf1ee] text-emerald-800 font-bold text-sm mr-3 border border-[#eaf1ee]">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="text-base font-medium text-[#252525] flex-1">{skill.title}</span>
                          <span className={`transition-transform ${openIndexes[section.key] === idx ? 'rotate-180' : ''}`}>
                            <svg width="16" height="16" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M6 9l6 6 6-6"/>
                            </svg>
                          </span>
                        </button>
                        {openIndexes[section.key] === idx && (
                          <div className="px-4 pb-3">
                            {skill.description && (
                              <p className="text-gray-600 text-sm mb-2 ml-11">{skill.description}</p>
                            )}
                            {skill.resources && (
                              <a href="#" className="text-emerald-800 font-medium flex items-center gap-1 hover:underline text-sm ml-11">
                                {skill.resources}
                                <svg width="14" height="14" fill="none" stroke="#377056" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
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
      </motion.div>
    </div>
  );
}

export default SavedRoadmapViewer;