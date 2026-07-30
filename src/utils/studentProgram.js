/**
 * Program-type helpers driven off the Student ID.
 *
 * Spoken programme IDs look like:  SP26 01001
 *                                  ││ ││ └──── 5-digit sequence
 *                                  ││ └────── 2-digit intake year
 *                                  └───────── "SP" prefix
 *
 * NOTE: existing (non-spoken) accounts use the older free-form format
 * (e.g. "S-2024-001"), so anything that does not match SPOKEN_ID_REGEX
 * falls through to the current default dashboard logic untouched.
 */

export const SPOKEN_ID_REGEX = /^SP\d{2}\d{5}$/i;

/** Route every Spoken-programme student lands on. */
export const SPOKEN_DASHBOARD_ROUTE = '/Spoken/Dashboard';
export const ADMIN_SPOKEN_DASHBOARD_ROUTE = '/AdminSpokenDashboard';

/** True when the given Student ID belongs to the Spoken programme. */
export const isSpokenStudentId = (studentId) =>
  SPOKEN_ID_REGEX.test(String(studentId || '').trim());

/**
 * Program type for a Firestore user document.
 * A stored `program` field always wins so admin can override an ID-based guess;
 * otherwise it is derived from the Student ID.
 */
export const getProgramType = (userData = {}) => {
  if (userData.program) return userData.program;
  return isSpokenStudentId(userData.studentId) ? 'spoken' : 'online';
};

/**
 * Dashboard a user should land on after login/registration.
 * Non-spoken students keep the existing grade-based behaviour.
 */
export const getDashboardRoute = (userData = {}) => {
  if (getProgramType(userData) === 'spoken') return SPOKEN_DASHBOARD_ROUTE;
  if ((userData.grade || '') === 'Grade 9') return '/Grade9/Dashboard';
  return '/Dashboard2';
};
