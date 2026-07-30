import React, { useState, useEffect } from 'react';
import {
  collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, Timestamp, updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import {
  BarChart3, Upload, Trash2, Eye, EyeOff, FileText, ExternalLink,
  Search, CalendarDays,
} from 'lucide-react';
import { db, storage } from '../firebase';
import AdminShell from './AdminShell';
import {
  Hero, StatCard, SectionBar, Panel, EmptyState, Toast, Spinner,
  FilterPills, GroupHead, Field,
} from '../shared/DashboardUI';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const MONTH_ORDER = Object.fromEntries(MONTHS.map((m, i) => [m, i]));

const GRADES = ['General', 'Grade 9', 'Grade 10 & 11'];

const gradeCollection = (g) => {
  if (g === 'Grade 9') return 'marks9';
  if (g === 'Grade 10 & 11') return 'marks1011';
  return 'marksheets';
};

const UploadMarks = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('');
  const [grade, setGrade] = useState('Grade 9');
  const [marksByMonth, setMarksByMonth] = useState({});
  const [activeGrade, setActiveGrade] = useState('Grade 9');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMarks = async (g) => {
    const col = gradeCollection(g);
    const q = query(collection(db, col), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const grouped = {};
    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      const m = data.month || 'Uncategorized';
      if (!grouped[m]) grouped[m] = [];
      grouped[m].push({ id: docSnap.id, ...data });
    });
    setMarksByMonth(grouped);
  };

  useEffect(() => { fetchMarks(activeGrade); }, [activeGrade]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile || !month || !title) {
      showToast('Please fill all fields: Title, Month, Grade, and PDF file.', 'error');
      return;
    }
    try {
      setLoading(true);
      const col = gradeCollection(grade);
      const fileRef = ref(storage, `${col}/${Date.now()}_${pdfFile.name}`);
      await uploadBytes(fileRef, pdfFile);
      const fileUrl = await getDownloadURL(fileRef);
      await addDoc(collection(db, col), {
        title,
        fileName: pdfFile.name,
        fileUrl,
        filePath: fileRef.fullPath,
        month,
        grade,
        hidden: false,           // <-- default visible
        timestamp: Timestamp.now(),
      });
      setPdfFile(null); setTitle(''); setMonth('');
      setActiveGrade(grade);
      showToast('Marks sheet uploaded.');
      fetchMarks(grade);
    } catch (err) {
      console.error(err);
      showToast('Upload failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, filePath) => {
    if (!window.confirm('Delete this marks sheet?')) return;
    try {
      await deleteDoc(doc(db, gradeCollection(activeGrade), id));
      await deleteObject(ref(storage, filePath));
      showToast('Marks sheet deleted.');
      fetchMarks(activeGrade);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete.', 'error');
    }
  };

  // Toggle the `hidden` field so students stop seeing a sheet without deleting it.
  const handleToggleHide = async (id, currentHidden) => {
    try {
      await updateDoc(doc(db, gradeCollection(activeGrade), id), { hidden: !currentHidden });
      showToast(currentHidden ? 'Now visible to students.' : 'Hidden from students.');
      fetchMarks(activeGrade);
    } catch (err) {
      console.error(err);
      showToast('Failed to update visibility.', 'error');
    }
  };

  const sortedMonths = Object.keys(marksByMonth).sort((a, b) => (MONTH_ORDER[a] ?? 99) - (MONTH_ORDER[b] ?? 99));
  const total = Object.values(marksByMonth).reduce((s, arr) => s + arr.length, 0);
  const hiddenCount = Object.values(marksByMonth).reduce(
    (s, arr) => s + arr.filter(f => f.hidden).length, 0,
  );

  // Topbar search filters across every month in the active grade.
  const q = search.trim().toLowerCase();
  const filteredByMonth = sortedMonths.reduce((acc, m) => {
    const matched = q
      ? marksByMonth[m].filter(f =>
          (f.title || '').toLowerCase().includes(q) || (f.fileName || '').toLowerCase().includes(q))
      : marksByMonth[m];
    if (matched.length) acc[m] = matched;
    return acc;
  }, {});
  const visibleMonths = Object.keys(filteredByMonth);

  return (
    <AdminShell
      active="/UploadMarks"
      search={search}
      onSearch={setSearch}
      searchPlaceholder="Search marks sheets…"
      sidebarFooter={{
        title: 'Hide instead of delete',
        text: 'The eye toggle pulls a sheet from students but keeps the file.',
      }}
    >
      <Toast toast={toast} />

      <Hero
        title="Exam Results"
        subtitle="Upload monthly result sheets and control which ones students can see."
        icon={BarChart3}
      />

      <div className="spk-stats spk-stats-3">
        <StatCard icon={FileText} value={total} label={`Sheets in ${activeGrade}`} />
        <StatCard icon={CalendarDays} value={sortedMonths.length} label="Months covered" tone="blue" />
        <StatCard icon={EyeOff} value={hiddenCount} label="Hidden from students" tone={hiddenCount ? 'amber' : 'gray'} />
      </div>

      <SectionBar
        title="Marks Sheets"
        subtitle="Upload on the left; manage what's published on the right"
      />

      <div className="spk-split">
        {/* ── Upload form ── */}
        <Panel className="spk-sticky" title="New Marks Sheet" subtitle="Upload a PDF for a specific grade">
          <form onSubmit={handleSubmit} className="spk-field-stack">
            <Field label="Title">
              <input
                type="text" className="spk-input" value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. March Term Test Results" required
              />
            </Field>

            <div className="spk-field-row">
              <Field label="Grade">
                <select className="spk-input" value={grade} onChange={e => setGrade(e.target.value)} required>
                  {GRADES.map((g, i) => <option key={i} value={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="Month">
                <select className="spk-input" value={month} onChange={e => setMonth(e.target.value)} required>
                  <option value="">Select Month</option>
                  {MONTHS.map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
              </Field>
            </div>

            <Field label="PDF File">
              <div className={`spk-file ${pdfFile ? 'spk-file-ok' : ''}`}>
                <input
                  type="file" accept="application/pdf"
                  onChange={e => setPdfFile(e.target.files[0])}
                  required
                />
                {pdfFile && <p className="spk-file-note">✓ {pdfFile.name}</p>}
              </div>
            </Field>

            <button type="submit" className="spk-btn spk-btn-solid spk-btn-lg spk-btn-block" disabled={loading}>
              {loading ? <><Spinner size={16} /> Uploading…</> : <><Upload size={16} strokeWidth={2.1} /> Upload Marks</>}
            </button>
          </form>
        </Panel>

        {/* ── Published list ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <FilterPills options={GRADES} active={activeGrade} onChange={setActiveGrade} />

          <Panel>
            {sortedMonths.length === 0 ? (
              <EmptyState
                icon={FileText}
                title={`No marks uploaded for ${activeGrade}.`}
                hint="Use the form to upload the first result sheet for this grade."
              />
            ) : visibleMonths.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No sheets match your search."
                hint="Try a different title or clear the search box up top."
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                {visibleMonths.map(m => (
                  <div key={m}>
                    <GroupHead title={m} count={filteredByMonth[m].length} />
                    <div className="spk-list">
                      {filteredByMonth[m].map(file => {
                        const isHidden = !!file.hidden;
                        return (
                          <div key={file.id} className={`spk-row ${isHidden ? 'spk-row-dim' : ''}`}>
                            <div className="spk-row-icon">
                              <FileText size={19} strokeWidth={1.9} />
                            </div>
                            <div className="spk-row-body">
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <span className="spk-row-title spk-truncate">{file.title}</span>
                                {isHidden && <span className="spk-badge spk-badge-gray">Hidden</span>}
                              </div>
                              <div className="spk-row-meta">
                                <span className="spk-truncate">{file.fileName}</span>
                              </div>
                            </div>

                            <div className="spk-row-actions">
                              <a
                                href={file.fileUrl} target="_blank" rel="noopener noreferrer"
                                className="spk-btn spk-btn-soft spk-btn-sm"
                              >
                                <ExternalLink size={13} strokeWidth={2.2} /> View PDF
                              </a>
                              <button
                                className={`spk-icon-btn ${isHidden ? '' : 'spk-icon-btn-blue'}`}
                                onClick={() => handleToggleHide(file.id, isHidden)}
                                title={isHidden ? 'Show to students' : 'Hide from students'}
                              >
                                {isHidden ? <EyeOff size={14} strokeWidth={2} /> : <Eye size={14} strokeWidth={2} />}
                              </button>
                              <button
                                className="spk-icon-btn spk-icon-btn-danger"
                                onClick={() => handleDelete(file.id, file.filePath)}
                                title="Delete"
                              >
                                <Trash2 size={14} strokeWidth={2} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </AdminShell>
  );
};

export default UploadMarks;
