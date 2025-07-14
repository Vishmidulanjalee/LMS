import React, { useState, useEffect } from 'react';
import { doc, getDocs, getDoc, collection, orderBy, query } from "firebase/firestore";
import { auth, db } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import image1 from './assets/img1.jpg'; 
import image2 from './assets/img2.jpg';
import image3 from './assets/img3.jpg';
import Footer from './Footer';

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

  const userInitials = userName ? userName.slice(0, 2).toUpperCase() : 'PA';

  let currentImageSrc;
  let currentNoticeContent;

  if (currentIndex < notices.length) {
    const currentNotice = notices[currentIndex];
    currentImageSrc = currentNotice.image;
    currentNoticeContent = currentNotice.content;
  } else {
    const defaultImageIndex = currentIndex - notices.length;
    currentImageSrc = images[defaultImageIndex];
    currentNoticeContent = null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {userName}</h1>
            <h2 className="text-lg font-medium text-gray-700 mt-1">{currentDate}</h2>
          </div>
          <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center text-white font-semibold text-lg">
            {userInitials}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-grow overflow-auto">
        <div className="max-w-full mx-0 px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* LEFT CARDS */}
            <div className="flex flex-col gap-6 lg:w-2/3">

              {/* Card 1 */}
              <div className="bg-white shadow-md rounded-xl p-5 min-h-[130px] flex flex-col md:flex-row justify-between items-center border">
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
                <button
                  className="mt-4 md:mt-0 bg-yellow-500 text-white py-2 px-8 rounded hover:bg-yellow-600"
                  onClick={() => window.location.href = "/WatchVideos"}
                >
                  Watch Now
                </button>
              </div>

              {/* Card 2 */}
              <div className="bg-white shadow-md rounded-xl p-5 min-h-[130px] flex flex-col md:flex-row justify-between items-center border">
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
                <button
                  className="mt-4 md:mt-0 bg-yellow-500 text-white py-2 px-6 rounded hover:bg-yellow-600"
                  onClick={() => window.location.href = "/Marks"}
                >
                  Check Results
                </button>
              </div>

              {/* Card 3 */}
              <div className="bg-white shadow-md rounded-xl p-5 min-h-[130px] flex flex-col md:flex-row justify-between items-center border">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <svg className="h-7 w-7 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 0v4m0-4h4m-4 0H8m6.586-6.586a2 2 0 112.828 2.828l-3.414 3.414a2 2 0 01-2.828 0l-3.414-3.414a2 2 0 112.828-2.828l1.586 1.586a1 1 0 001.414 0l1.586-1.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Tutes, Papers & Other documents</h2>
                    <p className="text-gray-600 text-sm">Find your tutes and papers </p>
                  </div>
                </div>
                <button
                  className="mt-4 md:mt-0 bg-yellow-500 text-white py-2 px-10 rounded hover:bg-yellow-600"
                  onClick={() => window.location.href = "/homework"}
                >
                  Find Now
                </button>
              </div>
            </div>

            {/* RIGHT IMAGE / SLIDE */}
            <div className="lg:w-1/3 flex justify-center items-center">
              {currentImageSrc && (
                <img
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
      <footer className="w-full bg-white border-t mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Dashboard;
