import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Sidebar from '../Sidebar'; // Import the Sidebar component
import './NotesPage.css';

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
    <div className="notes-page-container">
      <Sidebar /> {/* Add Sidebar component here */}

      <main className="main-content">
        <header className="header">
          <h2>Grade 6</h2>
          <h1>Notes</h1>
        </header>

        {Object.entries(notesByInstitution).map(([institution, notes]) => (
          <section key={institution} className="institution-section">
            <h3>{institution}</h3>
            <div className="notes-grid">
              {notes.map((note) => (
                <div className="note-card" key={note.id}>
                  <h3>{note.title}</h3>
                  <p>{note.createdAt ? new Date().toISOString() : 'Date Not Available'}</p>

                  <div className="card-icons">
                    <a href={note.fileURL} target="_blank" rel="noopener noreferrer" className="view-icon">View</a>
                    <a href={note.fileURL} download className="download-icon">Download</a>
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
