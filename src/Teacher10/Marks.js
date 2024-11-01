import React, { useState, useEffect } from 'react';
import { db, storage } from "../firebase"; // Import Firebase config
import { collection, addDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { FaTrash } from 'react-icons/fa';

const TeacherMarks10 = () => {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [marksData, setMarksData] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fetch marks data
  useEffect(() => {
    const fetchMarks = async () => {
      const marksCollection = collection(db, "marks10"); // Updated collection for Grade 10
      const marksSnapshot = await getDocs(marksCollection);
      const marksList = marksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMarksData(marksList);
    };

    fetchMarks();
  }, []);

  // Handle file input
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fileName || !file) {
      alert("Please enter the exam number and select a file.");
      return;
    }

    setUploading(true);

    try {
      const fileRef = ref(storage, `marks10/${file.name}`); // Updated storage path for Grade 10
      await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(fileRef);

      const docRef = await addDoc(collection(db, "marks10"), { // Updated collection name for Grade 10
        fileName,
        fileURL,
        uploadedAt: new Date()
      });

      setMarksData(prevData => [...prevData, { id: docRef.id, fileName, fileURL }]);
      alert("Marks uploaded successfully!");
      setFileName("");
      setFile(null);
    } catch (error) {
      console.error("Error uploading marks:", error);
      alert("Failed to upload marks. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id, fileURL) => {
    try {
      console.log("Deleting document with ID:", id); // Debugging log
      // Delete document from Firestore
      await deleteDoc(doc(db, "marks10", id)); // Corrected collection name

      // Delete file from Firebase Storage
      const fileRef = ref(storage, fileURL);
      await deleteObject(fileRef);

      // Update local state
      setMarksData(prevData => prevData.filter(mark => mark.id !== id));
      alert("Marks deleted successfully!");
    } catch (error) {
      console.error("Error deleting marks:", error);
      alert("Failed to delete marks. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Upload Marks - Grade 10</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Exam Title:</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded"
            placeholder="Enter exam name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Upload PDF or Image:</label>
          <input
            type="file"
            accept=".pdf, image/*"
            onChange={handleFileChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className={`mt-4 px-4 py-2 bg-yellow-500 text-white rounded ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Marks"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Uploaded Marks</h3>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">File Name</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">File</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {marksData.map((mark) => (
              <tr key={mark.id} className="hover:bg-gray-100 transition duration-200">
                <td className="py-4 px-4 border-b border-gray-300">{mark.fileName}</td>
                <td className="py-4 px-4 border-b border-gray-300">
                  <a href={mark.fileURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View File
                  </a>
                </td>
                <td className="py-4 px-4 border-b border-gray-300">
                  <button
                    onClick={() => handleDelete(mark.id, mark.fileURL)}
                    className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherMarks10;
