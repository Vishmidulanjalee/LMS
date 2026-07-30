import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Bell, Menu, LogOut, ChevronRight, PlayCircle, Play,
  Loader2, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { DASHBOARD_CSS, UI } from './dashboardStyles';
import { getYouTubeThumbnail } from './youtube';

/** Injects the shared stylesheet. */
export const DashboardStyles = () => <style>{DASHBOARD_CSS}</style>;

export const initialsOf = (name, fallback = 'ST') =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || fallback;

/* ══ Sidebar ═══════════════════════════════════════════════════════ */

const SidebarPanel = ({
  brandIcon: BrandIcon, brandTitle, brandSub,
  nav, activeId, onNavSelect, footer, onSignOut, signOutLabel,
}) => (
  <aside className="spk-sidebar">
    <div className="spk-brand">
      <div className="spk-brand-mark">
        <BrandIcon size={19} strokeWidth={2.1} color="#fff" />
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="spk-brand-name">{brandTitle}</div>
        <div className="spk-brand-sub">{brandSub}</div>
      </div>
    </div>

    <div className="spk-nav-label">Menu</div>
    <nav className="spk-nav">
      {nav.map((item) => {
        const Icon = item.icon;
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            className={`spk-nav-item ${isActive ? 'spk-nav-item-active' : ''}`}
            onClick={() => onNavSelect(item)}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="spk-nav-icon">
              <Icon size={17} strokeWidth={isActive ? 2.3 : 1.9} />
            </span>
            {item.label}
            {typeof item.count === 'number' && item.count > 0 && (
              <span className="spk-nav-badge">{item.count}</span>
            )}
          </button>
        );
      })}
    </nav>

    <div style={{ flex: 1, minHeight: 18 }} />

    {footer && (
      <div className="spk-nav-card">
        <div className="spk-nav-card-title">{footer.title}</div>
        <div className="spk-nav-card-text">{footer.text}</div>
      </div>
    )}

    {onSignOut && (
      <button className="spk-signout" onClick={onSignOut}>
        <span className="spk-nav-icon">
          <LogOut size={16} strokeWidth={1.9} />
        </span>
        {signOutLabel}
      </button>
    )}
  </aside>
);

/* ══ Topbar ════════════════════════════════════════════════════════ */

const Topbar = ({ onOpenNav, search, onSearch, searchPlaceholder, user }) => (
  <div className="spk-topbar">
    <button className="spk-hamburger" onClick={onOpenNav} aria-label="Open menu">
      <Menu size={18} strokeWidth={2} />
    </button>

    {onSearch ? (
      <div className="spk-search">
        <Search size={16} strokeWidth={2} color={UI.subtle} />
        <input
          type="text"
          value={search}
          placeholder={searchPlaceholder}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search"
        />
        {search && (
          <button className="spk-search-clear" onClick={() => onSearch('')} aria-label="Clear search">
            <X size={15} strokeWidth={2.2} />
          </button>
        )}
      </div>
    ) : (
      <div style={{ flex: 1 }} />
    )}

    <button className="spk-topbar-icon" aria-label="Notifications">
      <Bell size={17} strokeWidth={1.9} />
      <span className="spk-topbar-dot" />
    </button>

    <div className="spk-user">
      <div className="spk-avatar">{initialsOf(user.name, user.fallback)}</div>
      <div className="spk-user-text">
        <div className="spk-user-name">{user.name || 'User'}</div>
        <div className="spk-user-meta">{user.meta}</div>
      </div>
    </div>
  </div>
);

/* ══ Shell ═════════════════════════════════════════════════════════ */

/**
 * Full dashboard chrome: dark sidebar (desktop) / drawer (mobile), topbar with
 * optional search + avatar, and a content column.
 *
 * `nav` items are `{ id, label, icon, count? }`. `onNavSelect(item)` decides
 * what selecting one means — the admin section routes, the student view
 * switches tabs — so the same shell drives both.
 */
export const DashboardShell = ({
  brandIcon, brandTitle = 'The BEE Academy', brandSub,
  nav, activeId, onNavSelect, sidebarFooter,
  search, onSearch, searchPlaceholder = 'Search…',
  user, onSignOut, signOutLabel = 'Sign Out',
  footnote,
  children,
}) => {
  const [navOpen, setNavOpen] = useState(false);

  const handleSelect = (item) => {
    onNavSelect(item);
    setNavOpen(false);
  };

  const panelProps = {
    brandIcon, brandTitle, brandSub, nav, activeId,
    onNavSelect: handleSelect, footer: sidebarFooter, onSignOut, signOutLabel,
  };

  return (
    <div className="spk-root">
      <DashboardStyles />
      <div className="spk-app">
        <div className="spk-sidebar-desktop">
          <SidebarPanel {...panelProps} />
        </div>

        <AnimatePresence>
          {navOpen && (
            <>
              <motion.div
                key="backdrop" className="spk-backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setNavOpen(false)}
              />
              <motion.div
                key="drawer" className="spk-drawer"
                initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <SidebarPanel {...panelProps} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="spk-main">
          <Topbar
            onOpenNav={() => setNavOpen(true)}
            search={search} onSearch={onSearch} searchPlaceholder={searchPlaceholder}
            user={user}
          />
          {children}
          <p className="spk-footnote">
            © {new Date().getFullYear()} The BEE Academy{footnote ? ` · ${footnote}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ══ Hero ══════════════════════════════════════════════════════════ */

export const Hero = ({ eyebrow, title, subtitle, icon: Icon, children }) => (
  <div className="spk-hero">
    {/* Decorative layers — pure CSS, no image assets */}
    <div className="spk-hero-blob" style={{ width: 300, height: 300, top: -150, right: -60, background: 'rgba(255,255,255,0.16)' }} />
    <div className="spk-hero-blob" style={{ width: 190, height: 190, bottom: -110, right: 150, background: 'rgba(255,255,255,0.12)' }} />
    <div className="spk-hero-blob" style={{ width: 14, height: 14, top: 34, right: 220, background: 'rgba(255,255,255,0.5)' }} />

    <div className="spk-hero-content">
      {eyebrow && <div className="spk-hero-eyebrow">{eyebrow}</div>}
      <h1 className="spk-hero-title">{title}</h1>
      {subtitle && <p className="spk-hero-sub">{subtitle}</p>}
      {children}
    </div>

    {Icon && (
      <div className="spk-hero-art">
        <Icon size={40} strokeWidth={1.5} />
      </div>
    )}
  </div>
);

/* ══ Stat tile ═════════════════════════════════════════════════════ */

const TONES = {
  amber: { bg: UI.accentSoft, fg: UI.accentDark, border: UI.accentSoftBorder },
  green: { bg: UI.greenSoft, fg: UI.green, border: UI.greenBorder },
  blue: { bg: UI.blueSoft, fg: UI.blue, border: UI.blueBorder },
  red: { bg: UI.redSoft, fg: UI.red, border: UI.redBorder },
  gray: { bg: UI.canvas, fg: UI.muted, border: UI.border },
};

export const StatCard = ({ icon: Icon, value, label, tone = 'amber' }) => {
  const t = TONES[tone] || TONES.amber;
  return (
    <div className="spk-stat">
      <div className="spk-stat-icon" style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.fg }}>
        <Icon size={17} strokeWidth={2} />
      </div>
      <div className="spk-stat-text">
        <div className="spk-stat-value">{value}</div>
        <div className="spk-stat-label">{label}</div>
      </div>
    </div>
  );
};

/* ══ Tabs & pills ══════════════════════════════════════════════════ */

/** Mobile-only section switcher (the sidebar covers this on desktop). */
export const SegmentedTabs = ({ tabs, active, onChange }) => (
  <div className="spk-segmented" role="tablist">
    {tabs.map((tab) => {
      const Icon = tab.icon;
      const isActive = active === tab.id;
      return (
        <button
          key={tab.id}
          role="tab"
          aria-selected={isActive}
          className={`spk-segment ${isActive ? 'spk-segment-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {Icon && <Icon size={15} strokeWidth={isActive ? 2.3 : 1.9} />}
          {tab.label}
        </button>
      );
    })}
  </div>
);

/** Filter pills, visible at every width (grade/month/status filters). */
export const FilterPills = ({ options, active, onChange }) => (
  <div className="spk-pills">
    {options.map((opt) => {
      const value = typeof opt === 'string' ? opt : opt.value;
      const label = typeof opt === 'string' ? opt : opt.label;
      const count = typeof opt === 'string' ? undefined : opt.count;
      const isActive = active === value;
      return (
        <button
          key={value}
          className={`spk-pill-btn ${isActive ? 'spk-pill-btn-active' : ''}`}
          onClick={() => onChange(value)}
        >
          {label}
          {typeof count === 'number' && <span className="spk-pill-count">{count}</span>}
        </button>
      );
    })}
  </div>
);

/* ══ Section header ════════════════════════════════════════════════ */

export const SectionBar = ({ title, subtitle, right }) => (
  <div className="spk-section-wrap">
    <div className="spk-section-bar">
      <div style={{ minWidth: 0 }}>
        <h2 className="spk-section-title">{title}</h2>
        {subtitle && <p className="spk-section-sub">{subtitle}</p>}
      </div>
      {right}
    </div>
  </div>
);

/** Small heading for a group of rows (a month, a recording type). */
export const GroupHead = ({ title, count }) => (
  <div className="spk-group-head">
    <div className="spk-group-rule" />
    <h3 className="spk-group-title">{title}</h3>
    {typeof count === 'number' && <span className="spk-count">{count}</span>}
  </div>
);

/* ══ Panel ═════════════════════════════════════════════════════════ */

export const Panel = ({ title, subtitle, count, right, children, style, className = '' }) => (
  <section className={`spk-panel ${className}`} style={style}>
    {(title || right) && (
      <div className="spk-panel-head">
        {title && (
          <div style={{ minWidth: 0 }}>
            <h2 className="spk-panel-title">{title}</h2>
            {subtitle && <p className="spk-panel-sub">{subtitle}</p>}
          </div>
        )}
        {typeof count === 'number' && <span className="spk-count">{count}</span>}
        <div style={{ flex: 1 }} />
        {right}
      </div>
    )}
    {children}
  </section>
);

/* ══ Right rail ════════════════════════════════════════════════════ */

export const RailCard = ({ title, action, onAction, children }) => (
  <div className="spk-rail-card">
    <div className="spk-rail-head">
      <h3 className="spk-rail-title">{title}</h3>
      {action && (
        <button className="spk-link" onClick={onAction}>
          {action}
          <ChevronRight size={13} strokeWidth={2.4} />
        </button>
      )}
    </div>
    {children}
  </div>
);

export const RailItem = ({ icon: Icon, tone = 'amber', title, sub }) => {
  const t = TONES[tone] || TONES.amber;
  return (
    <div className="spk-rail-item">
      <div className="spk-rail-dot" style={{ background: t.bg, color: t.fg }}>
        <Icon size={15} strokeWidth={2} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="spk-rail-item-title">{title}</div>
        {sub && <div className="spk-rail-item-sub">{sub}</div>}
      </div>
    </div>
  );
};

/* ══ Empty state ═══════════════════════════════════════════════════ */

export const EmptyState = ({ icon: Icon, title, hint, action }) => (
  <div className="spk-empty">
    <div className="spk-empty-icon">
      <Icon size={26} strokeWidth={1.8} />
    </div>
    <p className="spk-empty-title">{title}</p>
    {hint && <p className="spk-empty-sub">{hint}</p>}
    {action}
  </div>
);

/* ══ Video thumbnail ═══════════════════════════════════════════════ */

/**
 * YouTube thumbnail derived from the video link. Falls back to an amber play
 * tile when the link isn't YouTube or the image can't load, so a row never
 * renders as a broken image. `src` overrides the derived URL (custom uploads).
 */
export const VideoThumb = ({ url, src, duration, small = false }) => {
  const [failed, setFailed] = useState(false);
  const resolved = src || getYouTubeThumbnail(url);
  const showImage = resolved && !failed;

  return (
    <div className={`spk-thumb ${small ? 'spk-thumb-sm' : ''}`}>
      {showImage ? (
        <img src={resolved} alt="" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="spk-thumb-fallback">
          <PlayCircle size={22} strokeWidth={1.9} />
        </div>
      )}
      {showImage && (
        <span className="spk-thumb-play">
          <Play size={13} strokeWidth={2.4} fill="currentColor" />
        </span>
      )}
      {duration && <span className="spk-thumb-badge">{duration}</span>}
    </div>
  );
};

/* ══ Feedback ══════════════════════════════════════════════════════ */

export const Spinner = ({ size = 15 }) => (
  <span className="spk-spin"><Loader2 size={size} strokeWidth={2.4} /></span>
);

export const Toast = ({ toast }) =>
  toast ? (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`spk-toast ${toast.type === 'error' ? 'spk-toast-error' : 'spk-toast-success'}`}
    >
      {toast.type === 'error' ? <AlertCircle size={16} strokeWidth={2.2} /> : <CheckCircle2 size={16} strokeWidth={2.2} />}
      {toast.msg}
    </motion.div>
  ) : null;

export const Modal = ({ title, onClose, children }) => (
  <div className="spk-modal-backdrop" onClick={onClose}>
    <div className="spk-modal" onClick={(e) => e.stopPropagation()}>
      <div className="spk-modal-head">
        <h2 className="spk-modal-title">{title}</h2>
        <button className="spk-icon-btn" onClick={onClose} aria-label="Close">
          <X size={15} strokeWidth={2.2} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

export const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="spk-detail-row">
    {Icon && <Icon size={14} strokeWidth={2} color={UI.subtle} />}
    <span className="spk-detail-label">{label}</span>
    <span className="spk-detail-value">{value}</span>
  </div>
);

/* ══ Form field ════════════════════════════════════════════════════ */

export const Field = ({ label, hint, children }) => (
  <div>
    <span className="spk-label">
      {label}
      {hint && <span className="spk-label-hint"> {hint}</span>}
    </span>
    {children}
  </div>
);
