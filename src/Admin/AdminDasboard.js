import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getCountFromServer } from "firebase/firestore";
import { auth, db } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import Footer from '../Footer';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  const [unpaidCount, setUnpaidCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setUserName(docSnap.data().username);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const pendingSnap = await getCountFromServer(query(collection(db, "users"), where("status", "==", "pending")));
        setPendingCount(pendingSnap.data().count);
        const unpaidSnap = await getCountFromServer(query(collection(db, "users"), where("status", "==", "approved"), where("paid", "==", false)));
        setUnpaidCount(unpaidSnap.data().count);
      } catch {}
    };
    fetchCounts();
  }, []);

  const today = new Date();
  const currentDate = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const userInitials = userName ? userName.slice(0, 2).toUpperCase() : 'PA';

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }} className="flex flex-col min-h-screen bg-yellow-50">

      {/* TOP NAV */}
      <header style={{ background: 'linear-gradient(135deg, #FACC15 0%, #F59E0B 60%, #D97706 100%)' }} className="shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left: Brand + Date */}
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: 'Georgia, serif', textShadow: '0 1px 6px rgba(0,0,0,0.15)' }}>
                Admin Dashboard
              </span>
              <span className="bg-white/25 text-white text-xs font-bold px-2.5 py-0.5 rounded-full tracking-wide">The BEE Academy</span>
            </div>
            <p className="text-yellow-900/70 text-sm font-medium">{currentDate}</p>
          </div>

          {/* Right: Spoken English btn + Avatar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = "/AdminDashboardGuest"}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/35 border border-white/40 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
              </svg>
              Spoken English
            </button>
            <div className="h-10 w-10 rounded-full bg-white/30 border-2 border-white/60 flex items-center justify-center text-white font-black text-sm shadow-sm">
              {userInitials}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Pending Approvals */}
            <div className="bg-white rounded-2xl shadow-sm border border-yellow-100 p-6 flex items-center justify-between group hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #FEF9C3, #FDE68A)' }}>
                  <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Pending Approvals</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900">{pendingCount}</span>
                    {pendingCount > 0 && (
                      <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">Action needed</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Students awaiting admin review</p>
                </div>
              </div>
              <button
                onClick={() => window.location.href = "/StudentApprovals"}
                className="shrink-0 text-sm font-bold text-yellow-600 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 px-4 py-2 rounded-xl transition-all"
              >
                Review
              </button>
            </div>

            {/* Unpaid Students */}
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 flex items-center justify-between group hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)' }}>
                  <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Unpaid Students</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900">{unpaidCount}</span>
                    {unpaidCount > 0 && (
                      <span className="text-xs font-bold text-white bg-orange-400 px-2 py-0.5 rounded-full">Unpaid</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Approved students pending payment</p>
                </div>
              </div>
              <button
                onClick={() => window.location.href = "/ApprovedStudents"}
                className="shrink-0 text-sm font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-4 py-2 rounded-xl transition-all"
              >
                Manage
              </button>
            </div>
          </div>

          {/* CONTENT MANAGEMENT */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-black text-gray-800 tracking-tight">Content Management</h2>
              <div className="flex-1 h-px bg-yellow-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Online Recordings */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FEF9C3, #FDE68A)' }}>
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.868v4.264a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-900 text-base">Online Class Recordings</h3>
                  <p className="text-sm text-gray-400 mt-1">Upload and manage class session videos</p>
                </div>
                <button
                  onClick={() => window.location.href = "/UploadRecordings"}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-yellow-900 transition-all"
                  style={{ background: 'linear-gradient(135deg, #FACC15, #F59E0B)' }}
                >
                  Upload Now
                </button>
              </div>

              {/* Exam Results */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FEF9C3, #FDE68A)' }}>
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-900 text-base">Exam Results</h3>
                  <p className="text-sm text-gray-400 mt-1">Upload monthly exam result sheets</p>
                </div>
                <button
                  onClick={() => window.location.href = "/UploadMarks"}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-yellow-900 transition-all"
                  style={{ background: 'linear-gradient(135deg, #FACC15, #F59E0B)' }}
                >
                  Upload Now
                </button>
              </div>

              {/* Documents */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FEF9C3, #FDE68A)' }}>
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-900 text-base">Tutes, Papers & Documents</h3>
                  <p className="text-sm text-gray-400 mt-1">Upload tutorials, past papers, and notes</p>
                </div>
                <button
                  onClick={() => window.location.href = "/UploadDocuments"}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-yellow-900 transition-all"
                  style={{ background: 'linear-gradient(135deg, #FACC15, #F59E0B)' }}
                >
                  Upload Now
                </button>
              </div>
            </div>
          </div>


        </div>
      </main>

      <footer className="w-full bg-white border-t mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Dashboard;
