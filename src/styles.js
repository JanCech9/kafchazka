/**
 * Global CSS injected via a <style> tag in App.jsx.
 * Defines reusable class names used throughout the component tree.
 */
export const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Playfair+Display:wght@700;900&display=swap');

  * { box-sizing: border-box; }

  html, body { overflow-x: hidden; }

  @media (max-width: 480px) {
    .nav-btn { padding: 5px 10px; font-size: 12px; }
    .tab-btn { padding: 10px 12px; font-size: 13px; }
    .modal-box { padding: 20px 16px; border-radius: 12px; }
    .field-input { font-size: 16px; } /* prevents iOS auto-zoom on focus */
    .btn-primary, .btn-ghost, .btn-danger { padding: 10px 14px; font-size: 13px; }
    .day-label-full { display: none; }
    .day-label-short { display: inline; }
  }

  @media (min-width: 481px) {
    .day-label-full { display: inline; }
    .day-label-short { display: none; }
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #d8cfc4; }
  ::-webkit-scrollbar-thumb { background: #b0a090; border-radius: 3px; }

  .day-cell { transition: background 0.15s, transform 0.1s; cursor: pointer; }
  .day-cell:hover { background: #ddd5c8 !important; transform: scale(1.02); }

  .nav-btn {
    background: none; border: 1px solid #b0a090; color: #6a5a4a;
    border-radius: 6px; padding: 6px 14px; cursor: pointer;
    font-family: inherit; font-size: 14px; transition: all 0.15s;
  }
  .nav-btn:hover { background: #d8cfc4; color: #3a2e20; }

  .tab-btn {
    background: none; border: none; color: #9a8a7a;
    padding: 10px 20px; cursor: pointer;
    font-family: 'Lora', serif; font-size: 15px;
    border-bottom: 2px solid transparent; transition: all 0.2s;
  }
  .tab-btn.active { color: #3a2e20; border-bottom-color: #a0622a; }

  .staff-pill {
    display: flex; align-items: center; gap: 8px;
    background: #ddd5c8; border-radius: 20px;
    padding: 6px 12px 6px 8px; margin: 4px;
  }

  .shift-badge {
    border-radius: 4px; padding: 2px 5px;
    font-size: 10px; line-height: 1.3;
    font-family: 'Lora', serif;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(80,60,40,0.35);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; backdrop-filter: blur(3px);
  }
  .modal-box {
    background: #f5f0e8; border: 1px solid #c8b8a8;
    border-radius: 16px; padding: 28px;
    width: 380px; max-width: 95vw;
    box-shadow: 0 20px 60px rgba(80,60,40,0.18);
  }

  .field-label {
    font-size: 12px; color: #9a8a7a;
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: 4px; display: block;
  }
  .field-input {
    width: 100%; background: #ede6da;
    border: 1px solid #c8b8a8; border-radius: 8px;
    color: #3a2e20; padding: 8px 12px;
    font-family: 'Lora', serif; font-size: 14px;
    outline: none; transition: border 0.15s;
  }
  .field-input:focus { border-color: #a0622a; }
  select.field-input option { background: #f5f0e8; }

  .btn-primary {
    background: #a0622a; color: #f5f0e8; border: none;
    border-radius: 8px; padding: 10px 22px;
    font-family: 'Lora', serif; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: background 0.15s;
  }
  .btn-primary:hover { background: #b87030; }

  .btn-ghost {
    background: none; border: 1px solid #c8b8a8; color: #7a6a5a;
    border-radius: 8px; padding: 10px 22px;
    font-family: 'Lora', serif; font-size: 14px;
    cursor: pointer; transition: all 0.15s;
  }
  .btn-ghost:hover { border-color: #9a8a7a; color: #3a2e20; }

  .btn-danger {
    background: none; border: 1px solid #c87878; color: #a04040;
    border-radius: 8px; padding: 10px 16px;
    font-family: 'Lora', serif; font-size: 13px;
    cursor: pointer; transition: all 0.15s;
  }
  .btn-danger:hover { background: #f5e8e8; }

  .toggle-switch { position: relative; width: 42px; height: 24px; }
  .toggle-switch input { opacity: 0; width: 0; height: 0; }
  .toggle-slider {
    position: absolute; inset: 0; background: #c8b8a8;
    border-radius: 24px; cursor: pointer; transition: 0.2s;
  }
  .toggle-slider:before {
    content: ''; position: absolute;
    width: 18px; height: 18px; left: 3px; top: 3px;
    background: #f5f0e8; border-radius: 50%; transition: 0.2s;
  }
  input:checked + .toggle-slider { background: #a0622a; }
  input:checked + .toggle-slider:before { transform: translateX(18px); background: #f5f0e8; }

  .time-row { display: flex; gap: 8px; align-items: center; }
  .time-sep { color: #b0a090; font-size: 18px; }
`;

// ---------------------------------------------------------------------------
// Reusable inline style objects (for dynamic or repeated patterns)
// ---------------------------------------------------------------------------

export const appShell = {
  minHeight: "100vh",
  background: "#E9E1D3",
  fontFamily: "'Lora', Georgia, serif",
  color: "#3a2e20",
};

export const header = {
  background: "#f5f0e8",
  borderBottom: "1px solid #d8cfc4",
  padding: "14px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "8px",
};

export const sectionPadding = {
  padding: "24px 20px",
  maxWidth: 900,
  margin: "0 auto",
};