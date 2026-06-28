import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getBillingSummaryApi, generateBillsForAllApi } from "../../services/BillingApi";
import "../../styles/Billing.css";

const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

const BillingDashboard = ({ setActive, setBillId }) => {

    const [summary,       setSummary]       = useState(null);
    const [receiptStats,  setReceiptStats]  = useState(null);
    const [defaulters,    setDefaulters]    = useState([]);
    const [filterMonth,   setFilterMonth]   = useState("");
    const [filterYear,    setFilterYear]    = useState(new Date().getFullYear());

    // Bulk generate state
    const [bulkMonth,       setBulkMonth]       = useState(MONTHS[new Date().getMonth()]);
    const [bulkYear,        setBulkYear]        = useState(new Date().getFullYear());
    const [bulkLoading,     setBulkLoading]     = useState(false);
    const [bulkResult,      setBulkResult]      = useState(null);
    const [showBulkDetail,  setShowBulkDetail]  = useState(false);
    const [bulkApplyWallet, setBulkApplyWallet] = useState(true);   // default ON
    const [bulkRegenerate,  setBulkRegenerate]  = useState(false);

    const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

    useEffect(() => { fetchSummary(); }, [filterMonth, filterYear]);

    const fetchSummary = async () => {
        try {
            const res = await getBillingSummaryApi(filterMonth, filterYear || null);
            setSummary(res?.summary        || null);
            setReceiptStats(res?.receipt_stats  || null);
            setDefaulters(res?.top_defaulters || []);
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to load billing summary");
        }
    };

    const handleBulkGenerate = async () => {
        if (!window.confirm(
            `Generate bills for ALL flats for ${bulkMonth} ${bulkYear}?\n\nFlats with existing bills will be skipped automatically.`
        )) return;

        setBulkLoading(true);
        setBulkResult(null);
        try {
            const res = await generateBillsForAllApi(bulkMonth, parseInt(bulkYear), {
                applyWallet: bulkApplyWallet,
                regenerate:  bulkRegenerate,
            });
            setBulkResult(res);
            toast.success(
                `✅ ${res.summary.bills_generated} bills generated — ₹${Number(res.summary.total_billed || 0).toLocaleString("en-IN")}`
            );
            fetchSummary();
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Bulk generation failed");
        } finally {
            setBulkLoading(false);
        }
    };

    const statCards = [
        { label: "Total Billed",    value: fmt(summary?.total_billed),     icon: "💰", color: "#dbeafe", sub: `${summary?.total_flats_billed || 0} flats` },
        { label: "Collected",       value: fmt(summary?.total_collected),   icon: "✅", color: "#d1fae5", sub: `${summary?.paid_count || 0} fully paid` },
        { label: "Outstanding",     value: fmt(summary?.total_outstanding), icon: "⚠️", color: "#fee2e2", sub: `${summary?.unpaid_count || 0} unpaid` },
        { label: "Overdue",         value: summary?.overdue_count || 0,     icon: "🔴", color: "#fde8d8", sub: "past due date" },
        { label: "Partial",         value: summary?.partial_count || 0,     icon: "⏳", color: "#fef3c7", sub: "partially paid" },
        { label: "Total Arrears",   value: fmt(summary?.total_arrears),     icon: "📋", color: "#f3e8ff", sub: "carried forward" },
    ];

    return (
        <div className="pg" style={{ padding: "20px 24px" }}>

            {/* ── Header ── */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                <div>
                    <h4 style={{ fontWeight: 700, color: "#111827", margin: 0 }}>💰 Billing Dashboard</h4>
                    <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>Society billing overview and collections</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <select className="billing-form-input" style={{ width: 140 }}
                        value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                        <option value="">All Months</option>
                        {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select className="billing-form-input" style={{ width: 100 }}
                        value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                        <option value="">All Years</option>
                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <button className="billing-btn billing-btn-outline" onClick={() => setActive("billsList")}>
                        📄 All Bills
                    </button>
                </div>
            </div>

            {/* ── Bulk Generate Card ── */}
            <div className="billing-card mb-4" style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "1px solid #86efac" }}>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#065f46" }}>
                            ⚡ Bulk Bill Generation
                        </div>
                        <div style={{ fontSize: 12, color: "#059669", marginTop: 2 }}>
                            Generate bills for <strong>all flats</strong> in one click. Already-billed flats are skipped automatically.
                        </div>
                    </div>
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        <select className="billing-form-input" style={{ width: 140 }}
                            value={bulkMonth} onChange={(e) => setBulkMonth(e.target.value)}>
                            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select className="billing-form-input" style={{ width: 100 }}
                            value={bulkYear} onChange={(e) => setBulkYear(e.target.value)}>
                            {years.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <button
                            className="billing-btn billing-btn-success"
                            onClick={handleBulkGenerate}
                            disabled={bulkLoading}
                            style={{ minWidth: 140 }}
                        >
                            {bulkLoading ? "⏳ Generating..." : "⚡ Generate All Bills"}
                        </button>
                    </div>
                </div>

                {/* Bulk Result */}
                {bulkResult && (
                    <div style={{
                        marginTop: 16, padding: "12px 16px",
                        background: "#fff", borderRadius: 8,
                        border: "1px solid #bbf7d0"
                    }}>
                        <div className="d-flex gap-4 flex-wrap align-items-center">
                            <span style={{ fontSize: 13, color: "#065f46", fontWeight: 600 }}>
                                {bulkResult.summary.bill_month} {bulkResult.summary.bill_year} results:
                            </span>
                            <span style={{ fontSize: 13 }}>
                                ✅ <strong style={{ color: "#059669" }}>{bulkResult.summary.bills_generated}</strong> generated
                            </span>
                            <span style={{ fontSize: 13 }}>
                                ⏭ <strong style={{ color: "#92400e" }}>{bulkResult.summary.bills_skipped}</strong> skipped
                            </span>
                            {bulkResult.summary.errors > 0 && (
                                <span style={{ fontSize: 13 }}>
                                    ❌ <strong style={{ color: "#dc2626" }}>{bulkResult.summary.errors}</strong> errors
                                </span>
                            )}
                            <span style={{ fontSize: 13 }}>
                                💰 <strong style={{ color: "#2563eb" }}>{fmt(bulkResult.summary.total_billed)}</strong> total billed
                            </span>
                            <button
                                className="billing-btn billing-btn-outline billing-btn-sm ms-auto"
                                onClick={() => setShowBulkDetail(true)}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Stat Cards ── */}
            <div className="row g-3 mb-4">
                {statCards.map((c) => (
                    <div key={c.label} className="col-12 col-sm-6 col-xl-4">
                        <div className="billing-stat-card">
                            <div className="billing-stat-icon" style={{ background: c.color }}>
                                <span>{c.icon}</span>
                            </div>
                            <div>
                                <div className="billing-stat-label">{c.label}</div>
                                <div className="billing-stat-value">{c.value}</div>
                                <div className="billing-stat-sub">{c.sub}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-3">
                {/* Collections by Mode */}
                <div className="col-12 col-lg-5">
                    <div className="billing-card h-100">
                        <div className="billing-card-title">🧾 Collections by Payment Mode</div>
                        {receiptStats ? (
                            <div>
                                {[
                                    { label: "Bank Transfer", value: receiptStats.bank_amount,   icon: "🏦" },
                                    { label: "Cash",          value: receiptStats.cash_amount,   icon: "💵" },
                                    { label: "Cheque",        value: receiptStats.cheque_amount, icon: "📝" },
                                    { label: "UPI",           value: receiptStats.upi_amount,    icon: "📱" },
                                ].map((row) => {
                                    const pct = Math.min(100, (Number(row.value || 0) / Math.max(Number(receiptStats.total_received || 1), 1)) * 100);
                                    return (
                                        <div key={row.label} className="d-flex align-items-center justify-content-between mb-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <span style={{ fontSize: 18 }}>{row.icon}</span>
                                                <span style={{ fontSize: 13 }}>{row.label}</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <div style={{ width: 80, height: 6, background: "#f3f4f6", borderRadius: 3 }}>
                                                    <div style={{ width: `${pct}%`, height: "100%", background: "#2563eb", borderRadius: 3 }} />
                                                </div>
                                                <span className="amount-display" style={{ fontSize: 13, minWidth: 90, textAlign: "right" }}>
                                                    {fmt(row.value)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                                    <span>Total Received</span>
                                    <span className="amount-green">{fmt(receiptStats.total_received)}</span>
                                </div>
                            </div>
                        ) : (
                            <div style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", padding: 24 }}>No receipt data</div>
                        )}
                    </div>
                </div>

                {/* Top Defaulters */}
                <div className="col-12 col-lg-7">
                    <div className="billing-card h-100">
                        <div className="billing-card-title d-flex justify-content-between">
                            <span>🚨 Top Defaulters</span>
                            <button className="billing-btn billing-btn-outline billing-btn-sm" onClick={() => setActive("billsList")}>
                                View All
                            </button>
                        </div>
                        {defaulters.length === 0 ? (
                            <div style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", padding: 24 }}>🎉 No defaulters!</div>
                        ) : defaulters.map((d, i) => (
                            <div key={i} className="defaulter-row">
                                <div className="d-flex align-items-center gap-3">
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8,
                                        background: "#fee2e2", color: "#dc2626",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontWeight: 700, fontSize: 13
                                    }}>{i + 1}</div>
                                    <div>
                                        <div className="defaulter-name">{d.owner_name || "—"}</div>
                                        <div className="defaulter-flat">
                                            Flat {d.flat_number}{d.block ? ` · ${d.block}` : ""}
                                            {d.owner_mobile ? ` · ${d.owner_mobile}` : ""}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="defaulter-amt">{fmt(d.total_outstanding)}</div>
                                    <div style={{ fontSize: 11, color: "#6b7280" }}>{d.pending_bills} bill(s)</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Quick Actions ── */}
            <div className="row g-3 mt-1">
                {[
                    { label: "Billing Settings", icon: "⚙️", page: "billingSettings" },
                    { label: "Charge Heads",     icon: "🏷️", page: "chargeHeads" },
                    { label: "Flat Charges",     icon: "🏠", page: "flatCharges" },
                    { label: "Record Payment",   icon: "💳", page: "billsList" },
                    { label: "Flat Ledger",      icon: "📒", page: "flatLedger" },
                    { label: "Opening Balances", icon: "📂", page: "openingBalance" },
                    { label: "Wallet Manager",   icon: "💜", page: "walletManager" },
                    { label: "Reports",          icon: "📊", page: "reports" },
                    { label: "Scheduler",        icon: "⏰", page: "scheduler" },
                ].map((q) => (
                    <div key={q.page} className="col-6 col-sm-4 col-lg-2">
                        <button
                            onClick={() => setActive(q.page)}
                            style={{
                                width: "100%", background: "#fff",
                                border: "1px dashed #d1d5db", borderRadius: 10,
                                padding: "16px 8px", cursor: "pointer",
                                textAlign: "center", transition: "all 0.15s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                        >
                            <div style={{ fontSize: 26, marginBottom: 6 }}>{q.icon}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{q.label}</div>
                        </button>
                    </div>
                ))}
            </div>

            {/* ── Bulk Detail Modal ── */}
            {showBulkDetail && bulkResult && (
                <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.45)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                        <div className="modal-content" style={{ borderRadius: 12, border: "none" }}>
                            <div className="billing-modal-header">
                                <span>⚡ Bulk Generation — {bulkResult.summary.bill_month} {bulkResult.summary.bill_year}</span>
                                <button className="close-btn" onClick={() => setShowBulkDetail(false)}>×</button>
                            </div>
                            <div style={{ padding: 20 }}>

                                {/* Summary row */}
                                <div className="d-flex gap-3 mb-3 flex-wrap">
                                    {[
                                        { label: "Generated", val: bulkResult.summary.bills_generated, color: "#059669" },
                                        { label: "Skipped",   val: bulkResult.summary.bills_skipped,   color: "#92400e" },
                                        { label: "Errors",    val: bulkResult.summary.errors,           color: "#dc2626" },
                                        { label: "Total Billed", val: fmt(bulkResult.summary.total_billed), color: "#2563eb" },
                                    ].map((s) => (
                                        <div key={s.label} style={{
                                            flex: 1, minWidth: 100, background: "#f9fafb",
                                            border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px"
                                        }}>
                                            <div style={{ fontSize: 11, color: "#6b7280" }}>{s.label}</div>
                                            <div style={{ fontWeight: 700, color: s.color, fontSize: 16 }}>{s.val}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Generated */}
                                {bulkResult.generated?.length > 0 && (
                                    <>
                                        <div style={{ fontWeight: 700, fontSize: 13, color: "#059669", marginBottom: 8 }}>
                                            ✅ Generated ({bulkResult.generated.length})
                                        </div>
                                        <div style={{ overflowX: "auto", marginBottom: 16 }}>
                                            <table className="billing-table">
                                                <thead>
                                                    <tr>
                                                        <th>Flat</th>
                                                        <th>Bill No</th>
                                                        <th className="text-end">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bulkResult.generated.map((r, i) => (
                                                        <tr key={i}>
                                                            <td style={{ fontWeight: 600 }}>{r.flat_number}</td>
                                                            <td style={{ color: "#2563eb", fontSize: 12 }}>{r.bill_no}</td>
                                                            <td className="text-end amount-display">{fmt(r.total_amount)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                                {/* Skipped */}
                                {bulkResult.skipped?.length > 0 && (
                                    <>
                                        <div style={{ fontWeight: 700, fontSize: 13, color: "#92400e", marginBottom: 8 }}>
                                            ⏭ Skipped ({bulkResult.skipped.length})
                                        </div>
                                        <div style={{ overflowX: "auto" }}>
                                            <table className="billing-table">
                                                <thead>
                                                    <tr>
                                                        <th>Flat</th>
                                                        <th>Reason</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bulkResult.skipped.map((r, i) => (
                                                        <tr key={i}>
                                                            <td style={{ fontWeight: 600 }}>{r.flat_number}</td>
                                                            <td style={{ color: "#6b7280", fontSize: 12 }}>{r.reason}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                                <div className="d-flex justify-content-end mt-3">
                                    <button className="billing-btn billing-btn-primary" onClick={() => setActive("billsList")}>
                                        View All Bills →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingDashboard;
