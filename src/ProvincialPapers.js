import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import Footer from './Footer';

const ProvincialPapers = () => {
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'uploads'));
      const filtered = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => p.section === 'papers' && p.type === 'Provincial Papers');
      setPapers(filtered);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 font-serif">Provincial Papers</h1>
        </div>
      </header>

      <main className="flex-grow px-4 py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {papers.map(p => (
            <div key={p.id} className="bg-white shadow-md rounded-lg overflow-hidden border">
              <div className="aspect-w-1 aspect-h-1 h-48">
                {p.fileURL ? (
                  <iframe
                    src={p.fileURL + "#toolbar=0&navpanes=0"}
                    className="w-full h-full"
                    title={p.title}
                    frameBorder="0"
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                    No preview
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{p.description}</p>
                {p.fileURL && (
                  <a
                    href={p.fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-yellow-600 underline"
                  >
                    Download
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProvincialPapers;
