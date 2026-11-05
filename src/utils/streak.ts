export interface StreakData {
  count: number;
  lastDate: string; // YYYY-MM-DD
  lastTimestamp: number; // ms epoch
  todayDone: boolean;
  longestStreak: number;
}

const STORAGE_KEY = 'auratype_streak_data';

// Local calendar date string YYYY-MM-DD
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Difference in calendar days between two YYYY-MM-DD dates
export function getCalendarDaysDiff(fromDateStr: string, toDateStr: string): number {
  if (!fromDateStr || !toDateStr) return 999;
  try {
    const [y1, m1, d1] = fromDateStr.split('-').map(Number);
    const [y2, m2, d2] = toDateStr.split('-').map(Number);
    const utc1 = Date.UTC(y1, m1 - 1, d1);
    const utc2 = Date.UTC(y2, m2 - 1, d2);
    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
  } catch {
    return 999;
  }
}

export function loadStreak(): StreakData {
  const today = getLocalDateString();
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved) as StreakData;
      const daysDiff = getCalendarDaysDiff(parsed.lastDate, today);

      if (daysDiff === 0) {
        // Practiced today! Streak intact & active today
        const result: StreakData = {
          count: Math.max(1, parsed.count),
          lastDate: today,
          lastTimestamp: parsed.lastTimestamp || Date.now(),
          todayDone: true,
          longestStreak: Math.max(parsed.count, parsed.longestStreak || 1),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        return result;
      } else if (daysDiff === 1) {
        // Practiced yesterday! Streak intact, waiting for today's practice
        const result: StreakData = {
          count: Math.max(1, parsed.count),
          lastDate: parsed.lastDate,
          lastTimestamp: parsed.lastTimestamp || Date.now() - 86400000,
          todayDone: false,
          longestStreak: Math.max(parsed.count, parsed.longestStreak || 1),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        return result;
      } else if (daysDiff === 2) {
        // 48-hour Grace period shield: Preserve streak count, prompt for today
        const result: StreakData = {
          count: Math.max(1, parsed.count),
          lastDate: parsed.lastDate,
          lastTimestamp: parsed.lastTimestamp || Date.now() - 172800000,
          todayDone: false,
          longestStreak: Math.max(parsed.count, parsed.longestStreak || 1),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        return result;
      } else {
        // Missed > 2 days: Streak reset, but keep longestStreak record
        const result: StreakData = {
          count: 0,
          lastDate: parsed.lastDate,
          lastTimestamp: parsed.lastTimestamp || 0,
          todayDone: false,
          longestStreak: Math.max(parsed.count, parsed.longestStreak || 1),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        return result;
      }
    } catch {
      // JSON corrupted, recreate
    }
  }

  // Initial fresh default state: Day 1 initialized & persisted to localStorage
  const initial: StreakData = {
    count: 1,
    lastDate: today,
    lastTimestamp: Date.now(),
    todayDone: true,
    longestStreak: 1,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export function recordStreakActivity(): StreakData {
  const current = loadStreak();
  const today = getLocalDateString();
  const now = Date.now();

  const daysDiff = getCalendarDaysDiff(current.lastDate, today);
  let newCount = current.count;

  if (daysDiff === 0) {
    // Same day practice: keep current streak active
    newCount = Math.max(1, current.count);
  } else if (daysDiff === 1 || daysDiff === 2) {
    // Next day (24h - 48h): Streak INCREASES by 1 Day!
    newCount = Math.max(1, current.count) + 1;
  } else {
    // Fresh streak restart
    newCount = 1;
  }

  const updated: StreakData = {
    count: newCount,
    lastDate: today,
    lastTimestamp: now,
    todayDone: true,
    longestStreak: Math.max(newCount, current.longestStreak || 1),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('auratype_streak_updated'));
  return updated;
}
