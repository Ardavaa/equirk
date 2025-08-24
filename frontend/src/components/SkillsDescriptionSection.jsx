import React from 'react';

function SkillsDescriptionSection({ skillsText, onBackToCareerInsights }) {
  if (!skillsText) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Skills Description</h3>
      <p className="text-gray-600 text-sm mb-4">
        We matched you with careers based on what you wrote here
      </p>
      
      <div className="bg-gray-50 border border-[#EAEAEA] rounded-lg p-4">
        <p className="text-gray-700 text-sm leading-relaxed italic">
          "{skillsText}"
        </p>
      </div>
      
      <p className="text-sm text-gray-500 mt-3">
        These jobs are based on your last Career Insights. <button 
          onClick={onBackToCareerInsights}
          className="text-[#2D6A4F] hover:text-[#22503B] underline"
        >
          Create a new one
        </button> to refresh your matches.
      </p>
    </div>
  );
}

export default SkillsDescriptionSection;