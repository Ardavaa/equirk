import React from 'react';

const CTA = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center px-15 py-12 bg-white">
      <h2 className="text-black text-2xl md:text-3xl font-medium mb-4 md:mb-0 text-center md:text-left">
        Careers should be accessible to everyone. Let's make that real.
      </h2>
      <button className="bg-[#2D6A4F] text-white px-6 py-2 rounded-lg shadow-2xl hover:bg-green-800 transition">
        Get Started Now
      </button>
    </div>
  );
};

export default CTA;
