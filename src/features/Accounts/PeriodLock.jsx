import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiLock, FiUnlock } from "react-icons/fi";
import { useLoader } from "../../context/LoaderContext";
import { lockPeriodApi, unlockPeriodApi, listPeriodsApi } from "../../services/AccountsApi";
import { T, Badge, Modal, Button, Input, fmtDate, FKeyBar } from "./AccountsUI";

const MONTH_NAMES = ["", "January","February","March","April","May","June","July","August","September","October","November","December"];

const currentFY = () => {
  const d = new Date();
  const y = d.getMonth() + 1 >= 4 ? d.getFullYear() : d.getFullYear() - 1;
  return `FY${y}-${String(y + 1).slice(2)}`;
};

const fyMonths = (fyLabel) => {
  const startYear = Number(fyLabel.match(/\d{4}/)?.[0] || new Date().getFullYear());
  const months = [];
  for (let i = 0; i < 12; i++) {
    const m = ((4 - 1 + i) % 12) + 1;
    const y = startYear + Math.floor((4 - 1 + i) / 12);
    months.push({ month: m, year: y });
  }
  return months;
};

const PeriodLock = ({ societyId, onEscape }) => {
  const { showLoader, hideLoader } = useLoader();
  const [fy, setFy] = useState(currentFY());
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [lockTarget, setLockTarget] = useState(null);
  const [closingNotes, setClosingNotes] = useState("");

  const fetchPeriods = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listPeriodsApi(societyId, fy);
      setPeriods(res?.periods || []);
    } catch (e) {
      toast.error(e?.message || "Failed to load periods");
    } finally {
      setLoading(false);
    }
  }, [societyId, fy]);

  useEffect(() => { fetchPeriods(); }, [fetchPeriods]);

  const findPeriod = (month, year) => periods.find((p) => p.period_month === month && p.period_year === year);

  const openLock = (month, year) => {
    setLockTarget({ month, year });
    setClosingNotes("");
    setLockModalOpen(true);
  };

  const handleLock = async (e) => {
    e.preventDefault();
    showLoader?.();
    try {
      await lockPeriodApi(societyId, { period_month: lockTarget.month, period_year: lockTarget.year, financial_year: fy, closing_notes: closingNotes });
      toast.success(`${MONTH_NAMES[lockTarget.month]} ${lockTarget.year} locked`);
      setLockModalOpen(false);
      fetchPeriods();
    } catch (e2) {
      toast.error(e2?.message || "Failed to lock period");
    } finally {
      hideLoader?.();
    }
  };

  const handleUnlock = async (month, year) => {
    if (!window.confirm(`Unlock ${MONTH_NAMES[month]} ${year}? This allows edits to that period again.`)) return;
    showLoader?.();
    try {
      await unlockPeriodApi(societyId, month, year);
      toast.success(`${MONTH_NAMES[month]} ${year} unlocked`);
      fetchPeriods();
    } catch (e) {
      toast.error(e?.message || "Failed to unlock period");
    } finally {
      hideLoader?.();
    }
  };

  return (
    <div style={T.page}>
      <div style={T.headerBar}>
        <h1 style={T.headerTitle}><FiLock size={16} /> Period Lock (Audit)</h1>
        <Input label="" style={{ width: 140 }} placeholder="FY2026-27" value={fy} onChange={(e) => setFy(e.target.value)} />
      </div>

      <p style={{ fontSize: 12, color: T.colors.slate500, margin: "16px 16px 12px" }}>
        Locking a period prevents any new or edited journal entries dated within that month —
        the audit trail becomes immutable for closed months.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, margin: "0 16px 64px" }}>
        {loading ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 32, color: T.colors.slate400 }}>Loading…</div>
        ) : (
          fyMonths(fy).map(({ month, year }) => {
            const p = findPeriod(month, year);
            const locked = p?.is_locked === 1;
            return (
              <div key={`${year}-${month}`} style={{ ...T.panel, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 500, color: T.colors.slate800 }}>{MONTH_NAMES[month]} {year}</div>
                  {locked ? (
                    <div style={{ fontSize: 11, color: T.colors.slate400, marginTop: 2 }}>Locked {fmtDate(p.locked_at)}</div>
                  ) : (
                    <Badge tone="green">Open</Badge>
                  )}
                </div>
                {locked ? (
                  <button onClick={() => handleUnlock(month, year)} title="Unlock" style={{ background: "none", border: "none", cursor: "pointer", color: "#f59e0b", padding: 8 }}>
                    <FiUnlock size={16} />
                  </button>
                ) : (
                  <button onClick={() => openLock(month, year)} title="Lock" style={{ background: "none", border: "none", cursor: "pointer", color: T.colors.slate400, padding: 8 }}>
                    <FiLock size={16} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      <Modal open={lockModalOpen} onClose={() => setLockModalOpen(false)} title={lockTarget ? `Lock ${MONTH_NAMES[lockTarget.month]} ${lockTarget.year}` : ""}>
        <form onSubmit={handleLock}>
          <p style={{ fontSize: 13, color: T.colors.slate500, marginBottom: 12 }}>
            Once locked, no journal entries dated in this month can be created, edited, or posted
            until it's unlocked again.
          </p>
          <Input label="Closing notes (optional)" value={closingNotes} onChange={(e) => setClosingNotes(e.target.value)} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 8, borderTop: `1px solid ${T.colors.border}` }}>
            <Button variant="secondary" type="button" onClick={() => setLockModalOpen(false)}>Cancel</Button>
            <Button type="submit"><FiLock size={13} /> Lock period</Button>
          </div>
        </form>
      </Modal>

      <FKeyBar items={[]} onEscape={onEscape} />
    </div>
  );
};

export default PeriodLock;
