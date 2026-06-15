import { formatDayLabel, isWeekend, getStaffColor } from "../utils";

/**
 * ShiftModal
 *
 * Props:
 *   modal        – { day, key } — the day being viewed/edited
 *   year, month  – current calendar position (month is 0-indexed)
 *   staff        – array of { id, name, color }
 *   form         – controlled form state
 *   setForm      – setter for form state
 *   mode         – "guest" (readonly) | "employee" (request) | "admin" (full editor)
 *   myStaffName  – the employee's linked staff name (employee mode only)
 *   notice       – optional warning string shown above the editor (admin mode, accept flow)
 *   onSave       – save the shift (admin)
 *   onClear      – clear the shift (admin)
 *   onRequest    – submit a shift request (employee)
 *   onClose      – close the modal
 */
export default function ShiftModal({
  modal, year, month, staff, form, setForm,
  mode = "guest", myStaffName = "", notice = null,
  onSave, onClear, onRequest, onClose,
}) {
  const we = isWeekend(year, month, modal.day);

  // ── Guest view (readonly) ──────────────────────────────────────────────
  if (mode === "guest") {
    const hasShift = form.p1staff;
    return (
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-box">

          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 4, color: "#3a2e20" }}>
            {formatDayLabel(year, month, modal.day)}
          </div>
          <div style={{ fontSize: 11, color: "#9a8a7a", marginBottom: 20, fontStyle: "italic" }}>
            {we ? "Weekend shift" : "Weekday shift"}
          </div>

          {!hasShift && (
            <div style={{ color: "#b0a090", fontStyle: "italic", fontSize: 14, marginBottom: 20 }}>
              No shift scheduled.
            </div>
          )}

          {hasShift && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              <ShiftDetailCard
                label={form.split ? "Part 1" : "Shift"}
                name={form.p1staff} start={form.p1start} end={form.p1end}
                color={getStaffColor(staff, form.p1staff)}
              />
              {form.split && form.p2staff && (
                <ShiftDetailCard
                  label="Part 2"
                  name={form.p2staff} start={form.p2start} end={form.p2end}
                  color={getStaffColor(staff, form.p2staff)}
                />
              )}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-ghost" onClick={onClose}>Close</button>
          </div>

        </div>
      </div>
    );
  }

  // ── Employee view (request a shift) ────────────────────────────────────
  if (mode === "employee") {
    const hasShift = form.p1staff;
    const canRequest = !!myStaffName;
    return (
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-box">

          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 4, color: "#3a2e20" }}>
            {formatDayLabel(year, month, modal.day)}
          </div>
          <div style={{ fontSize: 11, color: "#9a8a7a", marginBottom: 20, fontStyle: "italic" }}>
            {we ? "Weekend shift" : "Weekday shift"}
          </div>

          {/* Show what's already scheduled so the employee knows if the day is taken */}
          {hasShift && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: "#9a8a7a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Already scheduled
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <ShiftDetailCard
                  label={form.split ? "Part 1" : "Shift"}
                  name={form.p1staff} start={form.p1start} end={form.p1end}
                  color={getStaffColor(staff, form.p1staff)}
                />
                {form.split && form.p2staff && (
                  <ShiftDetailCard
                    label="Part 2"
                    name={form.p2staff} start={form.p2start} end={form.p2end}
                    color={getStaffColor(staff, form.p2staff)}
                  />
                )}
              </div>
            </div>
          )}

          {!canRequest ? (
            <div style={{ color: "#a04040", fontSize: 13, lineHeight: 1.5, marginBottom: 20 }}>
              Your account isn't linked to a staff member yet. Ask an admin to link it before requesting shifts.
            </div>
          ) : (
            <div style={{ padding: 14, background: "#ede6da", borderRadius: 10, border: "1px solid #d8cfc4", marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#8a7a6a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
                Request as {myStaffName}
              </div>
              <div style={{ marginBottom: 10 }}>
                <span className="field-label">Hours</span>
                <div className="time-row">
                  <input type="time" className="field-input" style={{ flex: 1 }} value={form.reqStart} onChange={e => setForm(f => ({ ...f, reqStart: e.target.value }))} />
                  <span className="time-sep">→</span>
                  <input type="time" className="field-input" style={{ flex: 1 }} value={form.reqEnd} onChange={e => setForm(f => ({ ...f, reqEnd: e.target.value }))} />
                </div>
              </div>
              <div>
                <span className="field-label">Note (optional)</span>
                <textarea
                  className="field-input"
                  rows={2}
                  style={{ resize: "vertical", fontFamily: "inherit" }}
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  placeholder="Anything the manager should know…"
                />
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn-ghost" onClick={onClose}>Close</button>
            {canRequest && <button className="btn-primary" onClick={onRequest}>Request shift</button>}
          </div>

        </div>
      </div>
    );
  }

  // ── Admin view (full editor) ───────────────────────────────────────────
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">

        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 4, color: "#3a2e20" }}>
          {formatDayLabel(year, month, modal.day)}
        </div>
        <div style={{ fontSize: 11, color: "#9a8a7a", marginBottom: 20, fontStyle: "italic" }}>
          {we ? "Weekend shift" : "Weekday shift"}
        </div>

        {/* Warning shown when accepting a request onto a day that already has a shift */}
        {notice && (
          <div style={{ background: "#fbe6d8", border: "1px solid #e0b890", color: "#8a5a20", borderRadius: 8, padding: "8px 12px", fontSize: 12, marginBottom: 16, lineHeight: 1.4 }}>
            {notice}
          </div>
        )}

        {/* Split shift toggle */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
          padding: "12px 16px", background: "#ede6da", borderRadius: 10,
        }}>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={form.split}
              onChange={e => setForm(f => ({ ...f, split: e.target.checked }))}
            />
            <span className="toggle-slider" />
          </label>
          <div>
            <div style={{ fontSize: 13, color: "#3a2e20" }}>Split shift</div>
            <div style={{ fontSize: 11, color: "#9a8a7a" }}>Two people cover the day</div>
          </div>
        </div>

        {/* Part 1 */}
        <ShiftPart
          label={form.split ? "Part 1" : "Shift"}
          staffField="p1staff" startField="p1start" endField="p1end"
          staff={staff} form={form} setForm={setForm}
        />

        {/* Part 2 — only shown when split is on */}
        {form.split && (
          <div style={{ marginTop: 12, padding: 14, background: "#ede6da", borderRadius: 10, border: "1px solid #d8cfc4" }}>
            <ShiftPart
              label="Part 2"
              staffField="p2staff" startField="p2start" endField="p2end"
              staff={staff} form={form} setForm={setForm}
            />
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "space-between" }}>
          <button
            className="btn-danger"
            onClick={() => {
              if (window.confirm("Remove this shift? This cannot be undone.")) onClear();
            }}
          >
            Clear
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={onSave}>Save Shift</button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Readonly detail card — shows one shift part as a styled info block
// ---------------------------------------------------------------------------
function ShiftDetailCard({ label, name, start, end, color }) {
  return (
    <div style={{
      background: color + "18",
      border: `1px solid ${color}55`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 8,
      padding: "12px 14px",
    }}>
      <div style={{ fontSize: 10, color: "#9a8a7a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color }}>{name}</div>
        <div style={{ fontSize: 13, color: "#5a4a3a", fontVariantNumeric: "tabular-nums" }}>{start} – {end}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editor sub-component — one editable part of a shift
// ---------------------------------------------------------------------------
function ShiftPart({ label, staffField, startField, endField, staff, form, setForm }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 11, color: "#8a7a6a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ marginBottom: 10 }}>
        <span className="field-label">Staff</span>
        <select
          className="field-input"
          value={form[staffField]}
          onChange={e => setForm(f => ({ ...f, [staffField]: e.target.value }))}
        >
          <option value="">— unassigned —</option>
          {staff.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <span className="field-label">Hours</span>
        <div className="time-row">
          <input type="time" className="field-input" style={{ flex: 1 }} value={form[startField]} onChange={e => setForm(f => ({ ...f, [startField]: e.target.value }))} />
          <span className="time-sep">→</span>
          <input type="time" className="field-input" style={{ flex: 1 }} value={form[endField]} onChange={e => setForm(f => ({ ...f, [endField]: e.target.value }))} />
        </div>
      </div>
    </div>
  );
}