import { motion } from 'framer-motion';

const CARDS = [
  { id: 'videos',  emoji: '🎬', title: 'Class Recordings', desc: 'Watch & replay your lessons',       btn: 'Watch Now',    href: '/WatchVideosFolder' },
  { id: 'results', emoji: '📊', title: 'Exam Results',     desc: 'Track your grades & progress',     btn: 'View Results', href: '/MarkSheets'        },
  { id: 'tutes',   emoji: '📚', title: 'Tutes',            desc: 'Study materials & documents',      btn: 'Browse',       href: '/docs/tutes'        },
  { id: 'other',   emoji: '📂', title: 'Other',            desc: 'More resources & content',         btn: 'Open',         href: '/Other'             },
];

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dash-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #FFFDF9;
    font-family: 'Inter', sans-serif;
  }

  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px;
    background: #FFFFFF;
    border-bottom: 1px solid #EDE8DF;
    flex-shrink: 0;
    height: 62px;
    position: sticky; top: 0; z-index: 10;
  }

  .body {
    flex: 1;
    display: flex;
  }

  /* Left */
  .left-panel {
    width: 300px; flex-shrink: 0;
    background: #FDF8F0;
    border-right: 1px solid #EDE8DF;
    display: flex; flex-direction: column;
    padding: 40px 32px 32px;
  }

  /* Right */
  .right-panel {
    flex: 1; min-width: 0;
    background: #FFFDF9;
    padding: 28px;
    display: flex; flex-direction: column;
  }

  .card-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .dash-card {
    background: #FFFFFF;
    border-radius: 20px;
    border: 1.5px solid #EDE8DF;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .dash-card:hover {
    transform: translateY(-5px);
    border-color: #F59E0B;
    box-shadow: 0 16px 40px rgba(245,158,11,0.14);
  }

  .card-inner {
    height: 100%;
    padding: 24px 22px 20px;
    display: flex; flex-direction: column;
    justify-content: space-between;
  }

  .card-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 30px;
    border: none;
    background: #F59E0B;
    color: #0F0F0F; font-weight: 700; font-size: 13px;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: background 0.18s, transform 0.15s;
    letter-spacing: 0.01em;
  }
  .card-btn:hover { background: #FBBF24; transform: translateY(-1px); }

  @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

  /* ── Mobile ── */
  @media (max-width: 700px) {
    .body { flex-direction: column; }
    .left-panel {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid #EDE8DF;
      padding: 32px 20px 24px;
    }
    .right-panel { padding: 20px 16px 32px; }
    .card-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .card-inner { padding: 18px 16px; }
    .topbar { padding: 0 20px; }
  }

  @media (max-width: 380px) {
    .card-grid { grid-template-columns: 1fr; }
  }
`;

export default function Dashboard2() {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="dash-root">
      <style>{STYLES}</style>

      {/* ── Top bar ── */}
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#FDE047,#F59E0B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>🐝</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F0F0F', fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.01em' }}>The Bee Academy</div>
            <div style={{ fontSize: 10, color: '#F59E0B', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Student Portal</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, color: '#16A34A', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', padding: '5px 13px', borderRadius: 999 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A', display: 'inline-block', animation: 'blink 2.2s ease-in-out infinite' }} />
          Active
        </div>
      </div>

      {/* ── Body ── */}
      <div className="body">

        {/* ── Left ── */}
        <div className="left-panel">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <p style={{ fontSize: 12.5, fontWeight: 500, color: '#B8A898', marginBottom: 16, letterSpacing: '0.01em' }}>
              {dateStr}
            </p>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 52,
              fontWeight: 700,
              color: '#1A1209',
              lineHeight: 1.05,
              letterSpacing: '-1px',
              marginBottom: 18,
            }}>
              Welcome<br />Back{' '}
              <span style={{ display: 'inline-block', animation: 'floatY 2.8s ease-in-out infinite', fontSize: 42 }}>👋</span>
            </h1>

            <div style={{ height: 4, width: 52, borderRadius: 4, background: '#F59E0B', marginBottom: 20 }} />

            <p style={{ fontSize: 15, color: '#8A7A68', lineHeight: 1.75, fontWeight: 400, maxWidth: 220 }}>
              Everything you need for your studies — all in one place.
            </p>
          </motion.div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#0F0F0F', borderRadius: 12,
            padding: '10px 16px', marginTop: 32, alignSelf: 'flex-start',
          }}>
            <span style={{ fontSize: 15 }}>🐝</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#F59E0B', letterSpacing: '0.02em' }}>Bee Academy 2026</span>
          </div>
        </div>

        {/* ── Right (cards) ── */}
        <div className="right-panel">
          <div className="card-grid">
            {CARDS.map((card, i) => (
              <motion.div
                key={card.id}
                className="dash-card"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => window.location.href = card.href}
              >
                <div className="card-inner">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: 14,
                      background: '#FEF9EE',
                      border: '1.5px solid #FDE68A',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24,
                    }}>
                      {card.emoji}
                    </div>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px rgba(245,158,11,0.5)' }} />
                  </div>

                  <div>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 24, fontWeight: 700,
                      color: '#1A1209', margin: '0 0 5px',
                      lineHeight: 1.15, letterSpacing: '-0.3px',
                    }}>
                      {card.title}
                    </p>
                    <p style={{ fontSize: 12.5, color: '#9A8A78', margin: '0 0 16px', lineHeight: 1.5 }}>
                      {card.desc}
                    </p>
                    <button className="card-btn" onClick={e => { e.stopPropagation(); window.location.href = card.href; }}>
                      {card.btn} <ArrowRight />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
