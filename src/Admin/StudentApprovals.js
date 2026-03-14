import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const GRADES = ['All Grades', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Grade 13', 'A/L', 'Other'];

/* ── small SVG icons ── */
const Icon = ({ d, d2, className = "h-4 w-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    {d2 && <path strokeLinecap="round" strokeLinejoin="round" d={d2} />}
  </svg>
);
const IcoCheck   = () => <Icon className="h-4 w-4" d="M5 13l4 4L19 7" />;
const IcoX       = () => <Icon className="h-4 w-4" d="M6 18L18 6M6 6l12 12" />;
const IcoBack    = () => <Icon className="h-5 w-5" d="M15 19l-7-7 7-7" />;
const IcoRefresh = () => <Icon className="h-4 w-4" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />;
const IcoSearch  = () => <Icon className="h-4 w-4" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />;
const IcoEmail   = () => <Icon className="h-3.5 w-3.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />;
const IcoID      = () => <Icon className="h-3.5 w-3.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c0 1.306.835 2.418 2 2.83" />;
const IcoGrade   = () => <Icon className="h-3.5 w-3.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />;
const IcoDate    = () => <Icon className="h-3.5 w-3.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
const IcoSort    = () => <Icon className="h-4 w-4" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />;

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
  </svg>
);

const Toast = ({ toast }) => toast ? (
  <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
    {toast.type === 'error' ? <IcoX /> : <IcoCheck />}
    {toast.msg}
  </div>
) : null;

const StudentApprovals = () => {
  const [students, setStudents]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast]             = useState(null);
  const [search, setSearch]           = useState('');
  const [gradeFilter, setGradeFilter] = useState('All Grades');
  const [sortBy, setSortBy]           = useState('newest'); // 'newest' | 'oldest' | 'name'
  const [selected, setSelected]       = useState(new Set());
  const [detailStudent, setDetailStudent] = useState(null);
  const navigate = useNavigate();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPending = async () => {
    setLoading(true);
    setSelected(new Set());
    try {
      const q = query(collection(db, "users"), where("status", "==", "pending"));
      const snap = await getDocs(q);
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      showToast('Failed to load students.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleApprove = async (uid, name) => {
    setActionLoading(uid);
    try {
      await updateDoc(doc(db, "users", uid), { status: 'approved' });
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
      await updateDoc(doc(db, "users", uid), { status: 'rejected' });
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
        await updateDoc(doc(db, "users", uid), { status: 'approved' });
      } catch {}
    }
    setStudents(prev => prev.filter(s => !selected.has(s.id)));
    showToast(`${selected.size} student(s) approved.`);
    setSelected(new Set());
  };

  const toggleSelect = (uid) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(uid) ? n.delete(uid) : n.add(uid);
      return n;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(s => s.id)));
  };

  const formatDate = (ts) => !ts ? '—' : new Date(ts.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

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
              <div className="h-14 w-14 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold text-xl">
                {(detailStudent.name || '?').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">{detailStudent.name || detailStudent.username}</p>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Pending Review</span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              {[
                [IcoEmail, 'Email', detailStudent.email],
                [IcoID, 'Student ID', detailStudent.studentId || '—'],
                [IcoGrade, 'Grade', detailStudent.grade || '—'],
                [IcoDate, 'Applied On', formatDate(detailStudent.createdAt)],
              ].map(([Ico, label, val]) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400"><Ico /></span>
                  <span className="text-gray-500 w-24">{label}</span>
                  <span className="font-medium text-gray-800">{val}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { handleApprove(detailStudent.id, detailStudent.name); setDetailStudent(null); }}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg transition"
              >
                <IcoCheck /> Approve
              </button>
              <button
                onClick={() => { handleReject(detailStudent.id, detailStudent.name); setDetailStudent(null); }}
                className="flex-1 flex items-center justify-center gap-2 border border-red-300 hover:bg-red-50 text-red-600 font-medium py-2.5 rounded-lg transition"
              >
                <IcoX /> Reject
              </button>
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
              <h1 className="text-xl font-bold text-gray-900">Pending Approvals</h1>
              <p className="text-xs text-gray-500">Review and approve new student registrations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <button onClick={handleBulkApprove} className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                <IcoCheck /> Approve Selected ({selected.size})
              </button>
            )}
            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
              {students.length} Pending
            </span>
            <button onClick={fetchPending} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Refresh"><IcoRefresh /></button>
          </div>
        </div>

        {/* Search & Filter bar */}
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
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {GRADES.map(g => <option key={g}>{g}</option>)}
          </select>

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
            <Spinner /> Loading pending applications…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-20 w-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">{students.length === 0 ? 'All caught up!' : 'No results found'}</h3>
            <p className="text-gray-400 text-sm mt-1">{students.length === 0 ? 'No pending applications.' : 'Try adjusting your search or filter.'}</p>
          </div>
        ) : (
          <>
            {/* Select all bar */}
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
                  className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition ${selected.has(student.id) ? 'border-yellow-400 bg-yellow-50/30' : 'border-gray-100'}`}
                >
                  {/* Checkbox + Avatar */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <input type="checkbox" checked={selected.has(student.id)} onChange={() => toggleSelect(student.id)} className="h-4 w-4 rounded border-gray-300 accent-yellow-400" />
                    <div className="h-11 w-11 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold text-base">
                      {(student.name || student.username || '?').slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{student.name || student.username || 'Unknown'}</h3>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Pending</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><IcoEmail />{student.email}</span>
                      {student.studentId && <span className="flex items-center gap-1"><IcoID />{student.studentId}</span>}
                      {student.grade && <span className="flex items-center gap-1"><IcoGrade />{student.grade}</span>}
                      <span className="flex items-center gap-1"><IcoDate />Applied {formatDate(student.createdAt)}</span>
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
                    <button
                      onClick={() => handleApprove(student.id, student.name || student.username)}
                      disabled={actionLoading === student.id}
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                    >
                      {actionLoading === student.id ? <Spinner /> : <IcoCheck />} Approve
                    </button>
                    <button
                      onClick={() => handleReject(student.id, student.name || student.username)}
                      disabled={!!actionLoading}
                      className="flex items-center gap-1.5 border border-red-300 hover:bg-red-50 text-red-600 text-sm font-medium px-4 py-2 rounded-lg transition"
                    >
                      <IcoX /> Reject
                    </button>
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

export default StudentApprovals;
