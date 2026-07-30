import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { getProgramType, getDashboardRoute, SPOKEN_DASHBOARD_ROUTE } from './utils/studentProgram';

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;

/**
 * PrivateRoute
 *
 * @param element   the page to render once access is granted
 * @param program   which programme this route belongs to. 'spoken' locks the
 *                  route to Spoken students; the default ('online') keeps the
 *                  existing behaviour for every route already in the app and
 *                  bounces Spoken students back to their own dashboard.
 *                  Admins bypass the programme check entirely.
 */
const PrivateRoute = ({ element, program = 'online' }) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'admin' | 'allowed' | 'pending' | 'unpaid' | 'unauthenticated' | 'wrong-program'
  const [redirectTo, setRedirectTo] = useState(null);

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
        const userProgram = getProgramType(data);

        // Spoken-programme students need no admin approval or payment
        // confirmation. All other programmes keep the existing gates.
        if (userProgram !== 'spoken') {
          if (data.status !== 'approved') { setStatus('pending'); return; }
          if (!data.paid) { setStatus('unpaid'); return; }
        }

        // Programme gate — a student may only enter their own programme's routes.
        if (userProgram !== program) {
          setRedirectTo(getDashboardRoute(data));
          setStatus('wrong-program');
          return;
        }

        setStatus('allowed');
      } catch {
        setStatus('unauthenticated');
      }
    });
    return () => unsubscribe();
  }, [program]);

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
  if (status === 'wrong-program') return <Navigate to={redirectTo || SPOKEN_DASHBOARD_ROUTE} replace />;

  // 'admin' or 'allowed'
  return element;
};

export default PrivateRoute;
