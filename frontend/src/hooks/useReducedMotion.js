import { useState, useEffect } from 'react';

/**
 * Custom hook to detect user's reduced motion preference
 * @returns {boolean} True if user prefers reduced motion
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if the browser supports the media query
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      // Set initial value
      setPrefersReducedMotion(mediaQuery.matches);
      
      // Listen for changes
      const handleChange = (event) => {
        setPrefersReducedMotion(event.matches);
      };
      
      // Add listener
      mediaQuery.addEventListener('change', handleChange);
      
      // Cleanup listener on unmount
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, []);

  return prefersReducedMotion;
};

/**
 * Get animation variants that respect reduced motion preferences
 * @param {boolean} prefersReducedMotion - Whether user prefers reduced motion
 * @param {Object} normalVariants - Normal animation variants
 * @param {Object} reducedVariants - Reduced motion variants (optional)
 * @returns {Object} Appropriate animation variants
 */
export const getAccessibleVariants = (prefersReducedMotion, normalVariants, reducedVariants = null) => {
  if (prefersReducedMotion) {
    // If custom reduced variants are provided, use them
    if (reducedVariants) {
      return reducedVariants;
    }
    
    // Otherwise, create simplified variants
    const simplifiedVariants = {};
    
    Object.keys(normalVariants).forEach(key => {
      const variant = normalVariants[key];
      
      if (typeof variant === 'object' && variant !== null) {
        simplifiedVariants[key] = {
          ...variant,
          transition: {
            duration: 0.01,
            ease: 'linear'
          }
        };
      } else {
        simplifiedVariants[key] = variant;
      }
    });
    
    return simplifiedVariants;
  }
  
  return normalVariants;
};

/**
 * Get transition settings that respect reduced motion preferences
 * @param {boolean} prefersReducedMotion - Whether user prefers reduced motion
 * @param {Object} normalTransition - Normal transition settings
 * @returns {Object} Appropriate transition settings
 */
export const getAccessibleTransition = (prefersReducedMotion, normalTransition = {}) => {
  if (prefersReducedMotion) {
    return {
      duration: 0.01,
      ease: 'linear'
    };
  }
  
  return normalTransition;
}; 