import React, { useState, useEffect } from 'react';
import { doc, getDocs, getDoc, collection, orderBy, query } from "firebase/firestore";
import { auth, db } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { Book, FileText, GraduationCap,LibraryBig } from "lucide-react";
import image1 from '../assets/img1.jpg'; 
import image2 from '../assets/img2.jpg';
import image3 from '../assets/img3.jpg';
import Footer from '../Footer';
import notes from '../assets/notes.png';
import marks from '../assets/marks.png';
import homework from '../assets/homework.png';
import other from '../assets/other.png';

const Dashboard6 = () => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [image1, image2, image3]; // Default images

  // Fetch notices from Firebase
  useEffect(() => {
    const fetchNotices = async () => {
      const q = query(collection(db, "notices"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedNotices = querySnapshot.docs.map(doc => doc.data());
      setNotices(fetchedNotices);
    };
    fetchNotices();
  }, []);

  // Set up the automatic slide rotation for notices and default images
  useEffect(() => {
    const interval = setInterval(() => {
      // Update currentIndex for cycling through notices and default images
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
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("No user is signed in.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const currentDate = `${day}/${month}/${year}`; 

  const userInitials = userName ? userName.slice(0, 2).toUpperCase() : 'PA';

  // Determine current image to display
  let currentImageSrc;
  let currentNoticeContent;

  if (currentIndex < notices.length) {
    const currentNotice = notices[currentIndex];
    currentImageSrc = currentNotice.image; // Assuming the image is in the notice
    currentNoticeContent = currentNotice.content; // Content of the notice
  } else {
    // If currentIndex exceeds the number of notices, cycle through default images
    const defaultImageIndex = currentIndex - notices.length;
    currentImageSrc = images[defaultImageIndex]; // Use default images
    currentNoticeContent = null; // No notice content for default images
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow">
        <div className="max-w-8xl mx-0 px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {userName}</h1>
            <h2 className="text-lg font-md text-gray-800 mt-1">{currentDate}</h2>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center  font-semibold text-lg">
            {userInitials}
          </div>
        </div>
      </header>
      <main className="flex-grow overflow-auto">
        <div className="max-w-full mx-0 px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-10 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:w-2/3">
              {[
                { title: "Notes", image: notes, description: "Access important notes for your lessons", route: "/Grade6/Notes6" },
                { title: "Homework", image: homework, description: "Review and submit your homework", route: "/Grade6/Homework6" },
                { title: "Marks", image: marks, description: "View your latest marks and track progress", route: "/Grade6/Marks6" },
                { title: "Other", image: other, description: "Explore additional resources and materials", route: "/Other" },
              ].map((item, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden border">
                  <div className="p-5">
                    <div className="flex items-center space-x-2">
                      <img src={item.image} alt={item.title} className="h-7 w-7" />
                      <h1 className="text-2xl font-semibold">{item.title}</h1>
                    </div>
                    <p className="text-lg text-gray-600 mb-12 mt-6">{item.description}</p>
                    <button 
                      className="w-full bg-primary font-semibold py-2 px-4 rounded hover:bg-secondary transition duration-200"
                      onClick={() => {
                        console.log(`Navigating to ${item.route}`);
                        window.location.href = item.route;
                      }}
                    >
                      View {item.title}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:w-1/3 flex items-center">
              {/* Show the currently selected notice image or the rotating default images */}
              <div className="w-full h-auto rounded-lg shadow-lg object-cover" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                {currentNoticeContent ? (
                  <>
                    {currentImageSrc ? (
                      <img src={currentImageSrc} alt="Notice Image" className="w-full h-auto rounded-lg" />
                    ) : (
                      <p className="text-lg text-gray-800">{currentNoticeContent}</p>
                    )}
                  </>
                ) : (
                  <img 
                    src={currentImageSrc} 
                    alt={`Default Image ${currentIndex + 1}`} 
                    className="w-full h-auto rounded-lg shadow-lg object-cover" 
                    style={{ maxHeight: 'calc(100vh - 250px)' }} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard6;