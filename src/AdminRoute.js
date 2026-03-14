import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;

/**
 * AdminRoute — only allows users whose Firestore document has role === 'admin'.
 * Falls back to checking the env-var admin email for backward compatibility.
 * Everyone else is redirected to /Signin.
 */
const AdminRoute = ({ element }) => {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus('denied');
        return;
      }

      try {
        const snap = await getDoc(doc(db, 'users', user.uid));

        // Primary check: Firestore role field
        if (snap.exists() && snap.data().role === 'admin') {
          setStatus('allowed');
          return;
        }

        // Fallback: env-var admin email (for accounts created before role field)
        if (ADMIN_EMAIL && user.email === ADMIN_EMAIL) {
          setStatus('allowed');
          return;
        }

        setStatus('denied');
      } catch {
        setStatus('denied');
      }
    });

    return () => unsubscribe();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <svg className="animate-spin h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-sm">Verifying access…</p>
        </div>
      </div>
    );
  }

  if (status === 'denied') return <Navigate to="/Signin" replace />;

  return element;
};

export default AdminRoute;
