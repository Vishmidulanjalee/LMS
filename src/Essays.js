import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

import Footer from './Footer';

const Essays = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const snapshot = await getDocs(collection(db, 'uploads'));
      const filtered = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => p.section === 'lessons' && p.type === 'Essays');
      setVideos(filtered);
    };
    fetchVideos();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 font-serif">Essay Recordings</h1>
        </div>
      </header>
      
      <main className="flex-grow max-w-6xl mx-auto mt-10 px-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map(video => (
            <div key={video.id} className="bg-white border rounded shadow-sm p-4">
              <img
                src={video.thumbnailURL}
                alt="Thumbnail"
                className="w-full h-40 object-cover mb-3 rounded"
              />
              <h3 className="text-lg font-semibold">{video.title}</h3>
              <p className="text-gray-600 text-sm">{video.description}</p>
              <a
                href={video.youtubeURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-600 underline text-sm mt-2 inline-block cursor-pointer"
              >
                Watch on YouTube
              </a>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Essays;
