import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthStatus() {
  const { isAuthenticated, principal, isLoading } = useAuth();
  const [showAuthCard, setShowAuthCard] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setShowAuthCard(true);
      // Auto-hide the card after 5 seconds
      const timer = setTimeout(() => {
        setShowAuthCard(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-lg z-50">
        <p className="text-sm">🔄 Initializing authentication...</p>
      </div>
    );
  }

  // Don't show anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Show authenticated card with fade-out animation
  if (showAuthCard) {
    return (
      <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50 animate-fade-in">
        <p className="text-sm">✅ Authenticated</p>
        <p className="text-xs mt-1 font-mono">Principal: {principal?.slice(0, 20)}...</p>
      </div>
    );
  }

  return null;
} 