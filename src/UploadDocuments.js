import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { AiFillDelete } from 'react-icons/ai';
import Footer from './Footer';

const UploadDocument = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [docsByCategory, setDocsByCategory] = useState({});
  const [loading, setLoading] = useState(false);  // Added loading state

  const categories = [
    'Paper Mint Papers',
    'A පාර Papers',
    'Tutes',
    'Other',
  ];

  const fetchDocuments = async () => {
    const q = query(collection(db, 'documents'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const grouped = {};

    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      const id = docSnap.id;
      const cat = data.category || 'Uncategorized';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({ id, ...data });
    });

    setDocsByCategory(grouped);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handlePDFUpload = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile || !category || !title) {
      alert('Please provide all fields.');
      return;
    }

    try {
      setLoading(true);  // Set loading to true before starting upload
      const fileRef = ref(storage, `documents/${Date.now()}_${pdfFile.name}`);
      await uploadBytes(fileRef, pdfFile);
      const downloadURL = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'documents'), {
        fileName: pdfFile.name,
        fileUrl: downloadURL,
        filePath: fileRef.fullPath,
        title,
        category,
        timestamp: Timestamp.now(),
      });

      setPdfFile(null);
      setTitle('');
      setCategory('');
      fetchDocuments();
      setLoading(false);  // Set loading to false after the upload is complete
      alert('Document uploaded successfully!');
    } catch (err) {
      setLoading(false);  // Set loading to false if upload fails
      console.error(err);
      alert('Upload failed.');
    }
  };

  const handleDelete = async (id, filePath) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await deleteDoc(doc(db, 'documents', id));
      await deleteObject(ref(storage, filePath));
      fetchDocuments();
    } catch (err) {
      console.error(err);
      alert('Failed to delete document.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Upload Document</h1>
        </div>
      </header>

      <main className="flex-grow p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Upload Form */}
        <div className="bg-white shadow-md rounded-lg p-6 lg:w-1/2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="text-gray-700 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Paper Mint Week 1"
              className="border border-gray-300 rounded p-2"
              required
            />

            <label className="text-gray-700 font-medium">Select PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePDFUpload}
              required
            />

            <label className="text-gray-700 font-medium">Select Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded p-2"
              required
            >
              <option value="">Select Category</option>
              {categories.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
              disabled={loading} // Disable button when uploading
            >
              {loading ? (
                <span className="animate-spin inline-block w-5 h-5 border-4 border-t-4 border-yellow-600 rounded-full"></span> // Loading spinner
              ) : (
                'Upload'
              )}
            </button>
          </form>
        </div>

        {/* Uploaded PDFs */}
        <div className="lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
          {Object.entries(docsByCategory).map(([cat, files], idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-lg font-semibold text-yellow-600 mb-2">{cat}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {files.map(file => (
                  <div
                    key={file.id}
                    className="bg-white rounded shadow-md p-4 flex flex-col items-start"
                  >
                    <h4 className="font-semibold text-gray-800">{file.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{file.fileName}</p>

                    <iframe
                      src={file.fileUrl}
                      width="100%"
                      height="200"
                      className="mb-2 border"
                      title={file.title}
                    ></iframe>

                    <div className="flex justify-between w-full">
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        View Full PDF
                      </a>
                      <button
                        onClick={() => handleDelete(file.id, file.filePath)}
                        className="text-red-700 hover:text-red-800 text-xl"
                        title="Delete"
                      >
                        <AiFillDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UploadDocument;
