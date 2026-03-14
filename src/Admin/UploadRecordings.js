import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  addDoc, collection, getDocs, orderBy, query, Timestamp,
  deleteDoc, doc, updateDoc,
} from 'firebase/firestore';
import Footer from '../Footer';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const MONTH_ORDER = Object.fromEntries(MONTHS.map((m, i) => [m, i]));

const RECORD_TYPES = ['Tute Class Records'];

// ── Icons ──────────────────────────────────────────────
const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const VideoIcon = ({ color = 'white', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <path d="M16 10l6-4v12l-6-4V10z" />
  </svg>
);
const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const LinkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);
const SpinnerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
    </path>
  </svg>
);
// ────────────────────────────────────────────────────────

const UploadRecordings = () => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [month, setMonth] = useState('');
  const [recordType, setRecordType] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [recordingsByGroup, setRecordingsByGroup] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [activeMonth, setActiveMonth] = useState('');

  const fetchRecordings = async () => {
    const q = query(collection(db, 'recordings'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const grouped = {};
    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      const id = docSnap.id;
      const m = data.month || 'Unknown';
      const typeLabel = (data.type && data.type.trim()) ? data.type : 'General';
      const key = m;
      if (!grouped[key]) grouped[key] = {};
      if (!grouped[key][typeLabel]) grouped[key][typeLabel] = [];
      grouped[key][typeLabel].push({ id, ...data });
    });
    setRecordingsByGroup(grouped);

    // Set the first available month as active tab
    const months = Object.keys(grouped).sort((a, b) => (MONTH_ORDER[a] ?? 99) - (MONTH_ORDER[b] ?? 99));
    if (months.length > 0) setActiveMonth(prev => prev && grouped[prev] ? prev : months[0]);
  };

  useEffect(() => { fetchRecordings(); }, []);

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setThumbnail(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !link || !thumbnail || !month) {
      alert('Title, link, month, and thumbnail are all required.');
      return;
    }
    try {
      setUploading(true);
      const payload = { title, link, thumbnail, month, timestamp: Timestamp.now() };
      if (recordType && recordType.trim()) payload.type = recordType.trim();
      await addDoc(collection(db, 'recordings'), payload);
      setTitle(''); setLink(''); setMonth(''); setRecordType(''); setThumbnail(null);
      fetchRecordings();
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recording?')) return;
    try { await deleteDoc(doc(db, 'recordings', id)); fetchRecordings(); }
    catch (e) { console.error(e); alert('Failed to delete.'); }
  };

  const saveEdit = async () => {
    if (!editingTitle.trim()) return alert('Title cannot be empty.');
    try {
      await updateDoc(doc(db, 'recordings', editingId), { title: editingTitle.trim() });
      setEditingId(null); setEditingTitle(''); fetchRecordings();
    } catch (err) { console.error(err); alert('Failed to update title.'); }
  };

  const sortedMonths = Object.keys(recordingsByGroup).sort((a, b) => (MONTH_ORDER[a] ?? 99) - (MONTH_ORDER[b] ?? 99));
  const totalCount = Object.values(recordingsByGroup).reduce((sum, types) =>
    sum + Object.values(types).reduce((s, recs) => s + recs.length, 0), 0);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }} className="flex flex-col min-h-screen bg-yellow-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        .ur-input {
          width: 100%; padding: 10px 14px;
          border: 1.5px solid #E5E7EB; border-radius: 10px;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          color: #111827; background: #FAFAFA; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ur-input:focus { border-color: #F59E0B; box-shadow: 0 0 0 3px rgba(245,158,11,0.12); background: white; }
        .rec-card {
          background: white; border-radius: 14px; overflow: hidden;
          border: 1.5px solid #E9EBF0;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s;
        }
        .rec-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.08); border-color: #F59E0B; }
        .month-tab {
          padding: 7px 16px; border-radius: 9px; font-weight: 600; font-size: 13px;
          cursor: pointer; border: 1.5px solid transparent; transition: all 0.2s; white-space: nowrap;
        }
        .month-tab-active { background: linear-gradient(135deg, #FBBF24, #D97706); color: white; }
        .month-tab-inactive { background: white; color: #6B7280; border-color: #E5E7EB; }
        .month-tab-inactive:hover { border-color: #F59E0B; color: #D97706; }
      `}</style>

      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #FACC15 0%, #F59E0B 60%, #D97706 100%)', boxShadow: '0 4px 20px rgba(245,158,11,0.3)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/AdminDashboard'}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: 'white', backdropFilter: 'blur(4px)' }}
            >
              <BackIcon /> Back
            </button>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <VideoIcon />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 800, color: 'white', margin: 0, textShadow: '0 1px 6px rgba(0,0,0,0.15)' }}>Upload Recordings</h1>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: 0 }}>The BEE Academy — {totalCount} recordings total</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-8" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 28, alignItems: 'start' }}>

          {/* Upload Form */}
          <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid #E9EBF0', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'sticky', top: 24 }}>
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #FEF9C3, #FDE68A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <VideoIcon color="#D97706" />
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>New Recording</h2>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Add a class recording</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Title</label>
                <input type="text" className="ur-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Grammar Lesson — Week 1" required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>YouTube Link</label>
                <div style={{ position: 'relative' }}>
                  <input type="url" className="ur-input" value={link} onChange={e => setLink(e.target.value)} placeholder="https://youtube.com/..." required style={{ paddingLeft: 38 }} />
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><LinkIcon /></span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Month</label>
                  <select className="ur-input" value={month} onChange={e => setMonth(e.target.value)} required>
                    <option value="">Select Month</option>
                    {MONTHS.map((m, i) => <option key={i} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Type <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span></label>
                  <select className="ur-input" value={recordType} onChange={e => setRecordType(e.target.value)}>
                    <option value="">— None —</option>
                    {RECORD_TYPES.map((t, i) => <option key={i} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Thumbnail Image</label>
                <div style={{ border: '1.5px dashed #E5E7EB', borderRadius: 10, padding: '14px', background: '#FAFAFA' }}>
                  <input type="file" accept="image/*" onChange={handleThumbnailUpload} style={{ display: 'block', width: '100%', fontSize: 13, color: '#6B7280' }} />
                  {thumbnail && (
                    <img src={thumbnail} alt="Preview" style={{ marginTop: 10, width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }} />
                  )}
                </div>
              </div>

              <button
                type="submit" disabled={uploading}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px 20px', borderRadius: 11, border: 'none', cursor: uploading ? 'not-allowed' : 'pointer',
                  background: uploading ? '#FDE68A' : 'linear-gradient(135deg, #FBBF24, #D97706)',
                  color: uploading ? '#92400E' : 'white', fontWeight: 700, fontSize: 14,
                  boxShadow: uploading ? 'none' : '0 4px 14px rgba(245,158,11,0.4)', transition: 'all 0.2s',
                }}
              >
                {uploading ? <><SpinnerIcon /> Uploading…</> : <><UploadIcon /> Upload Recording</>}
              </button>
            </form>
          </div>

          {/* Recordings list */}
          <div>
            {/* Month tabs */}
            {sortedMonths.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {sortedMonths.map(m => (
                  <button key={m} className={`month-tab ${activeMonth === m ? 'month-tab-active' : 'month-tab-inactive'}`} onClick={() => setActiveMonth(m)}>
                    {m}
                    <span style={{ marginLeft: 5, fontSize: 11, fontWeight: 700, background: activeMonth === m ? 'rgba(255,255,255,0.25)' : '#F3F4F6', color: activeMonth === m ? 'white' : '#6B7280', padding: '1px 6px', borderRadius: 20 }}>
                      {Object.values(recordingsByGroup[m] || {}).reduce((s, r) => s + r.length, 0)}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {sortedMonths.length === 0 ? (
              <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #E9EBF0', padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: '#FEF3C7', border: '1.5px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <VideoIcon color="#D97706" />
                </div>
                <p style={{ fontSize: 14, color: '#6B7280', margin: 0, fontWeight: 500 }}>No recordings uploaded yet.</p>
              </div>
            ) : activeMonth && recordingsByGroup[activeMonth] ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {Object.entries(recordingsByGroup[activeMonth]).map(([type, recs], idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ height: 3, width: 20, borderRadius: 4, background: 'linear-gradient(135deg, #FBBF24, #D97706)' }} />
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>{type}</h3>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: '#FEF3C7', color: '#D97706' }}>{recs.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {recs.map(rec => (
                        <div key={rec.id} className="rec-card">
                          <div style={{ height: 3, background: 'linear-gradient(90deg, #FBBF24, #D97706)' }} />
                          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                            {rec.thumbnail && (
                              <img src={rec.thumbnail} alt={rec.title} style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              {editingId === rec.id ? (
                                <input
                                  className="ur-input" value={editingTitle}
                                  onChange={e => setEditingTitle(e.target.value)} autoFocus
                                  style={{ marginBottom: 6 }}
                                />
                              ) : (
                                <p style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rec.title}</p>
                              )}
                              <a href={rec.link} target="_blank" rel="noopener noreferrer"
                                style={{ fontSize: 11.5, color: '#6B7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
                                <LinkIcon />
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rec.link}</span>
                              </a>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                              {editingId === rec.id ? (
                                <>
                                  <button onClick={saveEdit} style={{ padding: '6px 12px', borderRadius: 8, background: '#10B981', color: 'white', border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Save</button>
                                  <button onClick={() => { setEditingId(null); setEditingTitle(''); }} style={{ padding: '6px 12px', borderRadius: 8, background: '#F3F4F6', color: '#374151', border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => { setEditingId(rec.id); setEditingTitle(rec.title || ''); }}
                                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, background: '#FEF3C7', border: '1.5px solid #FDE68A', color: '#D97706', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                                    <EditIcon /> Edit
                                  </button>
                                  <button onClick={() => handleDelete(rec.id)}
                                    style={{ display: 'flex', alignItems: 'center', padding: '6px 8px', borderRadius: 8, background: '#FEE2E2', border: 'none', color: '#DC2626', cursor: 'pointer' }}>
                                    <TrashIcon />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </main>

      <footer className="w-full bg-white border-t mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default UploadRecordings;
