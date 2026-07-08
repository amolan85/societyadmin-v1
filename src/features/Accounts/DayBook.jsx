import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiCalendar } from "react-icons/fi";
import { getDayBookApi } from "../../services/AccountsApi";
import { T, Badge, EmptyState, Input, Select, money, fmtDate, FKeyBar } from "./AccountsUI";

const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => { const d = new Date(); d.setDate(1); return d.toISOString().slice(0, 10); };

const DayBook = ({ societyId, onEscape }) => {
  const [dateFrom, setDateFrom] = useState(monthStart());
  const [dateTo, setDateTo] = useState(today());
  const [voucherType, setVoucherType] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [summary, setSummary] = useState({ voucher_count: 0, total_value: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDayBook = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDayBookApi(societyId, dateFrom, dateTo, voucherType);
      setVouchers(res?.vouchers || []);
      setSummary(res?.summary || { voucher_count: 0, total_value: 0 });
    } catch (e) {
      toast.error(e?.message || "Failed to load Day Book");
    } finally {
      setLoading(false);
    }
  }, [societyId, dateFrom, dateTo, voucherType]);

  useEffect(() => { fetchDayBook(); }, [fetchDayBook]);

  return (
    <div style={T.page}>
      <div style={T.headerBar}>
        <h1 style={T.headerTitle}><FiCalendar size={16} /> Day Book</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <Input label="From" type="date" style={{ width: 150 }} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input label="To" type="date" style={{ width: 150 }} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          <Select label="Type" style={{ width: 150 }} value={voucherType} onChange={(e) => setVoucherType(e.target.value)}
            options={[
              { value: "contra", label: "Contra" }, { value: "payment", label: "Payment" },
              { value: "receipt", label: "Receipt" }, { value: "journal", label: "Journal" },
              { value: "bill", label: "Bill" }, { value: "system", label: "System" },
            ]} placeholder="All Types" />
        </div>
      </div>

      <div style={{ ...T.panel, margin: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={T.th}>Date</th><th style={T.th}>Voucher No</th><th style={T.th}>Type</th>
              <th style={T.th}>Particulars</th><th style={{ ...T.th, textAlign: "right" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: T.colors.slate400 }}>Loading…</td></tr>
            ) : vouchers.length === 0 ? (
              <tr><td colSpan={5}><EmptyState message="No vouchers in this period" /></td></tr>
            ) : (
              vouchers.map((v) => (
                <tr key={v.journal_id} style={T.row}>
                  <td style={T.td}>{fmtDate(v.journal_date)}</td>
                  <td style={{ ...T.td, fontFamily: "monospace", color: T.colors.slate500 }}>{v.journal_no}</td>
                  <td style={T.td}><Badge tone="blue">{v.voucher_type}</Badge></td>
                  <td style={{ ...T.td, maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.particulars || v.narration}</td>
                  <td style={T.tdRight}>{money(v.amount)}</td>
                </tr>
              ))
            )}
          </tbody>
          {vouchers.length > 0 && (
            <tfoot>
              <tr style={{ borderTop: `2px solid ${T.colors.border}`, fontWeight: 600 }}>
                <td colSpan={3} style={T.td}>{summary.voucher_count} vouchers</td>
                <td style={T.td}></td>
                <td style={T.tdRight}>{money(summary.total_value)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <FKeyBar items={[]} onEscape={onEscape} />
    </div>
  );
};

export default DayBook;
