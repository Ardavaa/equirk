import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../assets/Logo.png';
import { useAuth } from '../contexts/AuthContext';

function Library() {
  const navigate = useNavigate();
  const { logout, principal, isLoading } = useAuth();
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);
  const [savedJobRecommendations, setSavedJobRecommendations] = useState([]);

  // Mock data for saved roadmaps - replace with actual data later
  const mockSavedRoadmaps = [
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      roadmapName: 'Frontend Developer Learning Path',
      savedAt: '2025-01-15T10:30:00Z',
      totalSkills: 12,
      completedSkills: 3,
      sections: ['Basic', 'Intermediate', 'Advanced'],
      notes: 'Focus on React and modern JavaScript frameworks'
    },
    {
      id: 2,
      jobTitle: 'UX Designer',
      roadmapName: 'UX Design Mastery Roadmap',
      savedAt: '2025-01-10T14:20:00Z',
      totalSkills: 10,
      completedSkills: 0,
      sections: ['Basic', 'Intermediate', 'Advanced'],
      notes: 'Interested in user research and prototyping'
    },
    {
      id: 3,
      jobTitle: 'Content Writer',
      roadmapName: 'Content Writing Career Path',
      savedAt: '2025-01-08T09:15:00Z',
      totalSkills: 9,
      completedSkills: 5,
      sections: ['Basic', 'Intermediate', 'Advanced'],
      notes: ''
    }
  ];

  // Mock data for saved job recommendations - replace with actual data later
  const mockSavedJobRecommendations = [
    {
      id: 1,
      generatedAt: '2025-01-15T10:30:00Z',
      sessionName: 'Frontend Developer Search',
      totalRecommendations: 5,
      topMatch: {
        title: 'Frontend Developer',
        similarity_score: 0.89,
        description: 'Build responsive web applications using React and modern JavaScript frameworks.'
      },
      recommendations: [
        {
          title: 'Frontend Developer',
          description: 'Build responsive web applications using React and modern JavaScript frameworks.',
          skills_desc: 'React, JavaScript, HTML, CSS, TypeScript, Git',
          similarity_score: 0.89
        },
        {
          title: 'UI/UX Designer',
          description: 'Design user interfaces and experiences for web and mobile applications.',
          skills_desc: 'Figma, Adobe XD, Prototyping, User Research, Wireframing',
          similarity_score: 0.76
        }
      ]
    },
    {
      id: 2,
      generatedAt: '2025-01-12T14:20:00Z',
      sessionName: 'Backend Development Opportunities',
      totalRecommendations: 4,
      topMatch: {
        title: 'Backend Developer',
        similarity_score: 0.82,
        description: 'Develop server-side applications and APIs using modern frameworks.'
      },
      recommendations: [
        {
          title: 'Backend Developer',
          description: 'Develop server-side applications and APIs using modern frameworks.',
          skills_desc: 'Node.js, Python, SQL, MongoDB, REST APIs',
          similarity_score: 0.82
        }
      ]
    }
  ];

  // Initialize saved data with mock data
  useEffect(() => {
    setSavedRoadmaps(mockSavedRoadmaps);
    setSavedJobRecommendations(mockSavedJobRecommendations);
  }, []);

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressPercentage = (completed, total) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const createMonogram = (jobTitle) => {
    if (!jobTitle) return 'JT';
    const words = jobTitle.trim().split(/\s+/);
    if (words.length === 1) return words[0].charAt(0).toUpperCase() + words[0].charAt(1).toUpperCase();
    return words[0].charAt(0).toUpperCase() + words[words.length - 1].charAt(0).toUpperCase();
  };

  // Navigation handlers
  const handleNavigation = (section) => {
    navigate(`/#${section}`);
  };

  const handleLogout = () => {
    logout();
  };

  const truncatePrincipal = (principal) => {
    if (!principal) return '';
    return `${principal.slice(0, 8)}...${principal.slice(-4)}`;
  };

  // Roadmap handlers
  const handleViewRoadmap = (roadmap) => {
    navigate('/course', { state: { jobTitle: roadmap.jobTitle } });
  };

  const handleDeleteRoadmap = (roadmapId) => {
    setSavedRoadmaps(prev => prev.filter(roadmap => roadmap.id !== roadmapId));
  };

  // Job recommendations handlers
  const handleViewJobRecommendations = (jobRec) => {
    navigate('/job-recommendations', { 
      state: { 
        jobRecommendations: jobRec.recommendations,
        sessionName: jobRec.sessionName
      } 
    });
  };

  const handleDeleteJobRecommendations = (jobRecId) => {
    setSavedJobRecommendations(prev => prev.filter(jobRec => jobRec.id !== jobRecId));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-6 shadow-sm bg-white px-10 border-gray-200 border-1 border-solid">
        <img src={Logo} alt="logo" className="w-[9%] h-auto" />
        <ul className="hidden md:flex space-x-6 text-gray-700 font-normal text-lg">
          <li><button onClick={() => handleNavigation('')} className="hover:text-emerald-700 transition-colors">Home</button></li>
          <li><button onClick={() => handleNavigation('about')} className="hover:text-emerald-700 transition-colors">About</button></li>
          <li><button onClick={() => handleNavigation('features')} className="hover:text-emerald-700 transition-colors">Features</button></li>
          <li><button onClick={() => handleNavigation('career')} className="hover:text-emerald-700 transition-colors">Career</button></li>
          <li><button onClick={() => handleNavigation('contact')} className="hover:text-emerald-700 transition-colors">Contact</button></li>
          <li><button onClick={() => navigate('/library')} className="hover:text-emerald-700 transition-colors">Library</button></li>
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

      {/* Page Header */}
      <div className="px-20 py-8 pt-28">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-custom-dark mb-2">My Library</h1>
            <p className="text-gray-600">Manage your saved roadmaps and job recommendations</p>
          </div>
        </div>
      </div>

      {/* My Saved Roadmaps Section */}
      {savedRoadmaps.length > 0 && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="px-20 py-8">
            <div className="max-w-[1280px] mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-custom-dark">My Saved Roadmaps</h2>
                  <p className="text-gray-600 mt-1">Continue your learning journey</p>
                </div>
                <div className="text-sm text-gray-500">
                  {savedRoadmaps.length} roadmap{savedRoadmaps.length !== 1 ? 's' : ''} saved
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedRoadmaps.map((roadmap) => (
                  <div key={roadmap.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                    {/* Header with monogram and title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#81a595] to-[#377056] rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {createMonogram(roadmap.jobTitle)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-custom-dark text-lg truncate">
                          {roadmap.jobTitle}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {roadmap.roadmapName}
                        </p>
                      </div>
                      
                      {/* Dropdown menu */}
                      <div className="relative group">
                        <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        
                        {/* Dropdown content */}
                        <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <button 
                            onClick={() => handleViewRoadmap(roadmap)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Roadmap
                          </button>
                          <button 
                            onClick={() => handleDeleteRoadmap(roadmap.id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-custom-dark">
                          {roadmap.completedSkills}/{roadmap.totalSkills} skills
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#2D6A4F] to-[#22503B] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(roadmap.completedSkills, roadmap.totalSkills)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getProgressPercentage(roadmap.completedSkills, roadmap.totalSkills)}% complete
                      </div>
                    </div>
                    
                    {/* Notes preview */}
                    {roadmap.notes && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          <span className="font-medium">Notes:</span> {roadmap.notes}
                        </p>
                      </div>
                    )}
                    
                    {/* Footer with date and action */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        Saved {formatDate(roadmap.savedAt)}
                      </div>
                      <button 
                        onClick={() => handleViewRoadmap(roadmap)}
                        className="text-sm font-medium text-[#2D6A4F] hover:text-[#22503B] transition-colors"
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Job Recommendations Section */}
      {savedJobRecommendations.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="px-20 py-8">
            <div className="max-w-[1280px] mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-custom-dark">My Job Recommendations</h2>
                  <p className="text-gray-600 mt-1">Review your previous job searches</p>
                </div>
                <div className="text-sm text-gray-500">
                  {savedJobRecommendations.length} session{savedJobRecommendations.length !== 1 ? 's' : ''} saved
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {savedJobRecommendations.map((jobRec) => (
                  <div key={jobRec.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-custom-dark text-lg mb-1">
                          {jobRec.sessionName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {jobRec.totalRecommendations} job recommendations
                        </p>
                      </div>
                      
                      {/* Dropdown menu */}
                      <div className="relative group">
                        <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        
                        {/* Dropdown content */}
                        <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <button 
                            onClick={() => handleViewJobRecommendations(jobRec)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Results
                          </button>
                          <button 
                            onClick={() => handleDeleteJobRecommendations(jobRec.id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Top Match Preview */}
                    <div className="bg-gradient-to-r from-[#f0f7f4] to-[#e8f5e8] rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-[#2D6A4F] rounded-full"></div>
                        <span className="text-sm font-medium text-[#2D6A4F]">Top Match</span>
                        <span className="text-xs bg-[#2D6A4F] text-white px-2 py-1 rounded-full">
                          {Math.round(jobRec.topMatch.similarity_score * 100)}%
                        </span>
                      </div>
                      <h4 className="font-semibold text-custom-dark mb-1">
                        {jobRec.topMatch.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {jobRec.topMatch.description}
                      </p>
                    </div>
                    
                    {/* Additional recommendations count */}
                    {jobRec.totalRecommendations > 1 && (
                      <div className="text-sm text-gray-500 mb-4">
                        +{jobRec.totalRecommendations - 1} more recommendation{jobRec.totalRecommendations - 1 !== 1 ? 's' : ''}
                      </div>
                    )}
                    
                    {/* Footer with date and action */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        Generated {formatDate(jobRec.generatedAt)}
                      </div>
                      <button 
                        onClick={() => handleViewJobRecommendations(jobRec)}
                        className="text-sm font-medium text-[#2D6A4F] hover:text-[#22503B] transition-colors"
                      >
                        View All →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {savedRoadmaps.length === 0 && savedJobRecommendations.length === 0 && (
        <div className="px-20 py-16">
          <div className="max-w-[1280px] mx-auto text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-custom-dark mb-2">Your library is empty</h3>
            <p className="text-gray-600 mb-6">Start by generating job recommendations or creating roadmaps to see them here.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-[#2D6A4F] text-white px-6 py-3 rounded-lg hover:bg-[#22503B] transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
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

export default Library;