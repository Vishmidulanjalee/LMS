import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, BarChart3, BookOpen, FolderOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { Hero } from './shared/DashboardUI';
import StudentShell from './shared/StudentShell';

const CARDS = [
  { id: 'videos', icon: Video, title: 'Class Recordings', desc: 'Watch & replay your lessons', cta: 'View', href: '/WatchVideosFolder' },
  { id: 'results', icon: BarChart3, title: 'Exam Results', desc: 'Track your grades & progress', cta: 'View', href: '/MarkSheets' },
  { id: 'tutes', icon: BookOpen, title: 'Tutes', desc: 'Study materials & documents', cta: 'View', href: '/docs/tutes' },
  { id: 'other', icon: FolderOpen, title: 'Other', desc: 'More resources & content', cta: 'Open', href: '/Other' },
];

/*
 * Scoped to this page (db2-*) rather than extending the shared .spk-card,
 * so the admin overview's 7-card grid keeps its own denser styling.
 */
const STYLES = `
  .db2-cards {
    display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;
  }
  @media (max-width: 560px) { .db2-cards { grid-template-columns: 1fr; } }
  /* Keep the shell's mobile stacking order (hero first, then content) */
  @media (max-width: 900px) { .db2-cards { order: 5; } }

  .db2-card {
    position: relative; overflow: hidden;
    display: flex; flex-direction: column; align-items: flex-start; text-align: left;
    background: #FFFFFF; border: 1px solid #DEDEE1;
    border-radius: 20px; padding: 22px 22px 18px;
    box-shadow: 0 1px 2px rgba(24,24,27,0.04);
    transition: border-color 0.22s, box-shadow 0.22s, transform 0.22s;
  }
  .db2-card:hover {
    border-color: #F59E0B;
    box-shadow: 0 16px 38px rgba(245,158,11,0.16);
    transform: translateY(-4px);
  }

  /* Accent bar sweeps across the top edge on hover */
  .db2-card::before {
    content: ''; position: absolute; top: 0; left: 0;
    height: 4px; width: 0; background: #F59E0B;
    transition: width 0.32s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .db2-card:hover::before { width: 100%; }

  /* Oversized watermark of the card's own icon, bleeding off the corner */
  .db2-watermark {
    position: absolute; right: -18px; bottom: -18px;
    color: #F59E0B; opacity: 0.06; pointer-events: none;
    transition: opacity 0.22s, transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .db2-card:hover .db2-watermark { opacity: 0.13; transform: scale(1.1) rotate(-6deg); }

  .db2-icon {
    width: 48px; height: 48px; border-radius: 15px; margin-bottom: 15px;
    background: #F59E0B; color: #fff;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(245,158,11,0.32);
    transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s, background 0.22s;
  }
  .db2-card:hover .db2-icon {
    transform: scale(1.09) rotate(-5deg);
    background: #D97706;
    box-shadow: 0 8px 20px rgba(217,119,6,0.42);
  }

  .db2-title {
    position: relative; z-index: 1;
    font-size: 16px; font-weight: 700; color: #18181B; letter-spacing: -0.25px;
  }
  .db2-desc {
    position: relative; z-index: 1; flex: 1;
    font-size: 12.5px; color: #A1A1AA; font-weight: 500;
    margin-top: 4px; line-height: 1.55;
  }

  .db2-cta {
    position: relative; z-index: 1;
    display: inline-flex; align-items: center; gap: 6px; margin-top: 18px;
    font-size: 12.5px; font-weight: 700; color: #B45309;
    transition: color 0.18s, gap 0.22s;
  }
  .db2-card:hover .db2-cta { color: #F59E0B; gap: 10px; }
  .db2-cta svg { transition: transform 0.22s; }
  .db2-card:hover .db2-cta svg { transform: translateX(2px); }
`;

export default function Dashboard2() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <StudentShell
      active="/Dashboard2"
      sidebarFooter={{
        title: 'Need help?',
        text: 'Reach out to your teacher if something looks missing.',
      }}
    >
      {(userName) => {
        const firstName = (userName || '').trim().split(/\s+/)[0];
        return (
          <>
            <style>{STYLES}</style>

            <Hero
              eyebrow={today}
              title={firstName ? `Welcome back, ${firstName}!` : 'Welcome back!'}
              subtitle="Everything you need for your studies — recordings, results, tutes, and more in one place."
              icon={GraduationCap}
            />

            <div className="db2-cards">
              {CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <button key={card.id} className="db2-card" onClick={() => navigate(card.href)}>
                    <Icon className="db2-watermark" size={116} strokeWidth={1.2} />

                    <div className="db2-icon">
                      <Icon size={23} strokeWidth={1.9} />
                    </div>
                    <div className="db2-title">{card.title}</div>
                    <div className="db2-desc">{card.desc}</div>
                    <span className="db2-cta">
                      {card.cta}
                      <ArrowRight size={14} strokeWidth={2.4} />
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        );
      }}
    </StudentShell>
  );
}
