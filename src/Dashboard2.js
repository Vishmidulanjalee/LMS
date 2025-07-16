import React, { useState, useEffect } from 'react';
import { doc, getDocs, getDoc, collection, orderBy, query } from "firebase/firestore";
import { auth, db } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import image1 from './assets/img1.jpg'; 
import image2 from './assets/img2.jpg';
import image3 from './assets/img3.jpg';
import Footer from './Footer';
import bee from './assets/bee.png'; // 🐝 bee image

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [image1, image2, image3];

  useEffect(() => {
    const fetchNotices = async () => {
      const q = query(collection(db, "notices"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedNotices = querySnapshot.docs.map(doc => doc.data());
      setNotices(fetchedNotices);
    };
    fetchNotices();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (notices.length + images.length));
    }, 5000);
    return () => clearInterval(interval);
  }, [notices.length, images.length]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().username);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const today = new Date();
  const currentDate = today.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  let currentImageSrc, currentNoticeContent;
  if (currentIndex < notices.length) {
    const currentNotice = notices[currentIndex];
    currentImageSrc = currentNotice.image;
    currentNoticeContent = currentNotice.content;
  } else {
    const defaultImageIndex = currentIndex - notices.length;
    currentImageSrc = images[defaultImageIndex];
    currentNoticeContent = null;
  }
const [isEasterEggActive, setIsEasterEggActive] = useState(false);

const handleBeeClick = () => {
  // Trigger Confetti
 confetti({
  particleCount: 1000,
  spread: 1000,
  origin: { y: 0.9 },
  shapes: ['text'],
  shapeOptions: {
    text: {
      value: ['🌸'],
    }
  }
});

  // Start animation
  setIsEasterEggActive(true);

  // Reset animation after 2s
  setTimeout(() => {
    setIsEasterEggActive(false);
  }, 4000);
};

  return (
    <div className="flex flex-col min-h-screen overflow-hidden relative">

      {/* HEADER */}
      <header className="bg-white shadow z-10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome To The Bee Academy</h1>
            <h2 className="text-lg font-medium text-gray-700 mt-1">{currentDate}</h2>
          </div>
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
      <main className="flex-grow overflow-auto">
        <div className="max-w-full mx-0 px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* LEFT CARDS */}
            <div className="flex flex-col gap-6 lg:w-2/3">

              {/* CARD 1 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white shadow-md rounded-xl p-5 min-h-[130px] flex flex-col md:flex-row justify-between items-center border transition"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <svg className="h-7 w-7 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.868v4.264a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Online Class Recordings</h2>
                    <p className="text-gray-600 text-sm">Replay your missed classes anytime</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="mt-4 md:mt-0 bg-yellow-500 text-white py-2 px-8 rounded hover:bg-yellow-600"
                  onClick={() => window.location.href = "/WatchVideosFolder"}
                >
                  Watch Now
                </motion.button>
              </motion.div>

              {/* CARD 2 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white shadow-md rounded-xl p-5 min-h-[130px] flex flex-col md:flex-row justify-between items-center border transition"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <svg className="h-7 w-7 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6h13v6M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h4m0 0V3m0 0h6v2m0 0v4H9V3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Exam Results</h2>
                    <p className="text-gray-600 text-sm">See your grades and progress clearly</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="mt-4 md:mt-0 bg-yellow-500 text-white py-2 px-6 rounded hover:bg-yellow-600"
                  onClick={() => window.location.href = "/MarkSheets"}
                >
                  Check Results
                </motion.button>
              </motion.div>

              {/* CARD 3 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white shadow-md rounded-xl p-5 min-h-[130px] flex flex-col md:flex-row justify-between items-center border transition"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <svg className="h-7 w-7 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 0v4m0-4h4m-4 0H8m6.586-6.586a2 2 0 112.828 2.828l-3.414 3.414a2 2 0 01-2.828 0l-3.414-3.414a2 2 0 112.828-2.828l1.586 1.586a1 1 0 001.414 0l1.586-1.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Tutes, Papers & Other Documents</h2>
                    <p className="text-gray-600 text-sm">Find your tutes and papers</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="mt-4 md:mt-0 bg-yellow-500 text-white py-2 px-10 rounded hover:bg-yellow-600"
                  onClick={() => window.location.href = "/Documents"}
                >
                  Find Now
                </motion.button>
              </motion.div>
            </div>

            {/* RIGHT IMAGE SLIDE */}
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
      <footer className="w-full bg-white border-t mt-auto z-10">
        <Footer />
      </footer>
    </div>
  );
};

export default Dashboard;
