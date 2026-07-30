import React, { useState, useEffect } from 'react';
import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import {
  Shield, Video, FileText, Upload, Pencil, Trash2, ExternalLink,
  Search, Film,
} from 'lucide-react';
import { db, storage } from '../firebase';
import AdminShell from './AdminShell';
import {
  Hero, StatCard, SectionBar, Panel, EmptyState, Toast, Spinner,
  FilterPills, VideoThumb, Field,
} from '../shared/DashboardUI';

const TABS = [
  { value: 'recordings', label: 'Recordings' },
  { value: 'materials', label: 'Support Materials' },
];

const SpokenEnglishAdmin = () => {
  const [tab, setTab] = useState('recordings');
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  // Form state
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeURL, setYoutubeURL] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchItems = async () => {
    const snap = await getDocs(query(collection(db, 'spokenContent'), orderBy('timestamp', 'desc')));
    setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setYoutubeURL('');
    setThumbnail(null);
    setPdfFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const data = {
        type: tab === 'recordings' ? 'recording' : 'material',
        title,
        description,
        timestamp: Date.now(),
      };

      if (tab === 'recordings') {
        data.youtubeURL = youtubeURL;
        if (thumbnail) {
          const thumbRef = ref(storage, `spoken/thumbnails/${Date.now()}_${thumbnail.name}`);
          await uploadBytes(thumbRef, thumbnail);
          data.thumbnailURL = await getDownloadURL(thumbRef);
        }
      } else {
        if (pdfFile) {
          const fileRef = ref(storage, `spoken/materials/${Date.now()}_${pdfFile.name}`);
          await uploadBytes(fileRef, pdfFile);
          data.fileURL = await getDownloadURL(fileRef);
          data.fileName = pdfFile.name;
        }
      }

      if (editId) {
        await updateDoc(doc(db, 'spokenContent', editId), data);
      } else {
        await addDoc(collection(db, 'spokenContent'), data);
      }

      showToast(editId ? 'Item updated.' : 'Item uploaded.');
      resetForm();
      fetchItems();
    } catch (err) {
      console.error(err);
      showToast('Save failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setTitle(item.title || '');
    setDescription(item.description || '');
    setYoutubeURL(item.youtubeURL || '');
    setTab(item.type === 'recording' ? 'recordings' : 'materials');
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Delete this item?')) return;
    await deleteDoc(doc(db, 'spokenContent', item.id));
    if (item.thumbnailURL) deleteObject(ref(storage, item.thumbnailURL)).catch(() => {});
    if (item.fileURL) deleteObject(ref(storage, item.fileURL)).catch(() => {});
    showToast('Item deleted.');
    fetchItems();
  };

  const isRecordings = tab === 'recordings';
  const displayed = items.filter(i => i.type === (isRecordings ? 'recording' : 'material'));

  const q = search.trim().toLowerCase();
  const visible = q
    ? displayed.filter(i =>
        (i.title || '').toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q))
    : displayed;

  const recordingCount = items.filter(i => i.type === 'recording').length;
  const materialCount = items.filter(i => i.type === 'material').length;

  const tabOptions = TABS.map(t => ({
    ...t,
    count: t.value === 'recordings' ? recordingCount : materialCount,
  }));

  return (
    <AdminShell
      active="/AdminDashboardGuest"
      search={search}
      onSearch={setSearch}
      searchPlaceholder="Search spoken content…"
      sidebarFooter={{
        title: 'Spoken students',
        text: 'This content is separate from the structured Spoken English dashboard.',
      }}
    >
      <Toast toast={toast} />

      <Hero
        title="Spoken English — Content Manager"
        subtitle="Upload recordings and support materials for spoken students."
        icon={Shield}
      />

      <div className="spk-stats spk-stats-3">
        <StatCard icon={Film} value={recordingCount} label="Recordings" />
        <StatCard icon={FileText} value={materialCount} label="Support materials" tone="blue" />
        <StatCard icon={Search} value={visible.length} label="Currently shown" tone="green" />
      </div>

      <SectionBar
        title={isRecordings ? 'Recordings' : 'Support Materials'}
        subtitle={isRecordings ? 'YouTube sessions for spoken students' : 'PDF guides and handouts'}
      />

      <div className="spk-split">
        {/* ── Form ── */}
        <Panel
          className="spk-sticky"
          title={`${editId ? 'Edit' : 'Add'} ${isRecordings ? 'Recording' : 'Support Material'}`}
          subtitle={editId ? 'Updating an existing item' : 'Create a new item'}
        >
          <form onSubmit={handleSubmit} className="spk-field-stack">
            <Field label="Title">
              <input
                type="text" className="spk-input" required value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={isRecordings ? 'e.g. Pronunciation Drills — Session 1' : 'e.g. Speaking Guide Booklet'}
              />
            </Field>

            <Field label="Description" hint="(optional)">
              <textarea
                rows="2" className="spk-input" value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Optional short description"
              />
            </Field>

            {isRecordings && (
              <>
                <Field label="YouTube URL">
                  <input
                    type="url" className="spk-input" required={!editId} value={youtubeURL}
                    onChange={e => setYoutubeURL(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </Field>

                {youtubeURL && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <VideoThumb url={youtubeURL} />
                    <div style={{ fontSize: 11.5, color: '#A1A1AA', fontWeight: 500, lineHeight: 1.5 }}>
                      Thumbnail is pulled from the link automatically. Upload below only to override it.
                    </div>
                  </div>
                )}

                <Field label="Thumbnail" hint="(optional override)">
                  <div className={`spk-file ${thumbnail ? 'spk-file-ok' : ''}`}>
                    <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files[0])} />
                    {thumbnail && <p className="spk-file-note">✓ {thumbnail.name}</p>}
                  </div>
                </Field>
              </>
            )}

            {!isRecordings && (
              <Field label="PDF File" hint={editId ? '(leave blank to keep existing)' : ''}>
                <div className={`spk-file ${pdfFile ? 'spk-file-ok' : ''}`}>
                  <input
                    type="file" accept="application/pdf" required={!editId}
                    onChange={e => setPdfFile(e.target.files[0])}
                  />
                  {pdfFile && <p className="spk-file-note">✓ {pdfFile.name}</p>}
                </div>
              </Field>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="spk-btn spk-btn-solid spk-btn-lg" style={{ flex: 1 }} disabled={uploading}>
                {uploading
                  ? <><Spinner size={16} /> Uploading…</>
                  : <><Upload size={16} strokeWidth={2.1} /> {editId ? 'Update' : 'Upload'}</>}
              </button>
              {editId && (
                <button type="button" className="spk-btn spk-btn-ghost spk-btn-lg" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </Panel>

        {/* ── Uploaded items ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <FilterPills
            options={tabOptions}
            active={tab}
            onChange={(v) => { setTab(v); resetForm(); }}
          />

          <Panel>
            {displayed.length === 0 ? (
              <EmptyState
                icon={isRecordings ? Video : FileText}
                title="Nothing uploaded yet."
                hint={`Use the form to add your first ${isRecordings ? 'recording' : 'support material'}.`}
              />
            ) : visible.length === 0 ? (
              <EmptyState
                icon={Search}
                title="Nothing matches your search."
                hint="Try a different title or clear the search box up top."
              />
            ) : (
              <div className="spk-list">
                {visible.map(item => (
                  <div key={item.id} className="spk-row">
                    {isRecordings ? (
                      <VideoThumb url={item.youtubeURL} src={item.thumbnailURL} small />
                    ) : (
                      <div className="spk-row-icon">
                        <FileText size={19} strokeWidth={1.9} />
                      </div>
                    )}

                    <div className="spk-row-body">
                      <div className="spk-row-title spk-truncate">{item.title}</div>
                      <div className="spk-row-meta">
                        {item.description
                          ? <span className="spk-truncate">{item.description}</span>
                          : <span>No description</span>}
                        {item.fileName && <span className="spk-truncate">{item.fileName}</span>}
                      </div>
                    </div>

                    <div className="spk-row-actions">
                      {(item.youtubeURL || item.fileURL) && (
                        <a
                          href={item.youtubeURL || item.fileURL}
                          target="_blank" rel="noopener noreferrer"
                          className="spk-btn spk-btn-soft spk-btn-sm"
                        >
                          <ExternalLink size={13} strokeWidth={2.2} />
                          {item.youtubeURL ? 'Watch' : 'View PDF'}
                        </a>
                      )}
                      <button className="spk-icon-btn" onClick={() => handleEdit(item)} title="Edit">
                        <Pencil size={14} strokeWidth={2} />
                      </button>
                      <button
                        className="spk-icon-btn spk-icon-btn-danger"
                        onClick={() => handleDelete(item)}
                        title="Delete"
                      >
                        <Trash2 size={14} strokeWidth={2} />
                      </button>
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

export default SpokenEnglishAdmin;
