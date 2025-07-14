import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { AiFillDelete } from 'react-icons/ai';
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import Footer from './Footer';

const UploadRecordings = () => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [recordings, setRecordings] = useState([]);

  // Fetch uploaded recordings from Firestore
  const fetchRecordings = async () => {
    const q = query(collection(db, 'recordings'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    setRecordings(items);
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  // Handle thumbnail upload
  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnail(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !link || !thumbnail) {
      alert("All fields are required.");
      return;
    }

    try {
      await addDoc(collection(db, 'recordings'), {
        title,
        link,
        thumbnail,
        timestamp: Timestamp.now()
      });
      alert("Recording uploaded successfully!");
      setTitle('');
      setLink('');
      setThumbnail(null);
      fetchRecordings();
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Upload failed.");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this recording?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'recordings', id));
      fetchRecordings();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete recording.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Upload Class Recordings</h1>
        </div>
      </header>

      <main className="flex flex-grow flex-col lg:flex-row p-6 gap-10">
        {/* Upload form */}
        <div className="lg:w-1/2 bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="text-gray-700 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded p-2"
              placeholder="Enter video title"
              required
            />

            <label className="text-gray-700 font-medium">YouTube Link</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="border border-gray-300 rounded p-2"
              placeholder="https://youtube.com/..."
              required
            />

            <label className="text-gray-700 font-medium">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="mb-2"
            />

            <button type="submit" className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
              Upload
            </button>
          </form>
        </div>

        {/* Uploaded recordings */}
        <div className="lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Uploaded Recordings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recordings.map((rec, index) => (
              <div key={rec.id} className="bg-white rounded shadow-md overflow-hidden relative">
                <img src={rec.thumbnail} alt="Thumbnail" className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{rec.title}</h3>
                  <a
                    href={rec.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Watch on YouTube
                  </a>
                </div>
                {/* Delete icon */}
                <button
                  onClick={() => handleDelete(rec.id)}
                  className="absolute bottom-2 right-2 text-red-700 hover:text-red-800 text-xl"
                  title="Delete"
                >
                    <AiFillDelete />
                  
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UploadRecordings;

