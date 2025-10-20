import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import Footer from '../Footer';
import beeWaiting from '../assets/beewaiting.png';

const October = () => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOctoberVideos = async () => {
      try {
        const q = query(
          collection(db, 'recordings'),
          where('month', '==', 'October'),
          orderBy('timestamp', 'asc')
        );
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setRecordings(items);
      } catch (err) {
        console.error('Error fetching October recordings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOctoberVideos();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 font-serif">
            WEEK TO WOW PROGRAMME — OCTOBER
          </h1>
        </div>
      </header>

      <main className="flex-grow px-6 py-10 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <img src={beeWaiting} alt="Loading Bee" className="w-32 h-32 animate-bounce mb-4" />
            <p className="text-gray-600 text-lg">The Bee is loading your lessons!! please wait...</p>
          </div>
        ) : recordings.length === 0 ? (
          <p className="text-center text-gray-600">No recordings found for October.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recordings.map((rec) => (
              <div key={rec.id} className="bg-white rounded shadow-md overflow-hidden flex flex-col">
                <img src={rec.thumbnail} alt={rec.title} className="w-full h-40 object-cover" />
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

export default October;
