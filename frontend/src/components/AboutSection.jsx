import React from 'react';
import AboutGrid1 from '../assets/AboutGrid1.png';
import AboutGrid2 from '../assets/AboutGrid2.png';
import AboutGrid3 from '../assets/AboutGrid3.png';

const AboutSection = () => {
  return (
    <div className="p-8 font-sans mx-10">
      {/* About Button */}
      <button className="border border-green-600 text-green-600 px-4 py-1 rounded-lg mb-4">
        About
      </button>

      {/* Heading */}
      <h1 className="text-black text-2xl md:text-3xl font-medium mb-6 max-w-[82%]">
        Equirk helps people with disabilities{' '}
        <span className="bg-gradient-to-r from-[#82A696] to-[#2D6A4F] bg-clip-text text-transparent font-semibold">
          explore career options
        </span>{' '}
        that fit their needs, build the right skills, and grow at their own pace. We’re here to make inclusive work more accessible, one step at a time.
      </h1>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-4 mt-10">
        {/* Card 1 */}
        <div className="relative rounded-lg overflow-hidden">
          <img src={AboutGrid1} alt="Why We Exist" className="w-full h-auto object-cover" />
        </div>

        {/* Card 2 */}
        <div className="relative rounded-lg overflow-hidden">
          <img src={AboutGrid2} alt="Our Mission" className="w-full h-auto object-cover" />
        </div>

        {/* Card 3 */}
        <div className="relative rounded-lg overflow-hidden">
          <img src={AboutGrid3} alt="Who We Help" className="w-full h-auto object-cover" />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
