import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
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
import Footer from '../Footer';

const UploadMarks = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('');
  const [marksByMonth, setMarksByMonth] = useState({});

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchMarks = async () => {
    const q = query(collection(db, 'marksheets'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const grouped = {};
    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      const id = docSnap.id;
      const m = data.month || 'Uncategorized';
      if (!grouped[m]) grouped[m] = [];
      grouped[m].push({ id, ...data });
    });
    setMarksByMonth(grouped);
  };

  useEffect(() => {
    fetchMarks();
  }, []);

  const handlePDFUpload = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile || !month || !title) {
      alert('Please fill all fields: Title, Month, and PDF file.');
      return;
    }

    try {
      const fileRef = ref(storage, `marksheets/${Date.now()}_${pdfFile.name}`);
      await uploadBytes(fileRef, pdfFile);
      const downloadURL = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'marksheets'), {
        title,
        fileName: pdfFile.name,
        fileUrl: downloadURL,
        filePath: fileRef.fullPath,
        month,
        timestamp: Timestamp.now(),
      });

      setPdfFile(null);
      setMonth('');
      setTitle('');
      fetchMarks();
      alert('Marks PDF uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    }
  };

  const handleDelete = async (id, filePath) => {
    const confirm = window.confirm('Are you sure you want to delete this PDF?');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'marksheets', id));
      await deleteObject(ref(storage, filePath));
      fetchMarks();
    } catch (err) {
      console.error(err);
      alert('Failed to delete PDF.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Upload Marks PDF</h1>
        </div>
      </header>

<main className="flex-grow p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
  {/* Upload Form - slightly left aligned */}
  <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-5/12 xl:w-1/3">
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="text-gray-700 font-medium">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title (e.g. June - Week 1)"
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

      <label className="text-gray-700 font-medium">Select Month</label>
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border border-gray-300 rounded p-2"
        required
      >
        <option value="">Select Month</option>
        {months.map((m, i) => (
          <option key={i} value={m}>{m}</option>
        ))}
      </select>

      <button type="submit" className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
        Upload
      </button>
    </form>
  </div>

  {/* PDF Grid Section */}
  <div className="flex-1">
    <h2 className="text-xl font-semibold mb-4">Uploaded Mark Sheets</h2>
    {Object.entries(marksByMonth).map(([m, files], idx) => (
      <div key={idx} className="mb-6">
        <h3 className="text-lg font-semibold text-yellow-600 mb-2">{m}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map(file => (
            <div key={file.id} className="bg-white rounded shadow-md p-4">
              <h4 className="font-semibold text-gray-800">{file.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{file.fileName}</p>
              <div className="w-full h-50 mb-2 border">
                <iframe
                  src={file.fileUrl}
                  title={file.title}
                  width="100%"
                  height="100%"
                  className="rounded"
                />
              </div>
              <div className="flex justify-between items-center">
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

export default UploadMarks;
