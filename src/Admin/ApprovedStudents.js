import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const GRADES = ['All Grades', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Grade 13', 'A/L', 'Other'];

/* ── icons ── */
const Icon = ({ d, d2, className = "h-4 w-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    {d2 && <path strokeLinecap="round" strokeLinejoin="round" d={d2} />}
  </svg>
);
const IcoBack    = () => <Icon className="h-5 w-5" d="M15 19l-7-7 7-7" />;
const IcoRefresh = () => <Icon d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />;
const IcoSearch  = () => <Icon d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />;
const IcoCheck   = () => <Icon d="M5 13l4 4L19 7" />;
const IcoX       = () => <Icon d="M6 18L18 6M6 6l12 12" />;
const IcoEmail   = () => <Icon className="h-3.5 w-3.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />;
const IcoID      = () => <Icon className="h-3.5 w-3.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c0 1.306.835 2.418 2 2.83" />;
const IcoGrade   = () => <Icon className="h-3.5 w-3.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />;
const IcoDate    = () => <Icon className="h-3.5 w-3.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
const IcoPay     = () => <Icon d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />;
const IcoSort    = () => <Icon d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />;
const IcoExport  = () => <Icon d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />;

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
  </svg>
);

const Toast = ({ toast }) => toast ? (
  <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
    {toast.type === 'error' ? <IcoX /> : <IcoCheck />}
    {toast.msg}
  </div>
) : null;

const ApprovedStudents = () => {
  const [students, setStudents]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast]                 = useState(null);
  const [search, setSearch]               = useState('');
  const [gradeFilter, setGradeFilter]     = useState('All Grades');
  const [payFilter, setPayFilter]         = useState('all');
  const [sortBy, setSortBy]               = useState('newest');
  const [selected, setSelected]           = useState(new Set());
  const [detailStudent, setDetailStudent] = useState(null);
  const navigate = useNavigate();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchApproved = async () => {
    setLoading(true);
    setSelected(new Set());
    try {
      const q = query(collection(db, "users"), where("status", "==", "approved"));
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
      await updateDoc(doc(db, "users", uid), { paid: true, paidAt: new Date() });
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
      await updateDoc(doc(db, "users", uid), { paid: false });
      setStudents(prev => prev.map(s => s.id === uid ? { ...s, paid: false } : s));
      showToast(`${name} marked as unpaid.`, 'error');
    } catch {
      showToast('Failed to update.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkMarkPaid = async () => {
    const unpaidSelected = [...selected].filter(uid => {
      const s = students.find(x => x.id === uid);
      return s && !s.paid;
    });
    if (!unpaidSelected.length) { showToast('All selected students are already paid.', 'error'); return; }
    if (!window.confirm(`Mark ${unpaidSelected.length} student(s) as paid?`)) return;
    for (const uid of unpaidSelected) {
      try { await updateDoc(doc(db, "users", uid), { paid: true, paidAt: new Date() }); } catch {}
    }
    setStudents(prev => prev.map(s => unpaidSelected.includes(s.id) ? { ...s, paid: true } : s));
    showToast(`${unpaidSelected.length} student(s) marked as paid.`);
    setSelected(new Set());
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
    const n = new Set(prev); n.has(uid) ? n.delete(uid) : n.add(uid); return n;
  });

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(s => s.id)));
  };

  const formatDate = (ts) => {
    if (!ts) return '—';
    if (ts instanceof Date) return ts.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    return new Date(ts.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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

  const paidCount   = students.filter(s => s.paid).length;
  const unpaidCount = students.filter(s => !s.paid).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast toast={toast} />

      {/* Detail Modal */}
      {detailStudent && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4" onClick={() => setDetailStudent(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Student Details</h2>
              <button onClick={() => setDetailStudent(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><IcoX /></button>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className={`h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-xl ${detailStudent.paid ? 'bg-green-400' : 'bg-amber-400'}`}>
                {(detailStudent.name || '?').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">{detailStudent.name || detailStudent.username}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${detailStudent.paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {detailStudent.paid ? 'Paid — Active' : 'Unpaid — Blocked'}
                </span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              {[
                [IcoEmail, 'Email', detailStudent.email],
                [IcoID, 'Student ID', detailStudent.studentId || '—'],
                [IcoGrade, 'Grade', detailStudent.grade || '—'],
                [IcoDate, 'Registered', formatDate(detailStudent.createdAt)],
              ].map(([Ico, label, val]) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400"><Ico /></span>
                  <span className="text-gray-500 w-24">{label}</span>
                  <span className="font-medium text-gray-800">{val}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              {!detailStudent.paid ? (
                <button
                  onClick={() => { handleMarkPaid(detailStudent.id, detailStudent.name); setDetailStudent(null); }}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg transition"
                >
                  <IcoPay /> Mark as Paid
                </button>
              ) : (
                <button
                  onClick={() => { handleMarkUnpaid(detailStudent.id, detailStudent.name); setDetailStudent(null); }}
                  className="w-full flex items-center justify-center gap-2 border border-red-300 hover:bg-red-50 text-red-600 font-medium py-2.5 rounded-lg transition"
                >
                  <IcoX /> Mark as Unpaid
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/AdminDashboard')} className="p-2 hover:bg-gray-100 rounded-lg transition"><IcoBack /></button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Approved Students</h1>
              <p className="text-xs text-gray-500">Manage payments and dashboard access</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <button onClick={handleBulkMarkPaid} className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                <IcoPay /> Mark Paid ({selected.size})
              </button>
            )}
            <button onClick={handleExportCSV} className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium px-3 py-2 rounded-lg transition">
              <IcoExport /> Export CSV
            </button>
            <button onClick={fetchApproved} className="p-2 hover:bg-gray-100 rounded-lg transition"><IcoRefresh /></button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Total', value: students.length, color: 'blue' },
            { label: 'Paid / Active', value: paidCount, color: 'green' },
            { label: 'Unpaid / Blocked', value: unpaidCount, color: 'amber' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`bg-${color}-50 border border-${color}-100 rounded-xl p-3 text-center`}>
              <p className={`text-xl font-bold text-${color}-600`}>{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><IcoSearch /></span>
            <input
              type="text"
              placeholder="Search by name, email or student ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <select
            value={gradeFilter}
            onChange={e => setGradeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {GRADES.map(g => <option key={g}>{g}</option>)}
          </select>

          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
            {[['all', 'All'], ['paid', 'Paid'], ['unpaid', 'Unpaid']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setPayFilter(val)}
                className={`px-4 py-2 font-medium transition ${payFilter === val ? 'bg-yellow-400 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm">
            <IcoSort />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-transparent focus:outline-none text-sm">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
            <Spinner /> Loading students…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">No students match this filter.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3 px-1">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll} className="h-4 w-4 rounded border-gray-300 accent-yellow-400" />
                Select all ({filtered.length})
              </label>
              <p className="text-xs text-gray-400">{filtered.length} of {students.length} shown</p>
            </div>

            <div className="space-y-3">
              {filtered.map(student => (
                <div
                  key={student.id}
                  className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition ${selected.has(student.id) ? 'border-yellow-400 bg-yellow-50/30' : student.paid ? 'border-green-100' : 'border-amber-100'}`}
                >
                  {/* Checkbox + Avatar */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <input type="checkbox" checked={selected.has(student.id)} onChange={() => toggleSelect(student.id)} className="h-4 w-4 rounded border-gray-300 accent-yellow-400" />
                    <div className={`h-11 w-11 rounded-full flex items-center justify-center text-white font-bold text-base ${student.paid ? 'bg-green-400' : 'bg-amber-400'}`}>
                      {(student.name || student.username || '?').slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{student.name || student.username || 'Unknown'}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${student.paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {student.paid ? <IcoCheck /> : null}
                        {student.paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><IcoEmail />{student.email}</span>
                      {student.studentId && <span className="flex items-center gap-1"><IcoID />{student.studentId}</span>}
                      {student.grade && <span className="flex items-center gap-1"><IcoGrade />{student.grade}</span>}
                      <span className="flex items-center gap-1"><IcoDate />Registered {formatDate(student.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setDetailStudent(student)}
                      className="p-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-500 transition" title="View details"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    {!student.paid ? (
                      <button
                        onClick={() => handleMarkPaid(student.id, student.name || student.username)}
                        disabled={actionLoading === student.id + '-pay'}
                        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                      >
                        {actionLoading === student.id + '-pay' ? <Spinner /> : <IcoPay />} Mark Paid
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkUnpaid(student.id, student.name || student.username)}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 border border-red-300 hover:bg-red-50 text-red-500 text-sm font-medium px-4 py-2 rounded-lg transition"
                      >
                        <IcoX /> Mark Unpaid
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ApprovedStudents;
