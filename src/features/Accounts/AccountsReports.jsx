import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiDownload } from "react-icons/fi";
import { getTrialBalanceApi, getBalanceSheetApi, getIncomeExpenditureStatementApi } from "../../services/AccountsApi";
import { EmptyState, Button, Input, money, T, FKeyBar } from "./AccountsUI";
import { exportFile } from "../../components/Common/ExportFile";

const SUB_TABS = [
  { key: "tb", label: "Trial Balance" },
  { key: "bs", label: "Balance Sheet" },
  { key: "ie", label: "Income & Expenditure" },
];

const today = () => new Date().toISOString().slice(0, 10);
const fyStart = () => {
  const d = new Date();
  const y = d.getMonth() + 1 >= 4 ? d.getFullYear() : d.getFullYear() - 1;
  return `${y}-04-01`;
};

const AccountsReports = ({ societyId, onEscape }) => {
  const [subTab, setSubTab] = useState("tb");
  const [asOfDate, setAsOfDate] = useState(today());
  const [fromDate, setFromDate] = useState(fyStart());
  const [toDate, setToDate] = useState(today());
  const [compare, setCompare] = useState(false);
  const [tb, setTb] = useState(null);
  const [bs, setBs] = useState(null);
  const [ie, setIe] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTrialBalance = useCallback(async () => {
    setLoading(true);
    try { setTb(await getTrialBalanceApi(societyId, asOfDate)); }
    catch (e) { toast.error(e?.message || "Failed to load Trial Balance"); }
    finally { setLoading(false); }
  }, [societyId, asOfDate]);

  const runBalanceSheet = useCallback(async () => {
    setLoading(true);
    try { setBs(await getBalanceSheetApi(societyId, asOfDate, compare)); }
    catch (e) { toast.error(e?.message || "Failed to load Balance Sheet"); }
    finally { setLoading(false); }
  }, [societyId, asOfDate, compare]);

  const runIE = useCallback(async () => {
    setLoading(true);
    try { setIe(await getIncomeExpenditureStatementApi(societyId, fromDate, toDate, compare)); }
    catch (e) { toast.error(e?.message || "Failed to load Income & Expenditure statement"); }
    finally { setLoading(false); }
  }, [societyId, fromDate, toDate, compare]);

  useEffect(() => {
    if (subTab === "tb") runTrialBalance();
    if (subTab === "bs") runBalanceSheet();
    if (subTab === "ie") runIE();
  }, [subTab, runTrialBalance, runBalanceSheet, runIE]);

  const handleExport = (rows, filename) => {
    if (!rows || rows.length === 0) { toast.error("Nothing to export"); return; }
    exportFile(rows, filename);
  };

  const tabBtn = (t) => (
    <button key={t.key} onClick={() => setSubTab(t.key)} style={{
      padding: "8px 16px", fontSize: 12, fontWeight: subTab === t.key ? 600 : 400, textTransform: "uppercase",
      border: "none", borderBottom: subTab === t.key ? `2px solid ${T.colors.blue600}` : "2px solid transparent",
      background: "none", color: subTab === t.key ? T.colors.blue700 : T.colors.slate500, cursor: "pointer",
    }}>{t.label}</button>
  );

  return (
    <div style={T.page}>
      <div style={{ display: "flex", gap: 4, padding: "8px 16px", backgroundColor: T.colors.blue50, borderBottom: `1px solid ${T.colors.blue100}` }}>
        {SUB_TABS.map(tabBtn)}
      </div>
      <div style={{ padding: 16, paddingBottom: 64 }}>

        {subTab === "tb" && (
          <div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginBottom: 16 }}>
              <Input label="As of date" type="date" style={{ width: 160 }} value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)} />
              <Button onClick={runTrialBalance}>Run</Button>
              <Button variant="secondary" onClick={() => handleExport(tb?.rows, "trial_balance")}><FiDownload size={13} /> Export</Button>
            </div>

            <div style={T.panel}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={T.th}>Code</th><th style={T.th}>Account</th><th style={T.th}>Type</th>
                    <th style={{ ...T.th, textAlign: "right" }}>Debit</th><th style={{ ...T.th, textAlign: "right" }}>Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: T.colors.slate400 }}>Loading…</td></tr>
                  ) : !tb?.rows?.length ? (
                    <tr><td colSpan={5}><EmptyState /></td></tr>
                  ) : (
                    tb.rows.map((r) => (
                      <tr key={r.head_id}>
                        <td style={{ ...T.td, fontFamily: "monospace", color: T.colors.slate500, fontSize: 12 }}>{r.head_code}</td>
                        <td style={T.td}>{r.head_name}</td>
                        <td style={{ ...T.td, color: T.colors.slate400, fontSize: 12, textTransform: "capitalize" }}>{r.head_type}</td>
                        <td style={T.tdRight}>{Number(r.total_debit) ? money(r.total_debit) : ""}</td>
                        <td style={T.tdRight}>{Number(r.total_credit) ? money(r.total_credit) : ""}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                {tb?.totals && (
                  <tfoot>
                    <tr style={{ fontWeight: 600, backgroundColor: T.colors.bg, borderTop: `2px solid ${T.colors.border}` }}>
                      <td colSpan={3} style={T.td}>Grand Total</td>
                      <td style={T.tdRight}>{money(tb.totals.grand_total_debit)}</td>
                      <td style={T.tdRight}>{money(tb.totals.grand_total_credit)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
            {tb?.totals && Number(tb.totals.grand_total_debit) !== Number(tb.totals.grand_total_credit) && (
              <p style={{ fontSize: 12, color: T.colors.red600, marginTop: 8 }}>⚠ Totals don't match — books are out of balance.</p>
            )}
          </div>
        )}

        {subTab === "bs" && (
          <div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginBottom: 16 }}>
              <Input label="As of date" type="date" style={{ width: 160 }} value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)} />
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: T.colors.slate600, paddingBottom: 8 }}>
                <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} /> Compare previous year
              </label>
              <Button onClick={runBalanceSheet}>Run</Button>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: 32, color: T.colors.slate400 }}>Loading…</div>
            ) : bs ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <BalanceSheetSection title="Assets" rows={bs.assets} compare={compare} />
                <div>
                  <BalanceSheetSection title="Liabilities" rows={bs.liabilities} compare={compare} />
                  <div style={{ height: 16 }} />
                  <BalanceSheetSection title="Capital &amp; Reserves" rows={bs.capital} compare={compare} />
                  <div style={{ height: 16 }} />
                  <div style={{ backgroundColor: T.colors.blue50, border: `1px solid ${T.colors.blue100}`, borderRadius: 8, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.colors.blue700 }}>Net Surplus / (Deficit) to date</span>
                    <span style={{ fontWeight: 600, color: T.colors.blue700 }}>{money(bs.net_surplus_deficit)}</span>
                  </div>
                </div>
              </div>
            ) : <EmptyState />}
          </div>
        )}

        {subTab === "ie" && (
          <div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap" }}>
              <Input label="From date" type="date" style={{ width: 160 }} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              <Input label="To date" type="date" style={{ width: 160 }} value={toDate} onChange={(e) => setToDate(e.target.value)} />
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: T.colors.slate600, paddingBottom: 8 }}>
                <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} /> Compare previous year
              </label>
              <Button onClick={runIE}>Run</Button>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: 32, color: T.colors.slate400 }}>Loading…</div>
            ) : ie ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <IESection title="Income" rows={ie.income} total={ie.total_income} compare={compare} tone={T.colors.green700} />
                <IESection title="Expenditure" rows={ie.expenditure} total={ie.total_expenditure} compare={compare} tone={T.colors.red600} />
                <div style={{ gridColumn: "1 / -1", backgroundColor: T.colors.blue50, border: `1px solid ${T.colors.blue100}`, borderRadius: 8, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: T.colors.blue700 }}>Net Surplus / (Deficit)</span>
                  <span style={{ fontWeight: 600, color: T.colors.blue700 }}>{money(ie.net_surplus_deficit)}</span>
                </div>
              </div>
            ) : <EmptyState />}
          </div>
        )}
      </div>

      <FKeyBar items={[]} onEscape={onEscape} />
    </div>
  );
};

const BalanceSheetSection = ({ title, rows = [], compare }) => {
  const total = rows.reduce((s, r) => s + Number(r.balance || 0), 0);
  return (
    <div style={{ ...T.panel, padding: 16 }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: T.colors.slate700, marginTop: 0, marginBottom: 12 }}>{title}</h3>
      {rows.length === 0 ? (
        <p style={{ fontSize: 12, color: T.colors.slate400 }}>No accounts</p>
      ) : (
        <table style={{ width: "100%", fontSize: 13 }}>
          <tbody>
            {rows.map((r) => (
              <tr key={r.head_id} style={{ borderBottom: `1px solid ${T.colors.borderLight}` }}>
                <td style={{ padding: "6px 0", color: T.colors.slate600 }}>{r.head_name}</td>
                <td style={{ padding: "6px 0", textAlign: "right" }}>{money(r.balance)}</td>
                {compare && <td style={{ padding: "6px 0", textAlign: "right", color: T.colors.slate400, fontSize: 11 }}>{r.prev_year_balance != null ? money(r.prev_year_balance) : "—"}</td>}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: 600, borderTop: `1px solid ${T.colors.border}` }}>
              <td style={{ paddingTop: 8 }}>Total</td>
              <td style={{ paddingTop: 8, textAlign: "right" }}>{money(total)}</td>
              {compare && <td></td>}
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

const IESection = ({ title, rows = [], total, compare, tone }) => (
  <div style={{ ...T.panel, padding: 16 }}>
    <h3 style={{ fontSize: 13, fontWeight: 600, color: tone, marginTop: 0, marginBottom: 12 }}>{title}</h3>
    {rows.length === 0 ? (
      <p style={{ fontSize: 12, color: T.colors.slate400 }}>No entries</p>
    ) : (
      <table style={{ width: "100%", fontSize: 13 }}>
        <tbody>
          {rows.map((r) => (
            <tr key={r.head_id} style={{ borderBottom: `1px solid ${T.colors.borderLight}` }}>
              <td style={{ padding: "6px 0", color: T.colors.slate600 }}>{r.head_name}</td>
              <td style={{ padding: "6px 0", textAlign: "right" }}>{money(r.amount)}</td>
              {compare && <td style={{ padding: "6px 0", textAlign: "right", color: T.colors.slate400, fontSize: 11 }}>{r.prev_year_amount != null ? money(r.prev_year_amount) : "—"}</td>}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ fontWeight: 600, borderTop: `1px solid ${T.colors.border}` }}>
            <td style={{ paddingTop: 8 }}>Total</td>
            <td style={{ paddingTop: 8, textAlign: "right" }}>{money(total)}</td>
            {compare && <td></td>}
          </tr>
        </tfoot>
      </table>
    )}
  </div>
);

export default AccountsReports;
