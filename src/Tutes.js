import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { BookOpen, FileText, ExternalLink } from 'lucide-react';
import StudentShell from './shared/StudentShell';
import { Hero, SectionBar, Panel, FilterPills, EmptyState } from './shared/DashboardUI';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_ORDER = Object.fromEntries(MONTHS.map((m, i) => [m, i]));

const Tutes = () => {
  const [tutesByMonth, setTutesByMonth] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeMonth, setActiveMonth] = useState('');

  useEffect(() => {
    const fetchTutes = async () => {
      try {
        // General tutes (documents collection) + Grade 10 & 11 tutes (notes1011 collection)
        const [snap1, snap2] = await Promise.all([
          getDocs(query(collection(db, 'documents'), where('category', '==', 'Tutes'))),
          getDocs(query(collection(db, 'notes1011'), orderBy('timestamp', 'desc'))),
        ]);

        const grouped = {};
        [...snap1.docs, ...snap2.docs].forEach((d) => {
          const data = d.data();
          const m = data.month || 'General';
          if (!grouped[m]) grouped[m] = [];
          grouped[m].push({ id: d.id, ...data });
        });

        setTutesByMonth(grouped);
        const sorted = Object.keys(grouped).sort((a, b) => (MONTH_ORDER[a] ?? 99) - (MONTH_ORDER[b] ?? 99));
        if (sorted.length > 0) setActiveMonth(sorted[0]);
      } catch (error) {
        console.error('Error fetching Tutes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutes();
  }, []);

  const sortedMonths = Object.keys(tutesByMonth).sort((a, b) => (MONTH_ORDER[a] ?? 99) - (MONTH_ORDER[b] ?? 99));
  const totalCount = Object.values(tutesByMonth).reduce((s, arr) => s + arr.length, 0);
  const activeDocs = tutesByMonth[activeMonth] || [];

  return (
    <StudentShell
      active="/docs/tutes"
      sidebarFooter={{
        title: 'Need help?',
        text: 'Reach out to your teacher if a tute looks missing.',
      }}
    >
      <Hero
        eyebrow={!loading && totalCount > 0 ? `${totalCount} ${totalCount === 1 ? 'document' : 'documents'}` : undefined}
        title="Tutes"
        subtitle="Tutorial documents organised by month."
        icon={BookOpen}
      />

      <SectionBar
        title={activeMonth || 'Tutes'}
        subtitle={loading ? 'Loading…' : `${activeDocs.length} ${activeDocs.length === 1 ? 'doc' : 'docs'}`}
      />

      {!loading && totalCount > 0 && (
        <FilterPills
          options={sortedMonths.map((m) => ({ value: m, label: m, count: tutesByMonth[m].length }))}
          active={activeMonth}
          onChange={setActiveMonth}
        />
      )}

      <Panel>
        {loading ? (
          <EmptyState icon={BookOpen} title="Loading tutes…" hint="This only takes a moment." />
        ) : totalCount === 0 ? (
          <EmptyState icon={BookOpen} title="No tutes uploaded yet." hint="Check back later for new documents." />
        ) : (
          <div className="spk-list">
            {activeDocs.map((doc) => (
              <div key={doc.id} className="spk-row">
                <div className="spk-row-icon">
                  <FileText size={20} strokeWidth={1.9} />
                </div>
                <div className="spk-row-body">
                  <div className="spk-row-title">{doc.title}</div>
                  <div className="spk-row-meta">
                    <span>{doc.fileName}</span>
                  </div>
                </div>
                <div className="spk-row-actions">
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="spk-btn spk-btn-soft spk-btn-sm">
                    <ExternalLink size={14} strokeWidth={2.2} />
                    View Full PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </StudentShell>
  );
};

export default Tutes;
