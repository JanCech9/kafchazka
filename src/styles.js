/**
 * Global CSS injected via a <style> tag in App.jsx.
 * Defines reusable class names used throughout the component tree.
 */
export const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Playfair+Display:wght@700;900&display=swap');

  * { box-sizing: border-box; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #2a2018; }
  ::-webkit-scrollbar-thumb { background: #5a4a3a; border-radius: 3px; }

  .day-cell { transition: background 0.15s, transform 0.1s; cursor: pointer; }
  .day-cell:hover { background: #2e2518 !important; transform: scale(1.02); }

  .nav-btn {
    background: none; border: 1px solid #5a4a3a; color: #c8b898;
    border-radius: 6px; padding: 6px 14px; cursor: pointer;
    font-family: inherit; font-size: 14px; transition: all 0.15s;
  }
  .nav-btn:hover { background: #3a2e20; color: #f0e8d8; }

  .tab-btn {
    background: none; border: none; color: #8a7a6a;
    padding: 10px 20px; cursor: pointer;
    font-family: 'Lora', serif; font-size: 15px;
    border-bottom: 2px solid transparent; transition: all 0.2s;
  }
  .tab-btn.active { color: #f0e8d8; border-bottom-color: #c8a060; }

  .staff-pill {
    display: flex; align-items: center; gap: 8px;
    background: #2a2018; border-radius: 20px;
    padding: 6px 12px 6px 8px; margin: 4px;
  }

  .shift-badge {
    border-radius: 4px; padding: 2px 5px;
    font-size: 10px; line-height: 1.3;
    font-family: 'Lora', serif;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; backdrop-filter: blur(3px);
  }
  .modal-box {
    background: #231d14; border: 1px solid #5a4a3a;
    border-radius: 16px; padding: 28px;
    width: 380px; max-width: 95vw;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }

  .field-label {
    font-size: 12px; color: #8a7a6a;
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: 4px; display: block;
  }
  .field-input {
    width: 100%; background: #1a1510;
    border: 1px solid #4a3a2a; border-radius: 8px;
    color: #f0e8d8; padding: 8px 12px;
    font-family: 'Lora', serif; font-size: 14px;
    outline: none; transition: border 0.15s;
  }
  .field-input:focus { border-color: #c8a060; }
  select.field-input option { background: #231d14; }

  .btn-primary {
    background: #c8a060; color: #1a1510; border: none;
    border-radius: 8px; padding: 10px 22px;
    font-family: 'Lora', serif; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: background 0.15s;
  }
  .btn-primary:hover { background: #e0b870; }

  .btn-ghost {
    background: none; border: 1px solid #4a3a2a; color: #8a7a6a;
    border-radius: 8px; padding: 10px 22px;
    font-family: 'Lora', serif; font-size: 14px;
    cursor: pointer; transition: all 0.15s;
  }
  .btn-ghost:hover { border-color: #8a7a6a; color: #c8b898; }

  .btn-danger {
    background: none; border: 1px solid #8a3a3a; color: #c87070;
    border-radius: 8px; padding: 10px 16px;
    font-family: 'Lora', serif; font-size: 13px;
    cursor: pointer; transition: all 0.15s;
  }
  .btn-danger:hover { background: #3a1a1a; }

  .toggle-switch { position: relative; width: 42px; height: 24px; }
  .toggle-switch input { opacity: 0; width: 0; height: 0; }
  .toggle-slider {
    position: absolute; inset: 0; background: #3a2e20;
    border-radius: 24px; cursor: pointer; transition: 0.2s;
  }
  .toggle-slider:before {
    content: ''; position: absolute;
    width: 18px; height: 18px; left: 3px; top: 3px;
    background: #8a7a6a; border-radius: 50%; transition: 0.2s;
  }
  input:checked + .toggle-slider { background: #c8a060; }
  input:checked + .toggle-slider:before { transform: translateX(18px); background: #1a1510; }

  .time-row { display: flex; gap: 8px; align-items: center; }
  .time-sep { color: #5a4a3a; font-size: 18px; }
`;

// ---------------------------------------------------------------------------
// Reusable inline style objects (for dynamic or repeated patterns)
// ---------------------------------------------------------------------------

export const appShell = {
  minHeight: "100vh",
  background: "#1a1510",
  fontFamily: "'Lora', Georgia, serif",
  color: "#f0e8d8",
};

export const header = {
  background: "#231d14",
  borderBottom: "1px solid #3a2e20",
  padding: "18px 28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export const sectionPadding = {
  padding: "24px 20px",
  maxWidth: 900,
  margin: "0 auto",
};
