import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { Book, FileText, GraduationCap, LibraryBig } from "lucide-react";
import Footer from '../Footer';
import notes from '../assets/notes.png';
import marks from '../assets/marks.png';
import homework from '../assets/homework.png';
import other from '../assets/other.png';

const TeacherDashboard9 = () => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [customContent, setCustomContent] = useState('');
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "teachers", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUserName(docSnap.data().username || '');  // Ensure username is set
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
  const currentDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`; 

  const userInitials = userName ? userName.slice(0, 2).toUpperCase() : 'GD';

  const handleAddContent = async () => {
    if (customContent.trim() || currentImage) {
      const notice = {
        content: customContent || '',
        image: currentImage || null,  // Ensure image is null if not set
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
        setCurrentImage(reader.result);
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
            <h1 className="text-2xl font-medium text-gray-800">Grade 9</h1>
            <h2 className="text-lg font-normal text-gray-800 mt-1">{currentDate}</h2>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg">
            {userInitials}
          </div>
        </div>
      </header>
      <main className="flex-grow overflow-auto pb-20">
        <div className="max-w-full mx-0 px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-10 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:w-2/3">
              {[
                { title: "Add Notes", image: notes, description: "Add new notes for your lessons", route: "/Teacher9/Notes" },
                { title: "Add Homework", image: homework, description: "Create homework assignments", route: "/Teacher9/Homework" },
                { title: "Add Marks", image: marks, description: "Record student marks", route: "/Teacher9/Marks" },
                { title: "Add Other", image: other, description: "Add other teaching materials", route: "/add-other" },
              ].map((item, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center space-x-2">
                      <img src={item.image} alt={item.title} className="h-7 w-7" />
                      <h1 className="text-2xl font-semibold">{item.title}</h1>
                    </div>
                    <p className="text-lg text-gray-600 mb-12 mt-6">{item.description}</p>
                    <button 
                      className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-secondary transition duration-200"
                      onClick={() => window.location.href = item.route}
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
                {customContent || (currentImage ? <img src={currentImage} alt="Uploaded" className="w-full h-auto rounded-lg"/> : "No content added yet.")}
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
                  onClick={handleAddContent}
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
  );
}

export default TeacherDashboard9;
