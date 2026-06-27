import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiEye, FiDollarSign, FiPlus, FiRefreshCw, FiRotateCcw, FiCalendar } from "react-icons/fi";
import { Pagination } from "../../components/Common/ReusableFunction";
import {
    listBillsApi, generateBillApi, regenerateBillApi,
    recordPaymentApi, applyWalletToBillApi,
    generateYearlyBillsApi,
} from "../../services/BillingApi";
import { getAllMembersWithoutPaginationApi } from "../../services/AddMemberApi";
import { GetSessionData } from "../../utils/SessionManagement";
import "../../styles/Billing.css";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const fmt    = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
const years  = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

const getSessionSocietyId = () => {
    const s = GetSessionData();
    return s?.data?.flats?.[0]?.society_id || null;
};

const StatusBadge = ({ status, isOverdue }) => {
    const s = isOverdue && status !== "paid" ? "overdue" : status;
    const labels = { paid:"Paid", unpaid:"Unpaid", partial:"Partial", overdue:"Overdue", cancelled:"Cancelled" };
    return <span className={`bill-badge ${s}`}>{labels[s] || s}</span>;
};

// ── Pay Modal ─────────────────────────────────────────────────────────────────
const PayModal = ({ bill, onClose, onSuccess }) => {
    const billBalance = parseFloat(bill.balance_principal || 0) + parseFloat(bill.balance_interest || 0);

    const [walletBalance, setWalletBalance] = useState(0);
    const [walletLoading, setWalletLoading] = useState(true);
    const [useWallet,     setUseWallet]     = useState(false);
    const [loading,       setLoading]       = useState(false);

    // Payment form — only shown when cash/bank needed
    const [payForm, setPayForm] = useState({
        payment_mode:   "bank",
        bank_name:      "",
        transaction_ref:"",
        cheque_no:      "",
        narration:      "",
    });

    // Fetch wallet balance on open
    useEffect(() => {
        const load = async () => {
            try {
                const { getWalletDetailsApi } = await import("../../services/BillingApi");
                const res = await getWalletDetailsApi(bill.flat_id);
                const bal = parseFloat(res?.wallet?.balance || 0);
                setWalletBalance(bal);
                if (bal > 0) setUseWallet(true); // auto-check if wallet has balance
            } catch (_) {}
            finally { setWalletLoading(false); }
        };
        load();
    }, [bill.flat_id]);

    // Calculated amounts
    const walletDeduct    = useWallet ? Math.min(walletBalance, billBalance) : 0;
    const remainingAmount = Math.max(0, billBalance - walletDeduct);
    const willBePaid      = remainingAmount <= 0;

    const showBank   = ["bank","neft","rtgs","cheque"].includes(payForm.payment_mode);
    const showCheque = payForm.payment_mode === "cheque";
    const showTxn    = ["bank","upi","neft","rtgs"].includes(payForm.payment_mode);

    const handlePay = async () => {
        if (!willBePaid && remainingAmount > 0 && !payForm.payment_mode) {
            toast.error("Select payment mode for remaining amount");
            return;
        }
        setLoading(true);
        try {
            // Step 1: Apply wallet if selected
            if (useWallet && walletDeduct > 0) {
                await applyWalletToBillApi(bill.bill_id, walletDeduct);
                if (willBePaid) {
                    toast.success(`Bill fully paid from wallet ₹${walletDeduct.toFixed(2)}`);
                } else {
                    toast.success(`Wallet ₹${walletDeduct.toFixed(2)} applied`);
                }
            }

            // Step 2: Record remaining cash/bank payment if needed
            if (remainingAmount > 0) {
                await recordPaymentApi({
                    flat_id:          bill.flat_id,
                    bill_id:          bill.bill_id,
                    bill_month:       bill.bill_month,
                    bill_year:        bill.bill_year,
                    receipt_date:     new Date().toISOString().split("T")[0],
                    principal_amount: Math.min(remainingAmount, parseFloat(bill.balance_principal || 0)),
                    interest_amount:  Math.max(0, remainingAmount - parseFloat(bill.balance_principal || 0)),
                    payment_mode:     payForm.payment_mode,
                    bank_name:        payForm.bank_name        || null,
                    transaction_ref:  payForm.transaction_ref  || null,
                    cheque_no:        payForm.cheque_no        || null,
                    narration:        payForm.narration        || null,
                });
                toast.success("Payment recorded successfully");
            }

            onSuccess();
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.45)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content" style={{ borderRadius: 12, border: "none" }}>
                    <div className="billing-modal-header">
                        <span>💳 Record Payment — {bill.flat_number}{bill.block ? ` / ${bill.block}` : ""} · {bill.bill_month} {bill.bill_year}</span>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                    <div style={{ padding: 20 }}>

                        {/* ── Bill summary ── */}
                        <div style={{ background: "#f9fafb", borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
                            <div className="d-flex justify-content-between mb-1" style={{ fontSize: 13 }}>
                                <span style={{ color: "#6b7280" }}>Total Bill</span>
                                <span style={{ fontWeight: 600 }}>{fmt(bill.total_amount)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-1" style={{ fontSize: 13 }}>
                                <span style={{ color: "#6b7280" }}>Already Paid</span>
                                <span style={{ color: "#059669", fontWeight: 600 }}>{fmt(bill.paid_amount)}</span>
                            </div>
                            <div className="d-flex justify-content-between" style={{
                                fontSize: 15, fontWeight: 700,
                                borderTop: "1px solid #e5e7eb", paddingTop: 8, marginTop: 4
                            }}>
                                <span>Balance Due</span>
                                <span style={{ color: "#dc2626" }}>{fmt(billBalance)}</span>
                            </div>
                        </div>

                        {/* ── Wallet section ── */}
                        <div style={{
                            background: useWallet && walletDeduct > 0 ? "#f0fdf4" : "#f5f3ff",
                            border: `1px solid ${useWallet && walletDeduct > 0 ? "#86efac" : "#ddd6fe"}`,
                            borderRadius: 8, padding: "12px 16px", marginBottom: 16
                        }}>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="d-flex align-items-center gap-2"
                                    style={{ cursor: walletBalance > 0 ? "pointer" : "default",
                                             fontWeight: 600, fontSize: 13,
                                             color: walletBalance > 0 ? "#7c3aed" : "#9ca3af" }}>
                                    <input type="checkbox"
                                        checked={useWallet}
                                        disabled={walletBalance <= 0 || walletLoading}
                                        onChange={(e) => setUseWallet(e.target.checked)} />
                                    💜 Use Wallet Balance
                                </label>
                                <span style={{ fontSize: 13, fontWeight: 600,
                                               color: walletBalance > 0 ? "#7c3aed" : "#9ca3af" }}>
                                    {walletLoading ? "Loading..." : `Available: ${fmt(walletBalance)}`}
                                </span>
                            </div>

                            {!walletLoading && walletBalance <= 0 && (
                                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                                    No wallet balance. Credit wallet from Wallet Manager first.
                                </div>
                            )}

                            {useWallet && walletDeduct > 0 && (
                                <div style={{ marginTop: 10 }}>
                                    <div className="d-flex justify-content-between"
                                        style={{ fontSize: 13, padding: "6px 0",
                                                 borderTop: "1px solid #bbf7d0" }}>
                                        <span style={{ color: "#065f46" }}>💜 Wallet deduction</span>
                                        <span style={{ color: "#059669", fontWeight: 700 }}>- {fmt(walletDeduct)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between"
                                        style={{ fontSize: 14, fontWeight: 700, padding: "6px 0",
                                                 borderTop: "1px solid #bbf7d0" }}>
                                        <span>Remaining to Pay</span>
                                        <span style={{ color: remainingAmount > 0 ? "#dc2626" : "#059669" }}>
                                            {remainingAmount > 0 ? fmt(remainingAmount) : "₹0.00 — Fully Paid! ✅"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Cash/Bank payment section — only if remaining > 0 ── */}
                        {remainingAmount > 0 && (
                            <>
                                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10, fontWeight: 600 }}>
                                    {useWallet && walletDeduct > 0
                                        ? `Collect remaining ${fmt(remainingAmount)} via:`
                                        : "Payment details:"}
                                </div>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <label className="billing-form-label">Payment Mode *</label>
                                        <select className="billing-form-input"
                                            value={payForm.payment_mode}
                                            onChange={(e) => setPayForm({ ...payForm, payment_mode: e.target.value })}>
                                            <option value="bank">Bank Transfer</option>
                                            <option value="cash">Cash</option>
                                            <option value="cheque">Cheque</option>
                                            <option value="upi">UPI</option>
                                            <option value="neft">NEFT</option>
                                            <option value="rtgs">RTGS</option>
                                        </select>
                                    </div>
                                    {showBank && (
                                        <div className="col-6">
                                            <label className="billing-form-label">Bank Name</label>
                                            <input type="text" className="billing-form-input"
                                                value={payForm.bank_name}
                                                onChange={(e) => setPayForm({ ...payForm, bank_name: e.target.value })}
                                                placeholder="HDFC Bank" />
                                        </div>
                                    )}
                                    {showCheque && (
                                        <div className="col-6">
                                            <label className="billing-form-label">Cheque No</label>
                                            <input type="text" className="billing-form-input"
                                                value={payForm.cheque_no}
                                                onChange={(e) => setPayForm({ ...payForm, cheque_no: e.target.value })} />
                                        </div>
                                    )}
                                    {showTxn && (
                                        <div className="col-6">
                                            <label className="billing-form-label">Transaction Ref</label>
                                            <input type="text" className="billing-form-input"
                                                value={payForm.transaction_ref}
                                                onChange={(e) => setPayForm({ ...payForm, transaction_ref: e.target.value })} />
                                        </div>
                                    )}
                                    <div className="col-12">
                                        <label className="billing-form-label">Narration</label>
                                        <input type="text" className="billing-form-input"
                                            value={payForm.narration}
                                            onChange={(e) => setPayForm({ ...payForm, narration: e.target.value })}
                                            placeholder="e.g. March 2026 maintenance payment" />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── Total summary ── */}
                        <div style={{
                            background: willBePaid ? "#d1fae5" : "#dbeafe",
                            borderRadius: 8, padding: "12px 16px", marginTop: 16,
                            display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}>
                            <span style={{ fontWeight: 600, color: willBePaid ? "#065f46" : "#1e40af" }}>
                                {willBePaid ? "✅ Bill will be FULLY PAID" : "Amount Being Paid Now"}
                            </span>
                            <span style={{ fontSize: 16, fontWeight: 700,
                                           color: willBePaid ? "#059669" : "#1e40af" }}>
                                {willBePaid
                                    ? `${fmt(walletDeduct)} (from wallet)`
                                    : fmt(walletDeduct + remainingAmount)}
                            </span>
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button className="billing-btn billing-btn-outline" onClick={onClose}>Cancel</button>
                            <button
                                className="billing-btn billing-btn-success"
                                onClick={handlePay}
                                disabled={loading || walletLoading}
                                style={{ minWidth: 160 }}>
                                {loading
                                    ? "Processing..."
                                    : willBePaid
                                        ? "💜 Pay from Wallet"
                                        : remainingAmount < billBalance
                                            ? `💜 Wallet + Pay ${fmt(remainingAmount)}`
                                            : `Record Payment ${fmt(remainingAmount)}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// ── Generate Bill Modal ───────────────────────────────────────────────────────
const GenModal = ({ flatOptions, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        flat_id: "", bill_month: MONTHS[new Date().getMonth()],
        bill_year: new Date().getFullYear(), bill_date: "", due_date: "", apply_wallet: false
    });
    const [loading, setLoading] = useState(false);

    const handle = async () => {
        if (!form.flat_id) { toast.error("Select a flat"); return; }
        setLoading(true);
        try {
            await generateBillApi({
                flat_id: parseInt(form.flat_id), bill_month: form.bill_month,
                bill_year: parseInt(form.bill_year), bill_date: form.bill_date || null,
                due_date: form.due_date || null, apply_wallet: form.apply_wallet ? 1 : 0,
            });
            toast.success("Bill generated successfully");
            onSuccess();
        } catch (e) { toast.error(typeof e === "string" ? e : "Failed"); }
        finally { setLoading(false); }
    };

    return (
        <div className="modal show d-block" style={{ background:"rgba(0,0,0,0.4)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ borderRadius:12, border:"none" }}>
                    <div className="billing-modal-header">
                        <span>➕ Generate Bill</span>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                    <div style={{ padding:20 }}>
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="billing-form-label">Flat *</label>
                                <select className="billing-form-input" value={form.flat_id}
                                    onChange={(e) => setForm({...form, flat_id: e.target.value})}>
                                    <option value="">Select Flat</option>
                                    {flatOptions.map((f) => (
                                        <option key={f.flat_id} value={f.flat_id}>
                                            {f.flat_number}{f.block ? ` / ${f.block}` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="billing-form-label">Month *</label>
                                <select className="billing-form-input" value={form.bill_month}
                                    onChange={(e) => setForm({...form, bill_month: e.target.value})}>
                                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="billing-form-label">Year *</label>
                                <select className="billing-form-input" value={form.bill_year}
                                    onChange={(e) => setForm({...form, bill_year: e.target.value})}>
                                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="billing-form-label">Bill Date</label>
                                <input type="date" className="billing-form-input" value={form.bill_date}
                                    onChange={(e) => setForm({...form, bill_date: e.target.value})} />
                            </div>
                            <div className="col-6">
                                <label className="billing-form-label">Due Date</label>
                                <input type="date" className="billing-form-input" value={form.due_date}
                                    onChange={(e) => setForm({...form, due_date: e.target.value})} />
                            </div>
                            <div className="col-12">
                                <label className="d-flex align-items-center gap-2" style={{ cursor:"pointer", fontSize:13 }}>
                                    <input type="checkbox" checked={form.apply_wallet}
                                        onChange={(e) => setForm({...form, apply_wallet: e.target.checked})} />
                                    💜 Auto-deduct wallet balance
                                </label>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button className="billing-btn billing-btn-outline" onClick={onClose}>Cancel</button>
                            <button className="billing-btn billing-btn-primary" onClick={handle} disabled={loading}>
                                {loading ? "Generating..." : "Generate"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Yearly Bill Modal ─────────────────────────────────────────────────────────
const YearlyModal = ({ flatOptions, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        flat_id: "", start_month: MONTHS[new Date().getMonth()],
        start_year: new Date().getFullYear(), months_count: 12,
        apply_wallet: false, advance_discount: 0
    });
    const [loading, setLoading] = useState(false);

    const handle = async () => {
        setLoading(true);
        try {
            await generateYearlyBillsApi({
                flatId:           form.flat_id     ? parseInt(form.flat_id) : null,
                startMonth:       form.start_month,
                startYear:        parseInt(form.start_year),
                monthsCount:      parseInt(form.months_count),
                applyWallet:      form.apply_wallet,
                advanceDiscount:  parseFloat(form.advance_discount || 0),
            });
            toast.success(`Yearly billing initiated for ${form.months_count} months`);
            onSuccess();
        } catch (e) { toast.error(typeof e === "string" ? e : "Failed"); }
        finally { setLoading(false); }
    };

    return (
        <div className="modal show d-block" style={{ background:"rgba(0,0,0,0.4)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ borderRadius:12, border:"none" }}>
                    <div className="billing-modal-header" style={{ background:"#7c3aed" }}>
                        <span>📅 Yearly Bill Generation</span>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                    <div style={{ padding:20 }}>
                        <div style={{ background:"#f5f3ff", border:"1px solid #ddd6fe", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:12, color:"#6d28d9" }}>
                            Generate bills for multiple consecutive months at once. Leave flat blank to generate for all flats.
                        </div>
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="billing-form-label">Flat (leave blank for all flats)</label>
                                <select className="billing-form-input" value={form.flat_id}
                                    onChange={(e) => setForm({...form, flat_id: e.target.value})}>
                                    <option value="">All Flats</option>
                                    {flatOptions.map((f) => (
                                        <option key={f.flat_id} value={f.flat_id}>
                                            {f.flat_number}{f.block ? ` / ${f.block}` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="billing-form-label">Start Month *</label>
                                <select className="billing-form-input" value={form.start_month}
                                    onChange={(e) => setForm({...form, start_month: e.target.value})}>
                                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="billing-form-label">Start Year *</label>
                                <select className="billing-form-input" value={form.start_year}
                                    onChange={(e) => setForm({...form, start_year: e.target.value})}>
                                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="billing-form-label">Number of Months</label>
                                <select className="billing-form-input" value={form.months_count}
                                    onChange={(e) => setForm({...form, months_count: e.target.value})}>
                                    {[1,2,3,4,5,6,7,8,9,10,11,12].map((n) => (
                                        <option key={n} value={n}>{n} month{n>1?"s":""}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="billing-form-label">Advance Discount (%)</label>
                                <input type="number" className="billing-form-input" min="0" max="100" step="0.5"
                                    value={form.advance_discount}
                                    onChange={(e) => setForm({...form, advance_discount: e.target.value})}
                                    placeholder="0 = no discount" />
                            </div>
                            <div className="col-12">
                                <label className="d-flex align-items-center gap-2" style={{ cursor:"pointer", fontSize:13 }}>
                                    <input type="checkbox" checked={form.apply_wallet}
                                        onChange={(e) => setForm({...form, apply_wallet: e.target.checked})} />
                                    💜 Auto-deduct wallet balance from each bill
                                </label>
                            </div>
                        </div>
                        <div style={{ background:"#fef3c7", border:"1px solid #fde68a", borderRadius:8, padding:"8px 12px", marginTop:12, fontSize:12, color:"#92400e" }}>
                            ⚠️ Will generate {form.months_count} month(s) of bills starting {form.start_month} {form.start_year}. Already-billed months are skipped.
                        </div>
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button className="billing-btn billing-btn-outline" onClick={onClose}>Cancel</button>
                            <button className="billing-btn billing-btn-primary" onClick={handle} disabled={loading}
                                style={{ background:"#7c3aed" }}>
                                {loading ? "Generating..." : `Generate ${form.months_count} Month${form.months_count>1?"s":""}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// ── Main BillsList ────────────────────────────────────────────────────────────
const BillsList = ({ setActive, setBillId }) => {
    const [bills,       setBills]       = useState([]);
    const [summary,     setSummary]     = useState({});
    const [page,        setPage]        = useState(1);
    const [pageSize]                    = useState(10);
    const [total,       setTotal]       = useState(0);
    const [loading,     setLoading]     = useState(false);
    const [flatOptions, setFlatOptions] = useState([]);

    const [filterStatus,   setFilterStatus]  = useState("");
    const [filterMonth,    setFilterMonth]   = useState("");
    const [filterYear,     setFilterYear]    = useState("");
    const [filterFlatId,   setFilterFlatId]  = useState("");
    const [overdueOnly,    setOverdueOnly]   = useState(false);

    const [showGenModal,    setShowGenModal]   = useState(false);
    const [showYearlyModal, setShowYearlyModal]= useState(false);
    const [payBill,         setPayBill]        = useState(null);
    const [regenerating,    setRegenerating]   = useState(null);

    useEffect(() => { loadFlats(); }, []);
    useEffect(() => { loadBills(); }, [page, filterStatus, filterMonth, filterYear, filterFlatId, overdueOnly]);

    const loadBills = async () => {
        setLoading(true);
        try {
            const res = await listBillsApi({
                flatId: filterFlatId ? parseInt(filterFlatId) : null,
                status: filterStatus, billMonth: filterMonth,
                billYear: filterYear ? parseInt(filterYear) : null,
                overdueOnly: overdueOnly ? 1 : 0,
                page, pageSize,
            });
            setBills(res?.bills || []);
            setSummary(res?.summary || {});
            setTotal(res?.pagination?.total || 0);
        } catch (e) { toast.error(typeof e === "string" ? e : "Failed to load bills"); }
        finally { setLoading(false); }
    };

    const loadFlats = async () => {
        try {
            const sid = getSessionSocietyId();
            if (!sid) return;
            const res = await getAllMembersWithoutPaginationApi(sid, "");
            const members = res?.members || res || [];
            const seen = new Set(); const opts = [];
            members.forEach((m) => {
                if (m.flat_id && !seen.has(m.flat_id)) {
                    seen.add(m.flat_id);
                    opts.push({ flat_id: m.flat_id, flat_number: m.flat_number, block: m.block });
                }
            });
            setFlatOptions(opts);
        } catch (_) {}
    };

    const handleRegenerate = async (bill) => {
        if (!window.confirm(
            `Regenerate bill for Flat ${bill.flat_number} — ${bill.bill_month} ${bill.bill_year}?\n\nOld bill will be cancelled and a fresh bill created with current charges.`
        )) return;
        setRegenerating(bill.bill_id);
        try {
            await regenerateBillApi(bill.bill_id, false);
            toast.success("Bill regenerated successfully");
            loadBills();
        } catch (e) { toast.error(typeof e === "string" ? e : "Regenerate failed"); }
        finally { setRegenerating(null); }
    };

    const clearFilters = () => {
        setFilterStatus(""); setFilterMonth(""); setFilterYear("");
        setFilterFlatId(""); setOverdueOnly(false); setPage(1);
    };

    return (
        <div className="pg" style={{ padding:"20px 24px" }}>

            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                <div>
                    <h4 style={{ fontWeight:700, margin:0 }}>📄 Bills</h4>
                    <p style={{ color:"#6b7280", fontSize:13, margin:0 }}>
                        {total} bills · Outstanding {fmt(summary.total_outstanding)}
                    </p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>← Dashboard</button>
                    <button className="billing-btn billing-btn-outline" onClick={loadBills}><FiRefreshCw size={13} /></button>
                    <button className="billing-btn billing-btn-outline" style={{ color:"#7c3aed", borderColor:"#7c3aed" }}
                        onClick={() => setShowYearlyModal(true)}>
                        <FiCalendar size={13} /> Yearly Bills
                    </button>
                    <button className="billing-btn billing-btn-primary" onClick={() => setShowGenModal(true)}>
                        <FiPlus size={13} /> Generate Bill
                    </button>
                </div>
            </div>

            {/* Mini summary */}
            <div className="d-flex gap-3 mb-3 flex-wrap">
                {[
                    { label:"Billed",   val:fmt(summary.total_billed),     color:"#2563eb" },
                    { label:"Collected",val:fmt(summary.total_collected),   color:"#059669" },
                    { label:"Pending",  val:`${summary.pending_count||0}`,  color:"#d97706" },
                    { label:"Overdue",  val:`${summary.overdue_count||0}`,  color:"#dc2626" },
                ].map((s) => (
                    <div key={s.label} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 18px" }}>
                        <div style={{ fontSize:11, color:"#6b7280" }}>{s.label}</div>
                        <div style={{ fontWeight:700, color:s.color, fontSize:15 }}>{s.val}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="billing-toolbar">
                <select className="billing-form-input" style={{ width:170 }} value={filterFlatId}
                    onChange={(e) => { setFilterFlatId(e.target.value); setPage(1); }}>
                    <option value="">All Flats</option>
                    {flatOptions.map((f) => (
                        <option key={f.flat_id} value={f.flat_id}>
                            {f.flat_number}{f.block?` / ${f.block}`:""}
                        </option>
                    ))}
                </select>
                <select className="billing-form-input" style={{ width:120 }} value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
                    <option value="">All Status</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <select className="billing-form-input" style={{ width:130 }} value={filterMonth}
                    onChange={(e) => { setFilterMonth(e.target.value); setPage(1); }}>
                    <option value="">All Months</option>
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <select className="billing-form-input" style={{ width:100 }} value={filterYear}
                    onChange={(e) => { setFilterYear(e.target.value); setPage(1); }}>
                    <option value="">All Years</option>
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <label className="d-flex align-items-center gap-2" style={{ fontSize:13, cursor:"pointer" }}>
                    <input type="checkbox" checked={overdueOnly}
                        onChange={(e) => { setOverdueOnly(e.target.checked); setPage(1); }} />
                    Overdue only
                </label>
                <button className="billing-btn billing-btn-outline billing-btn-sm" onClick={clearFilters}>Clear</button>
            </div>

            {/* Table */}
            <div className="billing-card" style={{ padding:0, overflow:"hidden" }}>
                <div style={{ overflowX:"auto" }}>
                    <table className="billing-table">
                        <thead>
                            <tr>
                                <th>Bill No</th><th>Flat</th><th>Owner</th><th>Month / Year</th>
                                <th>Due Date</th><th className="text-end">Opening</th>
                                <th className="text-end">Charges</th><th className="text-end">Interest</th>
                                <th className="text-end">Wallet</th><th className="text-end">Total</th>
                                <th className="text-end">Paid</th><th className="text-end">Balance</th>
                                <th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={14} style={{ textAlign:"center", padding:40, color:"#9ca3af" }}>Loading...</td></tr>
                            ) : bills.length === 0 ? (
                                <tr><td colSpan={14} style={{ textAlign:"center", padding:40, color:"#9ca3af" }}>No bills found</td></tr>
                            ) : bills.map((b) => (
                                <tr key={b.bill_id} style={{ opacity: b.status === "cancelled" ? 0.5 : 1 }}>
                                    <td>
                                        <span style={{ fontWeight:600, color: b.status==="cancelled"?"#9ca3af":"#2563eb", fontSize:12 }}>
                                            {b.bill_no}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight:600, fontSize:13 }}>{b.flat_number}{b.block?` / ${b.block}`:""}</div>
                                        <div style={{ fontSize:11, color:"#6b7280" }}>{b.unit_type}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize:13 }}>{b.owner_name||"—"}</div>
                                        <div style={{ fontSize:11, color:"#6b7280" }}>{b.owner_mobile||""}</div>
                                    </td>
                                    <td style={{ fontWeight:600 }}>{b.bill_month} {b.bill_year}</td>
                                    <td>
                                        <span style={{ fontSize:12, color:b.is_overdue?"#dc2626":"#374151", fontWeight:b.is_overdue?600:400 }}>
                                            {b.due_date}{b.is_overdue?<span style={{ fontSize:10 }}> ({b.overdue_days}d)</span>:""}
                                        </span>
                                    </td>
                                    <td className="text-end amount-muted">{fmt(parseFloat(b.opening_principal||0)+parseFloat(b.opening_interest||0))}</td>
                                    <td className="text-end">{fmt(b.current_charges)}</td>
                                    <td className="text-end" style={{ color:"#dc2626" }}>{fmt(b.interest_charged)}</td>
                                    <td className="text-end" style={{ color:"#7c3aed" }}>
                                        {parseFloat(b.wallet_applied||0) > 0 ? fmt(b.wallet_applied) : "—"}
                                    </td>
                                    <td className="text-end amount-display">{fmt(b.total_amount)}</td>
                                    <td className="text-end amount-green">{fmt(b.paid_amount)}</td>
                                    <td className="text-end amount-red">{fmt(b.outstanding)}</td>
                                    <td><StatusBadge status={b.status} isOverdue={b.is_overdue} /></td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <button className="billing-btn billing-btn-outline billing-btn-sm" title="View Bill"
                                                onClick={() => { setBillId(b.bill_id); setActive("viewBill"); }}>
                                                <FiEye size={12} />
                                            </button>
                                            {b.status !== "paid" && b.status !== "cancelled" && (
                                                <button className="billing-btn billing-btn-success billing-btn-sm" title="Record Payment"
                                                    onClick={() => setPayBill(b)}>
                                                    <FiDollarSign size={12} />
                                                </button>
                                            )}
                                            {(b.status === "unpaid" || b.status === "cancelled") && parseFloat(b.paid_amount||0) === 0 && (
                                                <button
                                                    className="billing-btn billing-btn-outline billing-btn-sm"
                                                    title="Regenerate Bill"
                                                    style={{ color:"#d97706", borderColor:"#d97706" }}
                                                    onClick={() => handleRegenerate(b)}
                                                    disabled={regenerating === b.bill_id}>
                                                    {regenerating === b.bill_id
                                                        ? <span style={{ fontSize:9 }}>...</span>
                                                        : <FiRotateCcw size={12} />}
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
                    <div style={{ padding:"12px 16px", borderTop:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <span style={{ fontSize:12, color:"#6b7280" }}>
                            Showing {((page-1)*pageSize)+1}–{Math.min(page*pageSize,total)} of {total}
                        </span>
                        <Pagination page={page} total={Math.ceil(total/pageSize)} onChange={setPage} />
                    </div>
                )}
            </div>

            {showGenModal    && <GenModal    flatOptions={flatOptions} onClose={() => setShowGenModal(false)}    onSuccess={() => { setShowGenModal(false);    loadBills(); }} />}
            {showYearlyModal && <YearlyModal flatOptions={flatOptions} onClose={() => setShowYearlyModal(false)} onSuccess={() => { setShowYearlyModal(false); loadBills(); }} />}
            {payBill         && <PayModal    bill={payBill}             onClose={() => setPayBill(null)}          onSuccess={() => { setPayBill(null);          loadBills(); }} />}
        </div>
    );
};

export default BillsList;