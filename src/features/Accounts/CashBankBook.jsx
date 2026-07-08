import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiDollarSign } from "react-icons/fi";
import { getCashBookApi, getBankBookApi, listAccountHeadsApi } from "../../services/AccountsApi";
import { T, Badge, EmptyState, Input, Select, money, fmtDate, FKeyBar, errMsg } from "./AccountsUI";

const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => { const d = new Date(); d.setDate(1); return d.toISOString().slice(0, 10); };

// The real backend response for Cash/Bank Book uses a receipts-centric
// schema, not the journal_no/journal_date/entry_type/amount shape this
// screen originally assumed:
//   { closing_balance, opening_balance?, entries: [{
//       entry_id, txn_date, txn_type, ref_no, mode, block, flat_number,
//       narration, remarks, transaction_ref, credit_amount, debit_amount,
//       running_balance
//   }] }
// "Book" (Cash / Bank) filters the mixed-mode entries client-side, since
// the underlying entries array isn't pre-split by mode.

const modeTone = (mode) => {
  switch ((mode || "").toLowerCase()) {
    case "cash": return "green";
    case "bank": return "blue";
    case "upi": return "indigo";
    default: return "slate";
  }
};

const CashBankBook = ({ societyId, onEscape }) => {
  const [bookType, setBookType] = useState("cash"); // "cash" | "bank"
  const [bankHeadId, setBankHeadId] = useState("");
  const [bankHeads, setBankHeads] = useState([]);
  const [dateFrom, setDateFrom] = useState(monthStart());
  const [dateTo, setDateTo] = useState(today());
  const [opening, setOpening] = useState(0);
  const [closing, setClosing] = useState(0);
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

      // Trust the response as-is — running_balance is a cumulative total
      // across whatever mix of modes the endpoint returns, computed
      // server-side. Filtering rows by mode client-side would make that
      // running balance discontinuous/wrong for the remaining rows, so
      // this screen shows exactly what each endpoint sends, with a Mode
      // badge per row for context rather than a client-side split.
      setEntries(res?.entries || []);
      setClosing(res?.closing_balance != null ? Number(res.closing_balance) : 0);

      if (res?.opening_balance != null) {
        setOpening(Number(res.opening_balance));
      } else {
        // Fallback if the API doesn't send opening_balance directly —
        // valid here since it's derived from the SAME full entry set the
        // closing_balance itself is based on (no client-side filtering).
        const netMovement = (res?.entries || []).reduce(
          (s, e) => s + (Number(e.credit_amount) || 0) - (Number(e.debit_amount) || 0), 0
        );
        setOpening((res?.closing_balance != null ? Number(res.closing_balance) : 0) - netMovement);
      }
    } catch (e) {
      toast.error(errMsg(e, "Failed to load book"));
    } finally {
      setLoading(false);
    }
  }, [societyId, bookType, bankHeadId, dateFrom, dateTo]);

  useEffect(() => { fetchBankHeads(); }, [fetchBankHeads]);
  useEffect(() => { fetchBook(); }, [fetchBook]);

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
              <th style={T.th}>Date</th><th style={T.th}>Voucher No</th><th style={T.th}>Mode</th>
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
                  <td style={T.td}>{fmtDate(e.txn_date)}</td>
                  <td style={{ ...T.td, fontFamily: "monospace", color: T.colors.slate500 }}>{e.ref_no || "—"}</td>
                  <td style={T.td}><Badge tone={modeTone(e.mode)}>{e.mode || e.txn_type}</Badge></td>
                  <td style={T.td}>
                    <div>{e.block && e.flat_number ? `${e.block}/${e.flat_number}` : e.narration}</div>
                    {e.remarks && <div style={{ fontSize: 11, color: T.colors.slate400 }}>{e.remarks}</div>}
                  </td>
                  <td style={T.tdRight}>{Number(e.debit_amount) ? money(e.debit_amount) : ""}</td>
                  <td style={T.tdRight}>{Number(e.credit_amount) ? money(e.credit_amount) : ""}</td>
                  <td style={T.tdRight}>{money(e.running_balance)}</td>
                </tr>
              ))
            )}
          </tbody>
          {entries.length > 0 && (
            <tfoot>
              <tr style={{ borderTop: `2px solid ${T.colors.border}`, fontWeight: 600 }}>
                <td colSpan={6} style={T.td}>Closing Balance</td>
                <td style={T.tdRight}>{money(closing)}</td>
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