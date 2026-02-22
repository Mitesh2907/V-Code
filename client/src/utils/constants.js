/**
 * Application-wide constants
 * Centralized for consistency and easy maintenance
 */

export const ROOM_CODE_PREFIX = 'VC-';
export const ROOM_CODE_LENGTH = 4;
export const ROOM_CODE_PATTERN = /^VC-\d{4}$/;

export const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', icon: '⚡' },
  { id: 'typescript', name: 'TypeScript', icon: '📘' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'html', name: 'HTML', icon: '🌐' },
  { id: 'css', name: 'CSS', icon: '🎨' },
  { id: 'cpp', name: 'C++', icon: '⚙️' },
  { id: 'go', name: 'Go', icon: '🐹' },
  { id: 'rust', name: 'Rust', icon: '🦀' },
  { id: 'php', name: 'PHP', icon: '🐘' },
  { id: 'ruby', name: 'Ruby', icon: '💎' },
];
export const SAMPLE_FILES = [
  { id: 'index.js', name: 'index.js', language: 'javascript' },
  { id: 'app.jsx', name: 'App.jsx', language: 'javascript' },
  { id: 'styles.css', name: 'styles.css', language: 'css' },
  { id: 'utils.js', name: 'utils.js', language: 'javascript' },
];

export const DUMMY_USERS = [
  { id: 'user-1', name: 'You', color: 'bg-blue-500', isOnline: true },
  { id: 'user-2', name: 'Alex Johnson', color: 'bg-green-500', isOnline: true },
  { id: 'user-3', name: 'Sam Wilson', color: 'bg-purple-500', isOnline: true },
  { id: 'user-4', name: 'Taylor Swift', color: 'bg-yellow-500', isOnline: false },
];

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export const TOAST_DURATION = 3000;