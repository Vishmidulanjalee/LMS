import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const SpokenEnglishAdmin = () => {
  const [tab, setTab] = useState('recordings');
  const [items, setItems] = useState([]);

  // Form state
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeURL, setYoutubeURL] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => {
    const snap = await getDocs(query(collection(db, 'spokenContent'), orderBy('timestamp', 'desc')));
    setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setYoutubeURL('');
    setThumbnail(null);
    setPdfFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const data = {
        type: tab === 'recordings' ? 'recording' : 'material',
        title,
        description,
        timestamp: Date.now(),
      };

      if (tab === 'recordings') {
        data.youtubeURL = youtubeURL;
        if (thumbnail) {
          const thumbRef = ref(storage, `spoken/thumbnails/${Date.now()}_${thumbnail.name}`);
          await uploadBytes(thumbRef, thumbnail);
          data.thumbnailURL = await getDownloadURL(thumbRef);
        }
      } else {
        if (pdfFile) {
          const fileRef = ref(storage, `spoken/materials/${Date.now()}_${pdfFile.name}`);
          await uploadBytes(fileRef, pdfFile);
          data.fileURL = await getDownloadURL(fileRef);
          data.fileName = pdfFile.name;
        }
      }

      if (editId) {
        await updateDoc(doc(db, 'spokenContent', editId), data);
      } else {
        await addDoc(collection(db, 'spokenContent'), data);
      }

      resetForm();
      fetchItems();
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setTitle(item.title || '');
    setDescription(item.description || '');
    setYoutubeURL(item.youtubeURL || '');
    setTab(item.type === 'recording' ? 'recordings' : 'materials');
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Delete this item?')) return;
    await deleteDoc(doc(db, 'spokenContent', item.id));
    if (item.thumbnailURL) deleteObject(ref(storage, item.thumbnailURL)).catch(() => {});
    if (item.fileURL) deleteObject(ref(storage, item.fileURL)).catch(() => {});
    fetchItems();
  };

  const displayed = items.filter(i => i.type === (tab === 'recordings' ? 'recording' : 'material'));

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 pb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Spoken English — Content Manager</h2>
        <p className="text-sm text-gray-500 mt-1">Upload and manage recordings and support materials for spoken students.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 mb-6">
        <button
          onClick={() => { setTab('recordings'); resetForm(); }}
          className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition ${
            tab === 'recordings' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Recordings
        </button>
        <button
          onClick={() => { setTab('materials'); resetForm(); }}
          className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition ${
            tab === 'materials' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Support Materials (PDFs)
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          {editId ? 'Edit' : 'Add'} {tab === 'recordings' ? 'Recording' : 'Support Material'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder={tab === 'recordings' ? 'e.g. Pronunciation Drills — Session 1' : 'e.g. Speaking Guide Booklet'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows="2"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Optional short description"
            />
          </div>

          {tab === 'recordings' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                <input
                  type="url"
                  required={!editId}
                  value={youtubeURL}
                  onChange={e => setYoutubeURL(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setThumbnail(e.target.files[0])}
                  className="block w-full text-sm text-gray-500"
                />
              </div>
            </>
          )}

          {tab === 'materials' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PDF File {editId ? '(leave blank to keep existing)' : ''}</label>
              <input
                type="file"
                accept="application/pdf"
                required={!editId}
                onChange={e => setPdfFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500"
              />
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={uploading}
              className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition disabled:opacity-60"
            >
              {uploading ? 'Uploading...' : editId ? 'Update' : 'Upload'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Uploaded Items Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            Uploaded {tab === 'recordings' ? 'Recordings' : 'Materials'}
            <span className="ml-2 text-xs font-normal text-gray-400">({displayed.length})</span>
          </h3>
        </div>
        {displayed.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-10">Nothing uploaded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Link</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayed.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{item.description || '—'}</td>
                  <td className="px-4 py-3">
                    {item.youtubeURL && (
                      <a href={item.youtubeURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">YouTube</a>
                    )}
                    {item.fileURL && (
                      <a href={item.fileURL} target="_blank" rel="noopener noreferrer" className="text-red-600 underline text-xs">PDF</a>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <button onClick={() => handleEdit(item)} className="text-yellow-600 font-medium hover:underline">Edit</button>
                    <button onClick={() => handleDelete(item)} className="text-red-600 font-medium hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SpokenEnglishAdmin;
