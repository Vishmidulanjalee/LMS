import React from 'react';
import { FaLaptop, FaUsers } from 'react-icons/fa';
import BeeIcon from './assets/Logo.png';
import BackgroundImage from './assets/background.jpg'; // ✅ import the image

const StudentTypeSelection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-100 px-4 py-10 flex flex-col items-center text-center">
      
      {/* Background Image */}
      <img
        src={BackgroundImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Top Logo Button */}
        <div className="flex items-center bg-yellow-200 rounded-full px-4 py-2 shadow-xl mb-6">
          <img src={BeeIcon} alt="Bee" className="h-6 w-6 mr-2" />
          <span className="text-white font-semibold">The BEE Academy</span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Are you an <span className="text-yellow-700">Online Student</span><br />
          or a <span className="text-gray-700">Guest Student</span>?
        </h1>
        <p className="text-gray-600 mb-10">
          Choose your learning path and start your educational journey with us
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Online Student Card */}
                <div className="bg-white rounded-2xl p-6 w-72 shadow-lg hover:scale-105 transition-transform">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-yellow-100 rounded-full p-4">
                  <FaLaptop size={32} className="text-yellow-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Online Student</h2>
                  <p className="text-sm text-gray-600 text-center">
                  Access class recordings, tutes and papers, and see your progress
                  </p>
                  <button
                  className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
                  onClick={() => window.location.href = '/signin'}
                  >
                  Get Access Now 
                  </button>
                </div>
                </div>
          <div className="bg-white rounded-2xl p-6 w-72 shadow-lg hover:scale-105 transition-transform">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-gray-200 rounded-full p-4">
                <FaUsers size={32} className="text-gray-800" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Guest Student</h2>
              <p className="text-sm text-gray-600 text-center">
                Explore sample content, preview courses, and discover what we offer
              </p>
              <button className="mt-4 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
              onClick={() => window.location.href = '/GuestDashboard'}>

                Browse as Guest
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentTypeSelection;
