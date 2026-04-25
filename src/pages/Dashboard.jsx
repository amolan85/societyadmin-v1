import { useState } from "react";

// ── Bootstrap loaded via CDN in index.html; using inline styles + Bootstrap classes ──

const SIDEBAR_ITEMS = [
  { section: "Dashboards", items: [{ id: "overview", label: "Overview", icon: "⊞" }] },
  {
    section: "Communication",
    items: [
      { id: "broadcasting", label: "Broadcasting", icon: "📢" },
      { id: "noticeboard", label: "Notice Board", icon: "📋" },
      { id: "polls", label: "Polls & Voting", icon: "📊" },
    ],
  },
  {
    section: "Member Masters",
    items: [
      { id: "addmember", label: "Add Member", icon: "👤" },
      { id: "transfer", label: "Transfer Member", icon: "🔄" },
    ],
  },
  { section: "Accounts *", items: [] },
  {
    section: "Administration",
    items: [
      { id: "documents", label: "Documents & NOC", icon: "📄" },
      { id: "flattransfer", label: "Flat Transfer", icon: "🏠" },
      { id: "registers", label: "Registers", icon: "📔" },
      { id: "rules", label: "Rules & By-laws", icon: "⚖️" },
    ],
  },
  {
    section: "Operations",
    items: [
      { id: "complaints", label: "Complaints", icon: "🚨" },
      { id: "parking", label: "Parking", icon: "🚗" },
      { id: "rentals", label: "Rentals & Tenants", icon: "🏢" },
      { id: "staff", label: "Staff Attendance", icon: "👥" },
    ],
  },
];

const colors = {
  primary: "#1a1a2e",
  accent: "#2563eb",
  accentLight: "#dbeafe",
  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
  sidebar: "#f8fafc",
  border: "#e2e8f0",
  text: "#0f172a",
  muted: "#64748b",
  card: "#ffffff",
  bg: "#f1f5f9",
};

const badge = (label, color) => (
  <span
    style={{
      background: color === "green" ? "#dcfce7" : color === "red" ? "#fee2e2" : color === "orange" ? "#ffedd5" : color === "blue" ? "#dbeafe" : "#f1f5f9",
      color: color === "green" ? "#15803d" : color === "red" ? "#b91c1c" : color === "orange" ? "#c2410c" : color === "blue" ? "#1d4ed8" : "#475569",
      fontSize: 11,
      fontWeight: 600,
      padding: "2px 9px",
      borderRadius: 20,
    }}
  >
    {label}
  </span>
);

// ── OVERVIEW PAGE ──────────────────────────────────────────────────────────────
function OverviewPage() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const approved = [54, 29, 54, 99, 52, 46, 15, 64, 33, 64, 23, 93];
  const pending = [48, 25, 56, 94, 52, 45, 13, 81, 30, 30, 55, 45];
  const rejected = [24, 10, 39, 40, 50, 40, 29, 75, 77, 89, 26, 33];
  const maxVal = 100;

  const pendingApprovals = [
    { title: "Tenant Agreement Verification", sub: "Unit 402  •  Rahul Sharma (Tenant)", status: "Pending Verify", statusColor: "orange" },
    { title: "Interior Renovation Request", sub: "Unit 105  •  Painting & Flooring", status: "Review Docs", statusColor: "blue" },
    { title: "NOC for Bank Loan – Flat C-201", sub: "Unit C-201  •  Priya Mehta (Owner)", status: "Approved", statusColor: "green" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 2 }}>Welcome Back!</h2>
        <p style={{ color: colors.muted, marginBottom: 0 }}>Your Overview Statistics</p>
      </div>

      {/* Stats row */}
      <div className="row g-3 mb-4">
        {[
          { label: "Active Complaints", value: "14" },
          { label: "Visits", value: "3,671" },
          { label: "Pending Approvals", value: "156" },
          { label: "Staff Present", value: "48/50" },
        ].map((s) => (
          <div className="col-6 col-md-3" key={s.label}>
            <div style={{ background: colors.card, borderRadius: 12, padding: "16px 20px", border: `1px solid ${colors.border}` }}>
              <div style={{ color: colors.muted, fontSize: 13, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontWeight: 800, fontSize: 26 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-8">
          <div style={{ background: colors.card, borderRadius: 12, padding: 20, border: `1px solid ${colors.border}` }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex gap-3">
                {[{ label: "Approved", color: "#818cf8" }, { label: "Pending", color: "#fb923c" }, { label: "Rejected", color: "#f87171" }].map(l => (
                  <span key={l.label} className="d-flex align-items-center gap-1" style={{ fontSize: 12 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: "inline-block" }} /> {l.label}
                  </span>
                ))}
              </div>
              <span style={{ fontSize: 12, border: `1px solid ${colors.border}`, padding: "3px 10px", borderRadius: 6 }}>F.Y. 2025 ▾</span>
            </div>
            {/* Bar chart */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140, paddingBottom: 20, position: "relative" }}>
              {months.map((m, i) => (
                <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, height: "100%" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 1, width: "100%" }}>
                    {[
                      { val: approved[i], color: "#818cf8" },
                      { val: pending[i], color: "#fb923c" },
                      { val: rejected[i], color: "#f87171" },
                    ].map((b, j) => (
                      <div
                        key={j}
                        style={{ flex: 1, background: b.color, borderRadius: "2px 2px 0 0", height: `${(b.val / maxVal) * 100}%`, minHeight: 3 }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: 9, color: colors.muted, marginTop: 2 }}>{m}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div style={{ background: colors.card, borderRadius: 12, padding: 20, border: `1px solid ${colors.border}`, height: "100%" }}>
            <div className="d-flex gap-3 mb-3 flex-wrap">
              {[{ label: "Approved", color: "#818cf8" }, { label: "Pending", color: "#fb923c" }, { label: "Rejected", color: "#f87171" }].map(l => (
                <span key={l.label} className="d-flex align-items-center gap-1" style={{ fontSize: 11 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, display: "inline-block" }} /> {l.label}
                </span>
              ))}
            </div>
            {/* Spider chart placeholder */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <svg viewBox="0 0 200 200" width="180" height="180">
                {[0, 1, 2, 3].map(i => (
                  <polygon key={i} points="100,20 180,70 160,160 40,160 20,70"
                    style={{ fill: "none", stroke: colors.border, strokeWidth: 1, transform: `scale(${0.3 + i * 0.175}) translate(${-100 * (i * 0.175)}px, ${-100 * (i * 0.175)}px)`, transformOrigin: "100px 100px" }} />
                ))}
                <polygon points="100,30 165,75 150,155 50,155 35,75" style={{ fill: "rgba(129,140,248,0.3)", stroke: "#818cf8", strokeWidth: 1.5 }} />
                <polygon points="100,45 155,80 145,145 55,145 45,80" style={{ fill: "rgba(251,146,60,0.3)", stroke: "#fb923c", strokeWidth: 1.5 }} />
                <polygon points="100,55 140,90 130,140 70,140 60,90" style={{ fill: "rgba(248,113,113,0.3)", stroke: "#f87171", strokeWidth: 1.5 }} />
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((label, i) => {
                  const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
                  const x = 100 + 88 * Math.cos(angle);
                  const y = 100 + 88 * Math.sin(angle);
                  return <text key={label} x={x} y={y} fontSize="8" fill={colors.muted} textAnchor="middle" dominantBaseline="middle">{label}</text>;
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Pending approvals */}
      <div style={{ background: colors.card, borderRadius: 12, border: `1px solid ${colors.border}`, overflow: "hidden" }}>
        {pendingApprovals.map((p, i) => (
          <div key={i} className="d-flex justify-content-between align-items-center" style={{ padding: "14px 20px", borderBottom: i < pendingApprovals.length - 1 ? `1px solid ${colors.border}` : "none" }}>
            <div>
              <div style={{ fontWeight: 600 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: colors.muted }}>{p.sub}</div>
            </div>
            {badge(p.status, p.statusColor)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BROADCASTING PAGE ──────────────────────────────────────────────────────────
function BroadcastingPage() {
  const [tab, setTab] = useState("Announcement");
  const tabs = ["Announcement", "Emergency", "Circular", "Event"];
  const recent = [
    { title: "Water Supply Cut", time: "Today, 10:30 AM", type: "Alert", status: "Sent", statusColor: "green" },
    { title: "New Year Event", time: "Dec 31, 08:00 PM", type: "Invitation", status: "Scheduled", statusColor: "blue" },
    { title: "Parking Lot Resurfacing", time: "Edited 2h ago", type: "Announcement", status: "Draft" },
  ];

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-8">
        <div style={{ background: colors.card, borderRadius: 14, padding: 24, border: `1px solid ${colors.border}` }}>
          <h5 style={{ fontWeight: 700, marginBottom: 20 }}>📢 Create &amp; Publish</h5>

          {/* Tabs */}
          <div className="d-flex gap-2 mb-4 flex-wrap">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: "8px 20px", borderRadius: 30, border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer", background: tab === t ? colors.primary : "#f1f5f9", color: tab === t ? "#fff" : colors.muted }}>
                {t}
              </button>
            ))}
          </div>

          <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, display: "block" }}>Subject / Title</label>
          <input className="form-control mb-3" placeholder="Example: Scheduled Maintenance of Lift B" style={{ borderRadius: 10 }} />

          <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, display: "block" }}>Content</label>
          <div style={{ border: `1px solid ${colors.border}`, borderRadius: 10, marginBottom: 16 }}>
            <div style={{ borderBottom: `1px solid ${colors.border}`, padding: "8px 12px", display: "flex", gap: 12 }}>
              {["B", "I", "U", "≡", "≔", "🔗"].map(b => <button key={b} style={{ background: "none", border: "none", fontWeight: b === "B" ? 800 : 400, cursor: "pointer", fontSize: 14 }}>{b}</button>)}
            </div>
            <textarea className="form-control border-0" rows={4} placeholder="Type your announcement details here..." style={{ borderRadius: "0 0 10px 10px", resize: "none" }} />
          </div>

          <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, display: "block" }}>Attachment (Optional)</label>
          <div style={{ border: `2px dashed ${colors.border}`, borderRadius: 10, padding: 24, textAlign: "center", marginBottom: 20, color: colors.muted, fontSize: 14 }}>
            ☁️ <strong>Click to upload or drag files here</strong><br />
            <small>PDF, JPG, PNG up to 10MB</small>
          </div>

          <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, display: "block" }}>Broadcasting Channels</label>
          <div className="d-flex gap-2 mb-4">
            <span style={{ background: colors.accentLight, color: colors.accent, padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>☑ App Notification</span>
            <span style={{ background: "#f1f5f9", color: colors.muted, padding: "6px 12px", borderRadius: 8, fontSize: 13 }}>⊕</span>
          </div>

          <div className="d-flex gap-4 align-items-center mb-4">
            <label style={{ fontSize: 14 }}><input type="radio" defaultChecked className="me-2" />Send Now</label>
            <label style={{ fontSize: 14 }}><input type="radio" className="me-2" />Schedule for later</label>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <button className="btn btn-outline-secondary" style={{ borderRadius: 8 }}>Preview</button>
            <button className="btn btn-outline-secondary" style={{ borderRadius: 8 }}>Save Draft</button>
            <button className="btn" style={{ background: colors.accent, color: "#fff", borderRadius: 8, fontWeight: 600 }}>Publish ✈</button>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-4">
        {/* Notifications */}
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}`, marginBottom: 16 }}>
          <h6 style={{ fontWeight: 700, marginBottom: 12 }}>Notifications</h6>
          {[
            { label: "Committee Meeting", time: "Today, 08:00 PM", dot: "orange" },
            { label: "New user registered.", time: "59 minutes ago", dot: "blue" },
            { label: "Mr. Roy Sing update notice board", time: "1 hours ago", dot: "orange" },
            { label: "Complaint registered by Riya Mittal", time: "Today, 10:59 AM", dot: "red" },
          ].map((n, i) => (
            <div key={i} className="d-flex gap-2 align-items-start mb-2">
              <span style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0, background: n.dot === "orange" ? "#fb923c" : n.dot === "blue" ? colors.accent : "#ef4444" }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{n.label}</div>
                <div style={{ fontSize: 11, color: colors.muted }}>{n.time}</div>
              </div>
            </div>
          ))}
          <button className="btn w-100 mt-2" style={{ background: colors.primary, color: "#fff", borderRadius: 8, fontSize: 13 }}>Show all notifications</button>
        </div>

        {/* Quick Actions */}
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}`, marginBottom: 16 }}>
          <h6 style={{ fontWeight: 700, marginBottom: 12 }}>Quick Actions</h6>
          {[{ icon: "➕", label: "New Notice", color: colors.accent }, { icon: "📊", label: "Create Poll", color: "#f97316" }, { icon: "📄", label: "Issue NOC", color: "#8b5cf6" }].map(q => (
            <div key={q.label} className="d-flex align-items-center gap-3" style={{ padding: "10px 12px", borderRadius: 10, background: "#f8fafc", marginBottom: 8, cursor: "pointer" }}>
              <span style={{ fontSize: 18 }}>{q.icon}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{q.label}</span>
            </div>
          ))}
        </div>

        {/* Recent Communications */}
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>
          <h6 style={{ fontWeight: 700, marginBottom: 12 }}>Recent Communications</h6>
          {recent.map((r, i) => (
            <div key={i} className="d-flex justify-content-between align-items-center mb-2" style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: colors.muted }}>{r.time} • {r.type}</div>
              </div>
              {r.status && badge(r.status, r.statusColor)}
            </div>
          ))}
          <button className="btn w-100 mt-1" style={{ background: colors.primary, color: "#fff", borderRadius: 8, fontSize: 13 }}>Show all communication</button>
        </div>
      </div>
    </div>
  );
}

// ── NOTICE BOARD PAGE ──────────────────────────────────────────────────────────
function NoticeBoardPage() {
  const [tab, setTab] = useState("All Posts");
  const posts = [
    { icon: "📢", title: "AGM 2025 Date Rescheduled", tag: "Official", tagColor: "blue", author: "Sara Sharan", time: "2 hours ago", views: "128 views", content: "Due to unforeseen weather conditions, the Annual General Meeting scheduled for this Sunday is postponed to next Saturday, Nov 12th at 5 PM in the Clubhouse." },
    { icon: "💬", title: "Water Seepage in Block B Basement", tag: "Discussion", tagColor: "orange", author: "Raj Singh (B-402)", time: "Yesterday", comments: "14 Comments", content: "There is a significant leak near pillar 14. Can the maintenance team please prioritize this?", locked: true },
    { icon: "👥", title: "Diwali Decoration Volunteers Needed", tag: "Discussion", tagColor: "orange", author: "Priya Desai (Cultural Comm.)", time: "5 hours ago", comments: "8 Comments", content: "Looking for enthusiastic residents to help with the rangoli and lighting arrangements for the upcoming Diwali celebration." },
    { icon: "📋", title: "Found: Car Keys near Gate 2", tag: "Lost & Found", tagColor: "blue", author: "Security Office", time: "30 min ago", content: "A set of Honda car keys was found near the security cabin at Gate 2 this morning. Please collect from security." },
  ];
  const modQueue = [
    { name: "Raj Singh (A-612)", time: "10m ago", text: "Why is the gym AC never working? I will stop paying maintenance if this continues! This is ridiculous..." },
    { name: "Neha Verma (C-501)", time: "45m ago", text: "Selling my old sofa set. Price negotiable. Contact me at 98765..." },
  ];

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-8">
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>
          <div className="d-flex gap-2 mb-3 flex-wrap">
            {["All Posts", "Official", "Discussions", "Archived"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 18px", borderRadius: 30, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", background: tab === t ? colors.accent : "#f1f5f9", color: tab === t ? "#fff" : colors.muted }}>
                {t}
              </button>
            ))}
          </div>
          {posts.map((p, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${colors.border}`, padding: "14px 4px" }}>
              <div className="d-flex gap-3 align-items-start">
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{p.title}</span>
                    {badge(p.tag, p.tagColor)}
                    {p.locked && <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 600 }}>🔒 Thread Locked</span>}
                  </div>
                  <p style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>{p.content}</p>
                  <div style={{ fontSize: 11, color: colors.muted }}>
                    👤 {p.author} • {p.time} {p.views && `• 👁 ${p.views}`} {p.comments && `• 💬 ${p.comments}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 col-lg-4">
        {/* Stats */}
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}`, marginBottom: 16 }}>
          <div className="row g-2 text-center">
            {[{ label: "Active notices", value: "24" }, { label: "Pending Review", value: "3", red: true }, { label: "Comments Today", value: "156" }, { label: "New Threads", value: "12" }].map(s => (
              <div className="col-6" key={s.label}>
                <div style={{ fontWeight: 800, fontSize: 22, color: s.red ? "#dc2626" : colors.text }}>{s.value}</div>
                <div style={{ fontSize: 11, color: colors.muted }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Moderation Queue */}
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <span>⚠️</span>
            <h6 style={{ fontWeight: 700, marginBottom: 0 }}>Moderation Queue (3)</h6>
          </div>
          {modQueue.map((m, i) => (
            <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: 12, marginBottom: 12 }}>
              <div className="d-flex justify-content-between mb-1">
                <span style={{ fontWeight: 700, fontSize: 13 }}>{m.name}</span>
                <span style={{ fontSize: 11, color: colors.muted }}>{m.time}</span>
              </div>
              <p style={{ fontSize: 12, color: "#374151", marginBottom: 10 }}>"{m.text}"</p>
              <div className="d-flex gap-2">
                <button className="btn btn-sm flex-fill" style={{ background: "#16a34a", color: "#fff", borderRadius: 6 }}>Approve</button>
                <button className="btn btn-sm flex-fill" style={{ background: "#dc2626", color: "#fff", borderRadius: 6 }}>Reject</button>
              </div>
            </div>
          ))}
          <button className="btn w-100" style={{ background: colors.accent, color: "#fff", borderRadius: 8 }}>Show all moderation</button>
        </div>
      </div>
    </div>
  );
}

// ── POLLS & VOTING PAGE ────────────────────────────────────────────────────────
function PollsPage() {
  const [tab, setTab] = useState("Active");
  const polls = [
    { icon: "📊", title: "AGM 2025 : Approval of Annual Accounts", id: "#POLL-2024-004", started: "2 days ago", ends: "Ends in 24h", tags: ["AGM Voting", "One Vote per Flat", "Secret Ballot"], status: "Live Voting", statusColor: "green", participation: 78, votes: "234 / 300 Votes", urgent: true },
    { icon: "🔧", title: "Gym Equipment Upgrade Proposal", id: "#POLL-2024-005", started: "5 hours ago", ends: "Ends in 5 days", tags: ["Infrastructure", "Per Member", "Open Ballot"], status: "Live Voting", statusColor: "green", participation: 12, votes: "36 / 300 Votes" },
    { icon: "☑", title: "Q3 Maintenance Charge Hike (10%)", id: "#POLL-2024-003", ended: "Oct 15, 2024", tags: ["Finance", "One Vote per Flat", "Approved"], status: "Closed", statusColor: "gray", result: "Yes (65%) vs No (35%)", totalVotes: "280 Total Votes" },
    { icon: "🗓", title: "Visitor Parking Policy Revision", id: "#POLL-2024-006", starts: "Nov 20, 2024 (10:00 AM)", tags: ["Rules & Regulations", "Per Member"], status: "Scheduled", statusColor: "orange" },
  ];

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-8">
        <div className="d-flex gap-2 mb-3 flex-wrap align-items-center">
          {["Active", "Scheduled", "Closed", "Drafts"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 20px", borderRadius: 30, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", background: tab === t ? colors.primary : "#f1f5f9", color: tab === t ? "#fff" : colors.muted }}>{t}</button>
          ))}
          <input className="form-control ms-auto" placeholder="Search polls..." style={{ maxWidth: 180, borderRadius: 30, fontSize: 13 }} />
          <button className="btn" style={{ background: colors.accent, color: "#fff", borderRadius: 30, fontWeight: 600 }}>+ Create Poll</button>
        </div>

        {polls.map((p, i) => (
          <div key={i} style={{ background: colors.card, borderRadius: 12, padding: 18, border: `1px solid ${colors.border}`, marginBottom: 12 }}>
            <div className="d-flex gap-3 align-items-start">
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{p.icon}</div>
              <div style={{ flex: 1 }}>
                <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{p.title}</span>
                  {badge("● " + p.status, p.statusColor === "green" ? "green" : p.statusColor === "orange" ? "orange" : "gray")}
                </div>
                <div style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>
                  ID: {p.id} • Started: {p.started || ""}{p.started && p.ends && " • "}{p.ends && <span style={{ color: p.urgent ? "#dc2626" : colors.muted }}>{p.ends}</span>}{p.ended && `Ended: ${p.ended}`}{p.starts && `Starts: ${p.starts}`}
                </div>
                <div className="d-flex gap-1 flex-wrap mb-2">
                  {p.tags && p.tags.map(t => <span key={t} style={{ fontSize: 11, padding: "2px 8px", border: `1px solid ${colors.border}`, borderRadius: 4 }}>{t}</span>)}
                </div>
                {p.participation !== undefined && (
                  <div>
                    <div className="d-flex justify-content-between mb-1">
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{p.participation}% Participation</span>
                      <span style={{ fontSize: 12, color: colors.muted }}>{p.votes}</span>
                    </div>
                    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${p.participation}%`, height: "100%", background: p.participation > 50 ? "#16a34a" : colors.accent, borderRadius: 3 }} />
                    </div>
                  </div>
                )}
                {p.result && (
                  <div>
                    <div style={{ fontSize: 12, marginBottom: 4 }}>Result: <span style={{ color: "#16a34a", fontWeight: 600 }}>Yes (65%)</span> vs No (35%) &nbsp;&nbsp;{p.totalVotes}</div>
                    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: "65%", height: "100%", background: colors.accent, borderRadius: 3 }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="d-flex gap-2 align-items-start">
                {(p.status === "Live Voting" || p.status === "Closed") && (
                  <button className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 8, fontSize: 12 }}>{p.status === "Closed" ? "View Report" : "Analytics"}</button>
                )}
                {p.status === "Scheduled" && (
                  <button className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 8, fontSize: 12 }}>Edit</button>
                )}
                <span style={{ color: colors.muted, cursor: "pointer" }}>⋮</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="col-12 col-lg-4">
        {/* Voting Overview */}
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}`, marginBottom: 16 }}>
          <h6 style={{ fontWeight: 700, marginBottom: 12 }}>🗳 Voting Overview</h6>
          <div className="row g-2 text-center">
            {[{ label: "Active Polls", value: "2" }, { label: "Avg Turnout", value: "85%", blue: true }, { label: "Total Polls (YTD)", value: "12" }, { label: "Digital Adoption", value: "98%", green: true }].map(s => (
              <div className="col-6" key={s.label} style={{ borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: 800, fontSize: 22, color: s.green ? "#16a34a" : colors.text, padding: "8px 0" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: colors.muted }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Create */}
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}`, marginBottom: 16 }}>
          <h6 style={{ fontWeight: 700, marginBottom: 12 }}>⚡ Quick Create</h6>
          {[{ icon: "👥", label: "AGM Voting", sub: "One vote per flat" }, { icon: "🔧", label: "Swimming Pool Rules", sub: "Financial approval" }, { icon: "⚖️", label: "Rule Change", sub: "Amend by-laws" }].map(q => (
            <div key={q.label} className="d-flex align-items-center gap-3" style={{ padding: "10px 12px", borderRadius: 10, background: "#f8fafc", marginBottom: 8, cursor: "pointer" }}>
              <span style={{ fontSize: 20 }}>{q.icon}</span>
              <div><div style={{ fontWeight: 600, fontSize: 13 }}>{q.label}</div><div style={{ fontSize: 11, color: colors.muted }}>{q.sub}</div></div>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>
          <h6 style={{ fontWeight: 700, marginBottom: 12 }}>🗓 Upcoming Events</h6>
          {[{ date: "15 Nov", title: "Committee Election", sub: "Nominations close in 2 days" }, { date: "01 Dec", title: "Vendor Contract Renewal", sub: "Security & Housekeeping" }].map(e => (
            <div key={e.date} className="d-flex gap-3 align-items-center mb-3">
              <div style={{ background: colors.accentLight, color: colors.accent, fontWeight: 700, fontSize: 12, borderRadius: 8, padding: "6px 10px", textAlign: "center", minWidth: 44 }}>
                {e.date.split(" ")[0]}<br />{e.date.split(" ")[1]}
              </div>
              <div><div style={{ fontWeight: 600, fontSize: 13 }}>{e.title}</div><div style={{ fontSize: 11, color: colors.muted }}>{e.sub}</div></div>
            </div>
          ))}
          <button className="btn w-100" style={{ background: colors.primary, color: "#fff", borderRadius: 8 }}>Show all upcoming events</button>
        </div>
      </div>
    </div>
  );
}

// ── ADD MEMBER PAGE ────────────────────────────────────────────────────────────
function AddMemberPage() {
  const [memType, setMemType] = useState("Owner");
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#0009", position: "fixed", inset: 0, zIndex: 0 }} />
      <div style={{ background: colors.card, borderRadius: 16, padding: 32, maxWidth: 560, width: "100%", position: "relative", zIndex: 1, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 style={{ fontWeight: 800, marginBottom: 0 }}>Add New Member</h5>
          <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: colors.muted }}>✕</button>
        </div>
        <div className="row g-3 mb-3">
          <div className="col-6">
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: "block" }}>Select Wing</label>
            <select className="form-select" style={{ borderRadius: 10 }}><option>Select Wing</option><option>Wing A</option><option>Wing B</option><option>Wing C</option></select>
          </div>
          <div className="col-6">
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: "block" }}>Flat / Unit Number</label>
            <select className="form-select" style={{ borderRadius: 10 }}><option>Select Unit</option></select>
          </div>
        </div>
        <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, display: "block" }}>Membership Type</label>
        <div className="d-flex gap-0 mb-3" style={{ background: "#f1f5f9", borderRadius: 30, padding: 3 }}>
          {["Owner", "Tenant", "Family Member"].map(t => (
            <button key={t} onClick={() => setMemType(t)} style={{ flex: 1, padding: "8px 0", border: "none", borderRadius: 28, fontWeight: 600, fontSize: 13, cursor: "pointer", background: memType === t ? colors.accent : "transparent", color: memType === t ? "#fff" : colors.muted }}>{t}</button>
          ))}
        </div>
        <div className="row g-3 mb-3">
          <div className="col-6">
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: "block" }}>First Name</label>
            <input className="form-control" placeholder="Enter First Name" style={{ borderRadius: 10 }} />
          </div>
          <div className="col-6">
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: "block" }}>Last Name</label>
            <input className="form-control" placeholder="Enter Last Name" style={{ borderRadius: 10 }} />
          </div>
        </div>
        <div className="row g-3 mb-3">
          <div className="col-6">
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: "block" }}>Phone Number</label>
            <div className="input-group"><span className="input-group-text" style={{ borderRadius: "10px 0 0 10px" }}>+91</span><input className="form-control" placeholder="98765 43210" style={{ borderRadius: "0 10px 10px 0" }} /></div>
          </div>
          <div className="col-6">
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: "block" }}>Email Address</label>
            <input className="form-control" placeholder="Enter Email Address" style={{ borderRadius: 10 }} />
          </div>
        </div>
        <div className="row g-3 mb-3">
          <div className="col-6">
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: "block" }}>Residency Status</label>
            <select className="form-select" style={{ borderRadius: 10 }}><option>Select Wing</option></select>
          </div>
          <div className="col-6">
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: "block" }}>Move-in Date</label>
            <input className="form-control" type="date" style={{ borderRadius: 10 }} />
          </div>
        </div>
        <div className="form-check mb-4">
          <input className="form-check-input" type="checkbox" defaultChecked />
          <label className="form-check-label" style={{ fontSize: 13 }}>Mark as Primary Member for this unit</label>
        </div>
        <div className="d-flex gap-2 justify-content-end">
          <button className="btn btn-outline-secondary" style={{ borderRadius: 10, minWidth: 100 }}>Cancel</button>
          <button className="btn" style={{ background: colors.accent, color: "#fff", borderRadius: 10, minWidth: 120, fontWeight: 700 }}>Add Member</button>
        </div>
      </div>
    </div>
  );
}

// ── DOCUMENTS & NOC PAGE ───────────────────────────────────────────────────────
function DocumentsPage() {
  const docs = [
    { icon: "✈️", title: "NOC for Passport", desc: "Address proof and residency confirmation for passport application or renewal.", meta: "Validity: 6 Months", color: "#dbeafe" },
    { icon: "🏦", title: "NOC for Bank Loan", desc: "Clearance certificate stating no outstanding society dues for loan processing.", meta: "Processing: 2 Days", color: "#dbeafe" },
    { icon: "🔎", title: "Tenant Verification NOC", desc: "Approval for renting out flat to new tenants after police verification check.", meta: "Requires: Lease Agreement", color: "#dbeafe" },
    { icon: "🔄", title: "NOC for Passport", desc: "Kindly provide the required documentation for the official ownership transfer process.", meta: "Validity: 6 Months", color: "#dbeafe" },
  ];
  return (
    <div className="row g-4">
      <div className="col-12 col-lg-8">
        <div style={{ background: colors.card, borderRadius: 14, padding: 24, border: `1px solid ${colors.border}` }}>
          <h5 style={{ fontWeight: 800, marginBottom: 4 }}>Letters &amp; Certificates</h5>
          <p style={{ color: colors.muted, fontSize: 13, marginBottom: 20 }}>Issue No Objection Certificates (NOC) and other official documents.</p>
          <h6 style={{ fontWeight: 700, marginBottom: 16 }}>📄 Issue New Document</h6>
          <div className="row g-3">
            {docs.map((d, i) => (
              <div className="col-6" key={i}>
                <div style={{ border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20, cursor: "pointer" }} className="h-100">
                  <div style={{ width: 48, height: 48, background: d.color, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 12 }}>{d.icon}</div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{d.title}</div>
                  <div style={{ fontSize: 12, color: colors.muted, marginBottom: 12 }}>{d.desc}</div>
                  <hr style={{ margin: "10px 0" }} />
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ fontSize: 12, color: colors.accent, fontWeight: 600 }}>{d.meta}</span>
                    <span style={{ color: colors.accent }}>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h6 style={{ fontWeight: 700, marginTop: 24, marginBottom: 12 }}>🕐 Recently Issued</h6>
          <div style={{ fontSize: 13, color: colors.muted }}>No recent documents issued.</div>
        </div>
      </div>

      <div className="col-12 col-lg-4">
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>
          <h6 style={{ fontWeight: 700, marginBottom: 4 }}>Latest Generated</h6>
          <p style={{ fontSize: 12, color: colors.muted, marginBottom: 16 }}>Automatic letterhead &amp; signature applied.</p>
          <div style={{ border: `1px solid ${colors.border}`, borderRadius: 10, padding: 16, marginBottom: 12, fontSize: 12 }}>
            <div style={{ textAlign: "center", fontWeight: 800, marginBottom: 4 }}>GREEN VALLEY CO-OP SOCIETY</div>
            <div style={{ textAlign: "center", color: colors.muted, fontSize: 10, marginBottom: 12 }}>Reg No. BOM/HSG/1234 • Palm Beach Road, CA</div>
            <div style={{ marginBottom: 4 }}>To: The Branch Manager</div>
            <div style={{ marginBottom: 8 }}>State Bank of India</div>
            <div style={{ marginBottom: 8 }}><strong>Subject:</strong> No Objection Certificate for Loan</div>
            <div style={{ marginBottom: 8, color: colors.muted }}>This is to certify that Mr. Michael Chen is the registered owner of Flat No. A-501 in our society...</div>
            <div style={{ marginBottom: 12, color: colors.muted }}>The society has no objection to the bank granting a loan against the said flat.</div>
            <div style={{ textAlign: "right", fontStyle: "italic", fontWeight: 600 }}>Approved</div>
            <div style={{ textAlign: "right", fontSize: 10, color: colors.muted }}>Secretary Signature</div>
          </div>
          <div style={{ background: "#dcfce7", color: "#16a34a", fontSize: 13, fontWeight: 600, padding: "8px 12px", borderRadius: 8, marginBottom: 12 }}>✅ Digitally Signed &amp; Verified</div>
          <div className="d-flex gap-2">
            <button className="btn flex-fill" style={{ background: colors.accent, color: "#fff", borderRadius: 8, fontSize: 13 }}>🖨 Print / PDF</button>
            <button className="btn flex-fill btn-outline-secondary" style={{ borderRadius: 8, fontSize: 13 }}>Email</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── REGISTERS PAGE ─────────────────────────────────────────────────────────────
function RegistersPage() {
  const registers = [
    { icon: "👥", label: "Member Register", value: "1,245", sub: "Total active members", meta: "↑ 12 this week", metaColor: "green", color: "#dbeafe" },
    { icon: "🏠", label: "Unit Register", value: "420", sub: "95% Occupancy", meta: "20 Vacant", color: "#f3e8ff" },
    { icon: "🚗", label: "Parking Register", value: "512", sub: "Slots allocated", meta: "14 Guests slots open", color: "#ffedd5" },
    { icon: "🎪", label: "Vendor Register", value: "28", sub: "Active service providers", meta: "3 Pending approval", color: "#dcfce7" },
    { icon: "📦", label: "Asset Register", value: "$1.2M", sub: "Total Asset Value", meta: "85 Items Tracked", color: "#fef9c3" },
    { icon: "😟", label: "Complaint Register", value: "12", sub: "Open issues", meta: "3 High Priority", metaColor: "red", color: "#fee2e2" },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 style={{ fontWeight: 800, marginBottom: 2 }}>Registers Overview</h4>
          <p style={{ color: colors.muted, marginBottom: 0, fontSize: 13 }}>Quick access to all management modules</p>
        </div>
        <button className="btn" style={{ background: colors.accent, color: "#fff", borderRadius: 10, fontWeight: 600 }}>+ New Entry</button>
      </div>
      <div className="row g-3">
        {registers.map((r, i) => (
          <div className="col-12 col-md-6 col-lg-4" key={i}>
            <div style={{ background: colors.card, borderRadius: 14, padding: 22, border: `1px solid ${colors.border}` }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div style={{ width: 52, height: 52, background: r.color, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{r.icon}</div>
                <span style={{ cursor: "pointer", color: colors.muted }}>⋯</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{r.label}</div>
              <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 4 }}>{r.value}</div>
              <div style={{ fontSize: 12, color: colors.muted, marginBottom: 12 }}>{r.sub}</div>
              <hr style={{ margin: "10px 0" }} />
              <div className="d-flex justify-content-between align-items-center">
                <span style={{ fontSize: 12, color: r.metaColor === "red" ? "#dc2626" : r.metaColor === "green" ? "#16a34a" : colors.muted }}>{r.meta}</span>
                <a href="#" style={{ fontSize: 12, color: colors.accent, fontWeight: 600, textDecoration: "none" }}>View All →</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── RULES & BY-LAWS PAGE ───────────────────────────────────────────────────────
function RulesPage() {
  const rules = [
    { title: "Quiet Hours Policy", sub: "10:00 PM to 6:00 AM daily", scope: "Entire Society", penalty: "₹500 / Offense", type: "BY-LAW" },
    { title: "Visitor Parking Limit", sub: "Max 4 hours without permit", scope: "Visitor Lot A & B", penalty: "Tow + ₹1500", type: "RULE" },
    { title: "Balcony Guidelines", sub: "No hanging clothes, BBQ grills", scope: "Block C, Wing 1", penalty: "Warning", type: "BY-LAW" },
    { title: "Pet Clean-up Policy", sub: "Immediate removal of waste required", scope: "Entire Society", penalty: "₹150 Fine", type: "BY-LAW" },
    { title: "Renovation Hours", sub: "Mon-Fri 9AM-5PM only", scope: "Entire Society", penalty: "Stop Work Order", type: "RULE" },
  ];

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-8">
        {/* Stats */}
        <div className="row g-3 mb-4">
          {[{ label: "Total Slots", value: "512", meta: "↑ 2 added this month", metaColor: "green" }, { label: "Violation Notices", value: "18", meta: "Pending review: 5", metaColor: "red" }, { label: "Penalty Collection", value: "₹21,250", meta: "Avg. penalty: ₹500" }].map(s => (
            <div className="col-4" key={s.label}>
              <div style={{ background: colors.card, borderRadius: 12, padding: 16, border: `1px solid ${colors.border}` }}>
                <div style={{ color: colors.muted, fontSize: 12 }}>{s.label}</div>
                <div style={{ fontWeight: 800, fontSize: 24, margin: "4px 0" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: s.metaColor === "red" ? "#dc2626" : s.metaColor === "green" ? "#16a34a" : colors.muted }}>{s.meta}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: colors.card, borderRadius: 14, border: `1px solid ${colors.border}`, overflow: "hidden" }}>
          <div className="d-flex justify-content-between align-items-center p-3">
            <h6 style={{ fontWeight: 800, marginBottom: 0 }}>Active Rules &amp; By-laws</h6>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 8 }}>🔽 Filter</button>
              <button className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 8 }}>⬇ Export</button>
            </div>
          </div>
          <table className="table mb-0" style={{ fontSize: 13 }}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                <th style={{ fontWeight: 600, color: colors.muted, padding: "10px 16px" }}>RULE TITLE</th>
                <th style={{ fontWeight: 600, color: colors.muted }}>APPLICABILITY</th>
                <th style={{ fontWeight: 600, color: colors.muted }}>PENALTY</th>
                <th style={{ fontWeight: 600, color: colors.muted }}>TYPE</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 600 }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: colors.muted }}>{r.sub}</div>
                  </td>
                  <td style={{ color: colors.muted }}>📍 {r.scope}</td>
                  <td style={{ fontWeight: 500 }}>{r.penalty}</td>
                  <td>{badge(r.type, r.type === "BY-LAW" ? "blue" : "gray")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center p-3">
            <a href="#" style={{ color: colors.accent, fontWeight: 600, fontSize: 13, textDecoration: "none" }}>View All Rules →</a>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-4">
        {/* Management Actions */}
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}`, marginBottom: 16 }}>
          <h6 style={{ fontWeight: 700, marginBottom: 12 }}>Management Actions</h6>
          {[
            { icon: "➕", bg: "#dbeafe", label: "Create By-law", sub: "Draft new regulation" },
            { icon: "🗺", bg: "#dcfce7", label: "Attach to Block/Wing", sub: "Assign rules to areas" },
            { icon: "⚠️", bg: "#fee2e2", label: "Define Penalties", sub: "Set fines & consequences" },
          ].map(a => (
            <div key={a.label} className="d-flex align-items-center gap-3" style={{ padding: "12px", borderRadius: 10, border: `1px solid ${colors.border}`, marginBottom: 8, cursor: "pointer" }}>
              <div style={{ width: 40, height: 40, background: a.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{a.icon}</div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{a.label}</div><div style={{ fontSize: 11, color: colors.muted }}>{a.sub}</div></div>
              <span style={{ color: colors.muted }}>›</span>
            </div>
          ))}
        </div>

        {/* Recent Violations */}
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>
          <div className="d-flex justify-content-between mb-3">
            <h6 style={{ fontWeight: 700, marginBottom: 0 }}>Recent Violations</h6>
            <a href="#" style={{ color: colors.accent, fontSize: 13, textDecoration: "none" }}>View All</a>
          </div>
          {[{ dot: "red", label: "Noise Complaint", sub: "Unit 402 • 2 hours ago" }, { dot: "orange", label: "Improper Parking", sub: "Guest Lot • 5 hours ago" }, { dot: "green", label: "Trash Disposal", sub: "Resolved • Yesterday" }].map((v, i) => (
            <div key={i} className="d-flex align-items-center gap-2 mb-2">
              <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: v.dot === "red" ? "#dc2626" : v.dot === "orange" ? "#f97316" : "#16a34a" }} />
              <div><div style={{ fontWeight: 600, fontSize: 13 }}>{v.label}</div><div style={{ fontSize: 11, color: colors.muted }}>{v.sub}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── COMPLAINTS PAGE ────────────────────────────────────────────────────────────
function ComplaintsPage() {
  const complaints = [
    { id: "#C-1042", title: "Lift B not working", unit: "A-201", cat: "Maintenance", priority: "High", status: "Open", statusColor: "red", time: "2h ago" },
    { id: "#C-1041", title: "Water leakage in corridor", unit: "B-305", cat: "Plumbing", priority: "Medium", status: "In Progress", statusColor: "orange", time: "5h ago" },
    { id: "#C-1040", title: "Gym AC not functioning", unit: "Common", cat: "Electrical", priority: "Low", status: "Open", statusColor: "red", time: "1d ago" },
    { id: "#C-1039", title: "Parking slot encroachment", unit: "B-101", cat: "Parking", priority: "Medium", status: "Resolved", statusColor: "green", time: "2d ago" },
    { id: "#C-1038", title: "Noisy neighbours after 10 PM", unit: "C-402", cat: "Noise", priority: "Medium", status: "Resolved", statusColor: "green", time: "3d ago" },
  ];
  const [page, setPage] = useState(1);
  const totalPages = 4;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 style={{ fontWeight: 800, marginBottom: 2 }}>Complaints</h4>
          <p style={{ color: colors.muted, fontSize: 13, marginBottom: 0 }}>Manage and track all society complaints</p>
        </div>
        <button className="btn" style={{ background: colors.accent, color: "#fff", borderRadius: 10, fontWeight: 600 }}>+ Log Complaint</button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[{ label: "Total Open", value: "14", color: "#fee2e2", text: "#dc2626" }, { label: "In Progress", value: "6", color: "#ffedd5", text: "#c2410c" }, { label: "Resolved Today", value: "3", color: "#dcfce7", text: "#16a34a" }, { label: "Avg Resolution", value: "2.4d", color: "#dbeafe", text: colors.accent }].map(s => (
          <div className="col-6 col-md-3" key={s.label}>
            <div style={{ background: s.color, borderRadius: 12, padding: "14px 18px" }}>
              <div style={{ color: s.text, fontWeight: 800, fontSize: 26 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: s.text }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: colors.card, borderRadius: 14, border: `1px solid ${colors.border}`, overflow: "hidden" }}>
        <table className="table mb-0" style={{ fontSize: 13 }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              {["ID", "Title", "Unit", "Category", "Priority", "Status", "Time"].map(h => (
                <th key={h} style={{ fontWeight: 600, color: colors.muted, padding: "12px 16px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.id}>
                <td style={{ padding: "12px 16px", color: colors.accent, fontWeight: 600 }}>{c.id}</td>
                <td style={{ fontWeight: 600 }}>{c.title}</td>
                <td style={{ color: colors.muted }}>{c.unit}</td>
                <td><span style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>{c.cat}</span></td>
                <td>{badge(c.priority, c.priority === "High" ? "red" : c.priority === "Medium" ? "orange" : "gray")}</td>
                <td>{badge(c.status, c.statusColor)}</td>
                <td style={{ color: colors.muted }}>{c.time}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center p-3" style={{ borderTop: `1px solid ${colors.border}` }}>
          <span style={{ fontSize: 13, color: colors.muted }}>Showing 1–5 of {totalPages * 5} complaints</span>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))} style={{ borderRadius: "8px 0 0 8px" }}>‹</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <li key={n} className={`page-item ${page === n ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setPage(n)} style={{ background: page === n ? colors.accent : "", borderColor: page === n ? colors.accent : "" }}>{n}</button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(p => Math.min(totalPages, p + 1))} style={{ borderRadius: "0 8px 8px 0" }}>›</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

// ── FLAT TRANSFER PAGE ─────────────────────────────────────────────────────────
function FlatTransferPage() {
  const steps = ["Request Details", "No-Dues", "Calculations", "Doc Verify", "Final Approval"];
  const current = 2;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <div style={{ fontSize: 12, color: colors.muted }}>Transfers › #TR-2024-852</div>
          <h4 style={{ fontWeight: 800, marginBottom: 0 }}>Transfer Request: Flat A-402 <span style={{ fontSize: 14 }}>{badge("In Progress", "blue")}</span></h4>
          <p style={{ color: colors.muted, fontSize: 13, marginBottom: 0 }}>Green Valley Heights • Block A • 4th Floor</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" style={{ borderRadius: 10 }}>Reject Request</button>
          <button className="btn" style={{ background: colors.accent, color: "#fff", borderRadius: 10, fontWeight: 600 }}>Proceed to Approval</button>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}`, marginBottom: 20 }}>
        <div className="d-flex align-items-center" style={{ position: "relative" }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              {i < steps.length - 1 && (
                <div style={{ position: "absolute", top: 16, left: "50%", width: "100%", height: 2, background: i < current ? colors.accent : colors.border, zIndex: 0 }} />
              )}
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: i < current ? colors.accent : i === current ? "#fff" : "#f1f5f9", border: i === current ? `2px solid ${colors.accent}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, zIndex: 1, color: i < current ? "#fff" : i === current ? colors.accent : colors.muted }}>
                {i < current ? "✓" : i === current ? "⊙" : "○"}
              </div>
              <div style={{ fontSize: 11, marginTop: 6, color: i === current ? colors.text : colors.muted, fontWeight: i === current ? 700 : 400 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          {/* Ownership Details */}
          <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}`, marginBottom: 16 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 style={{ fontWeight: 700, marginBottom: 0 }}>Ownership Transfer Details</h6>
              <a href="#" style={{ fontSize: 12, color: colors.accent, textDecoration: "none" }}>View Full Application</a>
            </div>
            <div className="row g-3">
              {[
                { role: "CURRENT OWNER (SELLER)", name: "Rajesh Kumar", phone: "+91 98765 43210", email: "rajesh.k@gmail.com", img: "RK" },
                { role: "NEW OWNER (BUYER)", name: "Priya Sharma", phone: "+91 91234 56789", email: "priya.s.design@gmail.com", img: "PS" },
              ].map(p => (
                <div className="col-6" key={p.role}>
                  <div style={{ fontSize: 10, color: colors.muted, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>{p.role}</div>
                  <div style={{ background: "#f0f7ff", borderRadius: 10, padding: 14 }}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: colors.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>{p.img}</div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: colors.muted }}>{p.phone}</div>
                        <div style={{ fontSize: 11, color: colors.muted }}>{p.email}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* No-Dues & Transfer Charges */}
          <div className="row g-3">
            <div className="col-6">
              <div style={{ background: colors.card, borderRadius: 14, padding: 18, border: `1px solid ${colors.border}` }}>
                <div className="d-flex justify-content-between mb-2">
                  <h6 style={{ fontWeight: 700, marginBottom: 0 }}>No-Dues Clearance</h6>
                  <span style={{ color: "#16a34a", fontWeight: 600, fontSize: 13 }}>✅ Cleared</span>
                </div>
                {[{ label: "Water & Maintenance", status: "Paid" }].map(d => (
                  <div key={d.label} className="d-flex justify-content-between" style={{ fontSize: 13 }}>
                    <span>💧 {d.label}</span><span style={{ color: "#16a34a", fontWeight: 600 }}>{d.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-6">
              <div style={{ background: colors.card, borderRadius: 14, padding: 18, border: `1px solid ${colors.border}` }}>
                <div className="d-flex justify-content-between mb-2">
                  <h6 style={{ fontWeight: 700, marginBottom: 0 }}>Transfer Charges</h6>
                  <span style={{ fontSize: 11, color: colors.muted }}>Due Date: Today</span>
                </div>
                <div className="d-flex justify-content-between" style={{ fontSize: 13 }}>
                  <span>Society Transfer Fee</span><span style={{ fontWeight: 700 }}>₹25,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          {/* Approval Workflow */}
          <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>
            <h6 style={{ fontWeight: 700, marginBottom: 16 }}>Approval Workflow</h6>
            {[
              { label: "Application Submitted", sub: "Oct 12, 10:30 AM • Rajesh K.", done: true },
              { label: "NDC Generated", sub: "Oct 13, 02:15 PM • System", done: true },
              { label: "Manager Review", sub: "Oct 14, 09:00 AM • James W.", done: true },
              { label: "Committee Approval", sub: "Pending • Awaiting Meeting", pending: true },
            ].map((w, i) => (
              <div key={i} className="d-flex gap-3 align-items-start mb-3">
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: w.pending ? "#f97316" : colors.accent, marginTop: 4, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: w.pending ? "#f97316" : colors.text }}>{w.label}</div>
                  <div style={{ fontSize: 11, color: colors.muted }}>{w.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── STAFF ATTENDANCE PAGE ──────────────────────────────────────────────────────
function StaffPage() {
  const [page, setPage] = useState(1);
  const totalPages = 3;
  const staff = [
    { name: "Ramesh Gupta", role: "Security Guard", shift: "Morning", status: "Present", statusColor: "green", time: "08:02 AM" },
    { name: "Suresh Patil", role: "Housekeeping", shift: "Morning", status: "Present", statusColor: "green", time: "08:15 AM" },
    { name: "Kavita Singh", role: "Receptionist", shift: "Morning", status: "Late", statusColor: "orange", time: "09:32 AM" },
    { name: "Mohan Nair", role: "Security Guard", shift: "Evening", status: "Absent", statusColor: "red", time: "—" },
    { name: "Priya Verma", role: "Housekeeping", shift: "Morning", status: "Present", statusColor: "green", time: "07:55 AM" },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ fontWeight: 800, marginBottom: 0 }}>Staff Attendance</h4>
        <div className="d-flex gap-2">
          <input type="date" className="form-control" style={{ borderRadius: 10, width: "auto" }} defaultValue="2025-12-14" />
          <button className="btn btn-outline-secondary" style={{ borderRadius: 10 }}>⬇ Export</button>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[{ label: "Present", value: "48", color: "#dcfce7", tc: "#16a34a" }, { label: "Absent", value: "2", color: "#fee2e2", tc: "#dc2626" }, { label: "Late", value: "3", color: "#ffedd5", tc: "#c2410c" }, { label: "Total Staff", value: "50", color: "#dbeafe", tc: colors.accent }].map(s => (
          <div className="col-6 col-md-3" key={s.label}>
            <div style={{ background: s.color, borderRadius: 12, padding: "14px 18px" }}>
              <div style={{ fontWeight: 800, fontSize: 26, color: s.tc }}>{s.value}</div>
              <div style={{ fontSize: 12, color: s.tc }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: colors.card, borderRadius: 14, border: `1px solid ${colors.border}`, overflow: "hidden" }}>
        <table className="table mb-0" style={{ fontSize: 13 }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              {["Name", "Role", "Shift", "Status", "Time In"].map(h => (
                <th key={h} style={{ fontWeight: 600, color: colors.muted, padding: "12px 16px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map((s, i) => (
              <tr key={i}>
                <td style={{ padding: "12px 16px", fontWeight: 600 }}>{s.name}</td>
                <td style={{ color: colors.muted }}>{s.role}</td>
                <td><span style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>{s.shift}</span></td>
                <td>{badge(s.status, s.statusColor)}</td>
                <td style={{ color: s.status === "Absent" ? colors.muted : colors.text }}>{s.time}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center p-3" style={{ borderTop: `1px solid ${colors.border}` }}>
          <span style={{ fontSize: 13, color: colors.muted }}>Showing 1–5 of {totalPages * 5} staff</span>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>‹</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <li key={n} className={`page-item ${page === n ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setPage(n)} style={{ background: page === n ? colors.accent : "", borderColor: page === n ? colors.accent : "" }}>{n}</button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>›</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

// ── PLACEHOLDER PAGE ───────────────────────────────────────────────────────────
function PlaceholderPage({ label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, color: colors.muted }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🏗</div>
      <h5 style={{ fontWeight: 700 }}>{label}</h5>
      <p>This page is coming soon.</p>
    </div>
  );
}

// ── PAGE MAP ───────────────────────────────────────────────────────────────────
const PAGE_MAP = {
  overview: <OverviewPage />,
  broadcasting: <BroadcastingPage />,
  noticeboard: <NoticeBoardPage />,
  polls: <PollsPage />,
  addmember: <AddMemberPage />,
  transfer: <PlaceholderPage label="Transfer Member" />,
  documents: <DocumentsPage />,
  flattransfer: <FlatTransferPage />,
  registers: <RegistersPage />,
  rules: <RulesPage />,
  complaints: <ComplaintsPage />,
  parking: <PlaceholderPage label="Parking" />,
  rentals: <PlaceholderPage label="Rentals & Tenants" />,
  staff: <StaffPage />,
};

// ── APP ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [activePage, setActivePage] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const pageTitles = {
    overview: ["Dashboards", "Overview"],
    broadcasting: ["Communication", "Broadcasting"],
    noticeboard: ["Communication", "Notice Board"],
    polls: ["Communication", "Polls & Voting"],
    addmember: ["Member Master", "Add Member"],
    transfer: ["Member Master", "Transfer Member"],
    documents: ["Administration", "Documents & NOC"],
    flattransfer: ["Administration", "Flat Transfer"],
    registers: ["Administration", "Registers"],
    rules: ["Administration", "Rules & By-laws"],
    complaints: ["Operations", "Complaints"],
    parking: ["Operations", "Parking"],
    rentals: ["Operations", "Rentals & Tenants"],
    staff: ["Operations", "Staff Attendance"],
  };

  const [section, pageTitle] = pageTitles[activePage] || ["", ""];

  return (
    <>
      {/* Bootstrap CDN */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" />

      <div style={{ display: "flex", height: "100vh", background: colors.bg, fontFamily: "'DM Sans', 'Nunito', system-ui, sans-serif", fontSize: 14 }}>
        {/* Sidebar */}
        <div style={{ width: sidebarCollapsed ? 60 : 220, flexShrink: 0, background: "#fff", borderRight: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", transition: "width 0.2s", overflow: "hidden" }}>
          {/* Logo */}
          <div style={{ padding: "16px 16px 8px", borderBottom: `1px solid ${colors.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setSidebarCollapsed(c => !c)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", padding: 4, flexShrink: 0 }}>☰</button>
            {!sidebarCollapsed && <span style={{ fontWeight: 800, fontSize: 15 }}>🏢 GreenValley</span>}
          </div>

          {/* Nav */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
            {SIDEBAR_ITEMS.map(({ section, items }) => (
              <div key={section}>
                {!sidebarCollapsed && (
                  <div style={{ padding: "8px 16px 4px", fontSize: 10, fontWeight: 700, color: colors.muted, letterSpacing: 1, textTransform: "uppercase" }}>{section}</div>
                )}
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    style={{
                      width: "100%", background: activePage === item.id ? colors.primary : "none", color: activePage === item.id ? "#fff" : colors.text,
                      border: "none", padding: sidebarCollapsed ? "10px 0" : "9px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                      fontSize: 13, fontWeight: activePage === item.id ? 700 : 500, textAlign: "left",
                      borderRadius: sidebarCollapsed ? 0 : "0",
                      justifyContent: sidebarCollapsed ? "center" : "flex-start",
                    }}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Top bar */}
          <div style={{ background: "#fff", borderBottom: `1px solid ${colors.border}`, padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 13, color: colors.muted }}>
              {section} {section && "/"} <strong style={{ color: colors.text }}>{pageTitle}</strong>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span style={{ fontSize: 13, color: colors.muted }}>14 Dec 2025</span>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: colors.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, cursor: "pointer" }}>🔔</div>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
              <span style={{ fontWeight: 600, fontSize: 13 }}>Karan Sharma</span>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {PAGE_MAP[activePage] || <PlaceholderPage label={pageTitle} />}
          </div>
        </div>
      </div>
    </>
  );
}