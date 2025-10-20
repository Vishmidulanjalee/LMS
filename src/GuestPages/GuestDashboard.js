import { useEffect, useState } from 'react';
import Footer from '../Footer';
import { motion } from 'framer-motion';
import Quiz from './Quiz';
import { FaFileAlt, FaVideo, FaRegFilePdf, FaGlobeAsia, FaBook, FaPenNib, FaChalkboardTeacher } from 'react-icons/fa';

import image1 from '../assets/image1.jpg';
import image2 from '../assets/img1.jpg';
import image3 from '../assets/Image04.jpg';
import image4 from '../assets/img5.jpg';
import image5 from '../assets/img6.jpg';
import bee from '../assets/bee.png';
import confetti from 'canvas-confetti';

const Dashboard = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [image1, image2, image3, image4, image5];
  const currentImageSrc = images[currentImageIndex];
  const [showQuiz, setShowQuiz] = useState(false);

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

  const handleQuizStart = () => {
    confetti({
      particleCount: 300,
      spread: 180,
      origin: { y: 0.7 },
    });
    setShowQuiz(true);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden relative bg-gradient-to-br from-yellow-300 via-white to-yellow-300">
      {/* HEADER */}
      <header className="bg-white shadow z-10 shrink-0">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome To The Bee Academy</h1>
            <h2 className="text-lg font-medium text-gray-700 mt-1">{currentDate}</h2>
          </div>
          <button
            onClick={handleQuizStart}
            className="bg-yellow-300 hover:bg-yellow-500 hover:text-white font-semibold px-4 py-2 rounded-full shadow flex items-center gap-2"
          >
            Start Quiz
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

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowQuiz(false)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-2xl font-bold px-4"
            >
              ×
            </button>
            <Quiz />
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="flex-grow">
        <div className="max-w-full mx-0 px-4 sm:px-6 lg:px-8 py-6 h-full">
          <div className="flex flex-col lg:flex-row gap-10 h-full">
            <div className="flex flex-col gap-6 lg:w-2/3">
              <div className="bg-white p-6 rounded-lg shadow w-full">
                <h2 className="text-2xl font-serif font-semibold mb-4 text-black flex items-center gap-2">
                  <FaFileAlt className="inline-block text-yellow-600" />
                  Papers
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div onClick={() => window.location.href = '/PastPapers'} className="bg-white p-4 rounded shadow-lg border border-yellow-100 hover:bg-yellow-300 transition-colors min-h-[120px] flex flex-col justify-center cursor-pointer">
                    <div className="flex items-center gap-2 text-xl font-semibold text-black mb-1">
                      <FaRegFilePdf className="text-yellow-600" />
                      Past Papers
                    </div>
                    <p className="text-sm text-yellow-700">Previous exam papers</p>
                  </div>
                  <div onClick={() => window.location.href = '/ProvincialPapers'} className="bg-white p-4 rounded shadow-lg border border-yellow-100 hover:bg-yellow-300 transition-colors min-h-[120px] flex flex-col justify-center cursor-pointer">
                    <div className="flex items-center gap-2 text-xl font-semibold text-black mb-1">
                      <FaGlobeAsia className="text-yellow-600" />
                      Provincial Papers
                    </div>
                    <p className="text-sm text-yellow-700">Regional exam papers</p>
                  </div>
                  <div onClick={() => window.location.href = '/ModelPapers'} className="bg-white p-4 rounded shadow-lg border border-yellow-100 hover:bg-yellow-300 transition-colors min-h-[120px] flex flex-col justify-center cursor-pointer">
                    <div className="flex items-center gap-2 text-xl font-semibold text-black mb-1">
                      <FaBook className="text-yellow-600" />
                      Model Papers
                    </div>
                    <p className="text-sm text-yellow-700">Practice exam papers</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow w-full">
                <h2 className="text-2xl font-serif font-semibold mb-4 text-black flex items-center gap-2">
                  <FaVideo className="inline-block text-yellow-600" />
                  Lessons
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div onClick={() => window.location.href = '/Essays'} className="bg-white p-4 rounded shadow-lg border border-yellow-100 hover:bg-yellow-300 transition-colors min-h-[120px] flex flex-col justify-center cursor-pointer">
                    <div className="flex items-center gap-2 text-xl font-semibold text-black mb-1">
                      <FaPenNib className="text-yellow-600" />
                      Essays
                    </div>
                    <p className="text-sm text-yellow-700">Essay recordings</p>
                  </div>
                  <div onClick={() => window.location.href = '/Seminar'} className="bg-white p-4 rounded shadow-lg border border-yellow-100 hover:bg-yellow-300 transition-colors min-h-[120px] flex flex-col justify-center cursor-pointer">
                    <div className="flex items-center gap-2 text-xl font-semibold text-black mb-1">
                      <FaChalkboardTeacher className="text-yellow-600" />
                      Seminar
                    </div>
                    <p className="text-sm text-yellow-700">Seminar recordings</p>
                  </div>
                </div>
              </div>
            </div>
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
