import { motion } from 'framer-motion';
import Floating1 from '../assets/Floating1.png';
import Floating2 from '../assets/Floating2.png';
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.png';
import avatar3 from '../assets/avatar3.png';
import avatar4 from '../assets/avatar4.png';
import avatar5 from '../assets/avatar5.png';
import avatar6 from '../assets/avatar6.png';
import avatar7 from '../assets/avatar7.png';
import avatar8 from '../assets/avatar8.png';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion, getAccessibleVariants, getAccessibleTransition } from '../hooks/useReducedMotion';

const avatars = [
  { src: avatar1, alt: 'Avatar 1' },
  { src: avatar2, alt: 'Avatar 2' },
  { src: avatar3, alt: 'Avatar 3' },
  { src: avatar4, alt: 'Avatar 4' },
  { src: avatar5, alt: 'Avatar 5' },
  { src: avatar6, alt: 'Avatar 6' },
  { src: avatar7, alt: 'Avatar 7' },
  { src: avatar8, alt: 'Avatar 8' },
];

// Avatar positioning data for elliptical arcs
const avatarPositions = [
  // Left side
  { x: 22, y: 57, delay: 0, direction: 'left' },
  { x: 13, y: 55, delay: 0.2, direction: 'left' },
  { x: 18, y: 40, delay: 0.4, direction: 'left' },
  { x: 17, y: 70, delay: 0.6, direction: 'left' },
  // Right side
  { x: 78, y: 57, delay: 0.8, direction: 'right' },
  { x: 87, y: 55, delay: 1.0, direction: 'right' },
  { x: 82, y: 40, delay: 1.2, direction: 'right' },
  { x: 83, y: 70, delay: 1.4, direction: 'right' },
];

// Animation variants for different elements
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const avatarVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction === 'left' ? -60 : 60,
    y: 20,
    scale: 0.8,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.8,
    }
  }
};

const headlineVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.6,
      delay: 0.5
    }
  }
};

const subtitleVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.8
    }
  }
};

const buttonVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 10
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 1.2
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.95
  }
};

const floatingImageVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction === 'left' ? -100 : 100,
    y: -20,
    scale: 0.9
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
      duration: 1,
      delay: 0.3
    }
  }
};

export default function HeroSection() {
  const { isAuthenticated, login, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      login();
    }
  };

  return (
    <motion.section
      className="relative w-full min-h-screen bg-white overflow-hidden "
      initial="hidden"
      animate="visible"
      variants={getAccessibleVariants(prefersReducedMotion, containerVariants)}
    >
      {/* Elliptical Background Arcs */}
      <div className="absolute inset-0 w-full h-full">
        <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="none">
          {/* Outer arc */}
          <ellipse
            cx="400"
            cy="300"
            rx="350"
            ry="250"
            fill="none"
            stroke="rgba(107, 114, 128, 0.1)"
            strokeWidth="1"
            opacity="0.8"
          />
          {/* Middle arc */}
          <ellipse
            cx="400"
            cy="300"
            rx="280"
            ry="200"
            fill="none"
            stroke="rgba(107, 114, 128, 0.15)"
            strokeWidth="1"
            opacity="0.6"
          />
          {/* Inner arc */}
          <ellipse
            cx="400"
            cy="300"
            rx="220"
            ry="160"
            fill="none"
            stroke="rgba(107, 114, 128, 0.2)"
            strokeWidth="1"
            opacity="0.4"
          />
          {/* Fade gradient overlay */}
          <defs>
            <radialGradient id="fadeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </radialGradient>
          </defs>
          <ellipse
            cx="400"
            cy="300"
            rx="350"
            ry="250"
            fill="url(#fadeGradient)"
          />
        </svg>
      </div>

      {/* Floating Avatar Circles */}
      <div className="absolute inset-0 pointer-events-none hidden xl:block">
        {avatars.map((avatar, index) => {
          const position = avatarPositions[index];
          return (
            <motion.div
              key={index}
              className="absolute w-16 h-16 floating-avatar"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              custom={position.direction}
              variants={getAccessibleVariants(prefersReducedMotion, avatarVariants)}
              initial="hidden"
              animate="visible"
              transition={getAccessibleTransition(prefersReducedMotion, {
                ...avatarVariants.visible.transition,
                delay: prefersReducedMotion ? 0 : position.delay + 0.5
              })}
            >
              {/* Green outer circle */}
              <div className="w-full h-full rounded-full border-2 border-[#2D6A4F] p-1 bg-white">
                <img
                  src={avatar.src}
                  alt={avatar.alt}
                  className="w-full h-full rounded-full border border-white shadow-lg object-cover"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Images */}
      <div className='w-full md:pb-20 xl:pb-0 relative hidden md:block'>
        <motion.img
          src={Floating1}
          alt="Roadmap"
          className="absolute top-0 left-0 w-1/2 max-w-md h-auto transform translate-x-8 -translate-y-6 drop-shadow-lg z-10"
          custom="left"
          variants={getAccessibleVariants(prefersReducedMotion, floatingImageVariants)}
          initial="hidden"
          animate="visible"
        />
        <motion.img
          src={Floating2}
          alt="Job Card"
          className="absolute top-0 right-0 w-1/2 max-w-md h-auto transform -translate-x-8 -translate-y-6 drop-shadow-lg z-10"
          custom="right"
          variants={getAccessibleVariants(prefersReducedMotion, floatingImageVariants)}
          initial="hidden"
          animate="visible"
        />
      </div>

      {/* Text Content */}
      <div className="relative z-20 text-center mt-30 py-32">
        <motion.h1 
          className="md:text-5xl text-4xl font-medium text-custom-dark px-4"
          variants={getAccessibleVariants(prefersReducedMotion, headlineVariants)}
          initial="hidden"
          animate="visible"
        >
          Smart Career Tools for People <br/> with Disabilities
        </motion.h1>
        
        <motion.p 
          className="mt-4 text-lg md:text-xl text-gray-600"
          variants={getAccessibleVariants(prefersReducedMotion, subtitleVariants)}
          initial="hidden"
          animate="visible"
        >
          Helping people with disabilities find jobs, learn skills, and grow
        </motion.p>
        
        <motion.button 
          onClick={handleGetStarted}
          disabled={isLoading}
          className="mt-8 px-6 py-3 bg-gradient-to-b from-[#2D6A4F] to-[#22503B] text-white rounded-md shadow hover:from-[#285f47] hover:to-[#1e4634] transition disabled:opacity-50 disabled:cursor-not-allowed"
          variants={getAccessibleVariants(prefersReducedMotion, buttonVariants)}
          initial="hidden"
          animate="visible"
          whileHover={prefersReducedMotion ? {} : "hover"}
          whileTap={prefersReducedMotion ? {} : "tap"}
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
            'Go to Dashboard'
          ) : (
            'Get Started Now'
          )}
        </motion.button>
      </div>
    </motion.section>
  );
}
