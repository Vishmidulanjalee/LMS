import { useState, useEffect } from 'react';
import {
  collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, where, Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import {
  FileText, Upload, Trash2, ExternalLink, Search, CalendarDays, Building2,
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
  if (g === 'Grade 9') return 'notes9';
  if (g === 'Grade 10 & 11') return 'notes1011';
  return 'documents';
};

const UploadDocument = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('');
  const [grade, setGrade] = useState('Grade 9');
  const [institution, setInstitution] = useState('');
  const [activeGrade, setActiveGrade] = useState('Grade 9');
  const [tutesByMonth, setTutesByMonth] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchTutes = async (g) => {
    const col = gradeCollection(g);
    const q = col === 'documents'
      ? query(collection(db, col), where('category', '==', 'Tutes'), orderBy('timestamp', 'desc'))
      : query(collection(db, col), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const grouped = {};
    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      const m = data.month || 'No Month';
      if (!grouped[m]) grouped[m] = [];
      grouped[m].push({ id: docSnap.id, ...data });
    });
    setTutesByMonth(grouped);
  };

  useEffect(() => { fetchTutes(activeGrade); }, [activeGrade]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile || !title || !month) return showToast('Please provide all fields.', 'error');
    try {
      setLoading(true);
      const col = gradeCollection(grade);
      const fileRef = ref(storage, `${col}/${Date.now()}_${pdfFile.name}`);
      await uploadBytes(fileRef, pdfFile);
      const fileUrl = await getDownloadURL(fileRef);
      const payload = {
        fileName: pdfFile.name,
        fileUrl,
        filePath: fileRef.fullPath,
        title,
        month,
        grade,
        timestamp: Timestamp.now(),
      };
      if (col === 'documents') payload.category = 'Tutes';
      if (institution.trim()) payload.institution = institution.trim();
      await addDoc(collection(db, col), payload);
      setPdfFile(null); setTitle(''); setMonth(''); setInstitution('');
      setActiveGrade(grade);
      showToast('Document uploaded.');
      fetchTutes(grade);
    } catch (err) {
      console.error(err);
      showToast('Upload failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, filePath) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await deleteDoc(doc(db, gradeCollection(activeGrade), id));
      await deleteObject(ref(storage, filePath));
      showToast('Document deleted.');
      fetchTutes(activeGrade);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete document.', 'error');
    }
  };

  const sortedMonths = Object.keys(tutesByMonth).sort((a, b) =>
    (MONTH_ORDER[a] ?? 99) - (MONTH_ORDER[b] ?? 99)
  );
  const totalTutes = Object.values(tutesByMonth).reduce((s, arr) => s + arr.length, 0);

  // Topbar search filters across every month in the active grade.
  const q = search.trim().toLowerCase();
  const filteredByMonth = sortedMonths.reduce((acc, m) => {
    const matched = q
      ? tutesByMonth[m].filter(f =>
          (f.title || '').toLowerCase().includes(q) || (f.fileName || '').toLowerCase().includes(q))
      : tutesByMonth[m];
    if (matched.length) acc[m] = matched;
    return acc;
  }, {});
  const visibleMonths = Object.keys(filteredByMonth);

  return (
    <AdminShell
      active="/UploadDocuments"
      search={search}
      onSearch={setSearch}
      searchPlaceholder="Search documents…"
      sidebarFooter={{
        title: 'Where these appear',
        text: 'Tutes show on the student Tutes page, grouped by month.',
      }}
    >
      <Toast toast={toast} />

      <Hero
        title="Tutes & Documents"
        subtitle="Upload tutorials, past papers, and notes for each grade."
        icon={FileText}
      />

      <div className="spk-stats spk-stats-3">
        <StatCard icon={FileText} value={totalTutes} label={`Files in ${activeGrade}`} />
        <StatCard icon={CalendarDays} value={sortedMonths.length} label="Months covered" tone="blue" />
        <StatCard icon={Search} value={visibleMonths.length} label="Months shown" tone="green" />
      </div>

      <SectionBar
        title="Study Materials"
        subtitle="Upload on the left; manage what's published on the right"
      />

      <div className="spk-split">
        {/* ── Upload form ── */}
        <Panel className="spk-sticky" title="New Tute" subtitle="Select a month and upload a PDF">
          <form onSubmit={handleSubmit} className="spk-field-stack">
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

            <Field label="Title">
              <input
                type="text" className="spk-input" value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Week 1 — Grammar Notes" required
              />
            </Field>

            <Field label="Institution" hint="(optional)">
              <input
                type="text" className="spk-input" value={institution}
                onChange={e => setInstitution(e.target.value)}
                placeholder="e.g. Royal College"
              />
            </Field>

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
              {loading ? <><Spinner size={16} /> Uploading…</> : <><Upload size={16} strokeWidth={2.1} /> Upload Tute</>}
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
                title={`No study materials uploaded for ${activeGrade}.`}
                hint="Use the form to upload the first document for this grade."
              />
            ) : visibleMonths.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No documents match your search."
                hint="Try a different title or clear the search box up top."
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                {visibleMonths.map(m => (
                  <div key={m}>
                    <GroupHead title={m} count={filteredByMonth[m].length} />
                    <div className="spk-list">
                      {filteredByMonth[m].map(file => (
                        <div key={file.id} className="spk-row">
                          <div className="spk-row-icon">
                            <FileText size={19} strokeWidth={1.9} />
                          </div>
                          <div className="spk-row-body">
                            <div className="spk-row-title spk-truncate">{file.title}</div>
                            <div className="spk-row-meta">
                              <span className="spk-truncate">{file.fileName}</span>
                              {file.institution && (
                                <span><Building2 size={12} strokeWidth={2} />{file.institution}</span>
                              )}
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
                              className="spk-icon-btn spk-icon-btn-danger"
                              onClick={() => handleDelete(file.id, file.filePath)}
                              title="Delete"
                            >
                              <Trash2 size={14} strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                      ))}
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

export default UploadDocument;
