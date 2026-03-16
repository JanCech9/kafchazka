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
