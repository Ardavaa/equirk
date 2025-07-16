import Floating1 from '../assets/Floating1.png';
import Floating2 from '../assets/Floating2.png';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Floating Images */}
      <div className='w-full flex justify-center max-w-none'>
        <img
        src={Floating1}
        alt="Roadmap"
        className="absolute top-0 left-0 w-[400px] h-auto transform translate-x-20 -translate-y-10 drop-shadow-lg"
      />
      <img
        src={Floating2}
        alt="Job Card"
        className="absolute top-0 right-0 w-[380px] h-auto transform -translate-x-20 -translate-y-10 drop-shadow-lg"
      />
      </div>

      {/* Text Content */}
      <div className="relative z-10 text-center mt-30 py-32">
        <h1 className="text-5xl sm:text-6xl font-medium text-gray-900 px-4">
          Smart Career Tools for People <br/> with Disabilities
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Helping people with disabilities find jobs, learn skills, and grow
        </p>
        <button className="mt-8 px-6 py-3 bg-green-800 text-white rounded-md shadow hover:bg-green-700 transition">
          Get Started Now
        </button>
      </div>
    </section>
  );
}
