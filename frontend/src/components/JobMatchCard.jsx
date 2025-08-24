import React from 'react';
import { motion } from 'framer-motion';

function JobMatchCard({ job, index, disabilities, onViewRoadmap, createMonogram }) {
  const formatDisabilities = (disabilitiesList) => {
    if (!disabilitiesList || disabilitiesList.length === 0) return null;
    
    const disabilityType = disabilitiesList.includes('Visual') ? 'Visual' : 
                          disabilitiesList.includes('Mobility') ? 'Mobility' : 
                          'Mild Mobility';
    
    return `${disabilitiesList.join(' • ')} • ${disabilityType} Disabilities`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border border-[#EAEAEA] rounded-lg p-6"
    >
      <div className="flex items-start gap-4">
        {/* Job Monogram */}
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-[#2C6A4F] font-bold text-lg">
            {createMonogram(job.title)}
          </span>
        </div>
        
        {/* Job Info */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-[#252525] mb-1">
            {job.title || 'Job Title Not Available'}
          </h4>
          
          {/* Disabilities info if available */}
          {disabilities && disabilities.length > 0 && (
            <p className="text-sm text-gray-600 mb-3">
              {formatDisabilities(disabilities)}
            </p>
          )}
          
          {/* Job Description as bullet points */}
          <div className="space-y-1">
            {job.description && (
              <div className="flex items-start gap-2">
                <span className="text-gray-400 text-sm mt-1 flex-shrink-0">•</span>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {job.description}
                </p>
              </div>
            )}
            {job.skills_desc && (
              <div className="flex items-start gap-2">
                <span className="text-gray-400 text-sm mt-1 flex-shrink-0">•</span>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {job.skills_desc}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Separator Line and Action Button */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
        <button
          onClick={onViewRoadmap}
          className="bg-[#2D6A4F] text-white px-4 py-2 rounded-lg hover:bg-[#22503B] transition-colors font-medium text-sm"
        >
          View skill roadmap
        </button>
      </div>
    </motion.div>
  );
}

export default JobMatchCard;