import { useEffect, useState } from 'react';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { BsStars } from 'react-icons/bs';

import { FaFileAlt } from 'react-icons/fa'; // ✅ Added import

import image1 from './assets/image1.jpg';
import image2 from './assets/img1.jpg';
import image3 from './assets/Image04.jpg';
import image4 from './assets/img5.jpg';
import image5 from './assets/img6.jpg';
import bee from './assets/bee.png';
import confetti from 'canvas-confetti';

const Dashboard = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [image1, image2, image3, image4, image5];
  const currentImageSrc = images[currentImageIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const today = new Date();
  const currentDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [isEasterEggActive, setIsEasterEggActive] = useState(false);

  const handleBeeClick = () => {
    confetti({
      particleCount: 1000,
      spread: 1000,
      origin: { y: 0.9 },
      shapes: ['text'],
      shapeOptions: {
        text: {
          value: ['🌸'],
        },
      },
    });

    setIsEasterEggActive(true);
    setTimeout(() => setIsEasterEggActive(false), 4000);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden relative bg-yellow-50">
      {/* HEADER */}
      <header className="bg-white shadow z-10 shrink-0">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome To The Bee Academy</h1>
            <h2 className="text-lg font-medium text-gray-700 mt-1">{currentDate}</h2>
            
          </div>
          <button className="bg-yellow-500 hover:bg-yellow-800 hover:text-white font-semibold px-4 py-2 rounded-full shadow flex items-center gap-2">
          <BsStars /> Start Quiz
        </button>
        </div>
      </header>

      {/* Flying Bee Animation */}
      <motion.img
        src={bee}
        alt="Flying Bee"
        className="animate-beeFlight fixed top-10 left-[-100px] w-14 z-50 cursor-pointer"
        onClick={handleBeeClick}
        animate={isEasterEggActive ? {
          rotate: [0, 360, 0],
          scale: [1, 1.5, 1],
          x: [0, 20, -20, 0],
          y: [0, -10, 10, 0]
        } : {
          x: ["-10%", "100%", "-10%"],
          y: ["0%", "-10%", "10%", "0%"]
        }}
        transition={{
          duration: isEasterEggActive ? 1.5 : 15,
          repeat: isEasterEggActive ? 1 : Infinity,
          ease: "easeInOut"
        }}
      />

      {isEasterEggActive && (
        <div className="fixed top-28 left-20 bg-yellow-200 text-black px-4 py-2 rounded shadow-lg z-50 animate-bounce">
          🎉 Yayyy You're doing good!
        </div>
      )}

      {/* MAIN */}
      <main className="flex-grow">
        <div className="max-w-full mx-0 px-4 sm:px-6 lg:px-8 py-6 h-full">
          <div className="flex flex-col lg:flex-row gap-10 h-full">
            {/* LEFT CARDS */}
            <div className="flex flex-col gap-6 lg:w-2/3">
              {/* Papers Section */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4 text-yellow-800">Papers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-yellow-100 p-4 rounded shadow">
                    <FaFileAlt className="text-yellow-600 mb-2" />
                    <p className="font-medium text-yellow-900">Past Papers</p>
                    <p className="text-xs text-yellow-700">Previous exam papers</p>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded shadow">
                    <FaFileAlt className="text-yellow-600 mb-2" />
                    <p className="font-medium text-yellow-900">Provincial Papers</p>
                    <p className="text-xs text-yellow-700">Regional exam papers</p>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded shadow">
                    <FaFileAlt className="text-yellow-600 mb-2" />
                    <p className="font-medium text-yellow-900">Model Papers</p>
                    <p className="text-xs text-yellow-700">Practice exam papers</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4 text-yellow-800">Free Lessons</h2>
                <div className="flex gap-2 mb-4 text-sm">
                  <button className="bg-yellow-500 text-white px-5 py-1 rounded hover:text-white">Essay</button>
                  <button className="text-yellow-700 bg-transparent hover:bg-yellow-500 hover:text-white px-5 py-1 rounded">Grammar</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-yellow-100 p-4 rounded shadow">
                    <div className="bg-yellow-300 h-16 mb-2 rounded"></div>
                    <p className="text-sm font-semibold text-yellow-900">Introduction to Essays</p>
                    <p className="text-xs text-yellow-700">Learn the fundamentals</p>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded shadow">
                    <div className="bg-yellow-300 h-16 mb-2 rounded"></div>
                    <p className="text-sm font-semibold text-yellow-900">Advanced Writing</p>
                    <p className="text-xs text-yellow-700">Master persuasive writing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE SLIDER */}
            <div className="lg:w-1/3 flex justify-center items-center">
              {currentImageSrc && (
                <motion.img
                  key={currentImageSrc}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  src={currentImageSrc}
                  alt="Notice or Slide"
                  className="rounded-lg shadow-md max-h-[400px] w-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-white border-t z-10 shrink-0">
        <Footer />
      </footer>
    </div>
  );
};

export default Dashboard;
