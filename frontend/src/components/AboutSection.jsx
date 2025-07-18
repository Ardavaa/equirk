import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import AboutGrid1 from '../assets/AboutGrid1.png';
import AboutGrid2 from '../assets/AboutGrid2.png';
import AboutGrid3 from '../assets/AboutGrid3.png';

const AboutSection = () => {
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
        staggerChildren: 0.2
      }
    }
  };

  const slideUpVariants = {
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

  const headlineVariants = {
    hidden: {
      opacity: 0,
      y: 40
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.5 + (index * 0.1)
      }
    })
  };

  const cards = [
    { src: AboutGrid1, alt: "Why We Exist" },
    { src: AboutGrid2, alt: "Our Mission" },
    { src: AboutGrid3, alt: "Who We Help" }
  ];

  return (
    <motion.div 
      ref={ref}
      className="p-8 font-sans mx-10"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* About Button */}
      <motion.button 
        className="border px-4 py-1 rounded-lg mb-4" 
        style={{borderColor: '#2d6a4f', color: '#2d6a4f'}}
        variants={slideUpVariants}
      >
        About
      </motion.button>

      {/* Heading */}
      <motion.h1 
        className="text-custom-dark text-2xl md:text-3xl font-medium mb-6 max-w-[82%] leading-relaxed"
        variants={headlineVariants}
      >
        Equirk helps people with disabilities{' '}
        <span className="bg-gradient-to-r from-[#82A696] to-[#2D6A4F] bg-clip-text text-transparent font-semibold">
          explore career options
        </span>{' '}
        that fit <br />
        their needs, build the right skills, and grow at their own pace. <br />
        We're here to make inclusive work more accessible, one step at a time.
      </motion.h1>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-4 mt-10">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="relative rounded-lg overflow-hidden"
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{
              scale: 1.02,
              transition: {
                duration: 0.3
              }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <img 
              src={card.src} 
              alt={card.alt} 
              className="w-full h-auto object-cover" 
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AboutSection;
