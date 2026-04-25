import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────
   ALL CSS lives in this single template string.
   Injected once into <head> via useEffect.
───────────────────────────────────────────── */
const APP_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  --bs-body-font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  --accent:       #2563eb;
  --accent-lt:    #dbeafe;
  --accent-dk:    #1d4ed8;
  --dark:         #0f172a;
  --success:      #16a34a;
  --success-lt:   #dcfce7;
  --warning:      #d97706;
  --warning-lt:   #fff7ed;
  --danger:       #dc2626;
  --danger-lt:    #fee2e2;
  --border:       #e2e8f0;
  --muted:        #64748b;
  --bg:           #f1f5f9;
  --card:         #ffffff;
  --text:         #0f172a;
  --sidebar-w:    228px;
  --topbar-h:     58px;
  --radius:       12px;
  --radius-lg:    16px;
}

*, *::before, *::after { box-sizing: border-box; }
html, body, #root      { height: 100%; margin: 0; }
body {
  background: var(--bg);
  font-family: var(--bs-body-font-family);
  color: var(--text);
  font-size: 14px;
}

/* ── LAYOUT ─────────────────────────────────── */
.app-shell  { display: flex; height: 100vh; overflow: hidden; }
.main-area  { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.page-wrap  { flex: 1; overflow-y: auto; padding: 24px; }

/* ── SIDEBAR ─────────────────────────────────── */
.sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  background: var(--card);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  overflow: hidden;
  transition: width .22s ease;
}
.sidebar.collapsed { width: 64px; }

.sidebar-logo {
  height: var(--topbar-h);
  padding: 0 16px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 10px;
  flex-shrink: 0;
}
.logo-box {
  width: 34px; height: 34px; border-radius: 9px;
  background: var(--accent); color: #fff;
  display: grid; place-items: center;
  font-size: 13px; font-weight: 800; flex-shrink: 0;
}
.logo-name { font-weight: 800; font-size: 15px; line-height: 1.2; white-space: nowrap; }
.logo-sub  { font-size: 10px; color: var(--muted); white-space: nowrap; }
.sidebar.collapsed .logo-name,
.sidebar.collapsed .logo-sub { display: none; }

.sidebar-nav { flex: 1; overflow-y: auto; padding: 8px 0; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }

.nav-section {
  padding: 10px 16px 3px;
  font-size: 10px; font-weight: 700;
  color: var(--muted); letter-spacing: .08em;
  text-transform: uppercase; white-space: nowrap;
}
.sidebar.collapsed .nav-section { display: none; }

.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 16px;
  cursor: pointer; font-size: 13px; font-weight: 500;
  color: var(--text); border: none; background: none;
  width: 100%; text-align: left;
  border-left: 3px solid transparent;
  transition: background .13s, color .13s;
  white-space: nowrap; overflow: hidden;
}
.nav-item:hover  { background: #f8fafc; color: var(--accent); }
.nav-item.active {
  background: var(--accent-lt); color: var(--accent);
  font-weight: 700; border-left-color: var(--accent);
}
.nav-item .ni    { font-size: 16px; flex-shrink: 0; width: 22px; text-align: center; }
.sidebar.collapsed .nav-item { justify-content: center; padding: 11px 0; border-left: none; }
.sidebar.collapsed .nl       { display: none; }

/* ── TOPBAR ─────────────────────────────────── */
.topbar {
  height: var(--topbar-h);
  background: var(--card);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center;
  padding: 0 24px; gap: 14px;
  flex-shrink: 0;
}
.tb-toggle { background: none; border: none; cursor: pointer; font-size: 20px; color: var(--muted); }
.tb-bread  { flex: 1; }
.tb-sec    { font-size: 11px; color: var(--muted); line-height: 1.2; }
.tb-page   { font-size: 14px; font-weight: 700; line-height: 1.2; }
.tb-right  { display: flex; align-items: center; gap: 14px; margin-left: auto; }
.tb-date   { font-size: 12px; color: var(--muted); }
.tb-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--accent); color: #fff;
  display: grid; place-items: center;
  font-size: 14px; border: none; cursor: pointer;
}
.tb-name { font-size: 13px; font-weight: 600; }

/* ── CARD ────────────────────────────────────── */
.sv-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
}

/* ── STAT CARD ──────────────────────────────── */
.stat-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; }
.s-label   { font-size: 12px; color: var(--muted); margin-bottom: 4px; }
.s-val     { font-size: 26px; font-weight: 800; line-height: 1.1; }

/* ── BADGE ───────────────────────────────────── */
.bx        { display: inline-flex; align-items: center; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
.bx-green  { background: var(--success-lt); color: #15803d; }
.bx-red    { background: var(--danger-lt);  color: #b91c1c; }
.bx-orange { background: var(--warning-lt); color: #c2410c; }
.bx-blue   { background: var(--accent-lt);  color: #1d4ed8; }
.bx-gray   { background: #f1f5f9;           color: #475569; }
.bx-purple { background: #ede9fe;           color: #5b21b6; }

/* ── TAB PILLS ──────────────────────────────── */
.tab-pills { display: flex; gap: 6px; flex-wrap: wrap; }
.tab-pill  { padding: 7px 18px; border-radius: 30px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; background: #f1f5f9; color: var(--muted); transition: .13s; }
.tab-pill.t-dark { background: var(--dark);   color: #fff; }
.tab-pill.t-blue { background: var(--accent); color: #fff; }

/* ── BUTTONS ─────────────────────────────────── */
.btn-ac { background: var(--accent); color: #fff; border: none; border-radius: 10px; padding: 9px 20px; font-weight: 700; font-size: 13px; cursor: pointer; font-family: inherit; }
.btn-ac:hover { background: var(--accent-dk); }
.btn-ol { background: #fff; color: var(--text); border: 1px solid var(--border); border-radius: 10px; padding: 8px 18px; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; }
.btn-ol:hover { background: #f8fafc; }
.btn-dk { background: var(--dark); color: #fff; border: none; border-radius: 10px; padding: 9px 20px; font-weight: 700; font-size: 13px; cursor: pointer; font-family: inherit; }
.btn-ok { background: var(--success); color: #fff; border: none; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-er { background: var(--danger);  color: #fff; border: none; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }

/* ── INPUTS ─────────────────────────────────── */
.sv-in, .sv-sel, .sv-ta {
  width: 100%; padding: 9px 14px;
  border: 1px solid var(--border); border-radius: 10px;
  font-size: 13px; font-family: inherit;
  background: #fff; color: var(--text);
  outline: none; transition: border-color .15s;
}
.sv-in:focus, .sv-sel:focus, .sv-ta:focus { border-color: var(--accent); }
.sv-ta { resize: vertical; min-height: 90px; }
.sv-lb { font-size: 13px; font-weight: 600; margin-bottom: 5px; display: block; }

/* ── TABLE ───────────────────────────────────── */
.sv-tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
.sv-tbl thead tr { background: #f8fafc; }
.sv-tbl th { padding: 11px 16px; font-weight: 600; color: var(--muted); text-align: left; white-space: nowrap; }
.sv-tbl td { padding: 12px 16px; border-top: 1px solid var(--border); vertical-align: middle; }
.sv-tbl tbody tr:hover { background: #fafafa; }

/* ── PAGINATION ─────────────────────────────── */
.pag-wrap { display: flex; align-items: center; gap: 4px; }
.pag-btn  { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: #fff; font-size: 13px; font-weight: 500; display: grid; place-items: center; cursor: pointer; transition: .13s; color: var(--text); font-family: inherit; }
.pag-btn:hover   { background: #f1f5f9; }
.pag-btn.pg-on   { background: var(--accent); color: #fff; border-color: var(--accent); font-weight: 700; }
.pag-btn:disabled { opacity: .4; cursor: not-allowed; }
.pag-info { font-size: 13px; color: var(--muted); }

/* ── PROGRESS ───────────────────────────────── */
.sv-prog { height: 7px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
.sv-prog-bar { height: 100%; border-radius: 4px; }

/* ── TILE STATS ─────────────────────────────── */
.tile      { border-radius: var(--radius); padding: 14px 18px; }
.tile-red  { background: var(--danger-lt);  }
.tile-grn  { background: var(--success-lt); }
.tile-org  { background: var(--warning-lt); }
.tile-blu  { background: var(--accent-lt);  }
.tile-val  { font-size: 26px; font-weight: 800; line-height: 1; margin-bottom: 2px; }
.tile-lbl  { font-size: 12px; }
.tile-red .tile-val, .tile-red .tile-lbl   { color: var(--danger);  }
.tile-grn .tile-val, .tile-grn .tile-lbl   { color: var(--success); }
.tile-org .tile-val, .tile-org .tile-lbl   { color: #c2410c; }
.tile-blu .tile-val, .tile-blu .tile-lbl   { color: var(--accent);  }

/* ── QUICK ACTION ───────────────────────────── */
.qa {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 14px; border-radius: 10px;
  background: #f8fafc; cursor: pointer; border: none;
  width: 100%; text-align: left; font-family: inherit;
  transition: background .13s;
}
.qa:hover  { background: #f1f5f9; }
.qa-ico    { width: 38px; height: 38px; border-radius: 9px; display: grid; place-items: center; font-size: 18px; flex-shrink: 0; }

/* ── MISC ───────────────────────────────────── */
.upload-zone { border: 2px dashed var(--border); border-radius: 10px; padding: 28px; text-align: center; color: var(--muted); cursor: pointer; transition: border-color .13s; }
.upload-zone:hover { border-color: var(--accent); }
.letter-box { border: 1px solid var(--border); border-radius: 10px; padding: 16px; font-size: 12px; line-height: 1.8; }
.mod-box    { background: #f8fafc; border-radius: 10px; padding: 13px; margin-bottom: 12px; }
.noc-card   { border: 1px solid var(--border); border-radius: 12px; padding: 20px; cursor: pointer; height: 100%; transition: box-shadow .15s; }
.noc-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); }
.noc-ico    { width: 50px; height: 50px; border-radius: 12px; display: grid; place-items: center; font-size: 22px; margin-bottom: 12px; }
.owner-bg   { background: #f0f7ff; border-radius: 10px; padding: 14px; }
.dot        { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.dot-grn    { background: var(--success); }
.dot-org    { background: #f97316; }
.dot-red    { background: var(--danger); }
.dot-blu    { background: var(--accent); }
.divider    { border: none; border-top: 1px solid var(--border); margin: 10px 0; }
.tx-muted   { color: var(--muted) !important; }
.tx-accent  { color: var(--accent) !important; }
.tx-success { color: var(--success) !important; }
.tx-danger  { color: var(--danger) !important; }
.tx-warning { color: var(--warning) !important; }

/* ── STEPPER ─────────────────────────────────── */
.stepper-row { display: flex; }
.step-col    { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; }
.step-circle { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; font-size: 13px; font-weight: 700; flex-shrink: 0; position: relative; z-index: 1; }
.step-line   { position: absolute; top: 15px; left: 50%; right: -50%; height: 2px; z-index: 0; }
.step-lbl    { font-size: 11px; margin-top: 6px; text-align: center; }

/* ── FADE-IN ─────────────────────────────────── */
@keyframes fadein { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
.pg { animation: fadein .2s ease; }

@media (max-width: 768px) {
  :root { --sidebar-w: 200px; }
  .sidebar.collapsed { width: 0; overflow: hidden; }
  .page-wrap { padding: 16px; }
}
`;

/* ══ REUSABLE ══════════════════════════════════ */
function Badge({ label, c = "gray" }) {
  return <span className={`bx bx-${c}`}>{label}</span>;
}

function Pagination({ page, total, onChange }) {
  return (
    <div className="d-flex justify-content-between align-items-center px-3 py-2" style={{ borderTop: "1px solid var(--border)" }}>
      <span className="pag-info">Page {page} of {total}</span>
      <div className="pag-wrap">
        <button className="pag-btn" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
        {Array.from({ length: total }, (_, i) => i + 1).map(n => (
          <button key={n} className={`pag-btn ${page === n ? "pg-on" : ""}`} onClick={() => onChange(n)}>{n}</button>
        ))}
        <button className="pag-btn" disabled={page === total} onClick={() => onChange(page + 1)}>›</button>
      </div>
    </div>
  );
}

function Prog({ pct, color = "var(--success)" }) {
  return <div className="sv-prog"><div className="sv-prog-bar" style={{ width: `${pct}%`, background: color }} /></div>;
}

/* ══ OVERVIEW ══════════════════════════════════ */
function OverviewPage() {
  const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const ap = [54,29,54,99,52,46,15,64,33,64,23,93];
  const pe = [48,25,56,94,52,45,13,81,30,30,55,45];
  const re = [24,10,39,40,50,40,29,75,77,89,26,33];

  return (
    <div className="pg">
      <h2 style={{ fontWeight: 800, fontSize: 30, marginBottom: 2 }}>Welcome Back!</h2>
      <p className="tx-muted mb-4" style={{ fontSize: 13 }}>Your Overview Statistics</p>

      <div className="row g-3 mb-4">
        {[["Active Complaints","14"],["Visits","3,671"],["Pending Approvals","156"],["Staff Present","48/50"]].map(([l,v]) => (
          <div className="col-6 col-md-3" key={l}>
            <div className="stat-card"><div className="s-label">{l}</div><div className="s-val">{v}</div></div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-8">
          <div className="sv-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex gap-3">
                {[["#818cf8","Approved"],["#fb923c","Pending"],["#f87171","Rejected"]].map(([c,l]) => (
                  <span key={l} className="d-flex align-items-center gap-1" style={{ fontSize: 12 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: "inline-block" }} /> {l}
                  </span>
                ))}
              </div>
              <span className="btn-ol py-1 px-2" style={{ fontSize: 12 }}>F.Y. 2025 ▾</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 140 }}>
              {mo.map((m,i) => (
                <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 1, width: "100%" }}>
                    {[[ap[i],"#818cf8"],[pe[i],"#fb923c"],[re[i],"#f87171"]].map(([v,c],j) => (
                      <div key={j} style={{ flex: 1, background: c, borderRadius: "2px 2px 0 0", height: `${(v/100)*100}%`, minHeight: 3 }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>{m}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="sv-card h-100 d-flex flex-column">
            <div className="d-flex gap-3 mb-2 flex-wrap">
              {[["#818cf8","Approved"],["#fb923c","Pending"],["#f87171","Rejected"]].map(([c,l]) => (
                <span key={l} className="d-flex align-items-center gap-1" style={{ fontSize: 11 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block" }} /> {l}
                </span>
              ))}
            </div>
            <div className="d-flex justify-content-center align-items-center flex-grow-1">
              <svg viewBox="0 0 200 200" width="170" height="170">
                {[.32,.5,.67,.84].map((s,i) => (
                  <polygon key={i} points="100,20 180,70 160,160 40,160 20,70"
                    style={{ fill:"none", stroke:"#e2e8f0", strokeWidth:1,
                      transform:`scale(${s}) translate(${-100*(1-s)}px,${-100*(1-s)}px)`,
                      transformOrigin:"100px 100px" }} />
                ))}
                <polygon points="100,30 165,75 150,155 50,155 35,75" style={{ fill:"rgba(129,140,248,.3)", stroke:"#818cf8", strokeWidth:1.5 }} />
                <polygon points="100,45 155,80 145,145 55,145 45,80" style={{ fill:"rgba(251,146,60,.3)",  stroke:"#fb923c", strokeWidth:1.5 }} />
                <polygon points="100,60 140,90 132,138 68,138 60,90" style={{ fill:"rgba(248,113,113,.3)", stroke:"#f87171", strokeWidth:1.5 }} />
                {mo.map((lb,i) => { const a=(i/12)*2*Math.PI-Math.PI/2; return <text key={lb} x={100+90*Math.cos(a)} y={100+90*Math.sin(a)} fontSize="8" fill="var(--muted)" textAnchor="middle" dominantBaseline="middle">{lb}</text>; })}
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="sv-card p-0 overflow-hidden">
        {[
          { title:"Tenant Agreement Verification", sub:"Unit 402 • Rahul Sharma (Tenant)", badge:"Pending Verify", bc:"orange" },
          { title:"Interior Renovation Request",   sub:"Unit 105 • Painting & Flooring",   badge:"Review Docs",   bc:"blue"   },
          { title:"NOC for Bank Loan – Flat C-201",sub:"Unit C-201 • Priya Mehta (Owner)", badge:"Approved",      bc:"green"  },
        ].map((p,i,arr) => (
          <div key={i} className="d-flex justify-content-between align-items-center px-4 py-3"
               style={{ borderBottom: i < arr.length-1 ? "1px solid var(--border)" : "none" }}>
            <div>
              <div style={{ fontWeight: 600 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.sub}</div>
            </div>
            <Badge label={p.badge} c={p.bc} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══ BROADCASTING ══════════════════════════════ */
function BroadcastingPage() {
  const [tab, setTab] = useState("Announcement");

  return (
    <div className="pg row g-4">
      <div className="col-12 col-lg-8">
        <div className="sv-card">
          <h5 style={{ fontWeight: 800, marginBottom: 20 }}>📢 Create &amp; Publish</h5>
          <div className="tab-pills mb-4">
            {["Announcement","Emergency","Circular","Event"].map(t => (
              <button key={t} className={`tab-pill ${tab===t?"t-dark":""}`} onClick={()=>setTab(t)}>{t}</button>
            ))}
          </div>

          <label className="sv-lb">Subject / Title</label>
          <input className="sv-in mb-3" placeholder="Example: Scheduled Maintenance of Lift B" />

          <label className="sv-lb">Content</label>
          <div style={{ border:"1px solid var(--border)", borderRadius:10, marginBottom:16 }}>
            <div style={{ borderBottom:"1px solid var(--border)", padding:"8px 12px", display:"flex", gap:10 }}>
              {["B","I","U","≡","≔","🔗"].map(b => <button key={b} style={{ background:"none", border:"none", cursor:"pointer", fontWeight:b==="B"?800:400, fontSize:14 }}>{b}</button>)}
            </div>
            <textarea className="sv-ta" placeholder="Type your announcement details here…" style={{ border:"none", borderRadius:"0 0 10px 10px" }} />
          </div>

          <label className="sv-lb">Attachment (Optional)</label>
          <div className="upload-zone mb-4">
            <div style={{ fontSize:28 }}>☁️</div>
            <div style={{ fontWeight:600, fontSize:13 }}>Click to upload or drag files here</div>
            <div style={{ fontSize:12, color:"var(--muted)" }}>PDF, JPG, PNG up to 10 MB</div>
          </div>

          <label className="sv-lb">Broadcasting Channels</label>
          <div className="d-flex gap-2 mb-4">
            <span className="bx bx-blue">☑ App Notification</span>
            <span className="bx bx-gray">⊕ Add Channel</span>
          </div>

          <div className="d-flex gap-4 mb-4" style={{ fontSize:13 }}>
            <label className="d-flex align-items-center gap-2"><input type="radio" defaultChecked />Send Now</label>
            <label className="d-flex align-items-center gap-2"><input type="radio" />Schedule for later</label>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <button className="btn-ol">Preview</button>
            <button className="btn-ol">Save Draft</button>
            <button className="btn-ac">Publish ✈</button>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-4">
        <div className="sv-card mb-3">
          <h6 style={{ fontWeight:700, marginBottom:12 }}>Notifications</h6>
          {[
            { lbl:"Committee Meeting",              time:"Today, 08:00 PM",  dot:"dot-org" },
            { lbl:"New user registered.",            time:"59 minutes ago",   dot:"dot-blu" },
            { lbl:"Mr. Roy Sing update notice board",time:"1 hour ago",       dot:"dot-org" },
            { lbl:"Complaint by Riya Mittal",        time:"Today, 10:59 AM",  dot:"dot-red" },
          ].map((n,i) => (
            <div key={i} className="d-flex gap-2 align-items-start mb-2">
              <span className={`dot ${n.dot}`} style={{ marginTop:5 }} />
              <div>
                <div style={{ fontSize:13, fontWeight:500 }}>{n.lbl}</div>
                <div style={{ fontSize:11, color:"var(--muted)" }}>{n.time}</div>
              </div>
            </div>
          ))}
          <button className="btn-dk w-100 mt-2">Show all notifications</button>
        </div>

        <div className="sv-card mb-3">
          <h6 style={{ fontWeight:700, marginBottom:12 }}>Quick Actions</h6>
          {[["➕","New Notice","#dbeafe"],["📊","Create Poll","#ffedd5"],["📄","Issue NOC","#ede9fe"]].map(([ic,lb,bg]) => (
            <button key={lb} className="qa mb-2">
              <div className="qa-ico" style={{ background:bg }}>{ic}</div>
              <span style={{ fontWeight:600, fontSize:13 }}>{lb}</span>
            </button>
          ))}
        </div>

        <div className="sv-card">
          <h6 style={{ fontWeight:700, marginBottom:12 }}>Recent Communications</h6>
          {[
            { title:"Water Supply Cut",       time:"Today, 10:30 AM", type:"Alert",        s:"Sent",      sc:"green" },
            { title:"New Year Event",          time:"Dec 31, 08:00 PM",type:"Invitation",   s:"Scheduled", sc:"blue"  },
            { title:"Parking Lot Resurfacing", time:"Edited 2h ago",   type:"Announcement", s:"Draft",     sc:"gray"  },
          ].map((r,i,arr) => (
            <div key={i} className="d-flex justify-content-between align-items-center py-2"
                 style={{ borderBottom: i<arr.length-1?"1px solid var(--border)":"none" }}>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{r.title}</div>
                <div style={{ fontSize:11, color:"var(--muted)" }}>{r.time} • {r.type}</div>
              </div>
              <Badge label={r.s} c={r.sc} />
            </div>
          ))}
          <button className="btn-dk w-100 mt-3">Show all communication</button>
        </div>
      </div>
    </div>
  );
}

/* ══ NOTICE BOARD ══════════════════════════════ */
function NoticeBoardPage() {
  const [tab, setTab] = useState("All Posts");
  const posts = [
    { icon:"📢", title:"AGM 2025 Date Rescheduled",        tag:"Official",    tc:"blue",   author:"Sara Sharan",               time:"2 hours ago",  views:"128 views",  content:"Due to unforeseen weather conditions, the AGM is postponed to Nov 12th at 5 PM in the Clubhouse." },
    { icon:"💬", title:"Water Seepage in Block B Basement", tag:"Discussion",  tc:"orange", author:"Raj Singh (B-402)",          time:"Yesterday",    comments:"14",      locked:true, content:"There is a significant leak near pillar 14. Can the maintenance team prioritize this?" },
    { icon:"👥", title:"Diwali Decoration Volunteers",      tag:"Discussion",  tc:"orange", author:"Priya Desai (Cultural Comm.)",time:"5 hours ago",  comments:"8",       content:"Looking for enthusiastic residents to help with rangoli and lighting for Diwali celebrations." },
    { icon:"📋", title:"Found: Car Keys near Gate 2",       tag:"Lost & Found",tc:"blue",   author:"Security Office",           time:"30 min ago",   content:"A set of Honda car keys was found near Gate 2. Please collect from security." },
  ];

  return (
    <div className="pg row g-4">
      <div className="col-12 col-lg-8">
        <div className="sv-card">
          <div className="tab-pills mb-4">
            {["All Posts","Official","Discussions","Archived"].map(t => (
              <button key={t} className={`tab-pill ${tab===t?"t-blue":""}`} onClick={()=>setTab(t)}>{t}</button>
            ))}
          </div>
          {posts.map((p,i,arr) => (
            <div key={i} style={{ padding:"14px 0", borderBottom: i<arr.length-1?"1px solid var(--border)":"none" }}>
              <div className="d-flex gap-3">
                <div style={{ width:40, height:40, borderRadius:"50%", background:"#f1f5f9", display:"grid", placeItems:"center", fontSize:18, flexShrink:0 }}>{p.icon}</div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                    <span style={{ fontWeight:700, fontSize:14 }}>{p.title}</span>
                    <Badge label={p.tag} c={p.tc} />
                    {p.locked && <span style={{ fontSize:11, color:"var(--danger)", fontWeight:600 }}>🔒 Thread Locked</span>}
                  </div>
                  <p style={{ fontSize:13, color:"#374151", marginBottom:4 }}>{p.content}</p>
                  <div style={{ fontSize:11, color:"var(--muted)" }}>
                    👤 {p.author} • {p.time}
                    {p.views    && ` • 👁 ${p.views}`}
                    {p.comments && ` • 💬 ${p.comments} Comments`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 col-lg-4">
        <div className="sv-card mb-3">
          <div className="row g-0 text-center">
            {[["24","Active notices",""],["3","Pending Review","tx-danger"],["156","Comments Today",""],["12","New Threads",""]].map(([v,l,cls],i) => (
              <div key={l} className="col-6 py-3" style={{ borderBottom:i<2?"1px solid var(--border)":"none", borderRight:i%2===0?"1px solid var(--border)":"none" }}>
                <div className={`${cls}`} style={{ fontWeight:800, fontSize:22 }}>{v}</div>
                <div style={{ fontSize:11, color:"var(--muted)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sv-card">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span>⚠️</span>
            <h6 style={{ fontWeight:700, marginBottom:0 }}>Moderation Queue (3)</h6>
          </div>
          {[
            { name:"Raj Singh (A-612)",  time:"10m ago", text:"Why is the gym AC never working?…" },
            { name:"Neha Verma (C-501)", time:"45m ago", text:"Selling my old sofa set. Price negotiable. Contact me at 98765…" },
          ].map((m,i) => (
            <div key={i} className="mod-box">
              <div className="d-flex justify-content-between mb-1">
                <span style={{ fontWeight:700, fontSize:13 }}>{m.name}</span>
                <span style={{ fontSize:11, color:"var(--muted)" }}>{m.time}</span>
              </div>
              <p style={{ fontSize:12, color:"#374141", marginBottom:10 }}>"{m.text}"</p>
              <div className="d-flex gap-2">
                <button className="btn-ok flex-grow-1">Approve</button>
                <button className="btn-er flex-grow-1">Reject</button>
              </div>
            </div>
          ))}
          <button className="btn-ac w-100">Show all moderation</button>
        </div>
      </div>
    </div>
  );
}

/* ══ POLLS & VOTING ════════════════════════════ */
function PollsPage() {
  const [tab, setTab] = useState("Active");
  const polls = [
    { icon:"📊", title:"AGM 2025 : Approval of Annual Accounts",  id:"#POLL-2024-004", meta:"Started: 2 days ago", ends:"Ends in 24h", endRed:true, tags:["AGM Voting","One Vote per Flat","Secret Ballot"], status:"Live Voting", sc:"green", pct:78, votes:"234 / 300" },
    { icon:"🔧", title:"Gym Equipment Upgrade Proposal",          id:"#POLL-2024-005", meta:"Started: 5 hours ago", ends:"Ends in 5 days", tags:["Infrastructure","Per Member","Open Ballot"], status:"Live Voting", sc:"green", pct:12, votes:"36 / 300" },
    { icon:"☑",  title:"Q3 Maintenance Charge Hike (10%)",        id:"#POLL-2024-003", meta:"Ended: Oct 15, 2024", tags:["Finance","One Vote per Flat","Approved"], status:"Closed", sc:"gray", result:true, votes:"280 Total" },
    { icon:"🗓", title:"Visitor Parking Policy Revision",         id:"#POLL-2024-006", meta:"Starts: Nov 20, 2024 (10:00 AM)", tags:["Rules & Regulations","Per Member"], status:"Scheduled", sc:"orange" },
  ];

  return (
    <div className="pg row g-4">
      <div className="col-12 col-lg-8">
        <div className="d-flex gap-2 flex-wrap mb-3 align-items-center">
          <div className="tab-pills">
            {["Active","Scheduled","Closed","Drafts"].map(t => (
              <button key={t} className={`tab-pill ${tab===t?"t-dark":""}`} onClick={()=>setTab(t)}>{t}</button>
            ))}
          </div>
          <input className="sv-in ms-auto" placeholder="Search polls…" style={{ maxWidth:180 }} />
          <button className="btn-ac">+ Create Poll</button>
        </div>

        {polls.map((p,i) => (
          <div key={i} className="sv-card mb-3 p-3">
            <div className="d-flex gap-3 align-items-start">
              <div style={{ width:44, height:44, borderRadius:10, background:"#f1f5f9", display:"grid", placeItems:"center", fontSize:22, flexShrink:0 }}>{p.icon}</div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                  <span style={{ fontWeight:700, fontSize:14 }}>{p.title}</span>
                  <Badge label={`● ${p.status}`} c={p.sc} />
                </div>
                <div style={{ fontSize:12, color:"var(--muted)", marginBottom:8 }}>
                  {p.id} • {p.meta}
                  {p.ends && <> • <span style={{ color:p.endRed?"var(--danger)":"var(--muted)", fontWeight:p.endRed?600:400 }}>{p.ends}</span></>}
                </div>
                <div className="d-flex gap-1 flex-wrap mb-2">
                  {p.tags.map(t => <span key={t} style={{ fontSize:11, padding:"2px 8px", border:"1px solid var(--border)", borderRadius:4, background:"#f8fafc", color:"var(--muted)" }}>{t}</span>)}
                </div>
                {p.pct !== undefined && (
                  <>
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize:12 }}>
                      <span style={{ fontWeight:600 }}>{p.pct}% Participation</span>
                      <span className="tx-muted">{p.votes} Votes</span>
                    </div>
                    <Prog pct={p.pct} color={p.pct>50?"var(--success)":"var(--accent)"} />
                  </>
                )}
                {p.result && (
                  <>
                    <div style={{ fontSize:12, marginBottom:4 }}>Result: <span className="tx-success" style={{ fontWeight:600 }}>Yes (65%)</span> vs No (35%) &nbsp;<span className="tx-muted">{p.votes}</span></div>
                    <Prog pct={65} color="var(--accent)" />
                  </>
                )}
              </div>
              <div className="d-flex gap-2 align-items-center flex-shrink-0">
                {p.status !== "Scheduled" && <button className="btn-ol py-1 px-3" style={{ fontSize:12 }}>{p.status==="Closed"?"View Report":"Analytics"}</button>}
                {p.status === "Scheduled" && <button className="btn-ol py-1 px-3" style={{ fontSize:12 }}>Edit</button>}
                <span className="tx-muted" style={{ cursor:"pointer" }}>⋮</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="col-12 col-lg-4">
        <div className="sv-card mb-3">
          <h6 style={{ fontWeight:700, marginBottom:12 }}>🗳 Voting Overview</h6>
          <div className="row g-0 text-center">
            {[["2","Active Polls",""],["85%","Avg Turnout",""],["12","Total Polls (YTD)",""],["98%","Digital Adoption","tx-success"]].map(([v,l,cls],i) => (
              <div key={l} className="col-6 py-3" style={{ borderBottom:i<2?"1px solid var(--border)":"none", borderRight:i%2===0?"1px solid var(--border)":"none" }}>
                <div className={cls} style={{ fontWeight:800, fontSize:22 }}>{v}</div>
                <div style={{ fontSize:11, color:"var(--muted)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sv-card mb-3">
          <h6 style={{ fontWeight:700, marginBottom:12 }}>⚡ Quick Create</h6>
          {[["👥","AGM Voting","One vote per flat"],["🔧","Swimming Pool Rules","Financial approval"],["⚖️","Rule Change","Amend by-laws"]].map(([ic,lb,sub]) => (
            <button key={lb} className="qa mb-2">
              <div className="qa-ico" style={{ background:"#f1f5f9" }}>{ic}</div>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{lb}</div>
                <div style={{ fontSize:11, color:"var(--muted)" }}>{sub}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="sv-card">
          <h6 style={{ fontWeight:700, marginBottom:12 }}>🗓 Upcoming Events</h6>
          {[["15","Nov","Committee Election","Nominations close in 2 days"],["01","Dec","Vendor Contract Renewal","Security & Housekeeping"]].map(([d,m,t,s]) => (
            <div key={t} className="d-flex gap-3 align-items-center mb-3">
              <div style={{ background:"var(--accent-lt)", color:"var(--accent)", fontWeight:700, fontSize:12, borderRadius:8, padding:"6px 10px", textAlign:"center", minWidth:44 }}>
                {d}<br/>{m}
              </div>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{t}</div>
                <div style={{ fontSize:11, color:"var(--muted)" }}>{s}</div>
              </div>
            </div>
          ))}
          <button className="btn-dk w-100">Show all upcoming events</button>
        </div>
      </div>
    </div>
  );
}

/* ══ ADD MEMBER ════════════════════════════════ */
function AddMemberPage() {
  const [memType, setMemType] = useState("Owner");
  return (
    <div className="pg d-flex justify-content-center">
      <div className="sv-card" style={{ maxWidth:580, width:"100%" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 style={{ fontWeight:800, marginBottom:0 }}>Add New Member</h5>
          <button style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"var(--muted)" }}>✕</button>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-6">
            <label className="sv-lb">Select Wing</label>
            <select className="sv-sel">
              <option>Select Wing</option>
              {["Wing A","Wing B","Wing C"].map(w=><option key={w}>{w}</option>)}
            </select>
          </div>
          <div className="col-6">
            <label className="sv-lb">Flat / Unit Number</label>
            <select className="sv-sel"><option>Select Unit</option></select>
          </div>
        </div>

        <label className="sv-lb">Membership Type</label>
        <div className="d-flex mb-3 p-1" style={{ background:"#f1f5f9", borderRadius:30 }}>
          {["Owner","Tenant","Family Member"].map(t => (
            <button key={t} onClick={()=>setMemType(t)} style={{ flex:1, padding:"8px 0", border:"none", borderRadius:26, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit",
              background:memType===t?"var(--accent)":"transparent", color:memType===t?"#fff":"var(--muted)" }}>
              {t}
            </button>
          ))}
        </div>

        <div className="row g-3 mb-3">
          <div className="col-6"><label className="sv-lb">First Name</label><input className="sv-in" placeholder="Enter First Name" /></div>
          <div className="col-6"><label className="sv-lb">Last Name</label><input className="sv-in" placeholder="Enter Last Name" /></div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-6">
            <label className="sv-lb">Phone Number</label>
            <div className="d-flex">
              <span style={{ padding:"9px 12px", background:"#f8fafc", border:"1px solid var(--border)", borderRight:"none", borderRadius:"10px 0 0 10px", fontSize:13, color:"var(--muted)" }}>+91</span>
              <input className="sv-in" placeholder="98765 43210" style={{ borderRadius:"0 10px 10px 0", borderLeft:"none" }} />
            </div>
          </div>
          <div className="col-6"><label className="sv-lb">Email Address</label><input className="sv-in" placeholder="Enter Email Address" /></div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-6">
            <label className="sv-lb">Residency Status</label>
            <select className="sv-sel"><option>Select Status</option><option>Resident</option><option>Non-Resident</option></select>
          </div>
          <div className="col-6"><label className="sv-lb">Move-in Date</label><input className="sv-in" type="date" /></div>
        </div>

        <div className="form-check mb-4">
          <input className="form-check-input" type="checkbox" defaultChecked />
          <label className="form-check-label" style={{ fontSize:13 }}>Mark as Primary Member for this unit</label>
        </div>
        <div className="d-flex gap-2 justify-content-end">
          <button className="btn-ol">Cancel</button>
          <button className="btn-ac px-4">Add Member</button>
        </div>
      </div>
    </div>
  );
}

/* ══ DOCUMENTS & NOC ═══════════════════════════ */
function DocumentsPage() {
  const docs = [
    { icon:"✈️", title:"NOC for Passport",      desc:"Address proof and residency confirmation for passport application or renewal.",   meta:"Validity: 6 Months",        bg:"#dbeafe" },
    { icon:"🏦", title:"NOC for Bank Loan",      desc:"Clearance certificate stating no outstanding society dues for loan processing.",  meta:"Processing: 2 Days",         bg:"#dbeafe" },
    { icon:"🔎", title:"Tenant Verification NOC",desc:"Approval for renting out flat to new tenants after police verification check.",   meta:"Requires: Lease Agreement",  bg:"#dcfce7" },
    { icon:"🔄", title:"Ownership Transfer NOC", desc:"Kindly provide required documentation for the official ownership transfer.",       meta:"Validity: 6 Months",        bg:"#ede9fe" },
  ];
  return (
    <div className="pg row g-4">
      <div className="col-12 col-lg-8">
        <div className="sv-card">
          <h5 style={{ fontWeight:800, marginBottom:4 }}>Letters &amp; Certificates</h5>
          <p style={{ color:"var(--muted)", fontSize:13, marginBottom:20 }}>Issue No Objection Certificates (NOC) and other official documents.</p>
          <h6 style={{ fontWeight:700, marginBottom:14 }}>📄 Issue New Document</h6>
          <div className="row g-3 mb-4">
            {docs.map((d,i) => (
              <div className="col-6" key={i}>
                <div className="noc-card">
                  <div className="noc-ico" style={{ background:d.bg }}>{d.icon}</div>
                  <div style={{ fontWeight:700, marginBottom:6 }}>{d.title}</div>
                  <div style={{ fontSize:12, color:"var(--muted)", marginBottom:12 }}>{d.desc}</div>
                  <hr className="divider" />
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="tx-accent" style={{ fontSize:12, fontWeight:600 }}>{d.meta}</span>
                    <span className="tx-accent">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h6 style={{ fontWeight:700, marginBottom:10 }}>🕐 Recently Issued</h6>
          <p style={{ fontSize:13, color:"var(--muted)" }}>No recent documents issued.</p>
        </div>
      </div>

      <div className="col-12 col-lg-4">
        <div className="sv-card">
          <h6 style={{ fontWeight:700, marginBottom:4 }}>Latest Generated</h6>
          <p style={{ fontSize:12, color:"var(--muted)", marginBottom:14 }}>Automatic letterhead &amp; signature applied.</p>
          <div className="letter-box mb-3">
            <div style={{ textAlign:"center", fontWeight:800, fontSize:12, marginBottom:4 }}>GREEN VALLEY CO-OP SOCIETY</div>
            <div style={{ textAlign:"center", color:"var(--muted)", fontSize:10, marginBottom:12 }}>Reg No. BOM/HSG/1234 • Palm Beach Road, CA</div>
            <div>To: The Branch Manager<br/>State Bank of India<br/><br/><strong>Subject:</strong> No Objection Certificate for Loan<br/><br/><span style={{ color:"var(--muted)" }}>This is to certify that Mr. Michael Chen is the registered owner of Flat No. A-501 in our society...</span><br/><br/><span style={{ color:"var(--muted)" }}>The society has no objection to the bank granting a loan against the said flat.</span></div>
            <div style={{ textAlign:"right", fontStyle:"italic", fontWeight:700, marginTop:12 }}>Approved</div>
            <div style={{ textAlign:"right", color:"var(--muted)", fontSize:10 }}>Secretary Signature</div>
          </div>
          <div className="bx bx-green w-100 justify-content-center py-2 mb-3" style={{ fontSize:13 }}>✅ Digitally Signed &amp; Verified</div>
          <div className="d-flex gap-2">
            <button className="btn-ac flex-grow-1">🖨 Print / PDF</button>
            <button className="btn-ol flex-grow-1">Email</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ REGISTERS ═════════════════════════════════ */
function RegistersPage() {
  const regs = [
    { icon:"👥", title:"Member Register",   val:"1,245", sub:"Total active members",     meta:"↑ 12 this week",      mc:"tx-success", bg:"#dbeafe" },
    { icon:"🏠", title:"Unit Register",     val:"420",   sub:"95% Occupancy",            meta:"20 Vacant",           mc:"",           bg:"#f3e8ff" },
    { icon:"🚗", title:"Parking Register",  val:"512",   sub:"Slots allocated",          meta:"14 Guest slots open", mc:"",           bg:"#ffedd5" },
    { icon:"🎪", title:"Vendor Register",   val:"28",    sub:"Active service providers", meta:"3 Pending approval",  mc:"",           bg:"#dcfce7" },
    { icon:"📦", title:"Asset Register",    val:"$1.2M", sub:"Total Asset Value",        meta:"85 Items Tracked",    mc:"",           bg:"#fef9c3" },
    { icon:"😟", title:"Complaint Register",val:"12",    sub:"Open issues",              meta:"3 High Priority",     mc:"tx-danger",  bg:"#fee2e2" },
  ];
  return (
    <div className="pg">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 style={{ fontWeight:800, marginBottom:2 }}>Registers Overview</h4>
          <p style={{ fontSize:13, color:"var(--muted)", marginBottom:0 }}>Quick access to all management modules</p>
        </div>
        <button className="btn-ac">+ New Entry</button>
      </div>
      <div className="row g-3">
        {regs.map((r,i) => (
          <div className="col-12 col-md-6 col-lg-4" key={i}>
            <div className="sv-card">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div style={{ width:52, height:52, background:r.bg, borderRadius:12, display:"grid", placeItems:"center", fontSize:24 }}>{r.icon}</div>
                <span style={{ cursor:"pointer", color:"var(--muted)" }}>⋯</span>
              </div>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{r.title}</div>
              <div style={{ fontWeight:800, fontSize:28, marginBottom:4 }}>{r.val}</div>
              <div style={{ fontSize:12, color:"var(--muted)", marginBottom:12 }}>{r.sub}</div>
              <hr className="divider" />
              <div className="d-flex justify-content-between align-items-center">
                <span className={`${r.mc}`} style={{ fontSize:12, fontWeight:600 }}>{r.meta}</span>
                <a href="#!" className="tx-accent" style={{ fontSize:12, fontWeight:600, textDecoration:"none" }}>View All →</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══ RULES & BY-LAWS ═══════════════════════════ */
function RulesPage() {
  const rules = [
    { title:"Quiet Hours Policy",    sub:"10:00 PM to 6:00 AM daily",     scope:"Entire Society",    penalty:"₹500 / Offense",  type:"BY-LAW" },
    { title:"Visitor Parking Limit", sub:"Max 4 hours without permit",     scope:"Visitor Lot A & B", penalty:"Tow + ₹1500",    type:"RULE"   },
    { title:"Balcony Guidelines",    sub:"No hanging clothes, BBQ grills", scope:"Block C, Wing 1",   penalty:"Warning",         type:"BY-LAW" },
    { title:"Pet Clean-up Policy",   sub:"Immediate removal required",     scope:"Entire Society",    penalty:"₹150 Fine",       type:"BY-LAW" },
    { title:"Renovation Hours",      sub:"Mon-Fri 9AM-5PM only",          scope:"Entire Society",    penalty:"Stop Work Order",  type:"RULE"   },
  ];
  return (
    <div className="pg row g-4">
      <div className="col-12 col-lg-8">
        <div className="row g-3 mb-4">
          {[["Total Slots","512","↑ 2 added this month","tx-success"],["Violation Notices","18","Pending review: 5","tx-danger"],["Penalty Collection","₹21,250","Avg. penalty: ₹500","tx-muted"]].map(([l,v,m,mc]) => (
            <div className="col-4" key={l}>
              <div className="stat-card">
                <div className="s-label">{l}</div>
                <div className="s-val">{v}</div>
                <div className={`${mc} mt-1`} style={{ fontSize:12 }}>{m}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="sv-card p-0 overflow-hidden">
          <div className="d-flex justify-content-between align-items-center px-4 py-3">
            <h6 style={{ fontWeight:800, marginBottom:0 }}>Active Rules &amp; By-laws</h6>
            <div className="d-flex gap-2">
              <button className="btn-ol py-1 px-3" style={{ fontSize:12 }}>🔽 Filter</button>
              <button className="btn-ol py-1 px-3" style={{ fontSize:12 }}>⬇ Export</button>
            </div>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table className="sv-tbl">
              <thead><tr><th>RULE TITLE</th><th>APPLICABILITY</th><th>PENALTY</th><th>TYPE</th></tr></thead>
              <tbody>
                {rules.map((r,i) => (
                  <tr key={i}>
                    <td><div style={{ fontWeight:600 }}>{r.title}</div><div style={{ fontSize:11, color:"var(--muted)" }}>{r.sub}</div></td>
                    <td style={{ color:"var(--muted)" }}>📍 {r.scope}</td>
                    <td style={{ fontWeight:500 }}>{r.penalty}</td>
                    <td><Badge label={r.type} c={r.type==="BY-LAW"?"blue":"gray"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ textAlign:"center", padding:"12px 0" }}>
            <a href="#!" className="tx-accent" style={{ fontWeight:600, fontSize:13, textDecoration:"none" }}>View All Rules →</a>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-4">
        <div className="sv-card mb-3">
          <h6 style={{ fontWeight:700, marginBottom:12 }}>Management Actions</h6>
          {[["➕","#dbeafe","Create By-law","Draft new regulation"],["🗺","#dcfce7","Attach to Block/Wing","Assign rules to areas"],["⚠️","#fee2e2","Define Penalties","Set fines & consequences"]].map(([ic,bg,lb,sub]) => (
            <button key={lb} className="qa mb-2">
              <div className="qa-ico" style={{ background:bg }}>{ic}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13 }}>{lb}</div>
                <div style={{ fontSize:11, color:"var(--muted)" }}>{sub}</div>
              </div>
              <span style={{ color:"var(--muted)" }}>›</span>
            </button>
          ))}
        </div>
        <div className="sv-card">
          <div className="d-flex justify-content-between mb-3">
            <h6 style={{ fontWeight:700, marginBottom:0 }}>Recent Violations</h6>
            <a href="#!" className="tx-accent" style={{ fontSize:13, fontWeight:600, textDecoration:"none" }}>View All</a>
          </div>
          {[["dot-red","Noise Complaint","Unit 402 • 2 hours ago"],["dot-org","Improper Parking","Guest Lot • 5 hours ago"],["dot-grn","Trash Disposal","Resolved • Yesterday"]].map(([d,l,s]) => (
            <div key={l} className="d-flex align-items-center gap-2 mb-2">
              <span className={`dot ${d}`} />
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{l}</div>
                <div style={{ fontSize:11, color:"var(--muted)" }}>{s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══ COMPLAINTS (paginated) ════════════════════ */
function ComplaintsPage() {
  const [page, setPage] = useState(1);
  const all = [
    { id:"#C-1042", title:"Lift B not working",           unit:"A-201",  cat:"Maintenance", pri:"High",   st:"Open",        sc:"red",    time:"2h ago"  },
    { id:"#C-1041", title:"Water leakage in corridor",    unit:"B-305",  cat:"Plumbing",    pri:"Medium", st:"In Progress", sc:"orange", time:"5h ago"  },
    { id:"#C-1040", title:"Gym AC not functioning",       unit:"Common", cat:"Electrical",  pri:"Low",    st:"Open",        sc:"red",    time:"1d ago"  },
    { id:"#C-1039", title:"Parking slot encroachment",    unit:"B-101",  cat:"Parking",     pri:"Medium", st:"Resolved",    sc:"green",  time:"2d ago"  },
    { id:"#C-1038", title:"Noisy neighbours after 10 PM", unit:"C-402",  cat:"Noise",       pri:"Medium", st:"Resolved",    sc:"green",  time:"3d ago"  },
    { id:"#C-1037", title:"Broken gym equipment",         unit:"Common", cat:"Maintenance", pri:"Low",    st:"Open",        sc:"red",    time:"3d ago"  },
    { id:"#C-1036", title:"Leaking water pipe – roof",    unit:"D-501",  cat:"Plumbing",    pri:"High",   st:"In Progress", sc:"orange", time:"4d ago"  },
    { id:"#C-1035", title:"Gate door hinge broken",       unit:"Gate 2", cat:"Maintenance", pri:"Low",    st:"Resolved",    sc:"green",  time:"5d ago"  },
  ];
  const per = 5, total = Math.ceil(all.length/per);
  const rows = all.slice((page-1)*per, page*per);

  return (
    <div className="pg">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h4 style={{ fontWeight:800, marginBottom:2 }}>Complaints</h4><p style={{ fontSize:13, color:"var(--muted)", marginBottom:0 }}>Manage and track all society complaints</p></div>
        <button className="btn-ac">+ Log Complaint</button>
      </div>

      <div className="row g-3 mb-4">
        {[["14","Total Open","tile-red"],["6","In Progress","tile-org"],["3","Resolved Today","tile-grn"],["2.4d","Avg Resolution","tile-blu"]].map(([v,l,cls]) => (
          <div className="col-6 col-md-3" key={l}>
            <div className={`tile ${cls}`}><div className="tile-val">{v}</div><div className="tile-lbl">{l}</div></div>
          </div>
        ))}
      </div>

      <div className="sv-card p-0 overflow-hidden">
        <div style={{ overflowX:"auto" }}>
          <table className="sv-tbl">
            <thead><tr>{["ID","Title","Unit","Category","Priority","Status","Time"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map(c => (
                <tr key={c.id}>
                  <td className="tx-accent" style={{ fontWeight:600 }}>{c.id}</td>
                  <td style={{ fontWeight:600 }}>{c.title}</td>
                  <td style={{ color:"var(--muted)" }}>{c.unit}</td>
                  <td><Badge label={c.cat} c="gray" /></td>
                  <td><Badge label={c.pri} c={c.pri==="High"?"red":c.pri==="Medium"?"orange":"gray"} /></td>
                  <td><Badge label={c.st}  c={c.sc} /></td>
                  <td style={{ color:"var(--muted)" }}>{c.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={total} onChange={p => { setPage(p); }} />
      </div>
    </div>
  );
}

/* ══ FLAT TRANSFER ═════════════════════════════ */
function FlatTransferPage() {
  const steps = ["Request Details","No-Dues","Calculations","Doc Verify","Final Approval"];
  const cur = 2;
  return (
    <div className="pg">
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <div style={{ fontSize:12, color:"var(--muted)", marginBottom:4 }}>Transfers › #TR-2024-852</div>
          <h4 style={{ fontWeight:800, marginBottom:4 }}>Transfer Request: Flat A-402 &nbsp;<Badge label="In Progress" c="blue" /></h4>
          <p style={{ fontSize:13, color:"var(--muted)", marginBottom:0 }}>Green Valley Heights • Block A • 4th Floor</p>
        </div>
        <div className="d-flex gap-2"><button className="btn-ol">Reject Request</button><button className="btn-ac">Proceed to Approval</button></div>
      </div>

      {/* Stepper */}
      <div className="sv-card mb-4">
        <div className="stepper-row">
          {steps.map((s,i) => (
            <div key={s} className="step-col">
              {i < steps.length-1 && <div className="step-line" style={{ background: i<cur?"var(--accent)":"var(--border)" }} />}
              <div className="step-circle" style={{ background:i<cur?"var(--accent)":i===cur?"#fff":"#f1f5f9", border:i===cur?"2px solid var(--accent)":"none", color:i<cur?"#fff":i===cur?"var(--accent)":"var(--muted)" }}>
                {i<cur?"✓":i===cur?"⊙":"○"}
              </div>
              <div className="step-lbl" style={{ color:i===cur?"var(--text)":"var(--muted)", fontWeight:i===cur?700:400 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="sv-card mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 style={{ fontWeight:700, marginBottom:0 }}>Ownership Transfer Details</h6>
              <a href="#!" className="tx-accent" style={{ fontSize:12, fontWeight:600, textDecoration:"none" }}>View Full Application</a>
            </div>
            <div className="row g-3">
              {[
                { role:"CURRENT OWNER (SELLER)", name:"Rajesh Kumar", ph:"+91 98765 43210", em:"rajesh.k@gmail.com", init:"RK" },
                { role:"NEW OWNER (BUYER)",       name:"Priya Sharma", ph:"+91 91234 56789", em:"priya.s.design@gmail.com", init:"PS" },
              ].map(p => (
                <div className="col-6" key={p.role}>
                  <div style={{ fontSize:10, color:"var(--muted)", fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", marginBottom:8 }}>{p.role}</div>
                  <div className="owner-bg">
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width:40, height:40, borderRadius:"50%", background:"var(--accent)", color:"#fff", display:"grid", placeItems:"center", fontWeight:700, fontSize:13, flexShrink:0 }}>{p.init}</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14 }}>{p.name}</div>
                        <div style={{ fontSize:11, color:"var(--muted)" }}>{p.ph}</div>
                        <div style={{ fontSize:11, color:"var(--muted)" }}>{p.em}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="row g-3">
            <div className="col-6">
              <div className="sv-card">
                <div className="d-flex justify-content-between mb-2">
                  <h6 style={{ fontWeight:700, marginBottom:0 }}>No-Dues Clearance</h6>
                  <span className="tx-success" style={{ fontWeight:600, fontSize:13 }}>✅ Cleared</span>
                </div>
                {[["💧 Water & Maintenance","Paid"],["⚡ Electricity Dues","Paid"]].map(([l,v]) => (
                  <div key={l} className="d-flex justify-content-between mt-2" style={{ fontSize:13 }}>
                    <span>{l}</span><span className="tx-success" style={{ fontWeight:600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-6">
              <div className="sv-card">
                <div className="d-flex justify-content-between mb-2">
                  <h6 style={{ fontWeight:700, marginBottom:0 }}>Transfer Charges</h6>
                  <span style={{ fontSize:11, color:"var(--muted)" }}>Due: Today</span>
                </div>
                {[["Society Transfer Fee","₹25,000"],["Stamp Duty","₹3,500"]].map(([l,v]) => (
                  <div key={l} className="d-flex justify-content-between mt-2" style={{ fontSize:13 }}>
                    <span>{l}</span><span style={{ fontWeight:700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="sv-card">
            <h6 style={{ fontWeight:700, marginBottom:16 }}>Approval Workflow</h6>
            {[
              { lbl:"Application Submitted", sub:"Oct 12, 10:30 AM • Rajesh K.", dot:"dot-blu" },
              { lbl:"NDC Generated",         sub:"Oct 13, 02:15 PM • System",    dot:"dot-blu" },
              { lbl:"Manager Review",        sub:"Oct 14, 09:00 AM • James W.",  dot:"dot-blu" },
              { lbl:"Committee Approval",    sub:"Pending • Awaiting Meeting",   dot:"dot-org", pending:true },
            ].map((w,i) => (
              <div key={i} className="d-flex gap-3 align-items-start mb-3">
                <span className={`dot ${w.dot}`} style={{ marginTop:4 }} />
                <div>
                  <div style={{ fontWeight:600, fontSize:13, color:w.pending?"var(--warning)":"var(--text)" }}>{w.lbl}</div>
                  <div style={{ fontSize:11, color:"var(--muted)" }}>{w.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ STAFF ATTENDANCE (paginated) ══════════════ */
function StaffPage() {
  const [page, setPage] = useState(1);
  const all = [
    { name:"Ramesh Gupta", role:"Security Guard",  shift:"Morning", st:"Present",     sc:"green",  time:"08:02 AM" },
    { name:"Suresh Patil", role:"Housekeeping",    shift:"Morning", st:"Present",     sc:"green",  time:"08:15 AM" },
    { name:"Kavita Singh", role:"Receptionist",    shift:"Morning", st:"Late",        sc:"orange", time:"09:32 AM" },
    { name:"Mohan Nair",   role:"Security Guard",  shift:"Evening", st:"Absent",      sc:"red",    time:"—"        },
    { name:"Priya Verma",  role:"Housekeeping",    shift:"Morning", st:"Present",     sc:"green",  time:"07:55 AM" },
    { name:"Ajay Sharma",  role:"Plumber",         shift:"Morning", st:"Present",     sc:"green",  time:"08:30 AM" },
    { name:"Ritu Mehta",   role:"Admin Staff",     shift:"Morning", st:"Present",     sc:"green",  time:"09:01 AM" },
    { name:"Deepak Joshi", role:"Security Guard",  shift:"Night",   st:"Present",     sc:"green",  time:"10:00 PM" },
    { name:"Sunita Das",   role:"Housekeeping",    shift:"Morning", st:"Late",        sc:"orange", time:"09:45 AM" },
    { name:"Vikas Rao",    role:"Maintenance",     shift:"Morning", st:"Absent",      sc:"red",    time:"—"        },
  ];
  const per = 5, total = Math.ceil(all.length/per);
  const rows = all.slice((page-1)*per, page*per);

  return (
    <div className="pg">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 style={{ fontWeight:800, marginBottom:0 }}>Staff Attendance</h4>
        <div className="d-flex gap-2">
          <input type="date" className="sv-in" defaultValue="2025-12-14" style={{ width:"auto" }} />
          <button className="btn-ol">⬇ Export</button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[["48","Present","tile-grn"],["2","Absent","tile-red"],["3","Late","tile-org"],["50","Total Staff","tile-blu"]].map(([v,l,cls]) => (
          <div className="col-6 col-md-3" key={l}>
            <div className={`tile ${cls}`}><div className="tile-val">{v}</div><div className="tile-lbl">{l}</div></div>
          </div>
        ))}
      </div>

      <div className="sv-card p-0 overflow-hidden">
        <div style={{ overflowX:"auto" }}>
          <table className="sv-tbl">
            <thead><tr>{["Name","Role","Shift","Status","Time In"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((s,i) => (
                <tr key={i}>
                  <td style={{ fontWeight:600 }}>{s.name}</td>
                  <td style={{ color:"var(--muted)" }}>{s.role}</td>
                  <td><Badge label={s.shift} c="gray" /></td>
                  <td><Badge label={s.st} c={s.sc} /></td>
                  <td style={{ color:s.st==="Absent"?"var(--muted)":"var(--text)" }}>{s.time}</td>
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
    <div className="pg d-flex flex-column align-items-center justify-content-center" style={{ minHeight:300, color:"var(--muted)" }}>
      <div style={{ fontSize:48, marginBottom:12 }}>🏗</div>
      <h5 style={{ fontWeight:700 }}>{label}</h5>
      <p style={{ fontSize:13 }}>This page is coming soon.</p>
    </div>
  );
}

/* ══ NAV DATA ══════════════════════════════════ */
const NAV = [
  { sec:"Dashboards",   items:[{ id:"overview",     icon:"⊞", lbl:"Overview"          }] },
  { sec:"Communication",items:[
    { id:"broadcasting",icon:"📢",lbl:"Broadcasting" },
    { id:"noticeboard", icon:"📋",lbl:"Notice Board" },
    { id:"polls",       icon:"📊",lbl:"Polls & Voting"},
  ]},
  { sec:"Member Masters",items:[
    { id:"addmember",   icon:"👤",lbl:"Add Member"     },
    { id:"transfer",    icon:"🔄",lbl:"Transfer Member" },
  ]},
  { sec:"Administration",items:[
    { id:"documents",   icon:"📄",lbl:"Documents & NOC" },
    { id:"flattransfer",icon:"🏠",lbl:"Flat Transfer"   },
    { id:"registers",   icon:"📔",lbl:"Registers"       },
    { id:"rules",       icon:"⚖️",lbl:"Rules & By-laws"},
  ]},
  { sec:"Operations",   items:[
    { id:"complaints",  icon:"🚨",lbl:"Complaints"       },
    { id:"parking",     icon:"🚗",lbl:"Parking"          },
    { id:"rentals",     icon:"🏢",lbl:"Rentals & Tenants"},
    { id:"staff",       icon:"👥",lbl:"Staff Attendance" },
  ]},
];

const TITLES = {
  overview:["Dashboards","Overview"], broadcasting:["Communication","Broadcasting"],
  noticeboard:["Communication","Notice Board"], polls:["Communication","Polls & Voting"],
  addmember:["Member Masters","Add Member"], transfer:["Member Masters","Transfer Member"],
  documents:["Administration","Documents & NOC"], flattransfer:["Administration","Flat Transfer"],
  registers:["Administration","Registers"], rules:["Administration","Rules & By-laws"],
  complaints:["Operations","Complaints"], parking:["Operations","Parking"],
  rentals:["Operations","Rentals & Tenants"], staff:["Operations","Staff Attendance"],
};

const PAGES = {
  overview:<OverviewPage/>, broadcasting:<BroadcastingPage/>, noticeboard:<NoticeBoardPage/>,
  polls:<PollsPage/>, addmember:<AddMemberPage/>, transfer:<PlaceholderPage label="Transfer Member"/>,
  documents:<DocumentsPage/>, flattransfer:<FlatTransferPage/>, registers:<RegistersPage/>,
  rules:<RulesPage/>, complaints:<ComplaintsPage/>, parking:<PlaceholderPage label="Parking"/>,
  rentals:<PlaceholderPage label="Rentals & Tenants"/>, staff:<StaffPage/>,
};

/* ══ ROOT APP ══════════════════════════════════ */
export default function App() {
  const [active,    setActive]    = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    /* 1. Bootstrap CSS */
    if (!document.getElementById("bs-css")) {
      const l = document.createElement("link");
      l.id = "bs-css"; l.rel = "stylesheet";
      l.href = "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css";
      document.head.insertBefore(l, document.head.firstChild);
    }
    /* 2. All app CSS in <style> tag */
    if (!document.getElementById("sv-css")) {
      const s = document.createElement("style");
      s.id = "sv-css";
      s.textContent = APP_CSS;
      document.head.appendChild(s);
    }
  }, []);

  const [sec, pg] = TITLES[active] || ["",""];

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <nav className={`sidebar ${collapsed?"collapsed":""}`}>
        <div className="sidebar-logo">
          <div className="logo-box">GV</div>
          <div>
            <div className="logo-name">GreenValley</div>
            <div className="logo-sub">Society Admin</div>
          </div>
        </div>
        <div className="sidebar-nav">
          {NAV.map(({ sec: section, items }) => (
            <div key={section}>
              <div className="nav-section">{section}</div>
              {items.map(item => (
                <button key={item.id} className={`nav-item ${active===item.id?"active":""}`} onClick={()=>setActive(item.id)}>
                  <span className="ni">{item.icon}</span>
                  <span className="nl">{item.lbl}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </nav>

      {/* MAIN */}
      <div className="main-area">
        <header className="topbar">
          <button className="tb-toggle" onClick={()=>setCollapsed(c=>!c)}>☰</button>
          <div className="tb-bread">
            <div className="tb-sec">{sec}</div>
            <div className="tb-page">{pg}</div>
          </div>
          <div className="tb-right">
            <span className="tb-date">14 Dec 2025</span>
            <button className="tb-avatar">🔔</button>
            <button className="tb-avatar" style={{ background:"#e2e8f0", color:"var(--text)" }}>👤</button>
            <span className="tb-name">Karan Sharma</span>
          </div>
        </header>

        <main className="page-wrap" key={active}>
          {PAGES[active] ?? <PlaceholderPage label={pg} />}
        </main>
      </div>
    </div>
  );
}