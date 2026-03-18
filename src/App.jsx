import { useState, useEffect } from "react";

import { STAFF_COLORS, DEFAULT_WEEKDAY, DEFAULT_WEEKEND } from "./constants";
import { dateKey, isWeekend } from "./utils";
import { loadAll, saveStaff, saveShifts } from "./storage";
import { globalCss, appShell, header } from "./styles";

import CalendarView from "./components/CalendarView";
import StaffView from "./components/StaffView";
import ShiftModal from "./components/ShiftModal";

export default function App() {
  const today = new Date();

  // ── Calendar navigation ────────────────────────────────────────────────
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  // ── Core data ──────────────────────────────────────────────────────────
  const [staff,  setStaffState]  = useState([]);
  const [shifts, setShiftsState] = useState({});

  // Load persisted data on mount
  useEffect(() => {
    loadAll().then(({ staff, shifts }) => {
      setStaffState(staff);
      setShiftsState(shifts);
    });
  }, []);

  // Helpers that update state AND persist in one step
  const updateStaff = (updated) => { setStaffState(updated); saveStaff(updated); };
  const updateShifts = (updated) => { setShiftsState(updated); saveShifts(updated); };

  // ── Staff actions ──────────────────────────────────────────────────────
  const handleAddStaff = (name) => {
    if (staff.find(s => s.name === name)) return; // no duplicates
    const color = STAFF_COLORS[staff.length % STAFF_COLORS.length];
    updateStaff([...staff, { name, color }]);
  };

  const handleRemoveStaff = (name) => updateStaff(staff.filter(s => s.name !== name));

  // ── Shift modal ────────────────────────────────────────────────────────
  const [modal, setModal] = useState(null); // { day, key } | null
  const [form,  setForm]  = useState({});

  const openModal = (day) => {
    const key = dateKey(year, month, day);
    const existing = shifts[key] || {};
    const we  = isWeekend(year, month, day);
    const def = we ? DEFAULT_WEEKEND : DEFAULT_WEEKDAY;

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

  const handleSaveShift = () => {
    const updated = { ...shifts };

    if (form.split) {
      updated[modal.key] = {
        split: true,
        p1: { staff: form.p1staff, start: form.p1start, end: form.p1end },
        p2: { staff: form.p2staff, start: form.p2start, end: form.p2end },
      };
    } else {
      updated[modal.key] = {
        split: false,
        p1: { staff: form.p1staff, start: form.p1start, end: form.p1end },
      };
    }

    updateShifts(updated);
    setModal(null);
  };

  const handleClearShift = () => {
    const updated = { ...shifts };
    delete updated[modal.key];
    updateShifts(updated);
    setModal(null);
  };

  // ── Tab navigation ─────────────────────────────────────────────────────
  const [view, setView] = useState("calendar"); // "calendar" | "staff"

  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div style={appShell}>
      <style>{globalCss}</style>

      {/* Top header */}
      <div style={header}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, letterSpacing: "-0.01em", color: "" }}>
            Kafcházka shift planner
          </div>
          <div style={{ fontSize: 12, color: "#7a6a5a", marginTop: 2, fontStyle: "italic" }}>
            your café, organised
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex" }}>
          <button className={`tab-btn${view === "calendar" ? " active" : ""}`} onClick={() => setView("calendar")}>Calendar</button>
          <button className={`tab-btn${view === "staff"    ? " active" : ""}`} onClick={() => setView("staff")}>Staff</button>
        </div>
      </div>

      {/* Main content */}
      {view === "calendar" && (
        <CalendarView
          year={year}
          month={month}
          shifts={shifts}
          staff={staff}
          todayKey={todayKey}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onDayClick={openModal}
        />
      )}

      {view === "staff" && (
        <StaffView
          staff={staff}
          onAdd={handleAddStaff}
          onRemove={handleRemoveStaff}
        />
      )}

      {/* Shift modal — rendered on top of everything when a day is clicked */}
      {modal && (
        <ShiftModal
          modal={modal}
          year={year}
          month={month}
          staff={staff}
          form={form}
          setForm={setForm}
          onSave={handleSaveShift}
          onClear={handleClearShift}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
