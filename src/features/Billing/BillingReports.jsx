import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Pagination } from "../../components/Common/ReusableFunction";
import {
    getCollectionReportApi,
    getMemberOutstandingApi,
    getIncomeExpenditureApi,
    getCashBookApi,
    getPenaltyHistoryApi,
} from "../../services/BillingApi";
import "../../styles/Billing.css";

const fmt  = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
const fmtD = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";

const REPORTS = [
    { id: "collection",    label: "Collection Report",        icon: "💰" },
    { id: "outstanding",   label: "Member Outstanding",       icon: "⚠️" },
    { id: "ie",            label: "Income & Expenditure",     icon: "📊" },
    { id: "cashbook",      label: "Cash Book",                icon: "📒" },
    { id: "penalty",       label: "Penalty Report",           icon: "🔴" },
];

const getCurrentFY = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year  = today.getFullYear();
    const fyYear = month >= 4 ? year : year - 1;
    return {
        code:     `FY${fyYear}-${String(fyYear+1).slice(2)}`,
        fy_start: `${fyYear}-04-01`,
        fy_end:   `${fyYear+1}-03-31`,
        label:    `${fyYear}-${String(fyYear+1).slice(2)}`,
    };
};

// society_id injected by billingPost helper automatically

const BillingReports = ({ setActive }) => {
    const [activeReport, setActiveReport] = useState("collection");
    const [data,         setData]         = useState(null);
    const [loading,      setLoading]      = useState(false);
    const [page,         setPage]         = useState(1);
    const currentFY = getCurrentFY();

    const [filters, setFilters] = useState({
        from_date: currentFY.fy_start,
        to_date:   currentFY.fy_end,
        fy_start:  currentFY.fy_start,
        fy_end:    currentFY.fy_end,
        mode:      "",
    });

    const availableFYs = (() => {
        const today = new Date();
        const yr    = today.getMonth() + 1 >= 4 ? today.getFullYear() : today.getFullYear() - 1;
        return [0,1,2].map((i) => ({
            code:     `FY${yr-i}-${String(yr-i+1).slice(2)}`,
            fy_start: `${yr-i}-04-01`,
            fy_end:   `${yr-i+1}-03-31`,
        }));
    })();

    useEffect(() => { loadReport(); }, [activeReport, page]);

    const loadReport = async () => {
        setLoading(true);
        setData(null);
        try {
            const payload = {
                from_date: filters.from_date,
                to_date:   filters.to_date,
                fy_start:  filters.fy_start,
                fy_end:    filters.fy_end,
                mode:      filters.mode || null,
                page,
                page_size: 20,
            };

            let res = null;
            if (activeReport === "collection")  res = await getCollectionReportApi(payload);
            if (activeReport === "outstanding") res = await getMemberOutstandingApi(payload);
            if (activeReport === "ie")          res = await getIncomeExpenditureApi(payload);
            if (activeReport === "cashbook")    res = await getCashBookApi(payload);
            if (activeReport === "penalty")     res = await getPenaltyHistoryApi(payload);

            setData(res);
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to load report");
        } finally {
            setLoading(false);
        }
    };

    const setFY = (fy) => {
        setFilters((prev) => ({
            ...prev,
            from_date: fy.fy_start, to_date: fy.fy_end,
            fy_start:  fy.fy_start, fy_end:  fy.fy_end,
        }));
        setPage(1);
    };

    const handleFilter = () => { setPage(1); loadReport(); };

    const downloadCSV = () => {
        if (!data) return;
        const rows = data.receipts || data.members || data.entries || data.penalties || [];
        if (!rows.length) { toast.info("No data to export"); return; }
        const headers = Object.keys(rows[0]).join(",");
        const body    = rows.map((r) => Object.values(r).map((v) => `"${v ?? ""}"`).join(",")).join("\n");
        const blob    = new Blob([headers + "\n" + body], { type: "text/csv" });
        const url     = URL.createObjectURL(blob);
        const a       = document.createElement("a");
        a.href = url; a.download = `${activeReport}_report.csv`; a.click();
    };

    return (
        <div className="pg" style={{ padding: "20px 24px" }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 style={{ fontWeight: 700, margin: 0 }}>📊 Billing Reports</h4>
                    <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
                        Current FY: <strong>{currentFY.code}</strong> · {fmtD(currentFY.fy_start)} to {fmtD(currentFY.fy_end)}
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button className="billing-btn billing-btn-outline"
                        onClick={() => setActive("billingDashboard")}>← Dashboard</button>
                    <button className="billing-btn billing-btn-outline" onClick={downloadCSV}>
                        ⬇ Export CSV
                    </button>
                </div>
            </div>

            <div className="d-flex gap-4">
                {/* ── Sidebar ── */}
                <div style={{ width: 200, flexShrink: 0 }}>
                    <div className="billing-card" style={{ padding: 8 }}>
                        {REPORTS.map((r) => (
                            <button key={r.id}
                                onClick={() => { setActiveReport(r.id); setPage(1); }}
                                style={{
                                    display: "block", width: "100%", textAlign: "left",
                                    padding: "10px 14px", border: "none", borderRadius: 8,
                                    cursor: "pointer", fontSize: 13, marginBottom: 2,
                                    background: activeReport === r.id ? "#dbeafe" : "transparent",
                                    color:      activeReport === r.id ? "#1e40af" : "#374151",
                                    fontWeight: activeReport === r.id ? 700 : 400,
                                }}>
                                {r.icon} {r.label}
                            </button>
                        ))}

                        <div style={{ borderTop: "1px solid #f3f4f6", margin: "12px 0", padding: "12px 6px 0" }}>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8, fontWeight: 600 }}>
                                FINANCIAL YEAR
                            </div>
                            {availableFYs.map((fy) => (
                                <button key={fy.code}
                                    onClick={() => setFY(fy)}
                                    style={{
                                        display: "block", width: "100%", textAlign: "left",
                                        padding: "7px 10px", border: "none", borderRadius: 6,
                                        cursor: "pointer", fontSize: 12, marginBottom: 2,
                                        background: filters.fy_start === fy.fy_start ? "#f0fdf4" : "transparent",
                                        color:      filters.fy_start === fy.fy_start ? "#065f46" : "#6b7280",
                                        fontWeight: filters.fy_start === fy.fy_start ? 700 : 400,
                                    }}>
                                    {fy.code}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Main content ── */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Date range filter */}
                    <div className="billing-card mb-3" style={{ padding: "12px 16px" }}>
                        <div className="d-flex gap-3 align-items-end flex-wrap">
                            <div>
                                <label className="billing-form-label">From</label>
                                <input type="date" className="billing-form-input"
                                    value={filters.from_date}
                                    onChange={(e) => setFilters({...filters, from_date: e.target.value})} />
                            </div>
                            <div>
                                <label className="billing-form-label">To</label>
                                <input type="date" className="billing-form-input"
                                    value={filters.to_date}
                                    onChange={(e) => setFilters({...filters, to_date: e.target.value})} />
                            </div>
                            {activeReport === "cashbook" && (
                                <div>
                                    <label className="billing-form-label">Mode</label>
                                    <select className="billing-form-input"
                                        value={filters.mode}
                                        onChange={(e) => setFilters({...filters, mode: e.target.value})}>
                                        <option value="">All</option>
                                        <option value="cash">Cash</option>
                                        <option value="bank">Bank</option>
                                        <option value="upi">UPI</option>
                                    </select>
                                </div>
                            )}
                            <button className="billing-btn billing-btn-primary billing-btn-sm"
                                onClick={handleFilter}>🔍 Apply</button>
                        </div>
                    </div>

                    {/* Report content */}
                    {loading ? (
                        <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
                            Loading report...
                        </div>
                    ) : !data ? null : (
                        <>
                            {/* COLLECTION REPORT */}
                            {activeReport === "collection" && (
                                <>
                                    <div className="d-flex gap-3 mb-3 flex-wrap">
                                        {[
                                            { l: "Total Collected",  v: fmt(data.summary?.total_collected),  c: "#059669" },
                                            { l: "Principal",        v: fmt(data.summary?.total_principal),  c: "#2563eb" },
                                            { l: "Interest",         v: fmt(data.summary?.total_interest),   c: "#dc2626" },
                                            { l: "Wallet Used",      v: fmt(data.summary?.total_wallet_used),c: "#7c3aed" },
                                            { l: "Flats Paid",       v: data.summary?.flats_paid || 0,       c: "#374151" },
                                        ].map((s) => (
                                            <div key={s.l} style={{
                                                background: "#fff", border: "1px solid #e5e7eb",
                                                borderRadius: 10, padding: "12px 18px", flex: 1
                                            }}>
                                                <div style={{ fontSize: 11, color: "#6b7280" }}>{s.l}</div>
                                                <div style={{ fontWeight: 700, color: s.c, fontSize: 16 }}>{s.v}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="billing-card" style={{ padding: 0 }}>
                                        <table className="billing-table">
                                            <thead>
                                                <tr>
                                                    <th>Receipt No</th><th>Date</th><th>Flat</th>
                                                    <th>Owner</th><th>Period</th><th>Mode</th>
                                                    <th className="text-end">Principal</th>
                                                    <th className="text-end">Interest</th>
                                                    <th className="text-end">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(data.receipts || []).map((r) => (
                                                    <tr key={r.receipt_id}>
                                                        <td style={{ color: "#2563eb", fontWeight: 600 }}>{r.receipt_no}</td>
                                                        <td style={{ fontSize: 12 }}>{fmtD(r.receipt_date)}</td>
                                                        <td>{r.flat_number}{r.block?` / ${r.block}`:""}</td>
                                                        <td style={{ fontSize: 12 }}>{r.owner_name || "—"}</td>
                                                        <td>{r.bill_month} {r.bill_year}</td>
                                                        <td><span style={{ fontSize: 10, padding: "2px 6px", background: "#f3f4f6", borderRadius: 6 }}>{r.payment_mode?.toUpperCase()}</span></td>
                                                        <td className="text-end">{fmt(r.principal_amount)}</td>
                                                        <td className="text-end" style={{ color: "#dc2626" }}>{fmt(r.interest_amount)}</td>
                                                        <td className="text-end amount-display">{fmt(r.total_amount)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}

                            {/* OUTSTANDING */}
                            {activeReport === "outstanding" && (
                                <>
                                    <div className="d-flex gap-3 mb-3 flex-wrap">
                                        {[
                                            { l: "Total Outstanding", v: fmt(data.summary?.total_outstanding), c: "#dc2626" },
                                            { l: "Flats Defaulting",  v: data.summary?.flats_outstanding||0,  c: "#92400e" },
                                            { l: "Total Penalties",   v: fmt(data.summary?.total_penalties),  c: "#7c3aed" },
                                        ].map((s) => (
                                            <div key={s.l} style={{
                                                background: "#fff", border: "1px solid #e5e7eb",
                                                borderRadius: 10, padding: "12px 18px", flex: 1
                                            }}>
                                                <div style={{ fontSize: 11, color: "#6b7280" }}>{s.l}</div>
                                                <div style={{ fontWeight: 700, color: s.c, fontSize: 16 }}>{s.v}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="billing-card" style={{ padding: 0 }}>
                                        <table className="billing-table">
                                            <thead>
                                                <tr>
                                                    <th>Flat</th><th>Owner</th><th>Mobile</th>
                                                    <th className="text-end">Outstanding</th>
                                                    <th className="text-end">Penalties</th>
                                                    <th className="text-end">Wallet Balance</th>
                                                    <th>Pending Bills</th><th>Overdue Days</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(data.members || []).map((m) => (
                                                    <tr key={m.flat_id}>
                                                        <td style={{ fontWeight: 600 }}>{m.flat_number}{m.block?` / ${m.block}`:""}</td>
                                                        <td>{m.owner_name || "—"}</td>
                                                        <td style={{ fontSize: 12 }}>{m.owner_mobile || "—"}</td>
                                                        <td className="text-end" style={{ color: "#dc2626", fontWeight: 700 }}>{fmt(m.total_outstanding)}</td>
                                                        <td className="text-end" style={{ color: "#7c3aed" }}>{fmt(m.total_penalties)}</td>
                                                        <td className="text-end" style={{ color: "#059669" }}>{fmt(m.wallet_balance)}</td>
                                                        <td style={{ textAlign: "center" }}>{m.pending_bills}</td>
                                                        <td style={{ textAlign: "center", color: m.overdue_days > 30 ? "#dc2626" : "#92400e" }}>
                                                            {m.overdue_days}d
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}

                            {/* I&E */}
                            {activeReport === "ie" && (
                                <div className="row g-3">
                                    {/* Income */}
                                    <div className="col-6">
                                        <div className="billing-card" style={{ padding: 0 }}>
                                            <div style={{ padding: "12px 16px", background: "#d1fae5", fontWeight: 700, color: "#065f46" }}>
                                                📈 Income — {fmt(data.total_income)}
                                            </div>
                                            <table className="billing-table">
                                                <tbody>
                                                    {(data.income || []).map((r, i) => (
                                                        <tr key={i}>
                                                            <td>{r.head}</td>
                                                            <td className="text-end amount-green">{fmt(r.amount)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {/* Expenditure */}
                                    <div className="col-6">
                                        <div className="billing-card" style={{ padding: 0 }}>
                                            <div style={{ padding: "12px 16px", background: "#fee2e2", fontWeight: 700, color: "#991b1b" }}>
                                                📉 Expenditure — {fmt(data.total_expense)}
                                            </div>
                                            <table className="billing-table">
                                                <tbody>
                                                    {(data.expenditure || []).map((r, i) => (
                                                        <tr key={i}>
                                                            <td>{r.head}</td>
                                                            <td className="text-end amount-red">{fmt(r.amount)}</td>
                                                        </tr>
                                                    ))}
                                                    {(!data.expenditure || !data.expenditure.length) && (
                                                        <tr><td colSpan={2} style={{ color: "#9ca3af", textAlign: "center", padding: 20 }}>No expenses recorded</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div style={{
                                            background: data.surplus >= 0 ? "#d1fae5" : "#fee2e2",
                                            borderRadius: 8, padding: "12px 16px", marginTop: 12,
                                            display: "flex", justifyContent: "space-between", fontWeight: 700
                                        }}>
                                            <span>Net Surplus / (Deficit)</span>
                                            <span style={{ color: data.surplus >= 0 ? "#059669" : "#dc2626" }}>
                                                {fmt(data.surplus)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CASH BOOK */}
                            {activeReport === "cashbook" && (
                                <>
                                    <div className="d-flex gap-3 mb-3">
                                        {[
                                            { l: "Total Credit (In)",  v: fmt(data.total_credit),   c: "#059669" },
                                            { l: "Total Debit (Out)",  v: fmt(data.total_debit),    c: "#dc2626" },
                                            { l: "Closing Balance",    v: fmt(data.closing_balance),c: "#1e40af" },
                                        ].map((s) => (
                                            <div key={s.l} style={{
                                                background: "#fff", border: "1px solid #e5e7eb",
                                                borderRadius: 10, padding: "12px 18px", flex: 1
                                            }}>
                                                <div style={{ fontSize: 11, color: "#6b7280" }}>{s.l}</div>
                                                <div style={{ fontWeight: 700, color: s.c, fontSize: 16 }}>{s.v}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="billing-card" style={{ padding: 0 }}>
                                        <table className="billing-table">
                                            <thead>
                                                <tr>
                                                    <th>Date</th><th>Type</th><th>Narration</th>
                                                    <th>Mode</th><th>Flat</th>
                                                    <th className="text-end">Credit</th>
                                                    <th className="text-end">Debit</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(data.entries || []).map((e, i) => (
                                                    <tr key={i}>
                                                        <td style={{ fontSize: 12 }}>{fmtD(e.txn_date)}</td>
                                                        <td><span style={{ fontSize: 10, padding: "2px 6px", background: e.txn_type==="receipt"?"#d1fae5":"#fee2e2", borderRadius: 6, color: e.txn_type==="receipt"?"#065f46":"#991b1b" }}>{e.txn_type}</span></td>
                                                        <td style={{ fontSize: 12 }}>{e.narration}</td>
                                                        <td style={{ fontSize: 11, color: "#6b7280" }}>{e.payment_mode}</td>
                                                        <td style={{ fontSize: 12 }}>{e.flat_number}{e.block?` / ${e.block}`:""}</td>
                                                        <td className="text-end amount-green">{parseFloat(e.credit_amount||0)>0?fmt(e.credit_amount):"—"}</td>
                                                        <td className="text-end amount-red">{parseFloat(e.debit_amount||0)>0?fmt(e.debit_amount):"—"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}

                            {/* Pagination */}
                            {data.pagination && data.pagination.total > data.pagination.page_size && (
                                <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                                    <Pagination
                                        page={page}
                                        total={data.pagination.total_pages}
                                        onChange={(p) => setPage(p)}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillingReports;