import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Footer from './Footer';

const Tutes = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchPaperMintDocs = async () => {
      try {
        const q = query(
          collection(db, 'documents'),
          where('category', '==', 'Tutes')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching Paper Mint documents:', error);
      }
    };

    fetchPaperMintDocs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 font-serif"> Tutes </h1>
        </div>
      </header>

      <main className="flex-grow px-6 py-10 max-w-7xl mx-auto">
        {documents.length === 0 ? (
          <p className="text-center text-gray-600">No Tutes uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded shadow-md p-4 flex flex-col"
              >
                <h3 className="text-lg font-semibold text-gray-800">{doc.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{doc.fileName}</p>
                <div className="flex-grow mb-2">
                  <iframe
                    src={doc.fileUrl}
                    title={doc.fileName}
                    className="w-full h-50 border rounded"
                  />
                </div>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-500 hover:underline text-sm"
                >
                  View Full PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Tutes;