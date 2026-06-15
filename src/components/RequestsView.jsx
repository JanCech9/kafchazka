import { formatDayLabel } from "../utils";

/**
 * RequestsView
 *
 * Admin:    pending queue with Accept / Reject, plus a history of decided requests.
 * Employee: their own requests with a status badge; pending ones can be cancelled.
 *
 * RLS already scopes `requests` per user (own rows for employees, all rows for admins),
 * so this component just renders whatever it's given.
 *
 * Props:
 *   requests  – array of shift_request rows
 *   isAdmin   – true for the admin queue, false for the employee's own list
 *   onAccept  – (request) => void   (admin)
 *   onReject  – (id) => void        (admin)
 *   onDelete  – (id) => void        (cancel / remove)
 */
export default function RequestsView({ requests, isAdmin, onAccept, onReject, onDelete }) {
  const pending = requests.filter(r => r.status === "pending");
  const decided = requests.filter(r => r.status !== "pending");

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#3a2e20", marginBottom: 4 }}>
        {isAdmin ? "Shift requests" : "My requests"}
      </div>
      <div style={{ fontSize: 12, color: "#9a8a7a", marginBottom: 24, fontStyle: "italic" }}>
        {isAdmin ? "Review what your team has asked to work" : "Days you've asked to work"}
      </div>

      {/* Pending */}
      <div style={{ fontSize: 11, color: "#8a7a6a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
        Pending
      </div>
      {pending.length === 0 && (
        <div style={{ color: "#b0a090", fontStyle: "italic", fontSize: 14, marginBottom: 24 }}>
          No pending requests.
        </div>
      )}
      {pending.map(r => (
        <RequestCard key={r.id} req={r}>
          {isAdmin ? (
            <>
              <button className="btn-primary" onClick={() => onAccept(r)} style={{ fontSize: 12, padding: "6px 14px" }}>Accept</button>
              <button className="btn-ghost"   onClick={() => onReject(r.id)} style={{ fontSize: 12, padding: "6px 14px" }}>Reject</button>
            </>
          ) : (
            <button className="btn-ghost" onClick={() => onDelete(r.id)} style={{ fontSize: 12, padding: "6px 14px" }}>Cancel</button>
          )}
        </RequestCard>
      ))}

      {/* Decided history */}
      {decided.length > 0 && (
        <>
          <div style={{ fontSize: 11, color: "#8a7a6a", textTransform: "uppercase", letterSpacing: "0.1em", margin: "24px 0 10px" }}>
            History
          </div>
          {decided.map(r => (
            <RequestCard key={r.id} req={r}>
              <StatusBadge status={r.status} />
              {isAdmin && (
                <button className="btn-ghost" onClick={() => onDelete(r.id)} style={{ fontSize: 12, padding: "6px 10px" }}>Remove</button>
              )}
            </RequestCard>
          ))}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// One request row
// ---------------------------------------------------------------------------
function RequestCard({ req, children }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e0d7c8", borderRadius: 10,
      padding: "12px 16px", marginBottom: 10,
      display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, color: "#3a2e20" }}>
          <strong>{req.staff_name}</strong>
        </div>
        <div style={{ fontSize: 12, color: "#7a6a5a", marginTop: 2 }}>
          {fmtDate(req.date)}
        </div>
        <div style={{ fontSize: 12, color: "#7a6a5a", marginTop: 2, fontVariantNumeric: "tabular-nums" }}>
          {req.start_time} – {req.end_time}{req.note ? ` · ${req.note}` : ""}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Accepted / rejected pill
// ---------------------------------------------------------------------------
function StatusBadge({ status }) {
  const accepted = status === "accepted";
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
      textTransform: "capitalize",
      color: accepted ? "#2e7d4a" : "#a04040",
      background: accepted ? "#e4f1e8" : "#f6e4e4",
    }}>
      {status}
    </span>
  );
}

// "YYYY-MM-DD" → "Monday, 3 March"
function fmtDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return formatDayLabel(y, m - 1, d);
}