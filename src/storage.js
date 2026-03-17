import { STORAGE_KEYS } from "./constants";

export async function loadAll() {
  let staff = [];
  let shifts = {};
  try { staff = JSON.parse(localStorage.getItem(STORAGE_KEYS.STAFF) || "[]"); } catch {}
  try { shifts = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHIFTS) || "{}"); } catch {}
  return { staff, shifts };
}

export async function saveStaff(staff) {
  localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
}

export async function saveShifts(shifts) {
  localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
}