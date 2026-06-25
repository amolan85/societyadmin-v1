// ─── FlatLedger.jsx ─────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import { getFlatLedgerApi } from "../../services/BillingApi";
import { getAllMembersWithoutPaginationApi } from "../../services/AddMemberApi";
import { GetSessionData } from "../../utils/SessionManagement";
import "../../styles/Billing.css";

const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

export const FlatLedger = ({ setActive }) => {
    const [societyId, setSocietyId]   = useState("");
    const [flatId, setFlatId]         = useState("");
    const [fromYear, setFromYear]     = useState(new Date().getFullYear());
    const [toYear, setToYear]         = useState(new Date().getFullYear());
    const [flatInfo, setFlatInfo]     = useState(null);
    const [openingBal, setOpeningBal] = useState(null);
    const [bills, setBills]           = useState([]);
    const [receipts, setReceipts]     = useState([]);
    const [allMembers, setAllMembers] = useState([]);

    useEffect(() => {
        const s = GetSessionData();
        if (s?.society_id) {
            setSocietyId(s.society_id);
            fetchMembers(s.society_id);
        }
    }, []);

    const fetchMembers = async (sId) => {
        try {
            const res = await getAllMembersWithoutPaginationApi(sId, "", "", "", "", null);
            setAllMembers(res?.members || res || []);
        } catch (_) {}
    };

    const fetchLedger = async () => {
        if (!flatId) { toast.error("Please select a flat"); return; }
        try {
            const res = await getFlatLedgerApi(parseInt(flatId), fromYear || null, toYear || null);
            setFlatInfo(res);
            setOpeningBal(res?.opening_balance || null);
            setBills(res?.bills || []);
            setReceipts(res?.receipts || []);
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to load ledger");
        }
    };

    const flatOptions = [];
    const seen = new Set();
    allMembers.forEach((m) => {
        if (m.flat_id && !seen.has(m.flat_id)) {
            seen.add(m.flat_id);
            flatOptions.push({ flat_id: m.flat_id, flat_number: m.flat_number, block: m.block });
        }
    });

    const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

    const totalBilled    = bills.reduce((s, b) => s + parseFloat(b.total_amount   || 0), 0);
    const totalPaid      = bills.reduce((s, b) => s + parseFloat(b.paid_amount    || 0), 0);
    const totalBalance   = bills.reduce((s, b) => s + parseFloat(b.balance_principal || 0) + parseFloat(b.balance_interest || 0), 0);

    return (
        <div className="pg" style={{ padding: "20px 24px" }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 style={{ fontWeight: 700, margin: 0 }}>📒 Flat Ledger</h4>
                    <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>Full billing statement for a flat</p>
                </div>
                <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>
                    ← Dashboard
                </button>
            </div>

            {/* Search Bar */}
            <div className="billing-card mb-3">
                <div className="d-flex gap-3 align-items-end flex-wrap">
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <label className="billing-form-label">Select Flat *</label>
                        <select className="billing-form-input" value={flatId}
                            onChange={(e) => setFlatId(e.target.value)}>
                            <option value="">Select Flat</option>
                            {flatOptions.map((f) => (
                                <option key={f.flat_id} value={f.flat_id}>
                                    {f.flat_number} {f.block ? `/ ${f.block}` : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="billing-form-label">From Year</label>
                        <select className="billing-form-input" style={{ width: 100 }}
                            value={fromYear} onChange={(e) => setFromYear(e.target.value)}>
                            {years.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="billing-form-label">To Year</label>
                        <select className="billing-form-input" style={{ width: 100 }}
                            value={toYear} onChange={(e) => setToYear(e.target.value)}>
                            {years.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <button className="billing-btn billing-btn-primary" onClick={fetchLedger}>
                        <FiSearch /> View Ledger
                    </button>
                </div>
            </div>

            {flatInfo && (
                <>
                    {/* Flat Info Header */}
                    <div className="bill-detail-header mb-3">
                        <div className="d-flex justify-content-between">
                            <div>
                                <div style={{ fontSize: 20, fontWeight: 800 }}>
                                    Flat {flatInfo.flat_number} {flatInfo.block ? `/ ${flatInfo.block}` : ""}
                                </div>
                                <div style={{ opacity: 0.85, fontSize: 13 }}>
                                    👤 {flatInfo.owner_name || "—"} · {flatInfo.owner_mobile || ""}
                                </div>
                            </div>
                            <div className="text-end">
                                <div style={{ fontSize: 12, opacity: 0.8 }}>Balance Outstanding</div>
                                <div style={{ fontSize: 24, fontWeight: 800 }}>{fmt(totalBalance)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="d-flex gap-3 mb-3 flex-wrap">
                        {[
                            { label: "Opening Arrears", val: fmt((parseFloat(openingBal?.principal || 0) + parseFloat(openingBal?.interest || 0))), color: "#7c3aed" },
                            { label: "Total Billed",    val: fmt(totalBilled),   color: "#2563eb" },
                            { label: "Total Paid",      val: fmt(totalPaid),     color: "#059669" },
                            { label: "Balance Due",     val: fmt(totalBalance),  color: "#dc2626" },
                        ].map((s) => (
                            <div key={s.label} style={{
                                background: "#fff", border: "1px solid #e5e7eb",
                                borderRadius: 10, padding: "10px 18px", flex: 1, minWidth: 130
                            }}>
                                <div style={{ fontSize: 11, color: "#6b7280" }}>{s.label}</div>
                                <div style={{ fontWeight: 700, color: s.color, fontSize: 16 }}>{s.val}</div>
                            </div>
                        ))}
                    </div>

                    {/* Opening Balance */}
                    {openingBal && (
                        <div className="billing-card mb-3">
                            <div className="billing-card-title">📂 Opening Balance (Arrears)</div>
                            <div className="d-flex gap-4" style={{ fontSize: 14 }}>
                                <span>As of: <strong>{openingBal.as_of_date}</strong></span>
                                <span>Principal: <strong className="amount-display">{fmt(openingBal.principal)}</strong></span>
                                <span>Interest: <strong className="amount-display amount-red">{fmt(openingBal.interest)}</strong></span>
                                <span>Total: <strong className="amount-display">{fmt(openingBal.total)}</strong></span>
                            </div>
                            {openingBal.remarks && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>{openingBal.remarks}</div>}
                        </div>
                    )}

                    <div className="row g-3">
                        {/* Bills */}
                        <div className="col-12 col-lg-7">
                            <div className="billing-card">
                                <div className="billing-card-title">📄 Bills ({bills.length})</div>
                                <div style={{ overflowX: "auto" }}>
                                    <table className="billing-table">
                                        <thead>
                                            <tr>
                                                <th>Bill No</th>
                                                <th>Month / Year</th>
                                                <th className="text-end">Total</th>
                                                <th className="text-end">Paid</th>
                                                <th className="text-end">Balance</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bills.map((b) => (
                                                <tr key={b.bill_id}>
                                                    <td style={{ fontSize: 12, fontWeight: 600, color: "#2563eb" }}>{b.bill_no}</td>
                                                    <td style={{ fontWeight: 600 }}>{b.bill_month} {b.bill_year}</td>
                                                    <td className="text-end amount-display">{fmt(b.total_amount)}</td>
                                                    <td className="text-end amount-green">{fmt(b.paid_amount)}</td>
                                                    <td className="text-end amount-red">
                                                        {fmt(parseFloat(b.balance_principal || 0) + parseFloat(b.balance_interest || 0))}
                                                    </td>
                                                    <td>
                                                        <span className={`bill-badge ${b.is_overdue ? "overdue" : b.status}`}>
                                                            {b.is_overdue ? "Overdue" : b.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Receipts */}
                        <div className="col-12 col-lg-5">
                            <div className="billing-card">
                                <div className="billing-card-title">💳 Receipts ({receipts.length})</div>
                                <div style={{ overflowX: "auto" }}>
                                    <table className="billing-table">
                                        <thead>
                                            <tr>
                                                <th>Receipt No</th>
                                                <th>Date</th>
                                                <th>Mode</th>
                                                <th className="text-end">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {receipts.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} style={{ textAlign: "center", color: "#9ca3af", padding: 20 }}>
                                                        No receipts
                                                    </td>
                                                </tr>
                                            ) : receipts.map((r) => (
                                                <tr key={r.receipt_id}>
                                                    <td style={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>{r.receipt_no}</td>
                                                    <td style={{ fontSize: 12 }}>{r.receipt_date}</td>
                                                    <td style={{ fontSize: 11 }}>{r.payment_mode?.toUpperCase()}</td>
                                                    <td className="text-end amount-green">{fmt(r.total_amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// ─── BillingSettings.jsx ────────────────────────────────────────────────────
export const BillingSettings = ({ setActive }) => {
    const [form, setForm] = useState({
        financial_year: "2024-2025",
        fy_start_date: "2024-04-01",
        fy_end_date: "2025-03-31",
        interest_rate: 0.18,
        interest_type: "S",
        due_day: 25,
        roundoff: 1,
        startup_month: "April",
        startup_bill_no: 1,
        bill_type: "Advance",
        notes: "",
        additional_notes: ""
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        try {
            const { getBillingSettingsApi } = await import("../../services/BillingApi");
            const res = await getBillingSettingsApi();
            if (res) setForm({ ...form, ...res });
        } catch (_) {}
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { upsertBillingSettingsApi } = await import("../../services/BillingApi");
            const { toast } = await import("react-toastify");
            await upsertBillingSettingsApi(form);
            toast.success("Billing settings saved");
        } catch (e) {
            const { toast } = await import("react-toastify");
            toast.error(typeof e === "string" ? e : "Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    return (
        <div className="pg" style={{ padding: "20px 24px" }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 style={{ fontWeight: 700, margin: 0 }}>⚙️ Billing Settings</h4>
                    <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>Configure interest rates, due dates and financial year</p>
                </div>
                <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>← Dashboard</button>
            </div>

            <div className="row g-3">
                <div className="col-12 col-lg-8">
                    <div className="billing-card">
                        <div className="billing-card-title">Financial Year & Interest</div>
                        <div className="row g-3">
                            <div className="col-4">
                                <label className="billing-form-label">Financial Year</label>
                                <input type="text" className="billing-form-input" value={form.financial_year}
                                    onChange={(e) => setForm({ ...form, financial_year: e.target.value })}
                                    placeholder="2024-2025" />
                            </div>
                            <div className="col-4">
                                <label className="billing-form-label">FY Start Date</label>
                                <input type="date" className="billing-form-input" value={form.fy_start_date}
                                    onChange={(e) => setForm({ ...form, fy_start_date: e.target.value })} />
                            </div>
                            <div className="col-4">
                                <label className="billing-form-label">FY End Date</label>
                                <input type="date" className="billing-form-input" value={form.fy_end_date}
                                    onChange={(e) => setForm({ ...form, fy_end_date: e.target.value })} />
                            </div>
                            <div className="col-3">
                                <label className="billing-form-label">Interest Rate (p.a.)</label>
                                <input type="number" className="billing-form-input" step="0.01" min="0" max="1"
                                    value={form.interest_rate}
                                    onChange={(e) => setForm({ ...form, interest_rate: parseFloat(e.target.value) })} />
                                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                                    = {(parseFloat(form.interest_rate || 0) * 100).toFixed(0)}% p.a.
                                </div>
                            </div>
                            <div className="col-3">
                                <label className="billing-form-label">Interest Type</label>
                                <select className="billing-form-input" value={form.interest_type}
                                    onChange={(e) => setForm({ ...form, interest_type: e.target.value })}>
                                    <option value="S">Simple (S)</option>
                                    <option value="C">Compound (C)</option>
                                </select>
                            </div>
                            <div className="col-3">
                                <label className="billing-form-label">Due Day of Month</label>
                                <input type="number" className="billing-form-input" min="1" max="31"
                                    value={form.due_day}
                                    onChange={(e) => setForm({ ...form, due_day: parseInt(e.target.value) })} />
                            </div>
                            <div className="col-3">
                                <label className="billing-form-label">Round Off</label>
                                <select className="billing-form-input" value={form.roundoff}
                                    onChange={(e) => setForm({ ...form, roundoff: parseInt(e.target.value) })}>
                                    <option value={1}>Yes — Round to nearest ₹</option>
                                    <option value={0}>No — Keep decimals</option>
                                </select>
                            </div>
                            <div className="col-4">
                                <label className="billing-form-label">Startup Month</label>
                                <select className="billing-form-input" value={form.startup_month}
                                    onChange={(e) => setForm({ ...form, startup_month: e.target.value })}>
                                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div className="col-4">
                                <label className="billing-form-label">Starting Bill No</label>
                                <input type="number" className="billing-form-input" min="1"
                                    value={form.startup_bill_no}
                                    onChange={(e) => setForm({ ...form, startup_bill_no: parseInt(e.target.value) })} />
                            </div>
                            <div className="col-4">
                                <label className="billing-form-label">Bill Type</label>
                                <select className="billing-form-input" value={form.bill_type}
                                    onChange={(e) => setForm({ ...form, bill_type: e.target.value })}>
                                    <option value="Advance">Advance</option>
                                    <option value="Arrear">Arrear</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="billing-form-label">Notes (printed on bill)</label>
                                <textarea className="billing-form-input" rows={3}
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    placeholder="1. All payments by cheque/Bank Transfer only." />
                            </div>
                            <div className="col-12">
                                <label className="billing-form-label">Additional Notes</label>
                                <textarea className="billing-form-input" rows={2}
                                    value={form.additional_notes}
                                    onChange={(e) => setForm({ ...form, additional_notes: e.target.value })} />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                            <button className="billing-btn billing-btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? "Saving..." : "Save Settings"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="col-12 col-lg-4">
                    <div className="billing-card">
                        <div className="billing-card-title">ℹ️ Settings Guide</div>
                        {[
                            { label: "Interest Rate", val: `${(parseFloat(form.interest_rate || 0) * 100).toFixed(0)}% p.a. = ${((parseFloat(form.interest_rate || 0) / 12) * 100).toFixed(2)}% / month` },
                            { label: "Interest Type", val: form.interest_type === "S" ? "Simple — on principal only" : "Compound — on principal + unpaid interest" },
                            { label: "Due Day", val: `Bills due on ${form.due_day}th of each month` },
                            { label: "Bill Type", val: form.bill_type === "Advance" ? "Advance — Bill raised before the month" : "Arrear — Bill raised after the month" },
                        ].map((item) => (
                            <div key={item.label} style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{item.label}</div>
                                <div style={{ fontSize: 12, color: "#6b7280" }}>{item.val}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── OpeningBalance.jsx ──────────────────────────────────────────────────────
export const OpeningBalance = ({ setActive }) => {
    const [allMembers, setAllMembers] = useState([]);
    const [societyId, setSocietyId]  = useState("");
    const [form, setForm]            = useState({
        flat_id: "", as_of_date: "2024-04-01",
        principal: "", interest: "", remarks: ""
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const s = GetSessionData();
        if (s?.society_id) {
            setSocietyId(s.society_id);
            getAllMembersWithoutPaginationApi(s.society_id, "", "", "", "", null)
                .then((res) => setAllMembers(res?.members || res || []))
                .catch(() => {});
        }
    }, []);

    const flatOptions = [];
    const seen = new Set();
    allMembers.forEach((m) => {
        if (m.flat_id && !seen.has(m.flat_id)) {
            seen.add(m.flat_id);
            flatOptions.push({ flat_id: m.flat_id, flat_number: m.flat_number, block: m.block });
        }
    });

    const handleSave = async () => {
        if (!form.flat_id || !form.as_of_date) { toast.error("Flat and date are required"); return; }
        setSaving(true);
        try {
            const { setOpeningBalanceApi } = await import("../../services/BillingApi");
            const { toast } = await import("react-toastify");
            await setOpeningBalanceApi({
                flat_id:    parseInt(form.flat_id),
                as_of_date: form.as_of_date,
                principal:  parseFloat(form.principal || 0),
                interest:   parseFloat(form.interest  || 0),
                remarks:    form.remarks || null,
            });
            toast.success("Opening balance saved");
            setForm({ ...form, flat_id: "", principal: "", interest: "", remarks: "" });
        } catch (e) {
            const { toast } = await import("react-toastify");
            toast.error(typeof e === "string" ? e : "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="pg" style={{ padding: "20px 24px" }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 style={{ fontWeight: 700, margin: 0 }}>📂 Opening Balances</h4>
                    <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>Set arrears carried forward for each flat</p>
                </div>
                <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>← Dashboard</button>
            </div>

            <div className="row g-3">
                <div className="col-12 col-lg-6">
                    <div className="billing-card">
                        <div className="billing-card-title">Set Opening Balance</div>
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="billing-form-label">Flat *</label>
                                <select className="billing-form-input" value={form.flat_id}
                                    onChange={(e) => setForm({ ...form, flat_id: e.target.value })}>
                                    <option value="">Select Flat</option>
                                    {flatOptions.map((f) => (
                                        <option key={f.flat_id} value={f.flat_id}>
                                            {f.flat_number} {f.block ? `/ ${f.block}` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="billing-form-label">As of Date *</label>
                                <input type="date" className="billing-form-input" value={form.as_of_date}
                                    onChange={(e) => setForm({ ...form, as_of_date: e.target.value })} />
                            </div>
                            <div className="col-6">
                                <label className="billing-form-label">Principal Arrears (₹)</label>
                                <input type="number" className="billing-form-input" min="0" step="0.01"
                                    value={form.principal}
                                    onChange={(e) => setForm({ ...form, principal: e.target.value })}
                                    placeholder="14300.00" />
                            </div>
                            <div className="col-6">
                                <label className="billing-form-label">Interest Arrears (₹)</label>
                                <input type="number" className="billing-form-input" min="0" step="0.01"
                                    value={form.interest}
                                    onChange={(e) => setForm({ ...form, interest: e.target.value })}
                                    placeholder="3566.50" />
                            </div>
                            {(form.principal || form.interest) && (
                                <div className="col-12">
                                    <div style={{
                                        background: "#f0fdf4", border: "1px solid #bbf7d0",
                                        borderRadius: 8, padding: "10px 14px",
                                        display: "flex", justifyContent: "space-between",
                                        fontSize: 13, fontWeight: 600
                                    }}>
                                        <span>Total Opening Balance</span>
                                        <span style={{ color: "#059669" }}>
                                            {fmt(parseFloat(form.principal || 0) + parseFloat(form.interest || 0))}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div className="col-12">
                                <label className="billing-form-label">Remarks</label>
                                <input type="text" className="billing-form-input"
                                    value={form.remarks}
                                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                                    placeholder="Opening arrears as on April 2024" />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                            <button className="billing-btn billing-btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? "Saving..." : "Save Opening Balance"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="billing-card">
                        <div className="billing-card-title">ℹ️ About Opening Balances</div>
                        <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
                            <p>Opening balance represents <strong>arrears carried forward</strong> from before the system start date.</p>
                            <p><strong>Principal</strong> — unpaid maintenance amount outstanding</p>
                            <p><strong>Interest</strong> — interest already accrued on those arrears</p>
                            <p>These will be picked up when generating the <strong>first bill</strong> for the flat.</p>
                            <p style={{ color: "#dc2626" }}>
                                ⚠️ Set this <em>before</em> generating any bills for the flat.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// // Need this for OpeningBalance component
// import { getAllMembersWithoutPaginationApi } from "../../services/AddMemberApi";
// import { GetSessionData } from "../../utils/SessionManagement";
