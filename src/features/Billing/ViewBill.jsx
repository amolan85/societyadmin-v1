import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiArrowLeft, FiDollarSign } from "react-icons/fi";
import { getBillApi, recordPaymentApi } from "../../services/BillingApi";
import "../../styles/Billing.css";

const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

const PayModeIcon = ({ mode }) => {
    const icons = { bank: "🏦", cash: "💵", cheque: "📝", upi: "📱", neft: "🔁", rtgs: "⚡" };
    return <span className="pay-mode-badge">{icons[mode] || "💳"} {mode?.toUpperCase()}</span>;
};

const ViewBill = ({ billId, setActive }) => {
    const [bill, setBill]         = useState(null);
    const [items, setItems]       = useState([]);
    const [receipts, setReceipts] = useState([]);

    // Pay Modal
    const [showPay, setShowPay]   = useState(false);
    const [payForm, setPayForm]   = useState({
        principal_amount: "", interest_amount: "",
        payment_mode: "bank", bank_name: "", cheque_no: "",
        transaction_ref: "", narration: ""
    });
    const [payLoading, setPayLoading] = useState(false);

    useEffect(() => { if (billId) fetchBill(); }, [billId]);

    const fetchBill = async () => {
        try {
            const res = await getBillApi(billId);
            setBill(res);
            setItems(res?.items    || []);
            setReceipts(res?.receipts || []);
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to load bill");
        }
    };

    const handlePay = async () => {
        const total = parseFloat(payForm.principal_amount || 0) + parseFloat(payForm.interest_amount || 0);
        if (total <= 0) { toast.error("Amount must be greater than 0"); return; }
        setPayLoading(true);
        try {
            await recordPaymentApi({
                flat_id:          bill.flat_id,
                bill_id:          billId,
                bill_month:       bill.bill_month,
                bill_year:        bill.bill_year,
                receipt_date:     new Date().toISOString().split("T")[0],
                principal_amount: parseFloat(payForm.principal_amount || 0),
                interest_amount:  parseFloat(payForm.interest_amount  || 0),
                payment_mode:     payForm.payment_mode,
                bank_name:        payForm.bank_name       || null,
                cheque_no:        payForm.cheque_no        || null,
                transaction_ref:  payForm.transaction_ref  || null,
                narration:        payForm.narration         || null,
            });
            toast.success("Payment recorded");
            setShowPay(false);
            fetchBill();
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Payment failed");
        } finally {
            setPayLoading(false);
        }
    };

    if (!bill) return (
        <div className="pg d-flex align-items-center justify-content-center" style={{ minHeight: 300 }}>
            <div style={{ color: "#6b7280" }}>Loading bill...</div>
        </div>
    );

    const isOverdue = bill.due_date && new Date(bill.due_date) < new Date() && bill.status !== "paid";
    const statusLabel = isOverdue ? "overdue" : bill.status;

    return (
        <div className="pg" style={{ padding: "20px 24px" }}>

            {/* Back */}
            <button className="billing-btn billing-btn-outline billing-btn-sm mb-3"
                onClick={() => setActive("billsList")}>
                <FiArrowLeft /> Back to Bills
            </button>

            {/* Bill Header Card */}
            <div className="bill-detail-header mb-3">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <div className="bill-detail-number">{bill.bill_no}</div>
                        <div className="bill-detail-flat">
                            Flat {bill.flat_number} {bill.block ? `/ ${bill.block}` : ""}
                            {bill.floor ? ` · Floor ${bill.floor}` : ""}
                        </div>
                        <div className="bill-detail-owner">
                            👤 {bill.owner_name || "—"} · {bill.owner_mobile || ""}
                        </div>
                    </div>
                    <div className="text-end">
                        <div style={{ fontSize: 12, opacity: 0.8 }}>{bill.bill_month} {bill.bill_year}</div>
                        <div style={{ fontSize: 26, fontWeight: 800 }}>{fmt(bill.total_amount)}</div>
                        <span className={`bill-badge ${statusLabel}`} style={{ marginTop: 4 }}>
                            {statusLabel?.toUpperCase()}
                        </span>
                    </div>
                </div>
                <div className="d-flex gap-4 mt-3" style={{ fontSize: 12, opacity: 0.85 }}>
                    <span>📅 Bill Date: {bill.bill_date}</span>
                    <span>⏰ Due: {bill.due_date}</span>
                    {bill.property_type && <span>🏢 {bill.property_type?.replace("_", " ")}</span>}
                    {bill.area_sqft && <span>📐 {bill.area_sqft} sqft</span>}
                </div>
            </div>

            <div className="row g-3">
                {/* Left — Bill Breakdown */}
                <div className="col-12 col-lg-7">
                    {/* Line Items */}
                    <div className="billing-card mb-3">
                        <div className="billing-card-title">🏷️ Charge Breakdown</div>
                        <table className="billing-table">
                            <thead>
                                <tr>
                                    <th>Head</th>
                                    <th>Code</th>
                                    <th>Type</th>
                                    <th className="text-end">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.item_id}>
                                        <td style={{ fontWeight: 600 }}>{item.head_name}</td>
                                        <td><span style={{ fontSize: 11, color: "#6b7280" }}>{item.head_code}</span></td>
                                        <td>
                                            <span className={`scope-badge ${item.charge_type}`}>
                                                {item.charge_type === "per_sqft"
                                                    ? `₹${item.rate_per_sqft}/sqft × ${item.area_sqft}`
                                                    : "Fixed"}
                                            </span>
                                            {item.is_override === 1 && (
                                                <span className="override-badge ms-1">Override</span>
                                            )}
                                        </td>
                                        <td className="text-end amount-display">{fmt(item.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Payment History */}
                    <div className="billing-card">
                        <div className="billing-card-title d-flex justify-content-between">
                            <span>💳 Payment History</span>
                            {bill.status !== "paid" && (
                                <button className="billing-btn billing-btn-success billing-btn-sm"
                                    onClick={() => {
                                        setPayForm({
                                            principal_amount: parseFloat(bill.balance_principal || 0).toFixed(2),
                                            interest_amount:  parseFloat(bill.balance_interest  || 0).toFixed(2),
                                            payment_mode: "bank", bank_name: "", cheque_no: "",
                                            transaction_ref: "", narration: ""
                                        });
                                        setShowPay(true);
                                    }}>
                                    <FiDollarSign size={12} /> Record Payment
                                </button>
                            )}
                        </div>
                        {receipts.length === 0 ? (
                            <div style={{ color: "#9ca3af", fontSize: 13, padding: "16px 0" }}>No payments recorded yet</div>
                        ) : (
                            <table className="billing-table">
                                <thead>
                                    <tr>
                                        <th>Receipt No</th>
                                        <th>Date</th>
                                        <th>Mode</th>
                                        <th className="text-end">Principal</th>
                                        <th className="text-end">Interest</th>
                                        <th className="text-end">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {receipts.map((r) => (
                                        <tr key={r.receipt_id}>
                                            <td style={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>
                                                {r.receipt_no}
                                            </td>
                                            <td style={{ fontSize: 12 }}>{r.receipt_date}</td>
                                            <td><PayModeIcon mode={r.payment_mode} /></td>
                                            <td className="text-end">{fmt(r.principal_applied)}</td>
                                            <td className="text-end" style={{ color: "#dc2626" }}>{fmt(r.interest_applied)}</td>
                                            <td className="text-end amount-display">{fmt(r.total_applied)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Right — Summary */}
                <div className="col-12 col-lg-5">
                    <div className="billing-card">
                        <div className="billing-card-title">📊 Bill Summary</div>

                        {[
                            { label: "Opening Principal",   val: fmt(bill.opening_principal), muted: true },
                            { label: "Opening Interest",    val: fmt(bill.opening_interest),  muted: true, red: true },
                            { label: "Current Charges",     val: fmt(bill.current_charges) },
                            { label: "Interest Charged",    val: fmt(bill.interest_charged), red: true,
                              sub: `${bill.interest_method || "Simple Interest"}` },
                        ].map((row) => (
                            <div key={row.label} className="bill-summary-row">
                                <div>
                                    <div style={{ fontSize: 13, color: row.muted ? "#6b7280" : "#374151" }}>{row.label}</div>
                                    {row.sub && <div style={{ fontSize: 10, color: "#9ca3af" }}>{row.sub}</div>}
                                </div>
                                <span className={`amount-display ${row.red ? "amount-red" : row.muted ? "amount-muted" : ""}`}>
                                    {row.val}
                                </span>
                            </div>
                        ))}

                        <div className="bill-summary-row total">
                            <span>Total Amount</span>
                            <span className="amount-display">{fmt(bill.total_amount)}</span>
                        </div>

                        <div style={{ marginTop: 16, padding: "12px 0", borderTop: "2px solid #e5e7eb" }}>
                            <div className="bill-summary-row">
                                <span style={{ color: "#059669" }}>Amount Paid</span>
                                <span className="amount-display amount-green">{fmt(bill.paid_amount)}</span>
                            </div>
                            <div className="bill-summary-row">
                                <span>Balance Principal</span>
                                <span className="amount-display">{fmt(bill.balance_principal)}</span>
                            </div>
                            <div className="bill-summary-row">
                                <span style={{ color: "#dc2626" }}>Balance Interest</span>
                                <span className="amount-display amount-red">{fmt(bill.balance_interest)}</span>
                            </div>
                        </div>

                        <div style={{
                            background: bill.status === "paid" ? "#d1fae5" : "#fee2e2",
                            borderRadius: 10, padding: "14px 16px", marginTop: 8,
                            display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}>
                            <span style={{ fontWeight: 700, fontSize: 14,
                                color: bill.status === "paid" ? "#065f46" : "#991b1b" }}>
                                {bill.status === "paid" ? "✅ Fully Paid" : "Balance Due"}
                            </span>
                            <span style={{ fontWeight: 800, fontSize: 18,
                                color: bill.status === "paid" ? "#065f46" : "#dc2626" }}>
                                {fmt((parseFloat(bill.balance_principal || 0) + parseFloat(bill.balance_interest || 0)))}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Pay Modal ── */}
            {showPay && (
                <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.45)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: 12, border: "none" }}>
                            <div className="billing-modal-header">
                                <span>💳 Record Payment</span>
                                <button className="close-btn" onClick={() => setShowPay(false)}>×</button>
                            </div>
                            <div style={{ padding: 20 }}>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <label className="billing-form-label">Principal</label>
                                        <input type="number" className="billing-form-input" min="0" step="0.01"
                                            value={payForm.principal_amount}
                                            onChange={(e) => setPayForm({ ...payForm, principal_amount: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="billing-form-label">Interest</label>
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
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end gap-2 mt-3">
                                    <button className="billing-btn billing-btn-outline" onClick={() => setShowPay(false)}>Cancel</button>
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

export default ViewBill;
