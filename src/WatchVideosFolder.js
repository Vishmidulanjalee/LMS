import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Video } from 'lucide-react';
import StudentShell from './shared/StudentShell';
import { Hero, SectionBar, Panel, FilterPills, GroupHead, EmptyState } from './shared/DashboardUI';
import { RecordingList } from './Recordings/MonthRecordingsUI';

// April onward is scoped to Grade 10 & 11; January–March recordings aren't
// grade-tagged in Firestore, so no extra filter is applied for those months.
const MONTHS = [
  { name: 'January' },
  { name: 'February' },
  { name: 'March' },
  { name: 'April', gradeFilter: 'Grade 10 & 11' },
  { name: 'May', gradeFilter: 'Grade 10 & 11' },
  { name: 'June', gradeFilter: 'Grade 10 & 11' },
  { name: 'July', gradeFilter: 'Grade 10 & 11' },
  { name: 'August', gradeFilter: 'Grade 10 & 11' },
];

const WatchVideosFolder = () => {
  const [byMonth, setByMonth] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeMonth, setActiveMonth] = useState('January');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          MONTHS.map(async ({ name, gradeFilter }) => {
            const clauses = [where('month', '==', name)];
            if (gradeFilter) clauses.push(where('grade', '==', gradeFilter));
            const q = query(collection(db, 'recordings'), ...clauses, orderBy('timestamp', 'asc'));
            const snap = await getDocs(q);
            return [name, snap.docs.map((d) => ({ id: d.id, ...d.data() }))];
          }),
        );
        setByMonth(Object.fromEntries(results));
      } catch (err) {
        console.error('Error fetching recordings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalRecordings = Object.values(byMonth).reduce((a, arr) => a + arr.length, 0);
  const activeRecordings = byMonth[activeMonth] || [];

  // Group the active month's recordings by topic/type, same field the old
  // per-month pages grouped by.
  const grouped = {};
  activeRecordings.forEach((rec) => {
    const type = rec.type || 'General';
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(rec);
  });

  return (
    <StudentShell
      active="/WatchVideosFolder"
      sidebarFooter={{
        title: 'Need help?',
        text: 'Reach out to your teacher if a recording link is missing.',
      }}
    >
      <Hero
        eyebrow={!loading && totalRecordings > 0 ? `${totalRecordings} total recordings` : undefined}
        title="Watch Recordings"
        subtitle="All class recordings organized by month."
        icon={Video}
      />

      <SectionBar
        title={activeMonth}
        subtitle={loading ? 'Loading…' : `${activeRecordings.length} ${activeRecordings.length === 1 ? 'recording' : 'recordings'}`}
      />

      <FilterPills
        options={MONTHS.map((m) => ({ value: m.name, label: m.name, count: (byMonth[m.name] || []).length }))}
        active={activeMonth}
        onChange={setActiveMonth}
      />

      <Panel>
        {loading ? (
          <EmptyState icon={Video} title="Loading recordings…" hint="This only takes a moment." />
        ) : activeRecordings.length === 0 ? (
          <EmptyState icon={Video} title={`No recordings found for ${activeMonth}.`} hint="Check back after your next class." />
        ) : (
          Object.entries(grouped).map(([type, items], i) => (
            <div key={type} style={{ marginTop: i === 0 ? 0 : 28 }}>
              <GroupHead title={type} count={items.length} />
              <RecordingList items={items} />
            </div>
          ))
        )}
      </Panel>
    </StudentShell>
  );
};

export default WatchVideosFolder;
