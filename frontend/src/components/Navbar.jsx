// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import { useAuth } from '../contexts/AuthContext';
import { useReducedMotion, getAccessibleTransition } from '../hooks/useReducedMotion';

export default function Navbar() {
  const { isAuthenticated, principal, login, logout, isLoading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();

  // Track scroll position to add background blur effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      login();
    }
  };

  const handleNavClick = (sectionId) => {
    if (isAuthenticated) {
      // Smooth scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      login();
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const truncatePrincipal = (principal) => {
    if (!principal) return '';
    return `${principal.slice(0, 8)}...${principal.slice(-4)}`;
  };

  return (
    <>
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-6 px-10 border-gray-200 border-b border-solid transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-white shadow-sm'
        }`}
        initial={{ y: prefersReducedMotion ? 0 : -100 }}
        animate={{ y: 0 }}
        transition={getAccessibleTransition(prefersReducedMotion, {
          type: "spring", 
          stiffness: 100, 
          damping: 20,
          duration: 0.6
        })}
      >
        <img src={Logo} alt="logo" className="w-[9%] h-auto" />

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-normal text-lg">
          <li>
            <button 
              onClick={() => handleNavClick('hero')}
              className="hover:text-[#2D6A4F] transition-colors duration-200"
            >
              Home
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('about')}
              className="hover:text-[#2D6A4F] transition-colors duration-200"
            >
              About
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('features')}
              className="hover:text-[#2D6A4F] transition-colors duration-200"
            >
              Features
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('career')}
              className="hover:text-[#2D6A4F] transition-colors duration-200"
            >
              Career
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('contact')}
              className="hover:text-[#2D6A4F] transition-colors duration-200"
            >
              Contact
            </button>
          </li>
        </ul>

        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <motion.div 
              className="hidden md:flex items-center space-x-2 text-sm text-gray-600"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={getAccessibleTransition(prefersReducedMotion, { delay: 0.3 })}
            >
              <span>Welcome:</span>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                {truncatePrincipal(principal)}
              </span>
            </motion.div>
          )}
          
          {/* Mobile Menu Toggle */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </motion.button>
          
          <motion.button
            onClick={handleAuthClick}
            disabled={isLoading}
            className="bg-gradient-to-b from-[#2D6A4F] to-[#22503B] text-white px-5 py-2 rounded-md shadow hover:from-[#285f47] hover:to-[#1e4634] transition disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : isAuthenticated ? (
              'Logout'
            ) : (
              'Get Started Now'
            )}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed top-[88px] left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={getAccessibleTransition(prefersReducedMotion, { duration: 0.2 })}
          >
            <div className="px-10 py-6 space-y-4">
              <button 
                onClick={() => handleNavClick('hero')}
                className="block w-full text-left text-lg text-gray-700 hover:text-[#2D6A4F] transition-colors duration-200"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('about')}
                className="block w-full text-left text-lg text-gray-700 hover:text-[#2D6A4F] transition-colors duration-200"
              >
                About
              </button>
              <button 
                onClick={() => handleNavClick('features')}
                className="block w-full text-left text-lg text-gray-700 hover:text-[#2D6A4F] transition-colors duration-200"
              >
                Features
              </button>
              <button 
                onClick={() => handleNavClick('career')}
                className="block w-full text-left text-lg text-gray-700 hover:text-[#2D6A4F] transition-colors duration-200"
              >
                Career
              </button>
              <button 
                onClick={() => handleNavClick('contact')}
                className="block w-full text-left text-lg text-gray-700 hover:text-[#2D6A4F] transition-colors duration-200"
              >
                Contact
              </button>
              
              {isAuthenticated && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Welcome:</span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                      {truncatePrincipal(principal)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
