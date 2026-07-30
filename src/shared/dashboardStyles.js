/**
 * Shared design tokens + stylesheet for every dashboard in the app
 * (Spoken student view and the whole admin section).
 *
 * Typography: Plus Jakarta Sans — one neutral geometric sans, no decorative serif.
 * Colour: SOLID amber. No gradients anywhere — buttons, nav, hero and badges all
 * use flat fills, and every interactive element darkens on hover.
 *
 * Class prefix is `spk-` throughout (kept from the first Spoken build so the
 * markup stayed stable when this moved out into shared).
 */

export const UI = {
  // Surfaces
  canvas: '#F4F4F5',
  surface: '#FFFFFF',
  surfaceAlt: '#FAFAFA',
  border: '#EAEAEC',
  borderStrong: '#DEDEE1',

  // Dark sidebar
  navBg: '#18181B',
  navBgSoft: '#232327',
  navText: '#A1A1AA',

  // Amber accent — solid fills only
  accent: '#F59E0B',
  accentHover: '#D97706',
  accentDark: '#B45309',
  accentSoft: '#FEF3C7',
  accentSoftHover: '#FDE68A',
  accentSoftBorder: '#FDE68A',
  accentTint: '#FFFBEB',

  // Neutrals
  ink: '#18181B',
  ink2: '#3F3F46',
  muted: '#71717A',
  subtle: '#A1A1AA',
  faint: '#D4D4D8',

  // Semantic
  green: '#059669',
  greenHover: '#047857',
  greenSoft: '#ECFDF5',
  greenBorder: '#A7F3D0',
  red: '#DC2626',
  redHover: '#B91C1C',
  redSoft: '#FEF2F2',
  redBorder: '#FECACA',
  blue: '#2563EB',
  blueSoft: '#EFF6FF',
  blueBorder: '#BFDBFE',

  font: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

export const DASHBOARD_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .spk-root, .spk-root * {
    box-sizing: border-box;
    font-family: ${UI.font};
    -webkit-font-smoothing: antialiased;
  }
  .spk-root { background: ${UI.canvas}; min-height: 100vh; color: ${UI.ink}; }
  .spk-root h1, .spk-root h2, .spk-root h3, .spk-root h4, .spk-root p { margin: 0; }
  /*
   * :where(button) keeps this reset at zero specificity so it never outranks a
   * real button class. Plain "button" here would tie class+type against the
   * single-class rules below and silently erase every button's background.
   */
  .spk-root :where(button) { cursor: pointer; border: none; background: none; }
  .spk-root a { text-decoration: none; }

  /* ══ App frame ═══════════════════════════════════════ */
  .spk-app { display: flex; min-height: 100vh; padding: 14px; gap: 14px; }
  @media (max-width: 1023px) { .spk-app { padding: 0; gap: 0; } }

  /* ══ Sidebar ═════════════════════════════════════════ */
  .spk-sidebar {
    width: 244px; flex-shrink: 0;
    background: ${UI.navBg};
    border-radius: 22px;
    padding: 22px 14px 16px;
    display: flex; flex-direction: column;
    position: sticky; top: 14px;
    height: calc(100vh - 28px);
    overflow-y: auto; scrollbar-width: thin;
  }
  .spk-sidebar-desktop { display: flex; }
  @media (max-width: 1023px) { .spk-sidebar-desktop { display: none; } }

  .spk-brand { display: flex; align-items: center; gap: 11px; padding: 4px 8px 22px; }
  .spk-brand-mark {
    width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
    background: ${UI.accent};
    display: flex; align-items: center; justify-content: center;
  }
  .spk-brand-name { font-size: 14.5px; font-weight: 700; color: #fff; letter-spacing: -0.2px; line-height: 1.2; }
  .spk-brand-sub {
    font-size: 9.5px; font-weight: 700; color: ${UI.accent};
    letter-spacing: 0.11em; text-transform: uppercase; margin-top: 3px;
  }

  .spk-nav-label {
    font-size: 9.5px; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase;
    color: #52525B; padding: 0 10px 10px;
  }
  .spk-nav { display: flex; flex-direction: column; gap: 3px; }
  .spk-nav-item {
    display: flex; align-items: center; gap: 11px;
    width: 100%; padding: 10px 11px; border-radius: 12px;
    color: ${UI.navText}; font-size: 13.5px; font-weight: 500; text-align: left;
    transition: background 0.18s, color 0.18s;
  }
  .spk-nav-item:hover { background: ${UI.navBgSoft}; color: #E4E4E7; }
  .spk-nav-item-active { background: ${UI.accent}; color: #fff; font-weight: 700; }
  .spk-nav-item-active:hover { background: ${UI.accentHover}; color: #fff; }
  .spk-nav-icon { flex-shrink: 0; display: flex; align-items: center; }
  .spk-nav-badge {
    margin-left: auto; font-size: 10.5px; font-weight: 700;
    padding: 2px 7px; border-radius: 20px;
    background: rgba(255,255,255,0.22); color: #fff;
  }
  .spk-nav-item:not(.spk-nav-item-active) .spk-nav-badge { background: ${UI.navBgSoft}; color: ${UI.subtle}; }

  .spk-nav-card {
    margin: 0 4px; padding: 14px; border-radius: 16px;
    background: ${UI.navBgSoft}; border: 1px solid rgba(255,255,255,0.06);
  }
  .spk-nav-card-title { font-size: 12.5px; font-weight: 700; color: #fff; margin-bottom: 5px; }
  .spk-nav-card-text { font-size: 11.5px; color: ${UI.navText}; line-height: 1.55; }

  .spk-signout {
    display: flex; align-items: center; gap: 11px;
    padding: 10px 11px; border-radius: 12px; margin-top: 6px;
    color: #71717A; font-size: 13.5px; font-weight: 500;
    transition: background 0.18s, color 0.18s;
  }
  .spk-signout:hover { background: rgba(220,38,38,0.14); color: #F87171; }

  /* ══ Mobile drawer ═══════════════════════════════════ */
  .spk-hamburger {
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
    background: ${UI.surface}; border: 1px solid ${UI.border}; color: ${UI.ink};
    transition: background 0.18s, border-color 0.18s;
  }
  .spk-hamburger:hover { background: ${UI.accentSoft}; border-color: ${UI.accentSoftBorder}; }
  @media (min-width: 1024px) { .spk-hamburger { display: none; } }
  .spk-backdrop { position: fixed; inset: 0; background: rgba(24,24,27,0.45); z-index: 60; }
  .spk-drawer { position: fixed; top: 0; left: 0; bottom: 0; z-index: 70; padding: 12px; }
  .spk-drawer .spk-sidebar { height: calc(100vh - 24px); position: static; }

  /* ══ Main column ═════════════════════════════════════ */
  .spk-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 14px; }
  @media (max-width: 1023px) { .spk-main { padding: 12px; gap: 12px; } }

  /*
   * Below 900px the summary tiles move BELOW the content, so the actual
   * lists are visible without scrolling past a screenful of stats.
   */
  @media (max-width: 900px) {
    .spk-topbar       { order: 1; }
    .spk-hero         { order: 2; }
    .spk-segmented    { order: 3; }
    .spk-pills        { order: 3; }
    .spk-section-wrap { order: 4; }
    .spk-columns      { order: 5; }
    .spk-split        { order: 5; }
    /*
     * Order also applies when these are used unwrapped (a direct child of
     * .spk-main, not nested inside .spk-columns) — e.g. a hub page whose
     * only content is a folder grid or a single panel with no side rail.
     */
    .spk-folders      { order: 5; }
    .spk-cards        { order: 5; }
    .spk-panel        { order: 5; }
    .spk-stats        { order: 6; }
    .spk-footnote     { order: 7; }
  }

  /* ── Topbar ── */
  .spk-topbar {
    display: flex; align-items: center; gap: 12px;
    background: ${UI.surface}; border: 1px solid ${UI.border};
    border-radius: 18px; padding: 10px 14px;
  }
  .spk-search {
    flex: 1; min-width: 0; display: flex; align-items: center; gap: 9px;
    background: ${UI.canvas}; border: 1px solid transparent;
    border-radius: 12px; padding: 9px 13px;
    transition: border-color 0.2s, background 0.2s;
  }
  .spk-search:focus-within { border-color: ${UI.accent}; background: ${UI.surface}; }
  .spk-search input {
    flex: 1; min-width: 0; border: none; outline: none; background: none;
    font-size: 13.5px; color: ${UI.ink}; font-weight: 500;
  }
  .spk-search input::placeholder { color: ${UI.subtle}; font-weight: 400; }
  .spk-search-clear { display: flex; color: ${UI.subtle}; transition: color 0.18s; }
  .spk-search-clear:hover { color: ${UI.ink}; }

  .spk-topbar-icon {
    width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: ${UI.canvas}; color: ${UI.ink2};
    transition: background 0.18s, color 0.18s;
    position: relative;
  }
  .spk-topbar-icon:hover { background: ${UI.accent}; color: #fff; }
  .spk-topbar-dot {
    position: absolute; top: 9px; right: 10px;
    width: 7px; height: 7px; border-radius: 50%;
    background: ${UI.accent}; border: 1.5px solid ${UI.surface};
  }

  .spk-user { display: flex; align-items: center; gap: 10px; padding-left: 4px; flex-shrink: 0; }
  .spk-avatar {
    width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0;
    background: ${UI.accent}; color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800;
  }
  .spk-user-name { font-size: 13px; font-weight: 700; color: ${UI.ink}; line-height: 1.25; white-space: nowrap; }
  .spk-user-meta { font-size: 11px; color: ${UI.subtle}; font-weight: 500; margin-top: 1px; white-space: nowrap; }
  @media (max-width: 720px) { .spk-user-text { display: none; } }

  /* ── Hero ── */
  .spk-hero {
    position: relative; overflow: hidden;
    border-radius: 20px; padding: 20px 26px;
    background: ${UI.accent};
    display: flex; align-items: center; justify-content: space-between; gap: 24px;
  }
  @media (max-width: 640px) { .spk-hero { padding: 16px 18px; border-radius: 16px; } }
  .spk-hero-blob { position: absolute; border-radius: 50%; pointer-events: none; }
  .spk-hero-content { position: relative; z-index: 2; min-width: 0; }
  .spk-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: #7C2D12; background: rgba(255,255,255,0.5);
    padding: 4px 10px; border-radius: 20px; margin-bottom: 10px;
  }
  @media (max-width: 640px) { .spk-hero-eyebrow { display: none; } }
  .spk-hero-title { font-size: 22px; font-weight: 800; color: #431407; letter-spacing: -0.6px; line-height: 1.2; }
  @media (max-width: 640px) { .spk-hero-title { font-size: 18px; } }
  .spk-hero-sub {
    font-size: 12.5px; color: #7C2D12; font-weight: 500;
    margin-top: 6px; max-width: 520px; line-height: 1.5;
  }
  @media (max-width: 640px) {
    .spk-hero-sub {
      font-size: 11.5px; margin-top: 4px;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
  }
  .spk-hero-art {
    position: relative; z-index: 2; flex-shrink: 0;
    width: 78px; height: 78px; border-radius: 22px;
    background: rgba(255,255,255,0.3);
    border: 1px solid rgba(255,255,255,0.5);
    display: flex; align-items: center; justify-content: center;
    color: #7C2D12;
  }
  @media (max-width: 860px) { .spk-hero-art { display: none; } }

  /* ── Stat tiles (compact single-line rows) ── */
  .spk-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
  @media (max-width: 1240px) { .spk-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  .spk-stats-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  @media (max-width: 1240px) { .spk-stats-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }

  .spk-stat {
    display: flex; align-items: center; gap: 11px; min-width: 0;
    background: ${UI.surface}; border: 1px solid ${UI.border};
    border-radius: 14px; padding: 11px 13px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .spk-stat:hover { border-color: ${UI.accentSoftBorder}; box-shadow: 0 6px 18px rgba(24,24,27,0.05); }
  .spk-stat-icon {
    width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .spk-stat-text { min-width: 0; }
  .spk-stat-value {
    font-size: 17px; font-weight: 800; color: ${UI.ink};
    letter-spacing: -0.4px; line-height: 1.15;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .spk-stat-label {
    font-size: 11px; color: ${UI.muted}; font-weight: 500; margin-top: 2px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  /* ── Segmented tabs (mobile nav) ── */
  .spk-segmented {
    display: flex; gap: 5px; padding: 5px;
    background: ${UI.surface}; border: 1px solid ${UI.border}; border-radius: 15px;
    overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch;
  }
  .spk-segmented::-webkit-scrollbar { display: none; }
  @media (min-width: 1024px) { .spk-segmented { display: none; } }
  .spk-segment {
    display: flex; align-items: center; gap: 7px; flex-shrink: 0;
    padding: 9px 15px; border-radius: 11px;
    font-size: 13px; font-weight: 600; color: ${UI.muted}; white-space: nowrap;
    transition: background 0.18s, color 0.18s;
  }
  .spk-segment:hover { background: ${UI.accentSoft}; color: ${UI.accentDark}; }
  .spk-segment-active { background: ${UI.accent}; color: #fff; font-weight: 700; }
  .spk-segment-active:hover { background: ${UI.accentHover}; color: #fff; }

  /* ── Filter pills (visible at all widths) ── */
  .spk-pills {
    display: flex; gap: 6px; flex-wrap: wrap;
    overflow-x: auto; scrollbar-width: none;
  }
  .spk-pills::-webkit-scrollbar { display: none; }
  .spk-pill-btn {
    display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;
    padding: 8px 15px; border-radius: 11px;
    font-size: 12.5px; font-weight: 600; white-space: nowrap;
    background: ${UI.surface}; color: ${UI.muted}; border: 1px solid ${UI.borderStrong};
    transition: background 0.18s, color 0.18s, border-color 0.18s;
  }
  .spk-pill-btn:hover { border-color: ${UI.accent}; color: ${UI.accentDark}; background: ${UI.accentTint}; }
  .spk-pill-btn-active { background: ${UI.accent}; color: #fff; border-color: ${UI.accent}; font-weight: 700; }
  .spk-pill-btn-active:hover { background: ${UI.accentHover}; border-color: ${UI.accentHover}; color: #fff; }
  .spk-pill-count {
    font-size: 10.5px; font-weight: 700; padding: 1px 6px; border-radius: 20px;
    background: ${UI.canvas}; color: ${UI.muted};
  }
  .spk-pill-btn-active .spk-pill-count { background: rgba(255,255,255,0.25); color: #fff; }

  /* ── Content columns ── */
  .spk-columns { display: grid; grid-template-columns: minmax(0, 1fr) 296px; gap: 16px; align-items: start; }
  @media (max-width: 1180px) { .spk-columns { grid-template-columns: minmax(0, 1fr); } }

  /* Form-left / list-right split used by the upload pages */
  .spk-split { display: grid; grid-template-columns: 380px minmax(0, 1fr); gap: 16px; align-items: start; }
  @media (max-width: 1100px) { .spk-split { grid-template-columns: minmax(0, 1fr); } }
  .spk-sticky { position: sticky; top: 14px; }
  @media (max-width: 1100px) { .spk-sticky { position: static; } }

  /* ── Panel ── */
  .spk-panel {
    background: ${UI.surface}; border: 1px solid ${UI.border};
    border-radius: 20px; padding: 20px;
  }
  .spk-panel-flush { padding: 0; overflow: hidden; }
  .spk-panel-head {
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
    margin-bottom: 18px;
  }
  .spk-panel-title { font-size: 16.5px; font-weight: 700; color: ${UI.ink}; letter-spacing: -0.3px; }
  .spk-panel-sub { font-size: 12.5px; color: ${UI.subtle}; font-weight: 500; margin-top: 3px; }
  .spk-count {
    font-size: 11.5px; font-weight: 700; padding: 3px 9px; border-radius: 20px;
    background: ${UI.accentSoft}; color: ${UI.accentDark};
  }

  /* ── Folder cards ── */
  .spk-folders { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
  @media (max-width: 480px) { .spk-folders { grid-template-columns: 1fr; } }
  .spk-folder {
    text-align: left; width: 100%; overflow: hidden;
    background: ${UI.surface}; border: 1px solid ${UI.borderStrong};
    border-radius: 17px; padding: 0;
    box-shadow: 0 1px 2px rgba(24,24,27,0.04);
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  .spk-folder:hover {
    border-color: ${UI.accent};
    box-shadow: 0 12px 30px rgba(24,24,27,0.09); transform: translateY(-3px);
  }
  .spk-folder-cap { height: 4px; background: ${UI.accent}; }
  .spk-folder-body { padding: 17px 18px; }
  .spk-folder-icon {
    width: 40px; height: 40px; border-radius: 12px; margin-bottom: 13px;
    background: ${UI.accent}; color: #fff;
    display: flex; align-items: center; justify-content: center;
  }
  .spk-folder-name { font-size: 14.5px; font-weight: 700; color: ${UI.ink}; letter-spacing: -0.15px; }
  .spk-folder-desc { font-size: 12px; color: ${UI.subtle}; margin-top: 3px; line-height: 1.5; }
  .spk-folder-foot {
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
    margin-top: 14px; padding-top: 12px; border-top: 1px solid ${UI.border};
  }

  /* ── Action cards (dashboard hub) ── */
  .spk-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; }
  .spk-card {
    display: flex; flex-direction: column; text-align: left;
    background: ${UI.surface}; border: 1px solid ${UI.borderStrong};
    border-radius: 18px; padding: 20px; height: 100%;
    box-shadow: 0 1px 2px rgba(24,24,27,0.04);
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  .spk-card:hover { border-color: ${UI.accent}; box-shadow: 0 14px 34px rgba(24,24,27,0.09); transform: translateY(-3px); }
  .spk-card-icon {
    width: 44px; height: 44px; border-radius: 13px; margin-bottom: 14px;
    background: ${UI.accent}; color: #fff;
    display: flex; align-items: center; justify-content: center;
  }
  .spk-card-title { font-size: 15px; font-weight: 700; color: ${UI.ink}; letter-spacing: -0.2px; }
  .spk-card-desc { font-size: 12.5px; color: ${UI.subtle}; margin-top: 4px; line-height: 1.55; flex: 1; }

  /* ── List rows ── */
  .spk-list { display: flex; flex-direction: column; gap: 10px; }
  .spk-row {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px; border-radius: 16px;
    background: ${UI.surfaceAlt}; border: 1px solid ${UI.border};
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .spk-row:hover { background: ${UI.surface}; border-color: ${UI.accentSoftBorder}; box-shadow: 0 8px 22px rgba(24,24,27,0.05); }
  .spk-row-selected { background: ${UI.accentTint}; border-color: ${UI.accent}; }
  @media (max-width: 760px) {
    .spk-row { flex-wrap: wrap; }
    .spk-row-actions { width: 100%; }
    .spk-row-actions > .spk-btn { flex: 1; }
  }
  .spk-row-icon {
    width: 42px; height: 42px; border-radius: 13px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: ${UI.accent}; color: #fff;
  }
  .spk-row-body { flex: 1; min-width: 0; }
  .spk-row-title { font-size: 14px; font-weight: 700; color: ${UI.ink}; letter-spacing: -0.15px; overflow-wrap: anywhere; }
  .spk-row-meta {
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
    font-size: 11.5px; color: ${UI.subtle}; font-weight: 500; margin-top: 5px;
  }
  .spk-row-meta > span { display: inline-flex; align-items: center; gap: 5px; min-width: 0; }
  .spk-row-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .spk-row-dim { opacity: 0.6; }
  .spk-truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* ── Buttons — solid fills, darken on hover ── */
  .spk-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    padding: 9px 15px; border-radius: 11px;
    font-size: 13px; font-weight: 600; white-space: nowrap;
    border: 1px solid transparent;
    transition: background 0.18s, color 0.18s, border-color 0.18s, transform 0.12s, box-shadow 0.18s;
  }
  .spk-btn:active { transform: scale(0.97); }
  .spk-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .spk-btn:disabled:hover { transform: none; }

  .spk-btn-solid { background: ${UI.accent}; color: #fff; font-weight: 700; }
  .spk-btn-solid:hover:not(:disabled) { background: ${UI.accentHover}; box-shadow: 0 6px 16px rgba(217,119,6,0.32); }

  .spk-btn-soft { background: ${UI.accentSoft}; color: ${UI.accentDark}; border-color: ${UI.accentSoftBorder}; font-weight: 700; }
  .spk-btn-soft:hover:not(:disabled) { background: ${UI.accent}; color: #fff; border-color: ${UI.accent}; }

  .spk-btn-dark { background: ${UI.navBg}; color: #fff; font-weight: 700; }
  .spk-btn-dark:hover:not(:disabled) { background: ${UI.ink2}; }

  .spk-btn-ghost { background: ${UI.surface}; color: ${UI.ink2}; border-color: ${UI.borderStrong}; }
  .spk-btn-ghost:hover:not(:disabled) { background: ${UI.accentTint}; border-color: ${UI.accent}; color: ${UI.accentDark}; }

  .spk-btn-success { background: ${UI.green}; color: #fff; font-weight: 700; }
  .spk-btn-success:hover:not(:disabled) { background: ${UI.greenHover}; box-shadow: 0 6px 16px rgba(5,150,105,0.3); }

  .spk-btn-danger { background: ${UI.redSoft}; color: ${UI.red}; border-color: ${UI.redBorder}; font-weight: 700; }
  .spk-btn-danger:hover:not(:disabled) { background: ${UI.red}; color: #fff; border-color: ${UI.red}; }

  .spk-btn-onaccent { background: rgba(255,255,255,0.9); color: #7C2D12; font-weight: 700; }
  .spk-btn-onaccent:hover:not(:disabled) { background: #fff; }

  .spk-btn-sm { padding: 7px 12px; font-size: 12px; }
  .spk-btn-block { width: 100%; }
  .spk-btn-lg { padding: 12px 20px; font-size: 14px; }

  .spk-link {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12.5px; font-weight: 700; color: ${UI.accentDark};
    transition: color 0.18s;
  }
  .spk-link:hover { color: ${UI.accent}; }

  .spk-icon-btn {
    width: 34px; height: 34px; border-radius: 11px; flex-shrink: 0;
    display: inline-flex; align-items: center; justify-content: center;
    background: ${UI.surface}; border: 1px solid ${UI.borderStrong}; color: ${UI.muted};
    transition: background 0.18s, color 0.18s, border-color 0.18s;
  }
  .spk-icon-btn:hover { background: ${UI.accent}; border-color: ${UI.accent}; color: #fff; }
  .spk-icon-btn-danger:hover { background: ${UI.red}; border-color: ${UI.red}; color: #fff; }
  .spk-icon-btn-blue:hover { background: ${UI.blue}; border-color: ${UI.blue}; color: #fff; }

  /* ── Badges ── */
  .spk-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
    padding: 3px 8px; border-radius: 20px; border: 1px solid transparent;
  }
  .spk-badge-amber { background: ${UI.accentSoft}; color: ${UI.accentDark}; border-color: ${UI.accentSoftBorder}; }
  .spk-badge-green { background: ${UI.greenSoft}; color: ${UI.green}; border-color: ${UI.greenBorder}; }
  .spk-badge-gray { background: ${UI.canvas}; color: ${UI.subtle}; border-color: ${UI.border}; }
  .spk-badge-blue { background: ${UI.blueSoft}; color: ${UI.blue}; border-color: ${UI.blueBorder}; }
  .spk-badge-red { background: ${UI.redSoft}; color: ${UI.red}; border-color: ${UI.redBorder}; }

  /* ── Avatar ── */
  .spk-initials {
    width: 42px; height: 42px; border-radius: 13px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 13.5px; font-weight: 800; color: #fff; background: ${UI.accent};
  }
  .spk-initials-green { background: ${UI.green}; }
  .spk-initials-lg { width: 54px; height: 54px; border-radius: 16px; font-size: 17px; }

  /* ── Right rail ── */
  .spk-rail { display: flex; flex-direction: column; gap: 14px; }
  .spk-rail-card { background: ${UI.surface}; border: 1px solid ${UI.border}; border-radius: 20px; padding: 18px; }
  .spk-rail-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
  .spk-rail-title { font-size: 14px; font-weight: 700; color: ${UI.ink}; letter-spacing: -0.2px; }
  .spk-rail-item { display: flex; gap: 11px; padding: 11px 0; border-bottom: 1px solid ${UI.border}; }
  .spk-rail-item:last-child { border-bottom: none; padding-bottom: 0; }
  .spk-rail-item:first-child { padding-top: 0; }
  .spk-rail-dot {
    width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .spk-rail-item-title { font-size: 12.5px; font-weight: 700; color: ${UI.ink}; line-height: 1.35; }
  .spk-rail-item-sub { font-size: 11.5px; color: ${UI.subtle}; font-weight: 500; margin-top: 3px; line-height: 1.5; }

  .spk-teachers { display: flex; flex-direction: column; gap: 12px; }
  .spk-teacher { display: flex; align-items: center; gap: 11px; }
  .spk-teacher-avatar {
    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; color: #fff;
  }

  /* ── Video thumbnail ── */
  .spk-thumb {
    position: relative; flex-shrink: 0;
    width: 136px; aspect-ratio: 16 / 9;
    border-radius: 12px; overflow: hidden;
    background: #E4E4E7; border: 1px solid ${UI.borderStrong};
  }
  .spk-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .spk-thumb-fallback {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: ${UI.accentSoft}; color: ${UI.accentDark};
  }
  .spk-thumb-play {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: 30px; height: 30px; border-radius: 50%;
    background: rgba(24,24,27,0.6); color: #fff;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none;
  }
  .spk-thumb-badge {
    position: absolute; right: 5px; bottom: 5px;
    background: rgba(24,24,27,0.82); color: #fff;
    font-size: 9.5px; font-weight: 700;
    padding: 2px 5px; border-radius: 5px;
  }
  .spk-thumb-sm { width: 96px; }
  @media (max-width: 760px) { .spk-thumb { width: 100%; } }

  /* ── Section header ── */
  .spk-section-bar { display: flex; align-items: flex-end; justify-content: space-between; gap: 14px; flex-wrap: wrap; }
  .spk-section-title { font-size: 19px; font-weight: 800; color: ${UI.ink}; letter-spacing: -0.5px; }
  .spk-section-sub { font-size: 12.5px; color: ${UI.subtle}; font-weight: 500; margin-top: 4px; }

  /* ── Group heading (month / type) ── */
  .spk-group-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .spk-group-rule { height: 3px; width: 20px; border-radius: 4px; background: ${UI.accent}; }
  .spk-group-title { font-size: 15px; font-weight: 700; color: ${UI.ink}; letter-spacing: -0.2px; }

  /* ── Empty state ── */
  .spk-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 11px; padding: 52px 24px; text-align: center;
    border: 1px dashed ${UI.borderStrong}; border-radius: 18px; background: ${UI.surfaceAlt};
  }
  .spk-empty-icon {
    width: 60px; height: 60px; border-radius: 18px;
    background: ${UI.accentSoft}; border: 1px solid ${UI.accentSoftBorder}; color: ${UI.accentDark};
    display: flex; align-items: center; justify-content: center;
  }
  .spk-empty-title { font-size: 14.5px; font-weight: 700; color: ${UI.ink2}; }
  .spk-empty-sub { font-size: 12.5px; color: ${UI.subtle}; max-width: 340px; line-height: 1.6; font-weight: 500; }

  /* ── Forms ── */
  .spk-form {
    background: ${UI.accentTint}; border: 1px solid ${UI.accentSoftBorder};
    border-radius: 18px; padding: 18px; margin-bottom: 18px;
  }
  .spk-field-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 13px; }
  .spk-field-stack { display: flex; flex-direction: column; gap: 14px; }
  .spk-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .spk-label {
    display: block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: ${UI.muted}; margin-bottom: 6px;
  }
  .spk-label-hint { font-weight: 500; color: ${UI.faint}; text-transform: none; letter-spacing: 0; }
  .spk-input {
    width: 100%; padding: 10px 12px; border-radius: 11px;
    font-size: 13px; font-weight: 500; color: ${UI.ink}; background: ${UI.surface};
    border: 1px solid ${UI.borderStrong}; outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .spk-input:focus { border-color: ${UI.accent}; box-shadow: 0 0 0 3px rgba(245,158,11,0.18); }
  .spk-input::placeholder { color: ${UI.faint}; font-weight: 400; }
  .spk-input:disabled { opacity: 0.55; }
  textarea.spk-input { resize: vertical; min-height: 64px; }

  .spk-file {
    border: 1px dashed ${UI.borderStrong}; border-radius: 12px;
    padding: 14px; background: ${UI.surfaceAlt};
    transition: border-color 0.18s, background 0.18s;
  }
  .spk-file:hover { border-color: ${UI.accent}; background: ${UI.accentTint}; }
  .spk-file-ok { border-color: ${UI.greenBorder}; background: ${UI.greenSoft}; }
  .spk-file input[type="file"] { display: block; width: 100%; font-size: 12.5px; color: ${UI.muted}; }
  .spk-file-note { font-size: 11.5px; font-weight: 600; color: ${UI.green}; margin-top: 8px; }

  .spk-check {
    width: 17px; height: 17px; flex-shrink: 0;
    accent-color: ${UI.accent}; cursor: pointer;
  }
  .spk-check-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 12.5px; color: ${UI.muted}; font-weight: 600;
    cursor: pointer; user-select: none;
  }

  /* ── Toast ── */
  .spk-toast {
    position: fixed; top: 18px; right: 18px; z-index: 100;
    display: flex; align-items: center; gap: 9px;
    padding: 12px 16px; border-radius: 13px;
    font-size: 13px; font-weight: 600; color: #fff;
    box-shadow: 0 12px 32px rgba(24,24,27,0.2);
    max-width: calc(100vw - 36px);
  }
  .spk-toast-success { background: ${UI.green}; }
  .spk-toast-error { background: ${UI.red}; }

  /* ── Modal ── */
  .spk-modal-backdrop {
    position: fixed; inset: 0; z-index: 90;
    background: rgba(24,24,27,0.5);
    display: flex; align-items: center; justify-content: center; padding: 18px;
  }
  .spk-modal {
    background: ${UI.surface}; border-radius: 22px;
    width: 100%; max-width: 440px; padding: 22px;
    box-shadow: 0 24px 60px rgba(24,24,27,0.28);
    max-height: calc(100vh - 40px); overflow-y: auto;
  }
  .spk-modal-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
  .spk-modal-title { font-size: 16.5px; font-weight: 700; color: ${UI.ink}; letter-spacing: -0.3px; }
  .spk-detail-row {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 13px; border-radius: 12px; background: ${UI.canvas};
    font-size: 12.5px;
  }
  .spk-detail-label { color: ${UI.subtle}; font-weight: 600; width: 92px; flex-shrink: 0; }
  .spk-detail-value { color: ${UI.ink}; font-weight: 600; min-width: 0; overflow-wrap: anywhere; }

  /* ── Footer note ── */
  .spk-footnote { text-align: center; font-size: 11.5px; color: ${UI.subtle}; font-weight: 500; padding: 6px 0 2px; }

  /* ── Spinner ── */
  @keyframes spk-spin { to { transform: rotate(360deg); } }
  .spk-spin { animation: spk-spin 0.8s linear infinite; display: inline-flex; }
`;
