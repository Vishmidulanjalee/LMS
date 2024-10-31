import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

const institutions = [
  'SVAITHA Institute',
  'SYASA Institute',
  'The BEE Academy',
  'OMNI Institute',
  'My Online School',
];
const TeacherNotes = () => {
  const [notesList, setNotesList] = useState([]);
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [institution, setInstitution] = useState('');
 

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
    
      try {
        const querySnapshot = await getDocs(collection(db, 'notes'));
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
    if (!title || !grade || !file || !institution) {
      alert('Please fill all fields and upload a file');
      return;
    }

    try {
      const fileRef = ref(storage, `Notes/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(fileRef);

      const newNote = { title,
        grade,
        institution,
        fileURL,
        createdAt: new Date().toISOString(), };

      const docRef = await addDoc(collection(db, 'notes'), newNote);
      setNotesList([...notesList, { ...newNote, id: docRef.id }]);
      setTitle('');
      setGrade('');
      setInstitution('');
      setFile(null);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleDeleteNote = async (id, fileURL) => {
    try {
      await deleteDoc(doc(db, 'notes', id));

      if (fileURL) {
        const fileRef = ref(storage, fileURL);
        await deleteObject(fileRef);
      }

      setNotesList(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const notesByInstitutionAndGrade = notesList.reduce((acc, note) => {
    const { institution, grade } = note;
    if (!acc[institution]) acc[institution] = {};
    if (!acc[institution][grade]) acc[institution][grade] = [];
    acc[institution][grade].push(note);
    return acc;
  }, {});


  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-10">
      <header className="mb-10">
        <h2 className="text-gray-800 text-2xl mb-2">Teacher's Notes</h2>
      </header>

      <form onSubmit={handleAddNote} className="mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
        />
        <input
          type="text"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="Grade"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
        />
        <select
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
        >
          <option value="">Select Institution</option>
          {institutions.map(inst => (
            <option key={inst} value={inst}>{inst}</option>
          ))}
        </select>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-500 mb-4"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md" > 
       
          Add Note
        </button>
      </form>

     {/* Render notes by institution and grade */}
     {Object.entries(notesByInstitutionAndGrade).map(([institution, grades]) => (
        <div key={institution} className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Institution: {institution}</h3>
          {Object.entries(grades).map(([grade, notes]) => (
            <div key={grade} className="mb-4">
              <h4 className="text-xl font-semibold mb-2">Grade: {grade}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map(note => (
                  <div className="bg-white p-5 rounded-lg shadow-md flex flex-col" key={note.id}>
                    <h5 className="text-lg font-bold">{note.title}</h5>
                    <p className="text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</p>
                       {/* Delete Button */}
                <button
                  onClick={() => handleDeleteNote(note.id, note.fileURL)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded mb-2 mt-5"
                >
                  Delete
                </button>
                {/* View File Link */}
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
      ))}
    </div>
      ))}
      </div>

  );
};

export default TeacherNotes;
