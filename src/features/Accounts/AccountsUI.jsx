import { useEffect } from "react";

// ══════════════════════════════════════════════════════════════
// INLINE STYLES ONLY. Two different Tailwind class approaches both
// failed to render (arbitrary hex values, then standard palette
// classes) — almost certainly because this project's Tailwind build
// isn't compiling classes from this folder, or global CSS (GlobalCss.jsx,
// injected app-wide) is overriding them. Inline styles have the highest
// practical specificity and don't depend on any build step, so they
// render correctly no matter what.
// ══════════════════════════════════════════════════════════════

const colors = {
  bg: "#f8fafc",
  white: "#ffffff",
  border: "#e2e8f0",
  borderLight: "#f1f5f9",
  blue50: "#eff6ff",
  blue100: "#dbeafe",
  blue400: "#60a5fa",
  blue500: "#3b82f6",
  blue600: "#2563eb",
  blue700: "#1d4ed8",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1e293b",
  green100: "#d1fae5",
  green700: "#047857",
  amber100: "#fef3c7",
  amber700: "#b45309",
  amber400: "#fbbf24",
  red100: "#ffe4e6",
  red600: "#e11d48",
  red700: "#be123c",
  indigo100: "#e0e7ff",
  indigo700: "#4338ca",
};

export const T = {
  page: { minHeight: "100vh", backgroundColor: colors.bg, color: colors.slate800, fontSize: 14 },
  headerBar: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, padding: "10px 16px", backgroundColor: colors.blue50, borderBottom: `1px solid ${colors.blue100}` },
  headerTitle: { color: colors.blue700, fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em", display: "flex", alignItems: "center", gap: 8, margin: 0 },
  panel: { backgroundColor: colors.white, border: `1px solid ${colors.border}`, borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" },
  panelHeader: { backgroundColor: colors.blue50, padding: "10px 16px", borderBottom: `1px solid ${colors.blue100}`, color: colors.blue700, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em", borderRadius: "8px 8px 0 0" },
  row: { borderBottom: `1px solid ${colors.borderLight}` },
  label: { color: colors.slate500, fontSize: 12, fontWeight: 500, marginBottom: 4, display: "block" },
  th: { textAlign: "left", padding: "10px 12px", color: colors.slate500, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em", borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.bg },
  td: { padding: "8px 12px", color: colors.slate700 },
  tdRight: { padding: "8px 12px", textAlign: "right", color: colors.slate700, fontVariantNumeric: "tabular-nums" },
  input: { width: "100%", backgroundColor: colors.white, border: `1px solid #cbd5e1`, color: colors.slate800, padding: "8px 12px", borderRadius: 6, fontSize: 14, boxSizing: "border-box" },
  select: { width: "100%", backgroundColor: colors.white, border: `1px solid #cbd5e1`, color: colors.slate800, padding: "8px 12px", borderRadius: 6, fontSize: 14, boxSizing: "border-box" },
  cardTitle: { fontSize: 14, fontWeight: 600, color: colors.slate800 },
  cardHint: { fontSize: 12, color: colors.slate400, marginTop: 2 },
  colors,
};

export const Badge = ({ children, tone = "slate" }) => {
  const tones = {
    slate: { backgroundColor: "#f1f5f9", color: colors.slate600 },
    green: { backgroundColor: colors.green100, color: colors.green700 },
    amber: { backgroundColor: colors.amber100, color: colors.amber700 },
    red: { backgroundColor: colors.red100, color: colors.red700 },
    blue: { backgroundColor: colors.blue100, color: colors.blue700 },
    indigo: { backgroundColor: colors.indigo100, color: colors.indigo700 },
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 500, ...(tones[tone] || tones.slate) }}>
      {children}
    </span>
  );
};

export const statusTone = (status) => {
  switch ((status || "").toLowerCase()) {
    case "posted":
    case "completed":
    case "active":
      return "green";
    case "draft":
    case "in_progress":
      return "amber";
    case "reversed":
    case "cancelled":
      return "red";
    default:
      return "slate";
  }
};

export const FKeyBar = ({ items = [], onEscape }) => {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && onEscape) { onEscape(); return; }
      const item = items.find((i) => i.key.toLowerCase() === e.key.toLowerCase());
      if (item) { e.preventDefault(); item.onPress(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [items, onEscape]);

  if (items.length === 0 && !onEscape) return null;

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: colors.white, borderTop: `1px solid ${colors.border}`, boxShadow: "0 -1px 4px rgba(0,0,0,0.05)", padding: "8px 16px", display: "flex", gap: 16, flexWrap: "wrap", zIndex: 40 }}>
      {items.map((i) => (
        <button
          key={i.key}
          onClick={i.onPress}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: colors.slate600, display: "flex", alignItems: "center", gap: 6, padding: 0 }}
        >
          <span style={{ backgroundColor: colors.blue600, color: colors.white, padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600 }}>{i.key}</span>
          {i.label}
        </button>
      ))}
      {onEscape && (
        <button onClick={onEscape} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: colors.slate600, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          <span style={{ backgroundColor: colors.slate500, color: colors.white, padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600 }}>Esc</span>
          Back
        </button>
      )}
    </div>
  );
};

export const Modal = ({ open, onClose, title, children, width = 520 }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(15,23,42,0.4)" }} onClick={onClose} />
      <div style={{ position: "relative", backgroundColor: colors.white, border: `1px solid ${colors.border}`, borderRadius: 12, boxShadow: "0 20px 25px rgba(0,0,0,0.15)", width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${colors.border}`, position: "sticky", top: 0, backgroundColor: colors.white, borderRadius: "12px 12px 0 0" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: colors.slate800, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: colors.slate400, fontSize: 22, lineHeight: 1 }}>&times;</button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
};

export const EmptyState = ({ message = "No records found" }) => (
  <div style={{ textAlign: "center", padding: "40px 0", color: colors.slate400, fontSize: 14 }}>{message}</div>
);

export const LoadingRow = ({ colSpan = 6 }) => (
  <tr><td colSpan={colSpan} style={{ textAlign: "center", padding: "32px 0", color: colors.slate400, fontSize: 14 }}>Loading…</td></tr>
);

export const Button = ({ children, onClick, variant = "primary", type = "button", disabled, style = {} }) => {
  const variants = {
    primary: { backgroundColor: disabled ? "#93c5fd" : colors.blue600, color: colors.white, border: "none" },
    secondary: { backgroundColor: colors.white, color: colors.slate700, border: `1px solid #cbd5e1` },
    danger: { backgroundColor: disabled ? "#fda4af" : colors.red600, color: colors.white, border: "none" },
    ghost: { backgroundColor: "transparent", color: colors.blue600, border: "none" },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 6,
        ...variants[variant], ...style,
      }}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, style = {}, ...props }) => (
  <label style={{ display: "block", marginBottom: 12 }}>
    {label && <span style={T.label}>{label}</span>}
    <input {...props} style={{ ...T.input, ...style }} />
  </label>
);

export const Select = ({ label, options = [], style = {}, placeholder = "Select…", ...props }) => (
  <label style={{ display: "block", marginBottom: 12 }}>
    {label && <span style={T.label}>{label}</span>}
    <select {...props} style={{ ...T.select, ...style }}>
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </label>
);

export const money = (val) => {
  const n = Number(val || 0);
  const formatted = Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n < 0 ? `(${formatted})` : formatted;
};

export const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date)) return d;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
};

// Defensive extraction — ErrorHandler's exact output shape isn't known here,
// so this checks every common possibility (string, {message}, {error},
// axios response body, nested .data) instead of silently falling back to a
// generic message when the real backend reason is available.
export const errMsg = (e, fallback = "Something went wrong") => {
  if (!e) return fallback;
  if (typeof e === "string") return e;
  if (e.message) return e.message;
  if (e.error) return typeof e.error === "string" ? e.error : (e.error.message || fallback);
  if (e.response?.data?.message) return e.response.data.message;
  if (e.response?.data?.error) return e.response.data.error;
  if (e.data?.message) return e.data.message;
  try { const s = JSON.stringify(e); if (s && s !== "{}") return s; } catch (_) { /* ignore */ }
  return fallback;
};

export const useRowNav = (count, onSelect) => {
  useEffect(() => {
    let idx = 0;
    const handler = (e) => {
      if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) return;
      const rows = document.querySelectorAll("[data-rownav]");
      if (!rows.length) return;
      if (e.key === "ArrowDown") { idx = Math.min(idx + 1, rows.length - 1); e.preventDefault(); }
      if (e.key === "ArrowUp") { idx = Math.max(idx - 1, 0); e.preventDefault(); }
      rows.forEach((r, i) => { r.style.backgroundColor = i === idx ? colors.blue50 : ""; });
      if (e.key === "Enter" && rows[idx]) { rows[idx].click(); }
      rows[idx]?.scrollIntoView({ block: "nearest" });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [count, onSelect]);
};
