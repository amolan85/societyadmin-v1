import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiDollarSign } from "react-icons/fi";
import { getCashBookApi, getBankBookApi, listAccountHeadsApi } from "../../services/AccountsApi";
import { T, EmptyState, Input, Select, money, fmtDate, FKeyBar } from "./AccountsUI";

const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => { const d = new Date(); d.setDate(1); return d.toISOString().slice(0, 10); };

const CashBankBook = ({ societyId, onEscape }) => {
  const [bookType, setBookType] = useState("cash");
  const [bankHeadId, setBankHeadId] = useState("");
  const [bankHeads, setBankHeads] = useState([]);
  const [dateFrom, setDateFrom] = useState(monthStart());
  const [dateTo, setDateTo] = useState(today());
  const [opening, setOpening] = useState(0);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBankHeads = useCallback(async () => {
    try {
      const res = await listAccountHeadsApi(societyId);
      const banks = (res?.heads || []).filter((h) => h.group_name === "Bank Accounts");
      setBankHeads(banks);
      if (banks.length && !bankHeadId) setBankHeadId(banks[0].id);
    } catch (e) { /* non-blocking */ }
  }, [societyId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBook = useCallback(async () => {
    if (bookType === "bank" && !bankHeadId) return;
    setLoading(true);
    try {
      const res = bookType === "cash"
        ? await getCashBookApi(societyId, dateFrom, dateTo)
        : await getBankBookApi(societyId, bankHeadId, dateFrom, dateTo);
      setOpening(res?.opening_balance || 0);
      setEntries(res?.entries || []);
    } catch (e) {
      toast.error(e?.message || "Failed to load book");
    } finally {
      setLoading(false);
    }
  }, [societyId, bookType, bankHeadId, dateFrom, dateTo]);

  useEffect(() => { fetchBankHeads(); }, [fetchBankHeads]);
  useEffect(() => { fetchBook(); }, [fetchBook]);

  const closingBalance = entries.length ? entries[entries.length - 1].running_balance : opening;

  return (
    <div style={T.page}>
      <div style={T.headerBar}>
        <h1 style={T.headerTitle}><FiDollarSign size={16} /> {bookType === "cash" ? "Cash Book" : "Bank Book"}</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <Select label="Book" style={{ width: 130 }} value={bookType} onChange={(e) => setBookType(e.target.value)}
            options={[{ value: "cash", label: "Cash Book" }, { value: "bank", label: "Bank Book" }]} placeholder="" />
          {bookType === "bank" && (
            <Select label="Bank ledger" style={{ width: 220 }} value={bankHeadId} onChange={(e) => setBankHeadId(e.target.value)}
              options={bankHeads.map((h) => ({ value: h.id, label: h.head_name }))} />
          )}
          <Input label="From" type="date" style={{ width: 150 }} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input label="To" type="date" style={{ width: 150 }} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </div>

      <div style={{ ...T.panel, margin: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", borderBottom: `1px solid ${T.colors.border}`, fontSize: 12 }}>
          <span style={{ color: T.colors.slate500 }}>Opening Balance</span>
          <span style={{ fontWeight: 600 }}>{money(opening)}</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={T.th}>Date</th><th style={T.th}>Voucher No</th><th style={T.th}>Type</th>
              <th style={T.th}>Particulars</th><th style={{ ...T.th, textAlign: "right" }}>Debit</th>
              <th style={{ ...T.th, textAlign: "right" }}>Credit</th><th style={{ ...T.th, textAlign: "right" }}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: T.colors.slate400 }}>Loading…</td></tr>
            ) : entries.length === 0 ? (
              <tr><td colSpan={7}><EmptyState message="No transactions in this period" /></td></tr>
            ) : (
              entries.map((e) => (
                <tr key={e.entry_id} style={T.row}>
                  <td style={T.td}>{fmtDate(e.journal_date)}</td>
                  <td style={{ ...T.td, fontFamily: "monospace", color: T.colors.slate500 }}>{e.journal_no}</td>
                  <td style={{ ...T.td, color: T.colors.slate400 }}>{e.journal_type}</td>
                  <td style={T.td}>{e.narration}</td>
                  <td style={T.tdRight}>{e.entry_type === "debit" ? money(e.amount) : ""}</td>
                  <td style={T.tdRight}>{e.entry_type === "credit" ? money(e.amount) : ""}</td>
                  <td style={T.tdRight}>{money(e.running_balance)}</td>
                </tr>
              ))
            )}
          </tbody>
          {entries.length > 0 && (
            <tfoot>
              <tr style={{ borderTop: `2px solid ${T.colors.border}`, fontWeight: 600 }}>
                <td colSpan={6} style={T.td}>Closing Balance</td>
                <td style={T.tdRight}>{money(closingBalance)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <FKeyBar items={[]} onEscape={onEscape} />
    </div>
  );
};

export default CashBankBook;
