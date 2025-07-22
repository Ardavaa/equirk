import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function AuthStatus() {
  const { isAuthenticated, principal, isLoading } = useAuth();
  const [showAuthCard, setShowAuthCard] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setShowAuthCard(true);
      setIsVisible(true);
      // Auto-hide the card after 10 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setShowAuthCard(false);
      setIsVisible(false);
    }
  }, [isAuthenticated]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for exit animation to complete before hiding
    setTimeout(() => {
      setShowAuthCard(false);
    }, 500);
  };

  // Animation variants for the main container
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.5,
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="fixed top-4 right-4 bg-white border border-gray-200 text-gray-800 px-4 py-3 rounded-lg shadow-lg z-[60]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-sm">Authenticating...</p>
        </div>
      </motion.div>
    );
  }

  // Don't show anything if not authenticated
  if (!isAuthenticated || !showAuthCard) {
    return null;
  }

  // Show authenticated card with comprehensive animations
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 bg-white border border-gray-200 border-l-4 border-l-[#2D6A4F] text-gray-800 px-5 py-4 rounded-lg shadow-lg z-[60] cursor-pointer"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleDismiss}
        >
          <div className="flex items-start justify-between space-x-4">
            <div className="flex-1">
              <motion.p
                className="text-base font-medium text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                Authenticated
              </motion.p>
              <motion.p
                className="text-sm text-gray-500 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                Click to dismiss this notification
              </motion.p>
            </div>

            <motion.button
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 