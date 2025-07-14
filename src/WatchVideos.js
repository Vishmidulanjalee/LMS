import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import Footer from './Footer';

const WatchRecordings = () => {
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      const q = query(collection(db, 'recordings'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => doc.data());
      setRecordings(items);
    };
    fetchRecordings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Watch Class Recordings</h1>
          <p className="text-gray-600">Replay your lessons anytime.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-6 py-8 max-w-7xl mx-auto">
        {recordings.length === 0 ? (
          <p className="text-gray-500">No recordings uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordings.map((rec, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={rec.thumbnail} alt="Thumbnail" className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{rec.title}</h3>
                  <a
                    href={rec.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Watch on YouTube
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WatchRecordings;
