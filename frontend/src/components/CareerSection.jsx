import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const jobs = [
  {
    id: 1,
    location: 'Marina East, Singapore',
    title: 'Customer Support Associate',
    types: ['Tunanetra', 'Daksa ringan', 'Rungu'],
  },
  {
    id: 2, location: 'Marina East, Singapore', title: 'Customer Support Associate', types: ['Tunanetra', 'Daksa ringan', 'Rungu'],
  },
  {
    id: 3, location: 'Marina East, Singapore', title: 'Customer Support Associate', types: ['Tunanetra', 'Daksa ringan', 'Rungu'],
  },
  {
    id: 4, location: 'Marina East, Singapore', title: 'Customer Support Associate', types: ['Tunanetra', 'Daksa ringan', 'Rungu'],
  },
  {
    id: 5, location: 'Marina East, Singapore', title: 'Customer Support Associate', types: ['Tunanetra', 'Daksa ringan', 'Rungu'],
  },
  {
    id: 6, location: 'Marina East, Singapore', title: 'Customer Support Associate', types: ['Tunanetra', 'Daksa ringan', 'Rungu'],
  },
  {
    id: 7, location: 'Marina East, Singapore', title: 'Customer Support Associate', types: ['Tunanetra', 'Daksa ringan', 'Rungu'],
  },
  {
    id: 8, location: 'Marina East, Singapore', title: 'Customer Support Associate', types: ['Tunanetra', 'Daksa ringan', 'Rungu'],
  },
  {
    id: 9, location: 'Marina East, Singapore', title: 'Customer Support Associate', types: ['Tunanetra', 'Daksa ringan', 'Rungu'],
  },
];

const CareerSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Animation variants
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

  const headerVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: 40
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.08
      }
    }
  };

  const jobCardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: (index) => {
      // Calculate row position (3 cards per row)
      const row = Math.floor(index / 3);
      const baseDelay = 0.4;
      const rowDelay = row * 0.2;
      const cardDelay = (index % 3) * 0.1;
      
      return {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          ease: "easeOut",
          delay: baseDelay + rowDelay + cardDelay
        }
      };
    }
  };

  const seeMoreButtonVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 1.2
      }
    }
  };

  return (
    <motion.div 
      ref={ref}
      className="p-8 font-sans px-15 relative"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Label */}
      <motion.button 
        className="border border-[#2D6A4F] text-[#2D6A4F] px-4 py-1 rounded-lg mb-6"
        variants={buttonVariants}
      >
        Career
      </motion.button>

      {/* Title */}
      <motion.h2 
        className="text-custom-dark text-8xl md:text-3xl font-medium mb-8 max-w-xl mt-2 pb-8"
        variants={titleVariants}
      >
        Find real job openings from companies that value accessibility and inclusion.
      </motion.h2>

      {/* Grid + Fade container */}
      <div className="relative">
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          variants={gridVariants}
        >
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              className="text-custom-dark border rounded-md p-6 text-sm bg-white"
              custom={index}
              variants={jobCardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover={{
                scale: 1.03,
                y: -5,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                transition: {
                  duration: 0.3
                }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <p className="text-gray-500 mb-1 p-1">📍 {job.location}</p>
              <h3 className="font-semibold text-xl p-1 text-base">{job.title}</h3>
              <p className="text-gray-600 p-1 mt-1">
                {job.types.join(' • ')}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Fade effect */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      {/* Button */}
      <motion.div 
        className="text-gray-800 text-center mt-4"
        variants={seeMoreButtonVariants}
      >
        <motion.button 
          className="border border-gray-400 px-4 py-2 rounded-lg shadow-gray-300 shadow-lg hover:bg-gray-100 transition"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
            transition: {
              duration: 0.3
            }
          }}
          whileTap={{ scale: 0.95 }}
        >
          See More Jobs
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default CareerSection;
