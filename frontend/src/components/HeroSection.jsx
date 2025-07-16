import Floating1 from '../assets/Floating1.png';
import Floating2 from '../assets/Floating2.png';
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.png';
import avatar3 from '../assets/avatar3.png';
import avatar4 from '../assets/avatar4.png';
import avatar5 from '../assets/avatar5.png';
import avatar6 from '../assets/avatar6.png';
import avatar7 from '../assets/avatar7.png';
import avatar8 from '../assets/avatar8.png';
import { useAuth } from '../contexts/AuthContext';

const avatars = [
  { src: avatar1, alt: 'Avatar 1' },
  { src: avatar2, alt: 'Avatar 2' },
  { src: avatar3, alt: 'Avatar 3' },
  { src: avatar4, alt: 'Avatar 4' },
  { src: avatar5, alt: 'Avatar 5' },
  { src: avatar6, alt: 'Avatar 6' },
  { src: avatar7, alt: 'Avatar 7' },
  { src: avatar8, alt: 'Avatar 8' },
];

// Avatar positioning data for elliptical arcs
const avatarPositions = [
  // Left side
  { x: 22, y: 57, delay: 0 },    
  { x: 13, y: 55, delay: 3 },     
  { x: 18, y: 40, delay: 3.5 },   
  { x: 17, y: 70, delay: 0.5 },   
  // Right side (mirrored from left)
  { x: 78, y: 57, delay: 1 },
  { x: 87, y: 55, delay: 1.5 },  
  { x: 82, y: 40, delay: 2 },    
  { x: 83, y: 70, delay: 2.5 },  
];

export default function HeroSection() {
  const { isAuthenticated, login, logout, isLoading } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // User is already authenticated, redirect to dashboard or main app
      console.log('User is authenticated, redirect to dashboard');
    } else {
      // User is not authenticated, start login process
      login();
    }
  };

  return (
    <section className="relative overflow-hidden bg-white min-h-screen">
      {/* Elliptical Background Arcs */}
      <div className="absolute inset-0 flex justify-center items-center">
        <svg className="w-full h-full max-w-6xl" viewBox="0 0 800 600">
          {/* Outer arc */}
          <ellipse
            cx="400"
            cy="300"
            rx="350"
            ry="250"
            fill="none"
            stroke="rgba(107, 114, 128, 0.1)"
            strokeWidth="1"
            opacity="0.8"
          />
          {/* Middle arc */}
          <ellipse
            cx="400"
            cy="300"
            rx="280"
            ry="200"
            fill="none"
            stroke="rgba(107, 114, 128, 0.15)"
            strokeWidth="1"
            opacity="0.6"
          />
          {/* Inner arc */}
          <ellipse
            cx="400"
            cy="300"
            rx="220"
            ry="160"
            fill="none"
            stroke="rgba(107, 114, 128, 0.2)"
            strokeWidth="1"
            opacity="0.4"
          />
          {/* Fade gradient overlay */}
          <defs>
            <radialGradient id="fadeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </radialGradient>
          </defs>
          <ellipse
            cx="400"
            cy="300"
            rx="350"
            ry="250"
            fill="url(#fadeGradient)"
          />
        </svg>
      </div>

      {/* Floating Avatar Circles */}
      <div className="absolute inset-0 pointer-events-none">
        {avatars.map((avatar, index) => {
          const position = avatarPositions[index];
          return (
            <div
              key={index}
              className="absolute w-16 h-16 floating-avatar"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                animationDelay: `${position.delay}s`,
              }}
            >
              {/* Green outer circle */}
              <div className="w-full h-full rounded-full border-2 border-[#2D6A4F] p-1 bg-white">
                <img
                  src={avatar.src}
                  alt={avatar.alt}
                  className="w-full h-full rounded-full border border-white shadow-lg object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Images */}
      <div className='w-full flex justify-center max-w-none'>
        <img
        src={Floating1}
        alt="Roadmap"
        className="absolute top-0 left-0 w-[400px] h-auto transform translate-x-20 -translate-y-10 drop-shadow-lg z-10"
      />
      <img
        src={Floating2}
        alt="Job Card"
        className="absolute top-0 right-0 w-[380px] h-auto transform -translate-x-20 -translate-y-10 drop-shadow-lg z-10"
      />
      </div>

      {/* Text Content */}
      <div className="relative z-20 text-center mt-30 py-32">
        <h1 className="text-5xl sm:text-6xl font-medium text-gray-900 px-4">
          Smart Career Tools for People <br/> with Disabilities
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Helping people with disabilities find jobs, learn skills, and grow
        </p>
        <button 
          onClick={handleGetStarted}
          disabled={isLoading}
          className="mt-8 px-6 py-3 bg-green-800 text-white rounded-md shadow hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
          ) : isAuthenticated ? (
            'Go to Dashboard'
          ) : (
            'Get Started Now'
          )}
        </button>
      </div>
    </section>
  );
}
