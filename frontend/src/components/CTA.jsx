import React from 'react';

const CTA = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center px-15 py-12 bg-white">
              <h2 className="text-custom-dark text-2xl md:text-3xl font-medium mb-4 md:mb-0 text-center md:text-left">
        Careers should be accessible to everyone. Let's make that real.
      </h2>
      <button className="bg-gradient-to-b from-[#2D6A4F] to-[#22503B] text-white px-6 py-2 rounded-lg shadow-2xl hover:from-[#285f47] hover:to-[#1e4634] transition">
        Get Started Now
      </button>
    </div>
  );
};

export default CTA;
