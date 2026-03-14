import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Footer from '../Footer';

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const SheetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </svg>
);
const ExternalLinkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Playfair+Display:wght@600;700&display=swap');
  * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }
  .am-card {
    background: #fff; border-radius: 18px; overflow: hidden;
    border: 1.5px solid #E5E7EB; display: flex; flex-direction: column;
    transition: transform 0.26s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.26s ease, border-color 0.26s ease;
  }
  .am-card:hover { transform: translateY(-6px); box-shadow: 0 18px 44px rgba(245,158,11,0.18); border-color: #F59E0B; }
  .am-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    width: 100%; padding: 10px 18px; border-radius: 10px;
    font-weight: 600; font-size: 13.5px; border: none; cursor: pointer; text-decoration: none;
    color: white; background: linear-gradient(135deg, #F59E0B, #D97706);
    transition: filter 0.2s, transform 0.15s; letter-spacing: 0.01em;
  }
  .am-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
  .am-btn:active { transform: translateY(0); }
  .am-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
  @media (max-width: 580px) { .am-grid { grid-template-columns: 1fr; } }
`;

const JulyMarks = () => {
  const navigate = useNavigate();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const q = query(collection(db, 'marksheets'), where('month', '==', 'July'));
        const snapshot = await getDocs(q);
        setMarks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Error fetching July mark sheets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
      <style>{STYLES}</style>

      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ height: 4, background: 'linear-gradient(90deg, #FBBF24, #F59E0B, #D97706)' }} />
        <div style={{ padding: '15px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1280, margin: '0 auto', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <button
              onClick={() => navigate('/MarkSheets')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: 'white', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: '#374151' }}
            >
              <BackIcon /> Back
            </button>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #FBBF24, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(245,158,11,0.36)' }}>
              <SheetIcon />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>
                Mark Sheets — July
              </h1>
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: '2px 0 0', fontWeight: 400 }}>July exam results &amp; mark sheets</p>
            </div>
          </div>
          {!loading && marks.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#111827', borderRadius: 10, padding: '9px 16px' }}>
              <SheetIcon />
              <span style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>{marks.length} {marks.length === 1 ? 'sheet' : 'sheets'}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main style={{ flexGrow: 1, padding: '30px 32px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #FBBF24, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SheetIcon />
            </div>
            <p style={{ fontSize: 14, color: '#9CA3AF', margin: 0 }}>Loading mark sheets…</p>
          </div>
        ) : marks.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 14 }}>
            <div style={{ width: 72, height: 72, borderRadius: 18, background: '#FEF3C7', border: '1.5px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SheetIcon />
            </div>
            <p style={{ fontSize: 15, color: '#6B7280', margin: 0, fontWeight: 500 }}>No mark sheets found for July.</p>
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Check back after results are released.</p>
          </div>
        ) : (
          <div className="am-grid">
            {marks.map(mark => (
              <div key={mark.id} className="am-card">
                <div style={{ position: 'relative', height: 190, background: '#FEFCE8', borderBottom: '1.5px solid #E5E7EB', overflow: 'hidden' }}>
                  <iframe src={mark.fileUrl} title={mark.title} style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', inset: 0 }} />
                </div>
                <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {mark.title}
                  </h3>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {mark.fileName}
                  </p>
                  <a href={mark.fileUrl} target="_blank" rel="noopener noreferrer" className="am-btn" style={{ marginTop: 'auto' }}>
                    <ExternalLinkIcon /> View Full PDF
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

export default JulyMarks;
