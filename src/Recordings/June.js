import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import Footer from '../Footer';
import beeWaiting from '../assets/beewaiting.png'; // 🐝 Add your bee vector here

const June = () => {
  const [groupedRecordings, setGroupedRecordings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJuneVideos = async () => {
      try {
        const q = query(
          collection(db, 'recordings'),
          where('month', '==', 'June'),
          orderBy('timestamp', 'asc')
        );

        const snapshot = await getDocs(q);
        const grouped = {};
        snapshot.docs.forEach(docSnap => {
          const data = docSnap.data();
          const id = docSnap.id;
          const type = data.type || 'Unknown Type';
          if (!grouped[type]) grouped[type] = [];
          grouped[type].push({ id, ...data });
        });
        setGroupedRecordings(grouped);
      } catch (error) {
        console.error('Error fetching June recordings:', error);
      } finally {
        setLoading(false);
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
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <img
              src={beeWaiting}
              alt="Loading Bee"
              className="w-32 h-32 animate-bounce mb-4"
            />
            <p className="text-gray-600 text-lg">The Bee is loading your lessons!! please wait...</p>
          </div>
        ) : Object.keys(groupedRecordings).length === 0 ? (
          <p className="text-center text-gray-600">No recordings found for June.</p>
        ) : (
          Object.entries(groupedRecordings).map(([type, recs], idx) => (
            <div key={idx} className="mb-10">
              <h2 className="text-xl font-bold mb-4 text-yellow-600">{type}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recs.map((rec) => (
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
            </div>
          ))
        )}
      </main>

      <Footer />
    </div>
  );
};

export default June;
