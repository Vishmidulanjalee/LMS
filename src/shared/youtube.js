/**
 * YouTube link helpers, shared by the student and admin dashboards.
 */

/**
 * Pull the 11-character video id out of any common YouTube URL shape:
 *   youtube.com/watch?v=ID   (with or without extra query params)
 *   youtu.be/ID
 *   youtube.com/embed/ID  ·  /shorts/ID  ·  /live/ID
 * Returns null for anything that isn't a YouTube link.
 */
export const getYouTubeId = (url) => {
  const s = String(url || '').trim();
  if (!s) return null;
  const patterns = [
    /youtube\.com\/watch\?(?:[^#]*&)?v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/live\/([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m) return m[1];
  }
  return null;
};

/**
 * Thumbnail URL for a YouTube link — derived from the id, so admin only ever
 * pastes the video link and the image comes for free. `hqdefault` is the
 * highest size guaranteed to exist for every video.
 */
export const getYouTubeThumbnail = (url) => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};
