import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTiktok, faYoutube } from "@fortawesome/free-brands-svg-icons";
import Logo from './assets/Logo.png';


const Footer = () => {
  return (
    <footer className="bg-white py-3 px-6 relative bottom-0 left-0 w-full border-t border-gray-200 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row justify-between items-center space-x-3">
            <div>
                <img src={Logo} alt="Logo" className="h-14 w-14" />
            </div>
            <div className="text-lg text-gray-800 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                <h1>The BEE Academy</h1>
            </div>
        </div>

        <div className="flex space-x-4">
          <a href="https://www.facebook.com/share/iBFQfxsLKHUiHFhc/" className="text-gray-500 hover:text-amber-500 transition-colors" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebookF} className="h-4 w-4 border-2 border-gray-300 hover:border-amber-400 rounded-full px-1.5 py-1.5 transition-colors" />
          </a>
          <a href="https://www.tiktok.com/@gishan_dhananjaya?_t=8qL7YuZroyl&_r=1" className="text-gray-500 hover:text-amber-500 transition-colors" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTiktok} className="h-4 w-4 border-2 border-gray-300 hover:border-amber-400 rounded-full px-1.5 py-1.5 transition-colors" />
          </a>
          <a href="https://youtube.com/@gishandhananjaya-1998?si=QhAPWl_YvtLV5TEc" className="text-gray-500 hover:text-amber-500 transition-colors" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faYoutube} className="h-4 w-4 border-2 border-gray-300 hover:border-amber-400 rounded-full px-1.5 py-1.5 transition-colors" />
          </a>
        </div>

        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} The BEE Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
