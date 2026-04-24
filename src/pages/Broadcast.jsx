import { useState } from "react";

const notifications = [
  {
    id: 1,
    name: "Sameer Singh",
    avatar: "SS",
    color: "#e57373",
    message: "Shared an image for Water Leakage",
    detail:
      "This water leakage problem is really creating me and my block members problem! Please inform plumber to repair it ASAP.",
    time: "8 min ago",
    hasImage: true,
    imageUrl:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80",
  },
  {
    id: 2,
    name: "Maria Hill",
    avatar: "MH",
    color: "#64b5f6",
    message: "Committee Meeting today, 08:00 PM",
    time: "18 min",
  },
  {
    id: 3,
    name: "Mr. Roy Sing",
    avatar: "RS",
    color: "#81c784",
    message: "Updated notice board, Today, 11:00 AM",
    time: "1 hr ago",
  },
  {
    id: 4,
    name: "Riju Mittal",
    avatar: "RM",
    color: "#ffb74d",
    message: "Complaint registered, Today 07:30 AM",
    time: "4 hr ago",
  },
];

const navItems = [
  { section: "Dashboards", items: [{ icon: "⊞", label: "Overview" }] },
  {
    section: "Communication",
    items: [
      { icon: "📢", label: "Broadcasting", active: true },
      { icon: "📋", label: "Notice Board" },
      { icon: "📊", label: "Polls & Voting" },
    ],
  },
  {
    section: "Member Masters",
    items: [
      { icon: "👤", label: "Add Member" },
      { icon: "🔄", label: "Transfer Member" },
    ],
  },
  {
    section: "Accounts",
    items: [],
    badge: "*",
  },
  {
    section: "Administration",
    items: [
      { icon: "📄", label: "Documents & NOC" },
      { icon: "🏠", label: "Flat Transfer" },
      { icon: "📒", label: "Registers" },
      { icon: "⚖️", label: "Rules & By - laws" },
    ],
  },
  {
    section: "Operations",
    items: [
      { icon: "🔧", label: "Complaints" },
      { icon: "🚗", label: "Parking" },
      { icon: "🏢", label: "Rentals & Tenants" },
      { icon: "👷", label: "Staff Attendance" },
    ],
  },
];

export default function BroadcastingDashboard() {
  const [activeTab, setActiveTab] = useState("Announcement");
  const [notifTab, setNotifTab] = useState("All");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tabs = ["Announcement", "Emergency", "Circular", "Event"];
  const tabIcons = {
    Announcement: "📢",
    Emergency: "⚠️",
    Circular: "📄",
    Event: "📅",
  };

  const formatBold = () => document.execCommand("bold");
  const formatItalic = () => document.execCommand("italic");
  const formatUnderline = () => document.execCommand("underline");

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: "#f4f6f9",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 220 : 56,
          background: "#fff",
          borderRight: "1px solid #e8eaed",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s",
          overflow: "hidden",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {/* Sidebar header */}
        <div
          style={{
            padding: "14px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              color: "#555",
              padding: 0,
              flexShrink: 0,
            }}
          >
            ☰
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {navItems.map((section) => (
            <div key={section.section}>
              {sidebarOpen && (
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#9aa0a6",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "10px 16px 4px",
                  }}
                >
                  {section.section}
                  {section.badge && (
                    <span style={{ color: "#e53935" }}>{section.badge}</span>
                  )}
                </div>
              )}
              {section.items.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: sidebarOpen ? "8px 16px" : "8px 0",
                    justifyContent: sidebarOpen ? "flex-start" : "center",
                    cursor: "pointer",
                    borderRadius: 8,
                    margin: "1px 6px",
                    background: item.active ? "#1976d2" : "transparent",
                    color: item.active ? "#fff" : "#444",
                    fontWeight: item.active ? 600 : 400,
                    fontSize: 13,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!item.active)
                      e.currentTarget.style.background = "#f0f4ff";
                  }}
                  onMouseLeave={(e) => {
                    if (!item.active)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ fontSize: 15, flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {sidebarOpen && <span>{item.label}</span>}
                </div>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <header
          style={{
            background: "#fff",
            borderBottom: "1px solid #e8eaed",
            padding: "0 24px",
            height: 52,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#888", fontSize: 14 }}>Communication</span>
          <span style={{ color: "#888" }}>/</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#222" }}>
            Broadcasting
          </span>
          <div style={{ flex: 1 }} />
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#222",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <span style={{ fontSize: 12, color: "#888" }}>last updated 1m ago</span>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 16,
              color: "#888",
            }}
          >
            ⟳
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              color: "#888",
            }}
          >
            ···
          </button>
        </header>

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Center panel */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 28,
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                maxWidth: 700,
              }}
            >
              {/* Title */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 22,
                }}
              >
                <span style={{ fontSize: 20 }}>✏️</span>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1a1a1a",
                  }}
                >
                  Create & Publish
                </h2>
              </div>

              {/* Tabs */}
              <div
                style={{
                  display: "flex",
                  background: "#f0f2f5",
                  borderRadius: 50,
                  padding: 4,
                  marginBottom: 24,
                  gap: 2,
                }}
              >
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: "9px 0",
                      borderRadius: 50,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: activeTab === tab ? 700 : 500,
                      background:
                        activeTab === tab ? "#1976d2" : "transparent",
                      color: activeTab === tab ? "#fff" : "#666",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      transition: "all 0.18s",
                    }}
                  >
                    <span>{tabIcons[tab]}</span>
                    <span>{tab}</span>
                  </button>
                ))}
              </div>

              {/* Subject */}
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#333",
                    marginBottom: 8,
                  }}
                >
                  Subject / Title
                </label>
                <input
                  type="text"
                  placeholder="Example : Scheduled Maintenance of Lift B"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    border: "1px solid #dde1e7",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "#333",
                    outline: "none",
                    boxSizing: "border-box",
                    background: "#fff",
                  }}
                />
              </div>

              {/* Content */}
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#333",
                    marginBottom: 8,
                  }}
                >
                  Content
                </label>
                <div
                  style={{
                    border: "1px solid #dde1e7",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  {/* Toolbar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      padding: "6px 10px",
                      borderBottom: "1px solid #eee",
                      background: "#fafafa",
                    }}
                  >
                    {[
                      { label: "B", action: formatBold, style: { fontWeight: "bold" } },
                      { label: "I", action: formatItalic, style: { fontStyle: "italic" } },
                      { label: "U", action: formatUnderline, style: { textDecoration: "underline" } },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        onMouseDown={(e) => { e.preventDefault(); btn.action(); }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 13,
                          width: 28,
                          height: 28,
                          borderRadius: 4,
                          color: "#444",
                          ...btn.style,
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                    <div style={{ width: 1, height: 18, background: "#ddd", margin: "0 4px" }} />
                    {["≡", "≔", "🔗"].map((icon) => (
                      <button
                        key={icon}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 14,
                          width: 28,
                          height: 28,
                          borderRadius: 4,
                          color: "#444",
                        }}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="Type your announcement details here..."
                    onInput={(e) => setContent(e.currentTarget.innerHTML)}
                    style={{
                      minHeight: 100,
                      padding: "12px 14px",
                      fontSize: 13,
                      color: "#333",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Attachment */}
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#333",
                    marginBottom: 8,
                  }}
                >
                  Attachment (Optional)
                </label>
                <div
                  style={{
                    border: "2px dashed #d0d5dd",
                    borderRadius: 10,
                    padding: "32px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    background: "#fafbfc",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1976d2")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#d0d5dd")}
                >
                  <div style={{ fontSize: 30, color: "#888" }}>☁️</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>
                    Click to upload or drag files here
                  </div>
                  <div style={{ fontSize: 11, color: "#999" }}>
                    PDF, JPG, PNG up to 10MB
                  </div>
                </div>
              </div>

              {/* Broadcasting Channels */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#333",
                    marginBottom: 10,
                  }}
                >
                  Broadcasting Channels
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 16px",
                      background: "#e3f2fd",
                      borderRadius: 8,
                      border: "1.5px solid #1976d2",
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        background: "#1976d2",
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 12,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1976d2" }}>
                      App Notification
                    </span>
                  </div>
                  <button
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "1.5px solid #d0d5dd",
                      background: "#fff",
                      cursor: "pointer",
                      fontSize: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#666",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right notifications panel */}
          <aside
            style={{
              width: 340,
              background: "#fff",
              borderLeft: "1px solid #e8eaed",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              overflowY: "auto",
            }}
          >
            {/* Notif header */}
            <div
              style={{
                padding: "16px 18px 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>
                    Notifications
                  </span>
                  <span
                    style={{
                      background: "#1976d2",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    1
                  </span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span
                    style={{ fontSize: 12, color: "#1976d2", cursor: "pointer", fontWeight: 500 }}
                  >
                    Mark all as read
                  </span>
                  <span style={{ color: "#888", fontSize: 16, cursor: "pointer" }}>⋮</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 0 }}>
                {["All", "Mentions", "Archived"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setNotifTab(t)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: notifTab === t ? 700 : 500,
                      color: notifTab === t ? "#1976d2" : "#888",
                      padding: "6px 14px 10px",
                      borderBottom: notifTab === t ? "2px solid #1976d2" : "2px solid transparent",
                      marginBottom: -1,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications list */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid #f5f5f5",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: n.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {n.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#1a1a1a" }}>
                        {n.name}
                      </div>
                      <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                        {n.message}
                      </div>
                      {n.hasImage && (
                        <img
                          src={n.imageUrl}
                          alt="notification"
                          style={{
                            width: "100%",
                            height: 110,
                            objectFit: "cover",
                            borderRadius: 8,
                            marginTop: 8,
                          }}
                        />
                      )}
                      {n.detail && (
                        <div
                          style={{
                            borderLeft: "3px solid #1976d2",
                            paddingLeft: 8,
                            marginTop: 8,
                            fontSize: 12,
                            color: "#444",
                            lineHeight: 1.5,
                          }}
                        >
                          {n.detail}
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 6 }}>
                        {n.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action */}
            <div
              style={{
                padding: "16px 18px",
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a1a", marginBottom: 12 }}>
                Quick Action
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { label: "New Notice", icon: "＋", color: "#1976d2" },
                  { label: "Create Poll", icon: "📊", color: "#ff6d00" },
                  { label: "Issue NOC", icon: "📑", color: "#7c4dff" },
                ].map((action) => (
                  <button
                    key={action.label}
                    style={{
                      flex: 1,
                      background: "#1a1a1a",
                      border: "none",
                      borderRadius: 12,
                      padding: "14px 8px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                      transition: "transform 0.15s, background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#333";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#1a1a1a";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: action.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                      }}
                    >
                      {action.icon}
                    </div>
                    <span style={{ fontSize: 10, color: "#fff", fontWeight: 600, textAlign: "center" }}>
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}