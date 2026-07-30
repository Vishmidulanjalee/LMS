import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { GraduationCap } from 'lucide-react';
import { auth, db } from '../firebase';
import { DashboardShell } from './DashboardUI';
import { STUDENT_NAV } from './studentNav';

/**
 * Chrome wrapper for every general student page (Dashboard2 and everything
 * it links to — recordings, marks, tutes). Mirrors AdminShell's role for the
 * admin section, so the whole student area feels like one product.
 *
 * @param active   route id of the current page (see STUDENT_NAV)
 */
const StudentShell = ({ active, sidebarFooter, footnote, children }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) setUserName(snap.data().username || '');
      } catch {}
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try { await signOut(auth); } catch {}
    navigate('/Signin');
  };

  return (
    <DashboardShell
      brandIcon={GraduationCap}
      brandSub="Student Portal"
      nav={STUDENT_NAV}
      activeId={active}
      onNavSelect={(item) => navigate(item.id)}
      footnote={footnote || 'Student Portal'}
      sidebarFooter={sidebarFooter}
      user={{ name: userName, meta: 'Student' }}
      onSignOut={handleSignOut}
    >
      {typeof children === 'function' ? children(userName) : children}
    </DashboardShell>
  );
};

export default StudentShell;
