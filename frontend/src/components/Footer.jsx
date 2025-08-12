import React from 'react';
import Logo from '../assets/Logo.png';

const Footer = () => {
  return (
    <footer className="border-t text-sm px-15 py-0 md:py-6 font-sans pb-18">
      <div className="flex flex-col md:flex-row justify-between items-center mb-2">
        {/* Left side */}
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="logo" className="w-[80%] ml-6 md:ml-0 pb-6 md:w-[60%] h-auto" />
        </div>

        {/* Right navigation */}
        <ul className="flex gap-6 mt-4 md:mt-0 text-sm text-gray-600 font-medium">
          <li><a href="#">Home</a></li>
          <li><a href="#">About us</a></li>
          <li><a href="#">Features</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    
      <hr className="my-6 border-gray-300" />

      <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs mt-4 font-medium">
        <p>Equirk © 2025. All rights reserved.</p>
        <ul className="flex gap-4 ml-9 md:ml-0 mt-4 md:mt-0 text-sm ">
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Cookie Settings</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
