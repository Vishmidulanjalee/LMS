import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Sidebar from '../Sidebar9';
import Footer from '../../Footer';

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const FileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
  * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }

  .mark-row {
    background: white; border-radius: 12px;
    border: 1.5px solid #E5E7EB;
    display: flex; align-items: center; gap: 14px;
    padding: 14px 18px;
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease, border-color 0.22s ease;
  }
  .mark-row:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(245,158,11,0.14); border-color: #F59E0B; }
  .mark-link {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: 9px;
    font-weight: 600; font-size: 13px; text-decoration: none; color: white;
    background: linear-gradient(135deg, #F59E0B, #D97706);
    transition: filter 0.2s, transform 0.15s; white-space: nowrap;
  }
  .mark-link:hover { filter: brightness(1.1); transform: translateY(-1px); }
  @media (max-width: 767px) { .m9-content { padding-top: 60px; } }
  @media (max-width: 540px) { .mark-row { flex-direction: column; align-items: flex-start; gap: 10px; } }
`;

const StudentMarks9 = () => {
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const snap = await getDocs(collection(db, 'marks9'));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMarksData(list);
      } catch (err) {
        console.error('Error fetching marks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
      <style>{STYLES}</style>
      <Sidebar activeItem="Marks" />

      <div className="m9-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header */}
        <header style={{ background: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ height: 4, background: 'linear-gradient(90deg, #FBBF24, #F59E0B, #D97706)' }} />
          <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: 'linear-gradient(135deg, #FBBF24, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(245,158,11,0.4)' }}>
                <ChartIcon />
              </div>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>
                  Marks
                </h1>
                <p style={{ fontSize: 13, color: '#9CA3AF', margin: '3px 0 0' }}>Grade 9 exam results & progress</p>
              </div>
            </div>
            {!loading && marksData.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#111827', borderRadius: 10, padding: '9px 16px' }}>
                <ChartIcon />
                <span style={{ fontSize: 13.5, color: 'white', fontWeight: 600 }}>{marksData.length} {marksData.length === 1 ? 'file' : 'files'}</span>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '28px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, border: '3px solid #FDE047', borderTopColor: '#D97706', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ fontSize: 15, color: '#6B7280', margin: 0 }}>Loading marks…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : marksData.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 14, textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, background: '#FEF3C7', border: '1.5px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChartIcon />
              </div>
              <p style={{ fontSize: 15.5, fontWeight: 600, color: '#374151', margin: 0 }}>No marks available</p>
              <p style={{ fontSize: 13.5, color: '#9CA3AF', margin: 0, maxWidth: 300 }}>
                Your marks will appear here once uploaded by your teacher.
              </p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ height: 3, width: 24, borderRadius: 4, background: 'linear-gradient(135deg, #FBBF24, #D97706)' }} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>All Results</h2>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#FEF3C7', color: '#D97706' }}>{marksData.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {marksData.map(mark => (
                  <div key={mark.id} className="mark-row">
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: '#FEF3C7', border: '1.5px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileIcon />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {mark.fileName || 'Marks File'}
                      </p>
                      <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>Click to view your results</p>
                    </div>
                    {mark.fileUrl ? (
                      <a href={mark.fileUrl} target="_blank" rel="noopener noreferrer" className="mark-link">
                        View Marks
                      </a>
                    ) : (
                      <span style={{ fontSize: 13, color: '#9CA3AF', padding: '8px 16px' }}>No file</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default StudentMarks9;
