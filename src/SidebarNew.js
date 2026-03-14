import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  GraduationCap,
  LibraryBig,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import Logo from './assets/Logo.png';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', route: '/Dashboard2' },
  { icon: Video,           label: 'Videos',    route: '/WatchVideosFolder' },
  { icon: GraduationCap,  label: 'Marks',     route: '/MarkSheets' },
  { icon: LibraryBig,     label: 'Tutes',     route: '/docs/tutes' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  const goto = (route) => { navigate(route); setOpen(false); };

  /* ── Sidebar panel ─────────────────────────────────────────── */
  const Panel = () => (
    <div style={S.panel}>

      {/* Logo area */}
      <div style={S.logoWrap}>
        <div style={S.logoRing}>
          <img src={Logo} alt="Bee Academy" style={S.logoImg} />
        </div>
        <div>
          <div style={S.brandName}>Bee Academy</div>
          <div style={S.brandSub}>Student Portal</div>
        </div>
      </div>

      {/* Divider */}
      <div style={S.divider} />

      {/* Nav label */}
      <div style={S.navLabel}>NAVIGATION</div>

      {/* Menu items */}
      <nav style={S.nav}>
        {menuItems.map((item, i) => {
          const active = location.pathname === item.route;
          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 + 0.1, duration: 0.32, ease: [0.22,1,0.36,1] }}
              style={{
                ...S.navBtn,
                ...(active ? S.navBtnActive : {}),
              }}
              onClick={() => goto(item.route)}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(245,158,11,0.08)';
                  e.currentTarget.style.color = '#D97706';
                  e.currentTarget.querySelector('.nav-icon-wrap').style.background = 'rgba(245,158,11,0.12)';
                  e.currentTarget.querySelector('.nav-icon-wrap').style.color = '#D97706';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#6B7280';
                  e.currentTarget.querySelector('.nav-icon-wrap').style.background = 'rgba(107,114,128,0.07)';
                  e.currentTarget.querySelector('.nav-icon-wrap').style.color = '#9CA3AF';
                }
              }}
            >
              {/* Active indicator bar */}
              {active && <div style={S.activeBar} />}

              {/* Icon */}
              <div
                className="nav-icon-wrap"
                style={{
                  ...S.iconWrap,
                  background: active ? 'rgba(245,158,11,0.15)' : 'rgba(107,114,128,0.07)',
                  color: active ? '#D97706' : '#9CA3AF',
                }}
              >
                <item.icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              </div>

              {/* Label */}
              <span style={{
                ...S.navLabel2,
                color: active ? '#111' : '#6B7280',
                fontWeight: active ? 700 : 500,
              }}>
                {item.label}
              </span>

              {/* Active dot */}
              {active && <div style={S.activeDot} />}
            </motion.button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Bottom divider */}
      <div style={S.divider} />

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42 }}
        style={S.logoutBtn}
        onClick={() => navigate('/Signin')}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(239,68,68,0.07)';
          e.currentTarget.style.color = '#DC2626';
          e.currentTarget.querySelector('.logout-icon').style.color = '#DC2626';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#9CA3AF';
          e.currentTarget.querySelector('.logout-icon').style.color = '#9CA3AF';
        }}
      >
        <div style={S.logoutIconWrap}>
          <LogOut size={15} strokeWidth={1.8} className="logout-icon" style={{ color: '#9CA3AF', transition: 'color .2s' }} />
        </div>
        <span style={S.logoutLabel}>Sign Out</span>
      </motion.button>

      <div style={{ height: 10 }} />
    </div>
  );

  return (
    <>
      {/* ── Desktop: always visible ── */}
      <div style={S.desktopWrap} className="sidebar-desktop">
        <Panel />
      </div>

      {/* ── Mobile: hamburger + drawer ── */}
      <button
        style={S.hamburger}
        className="sidebar-hamburger"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} strokeWidth={2} color="#92400E" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={S.backdrop}
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
              style={S.drawer}
            >
              <button
                style={S.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} strokeWidth={2} color="#6B7280" />
              </button>
              <Panel />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        .sidebar-desktop { display: none; }
        .sidebar-hamburger { display: flex; }
        @media (min-width: 1024px) {
          .sidebar-desktop { display: block; }
          .sidebar-hamburger { display: none !important; }
        }
        button { font-family: 'DM Sans', sans-serif; border: none; cursor: pointer; }
      `}</style>
    </>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────────── */
const S = {
  /* Panel */
  panel: {
    width: 228,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#FFFFFF',
    borderRight: '1px solid rgba(245,158,11,0.14)',
    fontFamily: "'DM Sans', sans-serif",
    position: 'relative',
    boxShadow: '2px 0 20px rgba(0,0,0,0.05)',
  },

  /* Logo */
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '22px 20px 18px',
  },
  logoRing: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'linear-gradient(135deg,#FEF3C7,#FDE68A)',
    border: '1.5px solid rgba(245,158,11,0.28)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(245,158,11,0.18)',
    overflow: 'hidden',
    flexShrink: 0,
  },
  logoImg: { width: 34, height: 34, objectFit: 'contain' },
  brandName: {
    fontSize: 15,
    fontWeight: 700,
    color: '#111',
    letterSpacing: '-0.2px',
    lineHeight: 1.2,
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  brandSub: {
    fontSize: 9.5,
    color: '#B45309',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginTop: 2,
  },

  /* Dividers */
  divider: {
    height: 1,
    background: 'linear-gradient(90deg, rgba(245,158,11,0.18) 0%, transparent 90%)',
    margin: '0 16px',
  },

  /* Nav */
  navLabel: {
    fontSize: 9.5,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#D1C4B0',
    padding: '14px 22px 8px',
    textTransform: 'uppercase',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    padding: '0 12px',
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 11,
    padding: '9px 10px',
    borderRadius: 10,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background .18s ease, color .18s ease',
    width: '100%',
    textAlign: 'left',
    overflow: 'hidden',
  },
  navBtnActive: {
    background: 'rgba(245,158,11,0.07)',
    color: '#111',
  },
  activeBar: {
    position: 'absolute',
    left: 0, top: '18%', bottom: '18%',
    width: 3,
    background: 'linear-gradient(180deg,#F59E0B,#D97706)',
    borderRadius: '0 3px 3px 0',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background .18s ease, color .18s ease',
  },
  navLabel2: {
    fontSize: 13.5,
    letterSpacing: '-0.1px',
    flex: 1,
    transition: 'color .18s ease',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#F59E0B',
    flexShrink: 0,
  },

  /* Logout */
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 11,
    margin: '8px 12px 0',
    padding: '9px 10px',
    borderRadius: 10,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background .18s ease, color .18s ease',
    color: '#9CA3AF',
    width: 'calc(100% - 24px)',
  },
  logoutIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    background: 'rgba(107,114,128,0.07)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  logoutLabel: {
    fontSize: 13.5,
    fontWeight: 500,
    transition: 'color .18s ease',
  },

  /* Desktop wrapper */
  desktopWrap: {
    position: 'fixed',
    left: 0, top: 0, bottom: 0,
    zIndex: 20,
  },

  /* Mobile hamburger */
  hamburger: {
    position: 'fixed',
    top: 14, left: 14,
    zIndex: 50,
    width: 38, height: 38,
    borderRadius: 10,
    background: 'rgba(255,255,255,0.92)',
    border: '1px solid rgba(245,158,11,0.22)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    backdropFilter: 'blur(10px)',
  },

  /* Backdrop */
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    zIndex: 40,
    backdropFilter: 'blur(2px)',
  },

  /* Drawer (mobile) */
  drawer: {
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
    zIndex: 50,
  },

  /* Close button */
  closeBtn: {
    position: 'absolute',
    top: 14, right: 14,
    width: 30, height: 30,
    borderRadius: 8,
    background: 'rgba(107,114,128,0.08)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 1,
  },
};