import { supabase } from "./supabase";

// ---------------------------------------------------------------------------
// Staff
// ---------------------------------------------------------------------------

/**
 * Fetches all staff rows from Supabase, ordered by insertion time.
 * Returns an array of { id, name, color }.
 */
export async function loadStaff() {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) { console.error("loadStaff:", error.message); return []; }
  return data;
}

/**
 * Inserts a new staff member.
 * Returns the created row, or null on failure.
 */
export async function addStaffMember({ name, color }) {
  const { data, error } = await supabase
    .from("staff")
    .insert({ name, color })
    .select()
    .single();

  if (error) { console.error("addStaffMember:", error.message); return null; }
  return data;
}

/**
 * Deletes a staff member by their id.
 */
export async function removeStaffMember(id) {
  const { error } = await supabase
    .from("staff")
    .delete()
    .eq("id", id);

  if (error) console.error("removeStaffMember:", error.message);
}

// ---------------------------------------------------------------------------
// Shifts
// ---------------------------------------------------------------------------

/**
 * Fetches all shifts and returns them as a flat object keyed by date string
 * (YYYY-MM-DD), matching the shape the rest of the app already uses.
 *
 * Database row shape:
 *   { id, date, split, p1_staff, p1_start, p1_end, p2_staff, p2_start, p2_end }
 *
 * App object shape:
 *   { split, p1: { staff, start, end }, p2: { staff, start, end } }
 */
export async function loadShifts() {
  const { data, error } = await supabase
    .from("shifts")
    .select("*");

  if (error) { console.error("loadShifts:", error.message); return {}; }

  // Convert the flat DB rows into the nested shape the app expects
  return Object.fromEntries(
    data.map(row => [
      row.date,
      {
        split: row.split,
        p1: { staff: row.p1_staff, start: row.p1_start, end: row.p1_end },
        p2: { staff: row.p2_staff, start: row.p2_start, end: row.p2_end },
      }
    ])
  );
}

/**
 * Upserts a shift for a given date (inserts if new, updates if exists).
 * Accepts the same nested shape the app uses internally.
 */
export async function saveShift(date, shift) {
  const row = {
    date,
    split: shift.split,
    p1_staff: shift.p1?.staff  || null,
    p1_start: shift.p1?.start  || null,
    p1_end:   shift.p1?.end    || null,
    p2_staff: shift.split ? (shift.p2?.staff  || null) : null,
    p2_start: shift.split ? (shift.p2?.start  || null) : null,
    p2_end:   shift.split ? (shift.p2?.end    || null) : null,
  };

  const { error } = await supabase
    .from("shifts")
    .upsert(row, { onConflict: "date" });

  if (error) console.error("saveShift:", error.message);
}

/**
 * Deletes the shift for a given date.
 */
export async function deleteShift(date) {
  const { error } = await supabase
    .from("shifts")
    .delete()
    .eq("date", date);

  if (error) console.error("deleteShift:", error.message);
}

/**
 * Returns { id, role, staff_id } where:
 * - id: the user's unique ID (matches the auth user ID)
 * - role: 'employee' or 'admin'
 * - staff_id: the linked staff member's ID, or null if not linked
   (employees must be linked to a staff member to create shift requests)
  *
  * Note: this function assumes the user is already authenticated. If not signed in, it returns null.
  *  */
export async function getMyProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles').select('id, role, staff_id').eq('id', user.id).single();
  if (error) throw error;
  return data;                                   

}

export async function loadShiftRequests() {
  const { data, error } = await supabase
    .from('shift_requests').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return data;        // RLS returns own rows for employees, all rows for admins
}

export async function createShiftRequest({ staffName, date, startTime, endTime, note }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  const { data, error } = await supabase.from('shift_requests').insert({
    employee_id: user.id, staff_name: staffName, date,
    start_time: startTime, end_time: endTime, note: note ?? null, status: 'pending',
  }).select().single();
  if (error) throw error;
  return data;
}

export async function setRequestStatus(id, status) {        // 'accepted' | 'rejected'
  const { error } = await supabase.from('shift_requests').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteShiftRequest(id) {
  const { error } = await supabase.from('shift_requests').delete().eq('id', id);
  if (error) throw error;
}