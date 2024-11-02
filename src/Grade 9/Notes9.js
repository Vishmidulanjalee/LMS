import React, { useEffect, useState } from 'react';
import { collection,onSnapshot, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import Sidebar from '../Sidebar9'; // Import the Sidebar component
import { Eye, Download } from 'lucide-react';

const Grade9Notes = () => {
  const [notesByInstitution, setNotesByInstitution] = useState({});

  /*useEffect(() => {
    const fetchNotes = async () => {
      try {
        // Query to fetch notes only for Grade 9
        const q = query(collection(db, 'notes9'), where('grade', '==', 9));
        const querySnapshot = await getDocs(q);
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
  }, []);*/

  const groupedNotesByInstitution = (notesData) => {
    return notesData.reduce((acc, note) => {
      const institution = note.institution || 'Unknown Institution';
      if (!acc[institution]) acc[institution] = [];
      acc[institution].push(note);
      return acc;
    }, {});
  };
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'notes9'), (querySnapshot) => {
          const notesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotesByInstitution(groupedNotesByInstitution(notesData));
        });
      
        return () => unsubscribe(); // Cleanup on component unmount
      }, []);
      

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem="Notes" />

      <main className="flex-1 overflow-y-auto p-6">
        <header className="mb-12 mx-8">
          <h2 className="text-3xl font-bold text-black"> Notes -Grade 9</h2>
          
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

export default Grade9Notes;
