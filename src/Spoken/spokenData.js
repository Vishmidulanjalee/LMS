/**
 * Shared config + shape helpers for the Spoken dashboards.
 *
 * All actual content (recordings, assessments, documents) lives in Firestore
 * and is read through spokenApi.js — nothing is hardcoded here.
 *
 * The two folders below are structural: admin's "Add Recording" form offers
 * them as the folder choices, so they are configuration rather than content.
 */

export const RECORDING_FOLDERS = [
  {
    id: 'grammar',
    name: 'Grammar Recordings',
    description: 'Weekly grammar lesson replays',
  },
  {
    id: 'wordbird',
    name: 'Word Bird Session Recordings',
    description: 'Vocabulary building sessions',
  },
];

// Teaching staff shown on the student dashboard. There is no admin screen for
// this yet, so it stays configuration — edit here to change the list.
export const INSTRUCTORS = [
  { id: 't0', name: 'Gishan Dhananjaya', role: 'Lead Instructor', color: '#10B981' },
  { id: 't1', name: 'Risini Kannangara', role: 'Instructor', color: '#F59E0B' },
  { id: 't2', name: 'Sandali Hansika', role: 'Instructor', color: '#0EA5E9' },
  { id: 't3', name: 'Vishmi Dulanjalee', role: 'Instructor', color: '#8B5CF6' },
];

/** True once `expiresAt` has passed. No expiry date = never expires. */
export const isExpired = (item, now = new Date()) => {
  if (!item.expiresAt) return false;
  const expiry = new Date(item.expiresAt);
  if (Number.isNaN(expiry.getTime())) return false;
  // Expires at end of the chosen day.
  expiry.setHours(23, 59, 59, 999);
  return expiry < now;
};

/**
 * Combined visibility check used by the student view: admin's manual
 * show/hide toggle (`visible: false`) wins outright, otherwise it comes down
 * to the expiry date.
 */
export const isAssessmentVisible = (item, now = new Date()) =>
  item.visible !== false && !isExpired(item, now);

/** Recordings and documents have no expiry — just the manual toggle. */
export const isContentVisible = (item) => item.visible !== false;

export const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

/** Whole days from today until `value` — negative once it has passed. */
export const daysUntil = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(23, 59, 59, 999);
  return Math.ceil((d - new Date()) / 86400000);
};

/** "Closes today" / "3 days left" style label for a deadline. */
export const deadlineLabel = (value) => {
  const days = daysUntil(value);
  if (days === null) return 'No deadline';
  if (days < 0) return 'Closed';
  if (days === 0) return 'Closes today';
  if (days === 1) return 'Closes tomorrow';
  return `${days} days left`;
};

// YouTube helpers now live in the shared module (the admin upload pages use
// them too); re-exported here so existing imports keep working.
export { getYouTubeId, getYouTubeThumbnail } from '../shared/youtube';

/** Case-insensitive substring match across the given fields. */
export const matchesSearch = (item, term, fields) => {
  const q = String(term || '').trim().toLowerCase();
  if (!q) return true;
  return fields.some((f) => String(item[f] || '').toLowerCase().includes(q));
};
