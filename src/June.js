import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import Footer from './Footer';

const June = () => {
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    const fetchJuneVideos = async () => {
      try {
        const q = query(
  collection(db, 'recordings'),
  where('month', '==', 'June')
);

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Fetched June recordings:", data);
        setRecordings(data);
      } catch (error) {
        console.error('Error fetching June recordings:', error);
      }
    };

    fetchJuneVideos();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 font-serif">Watch Recordings - June</h1>
        </div>
      </header>

      <main className="flex-grow px-6 py-10 max-w-7xl mx-auto">
        {recordings.length === 0 ? (
          <p className="text-center text-gray-600">No recordings found for June.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recordings.map((rec) => (
              <div key={rec.id} className="bg-white rounded shadow-md overflow-hidden flex flex-col">
                <img
                  src={rec.thumbnail}
                  alt={rec.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <h3 className="font-semibold text-gray-800 mb-2">{rec.title}</h3>
                  <a
                    href={rec.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Watch on YouTube
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default June;
