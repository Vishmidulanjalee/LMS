import React, { useState, useEffect, useRef, useCallback } from 'react';
import Logo from './assets/Logo.png';
import HeroImg from './assets/home.jpg';

/* ════════════════════════════════════════════════════════════
   UTILITIES
════════════════════════════════════════════════════════════ */
const useReveal = (threshold = 0.08) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect(); }
    }, { threshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, vis];
};

const Counter = ({ to, suffix = '' }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(); const started = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let v = 0; const step = Math.ceil(to / 80);
        const t = setInterval(() => { v += step; if (v >= to) { setVal(to); clearInterval(t); } else setVal(v); }, 18);
      }
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

const Typewriter = ({ words, speed = 70, pause = 2200 }) => {
  const [text, setText] = useState('');
  const [wi, setWi] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[wi % words.length];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, text.length + 1));
        if (text.length + 1 === word.length) setTimeout(() => setDeleting(true), pause);
      } else {
        setText(word.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDeleting(false); setWi(p => (p + 1) % words.length); }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, wi, words, speed, pause]);
  return <span style={{ color: '#C8A000', borderRight: '3px solid #F7C900', paddingRight: 4 }}>{text}</span>;
};

const FontLoader = () => {
  useEffect(() => {
    const l = document.createElement('link');
    l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap';
    l.rel = 'stylesheet';
    document.head.appendChild(l);
  }, []);
  return null;
};

const GlobalStyles = () => {
  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: #fff; overflow-x: hidden; }

      @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
      @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
      @keyframes marquee   { from{transform:translateX(0)} to{transform:translateX(-33.33%)} }
      @keyframes shimmer   { 0%{background-position:-300% center} 100%{background-position:300% center} }
      @keyframes quoteFloat{ 0%,100%{transform:translateY(0) rotate(-8deg)} 50%{transform:translateY(-6px) rotate(-8deg)} }
      @keyframes waPulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }

      .a-up { animation: fadeUp .85s cubic-bezier(.22,1,.36,1) both; }
      .a-in { animation: fadeIn .8s ease both; }

      .nl {
        position:relative; font-size:11px; font-weight:600;
        letter-spacing:.2em; text-transform:uppercase;
        color:#555; text-decoration:none; transition:color .25s;
        font-family:'DM Sans',sans-serif;
      }
      .nl::after {
        content:''; position:absolute; bottom:-4px; left:0;
        height:2px; width:0; background:#F7C900; border-radius:1px;
        transition:width .38s cubic-bezier(.22,1,.36,1);
      }
      .nl:hover { color:#111; }
      .nl:hover::after { width:100%; }

      .bp {
        position:relative; overflow:hidden;
        display:inline-flex; align-items:center; justify-content:center; gap:9px;
        background:#111; color:#fff;
        padding:15px 36px; border-radius:60px; border:none;
        font-size:11px; font-weight:700; letter-spacing:.18em;
        text-transform:uppercase; text-decoration:none; cursor:pointer;
        transition:color .35s, box-shadow .35s, transform .3s cubic-bezier(.22,1,.36,1);
        font-family:'DM Sans',sans-serif; white-space:nowrap;
      }
      .bp::before { content:''; position:absolute; inset:0; background:#F7C900; clip-path:circle(0% at 50% 50%); transition:clip-path .52s cubic-bezier(.22,1,.36,1); z-index:0; }
      .bp:hover::before { clip-path:circle(140% at 50% 50%); }
      .bp:hover { color:#111; box-shadow:0 12px 40px rgba(247,201,0,.5); transform:translateY(-3px); }
      .bp>* { position:relative; z-index:1; }

      .bo {
        position:relative; overflow:hidden;
        display:inline-flex; align-items:center; justify-content:center; gap:9px;
        background:transparent; color:#111; padding:14px 32px; border-radius:60px; border:2px solid #111;
        font-size:11px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; text-decoration:none; cursor:pointer;
        transition:color .35s, transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s; font-family:'DM Sans',sans-serif; white-space:nowrap;
      }
      .bo::before { content:''; position:absolute; inset:0; border-radius:60px; background:#111; clip-path:circle(0% at 50% 50%); transition:clip-path .5s cubic-bezier(.22,1,.36,1); z-index:0; }
      .bo:hover::before { clip-path:circle(140% at 50% 50%); }
      .bo:hover { color:#fff; transform:translateY(-3px); box-shadow:0 10px 32px rgba(0,0,0,.2); }
      .bo>* { position:relative; z-index:1; }

      .by {
        position:relative; overflow:hidden;
        display:inline-flex; align-items:center; justify-content:center; gap:9px;
        background:#F7C900; color:#111; padding:15px 36px; border-radius:60px; border:none; cursor:pointer;
        font-size:11px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; text-decoration:none;
        transition:color .35s, transform .3s cubic-bezier(.22,1,.36,1), box-shadow .35s; font-family:'DM Sans',sans-serif; white-space:nowrap;
      }
      .by::before { content:''; position:absolute; inset:0; border-radius:60px; background:#111; clip-path:circle(0% at 50% 50%); transition:clip-path .52s cubic-bezier(.22,1,.36,1); z-index:0; }
      .by:hover::before { clip-path:circle(140% at 50% 50%); }
      .by:hover { color:#F7C900; box-shadow:0 12px 40px rgba(0,0,0,.28); transform:translateY(-3px); }
      .by>* { position:relative; z-index:1; }

      .bg {
        position:relative; overflow:hidden;
        display:inline-flex; align-items:center; justify-content:center; gap:9px;
        background:transparent; color:#fff; padding:14px 32px; border-radius:60px;
        border:2px solid rgba(255,255,255,.35);
        font-size:11px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; text-decoration:none; cursor:pointer;
        transition:color .35s, border-color .35s, transform .3s; font-family:'DM Sans',sans-serif; white-space:nowrap;
      }
      .bg::before { content:''; position:absolute; inset:0; border-radius:60px; background:rgba(255,255,255,.1); clip-path:circle(0% at 50% 50%); transition:clip-path .5s cubic-bezier(.22,1,.36,1); z-index:0; }
      .bg:hover::before { clip-path:circle(140% at 50% 50%); }
      .bg:hover { border-color:rgba(255,255,255,.7); transform:translateY(-3px); }
      .bg>* { position:relative; z-index:1; }

      .sc { transition:transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s; cursor:default; }
      .sc:hover { transform:translateY(-8px) scale(1.02); }

      .tp { transition:background .28s, border-color .28s, color .28s, transform .3s cubic-bezier(.22,1,.36,1); cursor:default; }
      .tp:hover { background:#F7C900!important; border-color:#F7C900!important; color:#111!important; transform:translateY(-3px) rotate(-1deg); }

      .tc { transition:transform .45s cubic-bezier(.22,1,.36,1), box-shadow .45s, background .3s, border-color .3s; cursor:default; position:relative; }
      .tc:hover { transform:translateY(-10px) rotate(0deg)!important; box-shadow:0 28px 72px rgba(0,0,0,.13)!important; border-color:#F7C900!important; z-index:10; }
      .tc .tc-quote { animation:quoteFloat 4s ease-in-out infinite; }
      .tc:hover .tc-bar { width:100%!important; }
      .tc-bar { transition:width .6s cubic-bezier(.22,1,.36,1); }
      .tc:hover .tc-avatar { transform:scale(1.12) rotate(-3deg); border-color:#F7C900!important; }
      .tc-avatar { transition:transform .4s cubic-bezier(.22,1,.36,1), border-color .3s; }

      .mc { transition:transform .38s cubic-bezier(.22,1,.36,1), box-shadow .38s, border-color .28s, background .28s; }
      .mc:hover { transform:translateX(8px); box-shadow:0 10px 40px rgba(247,201,0,.18)!important; border-color:#F7C900!important; background:#FFFCE6!important; }

      .soc { transition:transform .38s cubic-bezier(.22,1,.36,1), box-shadow .38s, background .3s, border-color .3s; }
      .soc:hover { transform:translateY(-8px); box-shadow:0 24px 64px rgba(247,201,0,.28)!important; background:#F7C900!important; border-color:#F7C900!important; }
      .soc:hover .soc-icon { background:rgba(0,0,0,.12)!important; }
      .soc:hover .soc-n { color:#111!important; }
      .soc:hover .soc-p,.soc:hover .soc-h { color:rgba(0,0,0,.5)!important; }
      .soc-icon,.soc-n,.soc-p,.soc-h { transition:background .3s, color .3s; }

      .gal-arrow { transition:background .28s, transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s; }
      .gal-arrow:hover { background:#F7C900!important; transform:scale(1.12)!important; box-shadow:0 8px 32px rgba(247,201,0,.4)!important; }
      .gal-dot { transition:width .35s cubic-bezier(.22,1,.36,1), background .35s; cursor:pointer; }

      .fq { border-bottom:1px solid #EBEBEB; transition:background .3s; }
      .fq:hover { background:rgba(247,201,0,.05); }

      .fi { transition:border-color .28s, box-shadow .28s, background .28s; }
      .fi:focus { outline:none; border-color:#F7C900!important; background:#FFFCE6!important; box-shadow:0 0 0 4px rgba(247,201,0,.18); }

      .wa-btn { animation:waPulse 2.5s ease-in-out infinite; transition:transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s; }
      .wa-btn:hover { animation:none; transform:scale(1.15)!important; box-shadow:0 16px 48px rgba(37,211,102,.6)!important; }

      ::-webkit-scrollbar { width:4px; }
      ::-webkit-scrollbar-track { background:#fff; }
      ::-webkit-scrollbar-thumb { background:#F7C900; border-radius:2px; }

      #sp { position:fixed; top:0; left:0; height:3px; background:linear-gradient(90deg,#F7C900,#FFE566,#F7C900); background-size:200% 100%; animation:shimmer 2s linear infinite; z-index:9999; transition:width .08s linear; box-shadow:0 0 10px rgba(247,201,0,.7); }

      /* ══ RESPONSIVE ══ */
      @media(max-width:1024px){
        .hero-grid    { grid-template-columns:1fr!important; }
        .hero-left    { padding-right:0!important; align-items:center!important; display:flex!important; flex-direction:column!important; text-align:center!important; }
        .hero-divider { justify-content:center!important; }
        .hero-avatars { justify-content:center!important; }
        .hero-btns    { justify-content:center!important; }
        .hero-right   { display:none!important; }
        .about-grid   { grid-template-columns:1fr!important; gap:56px!important; }
        .spoken-grid  { grid-template-columns:1fr!important; gap:48px!important; }
        .spoken-sticky{ position:static!important; }
        .faq-grid     { grid-template-columns:1fr!important; gap:48px!important; }
        .faq-sticky   { position:static!important; }
        .contact-grid { grid-template-columns:1fr!important; gap:48px!important; }
        .cta-inner    { flex-direction:column!important; text-align:center!important; align-items:center!important; }
        .social-grid  { grid-template-columns:repeat(2,1fr)!important; }
        .test-grid    { grid-template-columns:1fr!important; }
        .test-col-b   { margin-top:0!important; }
        .footer-inner { flex-direction:column!important; align-items:center!important; text-align:center!important; gap:20px!important; }
      }

      @media(max-width:768px){
        .nav-links-desktop { display:none!important; }
        .nav-burger        { display:flex!important; }
        .mobile-hero-img   { display:block!important; }
        .section-pad       { padding:64px 20px!important; }
        .gallery-section   { padding:60px 0 44px!important; }
        .gallery-inner     { padding:0 20px!important; }
        .gallery-header    { flex-direction:column!important; align-items:flex-start!important; }
        .gallery-sub       { text-align:left!important; max-width:none!important; }
      }

      @media(min-width:769px){
        .nav-burger      { display:none!important; }
        .mobile-hero-img { display:none!important; }
      }

      @media(max-width:640px){
        .hero-section  { padding:76px 20px 40px!important; min-height:auto!important; }
        .hero-h1       { font-size:clamp(2.8rem,11vw,4.4rem)!important; line-height:.92!important; }
        .about-stats   { grid-template-columns:1fr 1fr!important; gap:10px!important; }
        .stat-num      { font-size:2.8rem!important; }
        .stat-pad      { padding:22px 18px!important; }
        .social-grid   { grid-template-columns:1fr 1fr!important; }
        .soc-num       { font-size:2.6rem!important; }
        .soc-pad       { padding:24px 16px!important; }
        .test-header   { flex-direction:column!important; align-items:flex-start!important; gap:16px!important; }
        .hero-btns     { flex-direction:column!important; width:100%!important; }
        .hero-btns a,.hero-btns button { width:100%!important; justify-content:center!important; }
        .cta-btns      { flex-direction:column!important; width:100%!important; }
        .cta-btns a    { width:100%!important; justify-content:center!important; }
        .footer-socials{ flex-wrap:wrap!important; justify-content:center!important; gap:14px!important; }
        .contact-form  { padding:28px 20px!important; }
        .wa-btn        { width:52px!important; height:52px!important; bottom:18px!important; right:18px!important; }
        .mc            { transform:none!important; }
      }
    `;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);
  return null;
};

const ScrollProgress = () => {
  const ref = useRef();
  useEffect(() => {
    const fn = () => { const p = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100; if (ref.current) ref.current.style.width = p + '%'; };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return <div id="sp" ref={ref} />;
};

/* ════════════════════════════════════════════════════════════
   ICON
════════════════════════════════════════════════════════════ */
const Icon = ({ n, size = 18, color = 'currentColor', sw = 1.6 }) => {
  const d = {
    pin:    <><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></>,
    phone:  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.21 1.18 2 2 0 012.18.2H5.18a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>,
    mail:   <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    clock:  <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    yt:     <><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></>,
    ig:     <><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>,
    fb:     <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>,
    tt:     <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
    award:  <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
    check:  <polyline points="20 6 9 17 4 12"/>,
    star:   <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    mic:    <><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>,
    users:  <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    vol:    <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/></>,
    globe:  <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
    book:   <><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></>,
    rep:    <><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></>,
    arrow:  <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrowL: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    camera: <><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d[n]}</svg>;
};

const SLabel = ({ text, light = false }) => (
  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
    <div style={{ height:2, width:36, background:'#F7C900', borderRadius:1 }} />
    <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase', color: light ? 'rgba(247,201,0,.7)' : '#AAAAAA', fontFamily:"'DM Sans',sans-serif" }}>{text}</span>
  </div>
);

const tv = vis => ({
  opacity: vis ? 1 : 0,
  transform: vis ? 'translateY(0)' : 'translateY(30px)',
  transition: 'opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1)',
});

/* ════════════════════════════════════════════════════════════
   GALLERY CAROUSEL
════════════════════════════════════════════════════════════ */
const useIsMobile = () => {
  const [m, setM] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return m;
};

// GalleryCarousel removed — not in use
const _GalleryCarousel = ({ images, Y, B }) => {
  const [active, setActive] = useState(0);
  const total = images.length;
  const isMobile = useIsMobile();
  const touchStart = useRef(null);

  const prev = useCallback(() => setActive(a => (a - 1 + total) % total), [total]);
  const next = useCallback(() => setActive(a => (a + 1) % total), [total]);

  useEffect(() => {
    const fn = e => { if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [prev, next]);

  const onTouchStart = e => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = e => {
    if (!touchStart.current) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStart.current = null;
  };

  const getPos = i => {
    const d = ((i - active) % total + total) % total;
    if (d === 0) return 'active';
    if (d === 1) return 'right';
    if (d === total - 1) return 'left';
    return 'hidden';
  };

  const PlaceholderImg = ({ label, isActive }) => (
    <div style={{ width:'100%', height:'100%', background: isActive ? 'linear-gradient(135deg,#1a1a1a,#2d2d2d,#1a1a1a)' : 'linear-gradient(135deg,#2a2a2a,#3d3d3d)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(247,201,0,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(247,201,0,.04) 1px,transparent 1px)`, backgroundSize:'40px 40px' }} />
      <div style={{ width:52, height:52, borderRadius:'50%', background: isActive ? Y : 'rgba(247,201,0,.15)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:1 }}>
        <Icon n="camera" size={20} color={isActive ? B : 'rgba(247,201,0,.5)'} sw={1.5} />
      </div>
      <p style={{ fontSize:'.82rem', fontWeight:700, color: isActive ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.3)', fontFamily:"'DM Sans',sans-serif", position:'relative', zIndex:1, textAlign:'center', padding:'0 16px' }}>{label}</p>
    </div>
  );

  const LabelOverlay = ({ idx }) => (
    <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(to top,rgba(0,0,0,.75) 0%,transparent 100%)', padding: isMobile ? '24px 18px 16px' : '32px 28px 24px' }}>
      <p style={{ fontSize:'.6rem', fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase', color:Y, margin:'0 0 4px', fontFamily:"'DM Sans',sans-serif" }}>Class Gallery</p>
      <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', fontWeight:700, color:'#fff', margin:'0 0 3px', fontFamily:"'Playfair Display',serif" }}>{images[idx].label}</p>
      <p style={{ fontSize:'.76rem', color:'rgba(255,255,255,.55)', margin:0, fontFamily:"'DM Sans',sans-serif" }}>{images[idx].sub}</p>
    </div>
  );

  const Dots = () => (
    <div style={{ display:'flex', gap:8, alignItems:'center', marginTop: isMobile ? 18 : 28 }}>
      {images.map((_,i) => <div key={i} className="gal-dot" onClick={() => setActive(i)} style={{ height: isMobile ? 5 : 6, borderRadius:3, width: i===active ? (isMobile?26:32) : (isMobile?5:6), background: i===active ? Y : 'rgba(255,255,255,.2)' }} />)}
    </div>
  );

  const Counter = () => (
    <p style={{ marginTop:12, fontSize:'.7rem', fontWeight:700, letterSpacing:'.2em', color:'rgba(255,255,255,.28)', fontFamily:"'DM Sans',sans-serif", textTransform:'uppercase' }}>
      {String(active+1).padStart(2,'0')} / {String(total).padStart(2,'0')}
    </p>
  );

  /* ── MOBILE ── */
  if (isMobile) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
        <div style={{ width:'100%', borderRadius:18, overflow:'hidden', height:260, position:'relative', border:'2px solid rgba(247,201,0,.22)', boxShadow:'0 20px 60px rgba(0,0,0,.4)' }}
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {images[active].src
            ? <img src={images[active].src} alt={images[active].label} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
            : <PlaceholderImg label={images[active].label} isActive />
          }
          <LabelOverlay idx={active} />
          <button onClick={prev} className="gal-arrow" aria-label="Prev" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,.9)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', zIndex:5 }}>
            <Icon n="arrowL" size={16} color={B} sw={2.2} />
          </button>
          <button onClick={next} className="gal-arrow" aria-label="Next" style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,.9)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', zIndex:5 }}>
            <Icon n="arrow" size={16} color={B} sw={2.2} />
          </button>
        </div>
        <Dots /><Counter />
      </div>
    );
  }

  /* ── DESKTOP ── */
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
      <div style={{ width:'100%', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', height:420 }}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {[...Array(total)].map((_,i) => {
          const pos = getPos(i);
          if (pos === 'hidden') return null;
          const isActive = pos==='active', isLeft=pos==='left', isRight=pos==='right';
          return (
            <div key={i} onClick={() => !isActive && setActive(i)} style={{
              position:'absolute',
              width: isActive ? '58%' : '28%',
              height: isActive ? 400 : 300,
              borderRadius: isActive ? 24 : 18,
              overflow:'hidden', zIndex: isActive ? 10 : 5,
              left: isLeft ? '1%' : isRight ? 'auto' : '21%',
              right: isRight ? '1%' : 'auto',
              opacity: isActive ? 1 : 0.55,
              filter: isActive ? 'none' : 'brightness(0.65) saturate(0.7)',
              boxShadow: isActive ? '0 32px 80px rgba(0,0,0,.32),0 0 0 2px rgba(247,201,0,.25)' : '0 8px 32px rgba(0,0,0,.18)',
              border: isActive ? '2px solid rgba(247,201,0,.3)' : '2px solid transparent',
              cursor: isActive ? 'default' : 'pointer',
              transition:'all .55s cubic-bezier(.22,1,.36,1)',
            }}>
              {images[i].src ? <img src={images[i].src} alt={images[i].label} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} /> : <PlaceholderImg label={images[i].label} isActive={isActive} />}
              {isActive && <LabelOverlay idx={i} />}
              {!isActive && <div style={{ position:'absolute', bottom:12, left:0, right:0, textAlign:'center' }}><p style={{ fontSize:'.7rem', fontWeight:700, color:'rgba(255,255,255,.6)', fontFamily:"'DM Sans',sans-serif", margin:0 }}>{images[i].label}</p></div>}
            </div>
          );
        })}
        <button onClick={prev} className="gal-arrow" aria-label="Prev" style={{ position:'absolute', left:0, zIndex:20, width:52, height:52, borderRadius:'50%', background:'rgba(255,255,255,.92)', border:'1.5px solid rgba(0,0,0,.08)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 4px 20px rgba(0,0,0,.12)' }}>
          <Icon n="arrowL" size={19} color={B} sw={2} />
        </button>
        <button onClick={next} className="gal-arrow" aria-label="Next" style={{ position:'absolute', right:0, zIndex:20, width:52, height:52, borderRadius:'50%', background:'rgba(255,255,255,.92)', border:'1.5px solid rgba(0,0,0,.08)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 4px 20px rgba(0,0,0,.12)' }}>
          <Icon n="arrow" size={19} color={B} sw={2} />
        </button>
      </div>
      <Dots /><Counter />
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   REVIEW CARD
════════════════════════════════════════════════════════════ */
const ReviewCard = ({ name, grade, text, tilt, Y, B, W, featured }) => {
  const initials = name.split(' ').map(w => w[0]).join('');
  const avatarColors = ['#1a1a2e','#16213e','#0f3460','#533483','#2b2d42'];
  const colorIdx = name.charCodeAt(0) % avatarColors.length;
  return (
    <div className="tc" style={{ background: featured?B:W, border:`2px solid ${featured?Y:'#EBEBEB'}`, borderRadius:22, padding:'28px 26px 24px', transform:`rotate(${tilt}deg)`, boxShadow: featured?'0 16px 56px rgba(0,0,0,.18)':'0 2px 16px rgba(0,0,0,.06)', position:'relative', overflow:'hidden' }}>
      <div className="tc-quote" style={{ position:'absolute', top:-8, right:20, fontFamily:"'Playfair Display',serif", fontSize:'9rem', fontWeight:900, lineHeight:1, color: featured?'rgba(247,201,0,.12)':'rgba(0,0,0,.04)', pointerEvents:'none', userSelect:'none', transform:'rotate(-8deg)' }}>"</div>
      <div className="tc-bar" style={{ position:'absolute', top:0, left:0, height:3, width: featured?'100%':'40%', background:Y, borderRadius:'22px 22px 0 0' }} />
      <div style={{ display:'flex', gap:3, marginBottom:14 }}>{Array(5).fill(0).map((_,s) => <Icon key={s} n="star" size={12} color={Y} sw={0} />)}</div>
      <p style={{ fontSize:'.91rem', lineHeight:1.82, color: featured?'rgba(255,255,255,.82)':'#555', margin:'0 0 20px', fontWeight:400, fontFamily:"'DM Sans',sans-serif", position:'relative', zIndex:1 }}>{text}</p>
      <div style={{ height:1, background: featured?'rgba(255,255,255,.1)':'#F0F0F0', marginBottom:18 }} />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div className="tc-avatar" style={{ width:40, height:40, borderRadius:'50%', background: featured?Y:avatarColors[colorIdx], display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${featured?'rgba(255,255,255,.3)':'#E8E8E8'}`, flexShrink:0 }}>
            <span style={{ fontSize:'.68rem', fontWeight:800, color: featured?B:'#fff', fontFamily:"'DM Sans',sans-serif" }}>{initials}</span>
          </div>
          <div>
            <p style={{ fontWeight:700, fontSize:'.84rem', color: featured?'#fff':B, margin:0, fontFamily:"'DM Sans',sans-serif" }}>{name}</p>
            <p style={{ fontSize:'.68rem', color: featured?'rgba(255,255,255,.45)':'#B0B0B0', margin:'2px 0 0', fontFamily:"'DM Sans',sans-serif" }}>{grade}</p>
          </div>
        </div>
        <div style={{ background: featured?Y:'#0E0E0E', borderRadius:60, padding:'4px 11px', display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
          <Icon n="award" size={9} color={featured?B:Y} sw={2} />
          <span style={{ fontSize:'.58rem', fontWeight:800, color: featured?B:Y, letterSpacing:'.1em', fontFamily:"'DM Sans',sans-serif" }}>A GRADE</span>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   NAVBAR
════════════════════════════════════════════════════════════ */
const Navbar = ({ scrollY }) => {
  const sc = scrollY > 60;
  const [mOpen, setMOpen] = useState(false);
  const links = [['#about','About'],['#spoken','Spoken'],['#gallery','Gallery'],['#testimonials','Reviews'],['#faq','FAQ'],['#contact','Enroll']];
  return (
    <>
      <nav style={{ position:'fixed', top:0, width:'100%', zIndex:200, padding: sc?'8px 16px':'14px 16px', transition:'padding .4s ease' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', background: sc?'rgba(255,255,255,.97)':'rgba(255,255,255,.92)', backdropFilter:'blur(24px)', border:'1px solid rgba(0,0,0,.06)', padding:'10px 22px', borderRadius:60, boxShadow: sc?'0 6px 48px rgba(0,0,0,.09)':'0 2px 20px rgba(0,0,0,.05)', transition:'all .4s ease' }}>
          <img src={Logo} alt="The Bee Academy" style={{ height:26 }} />
          <div className="nav-links-desktop" style={{ display:'flex', gap:28, alignItems:'center' }}>
            {links.map(([href,label]) => <a key={href} href={href} className="nl">{label}</a>)}
            <a href="/Signin" className="bp" style={{ padding:'9px 22px', fontSize:10 }}><span>Portal</span></a>
          </div>
          <button className="nav-burger" onClick={() => setMOpen(true)} aria-label="Open menu"
            style={{ display:'none', flexDirection:'column', gap:5, background:'none', border:'none', cursor:'pointer', padding:8 }}>
            <span style={{ display:'block', width:22, height:2, background:'#111', borderRadius:2 }} />
            <span style={{ display:'block', width:22, height:2, background:'#111', borderRadius:2 }} />
            <span style={{ display:'block', width:16, height:2, background:'#111', borderRadius:2 }} />
          </button>
        </div>
      </nav>

      {mOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:400, display:'flex' }}>
          <div style={{ flex:1, background:'rgba(0,0,0,.45)', backdropFilter:'blur(4px)' }} onClick={() => setMOpen(false)} />
          <div style={{ width:280, background:'#fff', padding:'24px 26px', display:'flex', flexDirection:'column', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
              <img src={Logo} style={{ height:26 }} alt="logo" />
              <button onClick={() => setMOpen(false)} style={{ background:'#F3F4F6', border:'none', borderRadius:8, width:32, height:32, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#555' }}>✕</button>
            </div>
            {links.map(([href,label]) => (
              <a key={href} href={href} onClick={() => setMOpen(false)} style={{ fontSize:15, fontWeight:600, color:'#111', textDecoration:'none', padding:'14px 0', borderBottom:'1px solid #F3F4F6', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                {label}<span style={{ color:'#F7C900', fontSize:18 }}>›</span>
              </a>
            ))}
            <a href="/Signin" className="bp" style={{ marginTop:24, justifyContent:'center', padding:'14px 24px', fontSize:11 }}><span>Go to Portal</span></a>
            <a href="https://wa.me/94769872173" target="_blank" rel="noopener noreferrer" style={{ marginTop:12, display:'flex', alignItems:'center', justifyContent:'center', gap:10, background:'#25D366', color:'#fff', textDecoration:'none', borderRadius:60, padding:'13px 24px', fontSize:11, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      )}
    </>
  );
};

/* ════════════════════════════════════════════════════════════
   HOME
════════════════════════════════════════════════════════════ */
const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name:'', phone:'', grade:'', message:'' });
  const [sent, setSent] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const [aboutRef,  aboutVis]  = useReveal();
  const [statsRef,  statsVis]  = useReveal();
  const [spokenRef, spokenVis] = useReveal();
  const [socialRef, socialVis] = useReveal();
  const [testRef,   testVis]   = useReveal();
  const [ctaRef,    ctaVis]    = useReveal();
  const [faqRef,    faqVis]    = useReveal();
  const [contRef,   contVis]   = useReveal();

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const Y = '#F7C900', B = '#0E0E0E', W = '#FFFFFF';

  const testimonials = [
    { name:'Tharindu Perera',     grade:'O/L 2024', text:"Sir made grammar finally make sense. I went from struggling to getting a B in my mocks. His explanations are so clear and structured." },
    { name:'Sanduni Jayawardena', grade:'O/L 2024', text:"The essay structures sir taught were easy to follow. I finally understood how to write a proper composition with confidence." },
    { name:'Kasun Bandara',       grade:'O/L 2023', text:"Honestly the best English tutor. Perfect balance of depth and clarity — nobody gets left behind in class." },
    { name:'Nimasha Fernando',    grade:'O/L 2024', text:"My comprehension marks went from 40% to 85% in one term. The way sir breaks down passages is absolutely brilliant." },
    { name:'Dulith Rathnayake',   grade:'O/L 2023', text:"I used to dread the oral exam. After sir's spoken sessions I felt completely confident walking in. Got an A!" },
    { name:'Amaya Senanayake',    grade:'O/L 2024', text:"The portal recordings are a lifesaver. I rewatch the letter-writing lessons every time I have an assignment." },
    { name:'Ruwanthi Silva',      grade:'O/L 2023', text:"The way sir teaches comprehension is unlike anything else. He breaks down every question type so it becomes predictable." },
    { name:'Pasindu Wickrama',    grade:'O/L 2024', text:"Joined halfway through the term and still managed to catch up completely. The structured notes made all the difference." },
  ];

  const faqs = [
    { q:'What levels does The Bee Academy cover?',  a:'We specialise in English language for O/L students (Grade 10 & 11) following the Sri Lankan national curriculum.' },
    //{ q:'Are classes online, physical, or both?',   a:'Both — in-person sessions are held weekly, and every class is recorded and uploaded to the student portal.' },
    { q:'What topics are covered?',                 a:'All O/L English components: grammar, comprehension, essay & letter writing, directed writing, oral English, and listening skills.' },
    { q:'Are printed tutes provided?',              a:'Yes — all study materials are professionally printed and couriered directly to your home anywhere in Sri Lanka.' },
    { q:'Can I watch class recordings?',            a:'Absolutely. Every class is recorded in full HD and uploaded to the portal within 24 hours. Rewatch forever.' },
    //{ q:'How are examss conducted?',           a:'All assessments are held online through the student portal. Marks are available immediately upon submission.' },
    { q:'How do I enroll?',                         a:"Fill in the form below and we'll reach out within 24 hours to confirm your spot and share the class schedule." },
    { q:'Can I access old recordings?',             a:'Yes — every lesson is archived in the portal indefinitely. Rewatch any class from any term at any time.' },
  ];

  const socials = [
    { platform:'YouTube',   handle:'@BeeAcademy',    followers:48, icon:'yt' },
    { platform:'Instagram', handle:'@bee.academy',   followers:32, icon:'ig' },
    { platform:'Facebook',  handle:'Bee Academy LK', followers:61, icon:'fb' },
    { platform:'TikTok',    handle:'@beeacademy',    followers:19, icon:'tt' },
  ];

  const spokenModules = [
    { num:'01', icon:'mic',   title:'Pronunciation & Phonics',  desc:'Targeted phonetic drills and guided audio exercises for Sri Lankan learners.' },
    { num:'02', icon:'vol',   title:'Spoken Grammar',           desc:'How grammar flows naturally in conversation — not just on paper.' },
    { num:'03', icon:'award', title:'Oral Exam Preparation',    desc:'Picture description, conversation practice, and reading aloud for O/L.' },
    { num:'04', icon:'globe', title:'Everyday Communication',   desc:'Real confidence through discussions, presentations, and situational role-play.' },
    { num:'05', icon:'book',  title:'Listening & Response',     desc:'Comprehension through listening exercises matched to exam difficulty.' },
    { num:'06', icon:'rep',   title:'Vocabulary in Context',    desc:'Expand spoken vocabulary through storytelling and live class practice.' },
  ];

  const tilts = [-1.2, 0.8, -0.6, 1.0, -0.9, 0.7, -1.1, 0.5];

  return (
    <div style={{ minHeight:'100vh', background:W, color:B, fontFamily:"'DM Sans',sans-serif", overflowX:'hidden' }}>
      <FontLoader /><GlobalStyles /><ScrollProgress />
      <Navbar scrollY={scrollY} />

      {/* ── HERO ── */}
      <section className="hero-section" style={{ maxWidth:1280, margin:'0 auto', padding:'100px 40px 60px', minHeight:'100vh', display:'flex', alignItems:'center', position:'relative' }}>
        <div style={{ position:'absolute', top:0, right:'46%', bottom:0, width:1, background:'linear-gradient(to bottom,transparent,rgba(0,0,0,.05) 25%,rgba(0,0,0,.05) 75%,transparent)', pointerEvents:'none' }} />
        <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, alignItems:'center', width:'100%' }}>

          <div className="hero-left" style={{ paddingRight:80 }}>
            <div className="a-up" style={{ animationDelay:'.05s', display:'inline-flex', alignItems:'center', gap:10, marginBottom:28, padding:'7px 18px 7px 9px', background:Y, borderRadius:60 }}>
              <div style={{ width:26, height:26, background:B, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon n="award" size={13} color={Y} sw={2} />
              </div>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.38em', textTransform:'uppercase', color:B, fontFamily:"'DM Sans',sans-serif" }}>The Bee Academy · O/L English</span>
            </div>

            {/* Mobile hero photo */}
            <div className="mobile-hero-img" style={{ display:'none', width:'100%', maxWidth:300, margin:'0 auto 24px', position:'relative' }}>
              <div style={{ position:'absolute', bottom:'5%', right:'5%', width:140, height:140, borderRadius:'50%', background:'radial-gradient(circle,rgba(247,201,0,.28) 0%,transparent 68%)', zIndex:0 }} />
              <img src={HeroImg} alt="Gishan Dhananjaya" style={{ width:'100%', height:'auto', display:'block', position:'relative', zIndex:1, maskImage:'linear-gradient(to bottom,black 60%,transparent 96%)', WebkitMaskImage:'linear-gradient(to bottom,black 60%,transparent 96%)' }} />
            </div>

            <div className="a-up" style={{ animationDelay:'.12s', marginBottom:14 }}>
              <h1 className="hero-h1" style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(3.4rem,7vw,8rem)', fontWeight:900, lineHeight:0.9, letterSpacing:'-.03em', color:B, margin:0 }}>
                Gishan<br /><em style={{ fontWeight:900, fontStyle:'italic', color:Y }}>Dhananjaya</em>
              </h1>
            </div>

            <div className="hero-divider a-up" style={{ animationDelay:'.2s', display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
              <div style={{ height:3, width:48, background:Y, borderRadius:2 }} />
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500, letterSpacing:'.22em', textTransform:'uppercase', color:'#888' }}>
                <Typewriter words={['Grammar Expert','Essay Coach','Oral Specialist','Comprehension','Language Fluency']} />
              </span>
            </div>

            <p className="a-up" style={{ animationDelay:'.26s', fontSize:'1.04rem', color:'#555', lineHeight:1.95, maxWidth:440, marginBottom:32, fontWeight:400 }}>
              Sri Lanka's foremost O/L English educator — building confident communicators and exam-ready students since 2018.
            </p>

            <div className="hero-btns a-up" style={{ animationDelay:'.32s', display:'flex', gap:12, alignItems:'center', marginBottom:32, flexWrap:'wrap' }}>
              <a href="#contact" className="bp"><span>Enroll Now</span><Icon n="arrow" size={15} color="currentColor" sw={2} /></a>
              <a href="#about"   className="bo"><span>Discover More</span></a>
            </div>

            <div className="hero-avatars a-up" style={{ animationDelay:'.38s', display:'flex', alignItems:'center', gap:18, paddingTop:22, borderTop:'1px solid #EBEBEB' }}>
              <div style={{ display:'flex' }}>
                {['#C8B000','#A89200','#D0BC18','#B6A400','#F7C900'].map((c,i) => (
                  <div key={i} style={{ width:32, height:32, borderRadius:'50%', background:c, border:'3px solid #fff', marginLeft: i?-10:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:5-i, fontSize:9, fontWeight:800, color:B, fontFamily:"'DM Sans',sans-serif" }}>
                    {['GP','SJ','KB','NF','+'][i]}
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontSize:'.9rem', fontWeight:800, color:B, margin:0 }}>2,000+ Students</p>
                <p style={{ fontSize:'.72rem', color:'#AAA', margin:'2px 0 0' }}>trust The Bee Academy</p>
              </div>
            </div>
          </div>

          {/* Desktop image */}
          <div className="hero-right a-in" style={{ animationDelay:'.18s', position:'relative', display:'flex', justifyContent:'center', alignItems:'flex-end' }}>
            <div style={{ position:'absolute', top:'4%', left:'-2%', width:130, height:130, backgroundImage:`radial-gradient(circle,#E8C800 1.2px,transparent 1.2px)`, backgroundSize:'15px 15px', opacity:.32, zIndex:0, pointerEvents:'none' }} />
            <div style={{ position:'absolute', bottom:'8%', right:'6%', width:240, height:240, borderRadius:'50%', background:'radial-gradient(circle,rgba(247,201,0,.22) 0%,transparent 68%)', zIndex:0, pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1, width:'92%' }}>
              <img src={HeroImg} alt="Gishan Dhananjaya" style={{ width:'100%', height:'auto', objectFit:'contain', display:'block', maskImage:'linear-gradient(to bottom,black 52%,transparent 94%),linear-gradient(to right,transparent 0%,black 8%,black 94%,transparent 100%)', WebkitMaskImage:'linear-gradient(to bottom,black 52%,transparent 94%),linear-gradient(to right,transparent 0%,black 8%,black 94%,transparent 100%)', maskComposite:'intersect', WebkitMaskComposite:'source-in' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background:B, padding:'15px 0', overflow:'hidden' }}>
        <div style={{ display:'flex', width:'max-content', animation:'marquee 26s linear infinite' }}>
          {[...Array(3)].map((_,r) =>
            ['Grammar Mastery','·','Essay Writing','·','Comprehension','·','Oral Skills','·','Letter Writing','·','O/L English','·','Spoken English','·','Island Rank Academy','·'].map((t,i) => (
              <span key={`${r}-${i}`} style={{ fontSize:10, fontWeight:700, letterSpacing: t==='·'?0:'.24em', textTransform:'uppercase', whiteSpace:'nowrap', padding:'0 18px', color: t==='·'?Y:'rgba(255,255,255,.22)', fontFamily:"'DM Sans',sans-serif" }}>{t}</span>
            ))
          )}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section id="about" ref={aboutRef} className="section-pad" style={{ maxWidth:1280, margin:'0 auto', padding:'100px 40px', ...tv(aboutVis) }}>
        <div className="about-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:100, alignItems:'center' }}>
          <div>
            <SLabel text="About the Educator" />
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.4rem,4.5vw,5rem)', fontWeight:700, lineHeight:1.06, marginBottom:20, color:B }}>
              English isn't just a subject —<br /><em style={{ fontStyle:'italic', color:'#C8A000' }}>it's your voice.</em>
            </h2>
            <p style={{ fontSize:'1.02rem', color:'#555', lineHeight:2, marginBottom:14 }}>Gishan Dhananjaya is one of Sri Lanka's most celebrated O/L English educators — recognised for transforming even the most hesitant students into confident communicators.</p>
            <p style={{ fontSize:'1.02rem', color:'#555', lineHeight:2, marginBottom:30 }}>His methodology: make English <strong style={{ color:B }}>feel natural</strong>. Every lesson builds both competence and genuine confidence.</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {['O/L English Specialist','8+ Years Teaching','500+ A Grades','Online Portal'].map(t => (
                <span key={t} className="tp" style={{ fontSize:'.78rem', fontWeight:600, padding:'8px 16px', borderRadius:60, background:W, color:B, border:'1.5px solid #E0E0E0', fontFamily:"'DM Sans',sans-serif" }}>{t}</span>
              ))}
            </div>
          </div>

          <div ref={statsRef} className="about-stats" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, ...tv(statsVis) }}>
            {[
              { val:8,   suf:'+', label:'Years Teaching',  bg:B, num:Y, sub:'rgba(255,255,255,.3)' },
              { val:2000, suf:'+', label:'Students Guided', bg:Y, num:B, sub:'rgba(0,0,0,.4)' },
              { val:500,  suf:'+', label:'A Grade Results', bg:Y, num:B, sub:'rgba(0,0,0,.4)' },
              { val:100,   suf:'%', label:'Pass Rate',       bg:B, num:Y, sub:'rgba(255,255,255,.3)' },
            ].map(({ val,suf,label,bg,num,sub }) => (
              <div key={label} className="sc stat-pad" style={{ background:bg, borderRadius:20, padding:'34px 26px' }}>
                <p className="stat-num" style={{ fontFamily:"'Playfair Display',serif", fontSize:'3.8rem', fontWeight:900, color:num, lineHeight:1, margin:'0 0 10px' }}><Counter to={val} suffix={suf} /></p>
                <div style={{ height:2, width:26, background:num, opacity:.22, marginBottom:10, borderRadius:1 }} />
                <p style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', margin:0, color:sub, fontFamily:"'DM Sans',sans-serif" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPOKEN ── */}
      <section id="spoken" ref={spokenRef} className="section-pad" style={{ maxWidth:1280, margin:'0 auto', padding:'100px 40px', ...tv(spokenVis) }}>
        <div className="spoken-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:90, alignItems:'start' }}>
          <div className="spoken-sticky" style={{ position:'sticky', top:110 }}>
            <SLabel text="Spoken English" />
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.4rem,4.5vw,5rem)', fontWeight:700, lineHeight:1.06, color:B, marginBottom:20 }}>
              Speak with clarity.<br /><em style={{ fontStyle:'italic', color:'#C8A000' }}>Sound like you mean it.</em>
            </h2>
            <p style={{ fontSize:'1.02rem', color:'#555', lineHeight:2, marginBottom:26, maxWidth:420 }}>A dedicated spoken English programme running alongside the main O/L class — preparing students for oral examinations and building lasting confidence.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:13, marginBottom:32 }}>
              {[
                { icon:'mic',   text:'Oral exam simulation and structured practice' },
                { icon:'vol',   text:'Pronunciation correction with audio feedback' },
                { icon:'users', text:'Small group sessions for maximum participation' },
                { icon:'globe', text:'Real-world conversation scenarios and debates' },
              ].map(({ icon,text }) => (
                <div key={text} style={{ display:'flex', alignItems:'center', gap:13 }}>
                  <div style={{ width:38, height:38, borderRadius:'50%', background:Y, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon n={icon} size={16} color={B} sw={2} />
                  </div>
                  <span style={{ fontSize:'1rem', color:'#444', fontWeight:500 }}>{text}</span>
                </div>
              ))}
            </div>
            <a href="#contact" className="bp"><span>Join Spoken Class</span><Icon n="arrow" size={15} color="currentColor" sw={2} /></a>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {spokenModules.map(({ num,icon,title,desc }) => (
              <div key={num} className="mc" style={{ background:W, border:'1.5px solid #EBEBEB', borderRadius:16, padding:'20px 22px', display:'flex', gap:16, alignItems:'flex-start', cursor:'default' }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.6rem', fontWeight:900, color:'#E4E4E4', lineHeight:1, flexShrink:0, width:46 }}>{num}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                    <Icon n={icon} size={14} color={B} sw={1.8} />
                    <p style={{ fontWeight:700, fontSize:'.95rem', color:B, margin:0 }}>{title}</p>
                  </div>
                  <p style={{ fontSize:'.83rem', color:'#777', margin:0, lineHeight:1.75 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

       
      {/* ── SOCIAL ── */}
      <section ref={socialRef} className="section-pad" style={{ background:'#F7F7F5', padding:'80px 40px', ...tv(socialVis) }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <SLabel text="Follow Along" />
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.2rem,4.5vw,4.8rem)', fontWeight:700, color:B, margin:0 }}>
              Join our growing <em style={{ fontStyle:'italic', color:'#C8A000' }}>community</em>
            </h2>
          </div>
          <div className="social-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
            {socials.map(({ platform,handle,followers,icon }) => (
              <div key={platform} className="soc soc-pad" style={{ background:W, border:'1.5px solid #E8E8E8', borderRadius:20, padding:'30px 20px', textAlign:'center', cursor:'pointer' }}>
                <div className="soc-icon" style={{ width:46, height:46, borderRadius:'50%', background:'#F3F3F1', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                  <Icon n={icon} size={20} color={B} sw={1.5} />
                </div>
                <p className="soc-n soc-num" style={{ fontFamily:"'Playfair Display',serif", fontSize:'3.2rem', fontWeight:900, color:B, margin:0, lineHeight:1 }}><Counter to={followers} suffix="K" /></p>
                <p className="soc-p" style={{ fontSize:'.72rem', fontWeight:700, color:'#AAA', margin:'10px 0 4px', textTransform:'uppercase', letterSpacing:'.1em', fontFamily:"'DM Sans',sans-serif" }}>{platform}</p>
                <p className="soc-h" style={{ fontSize:'.68rem', color:'#CCC', margin:0, fontFamily:"'DM Sans',sans-serif" }}>{handle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" ref={testRef} className="section-pad" style={{ maxWidth:1280, margin:'0 auto', padding:'100px 40px', ...tv(testVis) }}>
        <div className="test-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:48, flexWrap:'wrap', gap:20 }}>
          <div>
            <SLabel text="Student Reviews" />
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.4rem,4.5vw,5rem)', fontWeight:700, lineHeight:1.04, color:B, margin:0 }}>
              Words from<br /><em style={{ fontStyle:'italic', color:'#C8A000' }}>our students</em>
            </h2>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, background:Y, padding:'12px 20px', borderRadius:60 }}>
              <div style={{ display:'flex', gap:3 }}>{Array(5).fill(0).map((_,i) => <Icon key={i} n="star" size={13} color={B} sw={0} />)}</div>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', fontWeight:700, color:B, lineHeight:1 }}>4.98</span>
              {/* <span style={{ fontSize:'.66rem', fontWeight:600, color:'rgba(0,0,0,.5)', fontFamily:"'DM Sans',sans-serif" }}>/ 3,000+</span> */}
            </div>
            <p style={{ fontSize:'.7rem', color:'#BBB', margin:0, fontFamily:"'DM Sans',sans-serif" }}>Hover cards to interact ↑</p>
          </div>
        </div>
        <div className="test-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[0,2,4,6].map(i => testimonials[i] && <ReviewCard key={i} {...testimonials[i]} tilt={tilts[i]} Y={Y} B={B} W={W} featured={i===0} />)}
          </div>
          <div className="test-col-b" style={{ display:'flex', flexDirection:'column', gap:14, marginTop:32 }}>
            {[1,3,5,7].map(i => testimonials[i] && <ReviewCard key={i} {...testimonials[i]} tilt={tilts[i]} Y={Y} B={B} W={W} featured={i===3} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div ref={ctaRef} className="section-pad" style={{ background:B, padding:'80px 40px', ...tv(ctaVis) }}>
        <div className="cta-inner" style={{ maxWidth:1280, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:32 }}>
          <div>
            <p style={{ fontSize:'.75rem', fontWeight:700, letterSpacing:'.3em', textTransform:'uppercase', color:Y, margin:'0 0 12px', fontFamily:"'DM Sans',sans-serif" }}>Limited Seats Per Term</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.4rem,4.8vw,5rem)', fontWeight:900, color:W, lineHeight:1.04, margin:0 }}>
              Ready to transform<br /><em style={{ fontStyle:'italic', color:Y }}>your English?</em>
            </h2>
          </div>
          <div className="cta-btns" style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <a href="#contact" className="by"><span>Reserve Your Spot</span><Icon n="arrow" size={15} color="currentColor" sw={2} /></a>
            <a href="#about"   className="bg"><span>Learn More</span></a>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <section id="faq" ref={faqRef} className="section-pad" style={{ maxWidth:1280, margin:'0 auto', padding:'100px 40px', ...tv(faqVis) }}>
        <div className="faq-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:90, alignItems:'start' }}>
          <div className="faq-sticky" style={{ position:'sticky', top:110 }}>
            <SLabel text="FAQ" />
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.4rem,4.5vw,5rem)', fontWeight:700, color:B, lineHeight:1.04, marginBottom:16 }}>
              Got <em style={{ fontStyle:'italic', color:'#C8A000' }}>questions?</em>
            </h2>
            <p style={{ fontSize:'1rem', color:'#888', lineHeight:1.9 }}>Everything you need to know about The Bee Academy and how enrollment works.</p>
            <div style={{ marginTop:28, background:Y, borderRadius:20, padding:'22px 24px' }}>
              <p style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.2em', textTransform:'uppercase', color:'rgba(0,0,0,.5)', margin:'0 0 6px', fontFamily:"'DM Sans',sans-serif" }}>Still have questions?</p>
              <p style={{ fontSize:'.92rem', fontWeight:700, color:B, margin:'0 0 14px', fontFamily:"'DM Sans',sans-serif" }}>Chat with us on WhatsApp — we reply fast.</p>
              <a href="https://wa.me/94769872173" target="_blank" rel="noopener noreferrer" className="bp" style={{ fontSize:10, padding:'11px 22px' }}>
                <span>WhatsApp Us</span><Icon n="arrow" size={14} color="currentColor" sw={2} />
              </a>
            </div>
          </div>
          <div>
            {faqs.map(({ q,a },i) => (
              <div key={i} className="fq" style={{ background: openFaq===i?'rgba(247,201,0,.06)':'transparent', borderRadius: openFaq===i?'12px 12px 0 0':0, padding: openFaq===i?'0 16px':'0' }}>
                <button onClick={() => setOpenFaq(openFaq===i?null:i)} style={{ width:'100%', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'19px 0', textAlign:'left', gap:18 }}>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight: openFaq===i?700:400, color:B, lineHeight:1.4 }}>{q}</span>
                  <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, background: openFaq===i?B:Y, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', color: openFaq===i?W:B, transition:'transform .45s cubic-bezier(.22,1,.36,1),background .3s', transform: openFaq===i?'rotate(45deg)':'rotate(0)' }}>+</div>
                </button>
                <div style={{ maxHeight: openFaq===i?300:0, overflow:'hidden', transition:'max-height .5s cubic-bezier(.4,0,.2,1)' }}>
                  <p style={{ fontSize:'.92rem', color:'#666', lineHeight:2, paddingBottom:18, margin:0 }}>{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" ref={contRef} className="section-pad" style={{ background:'#F8F7F4', padding:'100px 40px', ...tv(contVis) }}>
        <div className="contact-grid" style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:90, alignItems:'start' }}>
          <div>
            <SLabel text="Enrollment" />
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.4rem,4.5vw,5rem)', fontWeight:700, lineHeight:1.04, color:B, marginBottom:18 }}>
              Start speaking English<br /><em style={{ fontStyle:'italic', color:'#C8A000' }}>with confidence.</em>
            </h2>
            <p style={{ fontSize:'1rem', color:'#777', lineHeight:2, marginBottom:36, maxWidth:400 }}>Limited seats per term. Fill in the form and we'll be in touch within 24 hours.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {[
                { icon:'pin',   label:'Location', val:'Gampaha & Online' },
                { icon:'phone', label:'Phone',    val:'+94 72 383 8454 / +94 76 993 8695' },
                { icon:'mail',  label:'Email',    val:'info.thebee.academy@gmail.com' },
                { icon:'clock', label:'Classes',  val:'Weekends & Weekdays' },
              ].map(({ icon,label,val }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:Y, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon n={icon} size={18} color={B} sw={1.6} />
                  </div>
                  <div>
                    <p style={{ fontSize:'.67rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#BBB', margin:0, fontFamily:"'DM Sans',sans-serif" }}>{label}</p>
                    <p style={{ fontSize:'.93rem', fontWeight:700, color:B, margin:'3px 0 0' }}>{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form" style={{ background:W, border:'1.5px solid #EBEBEB', borderRadius:24, padding:'42px 38px', boxShadow:'0 12px 64px rgba(0,0,0,.06)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:Y, borderRadius:'24px 24px 0 0' }} />
            {sent ? (
              <div style={{ textAlign:'center', padding:'44px 0' }}>
                <div style={{ width:66, height:66, background:Y, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                  <Icon n="check" size={28} color={B} sw={2.5} />
                </div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', color:B, marginBottom:10, fontWeight:700 }}>You're on the list!</h3>
                <p style={{ fontSize:'.93rem', color:'#777' }}>We'll contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', fontWeight:700, color:B, marginBottom:22 }}>Enroll Now</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {[{ k:'name',ph:'Full name',t:'text'},{ k:'phone',ph:'Phone number',t:'tel'}].map(({ k,ph,t }) => (
                    <input key={k} type={t} placeholder={ph} required value={form[k]}
                      onChange={e => setForm(p => ({ ...p,[k]:e.target.value }))}
                      className="fi"
                      style={{ width:'100%', padding:'13px 18px', borderRadius:60, border:'1.5px solid #E4E4E4', fontSize:'.9rem', fontFamily:"'DM Sans',sans-serif", color:B, background:'#FEFEFE' }}
                    />
                  ))}
                  <select required value={form.grade} onChange={e => setForm(p => ({ ...p,grade:e.target.value }))} className="fi"
                    style={{ width:'100%', padding:'13px 18px', borderRadius:60, border:'1.5px solid #E4E4E4', fontSize:'.9rem', fontFamily:"'DM Sans',sans-serif", color: form.grade?B:'#AAA', background:'#FEFEFE', cursor:'pointer' }}>
                    <option value="" disabled>Select your grade</option>
                    <option>Grade 10 (O/L Year 1)</option>
                    <option>Grade 11 (O/L Year 2)</option>
                    <option>Repeating O/L</option>
                  </select>
                  <textarea placeholder="Any questions? (optional)" rows={3} value={form.message}
                    onChange={e => setForm(p => ({ ...p,message:e.target.value }))}
                    className="fi"
                    style={{ width:'100%', padding:'13px 18px', borderRadius:16, border:'1.5px solid #E4E4E4', fontSize:'.9rem', fontFamily:"'DM Sans',sans-serif", color:B, background:'#FEFEFE', resize:'vertical' }}
                  />
                  <button type="submit" className="bp" style={{ width:'100%', padding:'15px', fontSize:11, marginTop:4 }}>
                    <span>Reserve My Spot</span><Icon n="arrow" size={16} color="currentColor" sw={2} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:B, padding:'44px 40px', borderTop:`4px solid ${Y}` }}>
        <div className="footer-inner" style={{ maxWidth:1280, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:22 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <img src={Logo} alt="The Bee Academy" style={{ height:26, filter:'brightness(0) invert(1)' }} />
            <div style={{ width:1, height:26, background:'rgba(255,255,255,.15)' }} />
            <p style={{ fontSize:'.68rem', color:'rgba(255,255,255,.3)', margin:0, letterSpacing:'.16em', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif" }}>O/L English · Excellence</p>
          </div>
          <p style={{ fontSize:'.68rem', color:'rgba(255,255,255,.2)', margin:0, fontFamily:"'DM Sans',sans-serif" }}>© {new Date().getFullYear()} The Bee Academy. All rights reserved.</p>
          <div className="footer-socials" style={{ display:'flex', gap:20, alignItems:'center' }}>
            {[['yt','YouTube'],['ig','Instagram'],['fb','Facebook'],['tt','TikTok']].map(([icon,p]) => (
              <a key={p} href="/" style={{ display:'flex', alignItems:'center', gap:6, fontSize:'.68rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(255,255,255,.25)', textDecoration:'none', transition:'color .3s', fontFamily:"'DM Sans',sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.color=Y}
                onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,.25)'}
              >
                <Icon n={icon} size={13} color="currentColor" sw={1.5} />{p}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── WHATSAPP ── */}
      <a href="https://wa.me/94769872173" target="_blank" rel="noopener noreferrer" className="wa-btn" aria-label="Chat on WhatsApp"
        style={{ position:'fixed', bottom:26, right:26, zIndex:999, width:58, height:58, borderRadius:'50%', background:'#25D366', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 32px rgba(37,211,102,.45)', textDecoration:'none' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
};

export default Home;