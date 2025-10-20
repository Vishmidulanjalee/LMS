import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { FaTrash } from 'react-icons/fa';

const institutions = [
    'SIYATHRA ',
    'SIYASA ',
    'The BEE Academy',
    'OMIN ',
    'ONLINE CLASS',
];

const TeacherNotesGrade7 = () => {
  const [notesList, setNotesList] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [institution, setInstitution] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'notes7'));
        const notesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotesList(notesData);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
      setLoading(false);
    };

    fetchNotes();
  }, []);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title || !file || !institution) {
      alert('Please fill all fields and upload a file');
      return;
    }

    if (isAddingNote) return;

    setIsAddingNote(true);

    try {
      const fileRef = ref(storage, `Notes/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(fileRef);

      const newNote = {
        title,
        grade: '7',
        institution,
        fileURL,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'notes7'), newNote);
      setNotesList(prevNotes => [...prevNotes, { ...newNote, id: docRef.id }]);
      resetFormFields();
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (id, fileURL) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteDoc(doc(db, 'notes7', id));

        if (fileURL) {
          const fileRef = ref(storage, fileURL);
          await deleteObject(fileRef);
        }

        setNotesList(prevNotes => prevNotes.filter(note => note.id !== id));
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const resetFormFields = () => {
    setTitle('');
    setInstitution('');
    setFile(null);
  };

  const grade7Notes = notesList.filter(note => note.grade === '7');

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }
  // Group notes by institution
  const groupedNotesByInstitution = grade7Notes.reduce((acc, note) => {
    (acc[note.institution] = acc[note.institution] || []).push(note);
     return acc;
}, {});

  return (
    <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Upload Notes - Grade 7</h2>

      <form onSubmit={handleAddNote} className="space-y-4 mb-8">
      <div>
          <label className="block text-sm font-semibold text-gray-700">Note Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded"
            placeholder="Note Title"
            required
          />
        </div>
      <div>
          <label className="block text-sm font-semibold text-gray-700">Institute:</label>
          <select
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded"
            required
          >
            <option value="">Select Institute</option>
            {institutions.map(inst => (
              <option key={inst} value={inst}>{inst}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Upload File:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
             className="mt-1 p-2 block w-full border border-gray-300 rounded"
            required
          />
        </div>
        <button type="submit" className={`bg-yellow-500 text-white px-4 py-2 rounded-md ${isAddingNote ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isAddingNote}>
          {isAddingNote ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {/* Render grade 7 notes */}
      <div className="mb-8">
        
            {Object.entries(groupedNotesByInstitution).length > 0 ? (
          Object.entries(groupedNotesByInstitution).map(([institutionName, notes]) => (
            <div key={institutionName} className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">Institution: {institutionName}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map(note => (
                  <div className="bg-white p-5 rounded-lg shadow-md flex flex-col relative" key={note.id}>
                    <h5 className="text-lg font-bold">{note.title}</h5>
                    <p className="text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</p>
              <button
                onClick={() => handleDeleteNote(note.id, note.fileURL)}
                className="text-red-500 hover:text-red-700 absolute top-2 right-2"
              >
               <FaTrash />
              </button>
              <a
                href={note.fileURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View File
              </a>
            </div>
          ))}
        </div>
      </div>
          ))
        ) : (
          <p>No notes available for Grade 7.</p>
        )}
    </div>
    </div>
  );
};

export default TeacherNotesGrade7;
