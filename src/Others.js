import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Footer from './Footer';

const Other = () => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const fetchDocs = async () => {
      const q = query(collection(db, 'documents'), where('category', '==', 'Other'));
      const snapshot = await getDocs(q);
      setDocs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchDocs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">🗂️ Other Documents</h1>
      </header>
      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {docs.map(file => (
          <div key={file.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-gray-800 mb-1">{file.title}</h3>
            <a
              href={file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm"
            >
              View PDF
            </a>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default Other;
