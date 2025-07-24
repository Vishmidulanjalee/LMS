import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const AdminUpload = () => {
  const [section, setSection] = useState('papers');
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null); // for papers
  const [thumbnail, setThumbnail] = useState(null); // for lessons
  const [youtubeURL, setYoutubeURL] = useState(''); // for lessons
  const [uploads, setUploads] = useState([]);
  const [editId, setEditId] = useState(null);

  const paperOptions = ['Past Papers', 'Provincial Papers', 'Model Papers'];
  const lessonOptions = ['Essays', 'Seminar'];

  const fetchUploads = async () => {
    const querySnapshot = await getDocs(collection(db, 'uploads'));
    const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUploads(docs);
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let fileURL = '';
    let thumbURL = '';

    // Upload PDF file if section is papers
    if (section === 'papers' && file) {
      const fileRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      fileURL = await getDownloadURL(fileRef);
    }

    // Upload thumbnail if section is lessons
    if (section === 'lessons' && thumbnail) {
      const thumbRef = ref(storage, `thumbnails/${Date.now()}_${thumbnail.name}`);
      await uploadBytes(thumbRef, thumbnail);
      thumbURL = await getDownloadURL(thumbRef);
    }

    const data = {
      section,
      type,
      title,
      description,
      timestamp: Date.now(),
    };

    if (section === 'papers') {
      data.fileName = file?.name || '';
      data.fileURL = fileURL;
    } else if (section === 'lessons') {
      data.youtubeURL = youtubeURL;
      data.thumbnailURL = thumbURL;
    }

    if (editId) {
      const docRef = doc(db, 'uploads', editId);
      await updateDoc(docRef, data);
      setEditId(null);
    } else {
      await addDoc(collection(db, 'uploads'), data);
    }

    // Reset
    setSection('papers');
    setType('');
    setTitle('');
    setDescription('');
    setFile(null);
    setThumbnail(null);
    setYoutubeURL('');
    fetchUploads();
  };

  const handleDelete = async (upload) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteDoc(doc(db, 'uploads', upload.id));
      if (upload.fileURL) {
        const fileRef = ref(storage, upload.fileURL);
        deleteObject(fileRef).catch(() => {});
      }
      if (upload.thumbnailURL) {
        const thumbRef = ref(storage, upload.thumbnailURL);
        deleteObject(thumbRef).catch(() => {});
      }
      fetchUploads();
    }
  };

  const handleEdit = (upload) => {
    setEditId(upload.id);
    setSection(upload.section);
    setType(upload.type);
    setTitle(upload.title);
    setDescription(upload.description);
    setYoutubeURL(upload.youtubeURL || '');
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-yellow-700">
        {editId ? 'Edit Content' : 'Upload New Content'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium mb-1">Section</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="papers">Papers</option>
            <option value="lessons">Lessons</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Select Type --</option>
            {(section === 'papers' ? paperOptions : lessonOptions).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {section === 'papers' && (
          <div>
            <label className="block font-medium mb-1">Upload PDF File</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full"
            />
          </div>
        )}

        {section === 'lessons' && (
          <>
            <div>
              <label className="block font-medium mb-1">YouTube Video URL</label>
              <input
                type="url"
                value={youtubeURL}
                onChange={(e) => setYoutubeURL(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Upload Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="block w-full"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          {editId ? 'Update' : 'Upload'}
        </button>
      </form>

      {/* View Table */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Uploaded Content</h3>
        <table className="w-full border text-sm">
          <thead className="bg-yellow-100">
            <tr>
              <th className="border px-3 py-2">Type</th>
              <th className="border px-3 py-2">Title</th>
              <th className="border px-3 py-2">Preview</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <tr key={upload.id} className="text-center">
                <td className="border px-3 py-2">{upload.type}</td>
                <td className="border px-3 py-2">{upload.title}</td>
                <td className="border px-3 py-2">
                  {upload.fileURL && (
                    <a href={upload.fileURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">PDF</a>
                  )}
                  {upload.youtubeURL && (
                    <a href={upload.youtubeURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">YouTube</a>
                  )}
                </td>
                <td className="border px-3 py-2">
                  <button onClick={() => handleEdit(upload)} className="text-yellow-600 font-medium mr-2">Edit</button>
                  <button onClick={() => handleDelete(upload)} className="text-red-600 font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUpload;
