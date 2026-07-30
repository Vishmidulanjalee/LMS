import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import {
  LayoutDashboard, UserCheck, Users, Video, BarChart3,
  FileText, Mic, Shield,
} from 'lucide-react';
import { auth } from '../firebase';
import { DashboardShell } from '../shared/DashboardUI';

/**
 * Every page in the admin section shares this sidebar, so the whole area feels
 * like one product. `id` doubles as the route each item navigates to.
 */
export const ADMIN_NAV = [
  { id: '/AdminDashboard', label: 'Overview', icon: LayoutDashboard },
  { id: '/StudentApprovals', label: 'Approvals', icon: UserCheck },
  { id: '/ApprovedStudents', label: 'Students', icon: Users },
  { id: '/UploadRecordings', label: 'Recordings', icon: Video },
  { id: '/UploadMarks', label: 'Marks', icon: BarChart3 },
  { id: '/UploadDocuments', label: 'Documents', icon: FileText },
  { id: '/AdminSpokenDashboard', label: 'Spoken English', icon: Mic },
  
];

/**
 * Admin chrome wrapper.
 *
 * @param active   route id of the current page (see ADMIN_NAV)
 * @param counts   optional { [routeId]: number } badge counts for the sidebar
 * @param search / onSearch   omit onSearch to hide the topbar search box
 */
const AdminShell = ({
  active, counts = {}, search, onSearch, searchPlaceholder,
  sidebarFooter, footnote, children,
}) => {
  const navigate = useNavigate();

  const nav = ADMIN_NAV.map((item) => ({ ...item, count: counts[item.id] }));

  const handleSignOut = async () => {
    try { await signOut(auth); } catch {}
    navigate('/Signin');
  };

  return (
    <DashboardShell
      brandIcon={Shield}
      brandSub="Admin Panel"
      nav={nav}
      activeId={active}
      onNavSelect={(item) => navigate(item.id)}
      sidebarFooter={sidebarFooter}
      search={search}
      onSearch={onSearch}
      searchPlaceholder={searchPlaceholder}
      user={{ name: 'Admin', meta: 'Content Manager', fallback: 'AD' }}
      onSignOut={handleSignOut}
      footnote={footnote || 'Admin Panel'}
    >
      {children}
    </DashboardShell>
  );
};

export default AdminShell;
