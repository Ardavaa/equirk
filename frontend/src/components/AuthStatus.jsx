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
      x: 100,
      y: -20,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.2,
      }
    },
    exit: {
      opacity: 0,
      x: 100,
      y: -20,
      scale: 0.8,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  // Animation variants for the checkmark icon
  const iconVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotate: -180,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
        duration: 0.6,
      }
    },
    glow: {
      boxShadow: [
        "0 0 5px rgba(34, 197, 94, 0.4)",
        "0 0 15px rgba(34, 197, 94, 0.6)",
        "0 0 5px rgba(34, 197, 94, 0.4)",
      ],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  // Animation variants for the text
  const textVariants = {
    hidden: {
      opacity: 0,
      x: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.5,
        delay: 0.3,
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeInOut"
      }
    }
  };

  // Animation variants for principal text
  const principalVariants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="fixed top-4 right-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl shadow-2xl z-[60] backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-sm font-semibold">Initializing authentication...</p>
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
          className="fixed top-4 right-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-green-800 px-5 py-4 rounded-xl shadow-2xl z-[60] backdrop-blur-sm cursor-pointer hover:shadow-3xl transition-shadow duration-300"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleDismiss}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.98,
            transition: { duration: 0.1 }
          }}
        >
          <div className="flex items-start space-x-3">
            {/* Animated Checkmark Icon */}
            <motion.div
              className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mt-0.5"
              variants={iconVariants}
              initial="hidden"
              animate={["visible", "glow"]}
            >
              <motion.svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: "easeInOut"
                }}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>

            <div className="flex-1 min-w-0">
              {/* Main Text with Pulsing Animation */}
              <motion.p
                className="text-lg font-bold text-green-700"
                variants={textVariants}
                initial="hidden"
                animate={["visible", "pulse"]}
              >
                Authenticated
              </motion.p>
              
              {/* Principal Text */}
              <motion.p
                className="text-xs mt-1 font-mono text-green-600 opacity-80"
                variants={principalVariants}
                initial="hidden"
                animate="visible"
              >
                Principal: {principal?.slice(0, 12)}...{principal?.slice(-6)}
              </motion.p>
              
              {/* Click to dismiss hint */}
              <motion.p
                className="text-xs mt-2 text-green-500 opacity-60 hover:opacity-100 transition-opacity duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 2, duration: 0.5 }}
              >
                Click to dismiss
              </motion.p>
            </div>

            {/* Dismiss Button */}
            <motion.button
              className="flex-shrink-0 text-green-400 hover:text-green-600 transition-colors duration-200 p-1"
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          {/* Animated Progress Bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-green-400 rounded-b-xl"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{
              duration: 10,
              ease: "linear"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 