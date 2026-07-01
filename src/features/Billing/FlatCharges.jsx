import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { FiEdit2, FiRefreshCw, FiSearch, FiPlus, FiTrash2 } from "react-icons/fi";
import { Pagination } from "../../components/Common/ReusableFunction";
import {
    listFlatChargeConfigsApi,
    listChargeHeadsApi,
    overrideFlatChargeApi,
    resetFlatChargeOverrideApi,
    getFlatChargeConfigApi,
    addFlatChargeApi,
    removeFlatChargeApi,
} from "../../services/BillingApi";
import { getAllMembersWithoutPaginationApi } from "../../services/AddMemberApi";
import { GetSessionData } from "../../utils/SessionManagement";
import "../../styles/Billing.css";

const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

// ─── Get society_id directly — same pattern as ParkingDashboard ──────────────
const getSessionSocietyId = () => {
    const s = GetSessionData();
    return s?.data?.flats?.[0]?.society_id || null;
};

// ─── Flat Summary Modal ───────────────────────────────────────────────────────
const FlatSummaryModal = ({ flatId, flatLabel, onClose }) => {
    const [charges, setCharges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFlatChargeConfigApi(flatId)
            .then((res) => setCharges(res?.charges || []))
            .catch(() => toast.error("Failed to load flat charges"))
            .finally(() => setLoading(false));
    }, [flatId]);

    const total = charges.reduce((s, c) => s + parseFloat(c.amount || 0), 0);

    return (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.45)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ borderRadius: 12, border: "none" }}>
                    <div className="billing-modal-header">
                        <span>🏠 {flatLabel} — Monthly Charges</span>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                    <div style={{ padding: 20 }}>
                        {loading ? (
                            <div style={{ textAlign: "center", color: "#9ca3af", padding: 24 }}>Loading...</div>
                        ) : charges.length === 0 ? (
                            <div style={{ textAlign: "center", color: "#9ca3af", padding: 24 }}>
                                No charges configured
                            </div>
                        ) : (
                            <table className="billing-table">
                                <thead>
                                    <tr>
                                        <th>Head</th>
                                        <th>Type</th>
                                        <th className="text-end">Amount</th>
                                        <th>Source</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {charges.map((c) => (
                                        <tr key={c.head_id}>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{c.head_name}</div>
                                                <div style={{ fontSize: 11, color: "#6b7280" }}>{c.head_code}</div>
                                            </td>
                                            <td>
                                                <span className={`scope-badge ${c.charge_type}`} style={{ fontSize: 10 }}>
                                                    {c.charge_type === "per_sqft" ? `₹${c.rate_per_sqft}/sqft` : "Fixed"}
                                                </span>
                                            </td>
                                            <td className="text-end amount-display">{fmt(c.amount)}</td>
                                            <td>
                                                {c.is_override
                                                    ? <span className="override-badge">Override</span>
                                                    : <span style={{ fontSize: 11, color: "#059669" }}>Auto</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={2} style={{ fontWeight: 700, paddingTop: 10 }}>Total Monthly</td>
                                        <td className="text-end amount-display"
                                            style={{ fontWeight: 800, color: "#2563eb", paddingTop: 10 }}>
                                            {fmt(total)}
                                        </td>
                                        <td />
                                    </tr>
                                </tfoot>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Add / Edit Charge Modal ──────────────────────────────────────────────────
const ChargeModal = ({ mode, config, heads, flats, onSave, onClose }) => {
    const isEdit = mode === "edit";
    const [form, setForm] = useState({
        flat_id:        isEdit ? config?.flat_id        : "",
        head_id:        isEdit ? String(config?.head_id || "") : "",
        charge_type:    isEdit ? (config?.charge_basis || config?.charge_type || "fixed") : "fixed",
        amount:         isEdit ? (config?.amount        || "") : "",
        rate_per_sqft:  isEdit ? (config?.rate_per_sqft || "") : "",
        percentage_rate:     "",
        percentage_of_heads: "",
        effective_from: "",
        effective_to:   "",
    });
    const [saving, setSaving] = useState(false);

    // When head changes, auto-fill amount/rate from charge head config
    const handleHeadChange = (headId) => {
        const head = heads.find((h) => String(h.id) === String(headId));
        if (!head) { setForm(f => ({...f, head_id: headId})); return; }
        const basis = head.charge_basis || head.charge_type || "fixed";
        setForm(prev => ({
            ...prev,
            head_id:             headId,
            charge_type:         basis,
            percentage_rate:     basis === "percentage" ? String(head.percentage_rate || "") : "",
            percentage_of_heads: basis === "percentage" ? String(head.percentage_of_heads || "") : "",
            // Auto-fill centralised defaults
            amount:        basis === "fixed"
                               ? String(head.centralised_amount || prev.amount || "")
                               : basis === "percentage" ? "0" : prev.amount,
            rate_per_sqft: basis === "per_sqft"
                               ? String(head.centralised_rate || prev.rate_per_sqft || "")
                               : prev.rate_per_sqft,
        }));
    };

    const handleSave = async () => {
        if (!form.flat_id) { toast.error("Select a flat"); return; }
        if (!form.head_id) { toast.error("Select a charge head"); return; }
        if (form.charge_type === "fixed"    && (!form.amount || parseFloat(form.amount) < 0))
            { toast.error("Enter a valid amount"); return; }
        if (form.charge_type === "per_sqft" && !form.rate_per_sqft)
            { toast.error("Rate per sqft is required"); return; }
        // percentage: computed at bill generation — no amount needed

        setSaving(true);
        try {
            await onSave({
                flat_id:       parseInt(form.flat_id),
                head_id:       parseInt(form.head_id),
                charge_type:   form.charge_type,
                charge_basis:  form.charge_type,
                amount:        form.charge_type === "fixed"
                                   ? parseFloat(form.amount)
                                   : form.charge_type === "percentage" ? 0 : null,
                rate_per_sqft: form.charge_type === "per_sqft" ? parseFloat(form.rate_per_sqft) : null,
                effective_from: form.effective_from || null,
                effective_to:   form.effective_to   || null,
            });
            onClose();
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const selectedFlat = flats.find((f) => String(f.flat_id) === String(form.flat_id));
    const selectedHead = heads.find((h) => String(h.id)      === String(form.head_id));
    const basis        = form.charge_type;

    // For percentage: compute preview
    const pctHeadIds = (form.percentage_of_heads || "").split(",").filter(Boolean);
    const pctBaseHeads = heads.filter(h => pctHeadIds.includes(String(h.id)));
    const pctBaseSum   = pctBaseHeads.reduce((s,h) => s + parseFloat(h.centralised_amount||0), 0);
    const pctPreview   = pctBaseSum > 0 ? (pctBaseSum * parseFloat(form.percentage_rate||0) / 100).toFixed(2) : null;

    // For per_sqft: compute preview
    const sqftPreview  = selectedFlat?.area_sqft && form.rate_per_sqft
        ? (parseFloat(form.rate_per_sqft) * parseFloat(selectedFlat.area_sqft)).toFixed(2)
        : null;

    return (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.45)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ borderRadius: 12, border: "none" }}>
                    <div className="billing-modal-header">
                        <span>{isEdit ? "✏️ Edit Charge" : "➕ Add Individual Charge"}</span>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                    <div style={{ padding: 20 }}>
                        <div className="row g-3">

                            {/* Flat */}
                            <div className="col-12">
                                <label className="billing-form-label">Flat *</label>
                                <select className="billing-form-input"
                                    value={form.flat_id}
                                    onChange={(e) => setForm({ ...form, flat_id: e.target.value })}
                                    disabled={isEdit}>
                                    <option value="">Select Flat</option>
                                    {flats.map((f) => (
                                        <option key={f.flat_id} value={f.flat_id}>
                                            {f.flat_number}{f.block ? ` / ${f.block}` : ""}
                                            {f.area_sqft ? ` (${f.area_sqft} sqft)` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Charge Head */}
                            <div className="col-12">
                                <label className="billing-form-label">Charge Head *</label>
                                <select className="billing-form-input"
                                    value={form.head_id}
                                    onChange={(e) => handleHeadChange(e.target.value)}
                                    disabled={isEdit}>
                                    <option value="">Select Charge Head</option>
                                    {heads.map((h) => (
                                        <option key={h.id} value={h.id}>
                                            {h.head_name} ({h.head_code})
                                            {h.charge_basis === "percentage" ? ` — ${h.percentage_rate}% based` :
                                             h.charge_basis === "per_sqft"   ? ` — ₹${h.centralised_rate}/sqft` :
                                             h.centralised_amount             ? ` — ₹${h.centralised_amount}` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Amount section based on charge basis */}
                            {basis === "percentage" ? (
                                <div className="col-12">
                                    <div style={{ background:"#f5f3ff", border:"1px solid #ddd6fe",
                                        borderRadius:8, padding:"12px 14px" }}>
                                        <div style={{ fontWeight:700, color:"#7c3aed", marginBottom:4, fontSize:13 }}>
                                            ⚙️ Percentage-Based — Auto Calculated
                                        </div>
                                        <div style={{ fontSize:12, color:"#6b7280", marginBottom:6 }}>
                                            {form.percentage_rate}% of {pctBaseHeads.length > 0
                                                ? pctBaseHeads.map(h=>h.head_name).join(" + ")
                                                : "selected base charges"}
                                        </div>
                                        {pctPreview && (
                                            <div style={{ fontSize:14, fontWeight:700, color:"#7c3aed" }}>
                                                Estimated: ₹{pctPreview}
                                                <span style={{ fontSize:11, color:"#9ca3af", marginLeft:8 }}>
                                                    (exact amount computed at bill generation)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : basis === "per_sqft" ? (
                                <>
                                    <div className="col-12">
                                        <label className="billing-form-label">Rate Per SqFt (₹) *</label>
                                        <input type="number" className="billing-form-input"
                                            min="0" step="0.001" value={form.rate_per_sqft}
                                            onChange={(e) => setForm({ ...form, rate_per_sqft: e.target.value })}
                                            placeholder="e.g. 2.50" />
                                        {sqftPreview && (
                                            <div style={{ fontSize:12, color:"#059669", marginTop:4 }}>
                                                = ₹{sqftPreview} for {selectedFlat.area_sqft} sqft
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="col-12">
                                    <label className="billing-form-label">Amount (₹) *</label>
                                    <input type="number" className="billing-form-input"
                                        min="0" step="0.01" value={form.amount}
                                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                        placeholder="0.00"
                                        style={{ fontSize:16, fontWeight:700 }} />
                                    {selectedHead?.charge_scope === "centralised" && selectedHead.centralised_amount && (
                                        <div style={{ fontSize:11, color:"#6b7280", marginTop:3 }}>
                                            Centralised default: ₹{selectedHead.centralised_amount}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Charge Type radio — only for non-percentage manual override */}
                            {basis !== "percentage" && (
                                <div className="col-12">
                                    <label className="billing-form-label">Charge Type</label>
                                    <div className="d-flex gap-3">
                                        {[["fixed","₹ Fixed Amount"],["per_sqft","₹/SqFt"]].map(([t,l]) => (
                                            <label key={t} className="d-flex align-items-center gap-2"
                                                style={{ cursor:"pointer", fontSize:13 }}>
                                                <input type="radio" name="charge_type"
                                                    checked={form.charge_type === t}
                                                    onChange={() => setForm(f => ({
                                                        ...f, charge_type:t,
                                                        amount: t==="fixed" ? f.amount : "",
                                                        rate_per_sqft: t==="per_sqft" ? f.rate_per_sqft : "",
                                                    }))} />
                                                {l}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Date range */}
                            <div className="col-6">
                                <label className="billing-form-label">Effective From</label>
                                <input type="date" className="billing-form-input"
                                    value={form.effective_from}
                                    onChange={(e) => setForm({ ...form, effective_from: e.target.value })} />
                            </div>
                            <div className="col-6">
                                <label className="billing-form-label">Effective To</label>
                                <input type="date" className="billing-form-input"
                                    value={form.effective_to}
                                    onChange={(e) => setForm({ ...form, effective_to: e.target.value })} />
                            </div>

                            {/* Head info box */}
                            {selectedHead && basis !== "percentage" && (
                                <div className="col-12">
                                    <div style={{ background:"#f0f9ff", border:"1px solid #bae6fd",
                                        borderRadius:8, padding:"8px 12px", fontSize:12, color:"#0369a1" }}>
                                        <b>{selectedHead.head_name}</b> ·{" "}
                                        {selectedHead.charge_scope === "centralised"
                                            ? `Default: ${basis === "per_sqft"
                                                ? `₹${selectedHead.centralised_rate}/sqft`
                                                : `₹${selectedHead.centralised_amount}`}`
                                            : "Per Flat charge"}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button className="billing-btn billing-btn-outline" onClick={onClose}>Cancel</button>
                            <button className="billing-btn billing-btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? "Saving..." : isEdit ? "Update" : "Add Charge"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



// ─── Main Component ───────────────────────────────────────────────────────────
const FlatCharges = ({ setActive }) => {

    const [configs,   setConfigs]   = useState([]);
    const [heads,     setHeads]     = useState([]);
    const [flats,     setFlats]     = useState([]);
    const [page,      setPage]      = useState(1);
    const [pageSize]                = useState(20);
    const [total,     setTotal]     = useState(0);
    const [loading,   setLoading]   = useState(false);

    // Filters
    const [filterHead,      setFilterHead]     = useState("");
    const [filterPropType,  setFilterPropType] = useState("");
    const [filterFlat,      setFilterFlat]     = useState("");
    const [filterOverride,  setFilterOverride] = useState("");
    const [searchInput,     setSearchInput]    = useState("");
    const [appliedSearch,   setAppliedSearch]  = useState("");

    // Modals
    const [showAddModal,    setShowAddModal]   = useState(false);
    const [showEditModal,   setShowEditModal]  = useState(false);
    const [editConfig,      setEditConfig]     = useState(null);
    const [showSummary,     setShowSummary]    = useState(false);
    const [summaryFlat,     setSummaryFlat]    = useState(null);
    const [actionKey,       setActionKey]      = useState(null);

    // ── Load heads and flats once on mount ───────────────────────────────────
    useEffect(() => {
        const sid = getSessionSocietyId();
        if (!sid) {
            toast.error("Session expired — please login again");
            return;
        }
        loadHeads();
        loadFlats(sid);
        // Trigger initial config load
        loadConfigs(sid, 1, "", "", "", "", "");
    }, []);

    const loadHeads = async () => {
        try {
            const res = await listChargeHeadsApi("");
            setHeads(res?.charge_heads || []);
        } catch (_) {}
    };

    const loadFlats = async (sid) => {
        try {
            const res = await getAllMembersWithoutPaginationApi(sid, "");
            const members = res?.members || res || [];
            const seen = new Set();
            const opts = [];
            members.forEach((m) => {
                if (m.flat_id && !seen.has(m.flat_id)) {
                    seen.add(m.flat_id);
                    opts.push({
                        flat_id:     m.flat_id,
                        flat_number: m.flat_number,
                        block:       m.block,
                        area_sqft:   m.area_sqft,
                    });
                }
            });
            setFlats(opts);
        } catch (_) {}
    };

    // ── Core fetch — called directly, no societyId state dependency ──────────
    const loadConfigs = async (sid, pg, head, propType, flat, override, srch) => {
        if (!sid) return;
        setLoading(true);
        try {
            const res = await listFlatChargeConfigsApi({
                headId:       head      ? parseInt(head)      : null,
                propertyType: propType  || "",
                flatId:       flat      ? parseInt(flat)      : null,
                isOverride:   override !== "" ? parseInt(override) : null,
                search:       srch      || "",
                page:         pg,
                pageSize,
            });
            setConfigs(res?.configs || []);
            setTotal(res?.pagination?.total || 0);
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to load charges");
        } finally {
            setLoading(false);
        }
    };

    // ── Re-fetch when filters/page change ───────────────────────────────────
    useEffect(() => {
        const sid = getSessionSocietyId();
        if (!sid) return;
        loadConfigs(sid, page, filterHead, filterPropType, filterFlat, filterOverride, appliedSearch);
    }, [page, filterHead, filterPropType, filterFlat, filterOverride, appliedSearch]);

    const handleSearch = () => {
        setAppliedSearch(searchInput);
        setPage(1);
    };

    const clearFilters = () => {
        setFilterHead(""); setFilterPropType(""); setFilterFlat("");
        setFilterOverride(""); setSearchInput(""); setAppliedSearch(""); setPage(1);
    };

    const refresh = () => {
        const sid = getSessionSocietyId();
        loadConfigs(sid, page, filterHead, filterPropType, filterFlat, filterOverride, appliedSearch);
    };

    // ── Actions ──────────────────────────────────────────────────────────────
    const handleAddSave = async (payload) => {
        await addFlatChargeApi(payload);
        toast.success("Charge added successfully");
        refresh();
    };

    const handleEditSave = async (payload) => {
        await overrideFlatChargeApi(payload);
        toast.success("Charge updated successfully");
        refresh();
    };

    const handleReset = async (config) => {
        if (!window.confirm(
            `Reset Flat ${config.flat_number} — ${config.head_name} to centralised rate?`
        )) return;
        const key = `reset_${config.flat_id}_${config.head_id}`;
        setActionKey(key);
        try {
            await resetFlatChargeOverrideApi(config.flat_id, config.head_id);
            toast.success("Reset to centralised rate");
            refresh();
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Reset failed");
        } finally {
            setActionKey(null);
        }
    };

    const handleRemove = async (config) => {
        if (!window.confirm(
            `Remove ${config.head_name} from Flat ${config.flat_number}?

This removes the charge configuration for this flat.`
        )) return;
        // fcc row id — SP returns it as 'id' (fcc.id aliased)
        const fccId = config.id || config.fcc_id;
        if (!fccId) { toast.error("Cannot remove: charge config ID not found"); return; }
        const key = `remove_${fccId}`;
        setActionKey(key);
        try {
            await removeFlatChargeApi(fccId);
            toast.success(`${config.head_name} removed from Flat ${config.flat_number}`);
            refresh();
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Remove failed");
        } finally {
            setActionKey(null);
        }
    };

    return (
        <div className="pg" style={{ padding: "20px 24px" }}>

            {/* ── Header ── */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                <div>
                    <h4 style={{ fontWeight: 700, margin: 0 }}>🏠 Flat Charge Configuration</h4>
                    <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
                        {total} configs · View, override or add individual charges per flat
                    </p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button className="billing-btn billing-btn-outline"
                        onClick={() => setActive("billingDashboard")}>← Dashboard</button>
                    <button className="billing-btn billing-btn-outline"
                        onClick={() => setActive("chargeHeads")}>🏷️ Charge Heads</button>
                    <button className="billing-btn billing-btn-outline" onClick={refresh}>
                        <FiRefreshCw size={12} /> Refresh
                    </button>
                    <button className="billing-btn billing-btn-primary"
                        onClick={() => setShowAddModal(true)}>
                        <FiPlus size={13} /> Add Individual Charge
                    </button>
                </div>
            </div>

            {/* ── Filters ── */}
            <div className="billing-card mb-3" style={{ padding: "14px 16px" }}>
                <div className="d-flex gap-2 flex-wrap align-items-end">

                    {/* Search */}
                    <div style={{ flex: 1, minWidth: 180 }}>
                        <label className="billing-form-label">Search</label>
                        <div style={{ position: "relative" }}>
                            <FiSearch style={{
                                position: "absolute", left: 10,
                                top: "50%", transform: "translateY(-50%)", color: "#9ca3af"
                            }} />
                            <input type="text" className="billing-form-input"
                                style={{ paddingLeft: 32 }}
                                placeholder="Flat, block, head name, owner..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
                        </div>
                    </div>

                    {/* Flat */}
                    <div>
                        <label className="billing-form-label">Flat</label>
                        <select className="billing-form-input" style={{ width: 150 }}
                            value={filterFlat}
                            onChange={(e) => { setFilterFlat(e.target.value); setPage(1); }}>
                            <option value="">All Flats</option>
                            {flats.map((f) => (
                                <option key={f.flat_id} value={f.flat_id}>
                                    {f.flat_number}{f.block ? ` / ${f.block}` : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Head */}
                    <div>
                        <label className="billing-form-label">Charge Head</label>
                        <select className="billing-form-input" style={{ width: 170 }}
                            value={filterHead}
                            onChange={(e) => { setFilterHead(e.target.value); setPage(1); }}>
                            <option value="">All Heads</option>
                            {heads.map((h) => (
                                <option key={h.id} value={h.id}>{h.head_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Property type */}
                    <div>
                        <label className="billing-form-label">Property Type</label>
                        <select className="billing-form-input" style={{ width: 160 }}
                            value={filterPropType}
                            onChange={(e) => { setFilterPropType(e.target.value); setPage(1); }}>
                            <option value="">All Types</option>
                            <option value="residential_flat">Residential</option>
                            <option value="commercial_shop">Shop</option>
                            <option value="commercial_office">Office</option>
                        </select>
                    </div>

                    {/* Source */}
                    <div>
                        <label className="billing-form-label">Source</label>
                        <select className="billing-form-input" style={{ width: 140 }}
                            value={filterOverride}
                            onChange={(e) => { setFilterOverride(e.target.value); setPage(1); }}>
                            <option value="">All Sources</option>
                            <option value="1">Overrides Only</option>
                            <option value="0">Auto-applied Only</option>
                        </select>
                    </div>

                    <div className="d-flex gap-2" style={{ marginTop: 18 }}>
                        <button className="billing-btn billing-btn-primary billing-btn-sm"
                            onClick={handleSearch}>
                            <FiSearch size={12} /> Search
                        </button>
                        <button className="billing-btn billing-btn-outline billing-btn-sm"
                            onClick={clearFilters}>Clear</button>
                    </div>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="billing-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                    <table className="billing-table">
                        <thead>
                            <tr>
                                <th>Flat</th>
                                <th>Block</th>
                                <th>Property</th>
                                <th>SqFt</th>
                                <th>Owner</th>
                                <th>Charge Head</th>
                                <th>Scope</th>
                                <th>Type</th>
                                <th className="text-end">Amount</th>
                                <th>Source</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={11} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
                                        <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
                                        Loading charges...
                                    </td>
                                </tr>
                            ) : configs.length === 0 ? (
                                <tr>
                                    <td colSpan={11} style={{ textAlign: "center", padding: "48px 20px" }}>
                                        <div style={{ color: "#9ca3af" }}>
                                            <div style={{ fontSize: 36, marginBottom: 12 }}>🏠</div>
                                            <div style={{ fontWeight: 600, marginBottom: 6 }}>No charge configs found</div>
                                            <div style={{ fontSize: 12, marginBottom: 16 }}>
                                                Create charge heads first and auto-apply, or add individually
                                            </div>
                                            <button className="billing-btn billing-btn-primary"
                                                onClick={() => setShowAddModal(true)}>
                                                <FiPlus size={13} /> Add Individual Charge
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : configs.map((c, i) => {
                                const resetKey  = `reset_${c.flat_id}_${c.head_id}`;
                                const removeKey = `remove_${c.flat_id}_${c.head_id}`;
                                return (
                                    <tr key={i}>
                                        <td>
                                            <button style={{
                                                background: "none", border: "none", padding: 0,
                                                fontWeight: 700, color: "#2563eb",
                                                cursor: "pointer", fontSize: 13
                                            }}
                                                onClick={() => {
                                                    setSummaryFlat({
                                                        flat_id:    c.flat_id,
                                                        flat_label: `${c.flat_number}${c.block ? ` / ${c.block}` : ""}`
                                                    });
                                                    setShowSummary(true);
                                                }}
                                                title="View all charges for this flat">
                                                {c.flat_number}
                                            </button>
                                        </td>
                                        <td style={{ color: "#6b7280" }}>{c.block || "—"}</td>
                                        <td>
                                            <span style={{
                                                fontSize: 10, padding: "2px 6px",
                                                background: "#f3f4f6", borderRadius: 6
                                            }}>
                                                {(c.unit_type || c.property_type || "—").replace(/_/g, " ")}
                                            </span>
                                        </td>
                                        <td style={{ color: "#6b7280", fontSize: 12 }}>
                                            {c.area_sqft || "—"}
                                        </td>
                                        <td>
                                            <div style={{ fontSize: 12 }}>{c.owner_name?.trim() || "—"}</div>
                                            <div style={{ fontSize: 11, color: "#9ca3af" }}>{c.owner_mobile || ""}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, fontSize: 13 }}>{c.head_name}</div>
                                            <div style={{ fontSize: 11, color: "#2563eb" }}>{c.head_code}</div>
                                        </td>
                                        <td>
                                            <span className={`scope-badge ${c.charge_scope}`}>
                                                {c.charge_scope === "centralised" ? "Central" : "Per Flat"}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize:11, padding:"2px 6px", borderRadius:6,
                                                background: (c.charge_basis||c.charge_type)==="percentage"?"#f5f3ff":
                                                            (c.charge_basis||c.charge_type)==="per_sqft" ?"#dbeafe":"#f3f4f6",
                                                color:      (c.charge_basis||c.charge_type)==="percentage"?"#7c3aed":
                                                            (c.charge_basis||c.charge_type)==="per_sqft" ?"#2563eb":"#374151" }}>
                                                {(c.charge_basis||c.charge_type) === "percentage"
                                                    ? `${c.percentage_rate}% based`
                                                    : (c.charge_basis||c.charge_type) === "per_sqft"
                                                        ? `₹${c.rate_per_sqft}/sqft`
                                                        : "Fixed"}
                                            </span>
                                        </td>
                                        <td className="text-end amount-display">
                                            {(c.charge_basis||c.charge_type) === "percentage"
                                                ? <span style={{ color:"#7c3aed", fontWeight:600, fontSize:12 }}>
                                                    {c.display_amount || `${c.percentage_rate}% of bases`}
                                                  </span>
                                                : fmt(c.amount)}
                                        </td>
                                        <td>
                                            {c.is_override
                                                ? <span className="override-badge">🔧 Override</span>
                                                : <span style={{ fontSize: 11, color: "#059669" }}>✅ Auto</span>
                                            }
                                        </td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <button
                                                    className="billing-btn billing-btn-outline billing-btn-sm"
                                                    title="Edit amount"
                                                    onClick={() => { setEditConfig(c); setShowEditModal(true); }}>
                                                    <FiEdit2 size={11} />
                                                </button>
                                                {c.is_override === 1 && c.charge_scope === "centralised" && (
                                                    <button
                                                        className="billing-btn billing-btn-outline billing-btn-sm"
                                                        title="Reset to centralised rate"
                                                        onClick={() => handleReset(c)}
                                                        disabled={actionKey === resetKey}>
                                                        {actionKey === resetKey
                                                            ? <span style={{ fontSize: 9 }}>...</span>
                                                            : <FiRefreshCw size={11} />}
                                                    </button>
                                                )}
                                                <button
                                                    className="billing-btn billing-btn-danger billing-btn-sm"
                                                    title="Remove charge"
                                                    onClick={() => handleRemove(c)}
                                                    disabled={actionKey === removeKey}>
                                                    {actionKey === removeKey
                                                        ? <span style={{ fontSize: 9 }}>...</span>
                                                        : <FiTrash2 size={11} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {total > pageSize && (
                    <div style={{
                        padding: "12px 16px", borderTop: "1px solid #f3f4f6",
                        display: "flex", alignItems: "center", justifyContent: "space-between"
                    }}>
                        <span style={{ fontSize: 12, color: "#6b7280" }}>
                            Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, total)} of {total}
                        </span>
                        <Pagination
                            page={page}
                            total={Math.ceil(total / pageSize)}
                            onChange={(p) => setPage(p)}
                        />
                    </div>
                )}
            </div>

            {/* ── Modals ── */}
            {showAddModal && (
                <ChargeModal mode="add" heads={heads} flats={flats}
                    onSave={handleAddSave}
                    onClose={() => setShowAddModal(false)} />
            )}

            {showEditModal && editConfig && (
                <ChargeModal mode="edit" config={editConfig} heads={heads} flats={flats}
                    onSave={handleEditSave}
                    onClose={() => { setShowEditModal(false); setEditConfig(null); }} />
            )}

            {showSummary && summaryFlat && (
                <FlatSummaryModal
                    flatId={summaryFlat.flat_id}
                    flatLabel={summaryFlat.flat_label}
                    onClose={() => { setShowSummary(false); setSummaryFlat(null); }} />
            )}
        </div>
    );
};

export default FlatCharges;