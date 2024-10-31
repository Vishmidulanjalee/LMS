import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { FaTrash } from 'react-icons/fa';

const TeacherHomework6 = () => {
  const [homeworkList, setHomeworkList] = useState([]);
  const [submissionList, setSubmissionList] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletionSuccessMessage, setDeletionSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const homeworkSnapshot = await getDocs(collection(db, 'homework6'));
        const homeworkData = homeworkSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHomeworkList(homeworkData);

        const submissionSnapshot = await getDocs(collection(db, 'studenthomework6'));
        const submissionData = submissionSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          submittedAt: doc.data().submittedAt ? doc.data().submittedAt.toDate() : null // Ensure this is correctly retrieving the timestamp
        }));
        setSubmissionList(submissionData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 2000); // Clear after 2 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [successMessage]);

  useEffect(() => {
    if (deletionSuccessMessage) {
      const timer = setTimeout(() => setDeletionSuccessMessage(''), 2000); // Clear after 2 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [deletionSuccessMessage]);

  const handleAddHomework = async (e) => {
    e.preventDefault();
    if (!title) {
      alert('Please enter a homework title');
      return;
    }

    try {
      let fileURL = '';
      setUploading(true);
      if (file) {
        const fileRef = ref(storage, `homework6/${file.name}`);
        await uploadBytes(fileRef, file);
        fileURL = await getDownloadURL(fileRef);
      }

      const newHomework = {
        title,
        fileURL,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'homework6'), newHomework);

      setHomeworkList([...homeworkList, { ...newHomework, id: docRef.id }]);
      setTitle('');
      setFile(null);
      setSuccessMessage('Homework added successfully!');
    } catch (error) {
      console.error('Error adding homework:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteHomework = async (id, fileURL) => {
    if (window.confirm('Are you sure you want to delete this homework?')) {
      try {
        console.log("Deleting homework with ID:", id); // Debugging log
  
        // Delete document from Firestore
        await deleteDoc(doc(db, 'homework6', id));
  
        // Delete file from Firebase Storage
        if (fileURL) {
          const fileRef = ref(storage, fileURL);
          await deleteObject(fileRef);
        }
  
        // Update local state
        setHomeworkList(prevHomeworkList => prevHomeworkList.filter(hw => hw.id !== id));

        setDeletionSuccessMessage('Homework deleted successfully!'); // Set the success message
      } catch (error) {
        console.error('Error deleting homework:', error);
        alert("Failed to delete homework. Please try again.");
      }
    }
  };
  

  const handleDeleteSubmission = async (id, fileURL) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await deleteDoc(doc(db, 'studenthomework6', id));

        if (fileURL) {
          const fileRef = ref(storage, `studenthomework6/${fileURL.split('/').pop()}`);
          await deleteObject(fileRef);
        }

        // Update the state to remove the deleted submission
        setSubmissionList(prevSubmissionList => prevSubmissionList.filter(sub => sub.id !== id));
        setDeletionSuccessMessage('Submission deleted successfully!'); // Set the success message
      } catch (error) {
        console.error('Error deleting submission:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Homework - Grade 6</h2>

      {successMessage && (
        <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
      )}
      {deletionSuccessMessage && (
        <div className="mb-4 text-green-600 font-semibold">{deletionSuccessMessage}</div>
      )}

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
            accept=".pdf, .jpg, .jpeg, .png"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500"
          />
        </div>

        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded-md" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Add Homework'}
        </button>
      </form>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg mb-8">
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
                  className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-3xl font-bold mb-4">Submitted Homework</h2>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Institute</th>
            <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Submitted File</th>
            <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Submission Date</th>
            <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissionList.map(sub => (
            <tr key={sub.id} className="hover:bg-gray-100 transition duration-200">
              <td className="py-4 px-4 border-b border-gray-300">{sub.name}</td>
              <td className="py-4 px-4 border-b border-gray-300">{sub.institute}</td>
              <td className="py-4 px-4 border-b border-gray-300">
                {sub.fileURL ? (
                  <a href={sub.fileURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View File
                  </a>
                ) : (
                  'No file'
                )}
              </td>
              <td className="py-4 px-4 border-b border-gray-300">{sub.submittedAt ? sub.submittedAt.toLocaleString() : 'N/A'}</td>
              <td className="py-4 px-4 border-b border-gray-300">
                <button
                  onClick={() => handleDeleteSubmission(sub.id, sub.fileURL)}
                  className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherHomework6;

