import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTiktok, faYoutube } from "@fortawesome/free-brands-svg-icons";
import Logo from './assets/Logo.png';

const Footer = () => {
  return (
    <footer className="bg-white py-3 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row justify-between items-center space-x-3">    
            <div>
                <img src={Logo} alt="Logo" className="h-16 w-16" />
            </div>     
            <div className="text-xl text-gray-600 font-bold">
                <h1>The BEE Academy</h1>
            </div>
        </div> 
              
        <div className="flex space-x-6">
          <a href="https://facebook.com" className="text-gray-600 hover:text-gray-900" aria-label="Facebook">
            <FontAwesomeIcon icon={faFacebookF} className="h-5 w-5 border-2 border-gray-600 rounded-full  hover:border-gray-900 px-1.5 py-1.5" /> {/* Use the imported icon */}
          </a>
          
          <a href="https://facebook.com" className="text-gray-600 hover:text-gray-900" aria-label="Facebook">
            <FontAwesomeIcon icon={faTiktok} className="h-5 w-5 border-2 border-gray-600 rounded-full hover:border-gray-900 px-1.5 py-1.5" /> {/* Use the imported icon */}
          </a>
          
          <a href="https://facebook.com" className="text-gray-600 hover:text-gray-900" aria-label="Facebook">
            <FontAwesomeIcon icon={faYoutube} className="h-5 w-5 border-2 border-gray-600 rounded-full hover:border-gray-900 px-1.5 py-1.5" /> {/* Use the imported icon */}
          </a>
        </div>
        
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} The BEE Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
