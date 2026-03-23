import { DAYS, MONTHS } from "../constants";
import { getMonthGrid, isWeekend, dateKey } from "../utils";

// Shortened day labels for narrow screens
const DAYS_SHORT = ["M", "T", "W", "T", "F", "S", "S"];

export default function CalendarView({ year, month, shifts, staff, todayKey, onPrevMonth, onNextMonth, onDayClick, readonly = false }) {
  const grid = getMonthGrid(year, month);
  const getStaffColor = (name) => staff.find(s => s.name === name)?.color || "#aaa";

  return (
    <div style={{ padding: "16px 10px", maxWidth: 900, margin: "0 auto", width: "100%" }}>

      {/* Month navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button className="nav-btn" onClick={onPrevMonth}>← Prev</button>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(16px, 4vw, 22px)", fontWeight: 700, color: "#3a2e20" }}>
          {MONTHS[month]} {year}
        </div>
        <button className="nav-btn" onClick={onNextMonth}>Next →</button>
      </div>

      {/* Weekday header row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "clamp(2px, 0.8vw, 6px)", marginBottom: "clamp(2px, 0.8vw, 6px)" }}>
        {DAYS.map((d, i) => (
          <div key={d + i} style={{
            textAlign: "center",
            fontSize: "clamp(8px, 2vw, 11px)",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            padding: "4px 0",
            color: d === "Sat" || d === "Sun" ? "#a0622a" : "#9a8a7a",
          }}>
            {/* Full label on wide screens, single letter on narrow */}
            <span className="day-label-full">{d}</span>
            <span className="day-label-short">{DAYS_SHORT[i]}</span>
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "clamp(2px, 0.8vw, 6px)" }}>
        {grid.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;

          const key = dateKey(year, month, day);
          const shift = shifts[key];
          const we = isWeekend(year, month, day);
          const isToday = key === todayKey;

          return (
            <div
              key={key}
              className={readonly ? undefined : "day-cell"}
              onClick={() => !readonly && onDayClick(day)}
              style={{
                background: isToday ? "#ddd5c5" : "#ede6da",
                border: isToday
                  ? "1.5px solid #a0622a"
                  : `1px solid ${we ? "#c8b8a0" : "#d8cfc4"}`,
                borderRadius: "clamp(4px, 1.5vw, 8px)",
                padding: "clamp(3px, 1.2vw, 8px) clamp(2px, 1vw, 6px)",
                minHeight: "clamp(48px, 12vw, 90px)",
                cursor: readonly ? "default" : "pointer",
                overflow: "hidden",
              }}
            >
              {/* Day number */}
              <div style={{
                fontSize: "clamp(9px, 2.5vw, 13px)",
                fontWeight: isToday ? 700 : 400,
                color: we ? "#a0622a" : (isToday ? "#3a2e20" : "#9a8a7a"),
                marginBottom: 2,
                textAlign: "right",
                lineHeight: 1,
              }}>
                {day}
              </div>

              {/* Full shift (not split) */}
              {shift && !shift.split && shift.p1?.staff && (
                <ShiftBadge part={shift.p1} color={getStaffColor(shift.p1.staff)} />
              )}

              {/* Split shift — two badges */}
              {shift && shift.split && (
                <>
                  {shift.p1?.staff && <ShiftBadge part={shift.p1} color={getStaffColor(shift.p1.staff)} mb={1} />}
                  {shift.p2?.staff && <ShiftBadge part={shift.p2} color={getStaffColor(shift.p2.staff)} />}
                </>
              )}

              {/* Empty placeholder — only shown to editors */}
              {!shift && !readonly && (
                <div style={{ fontSize: "clamp(7px, 1.8vw, 9px)", color: "#c0b0a0", textAlign: "center", marginTop: 6, fontStyle: "italic" }}>
                  +
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Staff colour legend */}
      {staff.length > 0 && (
        <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
          {staff.map(s => (
            <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 9, height: 9, borderRadius: 2, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: "clamp(10px, 2.5vw, 12px)", color: "#8a7a6a" }}>{s.name}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal sub-component — a single coloured shift badge inside a day cell
// ---------------------------------------------------------------------------
function ShiftBadge({ part, color, mb = 0 }) {
  return (
    <div
      className="shift-badge"
      style={{
        background: color + "44",
        color,
        border: `1px solid ${color}99`,
        marginBottom: mb,
        fontSize: "clamp(7px, 1.8vw, 10px)",
        padding: "1px 3px",
        borderRadius: 3,
      }}
    >
      <div style={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>{part.staff}</div>
      <div style={{ opacity: 0.9 }}>{part.start}–{part.end}</div>
    </div>
  );
}