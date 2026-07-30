import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getCountFromServer } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import {
  UserCheck, Users, Video, BarChart3, FileText, Mic, Shield,
  CreditCard, Clock, ChevronRight, LayoutDashboard,
} from 'lucide-react';
import { auth, db } from '../firebase';
import AdminShell from './AdminShell';
import { Hero, StatCard, SectionBar, Panel, RailCard, RailItem } from '../shared/DashboardUI';

/* Everything an admin can manage, in one grid. */
const ACTIONS = [
  {
    route: '/StudentApprovals', icon: UserCheck,
    title: 'Student Approvals',
    desc: 'Review and approve new student registrations',
    cta: 'Review',
  },
  {
    route: '/ApprovedStudents', icon: Users,
    title: 'Approved Students',
    desc: 'Manage payments and dashboard access',
    cta: 'Manage',
  },
  {
    route: '/UploadRecordings', icon: Video,
    title: 'Class Recordings',
    desc: 'Upload and manage class session videos',
    cta: 'Upload',
  },
  {
    route: '/UploadMarks', icon: BarChart3,
    title: 'Exam Results',
    desc: 'Upload monthly exam result sheets',
    cta: 'Upload',
  },
  {
    route: '/UploadDocuments', icon: FileText,
    title: 'Tutes & Documents',
    desc: 'Upload tutorials, past papers, and notes',
    cta: 'Upload',
  },
  {
    route: '/AdminSpokenDashboard', icon: Mic,
    title: 'Spoken English',
    desc: 'Recordings, grammar assessments, and tutes',
    cta: 'Manage',
  },
 
];

const AdminDashboard = () => {
  const [userName, setUserName] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setUserName(docSnap.data().username);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const pendingSnap = await getCountFromServer(
          query(collection(db, 'users'), where('status', '==', 'pending')),
        );
        setPendingCount(pendingSnap.data().count);

        const approvedSnap = await getCountFromServer(
          query(collection(db, 'users'), where('status', '==', 'approved')),
        );
        setApprovedCount(approvedSnap.data().count);

        const unpaidSnap = await getCountFromServer(
          query(collection(db, 'users'), where('status', '==', 'approved'), where('paid', '==', false)),
        );
        setUnpaidCount(unpaidSnap.data().count);
      } catch {}
    };
    fetchCounts();
  }, []);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const firstName = (userName || '').trim().split(/\s+/)[0];

  return (
    <AdminShell
      active="/AdminDashboard"
      counts={{ '/StudentApprovals': pendingCount }}
      sidebarFooter={{
        title: 'Need a hand?',
        text: 'Every section shares this sidebar — switch areas without going back.',
      }}
    >
      <Hero
        eyebrow={today}
        title={firstName ? `Welcome back, ${firstName}!` : 'Welcome back!'}
        subtitle="Approve students, manage payments, and publish content across every programme."
        icon={LayoutDashboard}
      >
        {pendingCount > 0 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <button className="spk-btn spk-btn-dark" onClick={() => navigate('/StudentApprovals')}>
              <UserCheck size={15} strokeWidth={2.1} />
              Review {pendingCount} pending
            </button>
          </div>
        )}
      </Hero>

      <div className="spk-stats">
        <StatCard icon={Clock} value={pendingCount} label="Pending approvals" tone={pendingCount > 0 ? 'amber' : 'gray'} />
        <StatCard icon={Users} value={approvedCount} label="Approved students" tone="green" />
        <StatCard icon={CreditCard} value={unpaidCount} label="Awaiting payment" tone={unpaidCount > 0 ? 'red' : 'gray'} />
        <StatCard icon={Shield} value={ACTIONS.length} label="Managed sections" tone="blue" />
      </div>

      <SectionBar
        title="Manage"
        subtitle="Everything you can publish or review, in one place"
      />

      <div className="spk-columns">
        <Panel>
          <div className="spk-cards">
            {ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button key={action.route} className="spk-card" onClick={() => navigate(action.route)}>
                  <div className="spk-card-icon">
                    <Icon size={21} strokeWidth={1.9} />
                  </div>
                  <div className="spk-card-title">{action.title}</div>
                  <div className="spk-card-desc">{action.desc}</div>
                  <span className="spk-link" style={{ marginTop: 16 }}>
                    {action.cta}
                    <ChevronRight size={13} strokeWidth={2.4} />
                  </span>
                </button>
              );
            })}
          </div>
        </Panel>

        <div className="spk-rail">
          <RailCard title="Needs attention">
            {pendingCount === 0 && unpaidCount === 0 ? (
              <RailItem icon={UserCheck} tone="green" title="All clear" sub="No pending approvals or unpaid accounts." />
            ) : (
              <>
                {pendingCount > 0 && (
                  <RailItem
                    icon={Clock}
                    tone="amber"
                    title={`${pendingCount} pending approval${pendingCount === 1 ? '' : 's'}`}
                    sub="Students waiting to be reviewed."
                  />
                )}
                {unpaidCount > 0 && (
                  <RailItem
                    icon={CreditCard}
                    tone="red"
                    title={`${unpaidCount} awaiting payment`}
                    sub="Approved, but blocked until payment is confirmed."
                  />
                )}
              </>
            )}
          </RailCard>

          <RailCard title="Programmes">
            <RailItem icon={Video} title="Main Programme" sub="Recordings, marks, and documents" />
            <RailItem icon={Mic} tone="blue" title="Spoken English" sub="Student IDs starting with SP" />
          </RailCard>
        </div>
      </div>
    </AdminShell>
  );
};

export default AdminDashboard;
