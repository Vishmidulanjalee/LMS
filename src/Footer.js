import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTiktok, faYoutube } from "@fortawesome/free-brands-svg-icons";
import Logo from './assets/Logo.png';


const Footer = () => {
  return (
    <footer className="bg-white py-1 px-6 fixed bottom-0 left-0 w-full border-t border-gray-400 z-20">
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
          <a href="https://www.facebook.com/share/iBFQfxsLKHUiHFhc/" className="text-gray-600 hover:text-gray-900" aria-label="Facebook"  target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebookF} className="h-5 w-5 border-2 border-gray-600 rounded-full  hover:border-gray-900 px-1.5 py-1.5" /> {/* Use the imported icon */}
          </a>
          
          <a href="https://www.tiktok.com/@gishan_dhananjaya?_t=8qL7YuZroyl&_r=1" className="text-gray-600 hover:text-gray-900" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTiktok} className="h-5 w-5 border-2 border-gray-600 rounded-full hover:border-gray-900 px-1.5 py-1.5" /> {/* Use the imported icon */}
          </a>
          
          <a href="https://youtube.com/@gishandhananjaya-1998?si=QhAPWl_YvtLV5TEc" className="text-gray-600 hover:text-gray-900" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
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
