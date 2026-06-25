import { useState, useEffect } from "react";
import { GetSessionData } from "../../utils/SessionManagement";
import { toast } from "react-toastify";
import { FiTrendingUp, FiAlertCircle, FiCheckCircle, FiClock, FiDollarSign, FiUsers } from "react-icons/fi";
import { getBillingSummaryApi } from "../../services/BillingApi";
import "../../styles/Billing.css";

const MONTHS = [
    "", "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

const BillingDashboard = ({ setActive, setBillId }) => {
    const [societyId, setSocietyId]       = useState("");
    const [summary, setSummary]           = useState(null);
    const [receiptStats, setReceiptStats] = useState(null);
    const [defaulters, setDefaulters]     = useState([]);
    const [filterMonth, setFilterMonth]   = useState("");
    const [filterYear, setFilterYear]     = useState(new Date().getFullYear());

    useEffect(() => {
        const s = GetSessionData();
        if (s?.society_id) setSocietyId(s.society_id);
    }, []);

    useEffect(() => {
        if (societyId) fetchSummary();
    }, [societyId, filterMonth, filterYear]);

    const fetchSummary = async () => {
        try {
            const res = await getBillingSummaryApi(filterMonth, filterYear || null);
            setSummary(res?.summary || null);
            setReceiptStats(res?.receipt_stats || null);
            setDefaulters(res?.top_defaulters || []);
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to load billing summary");
        }
    };

    const statCards = [
        {
            label: "Total Billed",
            value: fmt(summary?.total_billed),
            icon: "💰",
            color: "#dbeafe", iconColor: "#2563eb",
            sub: `${summary?.total_flats_billed || 0} flats`,
        },
        {
            label: "Collected",
            value: fmt(summary?.total_collected),
            icon: "✅",
            color: "#d1fae5", iconColor: "#059669",
            sub: `${summary?.paid_count || 0} fully paid`,
        },
        {
            label: "Outstanding",
            value: fmt(summary?.total_outstanding),
            icon: "⚠️",
            color: "#fee2e2", iconColor: "#dc2626",
            sub: `${summary?.unpaid_count || 0} unpaid`,
        },
        {
            label: "Overdue",
            value: summary?.overdue_count || 0,
            icon: "🔴",
            color: "#fde8d8", iconColor: "#ea580c",
            sub: "past due date",
        },
        {
            label: "Partial Payments",
            value: summary?.partial_count || 0,
            icon: "⏳",
            color: "#fef3c7", iconColor: "#d97706",
            sub: "partially paid",
        },
        {
            label: "Total Arrears",
            value: fmt(summary?.total_arrears),
            icon: "📋",
            color: "#f3e8ff", iconColor: "#7c3aed",
            sub: "carried forward",
        },
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="pg" style={{ padding: "20px 24px" }}>

            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 style={{ fontWeight: 700, color: "#111827", margin: 0 }}>💰 Billing Dashboard</h4>
                    <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>Society billing overview and collections</p>
                </div>
                <div className="d-flex gap-2">
                    <select
                        className="billing-form-input"
                        style={{ width: 140 }}
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                    >
                        <option value="">All Months</option>
                        {MONTHS.slice(1).map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select
                        className="billing-form-input"
                        style={{ width: 100 }}
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                    >
                        <option value="">All Years</option>
                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <button className="billing-btn billing-btn-primary" onClick={() => setActive("billsList")}>
                        📄 All Bills
                    </button>
                    <button className="billing-btn billing-btn-success" onClick={() => setActive("generateBill")}>
                        ➕ Generate Bill
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
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
                {/* Receipt Stats */}
                <div className="col-12 col-lg-5">
                    <div className="billing-card h-100">
                        <div className="billing-card-title">🧾 Collections by Payment Mode</div>
                        {receiptStats ? (
                            <div>
                                {[
                                    { label: "Bank Transfer", value: receiptStats.bank_amount, icon: "🏦" },
                                    { label: "Cash",          value: receiptStats.cash_amount,   icon: "💵" },
                                    { label: "Cheque",        value: receiptStats.cheque_amount, icon: "📝" },
                                    { label: "UPI",           value: receiptStats.upi_amount,    icon: "📱" },
                                ].map((row) => (
                                    <div key={row.label} className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <span style={{ fontSize: 18 }}>{row.icon}</span>
                                            <span style={{ fontSize: 13, color: "#374151" }}>{row.label}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{
                                                width: 100, height: 6, background: "#f3f4f6",
                                                borderRadius: 3, overflow: "hidden"
                                            }}>
                                                <div style={{
                                                    width: `${Math.min(100, (Number(row.value || 0) / Math.max(Number(receiptStats.total_received || 1), 1)) * 100)}%`,
                                                    height: "100%", background: "#2563eb", borderRadius: 3
                                                }} />
                                            </div>
                                            <span className="amount-display" style={{ fontSize: 13, minWidth: 80, textAlign: "right" }}>
                                                {fmt(row.value)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div style={{
                                    borderTop: "1px solid #e5e7eb", paddingTop: 12,
                                    display: "flex", justifyContent: "space-between",
                                    fontWeight: 700, fontSize: 14
                                }}>
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
                            <button
                                className="billing-btn billing-btn-outline billing-btn-sm"
                                onClick={() => setActive("billsList")}
                            >
                                View All
                            </button>
                        </div>
                        {defaulters.length === 0 ? (
                            <div style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", padding: 24 }}>
                                🎉 No defaulters!
                            </div>
                        ) : (
                            defaulters.map((d, i) => (
                                <div key={i} className="defaulter-row">
                                    <div className="d-flex align-items-center gap-3">
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 8,
                                            background: "#fee2e2", color: "#dc2626",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontWeight: 700, fontSize: 13
                                        }}>
                                            {i + 1}
                                        </div>
                                        <div>
                                            <div className="defaulter-name">{d.owner_name || "—"}</div>
                                            <div className="defaulter-flat">
                                                Flat {d.flat_number} {d.block ? `• Block ${d.block}` : ""}
                                                {d.owner_mobile ? ` • ${d.owner_mobile}` : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="defaulter-amt">{fmt(d.total_outstanding)}</div>
                                        <div style={{ fontSize: 11, color: "#6b7280" }}>{d.pending_bills} bill(s) pending</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="row g-3 mt-1">
                {[
                    { label: "Billing Settings",  icon: "⚙️",  page: "billingSettings" },
                    { label: "Charge Heads",      icon: "🏷️", page: "chargeHeads" },
                    { label: "Flat Charges",      icon: "🏠",  page: "flatCharges" },
                    { label: "Record Payment",    icon: "💳",  page: "recordPayment" },
                    { label: "Flat Ledger",       icon: "📒",  page: "flatLedger" },
                    { label: "Opening Balances",  icon: "📂",  page: "openingBalance" },
                ].map((q) => (
                    <div key={q.page} className="col-6 col-sm-4 col-lg-2">
                        <button
                            className="billing-card w-100 text-center"
                            style={{ border: "1px dashed #d1d5db", cursor: "pointer", background: "#fafafa" }}
                            onClick={() => setActive(q.page)}
                        >
                            <div style={{ fontSize: 28, marginBottom: 6 }}>{q.icon}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{q.label}</div>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BillingDashboard;
