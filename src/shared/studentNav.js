import { LayoutDashboard, Video, BarChart3, BookOpen, FolderOpen } from 'lucide-react';

/**
 * Every general student page (Dashboard2 and everything it links to) shares
 * this sidebar, so recordings/marks/tutes feel like one product instead of
 * a hub page linking out to differently-skinned sub-apps.
 */
export const STUDENT_NAV = [
  { id: '/Dashboard2', label: 'Dashboard', icon: LayoutDashboard },
  { id: '/WatchVideosFolder', label: 'Class Recordings', icon: Video },
  { id: '/MarkSheets', label: 'Exam Results', icon: BarChart3 },
  { id: '/docs/tutes', label: 'Tutes', icon: BookOpen },
  { id: '/Other', label: 'Other', icon: FolderOpen },
];
