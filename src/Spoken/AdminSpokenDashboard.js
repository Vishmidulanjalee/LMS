import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Video, PlayCircle, Folder, ClipboardList, PenLine, FileText,
  ChevronLeft, ChevronRight, CalendarDays, Clock, ExternalLink, Inbox,
  Plus, Pencil, Trash2, X, Check, AlarmClock, Search,
  ShieldCheck, Eye, EyeOff,
} from 'lucide-react';
import { UI as SPK } from '../shared/dashboardStyles';
import {
  Hero, StatCard, FilterPills, SectionBar, Panel,
  RailCard, RailItem, EmptyState, VideoThumb, Toast, Spinner,
} from '../shared/DashboardUI';
import AdminShell from '../Admin/AdminShell';
import {
  RECORDING_FOLDERS,
  isAssessmentVisible, isContentVisible, isExpired, formatDate, deadlineLabel, daysUntil, matchesSearch,
  getYouTubeId,
} from './spokenData';
import {
  SPOKEN, watchSpoken, createSpoken, updateSpoken, deleteSpoken,
  uploadSpokenFile, deleteSpokenFile, sortByDate,
} from './spokenApi';

const TAB = { RECORDINGS: 'recordings', ASSESSMENTS: 'assessments', DOCUMENTS: 'documents' };

const SECTIONS = {
  [TAB.RECORDINGS]: {
    label: 'Course Recordings',
    icon: Video,
    subtitle: 'Two folders — manage the sessions inside each',
  },
  [TAB.ASSESSMENTS]: {
    label: 'Grammar Assessments',
    icon: ClipboardList,
    subtitle: 'You see every item; students only see the active ones',
  },
  [TAB.DOCUMENTS]: {
    label: 'Tutes & Documents',
    icon: FileText,
    subtitle: 'Worksheets, reference sheets, and handouts',
  },
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/* ── Inline add/edit form ──────────────────────────────────────────── */

const ItemForm = ({ title, fields, initial, onSave, onCancel, saving }) => {
  const [values, setValues] = useState(() => {
    const base = {};
    fields.forEach((f) => {
      base[f.name] = f.type === 'file' ? null : ((initial && initial[f.name]) ?? '');
    });
    return base;
  });

  const set = (name) => (e) => setValues((prev) => ({ ...prev, [name]: e.target.value }));
  const setFile = (name) => (e) =>
    setValues((prev) => ({ ...prev, [name]: e.target.files[0] || null }));

  // A file field counts as filled when a new file is picked, or when we're
  // editing an item that already has one (no need to re-pick to rename it).
  const filled = (f) => (f.type === 'file'
    ? Boolean(values[f.name] || (initial && initial[f.keeps]))
    : Boolean(String(values[f.name] || '').trim()));
  const missing = fields.some((f) => f.required && !filled(f));

  // Live thumbnail preview: as soon as a YouTube link is pasted, admin sees the
  // exact image students will get. Nothing extra is stored — it's derived.
  const hasVideoField = fields.some((f) => f.name === 'videoUrl');
  const videoUrl = values.videoUrl;
  const videoId = hasVideoField ? getYouTubeId(videoUrl) : null;

  return (
    <div className="spk-form">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: SPK.ink }}>{title}</div>
        <button className="spk-icon-btn" onClick={onCancel} aria-label="Cancel">
          <X size={15} strokeWidth={2.2} />
        </button>
      </div>

      <div className="spk-field-grid">
        {fields.map((f) => (
          <div key={f.name} style={f.type === 'file' ? { gridColumn: '1 / -1' } : undefined}>
            <span className="spk-label">{f.label}{f.required ? '' : ' (optional)'}</span>
            {f.type === 'file' ? (
              <div className={`spk-file ${values[f.name] ? 'spk-file-ok' : ''}`}>
                <input
                  type="file"
                  accept={f.accept || 'application/pdf'}
                  onChange={setFile(f.name)}
                />
                {values[f.name] ? (
                  <p className="spk-file-note">
                    ✓ {values[f.name].name} · {formatFileSize(values[f.name].size)}
                  </p>
                ) : initial && initial[f.keeps] ? (
                  <p style={{ fontSize: 11.5, color: SPK.muted, marginTop: 8, fontWeight: 600 }}>
                    Current file: {initial[f.keeps]} — pick a new one only to replace it.
                  </p>
                ) : null}
              </div>
            ) : f.type === 'select' ? (
              <select className="spk-input" value={values[f.name]} onChange={set(f.name)}>
                <option value="">Select…</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : (
              <input
                className="spk-input"
                type={f.type || 'text'}
                placeholder={f.placeholder || ''}
                value={values[f.name]}
                onChange={set(f.name)}
              />
            )}
            {f.hint && (
              <p style={{ fontSize: 11, color: SPK.subtle, marginTop: 5, lineHeight: 1.5, fontWeight: 500 }}>
                {f.hint}
              </p>
            )}
          </div>
        ))}
      </div>

      {hasVideoField && String(videoUrl || '').trim() && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
          <VideoThumb url={videoUrl} duration={values.duration} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: SPK.ink }}>
              {videoId ? 'Thumbnail detected' : 'Not a YouTube link'}
            </div>
            <div style={{ fontSize: 11.5, color: SPK.subtle, fontWeight: 500, marginTop: 3, lineHeight: 1.5 }}>
              {videoId
                ? `Video ID ${videoId} — students will see this image.`
                : 'Paste a youtube.com or youtu.be link to pull the thumbnail automatically.'}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button
          className="spk-btn spk-btn-solid"
          disabled={missing || saving}
          onClick={() => onSave(values)}
        >
          {saving ? <Spinner size={15} /> : <Check size={15} strokeWidth={2.4} />}
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button className="spk-btn spk-btn-ghost" onClick={onCancel} disabled={saving}>Cancel</button>
      </div>
    </div>
  );
};

const RowControls = ({ visible, onToggleVisible, onEdit, onDelete }) => (
  <>
    {onToggleVisible && (
      <button
        className="spk-icon-btn"
        onClick={onToggleVisible}
        aria-label={visible ? 'Hide from students' : 'Show to students'}
        title={visible ? 'Hide from students' : 'Show to students'}
      >
        {visible ? <Eye size={14} strokeWidth={2} /> : <EyeOff size={14} strokeWidth={2} />}
      </button>
    )}
    <button className="spk-icon-btn" onClick={onEdit} aria-label="Edit">
      <Pencil size={14} strokeWidth={2} />
    </button>
    <button className="spk-icon-btn spk-icon-btn-danger" onClick={onDelete} aria-label="Delete">
      <Trash2 size={14} strokeWidth={2} />
    </button>
  </>
);

const AddButton = ({ label, onClick }) => (
  <button className="spk-btn spk-btn-solid spk-btn-sm" onClick={onClick}>
    <Plus size={15} strokeWidth={2.4} />
    {label}
  </button>
);

/* ── Course Recordings ─────────────────────────────────────────────── */

const RECORDING_FIELDS = [
  { name: 'title', label: 'Title', required: true, placeholder: 'e.g. Tenses — Present Simple' },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'duration', label: 'Duration', placeholder: 'e.g. 48 min' },
  {
    name: 'folder', label: 'Folder', type: 'select', required: true,
    options: RECORDING_FOLDERS.map((f) => ({ value: f.id, label: f.name })),
  },
  {
    name: 'videoUrl', label: 'YouTube link', required: true,
    placeholder: 'https://www.youtube.com/watch?v=…',
    hint: 'The thumbnail is pulled from this link automatically.',
  },
];

const AdminRecordingsTab = ({ recordings, loading, search, openFolder, onOpenFolder, onSave, onDelete, onToggleVisible }) => {
  const [editing, setEditing] = useState(null); // { mode: 'add' | 'edit', item }
  const [saving, setSaving] = useState(false);

  const save = async (values) => {
    setSaving(true);
    const ok = await onSave(editing, values);
    setSaving(false);
    if (ok) setEditing(null);
  };

  const visible = recordings.filter((r) => matchesSearch(r, search, ['title']));

  if (!openFolder) {
    return (
      <>
        {editing ? (
          <Panel>
            <ItemForm
              title="Add Recording"
              fields={RECORDING_FIELDS}
              onSave={save}
              onCancel={() => setEditing(null)}
              saving={saving}
            />
          </Panel>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <AddButton label="Add Recording" onClick={() => setEditing({ mode: 'add' })} />
          </div>
        )}

        {/* Folder cards stand alone — no wrapping panel, so the two folders
            read as two separate boxes. */}
        <div className="spk-folders">
          {RECORDING_FOLDERS.map((folder) => {
            const items = recordings.filter((r) => r.folder === folder.id);
            return (
              <button key={folder.id} className="spk-folder" onClick={() => onOpenFolder(folder.id)}>
                <div className="spk-folder-cap" />
                <div className="spk-folder-body">
                  <div className="spk-folder-icon">
                    <Folder size={22} strokeWidth={1.9} />
                  </div>
                  <div className="spk-folder-name">{folder.name}</div>
                  <div className="spk-folder-desc">{folder.description}</div>
                  <div className="spk-folder-foot">
                    <span className="spk-count">
                      {items.length} {items.length === 1 ? 'video' : 'videos'}
                    </span>
                    <span className="spk-link">
                      Manage
                      <ChevronRight size={13} strokeWidth={2.4} />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  const items = visible.filter((r) => r.folder === openFolder.id);

  return (
    <Panel
      right={
        <AddButton
          label="Add Recording"
          onClick={() => setEditing({ mode: 'add', item: { folder: openFolder.id } })}
        />
      }
    >
      {editing && (
        <ItemForm
          title={editing.mode === 'add' ? 'Add Recording' : 'Edit Recording'}
          fields={RECORDING_FIELDS}
          initial={editing.mode === 'add' ? { folder: openFolder.id } : editing.item}
          onSave={save}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      )}

      {loading ? (
        <EmptyState icon={Video} title="Loading recordings…" hint="Fetching the latest from the database." />
      ) : items.length === 0 ? (
        <EmptyState
          icon={search ? Search : Video}
          title={search ? 'No recordings match your search.' : 'No recordings in this folder yet.'}
          hint={search ? 'Try a different title or clear the search box.' : 'Use “Add Recording” to publish the first session.'}
        />
      ) : (
        <div className="spk-list">
          {items.map((rec) => {
            const visible = isContentVisible(rec);
            return (
              <div key={rec.id} className={`spk-row ${visible ? '' : 'spk-row-dim'}`}>
                <VideoThumb url={rec.videoUrl} duration={rec.duration} />
                <div className="spk-row-body">
                  <div className="spk-row-title">{rec.title}</div>
                  <div className="spk-row-meta">
                    <span className={`spk-badge ${visible ? 'spk-badge-green' : 'spk-badge-gray'}`}>
                      {visible ? 'Visible' : 'Hidden'}
                    </span>
                    <span><CalendarDays size={12} strokeWidth={2} />{formatDate(rec.date)}</span>
                    {rec.duration && <span><Clock size={12} strokeWidth={2} />{rec.duration}</span>}
                  </div>
                </div>
                <div className="spk-row-actions">
                  <a href={rec.videoUrl} target="_blank" rel="noopener noreferrer" className="spk-btn spk-btn-soft spk-btn-sm">
                    <PlayCircle size={14} strokeWidth={2} />
                    Watch
                  </a>
                  <RowControls
                    visible={visible}
                    onToggleVisible={() => onToggleVisible(rec)}
                    onEdit={() => setEditing({ mode: 'edit', item: rec })}
                    onDelete={() => onDelete(rec)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
};

/* ── Grammar Assessments ───────────────────────────────────────────── */

const ASSESSMENT_FIELDS = [
  { name: 'title', label: 'Title', required: true, placeholder: 'e.g. Grammar Quiz 01 — Tenses' },
  {
    name: 'type', label: 'Type', type: 'select', required: true,
    options: [
      { value: 'quiz', label: 'Google Form Quiz' },
      { value: 'assignment', label: 'Assignment' },
    ],
  },
  { name: 'link', label: 'Link', required: true, placeholder: 'https://forms.gle/…' },
  {
    name: 'expiresAt', label: 'Expiry date', type: 'date',
    hint: 'Leave blank for no expiry. After this date students can no longer see or open it.',
  },
];

const AdminAssessmentsTab = ({ assessments, loading, search, onSave, onDelete, onToggleVisible }) => {
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const save = async (values) => {
    setSaving(true);
    const ok = await onSave(editing, { ...values, expiresAt: values.expiresAt || null });
    setSaving(false);
    if (ok) setEditing(null);
  };

  const visible = assessments.filter((a) => matchesSearch(a, search, ['title']));
  const expiredCount = assessments.filter((a) => !isAssessmentVisible(a)).length;

  return (
    <Panel right={<AddButton label="Add Quiz / Assignment" onClick={() => setEditing({ mode: 'add' })} />}>
      {expiredCount > 0 && (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16,
            padding: '11px 14px', borderRadius: 12,
            background: SPK.canvas, border: `1px solid ${SPK.border}`,
          }}
        >
          <AlarmClock size={15} strokeWidth={2} color={SPK.muted} />
          <span style={{ fontSize: 12.5, color: SPK.muted, fontWeight: 500 }}>
            {expiredCount} expired {expiredCount === 1 ? 'item is' : 'items are'} hidden from students but still
            listed here for you to edit or delete.
          </span>
        </div>
      )}

      {editing && (
        <ItemForm
          title={editing.mode === 'add' ? 'Add Quiz / Assignment' : 'Edit Quiz / Assignment'}
          fields={ASSESSMENT_FIELDS}
          initial={editing.item}
          onSave={save}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      )}

      {loading ? (
        <EmptyState icon={ClipboardList} title="Loading assessments…" hint="Fetching the latest from the database." />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={search ? Search : ClipboardList}
          title={search ? 'Nothing matches your search.' : 'No assessments added yet.'}
          hint={
            search
              ? 'Try a different title or clear the search box.'
              : 'Add a Google Form quiz or an assignment, and set an expiry date to close it automatically.'
          }
        />
      ) : (
        <div className="spk-list">
          {visible.map((item) => {
            const isQuiz = item.type === 'quiz';
            const hidden = item.visible === false;
            const expired = isExpired(item);
            const active = !hidden && !expired;
            const statusLabel = hidden ? 'Hidden' : expired ? 'Expired' : 'Active';
            return (
              <div key={item.id} className={`spk-row ${active ? '' : 'spk-row-dim'}`}>
                <div className="spk-row-icon">
                  {isQuiz ? <ClipboardList size={20} strokeWidth={1.9} /> : <PenLine size={20} strokeWidth={1.9} />}
                </div>
                <div className="spk-row-body">
                  <div className="spk-row-title">{item.title}</div>
                  <div className="spk-row-meta">
                    <span className={`spk-badge ${active ? 'spk-badge-green' : 'spk-badge-gray'}`}>
                      {statusLabel}
                    </span>
                    <span className={`spk-badge ${isQuiz ? 'spk-badge-amber' : 'spk-badge-blue'}`}>
                      {isQuiz ? 'Quiz' : 'Assignment'}
                    </span>
                    <span>
                      <AlarmClock size={12} strokeWidth={2} />
                      {item.expiresAt ? `${formatDate(item.expiresAt)} · ${deadlineLabel(item.expiresAt)}` : 'No expiry'}
                    </span>
                  </div>
                </div>
                <div className="spk-row-actions">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="spk-btn spk-btn-ghost spk-btn-sm">
                    <ExternalLink size={14} strokeWidth={2.2} />
                    Open
                  </a>
                  <RowControls
                    visible={!hidden}
                    onToggleVisible={() => onToggleVisible(item)}
                    onEdit={() => setEditing({ mode: 'edit', item })}
                    onDelete={() => onDelete(item)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
};

/* ── Tutes & Other Documents ───────────────────────────────────────── */

const DOCUMENT_FIELDS = [
  { name: 'title', label: 'Title', required: true, placeholder: 'e.g. Spoken English Tute 01' },
  { name: 'uploadedAt', label: 'Date', type: 'date' },
  {
    name: 'file', label: 'PDF file', type: 'file', accept: 'application/pdf',
    required: true, keeps: 'fileName',
    hint: 'The file name is taken from the PDF itself. Uploads go to Firebase Storage.',
  },
];

const AdminDocumentsTab = ({ documents, loading, search, onSave, onDelete, onToggleVisible }) => {
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const save = async (values) => {
    setSaving(true);
    const ok = await onSave(editing, values);
    setSaving(false);
    if (ok) setEditing(null);
  };

  const visible = documents.filter((d) => matchesSearch(d, search, ['title', 'fileName']));

  return (
    <Panel right={<AddButton label="Add Document" onClick={() => setEditing({ mode: 'add' })} />}>
      {editing && (
        <ItemForm
          title={editing.mode === 'add' ? 'Add Document' : 'Edit Document'}
          fields={DOCUMENT_FIELDS}
          initial={editing.item}
          onSave={save}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      )}

      {loading ? (
        <EmptyState icon={FileText} title="Loading documents…" hint="Fetching the latest from the database." />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={search ? Search : Inbox}
          title={search ? 'No documents match your search.' : 'No documents added yet.'}
          hint={
            search
              ? 'Try a different title or clear the search box.'
              : 'Upload tutes, worksheets, or reference sheets for your Spoken students.'
          }
        />
      ) : (
        <div className="spk-list">
          {visible.map((docItem) => {
            const docVisible = isContentVisible(docItem);
            return (
              <div key={docItem.id} className={`spk-row ${docVisible ? '' : 'spk-row-dim'}`}>
                <div className="spk-row-icon">
                  <FileText size={20} strokeWidth={1.9} />
                </div>
                <div className="spk-row-body">
                  <div className="spk-row-title">{docItem.title}</div>
                  <div className="spk-row-meta">
                    <span className={`spk-badge ${docVisible ? 'spk-badge-green' : 'spk-badge-gray'}`}>
                      {docVisible ? 'Visible' : 'Hidden'}
                    </span>
                    <span>{docItem.fileName}</span>
                    <span><CalendarDays size={12} strokeWidth={2} />{formatDate(docItem.uploadedAt)}</span>
                  </div>
                </div>
                <div className="spk-row-actions">
                  <a href={docItem.fileUrl} target="_blank" rel="noopener noreferrer" className="spk-btn spk-btn-soft spk-btn-sm">
                    <ExternalLink size={14} strokeWidth={2.2} />
                    View
                  </a>
                  <RowControls
                    visible={docVisible}
                    onToggleVisible={() => onToggleVisible(docItem)}
                    onEdit={() => setEditing({ mode: 'edit', item: docItem })}
                    onDelete={() => onDelete(docItem)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
};

/* ── Page ──────────────────────────────────────────────────────────── */

const AdminSpokenDashboard = () => {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const [recordings, setRecordings] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState({ recordings: true, assessments: true, documents: true });

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Live subscriptions — an edit here reaches a student's open dashboard
  // without either side reloading.
  useEffect(() => {
    const done = (key) => setLoading((prev) => ({ ...prev, [key]: false }));
    const subs = [
      watchSpoken(SPOKEN.recordings, (items) => { setRecordings(sortByDate(items, 'date')); done('recordings'); }, () => done('recordings')),
      watchSpoken(SPOKEN.assessments, (items) => { setAssessments(sortByDate(items, 'expiresAt')); done('assessments'); }, () => done('assessments')),
      watchSpoken(SPOKEN.documents, (items) => { setDocuments(sortByDate(items, 'uploadedAt')); done('documents'); }, () => done('documents')),
    ];
    return () => subs.forEach((unsub) => unsub());
  }, []);

  /**
   * Shared add/edit for every section. Returns true when the write lands, so
   * the form only closes on success and edits aren't silently lost.
   */
  const saveItem = useCallback(async (collectionName, editing, values) => {
    try {
      if (editing.mode === 'add') {
        await createSpoken(collectionName, { ...values, visible: true });
        showToast('Saved. Students can see it now.');
      } else {
        await updateSpoken(collectionName, editing.item.id, values);
        showToast('Changes saved.');
      }
      return true;
    } catch (err) {
      console.error(err);
      showToast('Could not save. Check your connection and try again.', 'error');
      return false;
    }
  }, [showToast]);

  const deleteItem = useCallback(async (collectionName, item, label) => {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    try {
      await deleteSpoken(collectionName, item.id);
      if (item.storagePath) await deleteSpokenFile(item.storagePath);
      showToast(`${label} deleted.`, 'error');
    } catch (err) {
      console.error(err);
      showToast('Could not delete. Try again.', 'error');
    }
  }, [showToast]);

  const toggleVisible = useCallback(async (collectionName, item) => {
    const next = item.visible === false;
    try {
      await updateSpoken(collectionName, item.id, { visible: next });
      showToast(next ? 'Now visible to students.' : 'Hidden from students.', next ? 'success' : 'error');
    } catch (err) {
      console.error(err);
      showToast('Could not update visibility.', 'error');
    }
  }, [showToast]);

  /** Documents upload the picked PDF first, then save the returned URL. */
  const saveDocument = useCallback(async (editing, { file, ...rest }) => {
    try {
      const uploaded = file ? await uploadSpokenFile(file) : null;
      if (editing.mode === 'add') {
        await createSpoken(SPOKEN.documents, { ...rest, ...uploaded, visible: true });
      } else {
        await updateSpoken(SPOKEN.documents, editing.item.id, { ...rest, ...(uploaded || {}) });
        // Only drop the previous upload once its replacement is safely saved.
        if (uploaded && editing.item.storagePath) await deleteSpokenFile(editing.item.storagePath);
      }
      showToast('Document saved.');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Upload failed. Check the file and try again.', 'error');
      return false;
    }
  }, [showToast]);

  // Navigation state lives in the URL so the sidebar, mobile tabs, breadcrumb
  // and the browser back button all agree.
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

  const activeCount = assessments.filter((a) => isAssessmentVisible(a)).length;
  const expiredCount = assessments.length - activeCount;

  // The sidebar belongs to the admin section, so the three Spoken sections
  // switch via pills that stay visible at every width.
  const sectionPills = Object.entries(SECTIONS).map(([id, s]) => ({
    value: id,
    label: s.label,
    count:
      id === TAB.RECORDINGS ? recordings.length
        : id === TAB.ASSESSMENTS ? assessments.length
          : documents.length,
  }));

  const expiringSoon = useMemo(
    () =>
      assessments
        .filter((a) => a.expiresAt && isAssessmentVisible(a))
        .sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt))
        .slice(0, 3),
    [assessments],
  );

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const section = SECTIONS[activeTab];
  const inFolder = activeTab === TAB.RECORDINGS && openFolder;

  return (
    <AdminShell
      active="/AdminSpokenDashboard"
      search={search}
      onSearch={setSearch}
      searchPlaceholder="Search all content…"
      sidebarFooter={{
        title: 'Live content',
        text: 'Everything here saves to the database — students see changes straight away.',
      }}
    >
      <Toast toast={toast} />

      <Hero
        eyebrow={today}
        title="Spoken English — Content Manager"
        subtitle="Publish recordings, set quiz expiry dates, and manage documents for the Spoken programme."
        icon={ShieldCheck}
      />

      <div className="spk-stats">
        <StatCard icon={Video} value={recordings.length} label="Total recordings" />
        <StatCard icon={ClipboardList} value={activeCount} label="Active — students see" tone="green" />
        <StatCard icon={AlarmClock} value={expiredCount} label="Expired — hidden" tone="gray" />
        <StatCard icon={FileText} value={documents.length} label="Documents" tone="blue" />
      </div>

      {/* Section switcher — the sidebar navigates the admin area, so these
          pills stay visible at every width to move between the 3 sections. */}
      <FilterPills options={sectionPills} active={activeTab} onChange={goToTab} />

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
          {activeTab === TAB.RECORDINGS && (
            <AdminRecordingsTab
              recordings={recordings}
              loading={loading.recordings}
              search={search}
              openFolder={openFolder}
              onOpenFolder={openFolderById}
              onSave={(editing, values) => saveItem(SPOKEN.recordings, editing, values)}
              onDelete={(item) => deleteItem(SPOKEN.recordings, item, 'Recording')}
              onToggleVisible={(item) => toggleVisible(SPOKEN.recordings, item)}
            />
          )}
          {activeTab === TAB.ASSESSMENTS && (
            <AdminAssessmentsTab
              assessments={assessments}
              loading={loading.assessments}
              search={search}
              onSave={(editing, values) => saveItem(SPOKEN.assessments, editing, values)}
              onDelete={(item) => deleteItem(SPOKEN.assessments, item, 'Assessment')}
              onToggleVisible={(item) => toggleVisible(SPOKEN.assessments, item)}
            />
          )}
          {activeTab === TAB.DOCUMENTS && (
            <AdminDocumentsTab
              documents={documents}
              loading={loading.documents}
              search={search}
              onSave={saveDocument}
              onDelete={(item) => deleteItem(SPOKEN.documents, item, 'Document')}
              onToggleVisible={(item) => toggleVisible(SPOKEN.documents, item)}
            />
          )}
        </div>

        <div className="spk-rail">
          <RailCard title="Closing soon">
            {expiringSoon.length === 0 ? (
              <RailItem icon={Check} tone="green" title="Nothing closing" sub="No active items have an expiry date." />
            ) : (
              expiringSoon.map((item) => (
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

          <RailCard title="Folder breakdown">
            {RECORDING_FOLDERS.map((folder) => {
              const count = recordings.filter((r) => r.folder === folder.id).length;
              return (
                <RailItem
                  key={folder.id}
                  icon={Folder}
                  title={folder.name}
                  sub={`${count} ${count === 1 ? 'recording' : 'recordings'}`}
                />
              );
            })}
          </RailCard>

          <RailCard title="Student visibility">
            <RailItem
              icon={ClipboardList}
              tone="green"
              title={`${activeCount} visible to students`}
              sub="Expiry date is in the future, or not set."
            />
            <RailItem
              icon={AlarmClock}
              tone="gray"
              title={`${expiredCount} hidden`}
              sub="Filtered out server-side, so direct links won't work either."
            />
          </RailCard>
        </div>
      </div>
    </AdminShell>
  );
};

export default AdminSpokenDashboard;
