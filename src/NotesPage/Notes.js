import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Sidebar from '../Sidebar'; // Import the Sidebar component
import { Eye, Download } from 'lucide-react';

const Notes = () => {
  const [notesByInstitution, setNotesByInstitution] = useState({});

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'notes'));
        const notesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Group notes by institution
        const groupedNotes = notesData.reduce((acc, note) => {
          const institution = note.institution || 'Unknown Institution';
          if (!acc[institution]) acc[institution] = [];
          acc[institution].push(note);
          return acc;
        }, {});
        
        setNotesByInstitution(groupedNotes);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  return (
     <div className="flex h-screen bg-gray-50">
      <Sidebar/>

      <main className="flex-1 overflow-y-auto p-6">
        <header className="mb-12 mx-8">
          <h2 className="text-2xl font-semibold text-gray-600">Grade 6</h2>
          <h1 className="text-4xl font-bold text-gray-800">Notes</h1>
        </header>

        {Object.entries(notesByInstitution).map(([institution, notes]) => (
          <section key={institution} className="mb-12 mx-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">{institution}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div key={note.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-1">{note.title}</h3>
                    <p className="text-sm text-gray-500 mb-8">
                      {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Date Not Available'}
                    </p>
                    <div className="flex justify-between items-center">
                      <a
                        href={note.fileURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-primary px-3 py-2 rounded-md text-white "
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        View
                      </a>
                      <a
                        href={note.fileURL}
                        download
                        className="flex items-center bg-primary px-3 py-2 rounded-md text-white "
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default Notes;
