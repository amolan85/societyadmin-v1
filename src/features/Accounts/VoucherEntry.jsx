import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiFileText } from "react-icons/fi";
import { useLoader } from "../../context/LoaderContext";
import {
  createJournalApi, addJournalLineApi, postJournalApi, listAccountHeadsApi,
  listJournalsApi, getJournalApi, reverseJournalApi,
} from "../../services/AccountsApi";
import { T, Badge, Modal, EmptyState, Button, Input, Select, money, fmtDate, statusTone, FKeyBar } from "./AccountsUI";

const VOUCHER_TYPES = [
  { key: "contra",  fkey: "F4", label: "Contra" },
  { key: "payment", fkey: "F5", label: "Payment" },
  { key: "receipt", fkey: "F6", label: "Receipt" },
  { key: "journal", fkey: "F7", label: "Journal" },
];

const today = () => new Date().toISOString().slice(0, 10);

const VoucherEntry = ({ societyId, onEscape }) => {
  const { showLoader, hideLoader } = useLoader();
  const [mode, setMode] = useState("list");
  const [voucherType, setVoucherType] = useState("payment");

  const [heads, setHeads] = useState([]);
  const [date, setDate] = useState(today());
  const [narration, setNarration] = useState("");
  const [accountHeadId, setAccountHeadId] = useState("");
  const [particulars, setParticulars] = useState([{ head_id: "", amount: "", narration: "" }]);
  const [journalLines, setJournalLines] = useState([{ head_id: "", entry_type: "debit", amount: "", narration: "" }]);

  const [journals, setJournals] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [filters, setFilters] = useState({ status: "", journal_type: "" });
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeJournal, setActiveJournal] = useState(null);

  const fetchHeads = useCallback(async () => {
    try {
      const res = await listAccountHeadsApi(societyId);
      setHeads(res?.heads || []);
    } catch (e) { /* non-blocking */ }
  }, [societyId]);

  const fetchJournals = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await listJournalsApi(societyId, filters, 1, 20);
      setJournals(res?.journals || []);
    } catch (e) {
      toast.error(e?.message || "Failed to load vouchers");
    } finally {
      setLoadingList(false);
    }
  }, [societyId, filters]);

  useEffect(() => { fetchHeads(); }, [fetchHeads]);
  useEffect(() => { if (mode === "list") fetchJournals(); }, [mode, fetchJournals]);

  const cashBankHeads = heads.filter((h) => h.group_name === "Cash-in-hand" || h.group_name === "Bank Accounts");
  const isCashBankVoucher = voucherType !== "journal";

  const resetEntry = () => {
    setDate(today()); setNarration(""); setAccountHeadId("");
    setParticulars([{ head_id: "", amount: "", narration: "" }]);
    setJournalLines([{ head_id: "", entry_type: "debit", amount: "", narration: "" }]);
  };

  const openEntry = (type) => { setVoucherType(type); resetEntry(); setMode("entry"); };

  const addParticularRow = () => setParticulars([...particulars, { head_id: "", amount: "", narration: "" }]);
  const updateParticular = (idx, field, value) => { const next = [...particulars]; next[idx][field] = value; setParticulars(next); };
  const removeParticular = (idx) => setParticulars(particulars.filter((_, i) => i !== idx));

  const addJournalRow = () => setJournalLines([...journalLines, { head_id: "", entry_type: "debit", amount: "", narration: "" }]);
  const updateJournalLine = (idx, field, value) => { const next = [...journalLines]; next[idx][field] = value; setJournalLines(next); };
  const removeJournalRow = (idx) => setJournalLines(journalLines.filter((_, i) => i !== idx));

  const particularTotal = particulars.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const journalDebitTotal = journalLines.filter(l => l.entry_type === "debit").reduce((s, l) => s + (Number(l.amount) || 0), 0);
  const journalCreditTotal = journalLines.filter(l => l.entry_type === "credit").reduce((s, l) => s + (Number(l.amount) || 0), 0);

  const handleSaveVoucher = async () => {
    if (isCashBankVoucher) {
      if (!accountHeadId) { toast.error("Select the Cash/Bank account"); return; }
      if (particulars.some((p) => !p.head_id || !p.amount)) { toast.error("Fill every particulars row"); return; }
    } else {
      if (journalLines.some((l) => !l.head_id || !l.amount)) { toast.error("Fill every line"); return; }
      if (journalDebitTotal !== journalCreditTotal || journalDebitTotal === 0) {
        toast.error("Debit and credit totals must match and be greater than zero"); return;
      }
    }
    showLoader?.();
    try {
      const journal = await createJournalApi(societyId, { journal_date: date, journal_type: voucherType, narration });
      if (isCashBankVoucher) {
        const accountSide = voucherType === "receipt" ? "debit" : "credit";
        const otherSide = accountSide === "debit" ? "credit" : "debit";
        await addJournalLineApi(societyId, { journal_id: journal.id, head_id: accountHeadId, entry_type: accountSide, amount: particularTotal, narration });
        for (const p of particulars) {
          await addJournalLineApi(societyId, { journal_id: journal.id, head_id: p.head_id, entry_type: otherSide, amount: Number(p.amount), narration: p.narration });
        }
      } else {
        for (const l of journalLines) {
          await addJournalLineApi(societyId, { journal_id: journal.id, head_id: l.head_id, entry_type: l.entry_type, amount: Number(l.amount), narration: l.narration });
        }
      }
      await postJournalApi(societyId, journal.id);
      toast.success(`${voucherType.charAt(0).toUpperCase() + voucherType.slice(1)} voucher ${journal.journal_no} saved`);
      resetEntry(); setMode("list");
    } catch (e) {
      toast.error(e?.message || "Failed to save voucher");
    } finally {
      hideLoader?.();
    }
  };

  const openDetail = async (journalId) => {
    try {
      const res = await getJournalApi(societyId, journalId);
      setActiveJournal(res); setDetailOpen(true);
    } catch (e) { toast.error(e?.message || "Failed to load voucher"); }
  };

  const handleReverse = async () => {
    const reason = window.prompt("Reason for reversal:");
    if (reason === null) return;
    try {
      const reversal = await reverseJournalApi(societyId, activeJournal.id, null, reason);
      toast.success(`Reversal voucher ${reversal.journal_no} posted`);
      setDetailOpen(false); fetchJournals();
    } catch (e) { toast.error(e?.message || "Failed to reverse voucher"); }
  };

  const rowStyle = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8, marginBottom: 8, alignItems: "end" };

  if (mode === "list") {
    return (
      <div style={T.page}>
        <div style={T.headerBar}>
          <h1 style={T.headerTitle}><FiFileText size={16} /> Accounting Vouchers</h1>
          <div style={{ display: "flex", gap: 12 }}>
            <select value={filters.journal_type} onChange={(e) => setFilters({ ...filters, journal_type: e.target.value })} style={{ ...T.select, width: 160 }}>
              <option value="">All Types</option>
              {VOUCHER_TYPES.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}
            </select>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} style={{ ...T.select, width: 140 }}>
              <option value="">All Status</option>
              <option value="posted">Posted</option>
              <option value="reversed">Reversed</option>
            </select>
          </div>
        </div>

        <div style={{ ...T.panel, margin: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={T.th}>Voucher No</th><th style={T.th}>Date</th><th style={T.th}>Type</th>
                <th style={T.th}>Particulars</th><th style={{ ...T.th, textAlign: "right" }}>Amount</th><th style={T.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loadingList ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: T.colors.slate400 }}>Loading…</td></tr>
              ) : journals.length === 0 ? (
                <tr><td colSpan={6}><EmptyState message="No vouchers yet — press F4/F5/F6/F7 to create one" /></td></tr>
              ) : (
                journals.map((j) => (
                  <tr key={j.id} data-rownav style={{ ...T.row, cursor: "pointer" }} onClick={() => openDetail(j.id)}>
                    <td style={{ ...T.td, fontFamily: "monospace", color: T.colors.slate500 }}>{j.journal_no}</td>
                    <td style={T.td}>{fmtDate(j.journal_date)}</td>
                    <td style={T.td}><Badge tone="blue">{j.journal_type}</Badge></td>
                    <td style={{ ...T.td, maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{j.narration}</td>
                    <td style={T.tdRight}>{money(j.total_debit)}</td>
                    <td style={T.td}><Badge tone={statusTone(j.status)}>{j.status}</Badge></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title={activeJournal ? `Voucher ${activeJournal.journal_no}` : ""} width={560}>
          {activeJournal && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 12, color: T.colors.slate500 }}>
                <span>{fmtDate(activeJournal.journal_date)} · {activeJournal.journal_type}</span>
                <Badge tone={statusTone(activeJournal.status)}>{activeJournal.status}</Badge>
              </div>
              <table style={{ width: "100%", fontSize: 12, marginBottom: 12 }}>
                <thead><tr><th style={T.th}>Ledger</th><th style={{ ...T.th, textAlign: "right" }}>Debit</th><th style={{ ...T.th, textAlign: "right" }}>Credit</th></tr></thead>
                <tbody>
                  {(activeJournal.lines || []).map((l) => (
                    <tr key={l.id}>
                      <td style={T.td}>{l.head_name}</td>
                      <td style={T.tdRight}>{l.entry_type === "debit" ? money(l.amount) : ""}</td>
                      <td style={T.tdRight}>{l.entry_type === "credit" ? money(l.amount) : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {activeJournal.status === "posted" && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}><Button variant="danger" onClick={handleReverse}>Reverse Voucher</Button></div>
              )}
            </div>
          )}
        </Modal>

        <FKeyBar items={VOUCHER_TYPES.map(v => ({ key: v.fkey, label: v.label, onPress: () => openEntry(v.key) }))} onEscape={onEscape} />
      </div>
    );
  }

  return (
    <div style={T.page}>
      <div style={T.headerBar}>
        <h1 style={T.headerTitle}>
          <FiFileText size={16} />
          {voucherType.charAt(0).toUpperCase() + voucherType.slice(1)} Voucher
        </h1>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: 150 }} />
      </div>

      <div style={{ ...T.panel, margin: 16, padding: 16 }}>
        {isCashBankVoucher ? (
          <>
            <Select label={voucherType === "receipt" ? "Account (Dr) — Cash/Bank" : "Account (Cr) — Cash/Bank"}
              value={accountHeadId} onChange={(e) => setAccountHeadId(e.target.value)}
              options={cashBankHeads.map((h) => ({ value: h.id, label: `${h.head_code} — ${h.head_name}` }))} />

            <div style={T.label}>Particulars</div>
            {particulars.map((p, idx) => (
              <div key={idx} style={rowStyle}>
                <select style={T.select} value={p.head_id} onChange={(e) => updateParticular(idx, "head_id", e.target.value)}>
                  <option value="">Select ledger…</option>
                  {heads.map((h) => <option key={h.id} value={h.id}>{h.head_code} — {h.head_name}</option>)}
                </select>
                <input type="number" step="0.01" style={T.input} placeholder="Amount" value={p.amount} onChange={(e) => updateParticular(idx, "amount", e.target.value)} />
                <input style={T.input} placeholder="Narration" value={p.narration} onChange={(e) => updateParticular(idx, "narration", e.target.value)} />
                {particulars.length > 1 && (
                  <button onClick={() => removeParticular(idx)} style={{ background: "none", border: "none", color: T.colors.red600, cursor: "pointer" }}>✕</button>
                )}
              </div>
            ))}
            <button onClick={addParticularRow} style={{ background: "none", border: "none", color: T.colors.blue600, fontSize: 12, cursor: "pointer", marginBottom: 12 }}>+ Add row</button>

            <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${T.colors.border}`, paddingTop: 8, fontSize: 14 }}>
              <span style={{ color: T.colors.slate500 }}>Total</span>
              <span style={{ fontWeight: 600 }}>{money(particularTotal)}</span>
            </div>
          </>
        ) : (
          <>
            <div style={T.label}>Journal Entries</div>
            {journalLines.map((l, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 8, marginBottom: 8, alignItems: "end" }}>
                <select style={T.select} value={l.head_id} onChange={(e) => updateJournalLine(idx, "head_id", e.target.value)}>
                  <option value="">Select ledger…</option>
                  {heads.map((h) => <option key={h.id} value={h.id}>{h.head_code} — {h.head_name}</option>)}
                </select>
                <select style={T.select} value={l.entry_type} onChange={(e) => updateJournalLine(idx, "entry_type", e.target.value)}>
                  <option value="debit">Dr</option><option value="credit">Cr</option>
                </select>
                <input type="number" step="0.01" style={T.input} placeholder="Amount" value={l.amount} onChange={(e) => updateJournalLine(idx, "amount", e.target.value)} />
                <input style={T.input} placeholder="Narration" value={l.narration} onChange={(e) => updateJournalLine(idx, "narration", e.target.value)} />
                {journalLines.length > 1 && (
                  <button onClick={() => removeJournalRow(idx)} style={{ background: "none", border: "none", color: T.colors.red600, cursor: "pointer" }}>✕</button>
                )}
              </div>
            ))}
            <button onClick={addJournalRow} style={{ background: "none", border: "none", color: T.colors.blue600, fontSize: 12, cursor: "pointer", marginBottom: 12 }}>+ Add row</button>

            <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${T.colors.border}`, paddingTop: 8, fontSize: 14 }}>
              <span style={{ color: T.colors.slate500 }}>Dr {money(journalDebitTotal)}</span>
              <span style={{ color: journalDebitTotal === journalCreditTotal ? T.colors.green700 : T.colors.red600 }}>Cr {money(journalCreditTotal)}</span>
            </div>
          </>
        )}

        <div style={{ marginTop: 12 }}>
          <Input label="Narration" value={narration} onChange={(e) => setNarration(e.target.value)} />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.colors.border}` }}>
          <Button variant="secondary" onClick={() => setMode("list")}>Cancel (Esc)</Button>
          <Button onClick={handleSaveVoucher}>Save (Ctrl+A)</Button>
        </div>
      </div>

      <FKeyBar items={VOUCHER_TYPES.map(v => ({ key: v.fkey, label: v.label, onPress: () => openEntry(v.key) }))} onEscape={() => setMode("list")} />
    </div>
  );
};

export default VoucherEntry;
