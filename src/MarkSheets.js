import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Footer from './Footer';
import SidebarNew from './SidebarNew';

const months = [
  { name: 'July',      route: '/marks/july' },
  { name: 'August',    route: '/marks/august' },
  { name: 'September', route: '/marks/september' },
];

const monthMeta = [
  { color: '#fcba03', dark: '#fcba03', shadow: 'rgba(245,158,11,0.32)' },  // Amber
  { color: '#fcba03', dark: '#fcba03', shadow: 'rgba(251,191,36,0.32)' },  // Bright Yellow
  { color: '#fcba03', dark: '#fcba03', shadow: 'rgba(217,119,6,0.32)' },   // Deep Amber
];

// ── Icons ─────────────────────────────────────────────
const CalendarIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const ClipboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const SheetIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </svg>
);
const SpinnerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
    </path>
  </svg>
);
// ─────────────────────────────────────────────────────

const Marks = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const results = {};
        await Promise.all(
          months.map(async ({ name }) => {
            const q = query(collection(db, 'marksheets'), where('month', '==', name));
            const snap = await getDocs(q);
            results[name] = snap.size;
          })
        );
        setCounts(results);
      } catch (err) {
        console.error('Error fetching marksheet counts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const totalSheets = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }

        .mk-card {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          border: 1.5px solid #E5E7EB;
          transition: transform 0.26s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.26s ease, border-color 0.26s ease;
          cursor: pointer;
        }
        .mk-card:hover { transform: translateY(-8px); }

        .mk-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          width: 100%; padding: 11px 18px; border-radius: 10px;
          font-weight: 600; font-size: 13.5px; border: none; cursor: pointer;
          transition: filter 0.2s, transform 0.15s; letter-spacing: 0.01em; color: white;
        }
        .mk-btn:hover { filter: brightness(1.12); transform: translateY(-2px); }
        .mk-btn:active { transform: translateY(0); filter: brightness(0.96); }

        .mk-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 22px;
        }
        @media (max-width: 580px) { .mk-grid { grid-template-columns: 1fr; } }
        @media (min-width: 1024px) { .mk-content { margin-left: 228px; } }
        @media (max-width: 1023px) { .mk-header { padding-left: 60px !important; } }
      `}</style>

      <div style={{ display: 'flex', flexGrow: 1 }}>
        <SidebarNew activeItem="Marks" />

        <div className="mk-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* ── Header ── */}
          <header className="mk-header" style={{ background: 'white', borderBottom: '1px solid #E5E7EB', padding: '0 32px' }}>
            <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 13,
                  background: 'linear-gradient(135deg, #FBBF24, #D97706)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(245,158,11,0.42)',
                }}>
                  <ClipboardIcon />
                </div>
                <div>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 23, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>
                    View Mark Sheets
                  </h1>
                  <p style={{ fontSize: 13, color: '#9CA3AF', margin: '3px 0 0', fontWeight: 400 }}>
                    All mark sheets organized by month
                  </p>
                </div>
              </div>

              {!loading && totalSheets > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: 'black', borderRadius: 10, padding: '9px 16px',
                }}>
                  <SheetIcon size={16} />
                  <span style={{ fontSize: 13.5, color: 'white', fontWeight: 600 }}>
                    {totalSheets} total mark sheets
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* ── Cards Grid ── */}
          <main style={{ flexGrow: 1, padding: '30px 32px' }}>
            <div className="mk-grid">
              {months.map((month, index) => {
                const meta = monthMeta[index];
                const count = counts[month.name] ?? 0;
                const isHovered = hoveredIndex === index;

                return (
                  <div
                    key={index}
                    className="mk-card"
                    style={{
                      borderColor: isHovered ? meta.color : '#E5E7EB',
                      boxShadow: isHovered
                        ? `0 20px 52px ${meta.shadow}`
                        : '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Colored gradient header */}
                    <div style={{
                      background: `linear-gradient(135deg, ${meta.color}, ${meta.dark})`,
                      padding: '20px 20px 18px',
                      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                    }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 13,
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'transform 0.22s',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                      }}>
                        <CalendarIcon />
                      </div>

                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        fontSize: 12, fontWeight: 600, padding: '4px 11px', borderRadius: 20,
                        background: 'rgba(255,255,255,0.22)', color: 'white',
                      }}>
                        {loading ? <SpinnerIcon /> : <><SheetIcon size={12} />{count} {count === 1 ? 'sheet' : 'sheets'}</>}
                      </span>
                    </div>

                    {/* White body */}
                    <div style={{ padding: '18px 20px 20px' }}>
                      <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 20, fontWeight: 700, color: '#111827',
                        margin: '0 0 6px', letterSpacing: '-0.01em',
                      }}>
                        {month.name}
                      </h2>
                      <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 18px', lineHeight: 1.5 }}>
                        {loading ? 'Loading mark sheets…' : `${count} mark ${count === 1 ? 'sheet' : 'sheets'} available`}
                      </p>

                      <button
                        className="mk-btn"
                        onClick={() => navigate(month.route)}
                        style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.dark})` }}
                      >
                        <ArrowRightIcon />
                        View Mark Sheets
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Marks;
