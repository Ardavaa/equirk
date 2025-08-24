import { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSavedData } from '../contexts/SavedDataContext';

export const useSavedDataSync = () => {
  const { principal } = useAuth();
  const { 
    savedRoadmaps, 
    recentCareerMatches, 
    setSavedRoadmaps, 
    setRecentCareerMatches 
  } = useSavedData();

  // Sync data to server
  const syncToServer = useCallback(async () => {
    if (!principal) return;

    try {
      const response = await fetch(`/api/saved-data/${principal}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          savedRoadmaps,
          recentCareerMatches,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync data to server');
      }
    } catch (error) {
      console.error('Error syncing data to server:', error);
      // Continue with local storage as fallback
    }
  }, [principal, savedRoadmaps, recentCareerMatches]);

  // Load data from server
  const loadFromServer = useCallback(async () => {
    if (!principal) return;

    try {
      const response = await fetch(`/api/saved-data/${principal}`);
      
      if (!response.ok) {
        throw new Error('Failed to load data from server');
      }

      const data = await response.json();
      
      // Only update if server has more recent data
      if (data.savedRoadmaps && data.savedRoadmaps.length > 0) {
        setSavedRoadmaps(data.savedRoadmaps);
      }
      
      if (data.recentCareerMatches && data.recentCareerMatches.length > 0) {
        setRecentCareerMatches(data.recentCareerMatches);
      }
    } catch (error) {
      console.error('Error loading data from server:', error);
      // Continue with local storage as fallback
    }
  }, [principal, setSavedRoadmaps, setRecentCareerMatches]);

  // Load data from server when user logs in
  useEffect(() => {
    if (principal) {
      loadFromServer();
    }
  }, [principal, loadFromServer]);

  // Sync data to server when it changes (debounced)
  useEffect(() => {
    if (!principal) return;

    const timeoutId = setTimeout(() => {
      syncToServer();
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [principal, savedRoadmaps, recentCareerMatches, syncToServer]);

  return {
    syncToServer,
    loadFromServer,
  };
};