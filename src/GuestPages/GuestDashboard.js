import { useEffect, useState } from 'react';
import Footer from '../Footer';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const MicIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
  </svg>
);

const PlayIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.868v4.264a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
  </svg>
);

const PdfIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const getYouTubeThumbnail = (url) => {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};

const SpokenEnglishDashboard = () => {
  const [recordings, setRecordings] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recordings');

  const today = new Date();
  const currentDate = today.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'spokenContent'), orderBy('timestamp', 'desc')));
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setRecordings(all.filter(d => d.type === 'recording'));
        setMaterials(all.filter(d => d.type === 'material'));
      } catch (err) {
        console.error('Failed to fetch spoken content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 rounded-xl">
              <MicIcon />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Spoken English</h1>
              <p className="text-sm text-gray-500">{currentDate}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/StudentTypeSelection'}
            className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg transition"
          >
            ← Back
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-0 border-t border-gray-100">
          <button
            onClick={() => setActiveTab('recordings')}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'recordings'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="flex items-center gap-2"><PlayIcon /> Recordings</span>
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'materials'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="flex items-center gap-2"><PdfIcon /> Support Materials</span>
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-gray-400 text-sm">Loading...</div>
          ) : activeTab === 'recordings' ? (
            recordings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
                <PlayIcon />
                <p className="text-sm">No recordings uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recordings.map(rec => {
                  const thumb = rec.thumbnailURL || getYouTubeThumbnail(rec.youtubeURL);
                  return (
                    <a
                      key={rec.id}
                      href={rec.youtubeURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
                    >
                      {thumb ? (
                        <img src={thumb} alt={rec.title} className="w-full h-44 object-cover" />
                      ) : (
                        <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-400">
                          <PlayIcon />
                        </div>
                      )}
                      <div className="p-4 flex flex-col gap-1 flex-grow">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Recording</span>
                        <h3 className="font-semibold text-gray-900 text-base leading-snug">{rec.title}</h3>
                        {rec.description && (
                          <p className="text-sm text-gray-500 line-clamp-2">{rec.description}</p>
                        )}
                        <div className="mt-auto pt-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gray-900 px-3 py-1.5 rounded-lg">
                            <PlayIcon /> Watch Now
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )
          ) : (
            materials.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
                <PdfIcon />
                <p className="text-sm">No support materials uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map(mat => (
                  <div
                    key={mat.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-50 rounded-lg text-red-500 shrink-0">
                        <PdfIcon />
                      </div>
                      <div className="flex-grow min-w-0">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">PDF</span>
                        <h3 className="font-semibold text-gray-900 text-base leading-snug">{mat.title}</h3>
                        {mat.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{mat.description}</p>
                        )}
                      </div>
                    </div>
                    <a
                      href={mat.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition self-start mt-auto"
                    >
                      <DownloadIcon /> Open PDF
                    </a>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </main>

      <footer className="w-full bg-white border-t">
        <Footer />
      </footer>
    </div>
  );
};

export default SpokenEnglishDashboard;
