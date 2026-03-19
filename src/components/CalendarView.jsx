import { DAYS, MONTHS } from "../constants";
import { getMonthGrid, isWeekend, dateKey } from "../utils";

/**
 * CalendarView
 *
 * Renders the monthly calendar grid. Each day cell shows assigned shift(s)
 * colour-coded by staff member. Clicking a cell opens the shift modal.
 *
 * Props:
 *   year        – currently displayed year
 *   month       – currently displayed month (0-indexed)
 *   shifts      – the full shifts object keyed by YYYY-MM-DD
 *   staff       – array of { name, color }
 *   todayKey    – YYYY-MM-DD string for today (used to highlight current day)
 *   onPrevMonth – callback to go to previous month
 *   onNextMonth – callback to go to next month
 *   onDayClick  – callback(day: number) when a day cell is clicked
 */
export default function CalendarView({ year, month, shifts, staff, todayKey, onPrevMonth, onNextMonth, onDayClick, readonly = false }) {
  const grid = getMonthGrid(year, month);
  const getStaffColor = (name) => staff.find(s => s.name === name)?.color || "#aaa";

  return (
    <div style={{ padding: "24px 20px", maxWidth: 900, margin: "0 auto" }}>

      {/* Month navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <button className="nav-btn" onClick={onPrevMonth}>← Prev</button>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#f0e8d8" }}>
          {MONTHS[month]} {year}
        </div>
        <button className="nav-btn" onClick={onNextMonth}>Next →</button>
      </div>

      {/* Weekday header row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
        {DAYS.map(d => (
          <div key={d} style={{
            textAlign: "center", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 0",
            color: d === "Sat" || d === "Sun" ? "#a0622a" : "#9a8a7a",
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
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
                borderRadius: 8,
                padding: "8px 6px",
                minHeight: 80,
                cursor: readonly ? "default" : "pointer",
              }}
            >
              {/* Day number */}
              <div style={{
                fontSize: 12, fontWeight: isToday ? 700 : 400,
                color: we ? "#a0622a" : (isToday ? "#3a2e20" : "#9a8a7a"),
                marginBottom: 4, textAlign: "right",
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
                  {shift.p1?.staff && <ShiftBadge part={shift.p1} color={getStaffColor(shift.p1.staff)} mb={2} />}
                  {shift.p2?.staff && <ShiftBadge part={shift.p2} color={getStaffColor(shift.p2.staff)} />}
                </>
              )}

              {/* Empty placeholder — only shown to editors */}
              {!shift && !readonly && (
                <div style={{ fontSize: 9, color: "#c0b0a0", textAlign: "center", marginTop: 10, fontStyle: "italic" }}>
                  + add shift
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Staff colour legend */}
      {staff.length > 0 && (
        <div style={{ marginTop: 20, display: "flex", gap: 16, flexWrap: "wrap" }}>
          {staff.map(s => (
            <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
              <span style={{ fontSize: 12, color: "#8a7a6a" }}>{s.name}</span>
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
        background: color + "33",
        color,
        border: `1px solid ${color}55`,
        marginBottom: mb,
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 10 }}>{part.staff}</div>
      <div style={{ opacity: 0.8 }}>{part.start}–{part.end}</div>
    </div>
  );
}