import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import Sidebar from '../Sidebar9';
import { Eye, Download } from 'lucide-react';
import Footer from '../../Footer';

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
  * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }

  .note-card {
    background: white; border-radius: 16px; overflow: hidden;
    border: 1.5px solid #E5E7EB;
    transition: transform 0.24s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.24s ease, border-color 0.24s ease;
  }
  .note-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(245,158,11,0.16); border-color: #F59E0B; }
  .note-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    flex: 1; padding: 9px 14px; border-radius: 9px;
    font-weight: 600; font-size: 13px; text-decoration: none; color: white;
    background: linear-gradient(135deg, #F59E0B, #D97706);
    transition: filter 0.2s, transform 0.15s;
  }
  .note-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
  .note-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; }
  @media (max-width: 580px) { .note-grid { grid-template-columns: 1fr; } }
  @media (max-width: 767px) { .n9-content { padding-top: 60px; } }
`;

const Grade9Notes = () => {
  const [notesByInstitution, setNotesByInstitution] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'notes9'), (snap) => {
      const notesData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const grouped = notesData.reduce((acc, note) => {
        const group = note.institution || 'General';
        if (!acc[group]) acc[group] = [];
        acc[group].push(note);
        return acc;
      }, {});
      setNotesByInstitution(grouped);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const totalCount = Object.values(notesByInstitution).reduce((a, b) => a + b.length, 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
      <style>{STYLES}</style>
      <Sidebar activeItem="Study Materials" />

      <div className="n9-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header */}
        <header style={{ background: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ height: 4, background: 'linear-gradient(90deg, #FBBF24, #F59E0B, #D97706)' }} />
          <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: 'linear-gradient(135deg, #FBBF24, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(245,158,11,0.4)' }}>
                <BookIcon />
              </div>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>
                  Study Materials
                </h1>
                <p style={{ fontSize: 13, color: '#9CA3AF', margin: '3px 0 0' }}>Grade 9 notes & resources</p>
              </div>
            </div>
            {!loading && totalCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#111827', borderRadius: 10, padding: '9px 16px' }}>
                <BookIcon />
                <span style={{ fontSize: 13.5, color: 'white', fontWeight: 600 }}>{totalCount} {totalCount === 1 ? 'document' : 'documents'}</span>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '28px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, border: '3px solid #FDE047', borderTopColor: '#D97706', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ fontSize: 15, color: '#6B7280', margin: 0 }}>Loading materials…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : Object.keys(notesByInstitution).length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 14, textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, background: '#FEF3C7', border: '1.5px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookIcon />
              </div>
              <p style={{ fontSize: 15.5, fontWeight: 600, color: '#374151', margin: 0 }}>No materials yet</p>
              <p style={{ fontSize: 13.5, color: '#9CA3AF', margin: 0, maxWidth: 300 }}>
                Study materials will appear here once uploaded by your teacher.
              </p>
            </div>
          ) : (
            Object.entries(notesByInstitution).map(([group, notes]) => (
              <div key={group} style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <div style={{ height: 3, width: 24, borderRadius: 4, background: 'linear-gradient(135deg, #FBBF24, #D97706)' }} />
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>{group}</h2>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#FEF3C7', color: '#D97706' }}>{notes.length}</span>
                </div>
                <div className="note-grid">
                  {notes.map(note => (
                    <div key={note.id} className="note-card">
                      <div style={{ height: 4, background: 'linear-gradient(90deg, #FBBF24, #D97706)' }} />
                      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div>
                          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px', lineHeight: 1.35 }}>
                            {note.title}
                          </h3>
                          <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>
                            {note.createdAt ? new Date(note.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date not available'}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                          <a href={note.fileUrl} target="_blank" rel="noopener noreferrer" className="note-btn">
                            <Eye size={14} /> View
                          </a>
                          <a href={note.fileUrl} download className="note-btn">
                            <Download size={14} /> Download
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Grade9Notes;
