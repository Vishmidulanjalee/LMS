import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import Footer from '../Footer';

const JulyMarks = () => {
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    const fetchJulyMarks = async () => {
      try {
        const q = query(
          collection(db, 'marksheets'),
          where('month', '==', 'July'),
        
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMarks(data);
      } catch (error) {
        console.error('Error fetching July mark sheets:', error);
      }
    };

    fetchJulyMarks();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 font-serif">Mark Sheets - July</h1>
        </div>
      </header>

      <main className="flex-grow px-6 py-10 max-w-7xl mx-auto">
        {marks.length === 0 ? (
          <p className="text-center text-gray-600">No mark sheets found for July.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marks.map((mark) => (
              <div
                key={mark.id}
                className="bg-white rounded shadow-md p-4 flex flex-col"
              >
                <h3 className="text-lg font-semibold text-gray-800">{mark.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{mark.fileName}</p>
                <div className="flex-grow mb-2">
                  <iframe
                    src={mark.fileUrl}
                    title={mark.fileName}
                    className="w-full h-50 border rounded"
                  />
                </div>
                <a
                  href={mark.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm"
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

export default JulyMarks;
