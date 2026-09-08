import React, { useEffect, useRef, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {
  Plus, Pencil, Trash2, X, Check, Search, QrCode, Download, Copy, Inbox,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { db } from '../firebase';
import { UI as SPK } from '../shared/dashboardStyles';
import { Panel, EmptyState, Spinner, Modal, Field } from '../shared/DashboardUI';
import { getProgramType } from '../utils/studentProgram';
import { formatDate, matchesSearch } from './spokenData';
import {
  watchCertificates, createCertificate, updateCertificate, deleteCertificate,
  uploadCertificatePhoto, deleteCertificatePhoto,
} from './certificateApi';

const todayISO = () => new Date().toISOString().slice(0, 10);
const verifyLink = (certId) => `${window.location.origin}/verify/${certId}`;

/* ── Issue / edit form ─────────────────────────────────────────────── */

const CertificateForm = ({ students, initial, onSave, onCancel, saving }) => {
  const [studentId, setStudentId] = useState(initial?.studentId || '');
  const [result, setResult] = useState(initial?.result || '');
  const [completionDate, setCompletionDate] = useState(initial?.completionDate || todayISO());
  const [photo, setPhoto] = useState(null);

  const isEdit = Boolean(initial);
  const missing = (!isEdit && !studentId) || !result.trim() || !completionDate;

  const submit = () => {
    const picked = students.find((s) => s.studentId === studentId);
    onSave({
      studentId: isEdit ? initial.studentId : studentId,
      studentName: isEdit ? initial.studentName : (picked ? (picked.name || picked.username) : ''),
      result: result.trim(),
      completionDate,
      photo,
    });
  };

  return (
    <div className="spk-form">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: SPK.ink }}>
          {isEdit ? 'Edit Certificate' : 'Issue Certificate'}
        </div>
        <button className="spk-icon-btn" onClick={onCancel} aria-label="Cancel">
          <X size={15} strokeWidth={2.2} />
        </button>
      </div>

      <div className="spk-field-grid">
        <Field label="Student" hint={isEdit ? '' : '(required)'}>
          {isEdit ? (
            <input className="spk-input" value={`${initial.studentName} — ${initial.studentId}`} disabled />
          ) : (
            <select className="spk-input" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
              <option value="">Select a student…</option>
              {students.map((s) => (
                <option key={s.id} value={s.studentId}>
                  {(s.name || s.username || 'Unknown')} — {s.studentId}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label="Result" hint="(required)">
          <input
            className="spk-input"
            placeholder="e.g. Pass, Grade A, 92%"
            value={result}
            onChange={(e) => setResult(e.target.value)}
          />
        </Field>

        <Field label="Completion date" hint="(required)">
          <input
            className="spk-input"
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
          />
        </Field>

        <div style={{ gridColumn: '1 / -1' }}>
          <span className="spk-label">Student photo (optional)</span>
          <div className={`spk-file ${photo ? 'spk-file-ok' : ''}`}>
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0] || null)} />
            {photo ? (
              <p className="spk-file-note">✓ {photo.name}</p>
            ) : initial?.photoUrl ? (
              <p style={{ fontSize: 11.5, color: SPK.muted, marginTop: 8, fontWeight: 600 }}>
                Current photo is set — pick a new one only to replace it.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button className="spk-btn spk-btn-solid" disabled={missing || saving} onClick={submit}>
          {saving ? <Spinner size={15} /> : <Check size={15} strokeWidth={2.4} />}
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button className="spk-btn spk-btn-ghost" onClick={onCancel} disabled={saving}>Cancel</button>
      </div>
    </div>
  );
};

/* ── QR modal ───────────────────────────────────────────────────────── */

const QrModal = ({ cert, onClose }) => {
  const qrRef = useRef(null);
  const link = verifyLink(cert.id);

  const download = () => {
    const canvas = qrRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `certificate-${cert.studentId || cert.id}.png`;
    a.click();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  return (
    <Modal title="Verification QR Code" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '4px 0 8px' }}>
        <div style={{ padding: 16, background: '#fff', borderRadius: 14, border: `1px solid ${SPK.border}` }}>
          <QRCodeCanvas ref={qrRef} value={link} size={200} level="M" includeMargin />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: SPK.ink }}>{cert.studentName}</div>
          <div style={{ fontSize: 11.5, color: SPK.subtle, marginTop: 3, wordBreak: 'break-all' }}>{link}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="spk-btn spk-btn-solid spk-btn-sm" onClick={download}>
            <Download size={14} strokeWidth={2.2} /> Download PNG
          </button>
          <button className="spk-btn spk-btn-ghost spk-btn-sm" onClick={copyLink}>
            <Copy size={14} strokeWidth={2.2} /> Copy link
          </button>
        </div>
      </div>
    </Modal>
  );
};

/* ── Tab ────────────────────────────────────────────────────────────── */

const AdminCertificatesTab = ({ search, showToast }) => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null); // null | { mode: 'add' | 'edit', item? }
  const [saving, setSaving] = useState(false);
  const [qrCert, setQrCert] = useState(null);

  useEffect(() => {
    const unsub = watchCertificates(
      (items) => {
        setCerts([...items].sort((a, b) => (b.issuedAt?.seconds ?? 0) - (a.issuedAt?.seconds ?? 0)));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, []);

  // Approved Spoken students, fetched once — used to populate the picker
  // so the admin never hand-types a name or Student ID.
  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, 'users'), where('status', '==', 'approved'));
        const snap = await getDocs(q);
        const approved = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setStudents(approved.filter((s) => getProgramType(s) === 'spoken'));
      } catch (err) {
        console.error('Failed to load students:', err);
      }
    })();
  }, []);

  const save = async (values) => {
    const { photo, ...rest } = values;
    setSaving(true);
    try {
      if (editing.mode === 'add') {
        const docRef = await createCertificate(rest);
        if (photo) {
          const uploaded = await uploadCertificatePhoto(photo, docRef.id);
          await updateCertificate(docRef.id, uploaded);
        }
        showToast('Certificate issued.');
      } else {
        const item = editing.item;
        const patch = { ...rest };
        if (photo) {
          const uploaded = await uploadCertificatePhoto(photo, item.id);
          patch.photoUrl = uploaded.photoUrl;
          patch.photoStoragePath = uploaded.photoStoragePath;
        }
        await updateCertificate(item.id, patch);
        if (photo && item.photoStoragePath) await deleteCertificatePhoto(item.photoStoragePath);
        showToast('Certificate updated.');
      }
      setEditing(null);
    } catch (err) {
      console.error(err);
      showToast('Could not save the certificate. Check your connection and try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete the certificate for "${item.studentName}"? This cannot be undone.`)) return;
    try {
      await deleteCertificate(item.id);
      if (item.photoStoragePath) await deleteCertificatePhoto(item.photoStoragePath);
      showToast('Certificate deleted.', 'error');
    } catch (err) {
      console.error(err);
      showToast('Could not delete. Try again.', 'error');
    }
  };

  const visible = certs.filter((c) => matchesSearch(c, search, ['studentName', 'studentId', 'result']));

  return (
    <Panel
      right={
        <button className="spk-btn spk-btn-solid spk-btn-sm" onClick={() => setEditing({ mode: 'add' })}>
          <Plus size={15} strokeWidth={2.4} />
          Issue Certificate
        </button>
      }
    >
      {editing && (
        <CertificateForm
          students={students}
          initial={editing.mode === 'edit' ? editing.item : null}
          onSave={save}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      )}

      {qrCert && <QrModal cert={qrCert} onClose={() => setQrCert(null)} />}

      {loading ? (
        <EmptyState icon={QrCode} title="Loading certificates…" hint="Fetching the latest from the database." />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={search ? Search : Inbox}
          title={search ? 'No certificates match your search.' : 'No certificates issued yet.'}
          hint={
            search
              ? 'Try a different name, Student ID, or result.'
              : 'Use "Issue Certificate" once a student has completed the programme.'
          }
        />
      ) : (
        <div className="spk-list">
          {visible.map((cert) => (
            <div key={cert.id} className="spk-row">
              {cert.photoUrl ? (
                <img
                  src={cert.photoUrl}
                  alt=""
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
              ) : (
                <div className="spk-initials">
                  {String(cert.studentName || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                </div>
              )}
              <div className="spk-row-body">
                <div className="spk-row-title">{cert.studentName}</div>
                <div className="spk-row-meta">
                  <span className="spk-badge spk-badge-green">{cert.result}</span>
                  <span>{cert.studentId}</span>
                  <span>Completed {formatDate(cert.completionDate)}</span>
                </div>
              </div>
              <div className="spk-row-actions">
                <button className="spk-btn spk-btn-soft spk-btn-sm" onClick={() => setQrCert(cert)}>
                  <QrCode size={14} strokeWidth={2} />
                  QR
                </button>
                <button className="spk-icon-btn" onClick={() => setEditing({ mode: 'edit', item: cert })} aria-label="Edit">
                  <Pencil size={14} strokeWidth={2} />
                </button>
                <button className="spk-icon-btn spk-icon-btn-danger" onClick={() => remove(cert)} aria-label="Delete">
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
};

export default AdminCertificatesTab;
