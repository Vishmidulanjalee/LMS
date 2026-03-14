import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;

const PrivateRoute = ({ element }) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'admin' | 'allowed' | 'pending' | 'unpaid' | 'unauthenticated'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { setStatus('unauthenticated'); return; }

      // Check Firestore role first, then fall back to env-var email
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists() && snap.data().role === 'admin') { setStatus('admin'); return; }
      } catch {}

      if (ADMIN_EMAIL && user.email === ADMIN_EMAIL) { setStatus('admin'); return; }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) { setStatus('unauthenticated'); return; }
        const data = snap.data();
        if (data.status !== 'approved') { setStatus('pending'); return; }
        if (!data.paid) { setStatus('unpaid'); return; }
        setStatus('allowed');
      } catch {
        setStatus('unauthenticated');
      }
    });
    return () => unsubscribe();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <svg className="animate-spin h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <p className="text-sm">Checking access…</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') return <Navigate to="/Signin" />;
  if (status === 'pending') return <Navigate to="/pending-approval" />;
  if (status === 'unpaid') return <Navigate to="/Signin" />;

  // 'admin' or 'allowed'
  return element;
};

export default PrivateRoute;
