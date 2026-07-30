import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Video, PlayCircle, Folder, ChevronLeft, ChevronRight } from 'lucide-react';
import StudentShell from '../shared/StudentShell';
import { Hero, SectionBar, Panel, GroupHead, EmptyState, VideoThumb } from '../shared/DashboardUI';

export const RecordingList = ({ items }) => (
  <div className="spk-list">
    {items.map((rec) => (
      <div key={rec.id} className="spk-row">
        <VideoThumb src={rec.thumbnail} url={rec.link} />
        <div className="spk-row-body">
          <div className="spk-row-title">{rec.title}</div>
        </div>
        <div className="spk-row-actions">
          <a href={rec.link} target="_blank" rel="noopener noreferrer" className="spk-btn spk-btn-soft spk-btn-sm">
            <PlayCircle size={14} strokeWidth={2} />
            Watch
          </a>
        </div>
      </div>
    ))}
  </div>
);

/**
 * Shared page for a single month of class recordings — used by January
 * through July. `gradeFilter` adds a `where('grade', '==', …)` clause
 * (only the Grade 10 & 11 months need it); `folders` switches from the
 * flat "every type stacked" layout (Jan–Mar) to folder-style navigation
 * (May–July), where recordings are grouped under named topics.
 */
const MonthRecordingsUI = ({ month, gradeFilter, folders }) => {
  const navigate = useNavigate();
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [openFolder, setOpenFolder] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const clauses = [where('month', '==', month)];
        if (gradeFilter) clauses.push(where('grade', '==', gradeFilter));
        const q = query(collection(db, 'recordings'), ...clauses, orderBy('timestamp', 'asc'));
        const snap = await getDocs(q);
        const g = {};
        snap.docs.forEach((d) => {
          const data = d.data();
          const type = data.type || 'General';
          if (!g[type]) g[type] = [];
          g[type].push({ id: d.id, ...data });
        });
        setGrouped(g);
      } catch (err) {
        console.error(`Error fetching ${month} recordings:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [month, gradeFilter]);

  const totalCount = Object.values(grouped).reduce((a, b) => a + b.length, 0);
  const openItems = openFolder ? (grouped[openFolder] || []) : [];

  const backButton = (
    <button
      className="spk-btn spk-btn-ghost spk-btn-sm"
      onClick={() => (openFolder ? setOpenFolder(null) : navigate('/WatchVideosFolder'))}
    >
      <ChevronLeft size={14} strokeWidth={2.2} />
      {openFolder ? 'Back to folders' : 'Back'}
    </button>
  );

  return (
    <StudentShell active="/WatchVideosFolder">
      <Hero
        eyebrow={gradeFilter || undefined}
        title={`Recordings — ${month}`}
        subtitle={`Class recordings for ${month}${folders ? ', grouped by topic' : ''}.`}
        icon={Video}
      />

      <SectionBar
        title={openFolder || `${month} Recordings`}
        subtitle={openFolder ? `${openItems.length} ${openItems.length === 1 ? 'recording' : 'recordings'}` : `${totalCount} total this month`}
        right={backButton}
      />

      {loading ? (
        <Panel><EmptyState icon={Video} title="Loading recordings…" hint="This only takes a moment." /></Panel>
      ) : folders ? (
        openFolder ? (
          <Panel>
            {openItems.length === 0 ? (
              <EmptyState icon={Video} title="This folder is empty." hint="Recordings will appear here once uploaded." />
            ) : (
              <RecordingList items={openItems} />
            )}
          </Panel>
        ) : (
          <div className="spk-folders">
            {folders.map((name) => {
              const items = grouped[name] || [];
              return (
                <button key={name} className="spk-folder" onClick={() => setOpenFolder(name)}>
                  <div className="spk-folder-cap" />
                  <div className="spk-folder-body">
                    <div className="spk-folder-icon"><Folder size={22} strokeWidth={1.9} /></div>
                    <div className="spk-folder-name">{name}</div>
                    <div className="spk-folder-desc">
                      {items.length > 0 ? `${items.length} recording${items.length === 1 ? '' : 's'}` : 'No recordings yet'}
                    </div>
                    <div className="spk-folder-foot">
                      <span className="spk-count">{items.length}</span>
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
        )
      ) : totalCount === 0 ? (
        <Panel>
          <EmptyState icon={Video} title={`No recordings found for ${month}.`} hint="Check back after your next class." />
        </Panel>
      ) : (
        <Panel>
          {Object.entries(grouped).map(([type, items], i) => (
            <div key={type} style={{ marginTop: i === 0 ? 0 : 28 }}>
              <GroupHead title={type} count={items.length} />
              <RecordingList items={items} />
            </div>
          ))}
        </Panel>
      )}
    </StudentShell>
  );
};

export default MonthRecordingsUI;
