import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import {
  Check, X, RefreshCw, Mail, BadgeCheck, GraduationCap, CalendarDays,
  Eye, UserCheck, Search, ArrowUpDown, Users,
} from 'lucide-react';
import { db } from '../firebase';
import AdminShell from './AdminShell';
import {
  Hero, StatCard, SectionBar, Panel, EmptyState, Toast, Modal, DetailRow,
  Spinner, FilterPills, initialsOf,
} from '../shared/DashboardUI';

const GRADES = ['All Grades', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Grade 13', 'A/L', 'Other'];

const StudentApprovals = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All Grades');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'name'
  const [selected, setSelected] = useState(new Set());
  const [detailStudent, setDetailStudent] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPending = async () => {
    setLoading(true);
    setSelected(new Set());
    try {
      const q = query(collection(db, 'users'), where('status', '==', 'pending'));
      const snap = await getDocs(q);
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      showToast('Failed to load students.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = async (uid, name) => {
    setActionLoading(uid);
    try {
      await updateDoc(doc(db, 'users', uid), { status: 'approved' });
      setStudents(prev => prev.filter(s => s.id !== uid));
      setSelected(prev => { const n = new Set(prev); n.delete(uid); return n; });
      showToast(`${name} approved successfully.`);
    } catch {
      showToast('Failed to approve.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (uid, name) => {
    if (!window.confirm(`Reject ${name}'s application?`)) return;
    setActionLoading(uid + '-rej');
    try {
      await updateDoc(doc(db, 'users', uid), { status: 'rejected' });
      setStudents(prev => prev.filter(s => s.id !== uid));
      setSelected(prev => { const n = new Set(prev); n.delete(uid); return n; });
      showToast(`${name} rejected.`, 'error');
    } catch {
      showToast('Failed to reject.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkApprove = async () => {
    if (!window.confirm(`Approve ${selected.size} selected student(s)?`)) return;
    for (const uid of selected) {
      try {
        await updateDoc(doc(db, 'users', uid), { status: 'approved' });
      } catch {}
    }
    setStudents(prev => prev.filter(s => !selected.has(s.id)));
    showToast(`${selected.size} student(s) approved.`);
    setSelected(new Set());
  };

  const toggleSelect = (uid) => {
    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(uid)) n.delete(uid); else n.add(uid);
      return n;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(s => s.id)));
  };

  const formatDate = (ts) => !ts ? '—' : new Date(ts.seconds * 1000).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });

  // Filter + search + sort
  const filtered = students
    .filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (s.name || s.username || '').toLowerCase().includes(q) ||
        (s.email || '').toLowerCase().includes(q) ||
        (s.studentId || '').toLowerCase().includes(q);
      const matchGrade = gradeFilter === 'All Grades' || s.grade === gradeFilter;
      return matchSearch && matchGrade;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'oldest') return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
      return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
    });

  const gradesPresent = GRADES.filter(
    g => g === 'All Grades' || students.some(s => s.grade === g),
  );

  return (
    <AdminShell
      active="/StudentApprovals"
      counts={{ '/StudentApprovals': students.length }}
      search={search}
      onSearch={setSearch}
      searchPlaceholder="Search by name, email or student ID…"
      sidebarFooter={{
        title: 'Approving a student',
        text: 'They still need payment confirmed before they can log in.',
      }}
    >
      <Toast toast={toast} />

      {detailStudent && (
        <Modal title="Student Details" onClose={() => setDetailStudent(null)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div className="spk-initials spk-initials-lg">
              {initialsOf(detailStudent.name || detailStudent.username, '?')}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 16, fontWeight: 700 }}>{detailStudent.name || detailStudent.username}</p>
              <span className="spk-badge spk-badge-amber" style={{ marginTop: 6 }}>Pending Review</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <DetailRow icon={Mail} label="Email" value={detailStudent.email} />
            <DetailRow icon={BadgeCheck} label="Student ID" value={detailStudent.studentId || '—'} />
            <DetailRow icon={GraduationCap} label="Grade" value={detailStudent.grade || '—'} />
            <DetailRow icon={CalendarDays} label="Applied On" value={formatDate(detailStudent.createdAt)} />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button
              className="spk-btn spk-btn-success spk-btn-block"
              onClick={() => { handleApprove(detailStudent.id, detailStudent.name); setDetailStudent(null); }}
            >
              <Check size={15} strokeWidth={2.4} /> Approve
            </button>
            <button
              className="spk-btn spk-btn-danger spk-btn-block"
              onClick={() => { handleReject(detailStudent.id, detailStudent.name); setDetailStudent(null); }}
            >
              <X size={15} strokeWidth={2.4} /> Reject
            </button>
          </div>
        </Modal>
      )}

      <Hero
        title="Pending Approvals"
        subtitle="Review new student registrations. Approving lets them in once payment is confirmed."
        icon={UserCheck}
      >
        {selected.size > 0 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <button className="spk-btn spk-btn-dark" onClick={handleBulkApprove}>
              <Check size={15} strokeWidth={2.4} />
              Approve Selected ({selected.size})
            </button>
          </div>
        )}
      </Hero>

      <div className="spk-stats spk-stats-3">
        <StatCard icon={Users} value={students.length} label="Pending total" tone={students.length ? 'amber' : 'gray'} />
        <StatCard icon={Search} value={filtered.length} label="Matching filters" tone="blue" />
        <StatCard icon={Check} value={selected.size} label="Selected" tone={selected.size ? 'green' : 'gray'} />
      </div>

      <SectionBar
        title="Applications"
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
            <button className="spk-btn spk-btn-ghost spk-btn-sm" onClick={fetchPending}>
              <RefreshCw size={14} strokeWidth={2.1} /> Refresh
            </button>
          </div>
        }
      />

      {gradesPresent.length > 1 && (
        <FilterPills options={gradesPresent} active={gradeFilter} onChange={setGradeFilter} />
      )}

      <Panel>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '60px 0', color: '#71717A', fontSize: 13.5, fontWeight: 600 }}>
            <Spinner size={18} /> Loading pending applications…
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={students.length === 0 ? UserCheck : Search}
            title={students.length === 0 ? 'All caught up!' : 'No results found'}
            hint={students.length === 0 ? 'There are no pending applications right now.' : 'Try adjusting your search or grade filter.'}
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
                <button className="spk-btn spk-btn-success spk-btn-sm" onClick={handleBulkApprove}>
                  <Check size={14} strokeWidth={2.4} /> Approve Selected ({selected.size})
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
                    <div className="spk-initials">{initialsOf(name, '?')}</div>

                    <div className="spk-row-body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span className="spk-row-title">{name}</span>
                        <span className="spk-badge spk-badge-amber">Pending</span>
                      </div>
                      <div className="spk-row-meta">
                        <span className="spk-truncate"><Mail size={12} strokeWidth={2} />{student.email}</span>
                        {student.studentId && <span><BadgeCheck size={12} strokeWidth={2} />{student.studentId}</span>}
                        {student.grade && <span><GraduationCap size={12} strokeWidth={2} />{student.grade}</span>}
                        <span><CalendarDays size={12} strokeWidth={2} />Applied {formatDate(student.createdAt)}</span>
                      </div>
                    </div>

                    <div className="spk-row-actions">
                      <button className="spk-icon-btn" onClick={() => setDetailStudent(student)} title="View details">
                        <Eye size={14} strokeWidth={2} />
                      </button>
                      <button
                        className="spk-btn spk-btn-success spk-btn-sm"
                        onClick={() => handleApprove(student.id, name)}
                        disabled={actionLoading === student.id}
                      >
                        {actionLoading === student.id ? <Spinner size={14} /> : <Check size={14} strokeWidth={2.4} />}
                        Approve
                      </button>
                      <button
                        className="spk-btn spk-btn-danger spk-btn-sm"
                        onClick={() => handleReject(student.id, name)}
                        disabled={!!actionLoading}
                      >
                        <X size={14} strokeWidth={2.4} /> Reject
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

export default StudentApprovals;
