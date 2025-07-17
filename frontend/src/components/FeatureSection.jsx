import React from 'react';

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
  return (
    <div className="p-8 font-sans grid md:grid-cols-2 gap-8 items-start mx-10">
      {/* Left Side */}
      <div>
        <button className="border px-4 py-1 rounded-lg mb-4" style={{borderColor: '#2d6a4f', color: '#2d6a4f'}}>
          Features
        </button>
        <h2 className="text-custom-dark text-8xl md:text-3xl font-medium max-w-[88%] leading-relaxed">
          Everything you need to plan your career with confidence. From job matching to skill-building, all in one place.
        </h2>
      </div>

      {/* Right Side */}
      <div className="space-y-6 pt-10">
        {features.map((item, index) => (
          <div key={index} className="flex items-start gap-4 border-b pb-4">
                          <p className="text-6xl font-semibold text-custom-dark">{item.number}</p>
            <div>
              <h3 className="text-custom-dark font-semibold text-lg">{item.title}</h3>
              <p className="pt-2 text-sm text-gray-600">{item.desc}</p>
              <hr className="mt-4 my-[-20px] border-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
