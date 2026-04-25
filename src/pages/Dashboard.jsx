import { useState, useEffect, useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; }
body {
  font-family: 'Inter', sans-serif;
  background: #f0f2f5;
  color: #111827;
  font-size: 14px;
  line-height: 1.5;
}

:root {
  --blue: #2563eb;
  --blue-lt: #dbeafe;
  --blue-dk: #1d4ed8;
  --green: #16a34a;
  --green-lt: #dcfce7;
  --red: #dc2626;
  --red-lt: #fee2e2;
  --orange: #f97316;
  --orange-lt: #fff7ed;
  --purple: #7c3aed;
  --purple-lt: #ede9fe;
  --muted: #6b7280;
  --border: #e5e7eb;
  --card: #ffffff;
  --sidebar-w: 200px;
  --topbar-h: 54px;
}

/* LAYOUT */
.shell { display: flex; height: 100vh; overflow: hidden; }
.sidebar {
  width: var(--sidebar-w);
  background: #fff;
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  overflow: hidden; flex-shrink: 0;
  transition: width .2s;
}
.sidebar.collapsed { width: 52px; }
.main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.page { flex: 1; overflow-y: auto; padding: 24px; }

/* TOPBAR */
.topbar {
  height: var(--topbar-h);
  background: #fff;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center;
  padding: 0 20px; gap: 12px;
  flex-shrink: 0;
}
.topbar-toggle { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 18px; padding: 4px; border-radius: 6px; }
.topbar-toggle:hover { background: #f3f4f6; }
.topbar-breadcrumb { flex: 1; }
.tb-section { font-size: 12px; color: var(--muted); }
.tb-title { font-size: 15px; font-weight: 700; color: #111; }
.topbar-right { display: flex; align-items: center; gap: 12px; margin-left: auto; }
.tb-date { font-size: 12px; color: var(--muted); }
.tb-search { display: flex; align-items: center; gap: 6px; background: #f9fafb; border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px; font-size: 13px; color: var(--muted); cursor: pointer; }
.tb-icon-btn { width: 34px; height: 34px; border-radius: 50%; border: none; background: #111; color: #fff; font-size: 14px; cursor: pointer; display: grid; place-items: center; position: relative; }
.tb-notif-dot { position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background: var(--red); border-radius: 50%; border: 1.5px solid #fff; }
.tb-avatar { width: 34px; height: 34px; border-radius: 50%; background: #374151; display: grid; place-items: center; color: #fff; font-size: 13px; font-weight: 700; border: none; cursor: pointer; overflow: hidden; }
.tb-name { font-size: 13px; font-weight: 600; }

/* SIDEBAR */
.sb-logo {
  height: var(--topbar-h);
  padding: 0 14px;
  display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid var(--border); flex-shrink: 0;
}
.sb-logo-icon { width: 28px; height: 28px; border-radius: 8px; background: #111; color: #fff; display: grid; place-items: center; font-size: 11px; font-weight: 800; flex-shrink: 0; }
.sb-logo-text { font-weight: 700; font-size: 13px; white-space: nowrap; }
.sidebar.collapsed .sb-logo-text { display: none; }

.sb-nav { flex: 1; overflow-y: auto; padding: 8px 0; scrollbar-width: none; }
.sb-nav::-webkit-scrollbar { display: none; }
.sb-section { padding: 10px 14px 4px; font-size: 10px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; white-space: nowrap; }
.sidebar.collapsed .sb-section { display: none; }
.sb-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 14px; cursor: pointer;
  font-size: 13px; font-weight: 500;
  color: #374151; border: none; background: none;
  width: 100%; text-align: left;
  border-left: 3px solid transparent;
  border-radius: 0;
  transition: background .1s, color .1s;
  white-space: nowrap;
}
.sb-item:hover { background: #f9fafb; color: var(--blue); }
.sb-item.active { background: #eff6ff; color: var(--blue); font-weight: 600; border-left-color: var(--blue); }
.sb-icon { font-size: 15px; flex-shrink: 0; width: 20px; text-align: center; }
.sidebar.collapsed .sb-label { display: none; }
.sidebar.collapsed .sb-item { justify-content: center; padding: 10px 0; border-left: none; }

/* CARDS */
.card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
.card-sm { background: #fff; border: 1px solid var(--border); border-radius: 10px; padding: 16px; }

/* BADGES */
.badge { display: inline-flex; align-items: center; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; white-space: nowrap; }
.badge-blue { background: var(--blue-lt); color: #1d4ed8; }
.badge-green { background: var(--green-lt); color: #15803d; }
.badge-red { background: var(--red-lt); color: #b91c1c; }
.badge-orange { background: #fff7ed; color: #c2410c; }
.badge-gray { background: #f3f4f6; color: #4b5563; }
.badge-purple { background: var(--purple-lt); color: #5b21b6; }

/* BUTTONS */
.btn { border: none; border-radius: 8px; padding: 8px 18px; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 6px; }
.btn-primary { background: var(--blue); color: #fff; }
.btn-primary:hover { background: var(--blue-dk); }
.btn-dark { background: #111; color: #fff; }
.btn-dark:hover { background: #222; }
.btn-outline { background: #fff; color: #374151; border: 1px solid var(--border); }
.btn-outline:hover { background: #f9fafb; }
.btn-danger { background: var(--red); color: #fff; }
.btn-success { background: var(--green); color: #fff; }
.btn-sm { padding: 5px 12px; font-size: 12px; border-radius: 7px; }

/* INPUTS */
.input, .select, .textarea {
  width: 100%; padding: 9px 12px;
  border: 1px solid #e5e7eb; border-radius: 8px;
  font-size: 13px; font-family: inherit;
  background: #f9fafb; color: #111;
  outline: none; transition: border-color .15s, background .15s;
}
.input:focus, .select:focus, .textarea:focus { border-color: var(--blue); background: #fff; }
.input::placeholder, .textarea::placeholder { color: #9ca3af; }
.label { font-size: 13px; font-weight: 600; display: block; margin-bottom: 5px; color: #374151; }
.textarea { resize: vertical; min-height: 90px; }

/* TABLE */
.table { width: 100%; border-collapse: collapse; font-size: 13px; }
.table thead tr { background: #f9fafb; }
.table th { padding: 11px 16px; font-weight: 600; color: var(--muted); text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; white-space: nowrap; border-bottom: 1px solid var(--border); }
.table td { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
.table tbody tr:hover { background: #fafafa; }
.table tbody tr:last-child td { border-bottom: none; }

/* PROGRESS */
.prog { height: 6px; background: #f3f4f6; border-radius: 4px; overflow: hidden; }
.prog-bar { height: 100%; border-radius: 4px; transition: width .3s; }

/* STAT CARD */
.stat-card { background: #fff; border: 1px solid var(--border); border-radius: 10px; padding: 16px 20px; }
.stat-label { font-size: 12px; color: var(--muted); margin-bottom: 4px; }
.stat-val { font-size: 28px; font-weight: 800; line-height: 1.1; }

/* TABS */
.tabs { display: flex; gap: 4px; }
.tab { padding: 8px 20px; border-radius: 30px; border: none; cursor: pointer; font-size: 13px; font-weight: 500; background: #f3f4f6; color: var(--muted); font-family: inherit; transition: .12s; }
.tab:hover { background: #e5e7eb; color: #111; }
.tab.tab-active-dark { background: #111; color: #fff; font-weight: 700; }
.tab.tab-active-blue { background: var(--blue); color: #fff; font-weight: 700; }

/* UPLOAD ZONE */
.upload-zone { border: 1.5px dashed var(--border); border-radius: 10px; padding: 32px; text-align: center; color: var(--muted); cursor: pointer; transition: border-color .15s; }
.upload-zone:hover { border-color: var(--blue); }

/* DOT */
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.dot-green { background: var(--green); }
.dot-orange { background: var(--orange); }
.dot-red { background: var(--red); }
.dot-blue { background: var(--blue); }

/* TILE */
.tile { border-radius: 10px; padding: 14px 16px; }
.tile-red { background: var(--red-lt); }
.tile-green { background: var(--green-lt); }
.tile-orange { background: #fff7ed; }
.tile-blue { background: var(--blue-lt); }
.tile-val { font-size: 26px; font-weight: 800; line-height: 1; margin-bottom: 2px; }
.tile-label { font-size: 12px; font-weight: 500; }
.tile-red .tile-val, .tile-red .tile-label { color: var(--red); }
.tile-green .tile-val, .tile-green .tile-label { color: var(--green); }
.tile-orange .tile-val, .tile-orange .tile-label { color: #c2410c; }
.tile-blue .tile-val, .tile-blue .tile-label { color: var(--blue); }

/* PAGINATION */
.pag { display: flex; align-items: center; gap: 4px; }
.pag-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: #fff; font-size: 13px; font-weight: 500; display: grid; place-items: center; cursor: pointer; font-family: inherit; color: #374151; }
.pag-btn:hover { background: #f3f4f6; }
.pag-btn.pag-active { background: var(--blue); color: #fff; border-color: var(--blue); font-weight: 700; }
.pag-btn:disabled { opacity: .4; cursor: not-allowed; }

/* NOC CARD */
.noc-card { border: 1px solid var(--border); border-radius: 12px; padding: 18px; cursor: pointer; transition: box-shadow .15s; height: 100%; }
.noc-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); }
.noc-icon { width: 48px; height: 48px; border-radius: 10px; display: grid; place-items: center; font-size: 20px; margin-bottom: 12px; }

/* QUICK ACTION */
.qa { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 10px; background: #f9fafb; cursor: pointer; border: none; width: 100%; text-align: left; font-family: inherit; transition: background .1s; }
.qa:hover { background: #f3f4f6; }
.qa-icon { width: 38px; height: 38px; border-radius: 9px; display: grid; place-items: center; font-size: 18px; flex-shrink: 0; }

/* MODAL OVERLAY */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: #fff; border-radius: 16px; padding: 28px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; }
.modal-title { font-size: 18px; font-weight: 800; margin-bottom: 20px; }

/* STEPPER */
.stepper { display: flex; position: relative; }
.step-col { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; }
.step-line { position: absolute; top: 15px; left: 50%; right: -50%; height: 2px; z-index: 0; }
.step-circle { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; font-size: 13px; font-weight: 700; position: relative; z-index: 1; }
.step-label { font-size: 11px; margin-top: 6px; text-align: center; color: var(--muted); }
.step-label.active { color: #111; font-weight: 700; }

/* ANIM */
@keyframes fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.pg { animation: fadein .18s ease; }

/* MISC */
.divider { border: none; border-top: 1px solid var(--border); margin: 12px 0; }
.tx-blue { color: var(--blue); }
.tx-green { color: var(--green); }
.tx-red { color: var(--red); }
.tx-orange { color: var(--orange); }
.tx-muted { color: var(--muted); }
.fw-bold { font-weight: 700; }
.fw-black { font-weight: 800; }

/* OVERVIEW */
.search-bar { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 10px 16px; font-size: 14px; color: var(--muted); }
.chart-bar-container { display: flex; align-items: flex-end; gap: 3px; height: 180px; }
.chart-bar-group { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
.chart-bars { flex: 1; display: flex; align-items: flex-end; gap: 1px; width: 100%; }
.chart-bar { flex: 1; border-radius: 2px 2px 0 0; min-height: 2px; }
.chart-label { font-size: 9px; color: var(--muted); margin-top: 3px; }

/* LETTER BOX */
.letter-box { border: 1px solid var(--border); border-radius: 10px; padding: 16px; font-size: 12px; line-height: 1.8; background: #fff; }

/* OWNER BOX */
.owner-box { background: #eff6ff; border-radius: 10px; padding: 14px; }

/* RULE DETAIL */
.condition-box { background: #f5f3ff; border-left: 3px solid var(--purple); border-radius: 0 8px 8px 0; padding: 14px 16px; }

/* SCOPE BOX */
.scope-box { background: #f9fafb; border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; display: flex; align-items: center; gap: 10px; }

@media (max-width: 768px) {
  :root { --sidebar-w: 0px; }
  .sidebar { position: absolute; z-index: 100; width: 200px; }
  .sidebar.collapsed { width: 0; }
  .page { padding: 16px; }
}
`;

// ─────────────── REUSABLE COMPONENTS ───────────────

function Badge({ label, c = "gray" }) {
  return <span className={`badge badge-${c}`}>{label}</span>;
}

function Prog({ pct, color }) {
  return <div className="prog"><div className="prog-bar" style={{ width: `${pct}%`, background: color || "var(--blue)" }} /></div>;
}

function Pagination({ page, total, onChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
      <span className="tx-muted" style={{ fontSize: 13 }}>Page {page} of {total}</span>
      <div className="pag">
        <button className="pag-btn" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
        {Array.from({ length: total }, (_, i) => i + 1).map(n => (
          <button key={n} className={`pag-btn ${n === page ? "pag-active" : ""}`} onClick={() => onChange(n)}>{n}</button>
        ))}
        <button className="pag-btn" disabled={page === total} onClick={() => onChange(page + 1)}>›</button>
      </div>
    </div>
  );
}

// ─────────────── OVERVIEW ───────────────

function OverviewPage() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const approved = [54,29,54,99,52,46,15,64,33,64,23,93];
  const pending =  [48,25,56,94,52,45,13,81,30,30,55,45];
  const rejected = [24,10,39,40,50,40,29,75,77,89,26,33];
  const maxVal = 100;

  const recent = [
    { title:"Tenant Agreement Verification", sub:"Unit 402  •  Rahul Sharma (Tenant)", badge:"Pending Verify", bc:"orange" },
    { title:"Interior Renovation Request", sub:"Unit 105  •  Painting & Flooring", badge:"Review Docs", bc:"blue" },
    { title:"NOC for Bank Loan – Flat C-201", sub:"Unit C-201  •  Priya Mehta (Owner)", badge:"Approved", bc:"green" },
  ];

  // radar chart
  const radarPoints = (vals) => {
    const pts = months.map((_, i) => {
      const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
      const r = (vals[i] / 100) * 75;
      return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
    });
    return pts.join(" ");
  };

  return (
    <div className="pg">
      <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 2 }}>Welcome Back!</h2>
      <p className="tx-muted" style={{ fontSize: 13, marginBottom: 20 }}>Your Overview Statistics</p>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div className="search-bar" style={{ gridColumn: "1 / -1" }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <span>Start searching here</span>
        </div>
        {[["Active Complaints","14"],["Visits","3,671"],["Pending Approvals","156"],["Staff Present","48/50"]].map(([l,v]) => (
          <div className="stat-card" key={l}>
            <div className="stat-label">{l}</div>
            <div className="stat-val">{v}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginBottom: 20 }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 16 }}>
              {[["#818cf8","Approved"],["#fb923c","Pending"],["#f87171","Rejected"]].map(([c,l]) => (
                <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: "inline-block" }} /> {l}
                </span>
              ))}
            </div>
            <button className="btn btn-outline btn-sm">F.Y. 2025 ▾</button>
          </div>
          {/* Y axis + chart */}
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: 9, color: "var(--muted)", paddingBottom: 16, textAlign: "right" }}>
              {[100,80,60,40,20,0].map(v => <span key={v}>{v}</span>)}
            </div>
            <div style={{ flex: 1, position: "relative" }}>
              {[80,60,40,20].map(v => (
                <div key={v} style={{ position: "absolute", left: 0, right: 0, bottom: `${(v/100)*180+16}px`, height: 1, background: "#f3f4f6", zIndex: 0 }} />
              ))}
              <div style={{ display: "flex", gap: 3, height: 180, alignItems: "flex-end", position: "relative", zIndex: 1 }}>
                {months.map((m,i) => (
                  <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "100%", display: "flex", gap: 1, alignItems: "flex-end", height: 180 }}>
                      {[[approved[i],"#818cf8"],[pending[i],"#fb923c"],[rejected[i],"#f87171"]].map(([v,c],j) => (
                        <div key={j} style={{ flex: 1, background: c, borderRadius: "2px 2px 0 0", height: `${(v/maxVal)*100}%`, minHeight: 2 }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 3 }}>{m}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            {[["#818cf8","Approved"],["#fb923c","Pending"],["#f87171","Rejected"]].map(([c,l]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block" }} /> {l}
              </span>
            ))}
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 200 200" width="200" height="200">
              {/* Grid */}
              {[.25,.5,.75,1].map((s,i) => (
                <polygon key={i} points={months.map((_,idx) => { const a=(idx/12)*2*Math.PI-Math.PI/2; const r=75*s; return `${100+r*Math.cos(a)},${100+r*Math.sin(a)}`; }).join(" ")}
                  fill="none" stroke="#e5e7eb" strokeWidth="1" />
              ))}
              {/* Lines from center */}
              {months.map((_,i) => { const a=(i/12)*2*Math.PI-Math.PI/2; return <line key={i} x1="100" y1="100" x2={100+75*Math.cos(a)} y2={100+75*Math.sin(a)} stroke="#e5e7eb" strokeWidth="1" />; })}
              {/* Data */}
              <polygon points={radarPoints(approved)} fill="rgba(129,140,248,.3)" stroke="#818cf8" strokeWidth="1.5" />
              <polygon points={radarPoints(pending)}  fill="rgba(251,146,60,.25)"  stroke="#fb923c" strokeWidth="1.5" />
              <polygon points={radarPoints(rejected)} fill="rgba(248,113,113,.25)" stroke="#f87171" strokeWidth="1.5" />
              {/* Labels */}
              {months.map((lb,i) => { const a=(i/12)*2*Math.PI-Math.PI/2; return <text key={lb} x={100+88*Math.cos(a)} y={100+88*Math.sin(a)} fontSize="7.5" fill="#6b7280" textAnchor="middle" dominantBaseline="middle">{lb}</text>; })}
            </svg>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="card" style={{ padding: 0 }}>
        {recent.map((r,i,arr) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: i < arr.length-1 ? "1px solid var(--border)" : "none" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{r.sub}</div>
            </div>
            <Badge label={r.badge} c={r.bc} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────── BROADCASTING ───────────────

function BroadcastingPage() {
  const [tab, setTab] = useState("Announcement");
  const tabs = [
    { id: "Announcement", icon: "📢" },
    { id: "Emergency", icon: "⚠️" },
    { id: "Circular", icon: "📄" },
    { id: "Event", icon: "📅" },
  ];
  const notifs = [
    { label:"Committee Meeting", time:"Today, 08:00 PM", dot:"dot-orange" },
    { label:"New user registered.", time:"59 minutes ago", dot:"dot-blue" },
    { label:"Mr. Roy Sing update notice board", time:"1 hour ago", dot:"dot-orange" },
    { label:"Complaint registered by Riya Mittal", time:"Today, 10:59 AM", dot:"dot-red" },
  ];
  const recent = [
    { title:"Water Supply Cut", time:"Today, 10:30 AM", type:"Alert", status:"Sent", sc:"green" },
    { title:"New Year Event", time:"Dec 31, 08:00 PM", type:"Invitation", status:"Scheduled", sc:"blue" },
    { title:"Parking Lot Resurfacing", time:"Edited 2h ago", type:"Announcement", status:"Draft", sc:"gray" },
  ];

  return (
    <div className="pg" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 20 }}>📢</span>
          <h5 style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>Create & Publish</h5>
        </div>
        {/* Type tabs */}
        <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 30, padding: 3, marginBottom: 20 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "8px 4px", border: "none", borderRadius: 26, fontWeight: 600, fontSize: 12,
              cursor: "pointer", fontFamily: "inherit", transition: ".15s",
              background: tab === t.id ? "#111" : "transparent",
              color: tab === t.id ? "#fff" : "var(--muted)"
            }}>
              {t.icon} {t.id}
            </button>
          ))}
        </div>

        <label className="label">Subject / Title</label>
        <input className="input" placeholder="Example : Scheduled Maintenance of Lift B" style={{ marginBottom: 16 }} />

        <label className="label">Content</label>
        <div style={{ border: "1px solid var(--border)", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
          <div style={{ borderBottom: "1px solid var(--border)", padding: "8px 12px", display: "flex", gap: 10, background: "#f9fafb" }}>
            {["B","I","U","|","≡","≔","🔗"].map(b => (
              <button key={b} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: b === "B" ? 800 : 400, fontSize: 13, color: "#374151", fontFamily: "inherit" }}>{b}</button>
            ))}
          </div>
          <textarea className="textarea" placeholder="Type your announcement details here…" style={{ border: "none", borderRadius: 0, background: "#fff" }} />
        </div>

        <label className="label">Attachment (Optional)</label>
        <div className="upload-zone" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>☁️</div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>Click to upload or drag files here</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>PDF, JPG, PNG up to 10MB</div>
        </div>

        <label className="label">Broadcasting Channels</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <span className="badge badge-blue">☑ App Notification</span>
          <span className="badge badge-gray">⊕ Add Channel</span>
        </div>

        <div style={{ display: "flex", gap: 20, marginBottom: 20, fontSize: 13 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="radio" defaultChecked name="when" /> Send Now
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="radio" name="when" /> Schedule for later
          </label>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn btn-outline">Preview</button>
          <button className="btn btn-outline">Save Draft</button>
          <button className="btn btn-primary">Publish ✈</button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Notifications */}
        <div className="card">
          <h6 style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Notifications</h6>
          {notifs.map((n,i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <span className={`dot ${n.dot}`} style={{ marginTop: 5, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{n.label}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{n.time}</div>
              </div>
            </div>
          ))}
          <button className="btn btn-dark" style={{ width: "100%", marginTop: 4, justifyContent: "center" }}>Show all notifications</button>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h6 style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Quick Actions</h6>
          {[["➕","New Notice","#dbeafe"],["📊","Create Poll","#ffedd5"],["📄","Issue NOC","#ede9fe"]].map(([ic,lb,bg]) => (
            <button key={lb} className="qa" style={{ marginBottom: 8 }}>
              <div className="qa-icon" style={{ background: bg }}>{ic}</div>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{lb}</span>
            </button>
          ))}
        </div>

        {/* Recent Communications */}
        <div className="card">
          <h6 style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              Recent Communications
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#111", color: "#fff", fontSize: 10, display: "grid", placeItems: "center" }}>≡</span>
            </span>
          </h6>
          {recent.map((r,i,arr) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: i < arr.length-1 ? 12 : 0, marginBottom: i < arr.length-1 ? 12 : 0, borderBottom: i < arr.length-1 ? "1px solid var(--border)" : "none" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{r.time} • {r.type}</div>
              </div>
              <Badge label={r.status} c={r.sc} />
            </div>
          ))}
          <button className="btn btn-dark" style={{ width: "100%", marginTop: 14, justifyContent: "center" }}>Show all communication</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────── NOTICE BOARD ───────────────

function NoticeBoardPage() {
  const [tab, setTab] = useState("All Posts");
  const posts = [
    { icon:"📢", title:"AGM 2025 Date Rescheduled", tag:"Official", tc:"blue", author:"Sara Sharan", time:"2 hours ago", views:"128 views", content:"Due to unforeseen weather conditions, the Annual General Meeting scheduled for this Sunday is postponed to next Saturday, Nov 12th at 5 PM in the Clubhouse." },
    { icon:"💬", title:"Water Seepage in Block B Basement", tag:"Discussion", tc:"orange", author:"Raj Singh (B-402)", time:"Yesterday", comments:"14 Comments", locked:true, content:"There is a significant leak near pillar 14. Can the maintenance team please prioritize this?" },
    { icon:"👥", title:"Diwali Decoration Volunteers Needed", tag:"Discussion", tc:"orange", author:"Priya Desai (Cultural Comm.)", time:"5 hours ago", comments:"8 Comments", content:"Looking for enthusiastic residents to help with the rangoli and lighting arrangements for the upcoming Diwali celebration. Please comment if interested!" },
    { icon:"📋", title:"Found: Car Keys near Gate 2", tag:"Lost & Found", tc:"gray", author:"Security Office", time:"30 min ago", content:"A set of Honda car keys was found near the security cabin at Gate 2 this morning. Please collect from security." },
  ];
  const modQueue = [
    { name:"Raj Singh (A-612)", time:"10m ago", text:'"Why is the gym AC never working? I will stop paying maintenance if this continues! This is ridiculous…"' },
    { name:"Neha Verma (C-501)", time:"45m ago", text:'"Selling my old sofa set. Price negotiable. Contact me at 98765…"', avatar:"NV" },
  ];

  return (
    <div className="pg" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>
      <div>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <div className="tabs" style={{ gap: 0 }}>
              {["All Posts","Official","Discussions","Archived"].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: "10px 22px", border: "none", cursor: "pointer", fontFamily: "inherit",
                  fontSize: 14, fontWeight: tab === t ? 600 : 400,
                  borderRadius: tab === t ? 30 : 0,
                  background: tab === t ? var_blue() : "transparent",
                  color: tab === t ? "#fff" : "var(--muted)"
                }}>{t}</button>
              ))}
            </div>
          </div>
          {posts.map((p,i,arr) => (
            <div key={i} style={{ padding: "18px 20px", borderBottom: i < arr.length-1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f3f4f6", display: "grid", placeItems: "center", fontSize: 18, flexShrink: 0 }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{p.title}</span>
                    <Badge label={p.tag} c={p.tc} />
                    {p.locked && <span style={{ fontSize: 11, color: "var(--red)", fontWeight: 600 }}>• Thread Locked 🔒</span>}
                  </div>
                  <p style={{ fontSize: 13, color: "#374151", marginBottom: 6, lineHeight: 1.6 }}>{p.content}</p>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>
                    👤 {p.author} • {p.time}
                    {p.views && ` • 👁 ${p.views}`}
                    {p.comments && ` • 💬 ${p.comments}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Stats */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {[["24","Active notices",""],["3","Pending Review","tx-red"],["156","Comments Today",""],["12","New Threads",""]].map(([v,l,cls],i) => (
              <div key={l} style={{ padding: "16px", textAlign: "center", borderBottom: i < 2 ? "1px solid var(--border)" : "none", borderRight: i % 2 === 0 ? "1px solid var(--border)" : "none" }}>
                <div className={cls} style={{ fontWeight: 800, fontSize: 22 }}>{v}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Moderation */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span>⚠️</span>
            <h6 style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Moderation Queue (3)</h6>
          </div>
          {modQueue.map((m,i) => (
            <div key={i} style={{ background: "#f9fafb", borderRadius: 10, padding: 14, marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#374151", color: "#fff", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                  {m.name.slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{m.time}</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#374151", marginBottom: 10, lineHeight: 1.6 }}>{m.text}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-success btn-sm" style={{ flex: 1, justifyContent: "center" }}>Approve</button>
                <button className="btn btn-danger btn-sm" style={{ flex: 1, justifyContent: "center" }}>Reject</button>
              </div>
            </div>
          ))}
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Show all moderation</button>
        </div>
      </div>
    </div>
  );
}

function var_blue() { return "#2563eb"; }

// ─────────────── POLLS ───────────────

function PollsPage() {
  const [tab, setTab] = useState("Active");
  const polls = [
    { icon:"📊", title:"AGM 2025 : Approval of Annual Accounts", id:"#POLL-2024-004", meta:"Started: 2 days ago", ends:"Ends in 24h", endRed:true, tags:["AGM Voting","One Vote per Flat","Secret Ballot"], status:"Live Voting", sc:"green", pct:78, votes:"234 / 300 Votes" },
    { icon:"🔧", title:"Gym Equipment Upgrade Proposal", id:"#POLL-2024-005", meta:"Started: 5 hours ago", ends:"Ends in 5 days", tags:["Infrastructure","Per Member","Open Ballot"], status:"Live Voting", sc:"green", pct:12, votes:"36 / 300 Votes" },
    { icon:"☑", title:"Q3 Maintenance Charge Hike (10%)", id:"#POLL-2024-003", meta:"Ended: Oct 15, 2024", tags:["Finance","One Vote per Flat","Approved"], status:"Closed", sc:"gray", result:true, votes:"280 Total Votes" },
    { icon:"🗓", title:"Visitor Parking Policy Revision", id:"#POLL-2024-006", meta:"Starts: Nov 20, 2024 (10:00 AM)", tags:["Rules & Regulations","Per Member"], status:"Scheduled", sc:"orange" },
  ];

  return (
    <div className="pg" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>
      <div>
        {/* Toolbar */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 30, padding: 3 }}>
            {["Active","Scheduled","Closed","Drafts"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "8px 18px", border: "none", borderRadius: 26, fontWeight: 600, fontSize: 13,
                cursor: "pointer", fontFamily: "inherit", transition: ".12s",
                background: tab === t ? "#111" : "transparent",
                color: tab === t ? "#fff" : "var(--muted)"
              }}>{t}</button>
            ))}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <input className="input" placeholder="Search polls…" style={{ width: 160 }} />
            <button className="btn btn-primary">+ Create Poll</button>
          </div>
        </div>

        {polls.map((p,i) => (
          <div key={i} className="card" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f3f4f6", display: "grid", placeItems: "center", fontSize: 22, flexShrink: 0 }}>{p.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{p.title}</span>
                  <span className={`badge badge-${p.sc}`}>● {p.status}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
                  {p.id} • {p.meta}
                  {p.ends && <> • <span style={{ color: p.endRed ? "var(--red)" : "var(--muted)", fontWeight: p.endRed ? 600 : 400 }}>{p.ends}</span></>}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                  {p.tags?.map(t => (
                    <span key={t} style={{ fontSize: 11, padding: "3px 10px", border: "1px solid var(--border)", borderRadius: 5, background: "#f9fafb", color: "var(--muted)" }}>{t}</span>
                  ))}
                </div>
                {p.pct !== undefined && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                      <span style={{ fontWeight: 600 }}>{p.pct}% Participation</span>
                      <span className="tx-muted">{p.votes}</span>
                    </div>
                    <Prog pct={p.pct} color={p.pct > 50 ? "var(--green)" : "var(--blue)"} />
                  </>
                )}
                {p.result && (
                  <>
                    <div style={{ fontSize: 12, marginBottom: 4 }}>
                      Result: <span className="tx-green" style={{ fontWeight: 600 }}>Yes (65%)</span> vs No (35%) <span className="tx-muted">{p.votes}</span>
                    </div>
                    <Prog pct={65} color="var(--blue)" />
                  </>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                {p.status !== "Scheduled" && <button className="btn btn-outline btn-sm">{p.status === "Closed" ? "View Report" : "Analytics"}</button>}
                {p.status === "Scheduled" && <button className="btn btn-outline btn-sm">Edit</button>}
                <span style={{ color: "var(--muted)", cursor: "pointer", fontSize: 18 }}>⋮</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Voting Overview */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>🗳</span>
            <h6 style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Voting Overview</h6>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: 10, border: "1px solid var(--border)", overflow: "hidden" }}>
            {[["2","Active Polls","",""],["85%","Avg Turnout","",""],["12","Total Polls (YTD)","",""],["98%","Digital Adoption","tx-green",""]].map(([v,l,cls],i) => (
              <div key={l} style={{ padding: "14px", textAlign: "center", borderBottom: i < 2 ? "1px solid var(--border)" : "none", borderRight: i % 2 === 0 ? "1px solid var(--border)" : "none" }}>
                <div className={cls} style={{ fontWeight: 800, fontSize: 20 }}>{v}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Create */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span>⚡</span>
            <h6 style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Quick Create</h6>
          </div>
          {[["👥","AGM Voting","One vote per flat","#ede9fe"],["🔧","Swimming Pool Rules","Financial approval","#dcfce7"],["⚖️","Rule Change","Amend by-laws","#fff7ed"]].map(([ic,lb,sub,bg]) => (
            <button key={lb} className="qa" style={{ marginBottom: 8 }}>
              <div className="qa-icon" style={{ background: bg }}>{ic}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{lb}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{sub}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span>🗓</span>
            <h6 style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Upcoming Events</h6>
          </div>
          {[["15","Nov","Committee Election","Nominations close in 2 days"],["01","Dec","Vendor Contract Renewal","Security & Housekeeping"]].map(([d,m,t,s]) => (
            <div key={t} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
              <div style={{ background: "#eff6ff", color: "var(--blue)", fontWeight: 700, fontSize: 12, borderRadius: 8, padding: "6px 10px", textAlign: "center", minWidth: 44 }}>
                {d}<br/><span style={{ fontWeight: 500 }}>{m}</span>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{t}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{s}</div>
              </div>
            </div>
          ))}
          <button className="btn btn-dark" style={{ width: "100%", justifyContent: "center" }}>Show all upcoming events</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────── ADD MEMBER ───────────────

function AddMemberPage() {
  const [memType, setMemType] = useState("Owner");
  return (
    <div className="pg" style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ background: "rgba(0,0,0,.4)", position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
        <div className="card" style={{ maxWidth: 580, width: "100%", borderRadius: 16, padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h5 style={{ fontWeight: 800, fontSize: 18, margin: 0 }}>Add New Member</h5>
            <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)" }}>✕</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label className="label">Select Wing</label>
              <select className="select">
                <option>Select Wing</option>
                {["Wing A","Wing B","Wing C"].map(w=><option key={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Flat / Unit Number</label>
              <select className="select"><option>Select Unit</option></select>
            </div>
          </div>

          <label className="label">Membership Type</label>
          <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 30, padding: 3, marginBottom: 16 }}>
            {["Owner","Tenant","Family Member"].map(t => (
              <button key={t} onClick={() => setMemType(t)} style={{
                flex: 1, padding: "9px 4px", border: "none", borderRadius: 26,
                fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: ".15s",
                background: memType === t ? "var(--blue)" : "transparent",
                color: memType === t ? "#fff" : "var(--muted)"
              }}>{t}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div><label className="label">First Name</label><input className="input" placeholder="Enter First Name" /></div>
            <div><label className="label">Last Name</label><input className="input" placeholder="Enter Last Name" /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label className="label">Phone Number</label>
              <div style={{ display: "flex" }}>
                <span style={{ padding: "9px 12px", background: "#f3f4f6", border: "1px solid var(--border)", borderRight: "none", borderRadius: "8px 0 0 8px", fontSize: 13, color: "var(--muted)", whiteSpace: "nowrap" }}>+91</span>
                <input className="input" placeholder="98765 43210" style={{ borderRadius: "0 8px 8px 0", borderLeft: "none" }} />
              </div>
            </div>
            <div><label className="label">Email Address</label><input className="input" placeholder="Enter Email Address" /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label className="label">Residency Status</label>
              <select className="select"><option>Select Wing</option><option>Resident</option><option>Non-Resident</option></select>
            </div>
            <div>
              <label className="label">Move-in Date</label>
              <div style={{ position: "relative" }}>
                <select className="select"><option>Select Date</option></select>
              </div>
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 24, fontSize: 13 }}>
            <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />
            Mark as Primary Member for this unit
          </label>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn btn-outline">Cancel</button>
            <button className="btn btn-primary" style={{ paddingLeft: 28, paddingRight: 28 }}>Add Member</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────── DOCUMENTS & NOC ───────────────

function DocumentsPage() {
  const docs = [
    { icon:"✈️", title:"NOC for Passport", desc:"Address proof and residency confirmation for passport application or renewal.", meta:"Validity: 6 Months", bg:"#dbeafe" },
    { icon:"🏦", title:"NOC for Bank Loan", desc:"Clearance certificate stating no outstanding society dues for loan processing.", meta:"Processing: 2 Days", bg:"#dbeafe" },
    { icon:"🔍", title:"Tenant Verification NOC", desc:"Approval for renting out flat to new tenants after police verification check.", meta:"Requires: Lease Agreement", bg:"#dcfce7" },
    { icon:"🔄", title:"NOC for Passport", desc:"Kindly provide the required documentation for the official ownership transfer process.", meta:"Validity: 6 Months", bg:"#dbeafe" },
  ];

  return (
    <div className="pg" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>
      <div className="card">
        <h5 style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Letters & Certificates</h5>
        <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 20 }}>Issue No Objection Certificates (NOC) and other official documents.</p>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 15 }}>📄</span>
          <h6 style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>Issue New Document</h6>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          {docs.map((d,i) => (
            <div key={i} className="noc-card">
              <div className="noc-icon" style={{ background: d.bg }}>{d.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{d.title}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14, lineHeight: 1.6 }}>{d.desc}</div>
              <hr className="divider" />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="tx-blue" style={{ fontSize: 12, fontWeight: 600 }}>{d.meta}</span>
                <span className="tx-blue" style={{ fontWeight: 700 }}>→</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span>🕐</span>
          <h6 style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Recently Issued</h6>
        </div>
        <p style={{ fontSize: 13, color: "var(--muted)" }}>No recent documents issued.</p>
      </div>

      <div className="card">
        <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Latest Generated</h6>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>Automatic letterhead & signature applied.</p>
        <div className="letter-box" style={{ marginBottom: 14 }}>
          <div style={{ textAlign: "center", fontWeight: 800, fontSize: 12, marginBottom: 2 }}>GREEN VALLEY CO-OP SOCIETY</div>
          <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 10, marginBottom: 14 }}>Reg No. BOM/HSG/1234 • Palm Beach Road, CA</div>
          <div style={{ fontSize: 12, lineHeight: 1.8 }}>
            To: The Branch Manager<br/>State Bank of India<br/><br/>
            <strong>Subject:</strong> No Objection Certificate for Loan<br/><br/>
            <span style={{ color: "var(--muted)" }}>This is to certify that Mr. Michael Chen is the registered owner of Flat No. A-501 in our society...</span><br/><br/>
            <span style={{ color: "var(--muted)" }}>The society has no objection to the bank granting a loan against the said flat.</span>
          </div>
          <div style={{ textAlign: "right", fontStyle: "italic", fontWeight: 700, marginTop: 14 }}>Approved</div>
          <div style={{ textAlign: "right", color: "var(--muted)", fontSize: 10 }}>Secretary Signature</div>
        </div>
        <div style={{ background: "#dcfce7", color: "#15803d", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 600, fontSize: 13, marginBottom: 14 }}>
          ✅ Digitally Signed & Verified
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>🖨 Print / PDF</button>
          <button className="btn btn-outline" style={{ flex: 1, justifyContent: "center" }}>Email</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────── REGISTERS ───────────────

function RegistersPage() {
  const regs = [
    { icon:"👥", title:"Member Register", val:"1,245", sub:"Total active members", meta:"↑ 12 this week", mc:"tx-green", bg:"#dbeafe" },
    { icon:"🏠", title:"Unit Register", val:"420", sub:"95% Occupancy", meta:"20 Vacant", mc:"", bg:"#f3e8ff" },
    { icon:"🚗", title:"Parking Register", val:"512", sub:"Slots allocated", meta:"14 Guest slots open", mc:"", bg:"#ffedd5" },
    { icon:"🎪", title:"Vendor Register", val:"28", sub:"Active service providers", meta:"3 Pending approval", mc:"", bg:"#dcfce7" },
    { icon:"📦", title:"Asset Register", val:"$1.2M", sub:"Total Asset Value", meta:"85 Items Tracked", mc:"", bg:"#fef9c3" },
    { icon:"😟", title:"Complaint Register", val:"12", sub:"Open issues", meta:"3 High Priority", mc:"tx-red", bg:"#fee2e2" },
  ];
  return (
    <div className="pg">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h4 style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Registers Overview</h4>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Quick access to all management modules</p>
        </div>
        <button className="btn btn-primary">+ New Entry</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {regs.map((r,i) => (
          <div key={i} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, background: r.bg, borderRadius: 12, display: "grid", placeItems: "center", fontSize: 24 }}>{r.icon}</div>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 18 }}>⋯</button>
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{r.title}</div>
            <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 4 }}>{r.val}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>{r.sub}</div>
            <hr className="divider" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className={r.mc} style={{ fontSize: 12, fontWeight: 600 }}>{r.meta}</span>
              <a href="#!" className="tx-blue" style={{ fontSize: 12, fontWeight: 600, textDecoration: "none" }}>View All →</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────── RULES ───────────────

function RulesPage() {
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const rules = [
    { title:"Quiet Hours Policy", sub:"10:00 PM to 6:00 AM daily", scope:"Entire Society", penalty:"₹500 / Offense", type:"BY-LAW" },
    { title:"Visitor Parking Limit", sub:"Max 4 hours without permit", scope:"Visitor Lot A & B", penalty:"Tow + ₹1500", type:"RULE" },
    { title:"Balcony Guidelines", sub:"No hanging clothes, BBQ grills", scope:"Block C, Wing 1", penalty:"Warning", type:"BY-LAW" },
    { title:"Pet Clean-up Policy", sub:"Immediate removal of waste required", scope:"Entire Society", penalty:"₹150 Fine", type:"BY-LAW" },
    { title:"Renovation Hours", sub:"Mon-Fri 9AM-5PM only", scope:"Entire Society", penalty:"Stop Work Order", type:"RULE" },
  ];

  return (
    <div className="pg" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
          {[
            { label:"Total Slots", val:"512", meta:"↑ 2 added this month", mc:"tx-green", icon:"📚", iconBg:"#dcfce7" },
            { label:"Violation Notices", val:"18", meta:"Pending review: 5", mc:"tx-red", icon:"⚠️", iconBg:"#fee2e2" },
            { label:"Penalty Collection", val:"₹21,250", meta:"Avg. penalty: ₹500", mc:"tx-muted", icon:"✏️", iconBg:"#dbeafe" },
          ].map((s,i) => (
            <div key={i} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>{s.val}</div>
                <div className={s.mc} style={{ fontSize: 12 }}>{s.meta}</div>
              </div>
              <div style={{ width: 40, height: 40, background: s.iconBg, borderRadius: 10, display: "grid", placeItems: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <h6 style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>Active Rules & By-laws</h6>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-outline btn-sm">🔽 Filter</button>
              <button className="btn btn-outline btn-sm">⬇ Export</button>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>RULE TITLE</th>
                  <th>APPLICABILITY</th>
                  <th>PENALTY</th>
                  <th>TYPE</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r,i) => (
                  <tr key={i} style={{ cursor: "pointer" }} onClick={() => setShowDetail(true)}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{r.sub}</div>
                    </td>
                    <td style={{ color: "var(--muted)" }}>📍 {r.scope}</td>
                    <td style={{ fontWeight: 500 }}>{r.penalty}</td>
                    <td><Badge label={r.type} c={r.type === "BY-LAW" ? "blue" : "gray"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px", textAlign: "center" }}>
            <a href="#!" className="tx-blue" style={{ fontWeight: 600, fontSize: 13, textDecoration: "none" }}>View All Rules →</a>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="card">
          <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Management Actions</h6>
          {[["➕","#dbeafe","Create By-law","Draft new regulation"],["🗺","#dcfce7","Attach to Block/Wing","Assign rules to areas"],["⚠️","#fee2e2","Define Penalties","Set fines & consequences"]].map(([ic,bg,lb,sub]) => (
            <button key={lb} className="qa" style={{ marginBottom: 8 }} onClick={() => lb === "Create By-law" && setShowCreate(true)}>
              <div className="qa-icon" style={{ background: bg }}>{ic}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{lb}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{sub}</div>
              </div>
              <span className="tx-muted">›</span>
            </button>
          ))}
        </div>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h6 style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Recent Violations</h6>
            <a href="#!" className="tx-blue" style={{ fontSize: 13, fontWeight: 600, textDecoration: "none" }}>View All</a>
          </div>
          {[["dot-red","Noise Complaint","Unit 402 • 2 hours ago"],["dot-orange","Improper Parking","Guest Lot • 5 hours ago"],["dot-green","Trash Disposal","Resolved • Yesterday"]].map(([d,l,s]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span className={`dot ${d}`} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{l}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rule Detail Modal */}
      {showDetail && (
        <div className="modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <h4 style={{ fontWeight: 800, fontSize: 20, margin: 0 }}>Quiet Hours Policy</h4>
                  <Badge label="BY-LAW" c="blue" />
                  <Badge label="Active" c="green" />
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>ID: #RL-2024-001 • Created on Jan 12, 2025</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-outline btn-sm">🖨 Print</button>
                <button className="btn btn-danger btn-sm">🗑 Delete</button>
                <button className="btn btn-primary btn-sm">✏️ Edit Rule</button>
              </div>
            </div>
            <div className="card" style={{ marginBottom: 14 }}>
              <h6 style={{ fontWeight: 700, marginBottom: 10 }}>Rule Description</h6>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, marginBottom: 14 }}>Residents are expected to maintain a quiet environment between the hours of 10:00 PM and 6:00 AM daily. This includes limiting volume on televisions, music devices, and avoiding loud activities in common areas and within units.</p>
              <div className="condition-box">
                <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>Specific Conditions</div>
                {["No construction work or drilling allowed during these hours.","Move-in/Move-out activities prohibited.","Common area gatherings must conclude by 10:00 PM."].map(c => (
                  <div key={c} style={{ fontSize: 13, color: "#374151", display: "flex", gap: 8, marginBottom: 4 }}>
                    <span>•</span> {c}
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ marginBottom: 14 }}>
              <h6 style={{ fontWeight: 700, marginBottom: 12 }}>Applicability & Scope</h6>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["Location Scope","📍 Entire Society"],["Applicable To","👥 All Residents & Guests"]].map(([l,v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>{l}</div>
                    <div className="scope-box"><span>{v}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setShowDetail(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Rule Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h5 style={{ fontWeight: 800, fontSize: 18, margin: 0 }}>Create New Rule</h5>
              <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)" }} onClick={() => setShowCreate(false)}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><label className="label">Rule Title</label><input className="input" placeholder="e.g. Quiet Hours Policy" /></div>
              <div><label className="label">Block / Tower</label><select className="select"><option>Select Type</option><option>BY-LAW</option><option>RULE</option></select></div>
            </div>
            <div style={{ marginBottom: 14 }}><label className="label">Description</label><textarea className="textarea" placeholder="Enter detailed description of the rule..." /></div>
            <div style={{ marginBottom: 14 }}><label className="label">Specific Conditions</label><textarea className="textarea" placeholder="List specific conditions, exceptions, or examples..." /></div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--muted)", marginBottom: 10 }}>SCOPE & APPLICABILITY</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              <div><label className="label">Location Scope</label><select className="select"><option>Select Location</option><option>Entire Society</option></select></div>
              <div><label className="label">Applicable To</label><select className="select"><option>Select Group</option><option>All Residents & Guests</option></select></div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary">Create Rule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────── COMPLAINTS ───────────────

function ComplaintsPage() {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const all = [
    { id:"#C-1042", title:"Lift B not working", unit:"A-201", cat:"Maintenance", pri:"High", st:"Open", sc:"red", time:"2h ago" },
    { id:"#C-1041", title:"Water leakage in corridor", unit:"B-305", cat:"Plumbing", pri:"Medium", st:"In Progress", sc:"orange", time:"5h ago" },
    { id:"#C-1040", title:"Gym AC not functioning", unit:"Common", cat:"Electrical", pri:"Low", st:"Open", sc:"red", time:"1d ago" },
    { id:"#C-1039", title:"Parking slot encroachment", unit:"B-101", cat:"Parking", pri:"Medium", st:"Resolved", sc:"green", time:"2d ago" },
    { id:"#C-1038", title:"Noisy neighbours after 10 PM", unit:"C-402", cat:"Noise", pri:"Medium", st:"Resolved", sc:"green", time:"3d ago" },
    { id:"#C-1037", title:"Broken gym equipment", unit:"Common", cat:"Maintenance", pri:"Low", st:"Open", sc:"red", time:"3d ago" },
    { id:"#C-1036", title:"Leaking water pipe – roof", unit:"D-501", cat:"Plumbing", pri:"High", st:"In Progress", sc:"orange", time:"4d ago" },
    { id:"#C-1035", title:"Gate door hinge broken", unit:"Gate 2", cat:"Maintenance", pri:"Low", st:"Resolved", sc:"green", time:"5d ago" },
  ];
  const per = 5, total = Math.ceil(all.length / per);
  const rows = all.slice((page-1)*per, page*per);

  return (
    <div className="pg">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h4 style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Complaints</h4>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Manage and track all society complaints</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Log Complaint</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[["14","Total Open","tile-red"],["6","In Progress","tile-orange"],["3","Resolved Today","tile-green"],["2.4d","Avg Resolution","tile-blue"]].map(([v,l,cls]) => (
          <div key={l} className={`tile ${cls}`}>
            <div className="tile-val">{v}</div>
            <div className="tile-label">{l}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                {["ID","Title","Unit","Category","Priority","Status","Time"].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map(c => (
                <tr key={c.id}>
                  <td className="tx-blue" style={{ fontWeight: 600 }}>{c.id}</td>
                  <td style={{ fontWeight: 600 }}>{c.title}</td>
                  <td style={{ color: "var(--muted)" }}>{c.unit}</td>
                  <td><Badge label={c.cat} c="gray" /></td>
                  <td><Badge label={c.pri} c={c.pri==="High"?"red":c.pri==="Medium"?"orange":"gray"} /></td>
                  <td><Badge label={c.st} c={c.sc} /></td>
                  <td style={{ color: "var(--muted)" }}>{c.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={total} onChange={setPage} />
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h5 style={{ fontWeight: 800, fontSize: 18, margin: 0 }}>Log New Complaint</h5>
              <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)" }} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="label" style={{ marginBottom: 8 }}>Complaint Scope</label>
              <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}><input type="radio" defaultChecked name="scope" /> Common Area</label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}><input type="radio" name="scope" /> Private Unit (On behalf of member)</label>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><label className="label">Location / Block</label><select className="select"><option>Select Location</option></select></div>
              <div><label className="label">Category</label><select className="select"><option>Select Category</option></select></div>
            </div>
            <div style={{ marginBottom: 14 }}><label className="label">Issue Subject</label><input className="input" placeholder="E.g., Water leakage near lift area" /></div>
            <div style={{ marginBottom: 14 }}><label className="label">Issue Subject</label><textarea className="textarea" placeholder="Describe the issue in detail..." /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              <div><label className="label">Priority</label><select className="select"><option>Medium</option><option>High</option><option>Low</option></select></div>
              <div>
                <label className="label">Photos / Attachments</label>
                <div style={{ border: "1.5px dashed var(--border)", borderRadius: 8, padding: "12px", textAlign: "center", cursor: "pointer", fontSize: 12, color: "var(--muted)" }}>⬆ Click to upload</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary">Log Complaint</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────── FLAT TRANSFER ───────────────

function FlatTransferPage() {
  const steps = ["Request Details","No-Dues","Calculations","Doc Verify","Final Approval"];
  const cur = 2;
  return (
    <div className="pg">
      <div style={{ marginBottom: 4, fontSize: 12, color: "var(--muted)" }}>Transfers &gt; #TR-2024-852</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h4 style={{ fontWeight: 800, fontSize: 20, margin: 0 }}>Transfer Request: Flat A-402</h4>
            <Badge label="In Progress" c="blue" />
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Green Valley Heights • Block A • 4th Floor</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline">Reject Request</button>
          <button className="btn btn-primary">Proceed to Approval</button>
        </div>
      </div>

      {/* Stepper */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="stepper">
          {steps.map((s,i) => (
            <div key={s} className="step-col">
              {i < steps.length-1 && <div className="step-line" style={{ background: i < cur ? "var(--blue)" : "var(--border)" }} />}
              <div className="step-circle" style={{
                background: i < cur ? "var(--blue)" : i === cur ? "#fff" : "#f3f4f6",
                border: i === cur ? "2px solid var(--blue)" : "none",
                color: i < cur ? "#fff" : i === cur ? "var(--blue)" : "var(--muted)"
              }}>
                {i < cur ? "✓" : i === cur ? <span style={{ fontSize: 16 }}>⊙</span> : "○"}
              </div>
              <div className={`step-label ${i === cur ? "active" : ""}`}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h6 style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>Ownership Transfer Details</h6>
              <a href="#!" className="tx-blue" style={{ fontSize: 12, fontWeight: 600, textDecoration: "none" }}>View Full Application</a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { role:"CURRENT OWNER (SELLER)", name:"Rajesh Kumar", ph:"+91 98765 43210", em:"rajesh.k@gmail.com", init:"RK", img:"👨" },
                { role:"NEW OWNER (BUYER)", name:"Priya Sharma", ph:"+91 91234 56789", em:"priya.s.design@gmail.com", init:"PS", img:"👩" },
              ].map(p => (
                <div key={p.role}>
                  <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 8 }}>{p.role}</div>
                  <div className="owner-box">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#dbeafe", display: "grid", placeItems: "center", fontSize: 20, flexShrink: 0 }}>{p.img}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>{p.ph}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>{p.em}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <h6 style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>No-Dues Clearance</h6>
                <span className="tx-green" style={{ fontWeight: 600, fontSize: 13 }}>✅ Cleared</span>
              </div>
              {[["💧","Water & Maintenance","Paid"],["⚡","Electricity Dues","Paid"]].map(([ic,l,v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: 13 }}>
                  <span>{ic} {l}</span>
                  <span className="tx-green" style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <h6 style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Transfer Charges</h6>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>Due Date: Today</span>
              </div>
              {[["Society Transfer Fee","₹25,000"],["Stamp Duty","₹3,500"]].map(([l,v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: 13 }}>
                  <span>{l}</span>
                  <span style={{ fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Approval Workflow</h6>
          {[
            { lbl:"Application Submitted", sub:"Oct 12, 10:30 AM • Rajesh K.", done:true },
            { lbl:"NDC Generated", sub:"Oct 13, 02:15 PM • System", done:true },
            { lbl:"Manager Review", sub:"Oct 14, 09:00 AM • James W.", done:true },
            { lbl:"Committee Approval", sub:"Pending • Awaiting Meeting", done:false, pending:true },
          ].map((w,i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: w.pending ? "var(--orange)" : "var(--blue)", marginTop: 4, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: w.pending ? "var(--orange)" : "#111" }}>{w.lbl}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{w.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────── STAFF ATTENDANCE ───────────────

function StaffPage() {
  const [page, setPage] = useState(1);
  const all = [
    { name:"Ramesh Gupta", role:"Security Guard", shift:"Morning", st:"Present", sc:"green", time:"08:02 AM" },
    { name:"Suresh Patil", role:"Housekeeping", shift:"Morning", st:"Present", sc:"green", time:"08:15 AM" },
    { name:"Kavita Singh", role:"Receptionist", shift:"Morning", st:"Late", sc:"orange", time:"09:32 AM" },
    { name:"Mohan Nair", role:"Security Guard", shift:"Evening", st:"Absent", sc:"red", time:"—" },
    { name:"Priya Verma", role:"Housekeeping", shift:"Morning", st:"Present", sc:"green", time:"07:55 AM" },
    { name:"Ajay Sharma", role:"Plumber", shift:"Morning", st:"Present", sc:"green", time:"08:30 AM" },
    { name:"Ritu Mehta", role:"Admin Staff", shift:"Morning", st:"Present", sc:"green", time:"09:01 AM" },
    { name:"Deepak Joshi", role:"Security Guard", shift:"Night", st:"Present", sc:"green", time:"10:00 PM" },
    { name:"Sunita Das", role:"Housekeeping", shift:"Morning", st:"Late", sc:"orange", time:"09:45 AM" },
    { name:"Vikas Rao", role:"Maintenance", shift:"Morning", st:"Absent", sc:"red", time:"—" },
  ];
  const per = 5, total = Math.ceil(all.length / per);
  const rows = all.slice((page-1)*per, page*per);

  return (
    <div className="pg">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h4 style={{ fontWeight: 800, fontSize: 22, margin: 0 }}>Staff Attendance</h4>
        <div style={{ display: "flex", gap: 10 }}>
          <input type="date" className="input" defaultValue="2025-12-14" style={{ width: "auto" }} />
          <button className="btn btn-outline">⬇ Export</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[["48","Present","tile-green"],["2","Absent","tile-red"],["3","Late","tile-orange"],["50","Total Staff","tile-blue"]].map(([v,l,cls]) => (
          <div key={l} className={`tile ${cls}`}>
            <div className="tile-val">{v}</div>
            <div className="tile-label">{l}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>{["Name","Role","Shift","Status","Time In"].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((s,i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td style={{ color: "var(--muted)" }}>{s.role}</td>
                  <td><Badge label={s.shift} c="gray" /></td>
                  <td><Badge label={s.st} c={s.sc} /></td>
                  <td style={{ color: s.st === "Absent" ? "var(--muted)" : "#111" }}>{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={total} onChange={setPage} />
      </div>
    </div>
  );
}

function PlaceholderPage({ label }) {
  return (
    <div className="pg" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, color: "var(--muted)" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🏗</div>
      <h5 style={{ fontWeight: 700 }}>{label}</h5>
      <p style={{ fontSize: 13 }}>This page is coming soon.</p>
    </div>
  );
}

// ─────────────── NAV DATA ───────────────

const NAV = [
  { sec:"Dashboards", items:[{ id:"overview", icon:"⊞", label:"Overview" }] },
  { sec:"Communication", items:[
    { id:"broadcasting", icon:"📢", label:"Broadcasting" },
    { id:"noticeboard", icon:"📋", label:"Notice Board" },
    { id:"polls", icon:"📊", label:"Polls & Voting" },
  ]},
  { sec:"Member Masters", items:[
    { id:"addmember", icon:"👤", label:"Add Member" },
    { id:"transfer", icon:"🔄", label:"Transfer Member" },
  ]},
  { sec:"Accounts", items:[
    { id:"accounts", icon:"📒", label:"Accounts", star:true },
  ]},
  { sec:"Administration", items:[
    { id:"documents", icon:"📄", label:"Documents & NOC" },
    { id:"flattransfer", icon:"🏠", label:"Flat Transfer" },
    { id:"registers", icon:"📔", label:"Registers" },
    { id:"rules", icon:"⚖️", label:"Rules & By-laws" },
  ]},
  { sec:"Operations", items:[
    { id:"complaints", icon:"🚨", label:"Complaints" },
    { id:"parking", icon:"🚗", label:"Parking" },
    { id:"rentals", icon:"🏢", label:"Rentals & Tenants" },
    { id:"staff", icon:"👥", label:"Staff Attendance" },
  ]},
];

const TITLES = {
  overview:["Dashboards","Overview"],
  broadcasting:["Communication","Broadcasting"],
  noticeboard:["Communication","Notice Board"],
  polls:["Communication","Polls & Voting"],
  addmember:["Member Masters","Add Member"],
  transfer:["Member Masters","Transfer Member"],
  accounts:["Accounts","Accounts"],
  documents:["Administration","Documents & NOC"],
  flattransfer:["Administration","Flat Transfer"],
  registers:["Administration","Registers"],
  rules:["Administration","Rules & By-laws"],
  complaints:["Operations","Complaints"],
  parking:["Operations","Parking"],
  rentals:["Operations","Rentals & Tenants"],
  staff:["Operations","Staff Attendance"],
};

const PAGES = {
  overview: <OverviewPage />,
  broadcasting: <BroadcastingPage />,
  noticeboard: <NoticeBoardPage />,
  polls: <PollsPage />,
  addmember: <AddMemberPage />,
  transfer: <PlaceholderPage label="Transfer Member" />,
  accounts: <PlaceholderPage label="Accounts" />,
  documents: <DocumentsPage />,
  flattransfer: <FlatTransferPage />,
  registers: <RegistersPage />,
  rules: <RulesPage />,
  complaints: <ComplaintsPage />,
  parking: <PlaceholderPage label="Parking" />,
  rentals: <PlaceholderPage label="Rentals & Tenants" />,
  staff: <StaffPage />,
};

// ─────────────── ROOT APP ───────────────

export default function App() {
  const [active, setActive] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!document.getElementById("bs-link")) {
      const l = document.createElement("link");
      l.id = "bs-link"; l.rel = "stylesheet";
      l.href = "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css";
      document.head.insertBefore(l, document.head.firstChild);
    }
    if (!document.getElementById("app-css")) {
      const s = document.createElement("style");
      s.id = "app-css"; s.textContent = CSS;
      document.head.appendChild(s);
    }
  }, []);

  const [sec, pg] = TITLES[active] || ["",""];

  return (
    <div className="shell">
      {/* SIDEBAR */}
      <nav className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sb-logo">
          <div className="sb-logo-icon">GV</div>
          <div className="sb-logo-text">GreenValley</div>
        </div>
        <div className="sb-nav">
          {NAV.map(({ sec: section, items }) => (
            <div key={section}>
              <div className="sb-section">{section}</div>
              {items.map(item => (
                <button
                  key={item.id}
                  className={`sb-item ${active === item.id ? "active" : ""}`}
                  onClick={() => setActive(item.id)}
                >
                  <span className="sb-icon">{item.icon}</span>
                  <span className="sb-label">
                    {item.label}
                    {item.star && <span style={{ color: "var(--red)", marginLeft: 4 }}>*</span>}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </nav>

      {/* MAIN */}
      <div className="main">
        <header className="topbar">
          <button className="topbar-toggle" onClick={() => setCollapsed(c => !c)}>☰</button>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ color: "var(--muted)" }}>{sec}</span>
            <span style={{ color: "var(--muted)" }}>/</span>
            <span className="tx-blue" style={{ fontWeight: 600 }}>{pg}</span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>14 Dec 2025</span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>📅</span>
            <button className="tb-icon-btn">
              🔔
              <span className="tb-notif-dot" />
            </button>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>🔍</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="tb-avatar">KS</div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Karan Sharma</span>
            </div>
          </div>
        </header>

        <main className="page" key={active}>
          {PAGES[active] ?? <PlaceholderPage label={pg} />}
        </main>
      </div>
    </div>
  );
}