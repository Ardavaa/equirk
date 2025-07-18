import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const ContactSection = () => {
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

  const leftSideVariants = {
    hidden: {
      opacity: 0,
      x: -60,
      y: 20
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const rightSideVariants = {
    hidden: {
      opacity: 0,
      x: 60,
      y: 20
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.4
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
        duration: 0.6,
        ease: "easeOut",
        delay: 0.1
      }
    }
  };

  const contactDetailsVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  const contactItemVariants = {
    hidden: {
      opacity: 0,
      x: -30,
      y: 10
    },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.5 + (index * 0.1)
      }
    })
  };

  const formFieldVariants = {
    hidden: {
      opacity: 0,
      x: 30,
      y: 10
    },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.3 + (index * 0.1)
      }
    })
  };

  const submitButtonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.8
      }
    }
  };

  const contactDetails = [
    {
      title: "Contact Details",
      info: "📞 1234–5678–9000"
    },
    {
      title: "Office Location",
      info: "📍 Jl. Telekomunikasi No. 1, Kabupaten Bandung"
    },
    {
      title: "Email Address",
      info: "✉️ equirk@company.com"
    }
  ];

  return (
    <motion.div 
      ref={ref}
      className="mx-16 p-8 px-14 pt-10 bg-gray-50 rounded-2xl font-sans"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.button 
        className="border border-[#2D6A4F] text-[#2D6A4F] px-4 py-1 rounded-lg mb-6"
        variants={buttonVariants}
      >
        Contact
      </motion.button>

      <div className="text-custom-dark grid md:grid-cols-2 gap-8">
        {/* Left Side */}
        <motion.div variants={leftSideVariants}>
          <motion.h2 
            className="text-custom-dark text-3xl font-semibold mb-6 max-w-lg"
            variants={headlineVariants}
          >
            If you have any questions or you'd like to find out more about our services, please get in touch.
          </motion.h2>

          <motion.div 
            className="space-y-4 text-sm mt-36"
            variants={contactDetailsVariants}
          >
            <motion.div>
              <p className="font-medium text-2xl">Contact Details</p>
              <p className='textl-xl text-gray-400 font-medium'>📞 1234–5678–9000</p>
            </motion.div>
            {contactDetails.map((detail, index) => (
              <motion.div 
                key={index}
                custom={index}
                variants={contactItemVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <p className="font-medium text-2xl">{detail.title}</p>
                <p className='textl-xl text-gray-400 font-medium'>{detail.info}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.form 
          className="space-y-4"
          variants={rightSideVariants}
        >
          <motion.div
            custom={0}
            variants={formFieldVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <label className="block text-lg mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-all duration-300"
            />
          </motion.div>
          <motion.div 
            className='mt-3'
            custom={1}
            variants={formFieldVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <label className="block text-lg mb-1">Email</label>
            <input
              type="email"
              placeholder="Your email"
              className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-all duration-300"
            />
          </motion.div>
          <motion.div 
            className='mt-3'
            custom={2}
            variants={formFieldVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <label className="block text-lg mb-1">Message</label>
            <textarea
              rows="6"
              placeholder="Write your message here..."
              className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-all duration-300"
            ></textarea>
          </motion.div>
          <motion.button 
            type="submit" 
            className="w-full bg-gradient-to-b from-[#2D6A4F] to-[#22503B] text-white py-3 rounded-lg hover:from-[#285f47] hover:to-[#1e4634] transition"
            variants={submitButtonVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 8px 20px rgba(45, 106, 79, 0.3)",
              transition: {
                duration: 0.3
              }
            }}
            whileTap={{ scale: 0.98 }}
          >
            Send Message
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default ContactSection;
