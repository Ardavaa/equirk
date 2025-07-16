// src/components/Navbar.jsx
import Logo from '../assets/Logo.png';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-6 shadow-sm bg-white px-10 border-gray-200 border-1 border-solid">
      <img src={Logo} alt="logo" className="w-[9%] h-auto" />

      <ul className="hidden md:flex space-x-6 text-gray-700 font-normal text-lg">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Features</a></li>
        <li><a href="#">Career</a></li>
        <li><a href="#">Contact</a></li>
      </ul>

      <a
        href="#"
        className="bg-emerald-800 text-white px-5 py-2 rounded-md shadow hover:bg-emerald-700 transition"
      >
        Get Started Now
      </a>
    </nav>
  );
}
