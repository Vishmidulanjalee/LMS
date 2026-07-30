import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
  Check, X, RefreshCw, Mail, BadgeCheck, GraduationCap, CalendarDays,
  Eye, Users, Search, ArrowUpDown, CreditCard, Download, Trash2,
} from 'lucide-react';
import { db } from '../firebase';
import AdminShell from './AdminShell';
import {
  Hero, StatCard, SectionBar, Panel, EmptyState, Toast, Modal, DetailRow,
  Spinner, FilterPills, initialsOf,
} from '../shared/DashboardUI';

const GRADES = ['All Grades', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Grade 13', 'A/L', 'Other'];

const PAY_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'paid', label: 'Paid' },
  { value: 'unpaid', label: 'Unpaid' },
];

const ApprovedStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All Grades');
  const [payFilter, setPayFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selected, setSelected] = useState(new Set());
  const [detailStudent, setDetailStudent] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchApproved = async () => {
    setLoading(true);
    setSelected(new Set());
    try {
      const q = query(collection(db, 'users'), where('status', '==', 'approved'));
      const snap = await getDocs(q);
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      showToast('Failed to load students.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApproved(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMarkPaid = async (uid, name) => {
    setActionLoading(uid + '-pay');
    try {
      await updateDoc(doc(db, 'users', uid), { paid: true, paidAt: new Date() });
      setStudents(prev => prev.map(s => s.id === uid ? { ...s, paid: true } : s));
      showToast(`${name} marked as paid. They can now log in.`);
    } catch {
      showToast('Failed to update.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkUnpaid = async (uid, name) => {
    if (!window.confirm(`Mark ${name} as unpaid? They will lose access.`)) return;
    setActionLoading(uid + '-unpay');
    try {
      await updateDoc(doc(db, 'users', uid), { paid: false });
      setStudents(prev => prev.map(s => s.id === uid ? { ...s, paid: false } : s));
      showToast(`${name} marked as unpaid.`, 'error');
    } catch {
      showToast('Failed to update.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Bulk payment toggle. Only touches the students the action would actually
   * change, so marking paid skips those already paid (and vice versa).
   */
  const handleBulkSetPaid = async (makePaid) => {
    const targets = [...selected].filter(uid => {
      const s = students.find(x => x.id === uid);
      return s && s.paid !== makePaid;
    });
    if (!targets.length) {
      showToast(`All selected students are already ${makePaid ? 'paid' : 'unpaid'}.`, 'error');
      return;
    }
    const verb = makePaid ? 'paid' : 'unpaid';
    const warning = makePaid ? '' : ' They will lose access.';
    if (!window.confirm(`Mark ${targets.length} student(s) as ${verb}?${warning}`)) return;

    for (const uid of targets) {
      try {
        await updateDoc(doc(db, 'users', uid), makePaid ? { paid: true, paidAt: new Date() } : { paid: false });
      } catch {}
    }
    setStudents(prev => prev.map(s => targets.includes(s.id) ? { ...s, paid: makePaid } : s));
    showToast(`${targets.length} student(s) marked as ${verb}.`, makePaid ? 'success' : 'error');
    setSelected(new Set());
  };

  /**
   * Removes the student's Firestore record, which revokes their access and
   * frees the Student ID for reuse.
   *
   * NOTE: this does NOT delete their Firebase Auth account, so the email
   * stays claimed and signup will still fail with `auth/email-already-in-use`.
   * Releasing the email needs `admin.auth().deleteUser(uid)` from a Cloud
   * Function — the client SDK can only delete the currently signed-in user.
   */
  const handleDelete = async (uid, name, email) => {
    if (!window.confirm(
      `Permanently delete ${name}?\n\n` +
      `This removes their record and revokes access. Their Student ID becomes free to reuse.\n\n` +
      `Note: ${email} stays registered and cannot be signed up again until the login account is removed too.`
    )) return;
    setActionLoading(uid + '-del');
    try {
      await deleteDoc(doc(db, 'users', uid));
      setStudents(prev => prev.filter(s => s.id !== uid));
      setSelected(prev => {
        const n = new Set(prev);
        n.delete(uid);
        return n;
      });
      showToast(`${name} deleted.`, 'error');
    } catch {
      showToast('Failed to delete.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportCSV = () => {
    const rows = [['Name', 'Email', 'Student ID', 'Grade', 'Payment Status']];
    filtered.forEach(s => rows.push([
      s.name || s.username || '',
      s.email || '',
      s.studentId || '',
      s.grade || '',
      s.paid ? 'Paid' : 'Unpaid',
    ]));
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'approved_students.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSelect = (uid) => setSelected(prev => {
    const n = new Set(prev);
    if (n.has(uid)) n.delete(uid); else n.add(uid);
    return n;
  });

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(s => s.id)));
  };

  const formatDate = (ts) => {
    if (!ts) return '—';
    if (ts instanceof Date) return ts.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
    return new Date(ts.seconds * 1000).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filtered = students
    .filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (s.name || s.username || '').toLowerCase().includes(q) ||
        (s.email || '').toLowerCase().includes(q) ||
        (s.studentId || '').toLowerCase().includes(q);
      const matchGrade = gradeFilter === 'All Grades' || s.grade === gradeFilter;
      const matchPay = payFilter === 'all' || (payFilter === 'paid' ? s.paid : !s.paid);
      return matchSearch && matchGrade && matchPay;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'oldest') return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
      return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
    });

  const paidCount = students.filter(s => s.paid).length;
  const unpaidCount = students.filter(s => !s.paid).length;

  // The bulk action follows the selection: offer "Mark Paid" while any
  // selected student is still unpaid, otherwise offer to undo.
  const selectedUnpaid = [...selected].filter(uid => students.some(s => s.id === uid && !s.paid)).length;
  const bulkMakePaid = selectedUnpaid > 0;
  const bulkCount = bulkMakePaid ? selectedUnpaid : selected.size;

  const gradesPresent = GRADES.filter(
    g => g === 'All Grades' || students.some(s => s.grade === g),
  );

  return (
    <AdminShell
      active="/ApprovedStudents"
      counts={{ '/ApprovedStudents': unpaidCount }}
      search={search}
      onSearch={setSearch}
      searchPlaceholder="Search by name, email or student ID…"
      sidebarFooter={{
        title: 'Payment gates access',
        text: 'An approved student stays blocked until you mark them paid.',
      }}
    >
      <Toast toast={toast} />

      {detailStudent && (
        <Modal title="Student Details" onClose={() => setDetailStudent(null)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div className={`spk-initials spk-initials-lg ${detailStudent.paid ? 'spk-initials-green' : ''}`}>
              {initialsOf(detailStudent.name || detailStudent.username, '?')}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 16, fontWeight: 700 }}>{detailStudent.name || detailStudent.username}</p>
              <span className={`spk-badge ${detailStudent.paid ? 'spk-badge-green' : 'spk-badge-amber'}`} style={{ marginTop: 6 }}>
                {detailStudent.paid ? 'Paid — Active' : 'Unpaid — Blocked'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <DetailRow icon={Mail} label="Email" value={detailStudent.email} />
            <DetailRow icon={BadgeCheck} label="Student ID" value={detailStudent.studentId || '—'} />
            <DetailRow icon={GraduationCap} label="Grade" value={detailStudent.grade || '—'} />
            <DetailRow icon={CalendarDays} label="Registered" value={formatDate(detailStudent.createdAt)} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
            {!detailStudent.paid ? (
              <button
                className="spk-btn spk-btn-success spk-btn-block"
                onClick={() => { handleMarkPaid(detailStudent.id, detailStudent.name); setDetailStudent(null); }}
              >
                <CreditCard size={15} strokeWidth={2.2} /> Mark as Paid
              </button>
            ) : (
              <button
                className="spk-btn spk-btn-danger spk-btn-block"
                onClick={() => { handleMarkUnpaid(detailStudent.id, detailStudent.name); setDetailStudent(null); }}
              >
                <X size={15} strokeWidth={2.4} /> Mark as Unpaid
              </button>
            )}
            <button
              className="spk-btn spk-btn-ghost spk-btn-block"
              onClick={() => {
                const name = detailStudent.name || detailStudent.username;
                setDetailStudent(null);
                handleDelete(detailStudent.id, name, detailStudent.email);
              }}
            >
              <Trash2 size={15} strokeWidth={2.1} /> Delete Student
            </button>
          </div>
        </Modal>
      )}

      <Hero
        title="Approved Students"
        subtitle="Manage payment status and dashboard access for every approved student."
        icon={Users}
      >
        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          {selected.size > 0 && (
            <button className="spk-btn spk-btn-dark" onClick={() => handleBulkSetPaid(bulkMakePaid)}>
              {bulkMakePaid
                ? <><CreditCard size={15} strokeWidth={2.2} /> Mark Paid ({bulkCount})</>
                : <><X size={15} strokeWidth={2.4} /> Mark Unpaid ({bulkCount})</>}
            </button>
          )}
          <button className="spk-btn spk-btn-onaccent" onClick={handleExportCSV}>
            <Download size={15} strokeWidth={2.2} /> Export CSV
          </button>
        </div>
      </Hero>

      <div className="spk-stats spk-stats-3">
        <StatCard icon={Users} value={students.length} label="Total approved" tone="blue" />
        <StatCard icon={Check} value={paidCount} label="Paid / active" tone="green" />
        <StatCard icon={CreditCard} value={unpaidCount} label="Unpaid / blocked" tone={unpaidCount ? 'red' : 'gray'} />
      </div>

      <SectionBar
        title="Students"
        subtitle={`${filtered.length} of ${students.length} shown`}
        right={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ArrowUpDown size={14} strokeWidth={2} />
              <select className="spk-input" style={{ width: 'auto', padding: '8px 10px' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
            <button className="spk-btn spk-btn-ghost spk-btn-sm" onClick={fetchApproved}>
              <RefreshCw size={14} strokeWidth={2.1} /> Refresh
            </button>
          </div>
        }
      />

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <FilterPills options={PAY_FILTERS} active={payFilter} onChange={setPayFilter} />
        {gradesPresent.length > 1 && (
          <FilterPills options={gradesPresent} active={gradeFilter} onChange={setGradeFilter} />
        )}
      </div>

      <Panel>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '60px 0', color: '#71717A', fontSize: 13.5, fontWeight: 600 }}>
            <Spinner size={18} /> Loading students…
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No students match this filter."
            hint="Try a different payment status, grade, or search term."
          />
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
              <label className="spk-check-label">
                <input
                  type="checkbox" className="spk-check"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleSelectAll}
                />
                Select all ({filtered.length})
              </label>
              {selected.size > 0 && (
                <button
                  className={`spk-btn spk-btn-sm ${bulkMakePaid ? 'spk-btn-success' : 'spk-btn-danger'}`}
                  onClick={() => handleBulkSetPaid(bulkMakePaid)}
                >
                  {bulkMakePaid
                    ? <><CreditCard size={14} strokeWidth={2.2} /> Mark Paid ({bulkCount})</>
                    : <><X size={14} strokeWidth={2.4} /> Mark Unpaid ({bulkCount})</>}
                </button>
              )}
            </div>

            <div className="spk-list">
              {filtered.map(student => {
                const name = student.name || student.username || 'Unknown';
                const isSelected = selected.has(student.id);
                return (
                  <div key={student.id} className={`spk-row ${isSelected ? 'spk-row-selected' : ''}`}>
                    <input
                      type="checkbox" className="spk-check"
                      checked={isSelected}
                      onChange={() => toggleSelect(student.id)}
                      aria-label={`Select ${name}`}
                    />
                    <div className={`spk-initials ${student.paid ? 'spk-initials-green' : ''}`}>
                      {initialsOf(name, '?')}
                    </div>

                    <div className="spk-row-body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span className="spk-row-title">{name}</span>
                        <span className={`spk-badge ${student.paid ? 'spk-badge-green' : 'spk-badge-amber'}`}>
                          {student.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                      <div className="spk-row-meta">
                        <span className="spk-truncate"><Mail size={12} strokeWidth={2} />{student.email}</span>
                        {student.studentId && <span><BadgeCheck size={12} strokeWidth={2} />{student.studentId}</span>}
                        {student.grade && <span><GraduationCap size={12} strokeWidth={2} />{student.grade}</span>}
                        <span><CalendarDays size={12} strokeWidth={2} />Registered {formatDate(student.createdAt)}</span>
                      </div>
                    </div>

                    <div className="spk-row-actions">
                      <button className="spk-icon-btn" onClick={() => setDetailStudent(student)} title="View details">
                        <Eye size={14} strokeWidth={2} />
                      </button>
                      {!student.paid ? (
                        <button
                          className="spk-btn spk-btn-success spk-btn-sm"
                          onClick={() => handleMarkPaid(student.id, name)}
                          disabled={actionLoading === student.id + '-pay'}
                        >
                          {actionLoading === student.id + '-pay' ? <Spinner size={14} /> : <CreditCard size={14} strokeWidth={2.2} />}
                          Mark Paid
                        </button>
                      ) : (
                        <button
                          className="spk-btn spk-btn-danger spk-btn-sm"
                          onClick={() => handleMarkUnpaid(student.id, name)}
                          disabled={!!actionLoading}
                        >
                          <X size={14} strokeWidth={2.4} /> Mark Unpaid
                        </button>
                      )}
                      <button
                        className="spk-icon-btn spk-icon-btn-danger"
                        onClick={() => handleDelete(student.id, name, student.email)}
                        disabled={!!actionLoading}
                        title="Delete student"
                      >
                        {actionLoading === student.id + '-del' ? <Spinner size={14} /> : <Trash2 size={14} strokeWidth={2} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Panel>
    </AdminShell>
  );
};

export default ApprovedStudents;
