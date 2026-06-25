import { useState, useEffect } from "react";
import { GetSessionData } from "../../utils/SessionManagement";
import { toast } from "react-toastify";
import { FiSearch, FiEye, FiDollarSign, FiPlus } from "react-icons/fi";
import { Pagination } from "../../components/Common/ReusableFunction";
import { listBillsApi, generateBillApi, recordPaymentApi } from "../../services/BillingApi";
import { getAllMembersWithoutPaginationApi } from "../../services/AddMemberApi";
import "../../styles/Billing.css";

const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

const StatusBadge = ({ status, dueDate }) => {
    const overdue = dueDate && new Date(dueDate) < new Date() && status !== "paid";
    const s = overdue ? "overdue" : status;
    const labels = { paid: "Paid", unpaid: "Unpaid", partial: "Partial", overdue: "Overdue" };
    return <span className={`bill-badge ${s}`}>{labels[s] || s}</span>;
};

const BillsList = ({ setActive, setBillId }) => {
    const [societyId, setSocietyId] = useState("");
    const [bills, setBills]         = useState([]);
    const [summary, setSummary]     = useState({});
    const [page, setPage]           = useState(1);
    const [pageSize]                = useState(10);
    const [total, setTotal]         = useState(0);

    // Filters
    const [filterStatus, setFilterStatus]   = useState("");
    const [filterMonth, setFilterMonth]     = useState("");
    const [filterYear, setFilterYear]       = useState("");
    const [overdueOnly, setOverdueOnly]     = useState(false);

    // Generate Bill Modal
    const [showGenModal, setShowGenModal]   = useState(false);
    const [genForm, setGenForm]             = useState({
        flat_id: "", bill_month: "", bill_year: new Date().getFullYear(),
        bill_date: "", due_date: ""
    });
    const [genLoading, setGenLoading]       = useState(false);

    // Pay Modal
    const [showPayModal, setShowPayModal]   = useState(false);
    const [payBill, setPayBill]             = useState(null);
    const [payForm, setPayForm]             = useState({
        principal_amount: "", interest_amount: "",
        payment_mode: "bank", bank_name: "", branch: "",
        cheque_no: "", transaction_ref: "", narration: ""
    });
    const [payLoading, setPayLoading]       = useState(false);

    // Members for dropdown
    const [allMembers, setAllMembers]       = useState([]);

    useEffect(() => {
        const s = GetSessionData();
        if (s?.society_id) {
            setSocietyId(s.society_id);
            fetchMembers(s.society_id);
        }
    }, []);

    useEffect(() => { if (societyId) fetchBills(); }, [societyId, page, filterStatus, filterMonth, filterYear, overdueOnly]);

    const fetchBills = async () => {
        try {
            const res = await listBillsApi({
                status: filterStatus, billMonth: filterMonth,
                billYear: filterYear ? parseInt(filterYear) : null,
                overdueOnly: overdueOnly ? 1 : 0,
                page, pageSize
            });
            setBills(res?.bills || []);
            setSummary(res?.summary || {});
            setTotal(res?.pagination?.total || 0);
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to load bills");
        }
    };

    const fetchMembers = async (sId) => {
        try {
            const res = await getAllMembersWithoutPaginationApi(sId, "", "", "", "", null);
            setAllMembers(res?.members || res || []);
        } catch (_) {}
    };

    const handleGenerate = async () => {
        if (!genForm.flat_id || !genForm.bill_month || !genForm.bill_year) {
            toast.error("Flat, Month and Year are required");
            return;
        }
        setGenLoading(true);
        try {
            await generateBillApi({
                flat_id: parseInt(genForm.flat_id),
                bill_month: genForm.bill_month,
                bill_year: parseInt(genForm.bill_year),
                bill_date: genForm.bill_date || null,
                due_date:  genForm.due_date  || null,
            });
            toast.success("Bill generated successfully");
            setShowGenModal(false);
            fetchBills();
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to generate bill");
        } finally {
            setGenLoading(false);
        }
    };

    const openPayModal = (bill) => {
        setPayBill(bill);
        setPayForm({
            principal_amount: (parseFloat(bill.balance_principal || 0)).toFixed(2),
            interest_amount:  (parseFloat(bill.balance_interest  || 0)).toFixed(2),
            payment_mode: "bank", bank_name: "", branch: "",
            cheque_no: "", transaction_ref: "", narration: ""
        });
        setShowPayModal(true);
    };

    const handlePay = async () => {
        if (!payForm.payment_mode) { toast.error("Payment mode is required"); return; }
        const total = parseFloat(payForm.principal_amount || 0) + parseFloat(payForm.interest_amount || 0);
        if (total <= 0) { toast.error("Amount must be greater than 0"); return; }

        setPayLoading(true);
        try {
            await recordPaymentApi({
                flat_id:           payBill.flat_id,
                bill_id:           payBill.bill_id,
                bill_month:        payBill.bill_month,
                bill_year:         payBill.bill_year,
                receipt_date:      new Date().toISOString().split("T")[0],
                principal_amount:  parseFloat(payForm.principal_amount || 0),
                interest_amount:   parseFloat(payForm.interest_amount  || 0),
                payment_mode:      payForm.payment_mode,
                bank_name:         payForm.bank_name         || null,
                branch:            payForm.branch             || null,
                cheque_no:         payForm.cheque_no          || null,
                transaction_ref:   payForm.transaction_ref    || null,
                narration:         payForm.narration           || null,
            });
            toast.success("Payment recorded successfully");
            setShowPayModal(false);
            fetchBills();
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to record payment");
        } finally {
            setPayLoading(false);
        }
    };

    const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

    // Unique flats from members
    const flatOptions = [];
    const seen = new Set();
    allMembers.forEach((m) => {
        if (m.flat_id && !seen.has(m.flat_id)) {
            seen.add(m.flat_id);
            flatOptions.push({ flat_id: m.flat_id, flat_number: m.flat_number, block: m.block });
        }
    });

    return (
        <div className="pg" style={{ padding: "20px 24px" }}>

            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                    <h4 style={{ fontWeight: 700, color: "#111827", margin: 0 }}>📄 Bills</h4>
                    <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
                        {total} bills · Outstanding {fmt(summary.total_outstanding)}
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>
                        ← Dashboard
                    </button>
                    <button className="billing-btn billing-btn-primary" onClick={() => setShowGenModal(true)}>
                        <FiPlus /> Generate Bill
                    </button>
                </div>
            </div>

            {/* Summary mini cards */}
            <div className="d-flex gap-3 mb-3 flex-wrap">
                {[
                    { label: "Billed",    val: fmt(summary.total_billed),      color: "#2563eb" },
                    { label: "Collected", val: fmt(summary.total_collected),    color: "#059669" },
                    { label: "Pending",   val: `${summary.pending_count || 0}`, color: "#d97706" },
                    { label: "Overdue",   val: `${summary.overdue_count || 0}`, color: "#dc2626" },
                ].map((s) => (
                    <div key={s.label} style={{
                        background: "#fff", border: "1px solid #e5e7eb",
                        borderRadius: 10, padding: "10px 18px"
                    }}>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>{s.label}</div>
                        <div style={{ fontWeight: 700, color: s.color, fontSize: 15 }}>{s.val}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="billing-toolbar">
                <select
                    className="billing-form-input"
                    style={{ width: 130 }}
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                >
                    <option value="">All Status</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                </select>
                <select
                    className="billing-form-input"
                    style={{ width: 140 }}
                    value={filterMonth}
                    onChange={(e) => { setFilterMonth(e.target.value); setPage(1); }}
                >
                    <option value="">All Months</option>
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <select
                    className="billing-form-input"
                    style={{ width: 100 }}
                    value={filterYear}
                    onChange={(e) => { setFilterYear(e.target.value); setPage(1); }}
                >
                    <option value="">All Years</option>
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <label className="d-flex align-items-center gap-2" style={{ fontSize: 13, cursor: "pointer" }}>
                    <input
                        type="checkbox" checked={overdueOnly}
                        onChange={(e) => { setOverdueOnly(e.target.checked); setPage(1); }}
                    />
                    Overdue only
                </label>
                <button className="billing-btn billing-btn-outline billing-btn-sm" onClick={() => {
                    setFilterStatus(""); setFilterMonth(""); setFilterYear(""); setOverdueOnly(false); setPage(1);
                }}>
                    Clear
                </button>
            </div>

            {/* Table */}
            <div className="billing-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                    <table className="billing-table">
                        <thead>
                            <tr>
                                <th>Bill No</th>
                                <th>Flat</th>
                                <th>Owner</th>
                                <th>Month / Year</th>
                                <th>Due Date</th>
                                <th className="text-end">Opening</th>
                                <th className="text-end">Charges</th>
                                <th className="text-end">Interest</th>
                                <th className="text-end">Total</th>
                                <th className="text-end">Paid</th>
                                <th className="text-end">Balance</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.length === 0 ? (
                                <tr>
                                    <td colSpan={13} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
                                        No bills found
                                    </td>
                                </tr>
                            ) : bills.map((b) => (
                                <tr key={b.bill_id}>
                                    <td>
                                        <span style={{ fontWeight: 600, color: "#2563eb", fontSize: 12 }}>
                                            {b.bill_no}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600, fontSize: 13 }}>
                                            {b.flat_number}
                                            {b.block ? ` / ${b.block}` : ""}
                                        </div>
                                        <div style={{ fontSize: 11, color: "#6b7280" }}>{b.unit_type}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: 13 }}>{b.owner_name || "—"}</div>
                                        <div style={{ fontSize: 11, color: "#6b7280" }}>{b.owner_mobile || ""}</div>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{b.bill_month} {b.bill_year}</td>
                                    <td>
                                        <span style={{
                                            fontSize: 12,
                                            color: b.is_overdue ? "#dc2626" : "#374151",
                                            fontWeight: b.is_overdue ? 600 : 400
                                        }}>
                                            {b.due_date}
                                            {b.is_overdue ? ` (${b.overdue_days}d)` : ""}
                                        </span>
                                    </td>
                                    <td className="text-end amount-muted">{fmt(parseFloat(b.opening_principal||0) + parseFloat(b.opening_interest||0))}</td>
                                    <td className="text-end">{fmt(b.current_charges)}</td>
                                    <td className="text-end" style={{ color: "#dc2626" }}>{fmt(b.interest_charged)}</td>
                                    <td className="text-end amount-display">{fmt(b.total_amount)}</td>
                                    <td className="text-end amount-green">{fmt(b.paid_amount)}</td>
                                    <td className="text-end amount-red">{fmt(b.outstanding)}</td>
                                    <td>
                                        <StatusBadge status={b.status} dueDate={b.due_date} />
                                    </td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <button
                                                className="billing-btn billing-btn-outline billing-btn-sm"
                                                title="View Bill"
                                                onClick={() => { setBillId(b.bill_id); setActive("viewBill"); }}
                                            >
                                                <FiEye size={13} />
                                            </button>
                                            {b.status !== "paid" && (
                                                <button
                                                    className="billing-btn billing-btn-success billing-btn-sm"
                                                    title="Record Payment"
                                                    onClick={() => openPayModal(b)}
                                                >
                                                    <FiDollarSign size={13} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {total > pageSize && (
                    <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6" }}>
                        <Pagination
                            currentPage={page}
                            totalPages={Math.ceil(total / pageSize)}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>

            {/* ── Generate Bill Modal ── */}
            {showGenModal && (
                <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.4)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: 12, border: "none" }}>
                            <div className="billing-modal-header">
                                <span>➕ Generate Bill</span>
                                <button className="close-btn" onClick={() => setShowGenModal(false)}>×</button>
                            </div>
                            <div style={{ padding: 20 }}>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="billing-form-label">Flat *</label>
                                        <select
                                            className="billing-form-input"
                                            value={genForm.flat_id}
                                            onChange={(e) => setGenForm({ ...genForm, flat_id: e.target.value })}
                                        >
                                            <option value="">Select Flat</option>
                                            {flatOptions.map((f) => (
                                                <option key={f.flat_id} value={f.flat_id}>
                                                    {f.flat_number} {f.block ? `/ ${f.block}` : ""}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="billing-form-label">Month *</label>
                                        <select
                                            className="billing-form-input"
                                            value={genForm.bill_month}
                                            onChange={(e) => setGenForm({ ...genForm, bill_month: e.target.value })}
                                        >
                                            <option value="">Select Month</option>
                                            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="billing-form-label">Year *</label>
                                        <select
                                            className="billing-form-input"
                                            value={genForm.bill_year}
                                            onChange={(e) => setGenForm({ ...genForm, bill_year: e.target.value })}
                                        >
                                            {years.map((y) => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="billing-form-label">Bill Date</label>
                                        <input type="date" className="billing-form-input"
                                            value={genForm.bill_date}
                                            onChange={(e) => setGenForm({ ...genForm, bill_date: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="billing-form-label">Due Date</label>
                                        <input type="date" className="billing-form-input"
                                            value={genForm.due_date}
                                            onChange={(e) => setGenForm({ ...genForm, due_date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end gap-2 mt-3">
                                    <button className="billing-btn billing-btn-outline" onClick={() => setShowGenModal(false)}>Cancel</button>
                                    <button className="billing-btn billing-btn-primary" onClick={handleGenerate} disabled={genLoading}>
                                        {genLoading ? "Generating..." : "Generate"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Pay Modal ── */}
            {showPayModal && payBill && (
                <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.4)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content" style={{ borderRadius: 12, border: "none" }}>
                            <div className="billing-modal-header">
                                <span>💳 Record Payment — {payBill.flat_number} {payBill.bill_month} {payBill.bill_year}</span>
                                <button className="close-btn" onClick={() => setShowPayModal(false)}>×</button>
                            </div>
                            <div style={{ padding: 20 }}>
                                {/* Bill summary */}
                                <div style={{
                                    background: "#f9fafb", borderRadius: 8, padding: "12px 16px", marginBottom: 16
                                }}>
                                    <div className="d-flex justify-content-between" style={{ fontSize: 13 }}>
                                        <span>Total Bill</span>
                                        <span className="amount-display">{fmt(payBill.total_amount)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between" style={{ fontSize: 13 }}>
                                        <span>Already Paid</span>
                                        <span className="amount-green">{fmt(payBill.paid_amount)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between" style={{ fontSize: 13, fontWeight: 700, marginTop: 4, borderTop: "1px solid #e5e7eb", paddingTop: 4 }}>
                                        <span>Balance Due</span>
                                        <span className="amount-red">{fmt(payBill.outstanding)}</span>
                                    </div>
                                </div>

                                <div className="row g-3">
                                    <div className="col-6">
                                        <label className="billing-form-label">Principal Amount</label>
                                        <input type="number" className="billing-form-input" min="0" step="0.01"
                                            value={payForm.principal_amount}
                                            onChange={(e) => setPayForm({ ...payForm, principal_amount: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="billing-form-label">Interest Amount</label>
                                        <input type="number" className="billing-form-input" min="0" step="0.01"
                                            value={payForm.interest_amount}
                                            onChange={(e) => setPayForm({ ...payForm, interest_amount: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="billing-form-label">Payment Mode *</label>
                                        <select className="billing-form-input"
                                            value={payForm.payment_mode}
                                            onChange={(e) => setPayForm({ ...payForm, payment_mode: e.target.value })}
                                        >
                                            <option value="bank">Bank Transfer</option>
                                            <option value="cash">Cash</option>
                                            <option value="cheque">Cheque</option>
                                            <option value="upi">UPI</option>
                                            <option value="neft">NEFT</option>
                                            <option value="rtgs">RTGS</option>
                                        </select>
                                    </div>
                                    {["bank","neft","rtgs","cheque"].includes(payForm.payment_mode) && (
                                        <div className="col-6">
                                            <label className="billing-form-label">Bank Name</label>
                                            <input type="text" className="billing-form-input"
                                                value={payForm.bank_name}
                                                onChange={(e) => setPayForm({ ...payForm, bank_name: e.target.value })}
                                                placeholder="HDFC Bank"
                                            />
                                        </div>
                                    )}
                                    {payForm.payment_mode === "cheque" && (
                                        <div className="col-6">
                                            <label className="billing-form-label">Cheque No</label>
                                            <input type="text" className="billing-form-input"
                                                value={payForm.cheque_no}
                                                onChange={(e) => setPayForm({ ...payForm, cheque_no: e.target.value })}
                                            />
                                        </div>
                                    )}
                                    {["bank","upi","neft","rtgs"].includes(payForm.payment_mode) && (
                                        <div className="col-6">
                                            <label className="billing-form-label">Transaction Ref</label>
                                            <input type="text" className="billing-form-input"
                                                value={payForm.transaction_ref}
                                                onChange={(e) => setPayForm({ ...payForm, transaction_ref: e.target.value })}
                                            />
                                        </div>
                                    )}
                                    <div className="col-12">
                                        <label className="billing-form-label">Narration</label>
                                        <input type="text" className="billing-form-input"
                                            value={payForm.narration}
                                            onChange={(e) => setPayForm({ ...payForm, narration: e.target.value })}
                                            placeholder="e.g. Bank Transfer June 2024 maintenance"
                                        />
                                    </div>
                                </div>

                                {/* Total preview */}
                                <div style={{
                                    background: "#dbeafe", borderRadius: 8, padding: "10px 16px", marginTop: 12,
                                    display: "flex", justifyContent: "space-between", alignItems: "center"
                                }}>
                                    <span style={{ fontSize: 13, color: "#1e40af", fontWeight: 600 }}>Total Payment</span>
                                    <span style={{ fontSize: 16, fontWeight: 700, color: "#1e40af" }}>
                                        {fmt(parseFloat(payForm.principal_amount || 0) + parseFloat(payForm.interest_amount || 0))}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-3">
                                    <button className="billing-btn billing-btn-outline" onClick={() => setShowPayModal(false)}>Cancel</button>
                                    <button className="billing-btn billing-btn-success" onClick={handlePay} disabled={payLoading}>
                                        {payLoading ? "Processing..." : "Record Payment"}
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

export default BillsList;
