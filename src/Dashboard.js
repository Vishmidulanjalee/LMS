import React, { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import { Book, FileText, GraduationCap, LibraryBig } from "lucide-react";
import image1 from './assets/img1.jpg'; 
import image2 from './assets/img2.jpg';
import image3 from './assets/img3.jpg';
import Footer from './Footer';
import { title } from 'framer-motion/client';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  const images = [image1, image2, image3];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

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

  return (
    <div className="flex flex-col h-screen bg-gray-200 ">
      <header className="bg-white shadow ">
        <div className="max-w-8xl mx-0 px-4  sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {userName}</h1>
            <h2 className="text-lg font-md text-gray-800 mt-1">{currentDate}</h2>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg">
            {userInitials}
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="h-full max-w-full mx-0 px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-10 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:w-2/3">
              {[
                { title: "Notes", icon: Book, description: "Access important notes for your lessons", route: "/NotesPage/Notes" },
                {title: "Homework", icon: FileText, description: "Review and submit your homework", route: "/homework"},
                { title: "Marks", icon: GraduationCap, description: "View your latest marks and track progress", route: "/MarksPages/MarksPages" },
                { title: "Other", icon: FileText, description: "Review and submit your homework", route: "/teacher/homework" },
                //{ title: "Other", icon: LibraryBig, description: "Explore additional resources and options", route: "/other" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-center space-x-2">
                      <item.icon className="h-7 w-7" />
                      <h1 className="text-2xl font-semibold">{item.title}</h1>
                    </div>
                    <p className="text-lg text-gray-600 mb-12 mt-6">{item.description}</p>
                    <button 
                      className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-secondary transition duration-200"
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
              <img 
                src={images[currentIndex]} 
                alt={`Slider ${currentIndex + 1}`} 
                className="w-full h-auto rounded-lg shadow-lg object-cover"
                style={{ maxHeight: 'calc(100vh - 250px)' }}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard