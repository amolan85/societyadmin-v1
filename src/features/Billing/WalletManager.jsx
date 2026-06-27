import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiSend, FiPlus, FiEye } from "react-icons/fi";
import { Pagination } from "../../components/Common/ReusableFunction";
import { creditWalletApi, listWalletBalancesApi, getWalletDetailsApi } from "../../services/BillingApi";
import { getAllMembersWithoutPaginationApi } from "../../services/AddMemberApi";
import { GetSessionData } from "../../utils/SessionManagement";
import "../../styles/Billing.css";

const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

const getSessionSocietyId = () => {
    const s = GetSessionData();
    return s?.data?.flats?.[0]?.society_id || null;
};

// ─── Credit Wallet Modal ──────────────────────────────────────────────────────
const CreditWalletModal = ({ flats, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        flat_id:         "",
        amount:          "",
        txn_source:      "bank",
        bank_name:       "",
        transaction_ref: "",
        narration:       "",
        credit_date:     new Date().toISOString().split("T")[0],
        send_email:      true,
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!form.flat_id) { toast.error("Select a flat");    return; }
        if (!form.amount)  { toast.error("Enter amount");     return; }
        if (parseFloat(form.amount) <= 0) { toast.error("Amount must be > 0"); return; }

        setSaving(true);
        try {
            const res = await creditWalletApi({
                flat_id:         parseInt(form.flat_id),
                amount:          parseFloat(form.amount),
                txn_source:      form.txn_source,
                bank_name:       form.bank_name       || null,
                transaction_ref: form.transaction_ref || null,
                narration:       form.narration       || null,
                credit_date:     form.credit_date     || null,
                send_email:      form.send_email,
            });
            toast.success(`Wallet credited ₹${form.amount} successfully${res?.email_sent ? " · Email sent" : ""}`);
            onSuccess(res);
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to credit wallet");
        } finally {
            setSaving(false);
        }
    };

    const selectedFlat = flats.find((f) => String(f.flat_id) === String(form.flat_id));

    return (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.45)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ borderRadius: 12, border: "none" }}>
                    <div className="billing-modal-header" style={{ background: "#7c3aed" }}>
                        <span>💜 Credit Wallet / Add Advance Payment</span>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                    <div style={{ padding: 20 }}>

                        <div style={{
                            background: "#f5f3ff", border: "1px solid #ddd6fe",
                            borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                            fontSize: 12, color: "#6d28d9"
                        }}>
                            Credits will be auto-deducted from future maintenance bills.
                            Owner will receive email confirmation with PDF.
                        </div>

                        <div className="row g-3">
                            {/* Flat */}
                            <div className="col-12">
                                <label className="billing-form-label">Flat *</label>
                                <select className="billing-form-input"
                                    value={form.flat_id}
                                    onChange={(e) => setForm({ ...form, flat_id: e.target.value })}>
                                    <option value="">Select Flat</option>
                                    {flats.map((f) => (
                                        <option key={f.flat_id} value={f.flat_id}>
                                            {f.flat_number}{f.block ? ` / ${f.block}` : ""}
                                            {f.owner_name ? ` — ${f.owner_name}` : ""}
                                        </option>
                                    ))}
                                </select>
                                {selectedFlat?.owner_mobile && (
                                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>
                                        📱 {selectedFlat.owner_mobile}
                                        {selectedFlat.owner_email ? ` · ✉️ ${selectedFlat.owner_email}` : ""}
                                    </div>
                                )}
                            </div>

                            {/* Amount */}
                            <div className="col-6">
                                <label className="billing-form-label">Amount (₹) *</label>
                                <input type="number" className="billing-form-input"
                                    min="0" step="0.01"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    placeholder="5000.00" />
                            </div>

                            {/* Credit date */}
                            <div className="col-6">
                                <label className="billing-form-label">Credit Date</label>
                                <input type="date" className="billing-form-input"
                                    value={form.credit_date}
                                    onChange={(e) => setForm({ ...form, credit_date: e.target.value })} />
                            </div>

                            {/* Payment source */}
                            <div className="col-6">
                                <label className="billing-form-label">Payment Source</label>
                                <select className="billing-form-input"
                                    value={form.txn_source}
                                    onChange={(e) => setForm({ ...form, txn_source: e.target.value })}>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="cash">Cash</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="upi">UPI</option>
                                    <option value="neft">NEFT</option>
                                    <option value="rtgs">RTGS</option>
                                </select>
                            </div>

                            {/* Bank name */}
                            {["bank","neft","rtgs","cheque"].includes(form.txn_source) && (
                                <div className="col-6">
                                    <label className="billing-form-label">Bank Name</label>
                                    <input type="text" className="billing-form-input"
                                        value={form.bank_name}
                                        onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
                                        placeholder="HDFC Bank" />
                                </div>
                            )}

                            {/* Transaction ref */}
                            <div className="col-12">
                                <label className="billing-form-label">Transaction Reference / Cheque No *</label>
                                <input type="text" className="billing-form-input"
                                    value={form.transaction_ref}
                                    onChange={(e) => setForm({ ...form, transaction_ref: e.target.value })}
                                    placeholder="UTR / Cheque No / UPI Ref" />
                            </div>

                            {/* Narration */}
                            <div className="col-12">
                                <label className="billing-form-label">Narration / Remarks</label>
                                <input type="text" className="billing-form-input"
                                    value={form.narration}
                                    onChange={(e) => setForm({ ...form, narration: e.target.value })}
                                    placeholder="e.g. Advance maintenance payment for 2026-27" />
                            </div>

                            {/* Preview */}
                            {form.amount && parseFloat(form.amount) > 0 && (
                                <div className="col-12">
                                    <div style={{
                                        background: "#f5f3ff", border: "1px solid #ddd6fe",
                                        borderRadius: 8, padding: "10px 14px",
                                        display: "flex", justifyContent: "space-between",
                                        fontSize: 14, fontWeight: 700
                                    }}>
                                        <span style={{ color: "#6d28d9" }}>Amount to Credit</span>
                                        <span style={{ color: "#7c3aed" }}>{fmt(form.amount)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Send email toggle */}
                            <div className="col-12">
                                <label className="d-flex align-items-center gap-2"
                                    style={{ cursor: "pointer", fontSize: 13 }}>
                                    <input type="checkbox"
                                        checked={form.send_email}
                                        onChange={(e) => setForm({ ...form, send_email: e.target.checked })} />
                                    ✉️ Send confirmation email + PDF to owner
                                </label>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button className="billing-btn billing-btn-outline" onClick={onClose}>Cancel</button>
                            <button
                                className="billing-btn billing-btn-primary"
                                onClick={handleSave}
                                disabled={saving}
                                style={{ background: "#7c3aed" }}>
                                {saving ? "Crediting..." : "💜 Credit Wallet"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Wallet Details Modal ─────────────────────────────────────────────────────
const WalletDetailModal = ({ flatId, flatLabel, onClose }) => {
    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getWalletDetailsApi(flatId)
            .then((res) => setData(res))
            .catch(() => toast.error("Failed to load wallet"))
            .finally(() => setLoading(false));
    }, [flatId]);

    const wallet = data?.wallet;
    const txns   = data?.transactions || [];

    return (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.45)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content" style={{ borderRadius: 12, border: "none" }}>
                    <div className="billing-modal-header" style={{ background: "#7c3aed" }}>
                        <span>💜 Wallet — {flatLabel}</span>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                    <div style={{ padding: 20 }}>
                        {loading ? (
                            <div style={{ textAlign: "center", color: "#9ca3af", padding: 24 }}>Loading...</div>
                        ) : (
                            <>
                                {/* Wallet summary */}
                                {wallet && (
                                    <div className="d-flex gap-3 mb-3 flex-wrap">
                                        {[
                                            { label: "Balance",    val: fmt(wallet.balance),        color: "#7c3aed" },
                                            { label: "Credited",   val: fmt(wallet.total_credited), color: "#059669" },
                                            { label: "Debited",    val: fmt(wallet.total_debited),  color: "#dc2626" },
                                        ].map((s) => (
                                            <div key={s.label} style={{
                                                flex: 1, background: "#f5f3ff",
                                                border: "1px solid #ddd6fe", borderRadius: 10,
                                                padding: "12px 16px"
                                            }}>
                                                <div style={{ fontSize: 11, color: "#6b7280" }}>{s.label}</div>
                                                <div style={{ fontWeight: 700, color: s.color, fontSize: 18 }}>{s.val}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Transaction history */}
                                <div className="billing-card-title">📋 Transaction History</div>
                                <table className="billing-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Source</th>
                                            <th>Narration</th>
                                            <th className="text-end">Amount</th>
                                            <th className="text-end">Balance After</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {txns.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: 20 }}>
                                                    No transactions yet
                                                </td>
                                            </tr>
                                        ) : txns.map((t) => (
                                            <tr key={t.id}>
                                                <td style={{ fontSize: 12 }}>{t.created_at}</td>
                                                <td>
                                                    <span style={{
                                                        fontSize: 11, padding: "2px 8px", borderRadius: 12,
                                                        background: t.txn_type === "credit" ? "#d1fae5" : "#fee2e2",
                                                        color: t.txn_type === "credit" ? "#065f46" : "#991b1b",
                                                        fontWeight: 600
                                                    }}>
                                                        {t.txn_type?.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: 12 }}>{t.txn_source}</td>
                                                <td style={{ fontSize: 12, color: "#6b7280" }}>
                                                    {t.narration || "—"}
                                                    {t.bill_no ? ` · ${t.bill_no}` : ""}
                                                </td>
                                                <td className="text-end" style={{
                                                    fontWeight: 600,
                                                    color: t.txn_type === "credit" ? "#059669" : "#dc2626"
                                                }}>
                                                    {t.txn_type === "credit" ? "+" : "-"}{fmt(t.amount)}
                                                </td>
                                                <td className="text-end amount-display">{fmt(t.balance_after)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


// ─── Main WalletManager ───────────────────────────────────────────────────────
const WalletManager = ({ setActive }) => {
    const [wallets,      setWallets]      = useState([]);
    const [total,        setTotal]        = useState(0);
    const [page,         setPage]         = useState(1);
    const [pageSize]                      = useState(20);
    const [flats,        setFlats]        = useState([]);
    const [showCredit,   setShowCredit]   = useState(false);
    const [showDetail,   setShowDetail]   = useState(false);
    const [selectedFlat, setSelectedFlat] = useState(null);

    useEffect(() => {
        loadWallets();
        loadFlats();
    }, [page]);

    const loadWallets = async () => {
        try {
            const res = await listWalletBalancesApi(page, pageSize);
            setWallets(res?.wallets || []);
            setTotal(res?.pagination?.total || 0);
        } catch (e) {
            toast.error("Failed to load wallets");
        }
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
                    opts.push({
                        flat_id:     m.flat_id,
                        flat_number: m.flat_number,
                        block:       m.block,
                        owner_name:  m.owner_name  || m.first_name || "",
                        owner_mobile:m.mobile      || "",
                        owner_email: m.email       || "",
                    });
                }
            });
            setFlats(opts);
        } catch (_) {}
    };

    return (
        <div className="pg" style={{ padding: "20px 24px" }}>

            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                <div>
                    <h4 style={{ fontWeight: 700, margin: 0 }}>💜 Wallet Management</h4>
                    <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
                        Advance payments and wallet balances
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button className="billing-btn billing-btn-outline"
                        onClick={() => setActive("billingDashboard")}>← Dashboard</button>
                    <button
                        className="billing-btn billing-btn-primary"
                        style={{ background: "#7c3aed" }}
                        onClick={() => setShowCredit(true)}>
                        <FiPlus size={13} /> Credit Wallet
                    </button>
                </div>
            </div>

            {/* Wallets with balance */}
            <div className="billing-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontWeight: 600, color: "#374151" }}>
                        Flats with Wallet Balance ({total})
                    </span>
                </div>
                {wallets.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>💜</div>
                        <div>No wallet balances yet</div>
                        <div style={{ fontSize: 12 }}>Credit a flat's wallet to get started</div>
                    </div>
                ) : (
                    <table className="billing-table">
                        <thead>
                            <tr>
                                <th>Flat</th>
                                <th>Owner</th>
                                <th className="text-end">Balance</th>
                                <th className="text-end">Total Credited</th>
                                <th className="text-end">Total Used</th>
                                <th>Last Updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wallets.map((w) => (
                                <tr key={w.id}>
                                    <td style={{ fontWeight: 600 }}>
                                        {w.flat_number}{w.block ? ` / ${w.block}` : ""}
                                    </td>
                                    <td>
                                        <div style={{ fontSize: 13 }}>{(w.owner_name || "").trim() || "—"}</div>
                                        <div style={{ fontSize: 11, color: "#9ca3af" }}>{w.owner_mobile || ""}</div>
                                    </td>
                                    <td className="text-end">
                                        <span style={{ fontWeight: 700, color: "#7c3aed", fontSize: 15 }}>
                                            {fmt(w.balance)}
                                        </span>
                                    </td>
                                    <td className="text-end amount-green">{fmt(w.total_credited)}</td>
                                    <td className="text-end amount-red">{fmt(w.total_debited)}</td>
                                    <td style={{ fontSize: 12, color: "#6b7280" }}>{w.last_updated || "—"}</td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <button
                                                className="billing-btn billing-btn-outline billing-btn-sm"
                                                title="View transactions"
                                                onClick={() => {
                                                    setSelectedFlat({
                                                        flat_id: w.flat_id,
                                                        label: `${w.flat_number}${w.block ? ` / ${w.block}` : ""}`
                                                    });
                                                    setShowDetail(true);
                                                }}>
                                                <FiEye size={12} />
                                            </button>
                                            <button
                                                className="billing-btn billing-btn-primary billing-btn-sm"
                                                style={{ background: "#7c3aed" }}
                                                title="Add more credit"
                                                onClick={() => setShowCredit(true)}>
                                                <FiPlus size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {total > pageSize && (
                    <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6" }}>
                        <Pagination page={page} total={Math.ceil(total / pageSize)} onChange={setPage} />
                    </div>
                )}
            </div>

            {/* Modals */}
            {showCredit && (
                <CreditWalletModal
                    flats={flats}
                    onClose={() => setShowCredit(false)}
                    onSuccess={() => { setShowCredit(false); loadWallets(); }}
                />
            )}

            {showDetail && selectedFlat && (
                <WalletDetailModal
                    flatId={selectedFlat.flat_id}
                    flatLabel={selectedFlat.label}
                    onClose={() => { setShowDetail(false); setSelectedFlat(null); }}
                />
            )}
        </div>
    );
};

export default WalletManager;