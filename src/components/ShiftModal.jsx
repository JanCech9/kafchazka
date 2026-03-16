import { formatDayLabel, isWeekend } from "../utils";
import { DEFAULT_WEEKDAY, DEFAULT_WEEKEND } from "../constants";

/**
 * ShiftModal
 *
 * Props:
 *   modal      – { day, key } — the day being edited
 *   year       – current calendar year
 *   month      – current calendar month (0-indexed)
 *   staff      – array of { name, color }
 *   form       – controlled form state { split, p1staff, p1start, p1end, p2staff, p2start, p2end }
 *   setForm    – setter for form state
 *   onSave     – called when the user clicks Save
 *   onClear    – called when the user clicks Clear (removes shift)
 *   onClose    – called when the modal should close without saving
 */
export default function ShiftModal({ modal, year, month, staff, form, setForm, onSave, onClear, onClose }) {
  const we = isWeekend(year, month, modal.day);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">

        {/* Day heading */}
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 4 }}>
          {formatDayLabel(year, month, modal.day)}
        </div>
        <div style={{ fontSize: 11, color: "#7a6a5a", marginBottom: 20, fontStyle: "italic" }}>
          {we ? "Weekend shift" : "Weekday shift"}
        </div>

        {/* Split shift toggle */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
          padding: "12px 16px", background: "#1a1510", borderRadius: 10,
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
            <div style={{ fontSize: 13, color: "#d8c8a8" }}>Split shift</div>
            <div style={{ fontSize: 11, color: "#6a5a4a" }}>Two people cover the day</div>
          </div>
        </div>

        {/* Part 1 (or full shift when not split) */}
        <ShiftPart
          label={form.split ? "Part 1" : "Shift"}
          staffField="p1staff"
          startField="p1start"
          endField="p1end"
          staff={staff}
          form={form}
          setForm={setForm}
        />

        {/* Part 2 — only shown when split is on */}
        {form.split && (
          <div style={{
            marginTop: 12, padding: 14,
            background: "#1a1510", borderRadius: 10, border: "1px solid #3a2e20",
          }}>
            <ShiftPart
              label="Part 2"
              staffField="p2staff"
              startField="p2start"
              endField="p2end"
              staff={staff}
              form={form}
              setForm={setForm}
            />
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "space-between" }}>
          <button className="btn-danger" onClick={onClear}>Clear</button>
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
// Internal sub-component — one part of a shift (staff + time range)
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
          <input
            type="time"
            className="field-input"
            style={{ flex: 1 }}
            value={form[startField]}
            onChange={e => setForm(f => ({ ...f, [startField]: e.target.value }))}
          />
          <span className="time-sep">→</span>
          <input
            type="time"
            className="field-input"
            style={{ flex: 1 }}
            value={form[endField]}
            onChange={e => setForm(f => ({ ...f, [endField]: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );
}
