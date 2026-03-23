import { useState, useEffect } from "react";

import { supabase } from "./supabase";
import { STAFF_COLORS, DEFAULT_WEEKDAY, DEFAULT_WEEKEND } from "./constants";
import { dateKey, isWeekend } from "./utils";
import { loadStaff, loadShifts, addStaffMember, removeStaffMember, saveShift, deleteShift } from "./storage";
import { globalCss, appShell, header } from "./styles";

import CalendarView from "./components/CalendarView";
import StaffView from "./components/StaffView";
import ShiftModal from "./components/ShiftModal";

export default function App() {
  const today    = new Date();
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  // ── Auth ───────────────────────────────────────────────────────────────
  // session === undefined means auth state not yet resolved (show nothing)
  // session === null means resolved but not logged in (show readonly)
  // session === object means logged in (show editable)
  const [session,      setSession]      = useState(undefined);
  const [showLogin,    setShowLogin]    = useState(false); // login dropdown in header
  const [authEmail,    setAuthEmail]    = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError,    setAuthError]    = useState("");
  const [authLoading,  setAuthLoading]  = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      if (session) setShowLogin(false); // close dropdown on successful login
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    if (error) setAuthError(error.message);
    setAuthLoading(false);
  };

  const handleLogout = () => {
    supabase.auth.signOut();
    setView("calendar"); // return to calendar on logout
  };

  const isEditor = !!session; // shorthand used throughout render

  // ── Calendar navigation ────────────────────────────────────────────────
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  // ── Core data ──────────────────────────────────────────────────────────
  const [staff,   setStaff]   = useState([]);
  const [shifts,  setShifts]  = useState({});
  const [loading, setLoading] = useState(true);

  // Load data on mount for everyone — no login required to view
  useEffect(() => {
    Promise.all([loadStaff(), loadShifts()]).then(([staff, shifts]) => {
      setStaff(staff);
      setShifts(shifts);
      setLoading(false);
    });
  }, []);

  // Reload data after login so any changes made elsewhere are fresh
  useEffect(() => {
    if (!session) return;
    Promise.all([loadStaff(), loadShifts()]).then(([staff, shifts]) => {
      setStaff(staff);
      setShifts(shifts);
    });
  }, [session]);

  // ── Staff actions (editors only) ───────────────────────────────────────
  const handleAddStaff = async (name) => {
    if (staff.find(s => s.name === name)) return;
    const color = STAFF_COLORS[staff.length % STAFF_COLORS.length];
    const created = await addStaffMember({ name, color });
    if (created) setStaff(prev => [...prev, created]);
  };

  const handleRemoveStaff = async (id) => {
    await removeStaffMember(id);
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  // ── Shift modal (editors only) ─────────────────────────────────────────
  const [modal, setModal] = useState(null);
  const [form,  setForm]  = useState({});

  const openModal = (day) => {
    const key = dateKey(year, month, day);
    const existing = shifts[key] || {};

    // Guests can only open the modal if a shift is actually scheduled
    if (!isEditor && !existing.p1?.staff) return;

    const def = isWeekend(year, month, day) ? DEFAULT_WEEKEND : DEFAULT_WEEKDAY;
    setForm({
      split:   !!existing.split,
      p1staff: existing.p1?.staff  || "",
      p1start: existing.p1?.start  || def.start,
      p1end:   existing.p1?.end    || (existing.split ? "12:30" : def.end),
      p2staff: existing.p2?.staff  || "",
      p2start: existing.p2?.start  || "12:30",
      p2end:   existing.p2?.end    || def.end,
    });
    setModal({ day, key });
  };

  const handleSaveShift = async () => {
    const shift = form.split
      ? { split: true,  p1: { staff: form.p1staff, start: form.p1start, end: form.p1end }, p2: { staff: form.p2staff, start: form.p2start, end: form.p2end } }
      : { split: false, p1: { staff: form.p1staff, start: form.p1start, end: form.p1end } };
    await saveShift(modal.key, shift);
    setShifts(prev => ({ ...prev, [modal.key]: shift }));
    setModal(null);
  };

  const handleClearShift = async () => {
    await deleteShift(modal.key);
    setShifts(prev => { const next = { ...prev }; delete next[modal.key]; return next; });
    setModal(null);
  };

  // ── Tab navigation ─────────────────────────────────────────────────────
  const [view, setView] = useState("calendar");

  // ── Spinner while auth resolves ────────────────────────────────────────
  if (session === undefined) {
    return (
      <div style={{ ...appShell, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{globalCss}</style>
        <div style={{ color: "#9a8a7a", fontStyle: "italic" }}>Loading…</div>
      </div>
    );
  }

  // ── Main app (everyone sees this) ──────────────────────────────────────
  return (
    <div style={appShell} onClick={() => showLogin && setShowLogin(false)}>
      <style>{globalCss}</style>

      {/* Header */}
      <div style={header}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, letterSpacing: "-0.01em", color: "#3a2e20" }}>
            Kafcházka
          </div>
          <div style={{ fontSize: 12, color: "#9a8a7a", marginTop: 2, fontStyle: "italic" }}>your café, organised</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Staff tab only visible to editors */}
          <button className={`tab-btn${view === "calendar" ? " active" : ""}`} onClick={() => setView("calendar")}>Calendar</button>
          {isEditor && (
            <button className={`tab-btn${view === "staff" ? " active" : ""}`} onClick={() => setView("staff")}>Staff</button>
          )}

          {/* Auth controls */}
          {isEditor ? (
            <button className="btn-ghost" onClick={handleLogout} style={{ fontSize: 12, padding: "6px 14px", marginLeft: 8 }}>
              Sign out
            </button>
          ) : (
            <div style={{ position: "relative", marginLeft: 8 }} onClick={e => e.stopPropagation()}>
              <button className="btn-ghost" onClick={() => { setShowLogin(v => !v); setAuthError(""); }} style={{ fontSize: 12, padding: "6px 14px" }}>
                Sign in
              </button>

              {/* Login dropdown */}
              {showLogin && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 8px)",
                  background: "#f5f0e8", border: "1px solid #c8b8a8",
                  borderRadius: 12, padding: 20, width: 280,
                  boxShadow: "0 12px 40px rgba(80,60,40,0.15)", zIndex: 200,
                }}>
                  <div style={{ fontSize: 13, color: "#7a6a5a", marginBottom: 14, fontStyle: "italic" }}>Sign in to edit shifts</div>
                  <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: 10 }}>
                      <span className="field-label">Email</span>
                      <input className="field-input" type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <span className="field-label">Password</span>
                      <input className="field-input" type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                    {authError && <div style={{ fontSize: 12, color: "#a04040", marginBottom: 10 }}>{authError}</div>}
                    <button className="btn-primary" type="submit" style={{ width: "100%" }} disabled={authLoading}>
                      {authLoading ? "Signing in…" : "Sign in"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Readonly banner for visitors */}
      {!isEditor && !loading && (
        <div style={{ background: "#f5f0e8", borderBottom: "1px solid #d8cfc4", padding: "8px 20px", textAlign: "center", fontSize: 12, color: "#9a8a7a", fontStyle: "italic" }}>
          Viewing as guest — sign in to edit shifts
        </div>
      )}

      {/* Main content */}
      {loading && (
        <div style={{ textAlign: "center", padding: 60, color: "#9a8a7a", fontStyle: "italic" }}>Loading…</div>
      )}

      {!loading && view === "calendar" && (
        <CalendarView
          year={year} month={month} shifts={shifts} staff={staff}
          todayKey={todayKey} onPrevMonth={prevMonth} onNextMonth={nextMonth}
          onDayClick={openModal}
          readonly={!isEditor}
        />
      )}
      {!loading && isEditor && view === "staff" && (
        <StaffView staff={staff} shifts={shifts} year={year} month={month} onAdd={handleAddStaff} onRemove={handleRemoveStaff} />
      )}

      {modal && (
        <ShiftModal
          modal={modal} year={year} month={month} staff={staff}
          form={form} setForm={setForm}
          onSave={handleSaveShift} onClear={handleClearShift} onClose={() => setModal(null)}
          readonly={!isEditor}
        />
      )}
    </div>
  );
}