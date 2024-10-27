import React, { useState, useEffect } from 'react';
import { collection,doc, getDoc,addDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { Book, FileText, GraduationCap, PlusCircle } from "lucide-react";
import Footer from '../Footer';

const TeacherDashboard = () => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [customContent, setCustomContent] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "teachers", user.uid);
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

  const userInitials = userName ? userName.slice(0, 2).toUpperCase() : 'GD';

  const handleAddContent = async () => {
    if (customContent.trim() || currentImage) {
      // Create a new notice object
      const notice = {
        content: customContent,
        image: currentImage,  // Use URL if uploading to storage
        timestamp: new Date(),
      };
      
      try {
        await addDoc(collection(db, "notices"), notice);
        setCustomContent('');
        setCurrentImage(null);
        alert("Notice added successfully!");
      } catch (error) {
        console.error("Error adding notice:", error);
      }
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImage(reader.result); // Set the image as a data URL
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <header className="bg-white shadow">
        <div className="max-w-8xl mx-0 px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back, Dhananjaya</h1>
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
                { title: "Add Notes", icon: Book, description: "Add new notes for your lessons", route: "/add-notes" },
                { title: "Add Homework", icon: FileText, description: "Create homework assignments", route: "/add-homework" },
                { title: "Add Marks", icon: GraduationCap, description: "Record student marks", route: "/add-marks" },
                { title: "Add Other", icon: PlusCircle, description: "Add other teaching materials", route: "/add-other" },
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
                      {item.title}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Custom Content Area */}
            <div className="lg:w-1/3 flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Custom Notice Board</h2>
              <div className="w-full mb-6 p-4 rounded-lg bg-gray-100 text-gray-800">
                {currentContent || (currentImage ? <img src={currentImage} alt="Uploaded" className="w-full h-auto rounded-lg"/> : "No content added yet.")}
              </div>
              <div className="w-full">
                <textarea 
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="Enter notice or content here..."
                  className="w-full p-2 rounded-lg border border-gray-300 mb-4"
                  rows="3"
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="w-full mb-4"
                />
                <button 
                  onClick={handleAddContent}  // Attach the click event
                  className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-secondary transition duration-200"
                >
                  Add Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default TeacherDashboard;
