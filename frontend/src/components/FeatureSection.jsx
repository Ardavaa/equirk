import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    number: '01',
    title: 'Personalized Career Matching',
    desc: 'Tell us your disability type, skills, and preferences. Our system finds careers that truly fit your needs.',
  },
  {
    number: '02',
    title: 'Skill Roadmap Generator',
    desc: 'Get a step-by-step learning path based on your chosen career. Learn at your own pace with curated resources.',
  },
  {
    number: '03',
    title: 'Inclusive Job Reference Board',
    desc: 'Explore real jobs from inclusive companies with clear information on required skills and accessibility support.',
  },
  {
    number: '04',
    title: 'Designed for Accessibility',
    desc: 'Equirk is built with accessibility in mind. Everything is simple to use, easy to read, and respectful of your needs.',
  },
];

const FeaturesSection = () => {
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
        staggerChildren: 0.15
      }
    }
  };

  const leftSideVariants = {
    hidden: {
      opacity: 0,
      x: -50
    },
    visible: {
      opacity: 1,
      x: 0,
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

  const headlineVariants = {
    hidden: {
      opacity: 0,
      y: 30
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

  const featureItemVariants = {
    hidden: {
      opacity: 0,
      x: -80,
      y: 20
    },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.4 + (index * 0.1)
      }
    })
  };

  const numberVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      x: -20
    },
    visible: (index) => ({
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.5 + (index * 0.1)
      }
    })
  };

  return (
    <motion.div 
      ref={ref}
      className="p-8 font-sans grid md:grid-cols-2 gap-8 items-start mx-10"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Left Side */}
      <motion.div variants={leftSideVariants}>
        <motion.button 
          className="border px-4 py-1 rounded-lg mb-4" 
          style={{borderColor: '#2d6a4f', color: '#2d6a4f'}}
          variants={buttonVariants}
        >
          Features
        </motion.button>
        <motion.h2 
          className="text-custom-dark text-8xl md:text-3xl font-medium max-w-[88%] leading-relaxed"
          variants={headlineVariants}
        >
          Everything you need to plan your career with confidence. From job matching to skill-building, all in one place.
        </motion.h2>
      </motion.div>

      {/* Right Side */}
      <motion.div className="space-y-6 pt-10">
        {features.map((item, index) => (
          <motion.div 
            key={index} 
            className="flex items-start gap-4 border-b pb-4"
            custom={index}
            variants={featureItemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{
              x: 5,
              transition: {
                duration: 0.3
              }
            }}
          >
            <motion.p 
              className="text-6xl font-semibold text-custom-dark"
              custom={index}
              variants={numberVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {item.number}
            </motion.p>
            <div>
              <h3 className="text-custom-dark font-semibold text-lg">{item.title}</h3>
              <p className="pt-2 text-sm text-gray-600">{item.desc}</p>
              <hr className="mt-4 my-[-20px] border-gray-300" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default FeaturesSection;
