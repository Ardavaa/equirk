import React from 'react';

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
  return (
    <div className="p-8 font-sans px-15 relative">
      {/* Label */}
      <button className="border border-[#2D6A4F] text-[#2D6A4F] px-4 py-1 rounded-lg mb-6">
        Career
      </button>

      {/* Title */}
                  <h2 className="text-custom-dark text-8xl md:text-3xl font-medium mb-8 max-w-xl mt-2 pb-8">
        Find real job openings from companies that value accessibility and inclusion.
      </h2>

      {/* Grid + Fade container */}
      <div className="relative">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {jobs.map((job) => (
                            <div key={job.id} className="text-custom-dark border rounded-md p-6 text-sm bg-white">
              <p className="text-gray-500 mb-1 p-1">📍 {job.location}</p>
              <h3 className="font-semibold text-xl p-1 text-base">{job.title}</h3>
              <p className="text-gray-600 p-1 mt-1">
                {job.types.join(' • ')}
              </p>
            </div>
          ))}
        </div>

        {/* Fade effect */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      {/* Button */}
      <div className="text-gray-800 text-center mt-4">
        <button className="border border-gray-400 px-4 py-2 rounded-lg shadow-gray-300 shadow-lg hover:bg-gray-100 transition">
          See More Jobs
        </button>
      </div>
    </div>
  );
};

export default CareerSection;
