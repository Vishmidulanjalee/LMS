import { useState, useEffect } from 'react';
import {
  addDoc, collection, getDocs, orderBy, query, Timestamp,
  deleteDoc, doc, updateDoc,
} from 'firebase/firestore';
import {
  Video, Upload, Link2, Pencil, Trash2, Check, X, Search, CalendarDays, Film,
} from 'lucide-react';
import { db } from '../firebase';
import AdminShell from './AdminShell';
import {
  Hero, StatCard, SectionBar, Panel, EmptyState, Toast, Spinner,
  FilterPills, GroupHead, VideoThumb, Field,
} from '../shared/DashboardUI';
import { getYouTubeId, getYouTubeThumbnail } from '../shared/youtube';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const MONTH_ORDER = Object.fromEntries(MONTHS.map((m, i) => [m, i]));

const RECORD_TYPES = [
  'Write to Bright - Essays',
  'Write to Bright - Notes, Notices & Graphs',
  'Grammar Hammer',
  'Paper Shaper',
];
// July onwards the classes are organised into these folders instead.
const JULY_RECORD_TYPES = [
  'Revision Tute Class',
  'Essay Class Recordings',
];
const typesForMonth = (m) => (m === 'July' ? JULY_RECORD_TYPES : RECORD_TYPES);

const GRADES = ['All Grades', 'Grade 9', 'Grade 10 & 11'];

const UploadRecordings = () => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [month, setMonth] = useState('');
  const [grade, setGrade] = useState('All Grades');
  const [recordType, setRecordType] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailAuto, setThumbnailAuto] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [recordingsByGroup, setRecordingsByGroup] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [activeMonth, setActiveMonth] = useState('');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchRecordings = async () => {
    const q = query(collection(db, 'recordings'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const grouped = {};
    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      const id = docSnap.id;
      const m = data.month || 'Unknown';
      const typeLabel = (data.type && data.type.trim()) ? data.type : 'General';
      const key = m;
      if (!grouped[key]) grouped[key] = {};
      if (!grouped[key][typeLabel]) grouped[key][typeLabel] = [];
      grouped[key][typeLabel].push({ id, ...data });
    });
    setRecordingsByGroup(grouped);

    // Set the first available month as active tab
    const months = Object.keys(grouped).sort((a, b) => (MONTH_ORDER[a] ?? 99) - (MONTH_ORDER[b] ?? 99));
    if (months.length > 0) setActiveMonth(prev => prev && grouped[prev] ? prev : months[0]);
  };

  useEffect(() => { fetchRecordings(); }, []);

  // The category list differs per month, so drop a selection that no longer applies.
  const handleMonthChange = (m) => {
    setMonth(m);
    if (recordType && !typesForMonth(m).includes(recordType)) setRecordType('');
  };

  const handleLinkChange = (e) => {
    const url = e.target.value;
    setLink(url);
    const auto = getYouTubeThumbnail(url);
    if (auto) {
      setThumbnail(auto);
      setThumbnailAuto(true);
    } else if (thumbnailAuto) {
      setThumbnail(null);
      setThumbnailAuto(false);
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setThumbnail(reader.result); setThumbnailAuto(false); };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !link || !month) {
      showToast('Title, link, and month are required.', 'error');
      return;
    }
    try {
      setUploading(true);
      const payload = { title, link, thumbnail, month, timestamp: Timestamp.now() };
      if (recordType && recordType.trim()) payload.type = recordType.trim();
      if (grade && grade !== 'All Grades') payload.grade = grade;
      await addDoc(collection(db, 'recordings'), payload);
      setTitle(''); setLink(''); setMonth(''); setGrade('All Grades'); setRecordType(''); setThumbnail(null); setThumbnailAuto(false);
      showToast('Recording uploaded.');
      fetchRecordings();
    } catch (error) {
      console.error('Error uploading:', error);
      showToast('Upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recording?')) return;
    try {
      await deleteDoc(doc(db, 'recordings', id));
      showToast('Recording deleted.');
      fetchRecordings();
    } catch (e) {
      console.error(e);
      showToast('Failed to delete.', 'error');
    }
  };

  const saveEdit = async () => {
    if (!editingTitle.trim()) return showToast('Title cannot be empty.', 'error');
    try {
      await updateDoc(doc(db, 'recordings', editingId), { title: editingTitle.trim() });
      setEditingId(null); setEditingTitle('');
      showToast('Title updated.');
      fetchRecordings();
    } catch (err) {
      console.error(err);
      showToast('Failed to update title.', 'error');
    }
  };

  const sortedMonths = Object.keys(recordingsByGroup).sort((a, b) => (MONTH_ORDER[a] ?? 99) - (MONTH_ORDER[b] ?? 99));
  const totalCount = Object.values(recordingsByGroup).reduce((sum, types) =>
    sum + Object.values(types).reduce((s, recs) => s + recs.length, 0), 0);

  const monthOptions = sortedMonths.map(m => ({
    value: m,
    label: m,
    count: Object.values(recordingsByGroup[m] || {}).reduce((s, r) => s + r.length, 0),
  }));

  // Topbar search filters the visible month's list.
  const activeGroups = recordingsByGroup[activeMonth] || {};
  const q = search.trim().toLowerCase();
  const filteredGroups = Object.entries(activeGroups).reduce((acc, [type, recs]) => {
    const matched = q ? recs.filter(r => (r.title || '').toLowerCase().includes(q)) : recs;
    if (matched.length) acc[type] = matched;
    return acc;
  }, {});
  const visibleCount = Object.values(filteredGroups).reduce((s, r) => s + r.length, 0);

  const detectedId = getYouTubeId(link);

  return (
    <AdminShell
      active="/UploadRecordings"
      search={search}
      onSearch={setSearch}
      searchPlaceholder="Search recordings by title…"
      sidebarFooter={{
        title: 'Thumbnails are automatic',
        text: 'Paste a YouTube link and the thumbnail is pulled in for you.',
      }}
    >
      <Toast toast={toast} />

      <Hero
        title="Class Recordings"
        subtitle="Upload class session videos and organise them by month and type."
        icon={Video}
      />

      <div className="spk-stats spk-stats-3">
        <StatCard icon={Film} value={totalCount} label="Total recordings" />
        <StatCard icon={CalendarDays} value={sortedMonths.length} label="Months covered" tone="blue" />
        <StatCard icon={Video} value={visibleCount} label={activeMonth ? `In ${activeMonth}` : 'Showing'} tone="green" />
      </div>

      <SectionBar
        title="Recordings"
        subtitle="Add a recording on the left; manage what's published on the right"
      />

      <div className="spk-split">
        {/* ── Upload form ── */}
        <Panel className="spk-sticky" title="New Recording" subtitle="Add a class recording">
          <form onSubmit={handleSubmit} className="spk-field-stack">
            <Field label="Title">
              <input
                type="text" className="spk-input" value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Grammar Lesson — Week 1" required
              />
            </Field>

            <Field label="YouTube Link">
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA', display: 'flex' }}>
                  <Link2 size={15} strokeWidth={2} />
                </span>
                <input
                  type="url" className="spk-input" value={link}
                  onChange={handleLinkChange}
                  placeholder="https://youtube.com/..." required
                  style={{ paddingLeft: 34 }}
                />
              </div>
            </Field>

            <div className="spk-field-row">
              <Field label="Month">
                <select className="spk-input" value={month} onChange={e => handleMonthChange(e.target.value)} required>
                  <option value="">Select Month</option>
                  {MONTHS.map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Grade">
                <select className="spk-input" value={grade} onChange={e => setGrade(e.target.value)}>
                  {GRADES.map((g, i) => <option key={i} value={g}>{g}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Type" hint="(optional)">
              <select className="spk-input" value={recordType} onChange={e => setRecordType(e.target.value)}>
                <option value="">— None —</option>
                {typesForMonth(month).map((t, i) => <option key={i} value={t}>{t}</option>)}
              </select>
            </Field>

            <Field label="Thumbnail" hint={thumbnailAuto ? '' : '(optional override)'}>
              {thumbnail && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <VideoThumb src={thumbnail} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>
                      {thumbnailAuto ? 'Auto-fetched from YouTube' : 'Custom thumbnail'}
                    </div>
                    {detectedId && thumbnailAuto && (
                      <div style={{ fontSize: 11.5, color: '#A1A1AA', fontWeight: 500, marginTop: 3 }}>
                        Video ID {detectedId}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className={`spk-file ${thumbnailAuto ? 'spk-file-ok' : ''}`}>
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} />
                {thumbnailAuto && (
                  <p className="spk-file-note">Upload a file to override the auto-fetched thumbnail.</p>
                )}
              </div>
            </Field>

            <button type="submit" className="spk-btn spk-btn-solid spk-btn-lg spk-btn-block" disabled={uploading}>
              {uploading ? <><Spinner size={16} /> Uploading…</> : <><Upload size={16} strokeWidth={2.1} /> Upload Recording</>}
            </button>
          </form>
        </Panel>

        {/* ── Published list ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          {monthOptions.length > 0 && (
            <FilterPills options={monthOptions} active={activeMonth} onChange={setActiveMonth} />
          )}

          <Panel>
            {sortedMonths.length === 0 ? (
              <EmptyState
                icon={Video}
                title="No recordings uploaded yet."
                hint="Use the form to publish your first class recording."
              />
            ) : visibleCount === 0 ? (
              <EmptyState
                icon={Search}
                title="No recordings match your search."
                hint="Try a different title or clear the search box up top."
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                {Object.entries(filteredGroups).map(([type, recs]) => (
                  <div key={type}>
                    <GroupHead title={type} count={recs.length} />
                    <div className="spk-list">
                      {recs.map(rec => (
                        <div key={rec.id} className="spk-row">
                          <VideoThumb url={rec.link} src={rec.thumbnail} small />
                          <div className="spk-row-body">
                            {editingId === rec.id ? (
                              <input
                                className="spk-input" value={editingTitle}
                                onChange={e => setEditingTitle(e.target.value)} autoFocus
                              />
                            ) : (
                              <>
                                <div className="spk-row-title spk-truncate">{rec.title}</div>
                                <div className="spk-row-meta">
                                  <a
                                    href={rec.link} target="_blank" rel="noopener noreferrer"
                                    className="spk-truncate" style={{ color: '#A1A1AA' }}
                                  >
                                    <Link2 size={12} strokeWidth={2} />
                                    <span className="spk-truncate">{rec.link}</span>
                                  </a>
                                  {rec.grade && <span className="spk-badge spk-badge-blue">{rec.grade}</span>}
                                </div>
                              </>
                            )}
                          </div>

                          <div className="spk-row-actions">
                            {editingId === rec.id ? (
                              <>
                                <button className="spk-btn spk-btn-success spk-btn-sm" onClick={saveEdit}>
                                  <Check size={14} strokeWidth={2.4} /> Save
                                </button>
                                <button
                                  className="spk-btn spk-btn-ghost spk-btn-sm"
                                  onClick={() => { setEditingId(null); setEditingTitle(''); }}
                                >
                                  <X size={14} strokeWidth={2.4} /> Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="spk-btn spk-btn-soft spk-btn-sm"
                                  onClick={() => { setEditingId(rec.id); setEditingTitle(rec.title || ''); }}
                                >
                                  <Pencil size={14} strokeWidth={2} /> Edit
                                </button>
                                <button
                                  className="spk-icon-btn spk-icon-btn-danger"
                                  onClick={() => handleDelete(rec.id)}
                                  title="Delete"
                                >
                                  <Trash2 size={14} strokeWidth={2} />
                                </button>
                              </>
                            )}
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

export default UploadRecordings;
