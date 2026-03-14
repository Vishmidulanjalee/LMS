import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import {
  collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, where, Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import Footer from '../Footer';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const MONTH_ORDER = Object.fromEntries(MONTHS.map((m, i) => [m, i]));

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const FileIcon = ({ color = '#D97706', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </svg>
);
const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);
const ExternalLinkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const SpinnerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
    </path>
  </svg>
);

const UploadDocument = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('');
  const [tutesByMonth, setTutesByMonth] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchTutes = async () => {
    const q = query(collection(db, 'documents'), where('category', '==', 'Tutes'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const grouped = {};
    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      const m = data.month || 'No Month';
      if (!grouped[m]) grouped[m] = [];
      grouped[m].push({ id: docSnap.id, ...data });
    });
    setTutesByMonth(grouped);
  };

  useEffect(() => { fetchTutes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile || !title || !month) return alert('Please provide all fields.');
    try {
      setLoading(true);
      const fileRef = ref(storage, `documents/${Date.now()}_${pdfFile.name}`);
      await uploadBytes(fileRef, pdfFile);
      const downloadURL = await getDownloadURL(fileRef);
      await addDoc(collection(db, 'documents'), {
        fileName: pdfFile.name,
        fileUrl: downloadURL,
        filePath: fileRef.fullPath,
        title,
        category: 'Tutes',
        month,
        timestamp: Timestamp.now(),
      });
      setPdfFile(null);
      setTitle('');
      setMonth('');
      fetchTutes();
      alert('Tute uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, filePath) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await deleteDoc(doc(db, 'documents', id));
      await deleteObject(ref(storage, filePath));
      fetchTutes();
    } catch (err) {
      console.error(err);
      alert('Failed to delete document.');
    }
  };

  const sortedMonths = Object.keys(tutesByMonth).sort((a, b) =>
    (MONTH_ORDER[a] ?? 99) - (MONTH_ORDER[b] ?? 99)
  );
  const totalTutes = Object.values(tutesByMonth).reduce((s, arr) => s + arr.length, 0);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }} className="flex flex-col min-h-screen bg-yellow-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        .ud-input {
          width: 100%; padding: 10px 14px;
          border: 1.5px solid #E5E7EB; border-radius: 10px;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          color: #111827; background: #FAFAFA; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ud-input:focus { border-color: #F59E0B; box-shadow: 0 0 0 3px rgba(245,158,11,0.12); background: white; }
        .ud-card {
          background: white; border-radius: 16px; border: 1.5px solid #E9EBF0; overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s;
        }
        .ud-card:hover { transform: translateY(-4px); box-shadow: 0 14px 36px rgba(0,0,0,0.08); border-color: #F59E0B; }
      `}</style>

      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #FACC15 0%, #F59E0B 60%, #D97706 100%)', boxShadow: '0 4px 20px rgba(245,158,11,0.3)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/AdminDashboard'}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: 'white' }}
            >
              <BackIcon /> Back
            </button>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UploadIcon />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 800, color: 'white', margin: 0, textShadow: '0 1px 6px rgba(0,0,0,0.15)' }}>Upload Tutes</h1>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: 0 }}>The BEE Academy — {totalTutes} tute{totalTutes !== 1 ? 's' : ''} total</p>
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
                  <FileIcon size={20} />
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>New Tute</h2>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Select a month and upload a PDF</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Month</label>
                <select className="ud-input" value={month} onChange={e => setMonth(e.target.value)} required>
                  <option value="">Select Month</option>
                  {MONTHS.map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Title</label>
                <input
                  type="text" className="ud-input" value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Week 1 — Grammar Notes"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>PDF File</label>
                <div style={{ border: '1.5px dashed #E5E7EB', borderRadius: 10, padding: '16px', background: '#FAFAFA' }}>
                  <input
                    type="file" accept="application/pdf"
                    onChange={e => setPdfFile(e.target.files[0])}
                    style={{ display: 'block', width: '100%', fontSize: 13, color: '#6B7280' }}
                    required
                  />
                  {pdfFile && (
                    <p style={{ fontSize: 12, color: '#10B981', marginTop: 8, fontWeight: 500 }}>✓ {pdfFile.name}</p>
                  )}
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px 20px', borderRadius: 11, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading ? '#FDE68A' : 'linear-gradient(135deg, #FBBF24, #D97706)',
                  color: loading ? '#92400E' : 'white', fontWeight: 700, fontSize: 14,
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(245,158,11,0.4)', transition: 'all 0.2s',
                }}
              >
                {loading ? <><SpinnerIcon /> Uploading…</> : <><UploadIcon /> Upload Tute</>}
              </button>
            </form>
          </div>

          {/* Uploaded tutes grouped by month */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {sortedMonths.length === 0 ? (
              <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #E9EBF0', padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: '#FEF3C7', border: '1.5px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <FileIcon />
                </div>
                <p style={{ fontSize: 14, color: '#6B7280', margin: 0, fontWeight: 500 }}>No tutes uploaded yet.</p>
              </div>
            ) : sortedMonths.map(m => (
              <div key={m}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ height: 3, width: 20, borderRadius: 4, background: 'linear-gradient(135deg, #FBBF24, #D97706)' }} />
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: '#111827', margin: 0 }}>{m}</h3>
                  <span style={{ fontSize: 11.5, fontWeight: 600, padding: '2px 9px', borderRadius: 20, background: '#FEF3C7', color: '#D97706' }}>
                    {tutesByMonth[m].length}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                  {tutesByMonth[m].map(file => (
                    <div key={file.id} className="ud-card">
                      <div style={{ height: 3, background: 'linear-gradient(90deg, #FBBF24, #D97706)' }} />
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 0 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <FileIcon size={15} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.title}</p>
                              <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.fileName}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(file.id, file.filePath)}
                            style={{ background: '#FEE2E2', border: 'none', borderRadius: 7, padding: '5px 7px', cursor: 'pointer', color: '#DC2626', flexShrink: 0, display: 'flex', alignItems: 'center' }}
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                        <a
                          href={file.fileUrl} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, width: '100%', padding: '7px 12px', borderRadius: 8, background: '#FEF3C7', border: '1.5px solid #FDE68A', color: '#D97706', fontWeight: 600, fontSize: 12, textDecoration: 'none' }}
                        >
                          <ExternalLinkIcon /> View PDF
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="w-full bg-white border-t mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default UploadDocument;
