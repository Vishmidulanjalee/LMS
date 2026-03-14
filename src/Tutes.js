import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Footer from './Footer';
import SidebarNew from './SidebarNew';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const MONTH_ORDER = Object.fromEntries(MONTHS.map((m, i) => [m, i]));

// ── Icons ──────────────────────────────────────────────
const BookOpenIcon = ({ color = 'white' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
);
const FileTextIcon = ({ color = '#D97706', size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </svg>
);
const ExternalLinkIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const SpinnerIcon = ({ color = '#D97706' }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
    </path>
  </svg>
);
const CalendarIcon = ({ color = '#D97706' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
// ────────────────────────────────────────────────────────

const Tutes = () => {
  const [tutesByMonth, setTutesByMonth] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeMonth, setActiveMonth] = useState('');
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchTutes = async () => {
      try {
        const q = query(collection(db, 'documents'), where('category', '==', 'Tutes'));
        const snapshot = await getDocs(q);
        const grouped = {};
        snapshot.docs.forEach(d => {
          const data = d.data();
          const m = data.month || 'General';
          if (!grouped[m]) grouped[m] = [];
          grouped[m].push({ id: d.id, ...data });
        });
        setTutesByMonth(grouped);
        const sorted = Object.keys(grouped).sort((a, b) => (MONTH_ORDER[a] ?? 99) - (MONTH_ORDER[b] ?? 99));
        if (sorted.length > 0) setActiveMonth(sorted[0]);
      } catch (error) {
        console.error('Error fetching Tutes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutes();
  }, []);

  const sortedMonths = Object.keys(tutesByMonth).sort((a, b) => (MONTH_ORDER[a] ?? 99) - (MONTH_ORDER[b] ?? 99));
  const totalCount = Object.values(tutesByMonth).reduce((s, arr) => s + arr.length, 0);
  const activeDocs = tutesByMonth[activeMonth] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F5F6FA' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }

        .tute-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1.5px solid #E9EBF0;
          overflow: hidden;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .tute-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 40px rgba(0,0,0,0.09);
          border-color: #F59E0B;
        }
        .tute-top-bar {
          height: 3px;
          background: linear-gradient(90deg, #FBBF24, #F59E0B, #D97706);
        }
        .tute-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 18px;
        }
        @media (max-width: 580px) { .tute-grid { grid-template-columns: 1fr; } }
        @media (min-width: 1024px) { .tute-content { margin-left: 228px; } }
        @media (max-width: 1023px) { .tute-header { padding-left: 60px !important; } }

        .month-tab {
          padding: 8px 18px; border-radius: 10px; font-weight: 600; font-size: 13px;
          cursor: pointer; border: 1.5px solid transparent; transition: all 0.2s; white-space: nowrap;
          display: flex; align-items: center; gap: 6px;
        }
        .month-tab-active { background: linear-gradient(135deg, #FBBF24, #D97706); color: white; box-shadow: 0 4px 12px rgba(245,158,11,0.35); }
        .month-tab-inactive { background: white; color: #6B7280; border-color: #E5E7EB; }
        .month-tab-inactive:hover { border-color: #F59E0B; color: #D97706; }

        .tute-view-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          width: 100%; padding: 10px 18px; border-radius: 9px;
          font-weight: 600; font-size: 13.5px; border: 1.5px solid transparent;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s;
        }
        .tute-view-btn:hover { transform: translateY(-1px); }
      `}</style>

      <div style={{ display: 'flex', flexGrow: 1 }}>
        <SidebarNew activeItem="Tutes" />

        <div className="tute-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* ── Header ── */}
          <header className="tute-header" style={{ background: 'white', borderBottom: '1px solid #E9EBF0', padding: '0 32px' }}>
            <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 11,
                  background: 'linear-gradient(135deg, #FBBF24, #D97706)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(245,158,11,0.36)',
                }}>
                  <BookOpenIcon />
                </div>
                <div>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 23, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>
                    Tutes
                  </h1>
                  <p style={{ fontSize: 13, color: '#9CA3AF', margin: '3px 0 0', fontWeight: 400 }}>
                    Tutorial documents organised by month
                  </p>
                </div>
              </div>

              {!loading && totalCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#111827', borderRadius: 10, padding: '9px 16px' }}>
                  <FileTextIcon color="white" size={15} />
                  <span style={{ fontSize: 13.5, color: 'white', fontWeight: 600 }}>
                    {totalCount} {totalCount === 1 ? 'document' : 'documents'}
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* ── Main ── */}
          <main style={{ flexGrow: 1, padding: '28px 32px' }}>

            {/* Loading */}
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 16 }}>
                <SpinnerIcon />
                <p style={{ fontSize: 14, color: '#9CA3AF', margin: 0 }}>Loading tutes…</p>
              </div>
            )}

            {/* Empty state */}
            {!loading && totalCount === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 14 }}>
                <div style={{ width: 72, height: 72, borderRadius: 18, background: '#FEF3C7', border: '1.5px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpenIcon color="#D97706" />
                </div>
                <p style={{ fontSize: 15, color: '#6B7280', margin: 0, fontWeight: 500 }}>No tutes uploaded yet.</p>
                <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Check back later for new documents.</p>
              </div>
            )}

            {/* Month tabs + grid */}
            {!loading && totalCount > 0 && (
              <>
                {/* Month selector */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
                  {sortedMonths.map(m => (
                    <button
                      key={m}
                      className={`month-tab ${activeMonth === m ? 'month-tab-active' : 'month-tab-inactive'}`}
                      onClick={() => setActiveMonth(m)}
                    >
                      <CalendarIcon color={activeMonth === m ? 'white' : '#D97706'} />
                      {m}
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        background: activeMonth === m ? 'rgba(255,255,255,0.25)' : '#FEF3C7',
                        color: activeMonth === m ? 'white' : '#D97706',
                        padding: '1px 7px', borderRadius: 20,
                      }}>
                        {tutesByMonth[m].length}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Section header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ height: 3, width: 24, borderRadius: 4, background: 'linear-gradient(135deg, #FBBF24, #D97706)' }} />
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, color: '#111827', margin: 0 }}>
                    {activeMonth}
                  </h2>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#FEF3C7', color: '#D97706' }}>
                    {activeDocs.length} {activeDocs.length === 1 ? 'doc' : 'docs'}
                  </span>
                </div>

                {/* Cards grid */}
                <div className="tute-grid">
                  {activeDocs.map((doc) => {
                    const isHovered = hoveredId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        className="tute-card"
                        onMouseEnter={() => setHoveredId(doc.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <div className="tute-top-bar" />

                        {/* PDF Preview */}
                        <div style={{ position: 'relative', background: '#FEFCE8', borderBottom: '1.5px solid #E9EBF0', height: 180, overflow: 'hidden' }}>
                          <iframe
                            src={doc.fileUrl}
                            title={doc.fileName}
                            style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                          />
                          <div style={{ position: 'absolute', inset: 0 }} />
                        </div>

                        {/* Card body */}
                        <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: '#FEF3C7', border: '1.5px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                              <FileTextIcon />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {doc.title}
                              </h3>
                              <p style={{ fontSize: 11.5, color: '#9CA3AF', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {doc.fileName}
                              </p>
                            </div>
                          </div>

                          <div style={{ flexGrow: 1, minHeight: 10 }} />

                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tute-view-btn"
                            style={{
                              marginTop: 12,
                              background: isHovered ? 'linear-gradient(135deg, #F59E0B, #D97706)' : '#FEF3C7',
                              color: isHovered ? '#ffffff' : '#D97706',
                              borderColor: isHovered ? '#F59E0B' : '#FDE68A',
                            }}
                          >
                            <ExternalLinkIcon />
                            View Full PDF
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Tutes;
