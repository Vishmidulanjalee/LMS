import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase'; // Firebase Firestore and Storage config

const TeacherHomework = () => {
  const [homeworkList, setHomeworkList] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch existing homework from Firestore
    const fetchHomework = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'homework'));
        const homeworkData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHomeworkList(homeworkData);
      } catch (error) {
        console.error('Error fetching homework:', error);
      }
      setLoading(false);
    };

    fetchHomework();
  }, []);

  // Function to handle adding homework
  const handleAddHomework = async (e) => {
    e.preventDefault();
    if (!title) {
      alert('Please enter a homework title');
      return;
    }
  
    try {
      let fileURL = '';
      if (file) {
        const fileRef = ref(storage, `Homework/${file.name}`);
        await uploadBytes(fileRef, file);
        fileURL = await getDownloadURL(fileRef);
      }
  
      const newHomework = {
        title,
        fileURL,
        createdAt: new Date(),
      };
  
      // Check if the document is added to Firestore
      const docRef = await addDoc(collection(db, 'homework'), newHomework);
      console.log('Document written with ID: ', docRef.id); // Log document ID
  
      setHomeworkList([...homeworkList, { ...newHomework, id: docRef.id }]);
      setTitle('');
      setFile(null);
    } catch (error) {
      console.error('Error adding homework:', error);
    }
  };
  

  // Function to handle deleting homework
  const handleDeleteHomework = async (id, fileURL) => {
    try {
      // Remove homework from Firestore
      await deleteDoc(doc(db, 'homework', id));

      // Delete file from Firebase Storage (if any)
      if (fileURL) {
        const fileRef = ref(storage, fileURL);
        await deleteObject(fileRef);
      }

      // Update the local state by removing the deleted homework
      setHomeworkList(homeworkList.filter(hw => hw.id !== id));
    } catch (error) {
      console.error('Error deleting homework:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Teacher Homework Page</h2>

      {/* Display success message */}
      {successMessage && (
        <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
      )}

      {/* Form to add new homework */}
      <form className="mb-8" onSubmit={handleAddHomework}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Homework Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter homework title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Upload File (PDF or Image)</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Add Homework
        </button>
      </form>

      {/* Display list of homework */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Homework</th>
            <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">File</th>
            <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {homeworkList.map(hw => (
            <tr key={hw.id} className="hover:bg-gray-100 transition duration-200">
              <td className="py-4 px-4 border-b border-gray-300">{hw.title}</td>
              <td className="py-4 px-4 border-b border-gray-300">
                {hw.fileURL ? (
                  <a href={hw.fileURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View File
                  </a>
                ) : (
                  'No file'
                )}
              </td>
              <td className="py-4 px-4 border-b border-gray-300">
                <button
                  onClick={() => handleDeleteHomework(hw.id, hw.fileURL)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherHomework;
