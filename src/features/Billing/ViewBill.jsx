import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
    getBillApi,
    applyWalletToBillApi,
    recordPaymentApi,
    getWalletDetailsApi,
    resendReceiptApi,
    getPenaltyHistoryApi,
    getInterestHistoryApi,
    getReceiptPdfApi,
    getWaiveOffHistoryApi,
    waiveOffApi,
    recalcFlatBillsApi,
    // waiveOffApi used in WaiveOffModal above
} from "../../services/BillingApi";
import ReceiptViewer from "./ReceiptViewer";
import "../../styles/Billing.css";

const fmt  = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
const fmtD = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";


// ── Pay Modal with Wallet ────────────────────────────────────
const PayModal = ({ bill, onClose, onSuccess }) => {
    const billBalance = parseFloat(bill.balance_principal||0) + parseFloat(bill.balance_interest||0);
    const balPrin     = parseFloat(bill.balance_principal||0);
    const balInt      = parseFloat(bill.balance_interest ||0);

    const [walletBalance, setWalletBalance] = useState(0);
    const [walletLoading, setWalletLoading] = useState(true);
    const [useWallet,     setUseWallet]     = useState(false);
    const [payMode,       setPayMode]       = useState("full");
    const [customAmount,  setCustomAmount]  = useState("");
    const [loading,       setLoading]       = useState(false);
    const [payForm, setPayForm] = useState({
        payment_mode:"bank", bank_name:"", transaction_ref:"", cheque_no:"", narration:"",
    });

    useEffect(() => {
        getWalletDetailsApi(bill.flat_id)
            .then(r => {
                const bal = parseFloat(r?.wallet?.balance||0);
                setWalletBalance(bal);
                if (bal > 0) setUseWallet(true);
            })
            .catch(() => {})
            .finally(() => setWalletLoading(false));
    }, [bill.flat_id]);

    const requestedAmount = payMode === "full"
        ? billBalance
        : Math.min(parseFloat(customAmount)||0, billBalance);

    const walletDeduct = useWallet ? Math.min(walletBalance, requestedAmount) : 0;
    const cashAmount   = Math.max(0, requestedAmount - walletDeduct);
    const willBePaid   = requestedAmount >= billBalance;
    const isPartialPay = !willBePaid && requestedAmount > 0;
    const cashForInt   = Math.min(cashAmount, balInt);
    const cashForPrin  = Math.max(0, cashAmount - cashForInt);

    const showBank   = ["bank","neft","rtgs","cheque"].includes(payForm.payment_mode);
    const showCheque = payForm.payment_mode === "cheque";
    const showTxn    = ["bank","upi","neft","rtgs"].includes(payForm.payment_mode);

    const handlePay = async () => {
        if (requestedAmount <= 0) { toast.error("Enter a valid amount"); return; }
        setLoading(true);
        try {
            let receiptData = null;

            if (useWallet && walletDeduct > 0) {
                await applyWalletToBillApi(bill.bill_id, walletDeduct);
                toast.success(willBePaid && cashAmount===0
                    ? `✅ Fully paid from wallet ${fmt(walletDeduct)}`
                    : `💜 Wallet ${fmt(walletDeduct)} applied`);
            }

            if (cashAmount > 0) {
                receiptData = await recordPaymentApi({
                    flat_id:          bill.flat_id,
                    bill_id:          bill.bill_id,
                    bill_month:       bill.bill_month,
                    bill_year:        bill.bill_year,
                    receipt_date:     new Date().toISOString().split("T")[0],
                    principal_amount: cashForPrin,
                    interest_amount:  cashForInt,
                    payment_mode:     payForm.payment_mode,
                    bank_name:        payForm.bank_name       || null,
                    transaction_ref:  payForm.transaction_ref || null,
                    cheque_no:        payForm.cheque_no       || null,
                    narration:        payForm.narration       || `${isPartialPay?"Partial payment - ":""}${bill.bill_month} ${bill.bill_year}`,
                    send_email:       false,
                });
            }

            if (!receiptData && walletDeduct > 0) {
                receiptData = {
                    receipt_no:`WALLET-${bill.bill_id}`, receipt_date:new Date().toISOString().split("T")[0],
                    payment_mode:"wallet", wallet_applied:walletDeduct,
                    principal_amount:walletDeduct, interest_amount:0, total_amount:walletDeduct,
                    balance_principal:Math.max(0,balPrin-walletDeduct), balance_interest:balInt,
                    flat_number:bill.flat_number, block:bill.block, floor:bill.floor,
                    owner_name:bill.owner_name, owner_mobile:bill.owner_mobile, owner_email:bill.owner_email,
                    bill_month:bill.bill_month, bill_year:bill.bill_year, bill_no:bill.bill_no,
                };
            }

            onSuccess(receiptData);
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Payment failed");
        } finally { setLoading(false); }
    };

    return (
        <div className="modal show d-block" style={{ background:"rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content" style={{ borderRadius:12, border:"none" }}>
                    <div className="billing-modal-header">
                        <span>💳 Record Payment — {bill.flat_number}{bill.block?` / ${bill.block}`:""} · {bill.bill_month} {bill.bill_year}</span>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                    <div style={{ padding:20 }}>

                        {/* Bill summary */}
                        <div style={{ background:"#f9fafb", borderRadius:8, padding:"12px 16px", marginBottom:16 }}>
                            <div className="d-flex justify-content-between mb-1" style={{ fontSize:13 }}>
                                <span style={{ color:"#6b7280" }}>Total Bill</span>
                                <span style={{ fontWeight:600 }}>{fmt(bill.total_amount)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-1" style={{ fontSize:13 }}>
                                <span style={{ color:"#6b7280" }}>Already Paid</span>
                                <span style={{ color:"#059669", fontWeight:600 }}>{fmt(bill.paid_amount)}</span>
                            </div>
                            {balInt > 0 && (
                                <div className="d-flex justify-content-between mb-1" style={{ fontSize:13 }}>
                                    <span style={{ color:"#6b7280" }}>Balance Interest</span>
                                    <span style={{ fontWeight:600, color:"#dc2626" }}>{fmt(balInt)}</span>
                                </div>
                            )}
                            <div className="d-flex justify-content-between" style={{ fontSize:15, fontWeight:700, borderTop:"1px solid #e5e7eb", paddingTop:8, marginTop:4 }}>
                                <span>Balance Due</span>
                                <span style={{ color:"#dc2626" }}>{fmt(billBalance)}</span>
                            </div>
                        </div>

                        {/* Full vs Partial toggle */}
                        <div className="d-flex gap-2 mb-3">
                            <button onClick={() => setPayMode("full")}
                                style={{ flex:1, padding:"10px 0", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer",
                                    border:"2px solid "+(payMode==="full"?"#2563eb":"#e5e7eb"),
                                    background:payMode==="full"?"#eff6ff":"#fff",
                                    color:payMode==="full"?"#2563eb":"#6b7280" }}>
                                ✅ Pay Full Balance<br/>
                                <span style={{ fontSize:16, fontWeight:800 }}>{fmt(billBalance)}</span>
                            </button>
                            <button onClick={() => setPayMode("partial")}
                                style={{ flex:1, padding:"10px 0", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer",
                                    border:"2px solid "+(payMode==="partial"?"#f59e0b":"#e5e7eb"),
                                    background:payMode==="partial"?"#fffbeb":"#fff",
                                    color:payMode==="partial"?"#d97706":"#6b7280" }}>
                                ⚖️ Partial Payment<br/>
                                <span style={{ fontSize:12, fontWeight:400 }}>Pay any amount now</span>
                            </button>
                        </div>

                        {payMode === "partial" && (
                            <div style={{ marginBottom:16 }}>
                                <label className="billing-form-label">Enter Amount (₹) *</label>
                                <div style={{ position:"relative" }}>
                                    <input type="number" className="billing-form-input"
                                        value={customAmount} min={1} max={billBalance} step={100}
                                        onChange={e => setCustomAmount(e.target.value)}
                                        placeholder={`Max ${fmt(billBalance)}`}
                                        style={{ paddingLeft:32, fontSize:16, fontWeight:700 }} />
                                    <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontWeight:700 }}>₹</span>
                                </div>
                                <div className="d-flex gap-2 mt-2 flex-wrap">
                                    {[500,1000,1500,2000,Math.round(billBalance/2)].filter((v,i,a)=>v>0&&v<billBalance&&a.indexOf(v)===i).map(amt=>(
                                        <button key={amt} onClick={()=>setCustomAmount(String(amt))}
                                            style={{ padding:"4px 10px", borderRadius:6, border:"1px solid #e5e7eb",
                                                background:parseFloat(customAmount)===amt?"#dbeafe":"#f9fafb",
                                                color:"#374151", cursor:"pointer", fontSize:12, fontWeight:600 }}>
                                            {fmt(amt)}
                                        </button>
                                    ))}
                                    <button onClick={()=>setCustomAmount(String(billBalance))}
                                        style={{ padding:"4px 10px", borderRadius:6, border:"1px solid #2563eb",
                                            background:"#eff6ff", color:"#2563eb", cursor:"pointer", fontSize:12, fontWeight:600 }}>
                                        Full {fmt(billBalance)}
                                    </button>
                                </div>
                                {parseFloat(customAmount)>0 && parseFloat(customAmount)<billBalance && (
                                    <div style={{ fontSize:12, color:"#d97706", marginTop:6, background:"#fffbeb", padding:"6px 10px", borderRadius:6 }}>
                                        ⚠️ Partial — remaining {fmt(billBalance-parseFloat(customAmount))} payable anytime
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Wallet */}
                        {requestedAmount > 0 && (
                            <div style={{ background:useWallet&&walletDeduct>0?"#f0fdf4":"#f5f3ff",
                                border:`1px solid ${useWallet&&walletDeduct>0?"#86efac":"#ddd6fe"}`,
                                borderRadius:8, padding:"12px 16px", marginBottom:16 }}>
                                <div className="d-flex align-items-center justify-content-between">
                                    <label className="d-flex align-items-center gap-2"
                                        style={{ cursor:walletBalance>0?"pointer":"default", fontWeight:600, fontSize:13,
                                                 color:walletBalance>0?"#7c3aed":"#9ca3af" }}>
                                        <input type="checkbox" checked={useWallet}
                                            disabled={walletBalance<=0||walletLoading}
                                            onChange={e=>setUseWallet(e.target.checked)} />
                                        💜 Use Wallet Balance
                                    </label>
                                    <span style={{ fontSize:13, fontWeight:600, color:walletBalance>0?"#7c3aed":"#9ca3af" }}>
                                        {walletLoading?"Loading...":`Available: ${fmt(walletBalance)}`}
                                    </span>
                                </div>
                                {useWallet && walletDeduct>0 && (
                                    <div style={{ marginTop:8, borderTop:"1px solid #bbf7d0", paddingTop:8 }}>
                                        <div className="d-flex justify-content-between" style={{ fontSize:13, marginBottom:4 }}>
                                            <span style={{ color:"#065f46" }}>💜 Wallet deduction</span>
                                            <span style={{ color:"#059669", fontWeight:700 }}>- {fmt(walletDeduct)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between" style={{ fontSize:14, fontWeight:700 }}>
                                            <span>Cash to Pay</span>
                                            <span style={{ color:cashAmount>0?"#1e40af":"#059669" }}>
                                                {cashAmount>0?fmt(cashAmount):"₹0.00 — Covered ✅"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Cash form */}
                        {cashAmount > 0 && (
                            <div className="row g-3">
                                <div className="col-6">
                                    <label className="billing-form-label">Payment Mode *</label>
                                    <select className="billing-form-input" value={payForm.payment_mode}
                                        onChange={e=>setPayForm({...payForm,payment_mode:e.target.value})}>
                                        <option value="bank">Bank Transfer</option>
                                        <option value="cash">Cash</option>
                                        <option value="cheque">Cheque</option>
                                        <option value="upi">UPI</option>
                                        <option value="neft">NEFT</option>
                                        <option value="rtgs">RTGS</option>
                                    </select>
                                </div>
                                {showBank && <div className="col-6"><label className="billing-form-label">Bank Name</label>
                                    <input type="text" className="billing-form-input" value={payForm.bank_name}
                                        onChange={e=>setPayForm({...payForm,bank_name:e.target.value})} placeholder="HDFC Bank" /></div>}
                                {showCheque && <div className="col-6"><label className="billing-form-label">Cheque No</label>
                                    <input type="text" className="billing-form-input" value={payForm.cheque_no}
                                        onChange={e=>setPayForm({...payForm,cheque_no:e.target.value})} /></div>}
                                {showTxn && <div className="col-6"><label className="billing-form-label">Txn Ref</label>
                                    <input type="text" className="billing-form-input" value={payForm.transaction_ref}
                                        onChange={e=>setPayForm({...payForm,transaction_ref:e.target.value})} /></div>}
                                <div className="col-12"><label className="billing-form-label">Narration</label>
                                    <input type="text" className="billing-form-input" value={payForm.narration}
                                        onChange={e=>setPayForm({...payForm,narration:e.target.value})}
                                        placeholder={isPartialPay?`Partial - ${bill.bill_month} ${bill.bill_year}`:`${bill.bill_month} ${bill.bill_year} maintenance`} />
                                </div>
                            </div>
                        )}

                        {/* Summary */}
                        {requestedAmount > 0 && (
                            <div style={{ marginTop:16, borderRadius:8, padding:"12px 16px",
                                background:willBePaid?"#d1fae5":isPartialPay?"#fffbeb":"#dbeafe",
                                display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                                <div>
                                    <div style={{ fontWeight:700, fontSize:14,
                                        color:willBePaid?"#065f46":isPartialPay?"#92400e":"#1e40af" }}>
                                        {willBePaid?"✅ Bill will be FULLY PAID":isPartialPay?"⚖️ Partial Payment":"Amount Being Paid"}
                                    </div>
                                    {isPartialPay && (
                                        <div style={{ fontSize:12, color:"#92400e", marginTop:2 }}>
                                            Balance after: {fmt(billBalance-requestedAmount)} — payable anytime
                                        </div>
                                    )}
                                </div>
                                <span style={{ fontSize:18, fontWeight:800,
                                    color:willBePaid?"#059669":isPartialPay?"#d97706":"#1e40af" }}>
                                    {fmt(requestedAmount)}
                                </span>
                            </div>
                        )}

                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button className="billing-btn billing-btn-outline" onClick={onClose}>Cancel</button>
                            <button className="billing-btn billing-btn-success"
                                onClick={handlePay}
                                disabled={loading||walletLoading||requestedAmount<=0}
                                style={{ minWidth:200 }}>
                                {loading?"Processing...":
                                 willBePaid&&walletDeduct>0&&cashAmount===0?"💜 Pay from Wallet":
                                 willBePaid?`✅ Pay Full ${fmt(requestedAmount)}`:
                                 isPartialPay?`⚖️ Pay Partial ${fmt(requestedAmount)}`:
                                 "Enter Amount"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// ── WaiveOff Modal ───────────────────────────────────────────
const WaiveOffModal = ({ bill, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        waive_type: "interest", waive_amount: "", reason: "", custom_amount: false
    });
    const [loading, setLoading] = useState(false);

    const balInt  = parseFloat(bill.balance_interest  || 0);
    const balPrin = parseFloat(bill.balance_principal || 0);

    const maxAmount = form.waive_type === "interest" ? balInt
                    : form.waive_type === "penalty"  ? balPrin
                    : balInt + balPrin;

    const handleSubmit = async () => {
        if (!form.reason.trim()) { toast.error("Reason is required"); return; }
        setLoading(true);
        try {
            const payload = {
                bill_id:      bill.bill_id || bill.id,
                waive_type:   form.waive_type,
                reason:       form.reason,
                waive_amount: form.custom_amount && form.waive_amount
                              ? parseFloat(form.waive_amount) : null,
            };
            await waiveOffApi(payload);
            toast.success(`Waive-off applied successfully ✅`);
            onSuccess();
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Waive-off failed");
        } finally { setLoading(false); }
    };

    return (
        <div className="modal show d-block" style={{ background:"rgba(0,0,0,0.5)", zIndex:9998 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth:440 }}>
                <div className="modal-content" style={{ borderRadius:12, border:"none" }}>
                    <div style={{ background:"linear-gradient(135deg,#7c3aed,#a78bfa)", padding:"18px 20px", color:"#fff", borderRadius:"12px 12px 0 0" }}>
                        <div className="d-flex justify-content-between">
                            <div>
                                <div style={{ fontSize:18, fontWeight:800 }}>✍️ Waive-Off</div>
                                <div style={{ fontSize:12, opacity:.8 }}>
                                    Bill {bill.bill_no} · {bill.flat_number}{bill.block?` / ${bill.block}`:""}
                                </div>
                            </div>
                            <button onClick={onClose} style={{ background:"rgba(255,255,255,.2)", border:"none", color:"#fff", width:28, height:28, borderRadius:"50%", cursor:"pointer", fontSize:16 }}>×</button>
                        </div>
                    </div>
                    <div style={{ padding:20 }}>
                        {/* Available amounts */}
                        <div style={{ background:"#f9fafb", borderRadius:8, padding:"10px 14px", marginBottom:16 }}>
                            <div className="d-flex justify-content-between" style={{ fontSize:13, marginBottom:4 }}>
                                <span style={{ color:"#6b7280" }}>Interest Balance</span>
                                <span style={{ fontWeight:700, color:balInt>0?"#d97706":"#059669" }}>{fmt(balInt)}</span>
                            </div>
                            <div className="d-flex justify-content-between" style={{ fontSize:13 }}>
                                <span style={{ color:"#6b7280" }}>Principal (Penalty) Balance</span>
                                <span style={{ fontWeight:700, color:balPrin>0?"#dc2626":"#059669" }}>{fmt(balPrin)}</span>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-12">
                                <label className="billing-form-label">Waive Off Type *</label>
                                <select className="billing-form-input"
                                    value={form.waive_type}
                                    onChange={e => setForm({...form, waive_type:e.target.value, waive_amount:"", custom_amount:false})}>
                                    <option value="interest">💰 Interest Only</option>
                                    <option value="penalty">🔴 Penalty Only</option>
                                    <option value="both">✅ Both Interest + Penalty</option>
                                    <option value="partial">⚖️ Partial Amount</option>
                                </select>
                            </div>

                            {form.waive_type === "partial" && (
                                <div className="col-12">
                                    <label className="billing-form-label">Waive Amount (₹) *</label>
                                    <input type="number" className="billing-form-input"
                                        value={form.waive_amount}
                                        max={maxAmount}
                                        onChange={e => setForm({...form, waive_amount:e.target.value, custom_amount:true})}
                                        placeholder={`Max: ₹${maxAmount.toFixed(2)}`} />
                                </div>
                            )}

                            {form.waive_type !== "partial" && maxAmount > 0 && (
                                <div className="col-12">
                                    <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13 }}>
                                        <input type="checkbox"
                                            checked={form.custom_amount}
                                            onChange={e => setForm({...form, custom_amount:e.target.checked, waive_amount:""})} />
                                        Partial waive (custom amount instead of full {fmt(maxAmount)})
                                    </label>
                                    {form.custom_amount && (
                                        <input type="number" className="billing-form-input mt-2"
                                            value={form.waive_amount}
                                            max={maxAmount}
                                            onChange={e => setForm({...form, waive_amount:e.target.value})}
                                            placeholder={`Max: ₹${maxAmount.toFixed(2)}`} />
                                    )}
                                </div>
                            )}

                            <div className="col-12">
                                <label className="billing-form-label">Reason / Justification *</label>
                                <textarea className="billing-form-input" rows={3}
                                    value={form.reason}
                                    onChange={e => setForm({...form, reason:e.target.value})}
                                    placeholder="e.g. Senior citizen concession, financial hardship, administrative error, etc." />
                                <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>
                                    This reason will be recorded in audit trail per accounting standards
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background:"#f5f3ff", border:"1px solid #ddd6fe",
                            borderRadius:8, padding:"10px 14px", marginTop:12, fontSize:12, color:"#7c3aed"
                        }}>
                            📋 <strong>Note:</strong> Waive-off is permanent and recorded in audit log.
                            Reduces bill balance immediately. Admin only.
                        </div>

                        <div className="d-flex gap-2 mt-3">
                            <button onClick={onClose} className="billing-btn billing-btn-outline" style={{ flex:1 }}>Cancel</button>
                            <button onClick={handleSubmit} disabled={loading}
                                style={{ flex:2, padding:"10px 0", borderRadius:8, border:"none",
                                    background:"#7c3aed", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer",
                                    opacity:loading?"0.7":"1" }}>
                                {loading ? "Processing..." : "✅ Apply Waive-Off"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// ── ViewBill Main ────────────────────────────────────────────
const ViewBill = ({ setActive, billId }) => {
    const [bill,      setBill]      = useState(null);
    const [penalties,  setPenalties]  = useState([]);
    const [interests,   setInterests]   = useState([]);
    const [waiveoffs,   setWaiveoffs]   = useState([]);
    const [showWaiveOff,setShowWaiveOff] = useState(false); // waive-off modal
    const [loading,   setLoading]   = useState(true);
    const [showPay,     setShowPay]     = useState(false);
    const [receipt,     setReceipt]     = useState(null);
    const [viewOldRcpt, setViewOldRcpt] = useState(null);
    const [loadingRcpt,  setLoadingRcpt]  = useState(null);
    const [recalcLoading,setRecalcLoading] = useState(false);

    useEffect(() => {
        if (!billId) { setActive("billsList"); return; }
        loadBill();
    }, [billId]);

    const loadBill = async () => {
        setLoading(true);
        try {
            const res = await getBillApi(billId);
            setBill(res);
            // Load penalties for this bill
            try {
                const pen = await getPenaltyHistoryApi({ bill_id: billId });
                setPenalties(pen?.penalties || []);
            } catch (_) {}
            try {
                const intr = await getInterestHistoryApi({ bill_id: billId });
                setInterests(intr?.transactions || []);
            } catch (_) {}
            try {
                const wo = await getWaiveOffHistoryApi({ bill_id: billId });
                setWaiveoffs(wo?.waiveoffs || []);
            } catch (_) {}
        } catch (e) {
            toast.error("Failed to load bill");
            setActive("billsList");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:300 }}>
            <div style={{ color:"#9ca3af" }}>Loading bill...</div>
        </div>
    );
    if (!bill) return null;

    const isPaid    = bill.status === "paid";
    const isPartial = bill.status === "partial";
    const isOverdue = bill.is_overdue || (bill.due_date && new Date(bill.due_date) < new Date() && !isPaid);
    const balance   = parseFloat(bill.balance_principal||0) + parseFloat(bill.balance_interest||0);
    const totalPenalty  = penalties.reduce((sum, p) => sum + parseFloat(p.penalty_amount||0), 0);
    const totalInterest = interests.reduce((sum, i) => sum + parseFloat(i.interest_amount||0), 0);
    const totalWaived   = waiveoffs.reduce((sum, w) => sum + parseFloat(w.total_waived||0), 0);

    return (
        <div className="pg" style={{ padding:"20px 24px" }}>
            <button className="billing-btn billing-btn-outline mb-3" onClick={() => setActive("billsList")}>
                ← Back to Bills
            </button>

            {/* Header */}
            <div style={{
                background:"linear-gradient(135deg,#1e40af,#3b82f6)",
                borderRadius:14, padding:"24px 28px", marginBottom:24, color:"#fff"
            }}>
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                    <div>
                        <div style={{ fontSize:13, color:"#bfdbfe", marginBottom:4 }}>{bill.bill_no}</div>
                        <div style={{ fontSize:24, fontWeight:800 }}>
                            Flat {bill.flat_number}{bill.block?` / ${bill.block}`:""}
                            {bill.floor?` · Floor ${bill.floor}`:""}
                        </div>
                        {bill.owner_name && (
                            <div style={{ fontSize:14, color:"#bfdbfe", marginTop:4 }}>
                                👤 {(bill.owner_name||"").trim()}{bill.owner_mobile?` · ${bill.owner_mobile}`:""}
                            </div>
                        )}
                        <div style={{ marginTop:12, display:"flex", gap:20, fontSize:13, color:"#bfdbfe", flexWrap:"wrap" }}>
                            <span>📅 Bill Date: {fmtD(bill.bill_date)}</span>
                            <span style={{ color:isOverdue?"#fca5a5":"#bfdbfe" }}>
                                🔴 Due: {fmtD(bill.due_date)}
                                {isOverdue && <span style={{ marginLeft:6, background:"rgba(220,38,38,0.3)", padding:"1px 8px", borderRadius:8, fontSize:11 }}>OVERDUE</span>}
                            </span>
                        </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:13, color:"#bfdbfe" }}>{bill.bill_month} {bill.bill_year}</div>
                        <div style={{ fontSize:32, fontWeight:800 }}>{fmt(bill.total_amount)}</div>
                        {totalPenalty > 0 && (
                            <div style={{ fontSize:12, color:"#fca5a5", marginTop:2 }}>
                                🔴 Includes ₹{totalPenalty.toLocaleString("en-IN")} penalty
                            </div>
                        )}
                        <span style={{
                            display:"inline-block", padding:"4px 14px", borderRadius:20,
                            fontSize:12, fontWeight:700, marginTop:4,
                            background:isPaid?"#059669":isPartial?"#d97706":"#dc2626",
                        }}>
                            {bill.status?.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Left */}
                <div className="col-12 col-lg-7">

                    {/* Charge breakdown */}
                    <div className="billing-card mb-3">
                        <div className="billing-card-title">🧾 Charge Breakdown</div>
                        <table className="billing-table">
                            <thead>
                                <tr><th>Head</th><th>Code</th><th>Type</th><th className="text-end">Amount</th></tr>
                            </thead>
                            <tbody>
                                {(bill.items||[]).map((item,i) => (
                                    <tr key={i}>
                                        <td style={{ fontWeight:600 }}>{item.head_name}</td>
                                        <td style={{ fontSize:12, color:"#6b7280" }}>{item.head_code}</td>
                                        <td style={{ fontSize:12 }}>{item.charge_type}</td>
                                        <td className="text-end amount-display">{fmt(item.amount)}</td>
                                    </tr>
                                ))}
                                {(bill.items||[]).length === 0 && (
                                    <tr><td colSpan={4} style={{ textAlign:"center", color:"#9ca3af", padding:20 }}>No items</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Penalty section */}
                    {penalties.length > 0 && (
                        <div className="billing-card mb-3" style={{ border:"1px solid #fecaca" }}>
                            <div className="billing-card-title" style={{ color:"#dc2626" }}>🔴 Penalty Transactions</div>
                            <table className="billing-table">
                                <thead>
                                    <tr>
                                        <th>Date Applied</th>
                                        <th>Type</th>
                                        <th>Basis Amount</th>
                                        <th className="text-end">Penalty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {penalties.map((p,i) => (
                                        <tr key={i}>
                                            <td style={{ fontSize:12 }}>{fmtD(p.applied_on)}</td>
                                            <td>
                                                <span style={{ fontSize:11, padding:"2px 8px", background:"#fee2e2", color:"#991b1b", borderRadius:99 }}>
                                                    {p.penalty_type === "percentage" ? "%" : "Fixed"}
                                                </span>
                                            </td>
                                            <td style={{ fontSize:12, color:"#6b7280" }}>{fmt(p.penalty_basis)}</td>
                                            <td className="text-end" style={{ color:"#dc2626", fontWeight:700 }}>{fmt(p.penalty_amount)}</td>
                                        </tr>
                                    ))}
                                    <tr style={{ background:"#fff1f2" }}>
                                        <td colSpan={3} style={{ fontWeight:700, fontSize:13 }}>Total Penalty</td>
                                        <td className="text-end" style={{ color:"#dc2626", fontWeight:800, fontSize:15 }}>{fmt(totalPenalty)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Interest transactions */}
                    {interests.length > 0 && (
                        <div className="billing-card mb-3" style={{ border:"1px solid #fde68a" }}>
                            <div className="billing-card-title" style={{ color:"#d97706" }}>💰 Interest Transactions</div>
                            <table className="billing-table">
                                <thead>
                                    <tr>
                                        <th>Date Applied</th><th>Type</th>
                                        <th>Basis</th><th>Rate</th>
                                        <th>Days OD</th><th className="text-end">Interest</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {interests.map((it,i) => (
                                        <tr key={i}>
                                            <td style={{ fontSize:12 }}>{fmtD(it.applied_on)}</td>
                                            <td><span style={{ fontSize:11, padding:"2px 8px", background:"#fef3c7", color:"#92400e", borderRadius:99 }}>
                                                {it.interest_type === "C" ? "Compound" : "Simple"}
                                            </span></td>
                                            <td style={{ fontSize:12, color:"#6b7280" }}>{fmt(it.basis_amount)}</td>
                                            <td style={{ fontSize:12 }}>{((parseFloat(it.annual_rate||0))*100).toFixed(1)}% p.a.</td>
                                            <td style={{ fontSize:12, textAlign:"center" }}>{it.days_overdue}d</td>
                                            <td className="text-end" style={{ color:"#d97706", fontWeight:700 }}>{fmt(it.interest_amount)}</td>
                                        </tr>
                                    ))}
                                    <tr style={{ background:"#fffbeb" }}>
                                        <td colSpan={5} style={{ fontWeight:700, fontSize:13 }}>Total Interest (Post-Due)</td>
                                        <td className="text-end" style={{ color:"#d97706", fontWeight:800, fontSize:15 }}>{fmt(totalInterest)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Waive-off history */}
                    {waiveoffs.length > 0 && (
                        <div className="billing-card mb-3" style={{ border:"1px solid #ddd6fe" }}>
                            <div className="billing-card-title" style={{ color:"#7c3aed" }}>✍️ Waive-Off Adjustments</div>
                            <table className="billing-table">
                                <thead>
                                    <tr><th>Date</th><th>Type</th><th>Interest</th><th>Penalty</th><th className="text-end">Total</th><th>Reason</th></tr>
                                </thead>
                                <tbody>
                                    {waiveoffs.map((w,i) => (
                                        <tr key={i}>
                                            <td style={{ fontSize:12 }}>{fmtD(w.waived_on)}</td>
                                            <td><span style={{ fontSize:11, padding:"2px 8px", background:"#f5f3ff", color:"#7c3aed", borderRadius:99, textTransform:"capitalize" }}>{w.waive_type}</span></td>
                                            <td style={{ fontSize:12, color:"#d97706" }}>{parseFloat(w.waive_interest||0)>0?fmt(w.waive_interest):"—"}</td>
                                            <td style={{ fontSize:12, color:"#dc2626" }}>{parseFloat(w.waive_penalty||0)>0?fmt(w.waive_penalty):"—"}</td>
                                            <td className="text-end" style={{ color:"#7c3aed", fontWeight:700 }}>- {fmt(w.total_waived)}</td>
                                            <td style={{ fontSize:11, color:"#6b7280", maxWidth:150, whiteSpace:"normal" }}>{w.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Payment history */}
                    <div className="billing-card">
                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                            <div className="billing-card-title" style={{ margin:0 }}>💳 Payment History</div>
                            <div className="d-flex gap-2">
                                <button
                                    title="Recalculate this flat's future bills with correct opening balance"
                                    disabled={recalcLoading}
                                    onClick={async () => {
                                        setRecalcLoading(true);
                                        try {
                                            await recalcFlatBillsApi({
                                                flat_id:    bill.flat_id,
                                                from_year:  bill.bill_year,
                                                from_month: bill.bill_month,
                                            });
                                            toast.success("Future bills recalculated ✅");
                                            loadBill();
                                        } catch (e) {
                                            toast.error("Recalc failed: " + (typeof e==="string"?e:"error"));
                                        } finally { setRecalcLoading(false); }
                                    }}
                                    style={{ padding:"5px 12px", borderRadius:6, border:"1px solid #e5e7eb",
                                        background:"#f9fafb", color:"#6b7280", cursor:"pointer", fontSize:12, fontWeight:600 }}>
                                    {recalcLoading ? "⏳ Recalc..." : "🔄 Recalc Bills"}
                                </button>
                                {!isPaid && (
                                    <button className="billing-btn billing-btn-success billing-btn-sm"
                                        onClick={() => setShowPay(true)}>
                                        💰 Record Payment
                                    </button>
                                )}
                            </div>
                        </div>
                        {(bill.receipts||[]).length === 0 ? (
                            <div style={{ textAlign:"center", color:"#9ca3af", padding:24 }}>No payments recorded yet</div>
                        ) : (
                            <table className="billing-table">
                                <thead>
                                    <tr>
                                        <th>Receipt</th><th>Date</th><th>Mode</th>
                                        <th className="text-end">Principal</th>
                                        <th className="text-end">Interest</th>
                                        <th className="text-end">Total</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(bill.receipts||[]).map((r,i) => (
                                        <tr key={i}>
                                            <td style={{ color:"#2563eb", fontWeight:600 }}>{r.receipt_no}</td>
                                            <td style={{ fontSize:12 }}>{fmtD(r.receipt_date)}</td>
                                            <td><span style={{ fontSize:11, padding:"2px 6px", background:"#f3f4f6", borderRadius:6 }}>{r.payment_mode?.toUpperCase()}</span></td>
                                            <td className="text-end">{fmt(r.principal_amount)}</td>
                                            <td className="text-end" style={{ color:"#dc2626" }}>{fmt(r.interest_amount)}</td>
                                            <td className="text-end amount-display">{fmt(r.total_amount)}</td>
                                             <td>
                                                <div className="d-flex gap-1">
                                                    <button
                                                        title="View / Download Receipt"
                                                        disabled={loadingRcpt === (r.id || r.receipt_id)}
                                                        onClick={async () => {
                                                            const rid = r.id || r.receipt_id;
                                                            setLoadingRcpt(rid);
                                                            try {
                                                                const res = await getReceiptPdfApi(rid);
                                                                setViewOldRcpt({ ...res, items: bill.items || [] });
                                                            } catch (_) {
                                                                setViewOldRcpt({
                                                                    ...r, items: bill.items || [],
                                                                    flat_number:  bill.flat_number,
                                                                    block:        bill.block,
                                                                    floor:        bill.floor,
                                                                    owner_name:   bill.owner_name,
                                                                    owner_mobile: bill.owner_mobile,
                                                                    owner_email:  bill.owner_email,
                                                                    bill_month:   bill.bill_month,
                                                                    bill_year:    bill.bill_year,
                                                                    bill_no:      bill.bill_no,
                                                                    receipt_id:   rid,
                                                                });
                                                            } finally { setLoadingRcpt(null); }
                                                        }}
                                                        style={{ padding:"5px 10px", borderRadius:6,
                                                            border:"1px solid #2563eb", background:"#eff6ff",
                                                            color:"#2563eb", cursor:"pointer", fontSize:12, fontWeight:600 }}>
                                                        {loadingRcpt===(r.id||r.receipt_id) ? "⏳" : "🧾"}
                                                    </button>
                                                    <button
                                                        title="Resend email"
                                                        onClick={async () => {
                                                            try {
                                                                await resendReceiptApi(r.id || r.receipt_id);
                                                                toast.success("Receipt resent ✅");
                                                            } catch (e) {
                                                                toast.error("Failed to resend");
                                                            }
                                                        }}
                                                        style={{ padding:"5px 10px", borderRadius:6,
                                                            border:"1px solid #e5e7eb", background:"#fff",
                                                            cursor:"pointer", fontSize:12 }}>
                                                        📧
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Right: Bill summary */}
                <div className="col-12 col-lg-5">
                    <div className="billing-card">
                        <div className="billing-card-title">📊 Bill Summary</div>

                        {[
                            { label:"Opening Principal", val:fmt(bill.opening_principal), color:parseFloat(bill.opening_principal)>0?"#dc2626":undefined },
                            { label:"Opening Interest",  val:fmt(bill.opening_interest),  color:parseFloat(bill.opening_interest)>0?"#dc2626":undefined },
                            { label:"Current Charges",   val:fmt(bill.current_charges) },
                            { label:"Interest Charged",  val:fmt(bill.interest_charged),  sub:"Simple Interest", color:parseFloat(bill.interest_charged)>0?"#dc2626":undefined },
                        ].map((row,i) => (
                            <div key={i} className="d-flex justify-content-between align-items-center mb-2 pb-2"
                                style={{ borderBottom:"1px solid #f3f4f6" }}>
                                <div>
                                    <div style={{ fontSize:14, color:"#374151" }}>{row.label}</div>
                                    {row.sub && <div style={{ fontSize:11, color:"#9ca3af" }}>{row.sub}</div>}
                                </div>
                                <div style={{ fontWeight:600, color:row.color||"#111827" }}>{row.val}</div>
                            </div>
                        ))}

                        {totalInterest > 0 && (
                            <div className="d-flex justify-content-between align-items-center mb-2 pb-2"
                                style={{ borderBottom:"1px solid #fde68a", background:"#fffbeb", margin:"0 -4px", padding:"6px 4px", borderRadius:6 }}>
                                <div>
                                    <div style={{ fontSize:14, color:"#d97706", fontWeight:600 }}>💰 Interest (Post-Due)</div>
                                    <div style={{ fontSize:11, color:"#9ca3af" }}>{interests.length} month(s)</div>
                                </div>
                                <div style={{ fontWeight:700, color:"#d97706" }}>{fmt(totalInterest)}</div>
                            </div>
                        )}
                        {totalPenalty > 0 && (
                            <div className="d-flex justify-content-between align-items-center mb-2 pb-2"
                                style={{ borderBottom:"1px solid #fecaca", background:"#fff1f2", margin:"0 -4px", padding:"6px 4px", borderRadius:6 }}>
                                <div>
                                    <div style={{ fontSize:14, color:"#dc2626", fontWeight:600 }}>🔴 Penalty Applied</div>
                                    <div style={{ fontSize:11, color:"#9ca3af" }}>{penalties.length} transaction(s)</div>
                                </div>
                                <div style={{ fontWeight:700, color:"#dc2626" }}>{fmt(totalPenalty)}</div>
                            </div>
                        )}

                        {totalWaived > 0 && (
                            <div className="d-flex justify-content-between align-items-center mb-2 pb-2"
                                style={{ borderBottom:"1px solid #ddd6fe", background:"#f5f3ff", margin:"0 -4px", padding:"6px 4px", borderRadius:6 }}>
                                <div>
                                    <div style={{ fontSize:14, color:"#7c3aed", fontWeight:600 }}>✍️ Waive-Off Applied</div>
                                    <div style={{ fontSize:11, color:"#9ca3af" }}>{waiveoffs.length} adjustment(s)</div>
                                </div>
                                <div style={{ fontWeight:700, color:"#7c3aed" }}>- {fmt(totalWaived)}</div>
                            </div>
                        )}

                        <div className="d-flex justify-content-between align-items-center my-3 py-2"
                            style={{ borderTop:"2px solid #e5e7eb", borderBottom:"2px solid #e5e7eb" }}>
                            <span style={{ fontWeight:700, fontSize:15 }}>Total Amount</span>
                            <span style={{ fontWeight:800, fontSize:18 }}>{fmt(bill.total_amount)}</span>
                        </div>

                        {[
                            { label:"Amount Paid",       val:fmt(bill.paid_amount),       color:"#059669" },
                            { label:"Balance Principal", val:fmt(bill.balance_principal),  color:"#dc2626" },
                            { label:"Balance Interest",  val:fmt(bill.balance_interest),   color:"#dc2626" },
                        ].map((row,i) => (
                            <div key={i} className="d-flex justify-content-between mb-1" style={{ fontSize:13 }}>
                                <span style={{ color:"#6b7280" }}>{row.label}</span>
                                <span style={{ fontWeight:600, color:row.color }}>{row.val}</span>
                            </div>
                        ))}

                        <div style={{
                            marginTop:16, borderRadius:10, padding:"16px 20px",
                            background:isPaid?"#d1fae5":"#fee2e2",
                            display:"flex", justifyContent:"space-between", alignItems:"center"
                        }}>
                            <span style={{ fontWeight:700, fontSize:15, color:isPaid?"#065f46":"#991b1b" }}>
                                {isPaid ? "✅ Fully Paid" : "Balance Due"}
                            </span>
                            <span style={{ fontWeight:800, fontSize:20, color:isPaid?"#059669":"#dc2626" }}>
                                {isPaid ? fmt(bill.total_amount) : fmt(balance)}
                            </span>
                        </div>

                        {!isPaid && bill.has_newer_bill ? (
                            <div style={{ background:"#fef3c7", border:"1px solid #fde68a",
                                borderRadius:10, padding:"14px 16px", marginTop:16, textAlign:"center" }}>
                                <div style={{ fontSize:14, fontWeight:700, color:"#92400e", marginBottom:4 }}>
                                    📋 Arrear Carried to Newer Bill
                                </div>
                                <div style={{ fontSize:12, color:"#78350f" }}>
                                    This balance of {fmt(balance)} has been included as opening arrear
                                    in the next month's bill. Pay the latest bill to clear this.
                                </div>
                            </div>
                        ) : !isPaid ? (
                            <button className="billing-btn billing-btn-success w-100 mt-3"
                                style={{ fontSize:15, padding:"12px 0" }}
                                onClick={() => setShowPay(true)}>
                                💰 Record Payment
                            </button>
                        ) : null}
                        {!isPaid && (parseInt(bill.balance_interest||0) > 0 || parseInt(bill.balance_principal||0) > 0) && (
                            <button className="w-100 mt-2"
                                style={{ padding:"10px 0", borderRadius:8, border:"1px solid #7c3aed",
                                    background:"#fff", color:"#7c3aed", cursor:"pointer", fontSize:13, fontWeight:600 }}
                                onClick={() => setShowWaiveOff(true)}>
                                ✍️ Apply Waive-Off
                            </button>
                        )}
                        {(bill.receipts||[]).length > 0 && (
                            <button className="w-100 mt-2"
                                style={{ padding:"10px 0", borderRadius:8, border:"1px solid #e5e7eb",
                                    background:"#f9fafb", color:"#6b7280", cursor:"pointer", fontSize:13, fontWeight:600 }}
                                onClick={async () => {
                                    const lastR = (bill.receipts||[]).slice(-1)[0];
                                    if (!lastR) return;
                                    const rid = lastR.id || lastR.receipt_id;
                                    try {
                                        const res = await getReceiptPdfApi(rid);
                                        setViewOldRcpt({ ...res, items: bill.items || [] });
                                    } catch (_) {
                                        setViewOldRcpt({ ...lastR, items: bill.items||[], ...bill });
                                    }
                                }}>
                                🧾 Download / Send Receipt
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Pay Modal */}
            {showPay && (
                <PayModal
                    bill={{ ...bill, bill_id: bill.bill_id || bill.id }}
                    onClose={() => setShowPay(false)}
                    onSuccess={(receiptData) => {
                        setShowPay(false);
                        loadBill();
                        // Show receipt modal
                        if (receiptData) {
                            setReceipt({ ...receiptData, receipt_id: receiptData.receipt_id || receiptData.id });
                        }
                    }}
                />
            )}

            {/* WaiveOff Modal */}
            {showWaiveOff && (
                <WaiveOffModal
                    bill={{ ...bill, bill_id: bill.bill_id || bill.id }}
                    onClose={() => setShowWaiveOff(false)}
                    onSuccess={() => { setShowWaiveOff(false); loadBill(); }}
                />
            )}

            {/* Receipt Viewer — after new payment */}
            {receipt && (
                <ReceiptViewer
                    receipt={receipt}
                    bill={bill}
                    society={{}}
                    onClose={() => setReceipt(null)}
                />
            )}

            {/* Receipt Viewer — view existing receipt */}
            {viewOldRcpt && (
                <ReceiptViewer
                    receipt={viewOldRcpt}
                    bill={{ ...bill, ...viewOldRcpt }}
                    society={{}}
                    onClose={() => setViewOldRcpt(null)}
                />
            )}
        </div>
    );
};

export default ViewBill;


// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import {
//     getBillApi,
//     applyWalletToBillApi,
//     recordPaymentApi,
//     getWalletDetailsApi,
//     resendReceiptApi,
//     getPenaltyHistoryApi,
//     getInterestHistoryApi,
//     getReceiptPdfApi,
// } from "../../services/BillingApi";
// import ReceiptViewer from "./ReceiptViewer";
// import "../../styles/Billing.css";

// const fmt  = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
// const fmtD = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";


// // ── Pay Modal with Wallet ────────────────────────────────────
// const PayModal = ({ bill, onClose, onSuccess }) => {
//     const billBalance = parseFloat(bill.balance_principal||0) + parseFloat(bill.balance_interest||0);
//     const [walletBalance, setWalletBalance] = useState(0);
//     const [walletLoading, setWalletLoading] = useState(true);
//     const [useWallet,     setUseWallet]     = useState(false);
//     const [loading,       setLoading]       = useState(false);
//     const [payForm, setPayForm] = useState({
//         payment_mode:"bank", bank_name:"", transaction_ref:"", cheque_no:"", narration:"",
//     });

//     useEffect(() => {
//         getWalletDetailsApi(bill.flat_id)
//             .then((r) => {
//                 const bal = parseFloat(r?.wallet?.balance || 0);
//                 setWalletBalance(bal);
//                 if (bal > 0) setUseWallet(true);
//             })
//             .catch(() => {})
//             .finally(() => setWalletLoading(false));
//     }, [bill.flat_id]);

//     const walletDeduct    = useWallet ? Math.min(walletBalance, billBalance) : 0;
//     const remainingAmount = Math.max(0, billBalance - walletDeduct);
//     const willBePaid      = remainingAmount <= 0;
//     const showBank        = ["bank","neft","rtgs","cheque"].includes(payForm.payment_mode);
//     const showCheque      = payForm.payment_mode === "cheque";
//     const showTxn         = ["bank","upi","neft","rtgs"].includes(payForm.payment_mode);

//     const handlePay = async () => {
//         setLoading(true);
//         try {
//             let receiptData = null;

//             if (useWallet && walletDeduct > 0) {
//                 await applyWalletToBillApi(bill.bill_id, walletDeduct);
//                 toast.success(willBePaid
//                     ? `✅ Bill fully paid from wallet ${fmt(walletDeduct)}`
//                     : `💜 Wallet ${fmt(walletDeduct)} applied`);
//             }

//             if (remainingAmount > 0) {
//                 receiptData = await recordPaymentApi({
//                     flat_id:          bill.flat_id,
//                     bill_id:          bill.bill_id,
//                     bill_month:       bill.bill_month,
//                     bill_year:        bill.bill_year,
//                     receipt_date:     new Date().toISOString().split("T")[0],
//                     principal_amount: Math.min(remainingAmount, parseFloat(bill.balance_principal||0)),
//                     interest_amount:  Math.max(0, remainingAmount - parseFloat(bill.balance_principal||0)),
//                     payment_mode:     payForm.payment_mode,
//                     bank_name:        payForm.bank_name       || null,
//                     transaction_ref:  payForm.transaction_ref || null,
//                     cheque_no:        payForm.cheque_no       || null,
//                     narration:        payForm.narration       || null,
//                     send_email:       false,
//                 });
//             }

//             // Wallet-only payment — build synthetic receipt for viewer
//             if (!receiptData && willBePaid) {
//                 receiptData = {
//                     receipt_no:        `WALLET-${bill.bill_id}`,
//                     receipt_date:      new Date().toISOString().split("T")[0],
//                     payment_mode:      "wallet",
//                     wallet_applied:    walletDeduct,
//                     principal_amount:  parseFloat(bill.balance_principal||0),
//                     interest_amount:   parseFloat(bill.balance_interest ||0),
//                     total_amount:      walletDeduct,
//                     balance_principal: 0,
//                     balance_interest:  0,
//                     flat_number:       bill.flat_number,
//                     block:             bill.block,
//                     floor:             bill.floor,
//                     owner_name:        bill.owner_name,
//                     owner_mobile:      bill.owner_mobile,
//                     owner_email:       bill.owner_email,
//                     bill_month:        bill.bill_month,
//                     bill_year:         bill.bill_year,
//                     bill_no:           bill.bill_no,
//                 };
//             }

//             onSuccess(receiptData);
//         } catch (e) {
//             toast.error(typeof e === "string" ? e : "Payment failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="modal show d-block" style={{ background:"rgba(0,0,0,0.5)" }}>
//             <div className="modal-dialog modal-dialog-centered modal-lg">
//                 <div className="modal-content" style={{ borderRadius:12, border:"none" }}>
//                     <div className="billing-modal-header">
//                         <span>💳 Record Payment — {bill.flat_number}{bill.block?` / ${bill.block}`:""} · {bill.bill_month} {bill.bill_year}</span>
//                         <button className="close-btn" onClick={onClose}>×</button>
//                     </div>
//                     <div style={{ padding:20 }}>

//                         {/* Bill summary */}
//                         <div style={{ background:"#f9fafb", borderRadius:8, padding:"12px 16px", marginBottom:16 }}>
//                             <div className="d-flex justify-content-between mb-1" style={{ fontSize:13 }}>
//                                 <span style={{ color:"#6b7280" }}>Total Bill</span>
//                                 <span style={{ fontWeight:600 }}>{fmt(bill.total_amount)}</span>
//                             </div>
//                             <div className="d-flex justify-content-between mb-1" style={{ fontSize:13 }}>
//                                 <span style={{ color:"#6b7280" }}>Already Paid</span>
//                                 <span style={{ color:"#059669", fontWeight:600 }}>{fmt(bill.paid_amount)}</span>
//                             </div>
//                             <div className="d-flex justify-content-between" style={{ fontSize:15, fontWeight:700, borderTop:"1px solid #e5e7eb", paddingTop:8, marginTop:4 }}>
//                                 <span>Balance Due</span>
//                                 <span style={{ color:"#dc2626" }}>{fmt(billBalance)}</span>
//                             </div>
//                         </div>

//                         {/* Wallet */}
//                         <div style={{
//                             background: useWallet && walletDeduct>0 ? "#f0fdf4":"#f5f3ff",
//                             border:`1px solid ${useWallet && walletDeduct>0?"#86efac":"#ddd6fe"}`,
//                             borderRadius:8, padding:"12px 16px", marginBottom:16
//                         }}>
//                             <div className="d-flex align-items-center justify-content-between">
//                                 <label className="d-flex align-items-center gap-2"
//                                     style={{ cursor:walletBalance>0?"pointer":"default", fontWeight:600, fontSize:13,
//                                              color:walletBalance>0?"#7c3aed":"#9ca3af" }}>
//                                     <input type="checkbox" checked={useWallet}
//                                         disabled={walletBalance<=0||walletLoading}
//                                         onChange={(e) => setUseWallet(e.target.checked)} />
//                                     💜 Use Wallet Balance
//                                 </label>
//                                 <span style={{ fontSize:13, fontWeight:600, color:walletBalance>0?"#7c3aed":"#9ca3af" }}>
//                                     {walletLoading ? "Loading..." : `Available: ${fmt(walletBalance)}`}
//                                 </span>
//                             </div>
//                             {!walletLoading && walletBalance<=0 && (
//                                 <div style={{ fontSize:11, color:"#9ca3af", marginTop:4 }}>No wallet balance available</div>
//                             )}
//                             {useWallet && walletDeduct>0 && (
//                                 <div style={{ marginTop:10 }}>
//                                     <div className="d-flex justify-content-between" style={{ fontSize:13, padding:"6px 0", borderTop:"1px solid #bbf7d0" }}>
//                                         <span style={{ color:"#065f46" }}>💜 Wallet deduction</span>
//                                         <span style={{ color:"#059669", fontWeight:700 }}>- {fmt(walletDeduct)}</span>
//                                     </div>
//                                     <div className="d-flex justify-content-between" style={{ fontSize:14, fontWeight:700, padding:"6px 0", borderTop:"1px solid #bbf7d0" }}>
//                                         <span>Remaining to Pay</span>
//                                         <span style={{ color:remainingAmount>0?"#dc2626":"#059669" }}>
//                                             {remainingAmount>0 ? fmt(remainingAmount) : "₹0.00 — Fully Paid ✅"}
//                                         </span>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Payment form */}
//                         {remainingAmount>0 && (
//                             <div className="row g-3">
//                                 <div className="col-6">
//                                     <label className="billing-form-label">Payment Mode *</label>
//                                     <select className="billing-form-input" value={payForm.payment_mode}
//                                         onChange={(e) => setPayForm({...payForm, payment_mode:e.target.value})}>
//                                         <option value="bank">Bank Transfer</option>
//                                         <option value="cash">Cash</option>
//                                         <option value="cheque">Cheque</option>
//                                         <option value="upi">UPI</option>
//                                         <option value="neft">NEFT</option>
//                                         <option value="rtgs">RTGS</option>
//                                     </select>
//                                 </div>
//                                 {showBank && (
//                                     <div className="col-6">
//                                         <label className="billing-form-label">Bank Name</label>
//                                         <input type="text" className="billing-form-input"
//                                             value={payForm.bank_name}
//                                             onChange={(e) => setPayForm({...payForm, bank_name:e.target.value})}
//                                             placeholder="HDFC Bank" />
//                                     </div>
//                                 )}
//                                 {showCheque && (
//                                     <div className="col-6">
//                                         <label className="billing-form-label">Cheque No</label>
//                                         <input type="text" className="billing-form-input"
//                                             value={payForm.cheque_no}
//                                             onChange={(e) => setPayForm({...payForm, cheque_no:e.target.value})} />
//                                     </div>
//                                 )}
//                                 {showTxn && (
//                                     <div className="col-6">
//                                         <label className="billing-form-label">Transaction Ref</label>
//                                         <input type="text" className="billing-form-input"
//                                             value={payForm.transaction_ref}
//                                             onChange={(e) => setPayForm({...payForm, transaction_ref:e.target.value})} />
//                                     </div>
//                                 )}
//                                 <div className="col-12">
//                                     <label className="billing-form-label">Narration</label>
//                                     <input type="text" className="billing-form-input"
//                                         value={payForm.narration}
//                                         onChange={(e) => setPayForm({...payForm, narration:e.target.value})}
//                                         placeholder={`${bill.bill_month} ${bill.bill_year} maintenance payment`} />
//                                 </div>
//                             </div>
//                         )}

//                         {/* Total */}
//                         <div style={{
//                             background:willBePaid?"#d1fae5":"#dbeafe",
//                             borderRadius:8, padding:"12px 16px", marginTop:16,
//                             display:"flex", justifyContent:"space-between", alignItems:"center"
//                         }}>
//                             <span style={{ fontWeight:600, color:willBePaid?"#065f46":"#1e40af" }}>
//                                 {willBePaid?"✅ Bill will be FULLY PAID":"Amount Being Paid Now"}
//                             </span>
//                             <span style={{ fontSize:16, fontWeight:700, color:willBePaid?"#059669":"#1e40af" }}>
//                                 {willBePaid ? `${fmt(walletDeduct)} (wallet)` : fmt(walletDeduct+remainingAmount)}
//                             </span>
//                         </div>

//                         <div className="d-flex justify-content-end gap-2 mt-3">
//                             <button className="billing-btn billing-btn-outline" onClick={onClose}>Cancel</button>
//                             <button className="billing-btn billing-btn-success"
//                                 onClick={handlePay} disabled={loading||walletLoading} style={{ minWidth:180 }}>
//                                 {loading ? "Processing..." :
//                                  willBePaid ? "💜 Pay from Wallet" :
//                                  walletDeduct>0 ? `💜 Wallet + Pay ${fmt(remainingAmount)}` :
//                                  `Record Payment ${fmt(remainingAmount)}`}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ── ViewBill Main ────────────────────────────────────────────
// const ViewBill = ({ setActive, billId }) => {
//     const [bill,      setBill]      = useState(null);
//     const [penalties,  setPenalties]  = useState([]);
//     const [interests,  setInterests]  = useState([]);
//     const [loading,   setLoading]   = useState(true);
//     const [showPay,     setShowPay]     = useState(false);
//     const [receipt,     setReceipt]     = useState(null);
//     const [viewOldRcpt, setViewOldRcpt] = useState(null);
//     const [loadingRcpt, setLoadingRcpt] = useState(null); // receipt id being loaded

//     useEffect(() => {
//         if (!billId) { setActive("billsList"); return; }
//         loadBill();
//     }, [billId]);

//     const loadBill = async () => {
//         setLoading(true);
//         try {
//             const res = await getBillApi(billId);
//             setBill(res);
//             // Load penalties for this bill
//             try {
//                 const pen = await getPenaltyHistoryApi({ bill_id: billId });
//                 setPenalties(pen?.penalties || []);
//             } catch (_) {}
//             try {
//                 const intr = await getInterestHistoryApi({ bill_id: billId });
//                 setInterests(intr?.transactions || []);
//             } catch (_) {}
//         } catch (e) {
//             toast.error("Failed to load bill");
//             setActive("billsList");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return (
//         <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:300 }}>
//             <div style={{ color:"#9ca3af" }}>Loading bill...</div>
//         </div>
//     );
//     if (!bill) return null;

//     const isPaid    = bill.status === "paid";
//     const isPartial = bill.status === "partial";
//     const isOverdue = bill.is_overdue || (bill.due_date && new Date(bill.due_date) < new Date() && !isPaid);
//     const balance   = parseFloat(bill.balance_principal||0) + parseFloat(bill.balance_interest||0);
//     const totalPenalty  = penalties.reduce((sum, p) => sum + parseFloat(p.penalty_amount||0), 0);
//     const totalInterest = interests.reduce((sum, i) => sum + parseFloat(i.interest_amount||0), 0);

//     return (
//         <div className="pg" style={{ padding:"20px 24px" }}>
//             <button className="billing-btn billing-btn-outline mb-3" onClick={() => setActive("billsList")}>
//                 ← Back to Bills
//             </button>

//             {/* Header */}
//             <div style={{
//                 background:"linear-gradient(135deg,#1e40af,#3b82f6)",
//                 borderRadius:14, padding:"24px 28px", marginBottom:24, color:"#fff"
//             }}>
//                 <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
//                     <div>
//                         <div style={{ fontSize:13, color:"#bfdbfe", marginBottom:4 }}>{bill.bill_no}</div>
//                         <div style={{ fontSize:24, fontWeight:800 }}>
//                             Flat {bill.flat_number}{bill.block?` / ${bill.block}`:""}
//                             {bill.floor?` · Floor ${bill.floor}`:""}
//                         </div>
//                         {bill.owner_name && (
//                             <div style={{ fontSize:14, color:"#bfdbfe", marginTop:4 }}>
//                                 👤 {(bill.owner_name||"").trim()}{bill.owner_mobile?` · ${bill.owner_mobile}`:""}
//                             </div>
//                         )}
//                         <div style={{ marginTop:12, display:"flex", gap:20, fontSize:13, color:"#bfdbfe", flexWrap:"wrap" }}>
//                             <span>📅 Bill Date: {fmtD(bill.bill_date)}</span>
//                             <span style={{ color:isOverdue?"#fca5a5":"#bfdbfe" }}>
//                                 🔴 Due: {fmtD(bill.due_date)}
//                                 {isOverdue && <span style={{ marginLeft:6, background:"rgba(220,38,38,0.3)", padding:"1px 8px", borderRadius:8, fontSize:11 }}>OVERDUE</span>}
//                             </span>
//                         </div>
//                     </div>
//                     <div style={{ textAlign:"right" }}>
//                         <div style={{ fontSize:13, color:"#bfdbfe" }}>{bill.bill_month} {bill.bill_year}</div>
//                         <div style={{ fontSize:32, fontWeight:800 }}>{fmt(bill.total_amount)}</div>
//                         {totalPenalty > 0 && (
//                             <div style={{ fontSize:12, color:"#fca5a5", marginTop:2 }}>
//                                 🔴 Includes ₹{totalPenalty.toLocaleString("en-IN")} penalty
//                             </div>
//                         )}
//                         <span style={{
//                             display:"inline-block", padding:"4px 14px", borderRadius:20,
//                             fontSize:12, fontWeight:700, marginTop:4,
//                             background:isPaid?"#059669":isPartial?"#d97706":"#dc2626",
//                         }}>
//                             {bill.status?.toUpperCase()}
//                         </span>
//                     </div>
//                 </div>
//             </div>

//             <div className="row g-4">
//                 {/* Left */}
//                 <div className="col-12 col-lg-7">

//                     {/* Charge breakdown */}
//                     <div className="billing-card mb-3">
//                         <div className="billing-card-title">🧾 Charge Breakdown</div>
//                         <table className="billing-table">
//                             <thead>
//                                 <tr><th>Head</th><th>Code</th><th>Type</th><th className="text-end">Amount</th></tr>
//                             </thead>
//                             <tbody>
//                                 {(bill.items||[]).map((item,i) => (
//                                     <tr key={i}>
//                                         <td style={{ fontWeight:600 }}>{item.head_name}</td>
//                                         <td style={{ fontSize:12, color:"#6b7280" }}>{item.head_code}</td>
//                                         <td style={{ fontSize:12 }}>{item.charge_type}</td>
//                                         <td className="text-end amount-display">{fmt(item.amount)}</td>
//                                     </tr>
//                                 ))}
//                                 {(bill.items||[]).length === 0 && (
//                                     <tr><td colSpan={4} style={{ textAlign:"center", color:"#9ca3af", padding:20 }}>No items</td></tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Penalty section */}
//                     {penalties.length > 0 && (
//                         <div className="billing-card mb-3" style={{ border:"1px solid #fecaca" }}>
//                             <div className="billing-card-title" style={{ color:"#dc2626" }}>🔴 Penalty Transactions</div>
//                             <table className="billing-table">
//                                 <thead>
//                                     <tr>
//                                         <th>Date Applied</th>
//                                         <th>Type</th>
//                                         <th>Basis Amount</th>
//                                         <th className="text-end">Penalty</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {penalties.map((p,i) => (
//                                         <tr key={i}>
//                                             <td style={{ fontSize:12 }}>{fmtD(p.applied_on)}</td>
//                                             <td>
//                                                 <span style={{ fontSize:11, padding:"2px 8px", background:"#fee2e2", color:"#991b1b", borderRadius:99 }}>
//                                                     {p.penalty_type === "percentage" ? "%" : "Fixed"}
//                                                 </span>
//                                             </td>
//                                             <td style={{ fontSize:12, color:"#6b7280" }}>{fmt(p.penalty_basis)}</td>
//                                             <td className="text-end" style={{ color:"#dc2626", fontWeight:700 }}>{fmt(p.penalty_amount)}</td>
//                                         </tr>
//                                     ))}
//                                     <tr style={{ background:"#fff1f2" }}>
//                                         <td colSpan={3} style={{ fontWeight:700, fontSize:13 }}>Total Penalty</td>
//                                         <td className="text-end" style={{ color:"#dc2626", fontWeight:800, fontSize:15 }}>{fmt(totalPenalty)}</td>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}

//                     {/* Interest transactions */}
//                     {interests.length > 0 && (
//                         <div className="billing-card mb-3" style={{ border:"1px solid #fde68a" }}>
//                             <div className="billing-card-title" style={{ color:"#d97706" }}>💰 Interest Transactions</div>
//                             <table className="billing-table">
//                                 <thead>
//                                     <tr>
//                                         <th>Date Applied</th><th>Type</th>
//                                         <th>Basis</th><th>Rate</th>
//                                         <th>Days OD</th><th className="text-end">Interest</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {interests.map((it,i) => (
//                                         <tr key={i}>
//                                             <td style={{ fontSize:12 }}>{fmtD(it.applied_on)}</td>
//                                             <td><span style={{ fontSize:11, padding:"2px 8px", background:"#fef3c7", color:"#92400e", borderRadius:99 }}>
//                                                 {it.interest_type === "C" ? "Compound" : "Simple"}
//                                             </span></td>
//                                             <td style={{ fontSize:12, color:"#6b7280" }}>{fmt(it.basis_amount)}</td>
//                                             <td style={{ fontSize:12 }}>{((parseFloat(it.annual_rate||0))*100).toFixed(1)}% p.a.</td>
//                                             <td style={{ fontSize:12, textAlign:"center" }}>{it.days_overdue}d</td>
//                                             <td className="text-end" style={{ color:"#d97706", fontWeight:700 }}>{fmt(it.interest_amount)}</td>
//                                         </tr>
//                                     ))}
//                                     <tr style={{ background:"#fffbeb" }}>
//                                         <td colSpan={5} style={{ fontWeight:700, fontSize:13 }}>Total Interest (Post-Due)</td>
//                                         <td className="text-end" style={{ color:"#d97706", fontWeight:800, fontSize:15 }}>{fmt(totalInterest)}</td>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}

//                     {/* Payment history */}
//                     <div className="billing-card">
//                         <div className="d-flex justify-content-between align-items-center mb-3">
//                             <div className="billing-card-title" style={{ margin:0 }}>💳 Payment History</div>
//                             {!isPaid && (
//                                 <button className="billing-btn billing-btn-success billing-btn-sm"
//                                     onClick={() => setShowPay(true)}>
//                                     💰 Record Payment
//                                 </button>
//                             )}
//                         </div>
//                         {(bill.receipts||[]).length === 0 ? (
//                             <div style={{ textAlign:"center", color:"#9ca3af", padding:24 }}>No payments recorded yet</div>
//                         ) : (
//                             <table className="billing-table">
//                                 <thead>
//                                     <tr>
//                                         <th>Receipt</th><th>Date</th><th>Mode</th>
//                                         <th className="text-end">Principal</th>
//                                         <th className="text-end">Interest</th>
//                                         <th className="text-end">Total</th>
//                                         <th>Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {(bill.receipts||[]).map((r,i) => (
//                                         <tr key={i}>
//                                             <td style={{ color:"#2563eb", fontWeight:600 }}>{r.receipt_no}</td>
//                                             <td style={{ fontSize:12 }}>{fmtD(r.receipt_date)}</td>
//                                             <td><span style={{ fontSize:11, padding:"2px 6px", background:"#f3f4f6", borderRadius:6 }}>{r.payment_mode?.toUpperCase()}</span></td>
//                                             <td className="text-end">{fmt(r.principal_amount)}</td>
//                                             <td className="text-end" style={{ color:"#dc2626" }}>{fmt(r.interest_amount)}</td>
//                                             <td className="text-end amount-display">{fmt(r.total_amount)}</td>
//                                             <td>
//                                                 <button
//                                                     className="billing-btn billing-btn-outline billing-btn-sm"
//                                                     title="Resend receipt"
//                                                     onClick={async () => {
//                                                         try {
//                                                             await resendReceiptApi(r.id || r.receipt_id);
//                                                             toast.success("Receipt resent ✅");
//                                                         } catch (e) {
//                                                             toast.error("Failed to resend");
//                                                         }
//                                                     }}>
//                                                     📧
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         )}
//                     </div>
//                 </div>

//                 {/* Right: Bill summary */}
//                 <div className="col-12 col-lg-5">
//                     <div className="billing-card">
//                         <div className="billing-card-title">📊 Bill Summary</div>

//                         {[
//                             { label:"Opening Principal", val:fmt(bill.opening_principal), color:parseFloat(bill.opening_principal)>0?"#dc2626":undefined },
//                             { label:"Opening Interest",  val:fmt(bill.opening_interest),  color:parseFloat(bill.opening_interest)>0?"#dc2626":undefined },
//                             { label:"Current Charges",   val:fmt(bill.current_charges) },
//                             { label:"Interest Charged",  val:fmt(bill.interest_charged),  sub:"Simple Interest", color:parseFloat(bill.interest_charged)>0?"#dc2626":undefined },
//                         ].map((row,i) => (
//                             <div key={i} className="d-flex justify-content-between align-items-center mb-2 pb-2"
//                                 style={{ borderBottom:"1px solid #f3f4f6" }}>
//                                 <div>
//                                     <div style={{ fontSize:14, color:"#374151" }}>{row.label}</div>
//                                     {row.sub && <div style={{ fontSize:11, color:"#9ca3af" }}>{row.sub}</div>}
//                                 </div>
//                                 <div style={{ fontWeight:600, color:row.color||"#111827" }}>{row.val}</div>
//                             </div>
//                         ))}

//                         {totalInterest > 0 && (
//                             <div className="d-flex justify-content-between align-items-center mb-2 pb-2"
//                                 style={{ borderBottom:"1px solid #fde68a", background:"#fffbeb", margin:"0 -4px", padding:"6px 4px", borderRadius:6 }}>
//                                 <div>
//                                     <div style={{ fontSize:14, color:"#d97706", fontWeight:600 }}>💰 Interest (Post-Due)</div>
//                                     <div style={{ fontSize:11, color:"#9ca3af" }}>{interests.length} month(s)</div>
//                                 </div>
//                                 <div style={{ fontWeight:700, color:"#d97706" }}>{fmt(totalInterest)}</div>
//                             </div>
//                         )}
//                         {totalPenalty > 0 && (
//                             <div className="d-flex justify-content-between align-items-center mb-2 pb-2"
//                                 style={{ borderBottom:"1px solid #fecaca", background:"#fff1f2", margin:"0 -4px", padding:"6px 4px", borderRadius:6 }}>
//                                 <div>
//                                     <div style={{ fontSize:14, color:"#dc2626", fontWeight:600 }}>🔴 Penalty Applied</div>
//                                     <div style={{ fontSize:11, color:"#9ca3af" }}>{penalties.length} transaction(s)</div>
//                                 </div>
//                                 <div style={{ fontWeight:700, color:"#dc2626" }}>{fmt(totalPenalty)}</div>
//                             </div>
//                         )}

//                         <div className="d-flex justify-content-between align-items-center my-3 py-2"
//                             style={{ borderTop:"2px solid #e5e7eb", borderBottom:"2px solid #e5e7eb" }}>
//                             <span style={{ fontWeight:700, fontSize:15 }}>Total Amount</span>
//                             <span style={{ fontWeight:800, fontSize:18 }}>{fmt(bill.total_amount)}</span>
//                         </div>

//                         {[
//                             { label:"Amount Paid",       val:fmt(bill.paid_amount),       color:"#059669" },
//                             { label:"Balance Principal", val:fmt(bill.balance_principal),  color:"#dc2626" },
//                             { label:"Balance Interest",  val:fmt(bill.balance_interest),   color:"#dc2626" },
//                         ].map((row,i) => (
//                             <div key={i} className="d-flex justify-content-between mb-1" style={{ fontSize:13 }}>
//                                 <span style={{ color:"#6b7280" }}>{row.label}</span>
//                                 <span style={{ fontWeight:600, color:row.color }}>{row.val}</span>
//                             </div>
//                         ))}

//                         <div style={{
//                             marginTop:16, borderRadius:10, padding:"16px 20px",
//                             background:isPaid?"#d1fae5":"#fee2e2",
//                             display:"flex", justifyContent:"space-between", alignItems:"center"
//                         }}>
//                             <span style={{ fontWeight:700, fontSize:15, color:isPaid?"#065f46":"#991b1b" }}>
//                                 {isPaid ? "✅ Fully Paid" : "Balance Due"}
//                             </span>
//                             <span style={{ fontWeight:800, fontSize:20, color:isPaid?"#059669":"#dc2626" }}>
//                                 {isPaid ? fmt(bill.total_amount) : fmt(balance)}
//                             </span>
//                         </div>

//                         {!isPaid && (
//                             <button className="billing-btn billing-btn-success w-100 mt-3"
//                                 style={{ fontSize:15, padding:"12px 0" }}
//                                 onClick={() => setShowPay(true)}>
//                                 💰 Record Payment
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Pay Modal */}
//             {showPay && (
//                 <PayModal
//                     bill={{ ...bill, bill_id: bill.bill_id || bill.id }}
//                     onClose={() => setShowPay(false)}
//                     onSuccess={(receiptData) => {
//                         setShowPay(false);
//                         loadBill();
//                         // Show receipt modal
//                         if (receiptData) {
//                             setReceipt({ ...receiptData, receipt_id: receiptData.receipt_id || receiptData.id });
//                         }
//                     }}
//                 />
//             )}

//             {/* Receipt Viewer — after new payment */}
//             {receipt && (
//                 <ReceiptViewer
//                     receipt={receipt}
//                     bill={bill}
//                     society={{}}
//                     onClose={() => setReceipt(null)}
//                 />
//             )}

//             {/* Receipt Viewer — view existing receipt */}
//             {viewOldRcpt && (
//                 <ReceiptViewer
//                     receipt={viewOldRcpt}
//                     bill={{ ...bill, ...viewOldRcpt }}
//                     society={{}}
//                     onClose={() => setViewOldRcpt(null)}
//                 />
//             )}
//         </div>
//     );
// };

// export default ViewBill;