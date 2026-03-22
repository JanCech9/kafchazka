/**
 * Returns an array representing the calendar grid for a given month.
 * Null entries are prepended so that day 1 falls on the correct weekday column (Mon=0).
 */
export function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Convert Sunday-based (0) to Monday-based (0) index
  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;

  const days = [];
  for (let i = 0; i < startDow; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
  return days;
}

/**
 * Returns true if the given date falls on a Saturday or Sunday.
 */
export function isWeekend(year, month, day) {
  const dow = new Date(year, month, day).getDay();
  return dow === 0 || dow === 6;
}

/**
 * Returns a YYYY-MM-DD string key for a given date, used to index the shifts object.
 */
export function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Returns a human-readable date string, e.g. "Monday, 3 March".
 */
export function formatDayLabel(year, month, day) {
  return new Date(year, month, day).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/**
 * Parses a "HH:MM" time string into total minutes since midnight.
 */
function timeToMinutes(time) {
  if (!time) return 0;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Returns the duration in hours between two "HH:MM" strings.
 * Returns 0 if end is before or equal to start.
 */
function shiftHours(start, end) {
  const diff = timeToMinutes(end) - timeToMinutes(start);
  return diff > 0 ? diff / 60 : 0;
}

/**
 * Calculates total hours worked per staff member for a given month.
 * Returns an object keyed by staff name, e.g. { "Anna": 42.5, "Tom": 38 }.
 *
 * @param {object} shifts  – the full shifts object keyed by YYYY-MM-DD
 * @param {number} year
 * @param {number} month   – 0-indexed
 */
export function calcMonthlyHours(shifts, year, month) {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
  const totals = {};

  Object.entries(shifts).forEach(([date, shift]) => {
    if (!date.startsWith(prefix)) return;

    // Part 1 is always present
    if (shift.p1?.staff && shift.p1.start && shift.p1.end) {
      totals[shift.p1.staff] = (totals[shift.p1.staff] || 0) + shiftHours(shift.p1.start, shift.p1.end);
    }

    // Part 2 only exists on split shifts
    if (shift.split && shift.p2?.staff && shift.p2.start && shift.p2.end) {
      totals[shift.p2.staff] = (totals[shift.p2.staff] || 0) + shiftHours(shift.p2.start, shift.p2.end);
    }
  });

  return totals;
}