import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { BarChart3, CalendarDays, ChevronRight } from 'lucide-react';
import StudentShell from './shared/StudentShell';
import { Hero, SectionBar } from './shared/DashboardUI';

const MONTHS = [
  { name: 'June', route: '/marks/june' },
];

// The three collections your UploadMarks page writes to, depending on grade.
// If you add more grade collections later in UploadMarks.js, add them here too.
const GRADE_COLLECTIONS = ['marksheets', 'marks9', 'marks1011'];

const MarkSheets = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const results = {};
        await Promise.all(
          MONTHS.map(async ({ name }) => {
            const collectionCounts = await Promise.all(
              GRADE_COLLECTIONS.map(async (colName) => {
                const q = query(collection(db, colName), where('month', '==', name));
                const snap = await getDocs(q);
                return snap.size;
              }),
            );
            results[name] = collectionCounts.reduce((a, b) => a + b, 0);
          }),
        );
        setCounts(results);
      } catch (err) {
        console.error('Error fetching marksheet counts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const totalSheets = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <StudentShell
      active="/MarkSheets"
      sidebarFooter={{
        title: 'Need help?',
        text: 'Reach out to your teacher if a mark sheet looks missing.',
      }}
    >
      <Hero
        eyebrow={!loading && totalSheets > 0 ? `${totalSheets} total mark sheets` : undefined}
        title="View Mark Sheets"
        subtitle="All mark sheets organized by month."
        icon={BarChart3}
      />

      <SectionBar title="Mark Sheets" subtitle="Pick a month to see what's inside" />

      <div className="spk-folders">
        {MONTHS.map((month) => {
          const count = counts[month.name] ?? 0;
          return (
            <button key={month.name} className="spk-folder" onClick={() => navigate(month.route)}>
              <div className="spk-folder-cap" />
              <div className="spk-folder-body">
                <div className="spk-folder-icon">
                  <CalendarDays size={22} strokeWidth={1.9} />
                </div>
                <div className="spk-folder-name">{month.name}</div>
                <div className="spk-folder-desc">
                  {loading ? 'Loading mark sheets…' : `${count} mark ${count === 1 ? 'sheet' : 'sheets'} available`}
                </div>
                <div className="spk-folder-foot">
                  <span className="spk-count">{count}</span>
                  <span className="spk-link">
                    View Mark Sheets
                    <ChevronRight size={13} strokeWidth={2.4} />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </StudentShell>
  );
};

export default MarkSheets;
