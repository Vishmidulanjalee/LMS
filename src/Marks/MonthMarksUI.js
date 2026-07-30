import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { BarChart3, FileText, ExternalLink, ChevronLeft } from 'lucide-react';
import StudentShell from '../shared/StudentShell';
import { Hero, SectionBar, Panel, FilterPills, EmptyState } from '../shared/DashboardUI';

/**
 * Shared page for a single month of mark sheets — used by June, July, and
 * August. `sources` lists the Firestore collections to read and merge (June
 * pulls from the Grade 10/11 collection; July/August read the single
 * `marksheets` collection directly). `filters` adds the grade filter pills;
 * omit it for months with nothing to filter by.
 */
const MonthMarksUI = ({ month, sources, filters }) => {
  const navigate = useNavigate();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const results = await Promise.all(
          sources.map(async ({ collection: colName, grade }) => {
            const q = query(collection(db, colName), where('month', '==', month));
            const snap = await getDocs(q);
            return snap.docs.map((d) => ({ id: d.id, ...d.data(), grade: d.data().grade || grade }));
          }),
        );
        setMarks(results.flat());
      } catch (err) {
        console.error(`Error fetching ${month} mark sheets:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, [month, sources]);

  const filteredMarks = activeFilter === 'All' ? marks : marks.filter((m) => m.grade === activeFilter);

  return (
    <StudentShell active="/MarkSheets">
      <Hero
        eyebrow={filters?.[0]}
        title={`Mark Sheets — ${month}`}
        subtitle={`${month} exam results & mark sheets.`}
        icon={BarChart3}
      />

      <SectionBar
        title="Mark Sheets"
        subtitle={loading ? 'Loading…' : `${filteredMarks.length} ${filteredMarks.length === 1 ? 'sheet' : 'sheets'}`}
        right={
          <button className="spk-btn spk-btn-ghost spk-btn-sm" onClick={() => navigate('/MarkSheets')}>
            <ChevronLeft size={14} strokeWidth={2.2} />
            Back
          </button>
        }
      />

      {!loading && filters && filters.length > 0 && marks.length > 0 && (
        <FilterPills options={['All', ...filters]} active={activeFilter} onChange={setActiveFilter} />
      )}

      <Panel>
        {loading ? (
          <EmptyState icon={BarChart3} title="Loading mark sheets…" hint="This only takes a moment." />
        ) : filteredMarks.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title={`No mark sheets found for ${month}${activeFilter !== 'All' ? ` (${activeFilter})` : ''}.`}
            hint="Check back after results are released."
          />
        ) : (
          <div className="spk-list">
            {filteredMarks.map((mark) => (
              <div key={mark.id} className="spk-row">
                <div className="spk-row-icon">
                  <FileText size={20} strokeWidth={1.9} />
                </div>
                <div className="spk-row-body">
                  <div className="spk-row-title">{mark.title}</div>
                  <div className="spk-row-meta">
                    {mark.grade && <span className="spk-badge spk-badge-amber">{mark.grade}</span>}
                    <span>{mark.fileName}</span>
                  </div>
                </div>
                <div className="spk-row-actions">
                  <a href={mark.fileUrl} target="_blank" rel="noopener noreferrer" className="spk-btn spk-btn-soft spk-btn-sm">
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

export default MonthMarksUI;
