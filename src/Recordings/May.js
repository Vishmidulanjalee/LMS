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
const VideoIconWhite = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="14" height="12" rx="2" /><path d="M16 10l6-4v12l-6-4V10z" />
  </svg>
);
const PlayIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>
);

/* ── Colored vector illustrations ── */
const VecWriteBright1 = () => (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
    <circle cx="27" cy="27" r="25" fill="#FFF7ED"/>
    {/* Pencil rotated */}
    <g transform="rotate(-18, 27, 27)">
      {/* Eraser */}
      <rect x="21" y="6" width="12" height="5" rx="2.5" fill="#EC4899"/>
      {/* Ferrule */}
      <rect x="21" y="10.5" width="12" height="3" fill="#E2E8F0"/>
      {/* Body */}
      <rect x="21" y="13" width="12" height="22" fill="#F97316"/>
      {/* Body sheen */}
      <rect x="21" y="13" width="4.5" height="22" fill="#FB923C" opacity="0.55"/>
      {/* Wood tip */}
      <path d="M21 35 L33 35 L27 44 Z" fill="#FEF3C7"/>
      {/* Graphite point */}
      <path d="M24.5 40 L29.5 40 L27 44 Z" fill="#78716C"/>
    </g>
    {/* 4-point star */}
    <path d="M42 9 L43.4 13 L47 9 L43.4 13 L47 17 L43.4 13 L42 17 L40.6 13 L37 9 L40.6 13 Z" fill="#FBBF24"/>
    {/* Small 4-point star */}
    <path d="M10 19 L10.8 21.5 L13 19 L10.8 21.5 L13 24 L10.8 21.5 L10 24 L9.2 21.5 L7 19 L9.2 21.5 Z" fill="#FDBA74"/>
    {/* Dots */}
    <circle cx="41" cy="36" r="2.5" fill="#FDE047"/>
    <circle cx="9" cy="37" r="1.8" fill="#FB923C"/>
    <circle cx="44" cy="26" r="1.5" fill="#FDBA74"/>
  </svg>
);

const VecWriteBright2 = () => (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
    <circle cx="27" cy="27" r="25" fill="#FDF2F8"/>
    {/* Back book shadow */}
    <path d="M15 16 C15 14 17 13 19 14 L27 16.5 L27 41 L19 38.5 C17 37.8 15 36.5 15 34 Z" fill="#FBCFE8"/>
    {/* Left page */}
    <path d="M12 17 C12 15 14 14 16 15 L26 17.5 L26 42 L16 39.5 C14 38.8 12 37.5 12 35 Z" fill="#F9A8D4"/>
    {/* Right page */}
    <path d="M42 17 C42 15 40 14 38 15 L28 17.5 L28 42 L38 39.5 C40 38.8 42 37.5 42 35 Z" fill="#FBCFE8"/>
    {/* Spine */}
    <rect x="25.5" y="17" width="3" height="25" rx="1.5" fill="#EC4899"/>
    {/* Lines left page */}
    <path d="M15.5 24 L23.5 24.5" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" opacity="0.75"/>
    <path d="M15.5 28.5 L23.5 29" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" opacity="0.75"/>
    <path d="M15.5 33 L21 33.3" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" opacity="0.75"/>
    {/* Lines right page */}
    <path d="M30.5 24.5 L38.5 24" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" opacity="0.75"/>
    <path d="M30.5 29 L38.5 28.5" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" opacity="0.75"/>
    <path d="M30.5 33.3 L36 33" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" opacity="0.75"/>
    {/* Star */}
    <path d="M44 9 L45.2 12.5 L49 9 L45.2 12.5 L49 16 L45.2 12.5 L44 16 L42.8 12.5 L39 9 L42.8 12.5 Z" fill="#F9A8D4"/>
    <circle cx="10" cy="38" r="2.2" fill="#FBCFE8"/>
    <circle cx="43" cy="38" r="1.6" fill="#F9A8D4"/>
    <circle cx="10" cy="18" r="1.5" fill="#F9A8D4"/>
  </svg>
);

const VecGrammarHammer = () => (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
    <circle cx="27" cy="27" r="25" fill="#EEF2FF"/>
    {/* Hammer handle */}
    <rect x="24.5" y="22" width="7" height="24" rx="3.5" fill="#6366F1"/>
    <rect x="25.5" y="22" width="2.5" height="24" rx="1.25" fill="#818CF8" opacity="0.45"/>
    {/* Hammer head */}
    <rect x="11" y="10" width="32" height="15" rx="4.5" fill="#6366F1"/>
    {/* Head highlight */}
    <rect x="11" y="10" width="32" height="7" rx="4.5" fill="#818CF8" opacity="0.5"/>
    {/* Head face detail */}
    <rect x="11" y="18" width="32" height="2" fill="#4338CA" opacity="0.3"/>
    {/* Impact lines left */}
    <path d="M8 32 L4 29.5" stroke="#A5B4FC" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M7.5 37 L3 37" stroke="#A5B4FC" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M9.5 41.5 L5.5 44" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round"/>
    {/* Impact lines right */}
    <path d="M46 32 L50 29.5" stroke="#A5B4FC" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M46.5 37 L51 37" stroke="#A5B4FC" strokeWidth="2.2" strokeLinecap="round"/>
    {/* Star spark */}
    <path d="M42 8 L43.2 11.5 L47 8 L43.2 11.5 L47 15 L43.2 11.5 L42 15 L40.8 11.5 L37 8 L40.8 11.5 Z" fill="#A5B4FC"/>
    <path d="M10 8 L10.8 10.5 L13 8 L10.8 10.5 L13 13 L10.8 10.5 L10 13 L9.2 10.5 L7 8 L9.2 10.5 Z" fill="#C7D2FE"/>
    <circle cx="45" cy="28" r="2.2" fill="#C7D2FE"/>
  </svg>
);

const VecPaperShaper = () => (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
    <circle cx="27" cy="27" r="25" fill="#F0FDFA"/>
    {/* Back paper */}
    <rect x="16" y="11" width="26" height="33" rx="3" fill="#99F6E4" opacity="0.7"/>
    {/* Front paper with folded corner */}
    <path d="M12 13 L36 13 L42 19 L42 45 L12 45 Z" fill="#CCFBF1"/>
    {/* Folded corner triangle */}
    <path d="M36 13 L42 19 L36 19 Z" fill="#14B8A6"/>
    {/* Fold crease line */}
    <path d="M36 13 L36 19 L42 19" stroke="#0D9488" strokeWidth="1" fill="none" opacity="0.5"/>
    {/* Paper border */}
    <path d="M12 13 L36 13 L42 19 L42 45 L12 45 Z" stroke="#14B8A6" strokeWidth="1.5" fill="none"/>
    {/* Text lines */}
    <path d="M17 25 L37 25" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    <path d="M17 30 L37 30" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    <path d="M17 35 L29 35" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    {/* Scissors icon accent */}
    <circle cx="40" cy="38" r="3.5" fill="#5EEAD4" opacity="0.5"/>
    <path d="M38.5 36.5 L41.5 39.5 M41.5 36.5 L38.5 39.5" stroke="#14B8A6" strokeWidth="1.8" strokeLinecap="round"/>
    {/* Star */}
    <path d="M10 10 L11 13 L14 10 L11 13 L14 16 L11 13 L10 16 L9 13 L6 10 L9 13 Z" fill="#5EEAD4"/>
    <circle cx="44" cy="13" r="2" fill="#99F6E4"/>
    <circle cx="8" cy="38" r="1.8" fill="#5EEAD4"/>
  </svg>
);

const FOLDERS = [
  { key: 'Write to Bright 1',  Vec: VecWriteBright1,  color: '#F97316', light: '#FFF7ED', border: '#FED7AA' },
  { key: 'Write to Bright 2',  Vec: VecWriteBright2,  color: '#EC4899', light: '#FDF2F8', border: '#FBCFE8' },
  { key: 'Grammar Hammer',     Vec: VecGrammarHammer, color: '#6366F1', light: '#EEF2FF', border: '#C7D2FE' },
  { key: 'Paper Shaper',       Vec: VecPaperShaper,   color: '#14B8A6', light: '#F0FDFA', border: '#99F6E4' },
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
  * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }

  .flip-wrap { cursor: pointer; }
  .flip-inner {
    position: relative; width: 100%; height: 220px;
    transform-style: preserve-3d;
    transition: transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1);
  }
  .flip-wrap:hover .flip-inner { transform: rotateY(180deg); }

  .flip-front, .flip-back {
    position: absolute; inset: 0; border-radius: 18px;
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
    border: 1.5px solid #E5E7EB; background: white; overflow: hidden;
  }
  .flip-back { transform: rotateY(180deg); }

  .rec-card {
    background: #fff; border-radius: 16px; overflow: hidden;
    border: 1.5px solid #E5E7EB; display: flex; flex-direction: column;
    transition: transform 0.26s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.26s ease, border-color 0.26s ease;
  }
  .rec-card:hover { transform: translateY(-6px); box-shadow: 0 18px 44px rgba(0,0,0,0.10); }
  .rec-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    width: 100%; padding: 10px 16px; border-radius: 9px; font-weight: 600; font-size: 13px;
    border: none; cursor: pointer; text-decoration: none; color: white;
    background: linear-gradient(135deg, #F59E0B, #D97706);
    transition: filter 0.2s, transform 0.15s;
  }
  .rec-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }

  .folder-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  @media (max-width: 860px)  { .folder-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } }
  @media (max-width: 540px)  { .folder-grid { grid-template-columns: 1fr; gap: 14px; } .flip-inner { height: 200px; } }

  .rec-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 18px; }
  @media (max-width: 520px) { .rec-grid { grid-template-columns: 1fr; } }

  @keyframes beeBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .fade-in { animation: fadeIn 0.28s ease forwards; }
`;

const May = () => {
  const navigate = useNavigate();
  const [groupedRecordings, setGroupedRecordings] = useState({});
  const [loading, setLoading] = useState(true);
  const [openFolder, setOpenFolder] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, 'recordings'),
          where('month', '==', 'May'),
          where('grade', '==', 'Grade 10 & 11'),
          orderBy('timestamp', 'asc')
        );
        const snap = await getDocs(q);
        const grouped = {};
        snap.docs.forEach(d => {
          const data = d.data();
          const type = data.type || 'General';
          if (!grouped[type]) grouped[type] = [];
          grouped[type].push({ id: d.id, ...data });
        });
        setGroupedRecordings(grouped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalCount = Object.values(groupedRecordings).reduce((a, b) => a + b.length, 0);
  const openMeta = openFolder ? FOLDERS.find(f => f.key === openFolder) : null;
  const openRecs = openFolder ? (groupedRecordings[openFolder] || []) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F8FAFC' }}>
      <style>{STYLES}</style>

      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ height: 4, background: 'linear-gradient(90deg, #FBBF24, #F59E0B, #D97706)' }} />
        <div style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1280, margin: '0 auto', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => openFolder ? setOpenFolder(null) : navigate('/WatchVideosFolder')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: 'white', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: '#374151' }}
            >
              <BackIcon /> {openFolder ? 'Folders' : 'Back'}
            </button>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: openMeta ? openMeta.color : 'linear-gradient(135deg,#FBBF24,#D97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 14px ${openMeta ? openMeta.color + '55' : 'rgba(245,158,11,0.35)'}`,
              transition: 'background 0.3s',
            }}>
              <VideoIconWhite />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>
                {openFolder ?? 'Recordings — May 2026'}
              </h1>
              <p style={{ fontSize: 12.5, color: '#9CA3AF', margin: '2px 0 0' }}>
                {openFolder ? `${openRecs.length} recording${openRecs.length !== 1 ? 's' : ''}` : 'Grade 10 & 11 · Choose a folder'}
              </p>
            </div>
          </div>
          {!loading && !openFolder && totalCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#111827', borderRadius: 10, padding: '8px 14px' }}>
              <VideoIconWhite />
              <span style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>{totalCount} total</span>
            </div>
          )}
        </div>
      </header>

      <main style={{ flexGrow: 1, padding: '32px 28px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 16 }}>
            <img src={beeWaiting} alt="Loading" style={{ width: 110, height: 110, animation: 'beeBounce 1s ease-in-out infinite' }} />
            <p style={{ fontSize: 15, color: '#6B7280', margin: 0 }}>Loading recordings…</p>
          </div>

        ) : openFolder ? (
          /* ── Inside folder ── */
          <div className="fade-in">
            {openRecs.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 14, textAlign: 'center' }}>
                <div style={{ color: openMeta.color }}>
                  <openMeta.Vec />
                </div>
                <p style={{ fontSize: 15, color: '#6B7280', margin: 0, fontWeight: 500 }}>This folder is empty.</p>
                <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Recordings will appear here once uploaded.</p>
              </div>
            ) : (
              <div className="rec-grid">
                {openRecs.map(rec => (
                  <div key={rec.id} className="rec-card">
                    {rec.thumbnail && <img src={rec.thumbnail} alt={rec.title} style={{ width: '100%', height: 148, objectFit: 'cover' }} />}
                    <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 10 }}>
                      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 14.5, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.4 }}>
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
          </div>

        ) : (
          /* ── Folder grid ── */
          <div className="folder-grid fade-in">
            {FOLDERS.map(folder => {
              const count = (groupedRecordings[folder.key] || []).length;
              return (
                <div key={folder.key} className="flip-wrap" onClick={() => setOpenFolder(folder.key)}>
                  <div className="flip-inner">

                    {/* Front — white with colored top strip + vector */}
                    <div className="flip-front" style={{ borderColor: folder.border }}>
                      <div style={{ height: 5, background: folder.color }} />
                      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
                        <folder.Vec />
                        <div>
                          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 14.5, fontWeight: 700, color: '#111827', margin: '0 0 8px', lineHeight: 1.3 }}>
                            {folder.key}
                          </p>
                          <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: folder.light, color: folder.color, border: `1px solid ${folder.border}` }}>
                            {count > 0 ? `${count} recording${count !== 1 ? 's' : ''}` : 'No recordings yet'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Back — tinted with vector + open button */}
                    <div className="flip-back" style={{ borderColor: folder.color, borderWidth: '2px' }}>
                      <div style={{
                        height: '100%', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 12,
                        background: folder.light, padding: 20,
                      }}>
                        <folder.Vec />
                        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 700, color: '#111827', margin: 0, textAlign: 'center', lineHeight: 1.3 }}>
                          {folder.key}
                        </p>
                        <button style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '9px 24px', borderRadius: 9, border: 'none',
                          background: folder.color, color: 'white',
                          fontWeight: 700, fontSize: 13, cursor: 'pointer',
                          boxShadow: `0 4px 14px ${folder.color}44`,
                        }}>
                          <PlayIcon /> Open
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default May;
