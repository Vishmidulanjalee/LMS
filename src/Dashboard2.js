import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ─── Bee Logo ────────────────────────────────────────────────────────────────
const BeeLogoSVG = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="37" rx="13" ry="17" fill="#F59E0B" />
    <rect x="19" y="31" width="26" height="5" rx="2.5" fill="#1C1917" opacity="0.72" />
    <rect x="19" y="40" width="26" height="5" rx="2.5" fill="#1C1917" opacity="0.72" />
    <ellipse cx="32" cy="19" rx="9" ry="8" fill="#F59E0B" />
    <circle cx="28.5" cy="18" r="2" fill="#1C1917" />
    <circle cx="35.5" cy="18" r="2" fill="#1C1917" />
    <circle cx="29" cy="17.3" r="0.65" fill="white" />
    <circle cx="36" cy="17.3" r="0.65" fill="white" />
    <line x1="28" y1="11" x2="23" y2="5" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="22.5" cy="4.5" r="1.5" fill="#F59E0B" stroke="#1C1917" strokeWidth="1"/>
    <line x1="36" y1="11" x2="41" y2="5" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="41.5" cy="4.5" r="1.5" fill="#F59E0B" stroke="#1C1917" strokeWidth="1"/>
    <ellipse cx="18" cy="26" rx="11" ry="6.5" fill="white" fillOpacity="0.82" stroke="#E5E7EB" strokeWidth="0.8" transform="rotate(-18 18 26)" />
    <ellipse cx="46" cy="26" rx="11" ry="6.5" fill="white" fillOpacity="0.82" stroke="#E5E7EB" strokeWidth="0.8" transform="rotate(18 46 26)" />
    <polygon points="32,54 29,58 35,58" fill="#D97706" />
  </svg>
);

// ─── Icons ───────────────────────────────────────────────────────────────────
const VideoIcon   = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.258a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>;
const ResultsIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>;
const DocsIcon    = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>;
const ArrowIcon   = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>;
const InfoIcon    = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const StarIcon    = () => <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;

// ─── Floating Bubbles ─────────────────────────────────────────────────────────
const BUBBLES = [
  { size: 180, left: '8%',  top: '12%', delay: 0,    dur: 18, opacity: 0.13, color: '#FBBF24' },
  { size: 90,  left: '78%', top: '6%',  delay: 3,    dur: 22, opacity: 0.18, color: '#FCD34D' },
  { size: 130, left: '88%', top: '55%', delay: 1.5,  dur: 26, opacity: 0.10, color: '#F59E0B' },
  { size: 60,  left: '3%',  top: '68%', delay: 5,    dur: 20, opacity: 0.20, color: '#FBBF24' },
  { size: 220, left: '55%', top: '80%', delay: 2,    dur: 30, opacity: 0.07, color: '#FDE68A' },
  { size: 50,  left: '40%', top: '5%',  delay: 7,    dur: 16, opacity: 0.22, color: '#F59E0B' },
  { size: 100, left: '20%', top: '88%', delay: 4,    dur: 24, opacity: 0.12, color: '#FCD34D' },
  { size: 40,  left: '65%', top: '38%', delay: 6,    dur: 19, opacity: 0.16, color: '#FBBF24' },
  { size: 70,  left: '92%', top: '22%', delay: 2.5,  dur: 21, opacity: 0.14, color: '#F59E0B' },
];

const BubbleLayer = () => (
  <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
    {BUBBLES.map((b, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: b.left,
          top: b.top,
          width: b.size,
          height: b.size,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${b.color}cc, ${b.color}22)`,
          border: `1.5px solid ${b.color}55`,
          opacity: b.opacity,
          animation: `floatBubble${i % 3} ${b.dur}s ease-in-out ${b.delay}s infinite`,
          backdropFilter: 'blur(0px)',
        }}
      />
    ))}
  </div>
);

// ─── Cards data ──────────────────────────────────────────────────────────────
const CARDS = [
  {
    id: 'videos',
    icon: <VideoIcon />,
    tag: 'Lessons',
    title: 'Class Recordings',
    desc: 'Replay missed lessons and revisit key concepts at your own pace, any time.',
    btnLabel: 'Watch Now',
    href: '/WatchVideosFolder',
    accent: '#D97706',
    accentDark: '#B45309',
    accentBg: 'rgba(217,119,6,0.09)',
    stat: '24 videos',
  },
  {
    id: 'results',
    icon: <ResultsIcon />,
    tag: 'Academics',
    title: 'Exam Results',
    desc: 'Review your grades, track progress over time and identify areas to improve.',
    btnLabel: 'View Results',
    href: '/MarkSheets',
    accent: '#F59E0B',
    accentDark: '#D97706',
    accentBg: 'rgba(245,158,11,0.09)',
    stat: 'Up to date',
  },
  {
    id: 'docs',
    icon: <DocsIcon />,
    tag: 'Resources',
    title: 'Tutes',
    desc: 'Browse monthly tutorial documents and study materials for every topic.',
    btnLabel: 'Browse',
    href: '/docs/tutes',
    accent: '#B45309',
    accentDark: '#92400E',
    accentBg: 'rgba(180,83,9,0.09)',
    stat: '80+ files',
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={S.root}>

      <BubbleLayer />

      {/* ── Header ── */}
      <header style={S.header}>
        <div style={S.nav}>
          <div style={S.brand}>
            <div style={S.logoRing}>
              <BeeLogoSVG size={isMobile ? 28 : 34} />
            </div>
            <div>
              <div style={{ ...S.brandName, fontSize: isMobile ? 15 : 17.5 }}>The Bee Academy</div>
              <div style={S.brandTag}>Student Portal</div>
            </div>
          </div>
          <div style={S.pill}>
            <span style={S.dot} />
            {isMobile ? 'Active' : 'Portal Active'}
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{ ...S.main, padding: isMobile ? '28px 16px 24px' : '38px 28px 32px' }}>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          style={S.hero}
        >
          <div style={S.dateBadge}>
            <StarIcon /> &nbsp;{dateStr}
          </div>
          <h1 style={{ ...S.h1, fontSize: isMobile ? 32 : 46, letterSpacing: isMobile ? '-0.8px' : '-1.5px' }}>
            Welcome Back
          </h1>
          <p style={{ ...S.sub, fontSize: isMobile ? 14 : 15.5 }}>
            Everything you need for your studies — all in one place.
          </p>
        </motion.div>

        <div style={S.rule} />

        <div style={S.sectionLabel}>Your Learning Hub</div>

        {/* Cards */}
        <div style={S.stack}>
          {CARDS.map((c, i) => {
            const isHov = hovered === c.id;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.18, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  ...S.card,
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  padding: isMobile ? '18px 16px 18px 20px' : '20px 22px 20px 26px',
                  borderColor: isHov ? c.accent + '66' : 'rgba(0,0,0,0.07)',
                  boxShadow: isHov
                    ? `0 16px 40px rgba(0,0,0,0.10), 0 0 0 1.5px ${c.accent}44`
                    : '0 2px 8px rgba(0,0,0,0.05)',
                  transform: isHov && !isMobile ? 'translateY(-5px)' : 'translateY(0)',
                  background: isHov
                    ? `linear-gradient(135deg, #ffffff 0%, ${c.accentBg.replace('0.09)', '0.04)')} 100%)`
                    : '#ffffff',
                }}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => window.location.href = c.href}
              >
                {/* Left accent bar */}
                <div style={{
                  ...S.bar,
                  background: `linear-gradient(180deg, ${c.accent}, ${c.accentDark})`,
                  opacity: isHov ? 1 : 0.35,
                }} />

                {isMobile ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                      <div style={{
                        ...S.iconWrap,
                        width: 44, height: 44, borderRadius: 11,
                        background: isHov
                          ? `linear-gradient(135deg, ${c.accent}, ${c.accentDark})`
                          : c.accentBg,
                        color: isHov ? '#fff' : c.accent,
                        flexShrink: 0,
                      }}>
                        {c.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                          <span style={{ ...S.tagChip, color: c.accent, background: c.accentBg, border: `1px solid ${c.accent}33` }}>
                            {c.tag}
                          </span>
                          <span style={S.stat}>{c.stat}</span>
                        </div>
                        <div style={{ ...S.cardTitle, fontSize: 16 }}>{c.title}</div>
                      </div>
                    </div>
                    <div style={{ ...S.cardDesc, marginTop: 8, fontSize: 13 }}>{c.desc}</div>
                    <button
                      style={{
                        ...S.btn,
                        marginTop: 14,
                        width: '100%',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${c.accent}, ${c.accentDark})`,
                        color: '#fff',
                        borderColor: c.accent,
                        boxShadow: `0 4px 14px ${c.accent}44`,
                      }}
                      onClick={e => { e.stopPropagation(); window.location.href = c.href; }}
                    >
                      {c.btnLabel} <ArrowIcon />
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{
                      ...S.iconWrap,
                      background: isHov
                        ? `linear-gradient(135deg, ${c.accent}, ${c.accentDark})`
                        : c.accentBg,
                      color: isHov ? '#fff' : c.accent,
                      boxShadow: isHov ? `0 6px 18px ${c.accent}44` : 'none',
                      transform: isHov ? 'scale(1.08)' : 'scale(1)',
                    }}>
                      {c.icon}
                    </div>

                    <div style={S.body}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                        <span style={{ ...S.tagChip, color: c.accent, background: c.accentBg, border: `1px solid ${c.accent}33` }}>
                          {c.tag}
                        </span>
                        <span style={S.stat}>{c.stat}</span>
                      </div>
                      <div style={{ ...S.cardTitle, color: isHov ? '#0F0F0F' : '#1a1a1a' }}>{c.title}</div>
                      <div style={S.cardDesc}>{c.desc}</div>
                    </div>

                    <button
                      style={{
                        ...S.btn,
                        background: isHov
                          ? `linear-gradient(135deg, ${c.accent}, ${c.accentDark})`
                          : 'transparent',
                        color: isHov ? '#fff' : c.accent,
                        borderColor: c.accent,
                        boxShadow: isHov ? `0 4px 14px ${c.accent}44` : 'none',
                        transform: isHov ? 'translateY(-1px)' : 'none',
                      }}
                      onClick={e => { e.stopPropagation(); window.location.href = c.href; }}
                    >
                      {c.btnLabel} <ArrowIcon />
                    </button>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Help bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          style={{ ...S.help, padding: isMobile ? '11px 14px' : '12px 18px' }}
        >
          <div style={S.helpIcon}><InfoIcon /></div>
          <span style={{ ...S.helpText, fontSize: isMobile ? 12.5 : 13 }}>
            Need assistance? Contact your teacher or reach out to the academy administrator.
          </span>
        </motion.div>

      </main>

      {/* ── Footer ── */}
      <footer style={S.footer}>
        © {today.getFullYear()} The Bee Academy · All rights reserved
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes floatBubble0 {
          0%   { transform: translateY(0px) scale(1); }
          33%  { transform: translateY(-18px) scale(1.03); }
          66%  { transform: translateY(-8px) scale(0.98); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes floatBubble1 {
          0%   { transform: translateY(0px) translateX(0px) scale(1); }
          40%  { transform: translateY(-24px) translateX(10px) scale(1.04); }
          70%  { transform: translateY(-10px) translateX(-5px) scale(0.97); }
          100% { transform: translateY(0px) translateX(0px) scale(1); }
        }
        @keyframes floatBubble2 {
          0%   { transform: translateY(0px) scale(1); }
          50%  { transform: translateY(-14px) scale(1.02); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.78)} }
        button { font-family: 'DM Sans', sans-serif; cursor: pointer; }
      `}</style>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = {
  root: {
    minHeight: '100vh',
    background: '#ffffff',
    display: 'flex', flexDirection: 'column',
    fontFamily: "'DM Sans', sans-serif",
    position: 'relative', overflowX: 'hidden',
  },

  // Header
  header: {
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(245,158,11,0.18)',
    position: 'sticky', top: 0, zIndex: 30,
  },
  nav: {
    maxWidth: 780, margin: '0 auto', padding: '11px 16px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 11 },
  logoRing: {
    width: 44, height: 44,
    background: 'linear-gradient(135deg, #FEF08A, #FDE047, #FACC15)',
    border: '1.5px solid rgba(234,179,8,0.45)',
    borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 3px 14px rgba(234,179,8,0.35)',
    flexShrink: 0,
  },
  brandName: {
    fontWeight: 700, color: '#111', letterSpacing: '-0.3px',
    lineHeight: 1.2, fontFamily: "'Playfair Display', Georgia, serif",
  },
  brandTag: {
    fontSize: 10, color: '#B45309', fontWeight: 600,
    letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2,
  },
  pill: {
    display: 'flex', alignItems: 'center', gap: 7,
    fontSize: 12, fontWeight: 600, color: '#15803D',
    background: '#F0FDF4', border: '1px solid #BBF7D0',
    padding: '5px 12px', borderRadius: 999, flexShrink: 0,
  },
  dot: {
    width: 7, height: 7, borderRadius: '50%', background: '#22C55E',
    display: 'inline-block', animation: 'blink 2.2s ease-in-out infinite',
  },

  // Main
  main: {
    flex: 1, maxWidth: 780, width: '100%',
    margin: '0 auto',
    position: 'relative', zIndex: 1,
  },
  hero: { marginBottom: 20 },
  dateBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: 11.5, fontWeight: 600, color: '#92400E',
    background: 'linear-gradient(135deg, #FEF9C3, #FEF3C7)',
    border: '1px solid rgba(234,179,8,0.3)',
    padding: '4px 11px', borderRadius: 7, marginBottom: 13,
  },
  h1: {
    fontWeight: 800, color: '#0F0F0F',
    lineHeight: 1.08,
    fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 10,
  },
  sub: {
    color: '#92400E', opacity: 0.7,
    lineHeight: 1.6, fontWeight: 400, maxWidth: 480,
  },
  rule: {
    height: 1,
    background: 'linear-gradient(90deg, #FBBF24 0%, #FDE68A 40%, transparent 80%)',
    margin: '6px 0 20px',
  },
  sectionLabel: {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: '#C4A87A',
    marginBottom: 14,
  },

  // Cards
  stack: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: {
    background: '#ffffff',
    borderRadius: 16, border: '1.5px solid',
    display: 'flex', gap: 18,
    cursor: 'pointer', position: 'relative', overflow: 'hidden',
    transition: 'box-shadow .28s ease, transform .28s cubic-bezier(0.34,1.56,0.64,1), border-color .22s ease, background .22s ease',
  },
  bar: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
    borderRadius: '16px 0 0 16px',
    transition: 'opacity .22s ease',
  },
  iconWrap: {
    width: 50, height: 50, borderRadius: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    transition: 'background .22s ease, color .22s ease, transform .22s cubic-bezier(0.34,1.56,0.64,1), box-shadow .22s ease',
  },
  body: { flex: 1, minWidth: 0 },
  tagChip: {
    fontSize: 10.5, fontWeight: 700, letterSpacing: '0.07em',
    textTransform: 'uppercase', padding: '3px 8px', borderRadius: 6,
  },
  stat: { fontSize: 11, color: '#C4B5A5', fontWeight: 500 },
  cardTitle: {
    fontSize: 18, fontWeight: 700,
    fontFamily: "'Playfair Display', Georgia, serif",
    letterSpacing: '-0.3px', marginBottom: 4, lineHeight: 1.25,
    transition: 'color .18s ease',
  },
  cardDesc: {
    fontSize: 13, color: '#A78060', lineHeight: 1.58,
  },
  btn: {
    flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 13, fontWeight: 600, padding: '9px 17px',
    borderRadius: 10, border: '1.5px solid',
    transition: 'background .22s ease, color .22s ease, box-shadow .22s ease, transform .2s ease',
    whiteSpace: 'nowrap', letterSpacing: '0.01em',
  },

  // Help
  help: {
    marginTop: 16, display: 'flex', alignItems: 'center', gap: 12,
    background: 'linear-gradient(135deg, #FFFBEB, #FEF9C3)',
    border: '1px solid rgba(234,179,8,0.25)',
    borderRadius: 12,
  },
  helpIcon: {
    width: 32, height: 32, borderRadius: 9,
    background: 'linear-gradient(135deg, #FEF08A, #FDE047)',
    color: '#D97706',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  helpText: { color: '#92400E', opacity: 0.75, lineHeight: 1.55 },

  // Footer
  footer: {
    borderTop: '1px solid rgba(234,179,8,0.15)',
    background: '#ffffff',
    padding: '13px 16px',
    textAlign: 'center', fontSize: 11.5, color: '#C4A87A', fontWeight: 500,
    position: 'relative', zIndex: 1,
  },
};