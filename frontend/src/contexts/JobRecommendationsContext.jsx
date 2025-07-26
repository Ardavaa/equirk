import React, { createContext, useContext, useState, useEffect } from 'react';

const JobRecommendationsContext = createContext();

export const useJobRecommendations = () => {
  const context = useContext(JobRecommendationsContext);
  if (!context) {
    throw new Error('useJobRecommendations must be used within a JobRecommendationsProvider');
  }
  return context;
};

export const JobRecommendationsProvider = ({ children }) => {
  const [jobRecommendationsData, setJobRecommendationsData] = useState(null);

  // Load data from sessionStorage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('jobRecommendationsData');
    if (savedData) {
      try {
        setJobRecommendationsData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error parsing saved job recommendations data:', error);
        sessionStorage.removeItem('jobRecommendationsData');
      }
    }
  }, []);

  // Save data to sessionStorage whenever it changes
  useEffect(() => {
    if (jobRecommendationsData) {
      sessionStorage.setItem('jobRecommendationsData', JSON.stringify(jobRecommendationsData));
    }
  }, [jobRecommendationsData]);

  const saveJobRecommendationsData = (data) => {
    setJobRecommendationsData(data);
  };

  const clearJobRecommendationsData = () => {
    setJobRecommendationsData(null);
    sessionStorage.removeItem('jobRecommendationsData');
  };

  const hasJobRecommendationsData = () => {
    return jobRecommendationsData && jobRecommendationsData.jobRecommendations?.length > 0;
  };

  const value = {
    jobRecommendationsData,
    saveJobRecommendationsData,
    clearJobRecommendationsData,
    hasJobRecommendationsData,
  };

  return (
    <JobRecommendationsContext.Provider value={value}>
      {children}
    </JobRecommendationsContext.Provider>
  );
};
