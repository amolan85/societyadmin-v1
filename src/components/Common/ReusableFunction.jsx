export function Badge({ label, c = "gray" }) {
  return <span className={`bx bx-${c}`}>{label}</span>;
}

export function Pagination({ page, total, onChange }) {
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

export function Prog({ pct, color = "var(--success)" }) {
  return <div className="sv-prog"><div className="sv-prog-bar" style={{ width: `${pct}%`, background: color }} /></div>;
}

export function var_blue() { return "#2563eb"; }