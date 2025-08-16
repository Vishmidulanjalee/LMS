import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { AiFillDelete } from 'react-icons/ai';
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import Footer from './Footer';

const UploadRecordings = () => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [month, setMonth] = useState('');
  const [recordType, setRecordType] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [recordingsByGroup, setRecordingsByGroup] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const recordTypes = ['Paper Mint Records', 'A පාර Records', 'Tute Class Records'];

  const fetchRecordings = async () => {
    const q = query(collection(db, 'recordings'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const grouped = {};
    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      const id = docSnap.id;
      const type = data.type || 'Unknown Type';
      const m = data.month || 'Unknown Month';
      const key = `${type} - ${m}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push({ id, ...data });
    });
    setRecordingsByGroup(grouped);
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnail(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !link || !thumbnail || !month || !recordType) {
      alert("All fields are required.");
      return;
    }

    try {
      await addDoc(collection(db, 'recordings'), {
        title,
        link,
        thumbnail,
        month,
        type: recordType,
        timestamp: Timestamp.now()
      });
      alert("Recording uploaded successfully!");
      setTitle('');
      setLink('');
      setMonth('');
      setRecordType('');
      setThumbnail(null);
      fetchRecordings();
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Upload failed.");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this recording?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'recordings', id));
      fetchRecordings();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete recording.");
    }
  };

  // Start editing the title of the selected recording
  const startEdit = (rec) => {
    setEditingId(rec.id);
    setEditingTitle(rec.title || '');
  };

  const saveEdit = async () => {
    if (!editingTitle.trim()) return alert('Title cannot be empty.');
    try {
      await updateDoc(doc(db, 'recordings', editingId), { title: editingTitle.trim() });
      setEditingId(null); setEditingTitle(''); fetchRecordings();
    } catch (err) {
      console.error(err); alert('Failed to update title.');
    }
  };

  const cancelEdit = () => { setEditingId(null); setEditingTitle(''); };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Upload Class Recordings</h1>
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
              className="border border-gray-300 rounded p-2"
              placeholder="Enter video title"
              required
            />

            <label className="text-gray-700 font-medium">YouTube Link</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="border border-gray-300 rounded p-2"
              placeholder="https://youtube.com/..."
              required
            />

            <label className="text-gray-700 font-medium">Record Type</label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="border border-gray-300 rounded p-2"
              required
            >
              <option value="">Select Type</option>
              {recordTypes.map((type, i) => (
                <option key={i} value={type}>{type}</option>
              ))}
            </select>

            <label className="text-gray-700 font-medium">Month</label>
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

            <label className="text-gray-700 font-medium">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="mb-2"
            />

            <button type="submit" className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
              Upload
            </button>
          </form>
        </div>

        {/* Uploaded recordings grouped by type and month */}
        <div className="lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Uploaded Recordings</h2>
          {Object.entries(recordingsByGroup).map(([groupKey, videos], idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-lg font-semibold text-yellow-600 mb-2">{groupKey}</h3>
              <div className="space-y-4">
                {videos.map((rec) => (
                  <div key={rec.id} className="bg-white rounded shadow p-4 flex justify-between items-center">
                    <div className="flex-1">
                      {editingId === rec.id ? (
                        <input
                          className="border border-gray-300 rounded p-2 w-full"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                      )}
                      <a
                        href={rec.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm break-all"
                      >
                        {rec.link}
                      </a>
                    </div>

                    {editingId === rec.id ? (
                      <div className="flex items-center gap-2">
                        <button onClick={saveEdit} className="px-3 py-1 rounded bg-green-600 text-white">Save</button>
                        <button onClick={cancelEdit} className="px-3 py-1 rounded bg-gray-300">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => startEdit(rec)}
                          className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                          title="Edit title"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id)}
                          className="text-red-700 hover:text-red-800 text-2xl"
                          title="Delete"
                        >
                          <AiFillDelete />
                        </button>
                      </div>
                    )}
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

export default UploadRecordings;
