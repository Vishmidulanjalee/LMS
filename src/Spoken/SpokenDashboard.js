import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  Video, PlayCircle, Folder, ClipboardList, PenLine, FileText, Download,
  ChevronLeft, ChevronRight, CalendarDays, Clock, ExternalLink, Inbox,
  GraduationCap, AlarmClock, CheckCircle2, Search, Mic,
} from 'lucide-react';
import { auth, db } from '../firebase';
import { UI as SPK } from '../shared/dashboardStyles';
import {
  DashboardShell, Hero, StatCard, SegmentedTabs, SectionBar, Panel,
  RailCard, RailItem, EmptyState, VideoThumb,
} from '../shared/DashboardUI';
import {
  RECORDING_FOLDERS, INSTRUCTORS,
  isAssessmentVisible, isContentVisible, formatDate, deadlineLabel, daysUntil, matchesSearch,
} from './spokenData';
import { SPOKEN, watchSpoken, sortByDate } from './spokenApi';

const TAB = { RECORDINGS: 'recordings', ASSESSMENTS: 'assessments', DOCUMENTS: 'documents' };

const SECTIONS = {
  [TAB.RECORDINGS]: {
    label: 'Course Recordings',
    icon: Video,
    subtitle: 'Lesson replays, grouped into two folders',
  },
  [TAB.ASSESSMENTS]: {
    label: 'Grammar Assessments',
    icon: ClipboardList,
    subtitle: 'Quizzes and assignments open to you right now',
  },
  [TAB.DOCUMENTS]: {
    label: 'Tutes & Documents',
    icon: FileText,
    subtitle: 'Worksheets, reference sheets, and handouts',
  },
};

/* ── Course Recordings ─────────────────────────────────────────────── */

const FolderGrid = ({ recordings, onOpen }) => (
  <div className="spk-folders">
    {RECORDING_FOLDERS.map((folder) => {
      const items = recordings.filter((r) => r.folder === folder.id);
      const latest = items[items.length - 1];
      return (
        <button key={folder.id} className="spk-folder" onClick={() => onOpen(folder.id)}>
          <div className="spk-folder-cap" />
          <div className="spk-folder-body">
            <div className="spk-folder-icon">
              <Folder size={22} strokeWidth={1.9} />
            </div>
            <div className="spk-folder-name">{folder.name}</div>
            <div className="spk-folder-desc">{folder.description}</div>
            {latest && (
              <div style={{ fontSize: 11.5, color: SPK.muted, fontWeight: 600, marginTop: 12 }}>
                Latest · {latest.title}
              </div>
            )}
            <div className="spk-folder-foot">
              <span className="spk-count">
                {items.length} {items.length === 1 ? 'video' : 'videos'}
              </span>
              <span className="spk-link">
                Open folder
                <ChevronRight size={13} strokeWidth={2.4} />
              </span>
            </div>
          </div>
        </button>
      );
    })}
  </div>
);

const RecordingList = ({ items, search }) =>
  items.length === 0 ? (
    <EmptyState
      icon={search ? Search : Video}
      title={search ? 'No recordings match your search.' : 'No recordings uploaded yet.'}
      hint={
        search
          ? 'Try a different title or clear the search box up top.'
          : "Your teacher hasn't added sessions to this folder. Check back after your next class."
      }
    />
  ) : (
    <div className="spk-list">
      {items.map((rec) => (
        <div key={rec.id} className="spk-row">
          <VideoThumb url={rec.videoUrl} duration={rec.duration} />
          <div className="spk-row-body">
            <div className="spk-row-title">{rec.title}</div>
            <div className="spk-row-meta">
              <span><CalendarDays size={12} strokeWidth={2} />{formatDate(rec.date)}</span>
              {rec.duration && <span><Clock size={12} strokeWidth={2} />{rec.duration}</span>}
            </div>
          </div>
          <div className="spk-row-actions">
            <a href={rec.videoUrl} target="_blank" rel="noopener noreferrer" className="spk-btn spk-btn-soft">
              <PlayCircle size={15} strokeWidth={2} />
              Watch
            </a>
          </div>
        </div>
      ))}
    </div>
  );

/* ── Grammar Assessments ───────────────────────────────────────────── */

const AssessmentList = ({ items, search }) =>
  items.length === 0 ? (
    <EmptyState
      icon={search ? Search : ClipboardList}
      title={search ? 'Nothing matches your search.' : 'No assessments open right now.'}
      hint={
        search
          ? 'Try a different title or clear the search box up top.'
          : 'New quizzes and assignments appear here as soon as your teacher publishes them.'
      }
    />
  ) : (
    <div className="spk-list">
      {items.map((item) => {
        const isQuiz = item.type === 'quiz';
        const days = daysUntil(item.expiresAt);
        const urgent = days !== null && days <= 2;
        return (
          <div key={item.id} className="spk-row">
            <div className="spk-row-icon">
              {isQuiz ? <ClipboardList size={20} strokeWidth={1.9} /> : <PenLine size={20} strokeWidth={1.9} />}
            </div>
            <div className="spk-row-body">
              <div className="spk-row-title">{item.title}</div>
              <div className="spk-row-meta">
                <span className={`spk-badge ${isQuiz ? 'spk-badge-amber' : 'spk-badge-blue'}`}>
                  {isQuiz ? 'Quiz' : 'Assignment'}
                </span>
                {item.expiresAt ? (
                  <span style={urgent ? { color: SPK.red, fontWeight: 700 } : undefined}>
                    <AlarmClock size={12} strokeWidth={2} />
                    {deadlineLabel(item.expiresAt)} · {formatDate(item.expiresAt)}
                  </span>
                ) : (
                  <span><Clock size={12} strokeWidth={2} />No deadline</span>
                )}
              </div>
            </div>
            <div className="spk-row-actions">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="spk-btn spk-btn-soft">
                <ExternalLink size={14} strokeWidth={2.2} />
                {isQuiz ? 'Start Quiz' : 'View Assignment'}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );

/* ── Tutes & Other Documents ───────────────────────────────────────── */

const DocumentList = ({ items, search }) =>
  items.length === 0 ? (
    <EmptyState
      icon={search ? Search : Inbox}
      title={search ? 'No documents match your search.' : 'No documents uploaded yet.'}
      hint={
        search
          ? 'Try a different title or clear the search box up top.'
          : 'Tutes and reference sheets shared by your teacher will show up here.'
      }
    />
  ) : (
    <div className="spk-list">
      {items.map((docItem) => (
        <div key={docItem.id} className="spk-row">
          <div className="spk-row-icon">
            <FileText size={20} strokeWidth={1.9} />
          </div>
          <div className="spk-row-body">
            <div className="spk-row-title">{docItem.title}</div>
            <div className="spk-row-meta">
              <span>{docItem.fileName}</span>
              <span><CalendarDays size={12} strokeWidth={2} />{formatDate(docItem.uploadedAt)}</span>
            </div>
          </div>
          <div className="spk-row-actions">
            <a href={docItem.fileUrl} target="_blank" rel="noopener noreferrer" className="spk-btn spk-btn-ghost">
              <ExternalLink size={14} strokeWidth={2.2} />
              View
            </a>
            <a href={docItem.fileUrl} download className="spk-btn spk-btn-soft">
              <Download size={15} strokeWidth={2} />
              Download
            </a>
          </div>
        </div>
      ))}
    </div>
  );

/* ── Page ──────────────────────────────────────────────────────────── */

const SpokenDashboard = () => {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [profile, setProfile] = useState({ name: '', studentId: '' });
  const [allRecordings, setAllRecordings] = useState([]);
  const [allAssessments, setAllAssessments] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Navigation state lives in the URL, so the sidebar, the mobile tabs, the
  // breadcrumb and the browser's own back button all stay in agreement.
  const tabParam = params.get('tab');
  const activeTab = SECTIONS[tabParam] ? tabParam : TAB.RECORDINGS;
  const folderId = params.get('folder');
  const openFolder = RECORDING_FOLDERS.find((f) => f.id === folderId) || null;

  const goToTab = useCallback(
    (id) => setParams(id === TAB.RECORDINGS ? {} : { tab: id }),
    [setParams],
  );
  const openFolderById = useCallback(
    (id) => setParams({ tab: TAB.RECORDINGS, folder: id }),
    [setParams],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setProfile({ name: data.username || data.name || '', studentId: data.studentId || '' });
        }
      } catch {}
    });
    return () => unsubscribe();
  }, []);

  // Live content from Firestore — whatever admin publishes lands here without
  // the student reloading.
  useEffect(() => {
    let pending = 3;
    const done = () => { pending -= 1; if (pending === 0) setLoading(false); };
    const subs = [
      watchSpoken(SPOKEN.recordings, (items) => { setAllRecordings(sortByDate(items, 'date')); done(); }, done),
      watchSpoken(SPOKEN.assessments, (items) => { setAllAssessments(sortByDate(items, 'expiresAt')); done(); }, done),
      watchSpoken(SPOKEN.documents, (items) => { setAllDocuments(sortByDate(items, 'uploadedAt')); done(); }, done),
    ];
    return () => subs.forEach((unsub) => unsub());
  }, []);

  // Expired or admin-hidden quizzes never render.
  const openAssessments = useMemo(
    () => allAssessments.filter((item) => isAssessmentVisible(item)),
    [allAssessments],
  );

  // The topbar search filters whichever list is on screen. Anything the admin
  // has hidden never reaches this list at all — same rule the folder counts
  // and stat tiles below read from.
  const recordings = useMemo(
    () => allRecordings.filter((r) => isContentVisible(r) && matchesSearch(r, search, ['title'])),
    [allRecordings, search],
  );
  const assessments = useMemo(
    () => openAssessments.filter((a) => matchesSearch(a, search, ['title'])),
    [openAssessments, search],
  );
  const documents = useMemo(
    () => allDocuments.filter((d) => isContentVisible(d) && matchesSearch(d, search, ['title', 'fileName'])),
    [allDocuments, search],
  );

  // Unfiltered by search, but still hidden-aware — these back the nav badges
  // and stat tiles, which shouldn't move as the student types into search.
  const visibleRecordingsCount = useMemo(() => allRecordings.filter(isContentVisible).length, [allRecordings]);
  const visibleDocumentsCount = useMemo(() => allDocuments.filter(isContentVisible).length, [allDocuments]);

  const nav = Object.entries(SECTIONS).map(([id, s]) => ({
    id,
    label: s.label,
    icon: s.icon,
    count:
      id === TAB.RECORDINGS ? visibleRecordingsCount
        : id === TAB.ASSESSMENTS ? openAssessments.length
          : visibleDocumentsCount,
  }));

  const upcoming = useMemo(
    () =>
      openAssessments
        .filter((a) => a.expiresAt)
        .sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt))
        .slice(0, 3),
    [openAssessments],
  );

  const nextDeadline = upcoming[0];
  const firstName = (profile.name || '').trim().split(/\s+/)[0];
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const handleSignOut = async () => {
    try { await signOut(auth); } catch {}
    navigate('/Signin');
  };

  const section = SECTIONS[activeTab];
  const inFolder = activeTab === TAB.RECORDINGS && openFolder;

  return (
    <DashboardShell
      brandIcon={Mic}
      brandSub="Spoken English"
      nav={nav}
      activeId={activeTab}
      onNavSelect={(item) => goToTab(item.id)}
      footnote="Spoken English Programme"
      sidebarFooter={{
        title: 'Need help?',
        text: 'Message your instructor if a recording or quiz link is missing.',
      }}
      search={search}
      onSearch={setSearch}
      searchPlaceholder="Search recordings, quizzes, documents…"
      user={{
        name: profile.name,
        meta: profile.studentId ? `${profile.studentId} · Spoken` : 'Spoken Programme',
      }}
      onSignOut={handleSignOut}
    >
      <Hero
        eyebrow={today}
        title={firstName ? `Welcome back, ${firstName}!` : 'Welcome back!'}
        subtitle={
          nextDeadline
            ? `Your next deadline is “${nextDeadline.title}” — ${deadlineLabel(nextDeadline.expiresAt).toLowerCase()}.`
            : 'Everything for your Spoken English course — recordings, assessments, and documents in one place.'
        }
        icon={GraduationCap}
      />

      <div className="spk-stats">
        <StatCard icon={Video} value={visibleRecordingsCount} label="Course recordings" />
        <StatCard icon={ClipboardList} value={openAssessments.length} label="Open assessments" tone="green" />
        <StatCard
          icon={AlarmClock}
          value={nextDeadline ? deadlineLabel(nextDeadline.expiresAt) : '—'}
          label="Next deadline"
          tone={nextDeadline && daysUntil(nextDeadline.expiresAt) <= 2 ? 'amber' : 'blue'}
        />
        <StatCard icon={FileText} value={visibleDocumentsCount} label="Documents" tone="gray" />
      </div>

      {/* Section switcher — sidebar handles this on desktop, this on mobile */}
      <SegmentedTabs tabs={nav} active={activeTab} onChange={goToTab} />

      <SectionBar
        title={inFolder ? openFolder.name : section.label}
        subtitle={inFolder ? openFolder.description : section.subtitle}
        right={
          inFolder ? (
            <button className="spk-btn spk-btn-ghost spk-btn-sm" onClick={() => goToTab(TAB.RECORDINGS)}>
              <ChevronLeft size={14} strokeWidth={2.2} />
              Back to folders
            </button>
          ) : null
        }
      />

      <div className="spk-columns">
        <div>
          {loading ? (
            <Panel>
              <EmptyState
                icon={section.icon}
                title="Loading your course content…"
                hint="Fetching the latest recordings, quizzes, and documents."
              />
            </Panel>
          ) : (
            <>
              {/* Folder cards stand alone — no wrapping panel, so the two folders
                  read as two separate boxes. */}
              {activeTab === TAB.RECORDINGS && !inFolder && (
                <FolderGrid recordings={recordings} onOpen={openFolderById} />
              )}
              {activeTab === TAB.RECORDINGS && inFolder && (
                <Panel>
                  <RecordingList items={recordings.filter((r) => r.folder === openFolder.id)} search={search} />
                </Panel>
              )}
              {activeTab === TAB.ASSESSMENTS && (
                <Panel><AssessmentList items={assessments} search={search} /></Panel>
              )}
              {activeTab === TAB.DOCUMENTS && (
                <Panel><DocumentList items={documents} search={search} /></Panel>
              )}
            </>
          )}
        </div>

        <div className="spk-rail">
          <RailCard title="Upcoming deadlines">
            {upcoming.length === 0 ? (
              <RailItem icon={CheckCircle2} tone="green" title="Nothing due" sub="You're all caught up." />
            ) : (
              upcoming.map((item) => (
                <RailItem
                  key={item.id}
                  icon={item.type === 'quiz' ? ClipboardList : PenLine}
                  tone={daysUntil(item.expiresAt) <= 2 ? 'red' : 'amber'}
                  title={item.title}
                  sub={`${deadlineLabel(item.expiresAt)} · ${formatDate(item.expiresAt)}`}
                />
              ))
            )}
          </RailCard>

          <RailCard title="Your instructors">
            <div className="spk-teachers">
              {INSTRUCTORS.map((t) => (
                <div key={t.id} className="spk-teacher">
                  <div className="spk-teacher-avatar" style={{ background: t.color }}>
                    {t.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="spk-rail-item-title">{t.name}</div>
                    <div className="spk-rail-item-sub">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </RailCard>
        </div>
      </div>
    </DashboardShell>
  );
};

export default SpokenDashboard;
