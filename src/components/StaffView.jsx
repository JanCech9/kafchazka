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
          <div key={s.id} className="staff-pill">
            <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }} />
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
    </div>
  );
}