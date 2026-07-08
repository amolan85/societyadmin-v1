import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiCalendar } from "react-icons/fi";
import { getDayBookApi } from "../../services/AccountsApi";
import { T, Badge, EmptyState, Input, money, fmtDate, FKeyBar, errMsg } from "./AccountsUI";

const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => { const d = new Date(); d.setDate(1); return d.toISOString().slice(0, 10); };

const modeTone = (mode) => {
  switch ((mode || "").toLowerCase()) {
    case "cash": return "green";
    case "bank": return "blue";
    case "upi": return "indigo";
    default: return "slate";
  }
};

// Real response shape:
//   { from_date, to_date,
//     mode_summary: [{ mode, total_amount, txn_count }],
//     summary: { total_value, voucher_count },
//     vouchers: [{ date, day_total, entries: [{
//         entry_id, txn_date, txn_type, ref_no, mode, block, flat_number,
//         narration, remarks, transaction_ref, credit_amount, debit_amount,
//         running_balance
//     }] }] }
const DayBook = ({ societyId, onEscape }) => {
  const [dateFrom, setDateFrom] = useState(monthStart());
  const [dateTo, setDateTo] = useState(today());
  const [modeSummary, setModeSummary] = useState([]);
  const [summary, setSummary] = useState({ total_value: 0, voucher_count: 0 });
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDayBook = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDayBookApi(societyId, dateFrom, dateTo);
      setModeSummary(res?.mode_summary || []);
      setSummary(res?.summary || { total_value: 0, voucher_count: 0 });
      setDays(res?.vouchers || []);
    } catch (e) {
      toast.error(errMsg(e, "Failed to load Day Book"));
    } finally {
      setLoading(false);
    }
  }, [societyId, dateFrom, dateTo]);

  useEffect(() => { fetchDayBook(); }, [fetchDayBook]);

  return (
    <div style={T.page}>
      <div style={T.headerBar}>
        <h1 style={T.headerTitle}><FiCalendar size={16} /> Day Book</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <Input label="From" type="date" style={{ width: 150 }} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input label="To" type="date" style={{ width: 150 }} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </div>

      <div style={{ padding: 16, paddingBottom: 64 }}>
        {!loading && modeSummary.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${modeSummary.length}, 1fr)`, gap: 12, marginBottom: 16 }}>
            {modeSummary.map((m) => (
              <div key={m.mode} style={{ ...T.panel, padding: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Badge tone={modeTone(m.mode)}>{m.mode}</Badge>
                  <span style={{ fontSize: 11, color: T.colors.slate400 }}>{m.txn_count} txn</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: T.colors.slate800 }}>{money(m.total_amount)}</div>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: 32, color: T.colors.slate400 }}>Loading…</div>
        ) : days.length === 0 ? (
          <EmptyState message="No vouchers in this period" />
        ) : (
          days.map((day) => (
            <div key={day.date} style={{ ...T.panel, marginBottom: 12 }}>
              <div style={{ ...T.panelHeader, display: "flex", justifyContent: "space-between" }}>
                <span>{fmtDate(day.date)}</span>
                <span>{money(day.day_total)}</span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={T.th}>Voucher No</th><th style={T.th}>Mode</th><th style={T.th}>Particulars</th>
                    <th style={{ ...T.th, textAlign: "right" }}>Debit</th><th style={{ ...T.th, textAlign: "right" }}>Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {(day.entries || []).map((e) => (
                    <tr key={e.entry_id} style={T.row}>
                      <td style={{ ...T.td, fontFamily: "monospace", color: T.colors.slate500 }}>{e.ref_no || "—"}</td>
                      <td style={T.td}><Badge tone={modeTone(e.mode)}>{e.mode || e.txn_type}</Badge></td>
                      <td style={T.td}>
                        <div>{e.block && e.flat_number ? `${e.block}/${e.flat_number}` : e.narration}</div>
                        {e.remarks && <div style={{ fontSize: 11, color: T.colors.slate400 }}>{e.remarks}</div>}
                      </td>
                      <td style={T.tdRight}>{Number(e.debit_amount) ? money(e.debit_amount) : ""}</td>
                      <td style={T.tdRight}>{Number(e.credit_amount) ? money(e.credit_amount) : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}

        {!loading && days.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", fontSize: 13, fontWeight: 600, color: T.colors.slate700 }}>
            <span>{summary.voucher_count} vouchers</span>
            <span>{money(summary.total_value)}</span>
          </div>
        )}
      </div>

      <FKeyBar items={[]} onEscape={onEscape} />
    </div>
  );
};

export default DayBook;