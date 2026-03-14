import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import Footer from '../Footer';
import beeWaiting from '../assets/beewaiting.png';

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const VideoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <path d="M16 10l6-4v12l-6-4V10z" />
  </svg>
);
const PlayIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>
);

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Playfair+Display:wght@600;700&display=swap');
  * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }
  .rec-card {
    background: #fff; border-radius: 16px; overflow: hidden;
    border: 1.5px solid #E5E7EB; display: flex; flex-direction: column;
    transition: transform 0.26s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.26s ease, border-color 0.26s ease;
  }
  .rec-card:hover { transform: translateY(-6px); box-shadow: 0 18px 44px rgba(245,158,11,0.18); border-color: #F59E0B; }
  .rec-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    width: 100%; padding: 10px 16px; border-radius: 9px;
    font-weight: 600; font-size: 13px; border: none; cursor: pointer; text-decoration: none;
    color: white; background: linear-gradient(135deg, #F59E0B, #D97706);
    transition: filter 0.2s, transform 0.15s;
  }
  .rec-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
  .rec-btn:active { transform: translateY(0); }
  .rec-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 18px; }
  @media (max-width: 580px) { .rec-grid { grid-template-columns: 1fr; } }
  @keyframes beeBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
`;

const October = () => {
  const navigate = useNavigate();
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const q = query(collection(db, 'recordings'), where('month', '==', 'October'), orderBy('timestamp', 'asc'));
        const snap = await getDocs(q);
        setRecordings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Error fetching October recordings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
      <style>{STYLES}</style>

      <header style={{ background: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ height: 4, background: 'linear-gradient(90deg, #FBBF24, #F59E0B, #D97706)' }} />
        <div style={{ padding: '15px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1280, margin: '0 auto', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <button
              onClick={() => navigate('/WatchVideosFolder')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: 'white', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: '#374151' }}
            >
              <BackIcon /> Back
            </button>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #FBBF24, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(245,158,11,0.36)' }}>
              <VideoIcon />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>
                Recordings — October
              </h1>
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: '2px 0 0', fontWeight: 400 }}>Class recordings for October</p>
            </div>
          </div>
          {!loading && recordings.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#111827', borderRadius: 10, padding: '9px 16px' }}>
              <VideoIcon />
              <span style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>{recordings.length} {recordings.length === 1 ? 'recording' : 'recordings'}</span>
            </div>
          )}
        </div>
      </header>

      <main style={{ flexGrow: 1, padding: '30px 32px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 16 }}>
            <img src={beeWaiting} alt="Loading" style={{ width: 120, height: 120, animation: 'beeBounce 1s ease-in-out infinite' }} />
            <p style={{ fontSize: 15, color: '#6B7280', margin: 0 }}>The Bee is loading your lessons! Please wait...</p>
          </div>
        ) : recordings.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 14 }}>
            <div style={{ width: 72, height: 72, borderRadius: 18, background: '#FEF3C7', border: '1.5px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <VideoIcon />
            </div>
            <p style={{ fontSize: 15, color: '#6B7280', margin: 0, fontWeight: 500 }}>No recordings found for October.</p>
          </div>
        ) : (
          <div className="rec-grid">
            {recordings.map(rec => (
              <div key={rec.id} className="rec-card">
                <img src={rec.thumbnail} alt={rec.title} style={{ width: '100%', height: 148, objectFit: 'cover' }} />
                <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 10 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 14.5, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.4 }}>
                    {rec.title}
                  </h3>
                  <a href={rec.link} target="_blank" rel="noopener noreferrer" className="rec-btn" style={{ marginTop: 'auto' }}>
                    <PlayIcon /> Watch on YouTube
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default October;
