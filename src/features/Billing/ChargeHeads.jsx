import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiPlus, FiRefreshCw } from "react-icons/fi";
import {
    listChargeHeadsApi, upsertChargeHeadApi,
    deleteChargeHeadApi, autoApplyChargeHeadApi
} from "../../services/BillingApi";
import "../../styles/Billing.css";

const PROPERTY_TYPES = [
    "residential_flat", "commercial_shop", "commercial_office"
];

const ChargeHeads = ({ setActive }) => {
    const [heads, setHeads]         = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editHead, setEditHead]   = useState(null);
    const [applying, setApplying]   = useState(null);
    const [form, setForm]           = useState({
        head_code: "", head_name: "", head_group: "",
        charge_type: "fixed", charge_scope: "centralised",
        centralised_amount: "", centralised_rate: "",
        applies_to_types: ["residential_flat"],
        is_active: 1, sort_order: 0
    });
    const [loading, setLoading]     = useState(false);

    useEffect(() => { fetchHeads(); }, []);

    const fetchHeads = async () => {
        try {
            const res = await listChargeHeadsApi("");
            setHeads(res?.charge_heads || res || []);
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to load charge heads");
        }
    };

    const openAdd = () => {
        setEditHead(null);
        setForm({
            head_code: "", head_name: "", head_group: "",
            charge_type: "fixed", charge_scope: "centralised",
            centralised_amount: "", centralised_rate: "",
            applies_to_types: ["residential_flat"],
            is_active: 1, sort_order: heads.length + 1
        });
        setShowModal(true);
    };

    const openEdit = (h) => {
        setEditHead(h);
        setForm({
            head_code:          h.head_code,
            head_name:          h.head_name,
            head_group:         h.head_group || "",
            charge_type:        h.charge_type || "fixed",
            charge_scope:       h.charge_scope || "centralised",
            centralised_amount: h.centralised_amount || "",
            centralised_rate:   h.centralised_rate   || "",
            applies_to_types:   h.applies_to_types
                ? h.applies_to_types.split(",")
                : ["residential_flat"],
            is_active:  h.is_active,
            sort_order: h.sort_order
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.head_code || !form.head_name) {
            toast.error("Code and Name are required");
            return;
        }
        if (form.charge_scope === "centralised") {
            if (form.charge_type === "fixed" && !form.centralised_amount) {
                toast.error("Amount is required for Fixed Centralised charges");
                return;
            }
            if (form.charge_type === "per_sqft" && !form.centralised_rate) {
                toast.error("Rate per sqft is required");
                return;
            }
        }
        setLoading(true);
        try {
            await upsertChargeHeadApi({
                head_id:            editHead?.id || null,
                head_code:          form.head_code,
                head_name:          form.head_name,
                head_group:         form.head_group || null,
                charge_type:        form.charge_type,
                charge_scope:       form.charge_scope,
                centralised_amount: form.charge_scope === "centralised" && form.charge_type === "fixed"
                    ? parseFloat(form.centralised_amount) : null,
                centralised_rate:   form.charge_scope === "centralised" && form.charge_type === "per_sqft"
                    ? parseFloat(form.centralised_rate) : null,
                applies_to_types:   form.applies_to_types.join(","),
                is_active:          form.is_active,
                sort_order:         parseInt(form.sort_order) || 0,
            });
            toast.success(editHead ? "Charge head updated" : "Charge head created & auto-applied");
            setShowModal(false);
            fetchHeads();
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to save");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (h) => {
        if (!window.confirm(`Delete "${h.head_name}"? This cannot be undone.`)) return;
        try {
            await deleteChargeHeadApi(h.id);
            toast.success("Charge head deleted");
            fetchHeads();
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to delete");
        }
    };

    const handleAutoApply = async (h) => {
        setApplying(h.id);
        try {
            const res = await autoApplyChargeHeadApi(h.id);
            toast.success(`Applied to ${res?.flats_updated || 0} flats`);
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Auto apply failed");
        } finally {
            setApplying(null);
        }
    };

    const toggleType = (type) => {
        setForm((prev) => {
            const arr = prev.applies_to_types.includes(type)
                ? prev.applies_to_types.filter((t) => t !== type)
                : [...prev.applies_to_types, type];
            return { ...prev, applies_to_types: arr.length ? arr : [type] };
        });
    };

    return (
        <div className="pg" style={{ padding: "20px 24px" }}>

            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 style={{ fontWeight: 700, margin: 0 }}>🏷️ Charge Heads</h4>
                    <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
                        Dynamic billing charge heads for your society
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>
                        ← Dashboard
                    </button>
                    <button className="billing-btn billing-btn-primary" onClick={openAdd}>
                        <FiPlus /> Add Charge Head
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="billing-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                    <table className="billing-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Group</th>
                                <th>Charge Type</th>
                                <th>Scope</th>
                                <th>Rate / Amount</th>
                                <th>Applies To</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {heads.length === 0 ? (
                                <tr>
                                    <td colSpan={10} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
                                        No charge heads yet — add your first one
                                    </td>
                                </tr>
                            ) : heads.map((h) => (
                                <tr key={h.id}>
                                    <td style={{ color: "#9ca3af", fontSize: 12 }}>{h.sort_order}</td>
                                    <td>
                                        <span style={{ fontWeight: 700, color: "#2563eb", fontSize: 13 }}>
                                            {h.head_code}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{h.head_name}</td>
                                    <td style={{ color: "#6b7280", fontSize: 12 }}>{h.head_group || "—"}</td>
                                    <td>
                                        <span className={`scope-badge ${h.charge_type}`}>
                                            {h.charge_type === "per_sqft" ? "Per SqFt" : "Fixed"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`scope-badge ${h.charge_scope}`}>
                                            {h.charge_scope === "centralised" ? "Centralised" : "Per Flat"}
                                        </span>
                                    </td>
                                    <td className="amount-display">
                                        {h.charge_scope === "centralised"
                                            ? h.charge_type === "per_sqft"
                                                ? `₹${h.centralised_rate}/sqft`
                                                : `₹${Number(h.centralised_amount || 0).toLocaleString("en-IN")}`
                                            : <span className="amount-muted">Set per flat</span>
                                        }
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                            {(h.applies_to_types || "").split(",").map((t) => (
                                                <span key={t} style={{
                                                    fontSize: 10, padding: "2px 6px",
                                                    background: "#f3f4f6", color: "#374151",
                                                    borderRadius: 6
                                                }}>
                                                    {t.replace("_", " ")}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`bill-badge ${h.is_active ? "paid" : "unpaid"}`}>
                                            {h.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <button
                                                className="billing-btn billing-btn-outline billing-btn-sm"
                                                title="Edit"
                                                onClick={() => openEdit(h)}
                                            >
                                                <FiEdit2 size={12} />
                                            </button>
                                            {h.charge_scope === "centralised" && (
                                                <button
                                                    className="billing-btn billing-btn-outline billing-btn-sm"
                                                    title="Auto Apply to all flats"
                                                    onClick={() => handleAutoApply(h)}
                                                    disabled={applying === h.id}
                                                >
                                                    {applying === h.id
                                                        ? <span style={{ fontSize: 10 }}>...</span>
                                                        : <FiRefreshCw size={12} />
                                                    }
                                                </button>
                                            )}
                                            <button
                                                className="billing-btn billing-btn-danger billing-btn-sm"
                                                title="Delete"
                                                onClick={() => handleDelete(h)}
                                            >
                                                <FiTrash2 size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Modal ── */}
            {showModal && (
                <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.4)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content" style={{ borderRadius: 12, border: "none" }}>
                            <div className="billing-modal-header">
                                <span>{editHead ? "✏️ Edit Charge Head" : "➕ Add Charge Head"}</span>
                                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                            </div>
                            <div style={{ padding: 24 }}>
                                <div className="row g-3">
                                    <div className="col-4">
                                        <label className="billing-form-label">Head Code *</label>
                                        <input type="text" className="billing-form-input"
                                            value={form.head_code}
                                            onChange={(e) => setForm({ ...form, head_code: e.target.value.toUpperCase() })}
                                            placeholder="e.g. GM, WC, SF"
                                            disabled={!!editHead}
                                        />
                                    </div>
                                    <div className="col-8">
                                        <label className="billing-form-label">Head Name *</label>
                                        <input type="text" className="billing-form-input"
                                            value={form.head_name}
                                            onChange={(e) => setForm({ ...form, head_name: e.target.value })}
                                            placeholder="e.g. General Maintenance"
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="billing-form-label">Group</label>
                                        <input type="text" className="billing-form-input"
                                            value={form.head_group}
                                            onChange={(e) => setForm({ ...form, head_group: e.target.value })}
                                            placeholder="Maintenance / Fund / Charges"
                                        />
                                    </div>
                                    <div className="col-3">
                                        <label className="billing-form-label">Sort Order</label>
                                        <input type="number" className="billing-form-input"
                                            value={form.sort_order}
                                            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-3">
                                        <label className="billing-form-label">Status</label>
                                        <select className="billing-form-input"
                                            value={form.is_active}
                                            onChange={(e) => setForm({ ...form, is_active: parseInt(e.target.value) })}
                                        >
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </select>
                                    </div>

                                    {/* Charge Type + Scope */}
                                    <div className="col-6">
                                        <label className="billing-form-label">Charge Type</label>
                                        <div className="d-flex gap-2">
                                            {["fixed", "per_sqft"].map((t) => (
                                                <label key={t} className="d-flex align-items-center gap-1"
                                                    style={{ cursor: "pointer", fontSize: 13 }}>
                                                    <input type="radio" name="charge_type"
                                                        checked={form.charge_type === t}
                                                        onChange={() => setForm({ ...form, charge_type: t })}
                                                    />
                                                    {t === "fixed" ? "Fixed Amount" : "Per SqFt"}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <label className="billing-form-label">Charge Scope</label>
                                        <div className="d-flex gap-2">
                                            {["centralised", "per_flat"].map((s) => (
                                                <label key={s} className="d-flex align-items-center gap-1"
                                                    style={{ cursor: "pointer", fontSize: 13 }}>
                                                    <input type="radio" name="charge_scope"
                                                        checked={form.charge_scope === s}
                                                        onChange={() => setForm({ ...form, charge_scope: s })}
                                                    />
                                                    {s === "centralised" ? "Centralised (auto-apply)" : "Per Flat (manual)"}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Amount / Rate — only for centralised */}
                                    {form.charge_scope === "centralised" && (
                                        <div className="col-6">
                                            <label className="billing-form-label">
                                                {form.charge_type === "per_sqft" ? "Rate Per SqFt (₹) *" : "Amount (₹) *"}
                                            </label>
                                            <input type="number" className="billing-form-input" min="0" step="0.01"
                                                value={form.charge_type === "per_sqft" ? form.centralised_rate : form.centralised_amount}
                                                onChange={(e) => setForm({
                                                    ...form,
                                                    [form.charge_type === "per_sqft" ? "centralised_rate" : "centralised_amount"]: e.target.value
                                                })}
                                                placeholder={form.charge_type === "per_sqft" ? "0.03" : "1100.00"}
                                            />
                                            {form.charge_scope === "centralised" && form.charge_type === "per_sqft" && (
                                                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                                                    Amount = rate × flat area_sqft
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Applies To */}
                                    <div className="col-12">
                                        <label className="billing-form-label">Applies To (property types) *</label>
                                        <div className="d-flex gap-3 flex-wrap">
                                            {PROPERTY_TYPES.map((t) => (
                                                <label key={t} className="d-flex align-items-center gap-1"
                                                    style={{ cursor: "pointer", fontSize: 13 }}>
                                                    <input type="checkbox"
                                                        checked={form.applies_to_types.includes(t)}
                                                        onChange={() => toggleType(t)}
                                                    />
                                                    {t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                                </label>
                                            ))}
                                        </div>
                                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                                            Selected: {form.applies_to_types.join(", ")}
                                        </div>
                                    </div>
                                </div>

                                {/* Info box */}
                                <div style={{
                                    background: "#f0f9ff", border: "1px solid #bae6fd",
                                    borderRadius: 8, padding: "10px 14px", marginTop: 16,
                                    fontSize: 12, color: "#0369a1"
                                }}>
                                    {form.charge_scope === "centralised"
                                        ? "✅ Centralised — will auto-apply to all matching flats when saved. Flats with manual overrides will be skipped."
                                        : "ℹ️ Per Flat — you will set the amount manually for each flat from Flat Charges page."
                                    }
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-3">
                                    <button className="billing-btn billing-btn-outline" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button className="billing-btn billing-btn-primary" onClick={handleSave} disabled={loading}>
                                        {loading ? "Saving..." : editHead ? "Update" : "Create & Apply"}
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

export default ChargeHeads;
