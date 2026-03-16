import { STORAGE_KEYS } from "./constants";

/**
 * Loads both staff and shifts from persistent storage.
 * Returns { staff, shifts } — falls back to empty defaults if nothing is saved yet.
 */
export async function loadAll() {
  let staff = [];
  let shifts = {};

  try {
    const staffResult = await window.storage.get(STORAGE_KEYS.STAFF);
    if (staffResult) staff = JSON.parse(staffResult.value);
  } catch {}

  try {
    const shiftsResult = await window.storage.get(STORAGE_KEYS.SHIFTS);
    if (shiftsResult) shifts = JSON.parse(shiftsResult.value);
  } catch {}

  return { staff, shifts };
}

/**
 * Persists the staff array to storage.
 */
export async function saveStaff(staff) {
  try {
    await window.storage.set(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  } catch {}
}

/**
 * Persists the shifts object to storage.
 */
export async function saveShifts(shifts) {
  try {
    await window.storage.set(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
  } catch {}
}
