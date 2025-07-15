import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { addDoc, collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import Footer from './Footer';

const UploadVideosFolder = () => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [month, setMonth] = useState('');
  const [videosByMonth, setVideosByMonth] = useState({});

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch videos grouped by month
  useEffect(() => {
    const fetchVideos = async () => {
      const q = query(collection(db, 'recordings_folder'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const grouped = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const m = data.month;
        if (!grouped[m]) grouped[m] = [];
        grouped[m].push(data);
      });
      setVideosByMonth(grouped);
    };
    fetchVideos();
  }, []);

  // Handle thumbnail upload
  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setThumbnail(reader.result);
    reader.readAsDataURL(file);
  };

  // Handle upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !link || !thumbnail || !month) {
      alert('Please fill all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'recordings_folder'), {
        title,
        link,
        thumbnail,
        month,
        timestamp: Timestamp.now()
      });
      alert('Video uploaded!');
      setTitle('');
      setLink('');
      setThumbnail(null);
      setMonth('');

      // Refresh
      const q = query(collection(db, 'recordings_folder'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const grouped = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const m = data.month;
        if (!grouped[m]) grouped[m] = [];
        grouped[m].push(data);
      });
      setVideosByMonth(grouped);
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Upload Videos to Monthly Folder</h1>
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

        {/* Uploaded videos grouped by month */}
        <div className="lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Uploaded Videos</h2>
          {Object.keys(videosByMonth).map((m, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-lg font-semibold text-yellow-600 mb-2">{m}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videosByMonth[m].map((video, vIdx) => (
                  <div key={vIdx} className="bg-white rounded shadow-md overflow-hidden">
                    <img src={video.thumbnail} alt="Thumbnail" className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800">{video.title}</h4>
                      <a
                        href={video.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        Watch on YouTube
                      </a>
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

export default UploadVideosFolder;
