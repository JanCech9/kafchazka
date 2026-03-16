import { useState } from "react";

/**
 * StaffView
 *
 * Renders the staff management tab: add new staff members, see existing ones,
 * and remove them individually.
 *
 * Props:
 *   staff      – array of { name, color }
 *   onAdd      – callback(name: string) to add a new staff member
 *   onRemove   – callback(name: string) to remove a staff member
 */
export default function StaffView({ staff, onAdd, onRemove }) {
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    onAdd(name);
    setNewName("");
  };

  return (
    <div style={{ padding: "32px 28px", maxWidth: 500, margin: "0 auto" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 20, color: "#f0e8d8" }}>
        Staff Members
      </div>

      {/* Add staff input */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
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

      {/* Empty state */}
      {staff.length === 0 && (
        <div style={{ color: "#5a4a3a", fontStyle: "italic", fontSize: 14 }}>
          No staff yet. Add your first team member above.
        </div>
      )}

      {/* Staff list */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {staff.map(s => (
          <div key={s.name} className="staff-pill">
            <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 14, color: "#d8c8a8" }}>{s.name}</span>
            <button
              onClick={() => onRemove(s.name)}
              style={{ background: "none", border: "none", color: "#6a5a4a", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 0 0 4px" }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
