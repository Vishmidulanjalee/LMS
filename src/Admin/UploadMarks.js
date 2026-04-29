import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import {
  collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import Footer from '../Footer';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const MONTH_ORDER = Object.fromEntries(MONTHS.map((m, i) => [m, i]));

const GRADES = ['General', 'Grade 9', 'Grade 10 & 11'];

// Maps grade label → Firestore collection name
const gradeCollection = (g) => {
  if (g === 'Grade 9') return 'marks9';
  if (g === 'Grade 10 & 11') return 'marks1011';
  return 'marksheets';
};

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);
const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const FileIcon = ({ color = '#D97706', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
  </svg>
);
const SpinnerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
    </path>
  </svg>
);

const UploadMarks = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('');
  const [grade, setGrade] = useState('Grade 9');
  const [marksByMonth, setMarksByMonth] = useState({});
  const [activeGrade, setActiveGrade] = useState('Grade 9');
  const [loading, setLoading] = useState(false);

  const fetchMarks = async (g) => {
    const col = gradeCollection(g);
    const q = query(collection(db, col), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const grouped = {};
    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      const m = data.month || 'Uncategorized';
      if (!grouped[m]) grouped[m] = [];
      grouped[m].push({ id: docSnap.id, ...data });
    });
    setMarksByMonth(grouped);
  };

  useEffect(() => { fetchMarks(activeGrade); }, [activeGrade]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile || !month || !title) {
      alert('Please fill all fields: Title, Month, Grade, and PDF file.');
      return;
    }
    try {
      setLoading(true);
      const col = gradeCollection(grade);
      const fileRef = ref(storage, `${col}/${Date.now()}_${pdfFile.name}`);
      await uploadBytes(fileRef, pdfFile);
      const fileUrl = await getDownloadURL(fileRef);
      await addDoc(collection(db, col), {
        title,
        fileName: pdfFile.name,
        fileUrl,
        filePath: fileRef.fullPath,
        month,
        grade,
        timestamp: Timestamp.now(),
      });
      setPdfFile(null); setTitle(''); setMonth('');
      setActiveGrade(grade);
      fetchMarks(grade);
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, filePath) => {
    if (!window.confirm('Delete this marks sheet?')) return;
    try {
      await deleteDoc(doc(db, gradeCollection(activeGrade), id));
      await deleteObject(ref(storage, filePath));
      fetchMarks(activeGrade);
    } catch (err) {
      console.error(err);
      alert('Failed to delete.');
    }
  };

  const sortedMonths = Object.keys(marksByMonth).sort((a, b) => (MONTH_ORDER[a] ?? 99) - (MONTH_ORDER[b] ?? 99));
  const total = Object.values(marksByMonth).reduce((s, arr) => s + arr.length, 0);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="flex flex-col min-h-screen bg-yellow-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        .um-input {
          width: 100%; padding: 10px 14px; border: 1.5px solid #E5E7EB; border-radius: 10px;
          font-size: 14px; font-family: 'DM Sans', sans-serif; color: #111827; background: #FAFAFA; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .um-input:focus { border-color: #F59E0B; box-shadow: 0 0 0 3px rgba(245,158,11,0.12); background: white; }
        .um-card { background: white; border-radius: 14px; border: 1.5px solid #E9EBF0; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .um-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.08); border-color: #F59E0B; }
        .grade-tab { padding: 7px 18px; border-radius: 9px; font-weight: 600; font-size: 13px; cursor: pointer; border: 1.5px solid transparent; transition: all 0.2s; white-space: nowrap; }
        .grade-tab-active { background: linear-gradient(135deg, #FBBF24, #D97706); color: white; border-color: transparent; }
        .grade-tab-inactive { background: white; color: #6B7280; border-color: #E5E7EB; }
        .grade-tab-inactive:hover { border-color: #F59E0B; color: #D97706; }
      `}</style>

      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #FACC15 0%, #F59E0B 60%, #D97706 100%)', boxShadow: '0 4px 20px rgba(245,158,11,0.3)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
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
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>Upload Marks</h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: 0 }}>The BEE Academy — {total} sheet{total !== 1 ? 's' : ''} for {activeGrade}</p>
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
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>New Marks Sheet</h2>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Upload a PDF for a specific grade</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Title</label>
                <input type="text" className="um-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., March Term Test Results" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Grade</label>
                  <select className="um-input" value={grade} onChange={e => setGrade(e.target.value)} required>
                    {GRADES.map((g, i) => <option key={i} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Month</label>
                  <select className="um-input" value={month} onChange={e => setMonth(e.target.value)} required>
                    <option value="">Select Month</option>
                    {MONTHS.map((m, i) => <option key={i} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>PDF File</label>
                <div style={{ border: '1.5px dashed #E5E7EB', borderRadius: 10, padding: '14px', background: '#FAFAFA' }}>
                  <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} style={{ display: 'block', width: '100%', fontSize: 13, color: '#6B7280' }} required />
                  {pdfFile && <p style={{ fontSize: 12, color: '#10B981', marginTop: 8, fontWeight: 500 }}>✓ {pdfFile.name}</p>}
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
                {loading ? <><SpinnerIcon /> Uploading…</> : <><UploadIcon /> Upload Marks</>}
              </button>
            </form>
          </div>

          {/* Marks list with grade tabs */}
          <div>
            {/* Grade tabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {GRADES.map(g => (
                <button key={g} className={`grade-tab ${activeGrade === g ? 'grade-tab-active' : 'grade-tab-inactive'}`} onClick={() => setActiveGrade(g)}>
                  {g}
                </button>
              ))}
            </div>

            {sortedMonths.length === 0 ? (
              <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #E9EBF0', padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: '#FEF3C7', border: '1.5px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <FileIcon />
                </div>
                <p style={{ fontSize: 14, color: '#6B7280', margin: 0, fontWeight: 500 }}>No marks uploaded for {activeGrade}.</p>
              </div>
            ) : sortedMonths.map(m => (
              <div key={m} style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ height: 3, width: 20, borderRadius: 4, background: 'linear-gradient(135deg, #FBBF24, #D97706)' }} />
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: '#111827', margin: 0 }}>{m}</h3>
                  <span style={{ fontSize: 11.5, fontWeight: 600, padding: '2px 9px', borderRadius: 20, background: '#FEF3C7', color: '#D97706' }}>{marksByMonth[m].length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {marksByMonth[m].map(file => (
                    <div key={file.id} className="um-card">
                      <div style={{ height: 3, background: 'linear-gradient(90deg, #FBBF24, #D97706)' }} />
                      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 9, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileIcon size={16} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.title}</p>
                            <p style={{ fontSize: 11.5, color: '#9CA3AF', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.fileName}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          <a href={file.fileUrl} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, background: '#FEF3C7', border: '1.5px solid #FDE68A', color: '#D97706', fontWeight: 600, fontSize: 12, textDecoration: 'none' }}>
                            View PDF
                          </a>
                          <button onClick={() => handleDelete(file.id, file.filePath)}
                            style={{ display: 'flex', alignItems: 'center', padding: '6px 8px', borderRadius: 8, background: '#FEE2E2', border: 'none', color: '#DC2626', cursor: 'pointer' }}>
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="w-full bg-white border-t mt-auto"><Footer /></footer>
    </div>
  );
};

export default UploadMarks;
