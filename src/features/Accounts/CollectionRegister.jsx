import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiDollarSign } from "react-icons/fi";
import { getCollectionRegisterApi, getBillAuditTrailApi, retryBillJournalApi, backfillHistoricalBillingJournalsApi, waiveOffApi } from "../../services/AccountsApi";
import { T, Badge, Modal, EmptyState, Input, Select, Button, money, fmtDate, FKeyBar, errMsg } from "./AccountsUI";

const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => { const d = new Date(); d.setDate(1); return d.toISOString().slice(0, 10); };

const StatTile = ({ label, value, sub, warn }) => (
  <div style={{ ...T.panel, padding: 12, borderColor: warn ? "#fbbf24" : T.colors.border }}>
    <div style={{ color: T.colors.slate500, fontSize: 11, textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 600, color: warn ? "#b45309" : T.colors.slate800 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: T.colors.slate400 }}>{sub}</div>}
  </div>
);

const CollectionRegister = ({ societyId, onEscape }) => {
  const [dateFrom, setDateFrom] = useState(monthStart());
  const [dateTo, setDateTo] = useState(today());
  const [bills, setBills] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("bills");

  const [auditOpen, setAuditOpen] = useState(false);
  const [audit, setAudit] = useState(null);

  const [waiveOpen, setWaiveOpen] = useState(false);
  const [waiveForm, setWaiveForm] = useState({ waive_type: "", waive_amount: "", reason: "", resolution_ref: "" });
  const [waiving, setWaiving] = useState(false);

  const fetchRegister = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCollectionRegisterApi(societyId, dateFrom, dateTo);
      setBills(res?.bills || []);
      setReceipts(res?.receipts || []);
      setSummary(res?.summary || {});
    } catch (e) {
      toast.error(errMsg(e, "Failed to load collection register"));
    } finally {
      setLoading(false);
    }
  }, [societyId, dateFrom, dateTo]);

  useEffect(() => { fetchRegister(); }, [fetchRegister]);

  const openWaiveOff = () => {
    setWaiveForm({ waive_type: "", waive_amount: "", reason: "", resolution_ref: "" });
    setWaiveOpen(true);
  };

  const handleWaiveOff = async (e) => {
    e.preventDefault();
    if (!waiveForm.waive_type) { toast.error("Select what's being waived"); return; }
    if (!waiveForm.reason.trim()) { toast.error("A reason is required — this becomes part of the permanent audit trail"); return; }
    if (waiveForm.waive_type === "partial" && !waiveForm.waive_amount) { toast.error("Enter the amount to waive"); return; }
    setWaiving(true);
    try {
      const reasonWithRef = waiveForm.resolution_ref
        ? `${waiveForm.reason} (Resolution ref: ${waiveForm.resolution_ref})`
        : waiveForm.reason;
      await waiveOffApi(societyId, audit.bill.id, waiveForm.waive_type, waiveForm.waive_amount, reasonWithRef);
      toast.success("Dues waived off successfully");
      setWaiveOpen(false);
      const refreshed = await getBillAuditTrailApi(societyId, audit.bill.id);
      setAudit(refreshed);
      fetchRegister();
    } catch (e2) {
      toast.error(errMsg(e2, "Failed to waive off dues"));
    } finally {
      setWaiving(false);
    }
  };

  const openAudit = async (billId) => {
    try {
      const res = await getBillAuditTrailApi(societyId, billId);
      setAudit(res); setAuditOpen(true);
    } catch (e) { toast.error(errMsg(e, "Failed to load audit trail")); }
  };

  const handleRetry = async (billId) => {
    try {
      await retryBillJournalApi(societyId, billId);
      toast.success("Bill journal posted");
      fetchRegister();
      if (audit?.bill?.id === billId) openAudit(billId);
    } catch (e) {
      toast.error(errMsg(e, "Failed to post journal — check charge head mapping"));
    }
  };

  const handleBackfill = async () => {
    if (!window.confirm("Journal every existing bill and receipt that predates the Accounts integration? This may take a moment for a large history.")) return;
    try {
      const res = await backfillHistoricalBillingJournalsApi(societyId);
      const s = res?.summary || {};
      toast.success(`Backfilled ${s.bills_journaled || 0} bills, ${s.receipts_journaled || 0} receipts`);
      if ((s.bills_failed || 0) + (s.receipts_failed || 0) > 0) {
        toast.error(`${(s.bills_failed || 0) + (s.receipts_failed || 0)} rows skipped — check unmapped charge heads or locked periods`);
      }
      fetchRegister();
    } catch (e) {
      toast.error(errMsg(e, "Backfill failed"));
    }
  };

  const tabBtn = (key, label) => (
    <button onClick={() => setView(key)} style={{
      padding: "6px 14px", fontSize: 12, textTransform: "uppercase", border: "none", cursor: "pointer",
      backgroundColor: view === key ? T.colors.blue600 : "transparent",
      color: view === key ? T.colors.white : T.colors.slate500,
      fontWeight: view === key ? 600 : 400, borderRadius: 6,
    }}>{label}</button>
  );

  return (
    <div style={T.page}>
      <div style={T.headerBar}>
        <h1 style={T.headerTitle}><FiDollarSign size={16} /> Collection Register</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <Input label="From" type="date" style={{ width: 150 }} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input label="To" type="date" style={{ width: 150 }} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          <Button variant="secondary" onClick={handleBackfill}>Backfill Historical Data</Button>
        </div>
      </div>

      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, margin: 16 }}>
          <StatTile label="Bills Raised" value={summary.bills_raised || 0} sub={money(summary.total_billed)} />
          <StatTile label="Collected" value={summary.receipts_collected || 0} sub={money(summary.total_collected)} />
          <StatTile label="Bills Not Journaled" value={summary.bills_not_journaled || 0} warn={summary.bills_not_journaled > 0} />
          <StatTile label="Receipts Not Journaled" value={summary.receipts_not_journaled || 0} warn={summary.receipts_not_journaled > 0} />
        </div>
      )}

      <div style={{ display: "flex", gap: 4, margin: "0 16px 8px" }}>
        {tabBtn("bills", "Bills")}
        {tabBtn("receipts", "Receipts")}
      </div>

      <div style={{ ...T.panel, margin: "0 16px 16px" }}>
        {view === "bills" ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={T.th}>Bill No</th><th style={T.th}>Date</th><th style={T.th}>Flat</th>
                <th style={{ ...T.th, textAlign: "right" }}>Amount</th><th style={T.th}>Status</th><th style={T.th}>Journal</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: T.colors.slate400 }}>Loading…</td></tr>
              ) : bills.length === 0 ? (
                <tr><td colSpan={6}><EmptyState message="No bills in this period" /></td></tr>
              ) : (
                bills.map((b) => (
                  <tr key={b.bill_id} style={{ ...T.row, cursor: "pointer" }} onClick={() => openAudit(b.bill_id)}>
                    <td style={{ ...T.td, fontFamily: "monospace", color: T.colors.slate500 }}>{b.bill_no}</td>
                    <td style={T.td}>{fmtDate(b.bill_date)}</td>
                    <td style={T.td}>{b.block} / {b.flat_number}</td>
                    <td style={T.tdRight}>{money(b.total_amount)}</td>
                    <td style={T.td}><Badge tone={b.bill_status === "paid" ? "green" : "amber"}>{b.bill_status}</Badge></td>
                    <td style={T.td}>{b.is_journaled ? <Badge tone="green">Posted</Badge> : <Badge tone="red">Not posted</Badge>}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={T.th}>Receipt No</th><th style={T.th}>Date</th><th style={T.th}>Flat</th>
                <th style={T.th}>Mode</th><th style={{ ...T.th, textAlign: "right" }}>Amount</th><th style={T.th}>Journal</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: T.colors.slate400 }}>Loading…</td></tr>
              ) : receipts.length === 0 ? (
                <tr><td colSpan={6}><EmptyState message="No receipts in this period" /></td></tr>
              ) : (
                receipts.map((r) => (
                  <tr key={r.receipt_id} style={T.row}>
                    <td style={{ ...T.td, fontFamily: "monospace", color: T.colors.slate500 }}>{r.receipt_no}</td>
                    <td style={T.td}>{fmtDate(r.receipt_date)}</td>
                    <td style={T.td}>{r.block} / {r.flat_number}</td>
                    <td style={{ ...T.td, textTransform: "uppercase", color: T.colors.slate400 }}>{r.payment_mode}</td>
                    <td style={T.tdRight}>{money(r.total_amount)}</td>
                    <td style={T.td}>{r.is_journaled ? <Badge tone="green">Posted</Badge> : <Badge tone="red">Not posted</Badge>}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={auditOpen} onClose={() => setAuditOpen(false)} title={audit ? `Audit Trail — Bill ${audit.bill?.bill_no}` : ""} width={640}>
        {audit && (
          <div style={{ fontSize: 12 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ color: T.colors.blue600, textTransform: "uppercase", fontSize: 11, fontWeight: 600 }}>Bill</div>
                {audit.bill.status !== "paid" && (
                  <button onClick={openWaiveOff} style={{ background: "none", border: "none", color: "#b45309", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                    Waive Off Dues
                  </button>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${T.colors.borderLight}`, padding: "4px 0" }}>
                <span>{audit.bill.block} / {audit.bill.flat_number} — {fmtDate(audit.bill.bill_date)}</span>
                <span>{money(audit.bill.total_amount)}</span>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ color: T.colors.blue600, textTransform: "uppercase", marginBottom: 4, fontSize: 11, fontWeight: 600 }}>Bill Journal</div>
              {audit.bill_journal ? (
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${T.colors.borderLight}`, padding: "4px 0" }}>
                  <span>{audit.bill_journal.journal_no} · {audit.bill_journal.line_count} lines</span>
                  <Badge tone="green">{audit.bill_journal.status}</Badge>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.colors.borderLight}`, padding: "4px 0" }}>
                  <span style={{ color: T.colors.red600 }}>Not journaled — bill isn't reflected in Accounts yet</span>
                  <button onClick={() => handleRetry(audit.bill.id)} style={{ background: "none", border: "none", color: T.colors.blue600, cursor: "pointer", fontSize: 12 }}>Retry</button>
                </div>
              )}
            </div>

            {audit.receipts?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: T.colors.blue600, textTransform: "uppercase", marginBottom: 4, fontSize: 11, fontWeight: 600 }}>Receipts Applied</div>
                {audit.receipts.map((r) => (
                  <div key={r.receipt_id} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${T.colors.borderLight}`, padding: "4px 0" }}>
                    <span>{r.receipt_no} · {fmtDate(r.receipt_date)}</span>
                    <span>{money(r.total_applied)} {r.journal_id ? <Badge tone="green">Posted</Badge> : <Badge tone="red">Not posted</Badge>}</span>
                  </div>
                ))}
              </div>
            )}

            {audit.penalties?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: T.colors.blue600, textTransform: "uppercase", marginBottom: 4, fontSize: 11, fontWeight: 600 }}>Penalties</div>
                {audit.penalties.map((p) => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${T.colors.borderLight}`, padding: "4px 0" }}>
                    <span>{fmtDate(p.applied_on)}</span>
                    <span>{money(p.penalty_amount)} {p.is_journaled ? <Badge tone="green">Posted</Badge> : <Badge tone="red">Not posted</Badge>}</span>
                  </div>
                ))}
              </div>
            )}

            {audit.interest?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: T.colors.blue600, textTransform: "uppercase", marginBottom: 4, fontSize: 11, fontWeight: 600 }}>Interest</div>
                {audit.interest.map((i) => (
                  <div key={i.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${T.colors.borderLight}`, padding: "4px 0" }}>
                    <span>{fmtDate(i.applied_on)}</span>
                    <span>{money(i.interest_amount)} {i.is_journaled ? <Badge tone="green">Posted</Badge> : <Badge tone="red">Not posted</Badge>}</span>
                  </div>
                ))}
              </div>
            )}

            {audit.waiveoffs?.length > 0 && (
              <div>
                <div style={{ color: T.colors.blue600, textTransform: "uppercase", marginBottom: 4, fontSize: 11, fontWeight: 600 }}>Waiveoffs</div>
                {audit.waiveoffs.map((w) => (
                  <div key={w.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${T.colors.borderLight}`, padding: "4px 0" }}>
                    <span>{fmtDate(w.waived_on)} — {w.reason}</span>
                    <span>{money(w.total_waived)} {w.is_journaled ? <Badge tone="green">Posted</Badge> : <Badge tone="red">Not posted</Badge>}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Waive Off — guided flow, deliberately separate from any generic
          "pick an expense ledger" screen. This is an Accounts/Audit action
          (dues written off by committee resolution), not a routine expense
          like Electricity or Water — the ledger it posts to is excluded
          from Budget's expense picker for the same reason. */}
      <Modal open={waiveOpen} onClose={() => setWaiveOpen(false)} title={`Waive Off Dues — Bill ${audit?.bill?.bill_no || ""}`} width={480}>
        <form onSubmit={handleWaiveOff}>
          <div style={{ backgroundColor: T.colors.bg, borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 12 }}>
            <div style={{ color: T.colors.slate500 }}>Flat</div>
            <div style={{ fontWeight: 600, color: T.colors.slate800 }}>{audit?.bill?.block} / {audit?.bill?.flat_number}</div>
          </div>
          <Select label="What's being waived" value={waiveForm.waive_type}
            onChange={(e) => setWaiveForm({ ...waiveForm, waive_type: e.target.value })}
            options={[
              { value: "interest", label: "Interest only" },
              { value: "penalty", label: "Penalty only" },
              { value: "both", label: "Both interest and penalty" },
              { value: "partial", label: "Partial amount (specify below)" },
            ]} required />
          {waiveForm.waive_type === "partial" && (
            <Input label="Amount to waive" type="number" step="0.01" value={waiveForm.waive_amount}
              onChange={(e) => setWaiveForm({ ...waiveForm, waive_amount: e.target.value })} required />
          )}
          <label style={{ display: "block", marginBottom: 12 }}>
            <span style={T.label}>Reason (required — becomes part of the permanent audit trail)</span>
            <textarea
              value={waiveForm.reason}
              onChange={(e) => setWaiveForm({ ...waiveForm, reason: e.target.value })}
              rows={3}
              style={{ ...T.input, resize: "vertical", fontFamily: "inherit" }}
              placeholder="e.g. Committee resolution dated 12-Jun-2026 — dues unrecoverable after 8 years"
              required
            />
          </label>
          <Input label="Committee resolution reference (optional)" value={waiveForm.resolution_ref}
            onChange={(e) => setWaiveForm({ ...waiveForm, resolution_ref: e.target.value })}
            placeholder="e.g. AGM Resolution No. 12/2026, or a link to the uploaded document" />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 8, borderTop: `1px solid ${T.colors.border}` }}>
            <Button variant="secondary" type="button" onClick={() => setWaiveOpen(false)}>Cancel</Button>
            <Button type="submit" variant="danger" disabled={waiving}>{waiving ? "Waiving…" : "Confirm Waive Off"}</Button>
          </div>
        </form>
      </Modal>

      <FKeyBar items={[]} onEscape={onEscape} />
    </div>
  );
};

export default CollectionRegister;
