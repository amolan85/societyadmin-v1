export const APP_CSS = `
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
.tab-pills { display: flex; gap: 6px; flex-wrap: wrap; background: "#fff" }
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
.tx-blue { color: var(--blue); }

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