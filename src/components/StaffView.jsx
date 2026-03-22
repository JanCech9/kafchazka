import { useState } from "react";
import { MONTHS } from "../constants";
import { calcMonthlyHours } from "../utils";

/**
 * StaffView
 *
 * Renders the staff management tab: add new staff members, see existing ones,
 * remove them, and view total hours worked in the currently viewed month.
 *
 * Props:
 *   staff      – array of { id, name, color }
 *   shifts     – full shifts object keyed by YYYY-MM-DD
 *   year       – currently viewed year (for hours calculation)
 *   month      – currently viewed month 0-indexed (for hours calculation)
 *   onAdd      – callback(name: string) to add a new staff member
 *   onRemove   – callback(id: string) to remove a staff member
 */
export default function StaffView({ staff, shifts, year, month, onAdd, onRemove }) {
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    onAdd(name);
    setNewName("");
  };

  // Hours keyed by staff name for the current month
  const monthlyHours = calcMonthlyHours(shifts, year, month);

  // Format decimal hours as "Xh Ym", e.g. 8.5 → "8h 30m"
  const formatHours = (h) => {
    const hours = Math.floor(h);
    const mins  = Math.round((h - hours) * 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div style={{ padding: "28px 16px", maxWidth: 500, margin: "0 auto" }}>

      {/* Section: Add staff */}
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 16, color: "#3a2e20" }}>
        Staff Members
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
        <input
          className="field-input"
          placeholder="Add a new staff member…"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
        />
        <button className="btn-primary" onClick={handleAdd} style={{ whiteSpace: "nowrap" }}>
          Add
        </button>
      </div>

      {staff.length === 0 && (
        <div style={{ color: "#9a8a7a", fontStyle: "italic", fontSize: 14 }}>
          No staff yet. Add your first team member above.
        </div>
      )}

      {/* Section: Hours this month */}
      {staff.length > 0 && (
        <>
          <div style={{
            fontSize: 11, color: "#9a8a7a", textTransform: "uppercase",
            letterSpacing: "0.1em", marginBottom: 12,
          }}>
            Hours in {MONTHS[month]} {year}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
            {staff.map(s => {
              const hours = monthlyHours[s.name] || 0;
              const pct   = Math.min(hours / 200 * 100, 100); // 200h as a visual max

              return (
                <div key={s.id} style={{
                  background: "#f5f0e8",
                  border: "1px solid #d8cfc4",
                  borderRadius: 10,
                  padding: "12px 14px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: "#3a2e20", fontWeight: 600 }}>{s.name}</span>
                    </div>
                    <span style={{ fontSize: 13, color: hours > 0 ? "#3a2e20" : "#b0a090", fontVariantNumeric: "tabular-nums" }}>
                      {hours > 0 ? formatHours(hours) : "—"}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: 4, background: "#e8e0d4", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: s.color,
                      borderRadius: 2,
                      transition: "width 0.4s ease",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Remove staff section */}
          <div style={{
            fontSize: 11, color: "#9a8a7a", textTransform: "uppercase",
            letterSpacing: "0.1em", marginBottom: 12,
          }}>
            Remove
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {staff.map(s => (
              <div key={s.id} className="staff-pill">
                <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: "#3a2e20" }}>{s.name}</span>
                <button
                  onClick={() => onRemove(s.id)}
                  style={{ background: "none", border: "none", color: "#9a8a7a", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 0 0 4px" }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}