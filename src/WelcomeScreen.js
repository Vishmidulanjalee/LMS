"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Logo from './assets/Logo.png';
import { Link } from 'react-router-dom';

const WelcomeScreen = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 overflow-hidden px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute -top-24 -left-32 w-2/5 h-2/5 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute -bottom-20 -right-10 w-1/2 h-1/2 bg-gradient-to-tr from-yellow-300 to-yellow-500 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-center z-10 flex flex-col items-center justify-center"
      >
        <motion.img
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          src={Logo}
          alt="Bee Academy Logo"
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mb-8 sm:mb-12 md:mb-16 lg:mb-20"
        />
        <motion.h5
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-800 mb-2 -mt-4 sm:-mt-6 md:-mt-8 lg:-mt-10"
        >
          Welcome to
        </motion.h5>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-4"
        >
          THE BEE ACADEMY
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-700 mb-8"
        >
          Explore your courses and get started on your learning journey.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className=" bg-primary hover:bg-secondary text-white font-bold py-3 px-10 rounded-full shadow-lg transition-all duration-300 ease-in-out mb-24"
        >
         <Link to={"/signin"}> {/* Updated the Link to "/signin" */}
            Get Started
        </Link>
                  
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-4 text-gray-600 text-xs sm:text-sm"
      >
        © 2023 The Bee Academy. All rights reserved.
      </motion.div>
    </div>
  )
}

export default WelcomeScreen;
