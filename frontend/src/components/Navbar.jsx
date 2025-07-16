// src/components/Navbar.jsx
import Logo from '../assets/Logo.png';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated, principal, login, logout, isLoading } = useAuth();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      login();
    }
  };

  const truncatePrincipal = (principal) => {
    if (!principal) return '';
    return `${principal.slice(0, 8)}...${principal.slice(-4)}`;
  };

  return (
    <nav className="flex justify-between items-center py-6 shadow-sm bg-white px-10 border-gray-200 border-1 border-solid">
      <img src={Logo} alt="logo" className="w-[9%] h-auto" />

      <ul className="hidden md:flex space-x-6 text-gray-700 font-normal text-lg">
        <li><a href="#" onClick={isAuthenticated ? undefined : login}>Home</a></li>
        <li><a href="#" onClick={isAuthenticated ? undefined : login}>About</a></li>
        <li><a href="#" onClick={isAuthenticated ? undefined : login}>Features</a></li>
        <li><a href="#" onClick={isAuthenticated ? undefined : login}>Career</a></li>
        <li><a href="#" onClick={isAuthenticated ? undefined : login}>Contact</a></li>
      </ul>

      <div className="flex items-center space-x-4">
        {isAuthenticated && (
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <span>Welcome:</span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
              {truncatePrincipal(principal)}
            </span>
          </div>
        )}
        
        <button
          onClick={handleAuthClick}
          disabled={isLoading}
          className="bg-emerald-800 text-white px-5 py-2 rounded-md shadow hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
            'Logout'
          ) : (
            'Get Started Now'
          )}
        </button>
      </div>
    </nav>
  );
}
