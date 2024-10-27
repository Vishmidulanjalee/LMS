import React, { useState, useEffect } from 'react';
import { db, storage } from "../firebase"; // Import Firebase config
import { collection, addDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const TeacherMarks = () => {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [marksData, setMarksData] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fetch marks data
  useEffect(() => {
    const fetchMarks = async () => {
      const marksCollection = collection(db, "marks");
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
      const fileRef = ref(storage, `marks/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(fileRef);

      const docRef = await addDoc(collection(db, "marks"), {
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
      // Delete document from Firestore
      await deleteDoc(doc(db, "marks", id));

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
      <h2 className="text-3xl font-bold mb-6">Upload Marks</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Exam Name:</label>
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
          className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Marks"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Uploaded Marks</h3>
        <ul>
          {marksData.map((mark) => (
            <li key={mark.id} className="mb-4 p-4 border border-gray-300 rounded">
              <p><strong>File Name:</strong> {mark.fileName}</p>
              <p>
                <strong>File:</strong> <a href={mark.fileURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View File</a>
              </p>
              <button
                onClick={() => handleDelete(mark.id, mark.fileURL)}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeacherMarks;