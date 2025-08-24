import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const SavedDataContext = createContext();

export const useSavedData = () => {
    const context = useContext(SavedDataContext);
    if (!context) {
        throw new Error('useSavedData must be used within a SavedDataProvider');
    }
    return context;
};

export const SavedDataProvider = ({ children }) => {
    const [savedRoadmaps, setSavedRoadmaps] = useState([]);
    const [recentCareerMatches, setRecentCareerMatches] = useState([]);
    const [additionalInfo, setAdditionalInfo] = useState(null);

    // Load data from localStorage on mount
    useEffect(() => {
        const savedRoadmapsData = localStorage.getItem('savedRoadmaps');
        const recentMatchesData = localStorage.getItem('recentCareerMatches');
        const additionalInfoData = localStorage.getItem('careerMatchesAdditionalInfo');

        if (savedRoadmapsData) {
            try {
                setSavedRoadmaps(JSON.parse(savedRoadmapsData));
            } catch (error) {
                console.error('Error parsing saved roadmaps data:', error);
                localStorage.removeItem('savedRoadmaps');
            }
        }

        if (recentMatchesData) {
            try {
                setRecentCareerMatches(JSON.parse(recentMatchesData));
            } catch (error) {
                console.error('Error parsing recent matches data:', error);
                localStorage.removeItem('recentCareerMatches');
            }
        }

        if (additionalInfoData) {
            try {
                setAdditionalInfo(JSON.parse(additionalInfoData));
            } catch (error) {
                console.error('Error parsing additional info data:', error);
                localStorage.removeItem('careerMatchesAdditionalInfo');
            }
        }
    }, []);

    // Save roadmaps to localStorage whenever it changes
    useEffect(() => {
        if (savedRoadmaps.length > 0) {
            localStorage.setItem('savedRoadmaps', JSON.stringify(savedRoadmaps));
        }
    }, [savedRoadmaps]);

    // Save recent matches to localStorage whenever it changes
    useEffect(() => {
        if (recentCareerMatches.length > 0) {
            localStorage.setItem('recentCareerMatches', JSON.stringify(recentCareerMatches));
        }
    }, [recentCareerMatches]);

    const saveRoadmap = useCallback((jobTitle, roadmapData, jobDetails = {}) => {
        const newRoadmap = {
            id: Date.now().toString(),
            jobTitle,
            roadmapData,
            jobDetails,
            savedAt: new Date().toISOString(),
        };

        setSavedRoadmaps(prev => {
            // Remove existing roadmap for the same job if exists
            const filtered = prev.filter(roadmap => roadmap.jobTitle !== jobTitle);
            return [newRoadmap, ...filtered];
        });
    }, []);

    const removeSavedRoadmap = useCallback((roadmapId) => {
        setSavedRoadmaps(prev => {
            const updatedRoadmaps = prev.filter(roadmap => roadmap.id !== roadmapId);

            // Update localStorage
            if (updatedRoadmaps.length === 0) {
                localStorage.removeItem('savedRoadmaps');
            } else {
                localStorage.setItem('savedRoadmaps', JSON.stringify(updatedRoadmaps));
            }

            return updatedRoadmaps;
        });
    }, []);

    const updateRecentCareerMatches = useCallback((jobRecommendations, additionalData = {}) => {
        if (!jobRecommendations || jobRecommendations.length === 0) return;

        const recentMatches = jobRecommendations.slice(0, 5).map(job => ({
            ...job,
            matchedAt: new Date().toISOString(),
        }));

        setRecentCareerMatches(recentMatches);

        // Store additional data like resume, skills text, and disabilities info
        // Always update additionalInfo to ensure old data is cleared
        const additionalInfo = {
            resume: additionalData.resume || null,
            skillsText: additionalData.skillsText || null,
            disabilities: additionalData.disabilities || null,
            updatedAt: new Date().toISOString(),
        };
        setAdditionalInfo(additionalInfo);
        localStorage.setItem('careerMatchesAdditionalInfo', JSON.stringify(additionalInfo));
    }, []);



    const isRoadmapSaved = useCallback((jobTitle) => {
        return savedRoadmaps.some(roadmap => roadmap.jobTitle === jobTitle);
    }, [savedRoadmaps]);

    const getSavedRoadmap = useCallback((jobTitle) => {
        return savedRoadmaps.find(roadmap => roadmap.jobTitle === jobTitle);
    }, [savedRoadmaps]);

    // Check different states for the UI logic
    const hasRecentMatches = useCallback(() => recentCareerMatches.length > 0, [recentCareerMatches.length]);
    const hasSavedRoadmaps = useCallback(() => savedRoadmaps.length > 0, [savedRoadmaps.length]);

    const getUIState = useCallback(() => {
        if (!hasRecentMatches() && !hasSavedRoadmaps()) {
            return 'empty'; // B1: No matches, no roadmaps
        } else if (hasRecentMatches() && !hasSavedRoadmaps()) {
            return 'matches-only'; // B2: Has matches, no roadmaps
        } else {
            return 'complete'; // B3: Has matches and roadmaps
        }
    }, [hasRecentMatches, hasSavedRoadmaps]);

    const value = useMemo(() => ({
        savedRoadmaps,
        recentCareerMatches,
        additionalInfo,
        saveRoadmap,
        removeSavedRoadmap,
        updateRecentCareerMatches,
        isRoadmapSaved,
        getSavedRoadmap,
        hasRecentMatches,
        hasSavedRoadmaps,
        getUIState,
        // expose setters for server sync hook if needed
        setSavedRoadmaps,
        setRecentCareerMatches,
    }), [
        savedRoadmaps,
        recentCareerMatches,
        additionalInfo,
        saveRoadmap,
        removeSavedRoadmap,
        updateRecentCareerMatches,
        isRoadmapSaved,
        getSavedRoadmap,
        hasRecentMatches,
        hasSavedRoadmaps,
        getUIState,
    ]);

    return (
        <SavedDataContext.Provider value={value}>
            {children}
        </SavedDataContext.Provider>
    );
};