import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiEdit2, FiRefreshCw, FiSearch } from "react-icons/fi";
import { Pagination } from "../../components/Common/ReusableFunction";
import {
    listFlatChargeConfigsApi, listChargeHeadsApi,
    overrideFlatChargeApi, resetFlatChargeOverrideApi,
    getFlatChargeConfigApi
} from "../../services/BillingApi";
import { getAllMembersWithoutPaginationApi } from "../../services/AddMemberApi";
import { GetSessionData } from "../../utils/SessionManagement";
import "../../styles/Billing.css";

const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

const FlatCharges = ({ setActive }) => {
    const [societyId, setSocietyId] = useState("");
    const [configs, setConfigs]     = useState([]);
    const [heads, setHeads]         = useState([]);
    const [allMembers, setAllMembers] = useState([]);
    const [page, setPage]           = useState(1);
    const [pageSize]                = useState(20);
    const [total, setTotal]         = useState(0);

    // Filters
    const [filterHead, setFilterHead]         = useState("");
    const [filterPropType, setFilterPropType] = useState("");
    const [filterOverride, setFilterOverride] = useState("");

    // Override Modal
    const [showModal, setShowModal]   = useState(false);
    const [modalHead, setModalHead]   = useState(null);
    const [modalFlat, setModalFlat]   = useState(null);
    const [overrideForm, setOverrideForm] = useState({
        charge_type: "fixed", amount: "", rate_per_sqft: ""
    });
    const [saving, setSaving] = useState(false);

    // Flat Config view modal
    const [showFlatConfig, setShowFlatConfig] = useState(false);
    const [flatConfigData, setFlatConfigData] = useState([]);
    const [selectedFlat, setSelectedFlat]     = useState(null);

    useEffect(() => {
        const s = GetSessionData();
        if (s?.society_id) {
            setSocietyId(s.society_id);
            fetchHeads();
            fetchMembers(s.society_id);
        }
    }, []);

    useEffect(() => { if (societyId) fetchConfigs(); }, [societyId, page, filterHead, filterPropType, filterOverride]);

    const fetchConfigs = async () => {
        try {
            const res = await listFlatChargeConfigsApi({
                headId:       filterHead       ? parseInt(filterHead)       : null,
                propertyType: filterPropType   || "",
                isOverride:   filterOverride !== "" ? parseInt(filterOverride) : null,
                page, pageSize
            });
            setConfigs(res?.configs || []);
            setTotal(res?.pagination?.total || 0);
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to load configs");
        }
    };

    const fetchHeads = async () => {
        try {
            const res = await listChargeHeadsApi("");
            setHeads(res?.charge_heads || res || []);
        } catch (_) {}
    };

    const fetchMembers = async (sId) => {
        try {
            const res = await getAllMembersWithoutPaginationApi(sId, "", "", "", "", null);
            setAllMembers(res?.members || res || []);
        } catch (_) {}
    };

    const openOverride = (config) => {
        setModalFlat({ flat_id: config.flat_id, flat_number: config.flat_number, block: config.block, area_sqft: config.area_sqft });
        setModalHead({ id: config.head_id, head_code: config.head_code, head_name: config.head_name, charge_scope: config.charge_scope });
        setOverrideForm({
            charge_type:   config.charge_type   || "fixed",
            amount:        config.amount         || "",
            rate_per_sqft: config.rate_per_sqft  || ""
        });
        setShowModal(true);
    };

    const handleSaveOverride = async () => {
        if (overrideForm.charge_type === "fixed" && !overrideForm.amount) {
            toast.error("Amount is required"); return;
        }
        if (overrideForm.charge_type === "per_sqft" && !overrideForm.rate_per_sqft) {
            toast.error("Rate per sqft is required"); return;
        }
        setSaving(true);
        try {
            await overrideFlatChargeApi({
                flat_id:       modalFlat.flat_id,
                head_id:       modalHead.id,
                charge_type:   overrideForm.charge_type,
                amount:        overrideForm.charge_type === "fixed" ? parseFloat(overrideForm.amount) : null,
                rate_per_sqft: overrideForm.charge_type === "per_sqft" ? parseFloat(overrideForm.rate_per_sqft) : null,
            });
            toast.success("Override saved successfully");
            setShowModal(false);
            fetchConfigs();
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to save override");
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async (config) => {
        if (!window.confirm(`Reset override for ${config.flat_number} — ${config.head_name}?`)) return;
        try {
            await resetFlatChargeOverrideApi(config.flat_id, config.head_id);
            toast.success("Reset to centralised rate");
            fetchConfigs();
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to reset");
        }
    };

    const viewFlatConfig = async (config) => {
        setSelectedFlat({ flat_number: config.flat_number, block: config.block, area_sqft: config.area_sqft });
        try {
            const res = await getFlatChargeConfigApi(config.flat_id);
            setFlatConfigData(res?.charges || res || []);
            setShowFlatConfig(true);
        } catch (e) {
            toast.error("Failed to load flat config");
        }
    };

    const totalMonthly = flatConfigData.reduce((s, c) => s + parseFloat(c.amount || 0), 0);

    return (
        <div className="pg" style={{ padding: "20px 24px" }}>

            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 style={{ fontWeight: 700, margin: 0 }}>🏠 Flat Charge Configuration</h4>
                    <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
                        View and override per-flat charge amounts
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>
                        ← Dashboard
                    </button>
                    <button className="billing-btn billing-btn-primary" onClick={() => setActive("chargeHeads")}>
                        🏷️ Charge Heads
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="billing-toolbar">
                <select className="billing-form-input" style={{ width: 180 }}
                    value={filterHead}
                    onChange={(e) => { setFilterHead(e.target.value); setPage(1); }}>
                    <option value="">All Charge Heads</option>
                    {heads.map((h) => <option key={h.id} value={h.id}>{h.head_name}</option>)}
                </select>
                <select className="billing-form-input" style={{ width: 160 }}
                    value={filterPropType}
                    onChange={(e) => { setFilterPropType(e.target.value); setPage(1); }}>
                    <option value="">All Property Types</option>
                    <option value="residential_flat">Residential Flat</option>
                    <option value="commercial_shop">Commercial Shop</option>
                    <option value="commercial_office">Commercial Office</option>
                </select>
                <select className="billing-form-input" style={{ width: 150 }}
                    value={filterOverride}
                    onChange={(e) => { setFilterOverride(e.target.value); setPage(1); }}>
                    <option value="">All (Override + Auto)</option>
                    <option value="1">Overrides Only</option>
                    <option value="0">Auto-applied Only</option>
                </select>
                <button className="billing-btn billing-btn-outline billing-btn-sm"
                    onClick={() => { setFilterHead(""); setFilterPropType(""); setFilterOverride(""); setPage(1); }}>
                    Clear
                </button>
            </div>

            {/* Table */}
            <div className="billing-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                    <table className="billing-table">
                        <thead>
                            <tr>
                                <th>Flat</th>
                                <th>Block</th>
                                <th>Property Type</th>
                                <th>Area (sqft)</th>
                                <th>Owner</th>
                                <th>Charge Head</th>
                                <th>Scope</th>
                                <th>Charge Type</th>
                                <th className="text-end">Amount</th>
                                <th>Source</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {configs.length === 0 ? (
                                <tr>
                                    <td colSpan={11} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
                                        No charge configs found
                                    </td>
                                </tr>
                            ) : configs.map((c, i) => (
                                <tr key={i}>
                                    <td>
                                        <button
                                            style={{ background: "none", border: "none", padding: 0,
                                                fontWeight: 700, color: "#2563eb", cursor: "pointer", fontSize: 13 }}
                                            onClick={() => viewFlatConfig(c)}
                                        >
                                            {c.flat_number}
                                        </button>
                                    </td>
                                    <td style={{ color: "#6b7280" }}>{c.block || "—"}</td>
                                    <td>
                                        <span style={{ fontSize: 11, padding: "2px 6px",
                                            background: "#f3f4f6", borderRadius: 6 }}>
                                            {(c.property_type || "").replace(/_/g, " ")}
                                        </span>
                                    </td>
                                    <td style={{ color: "#6b7280", fontSize: 12 }}>
                                        {c.area_sqft ? `${c.area_sqft} sqft` : "—"}
                                    </td>
                                    <td>
                                        <div style={{ fontSize: 12 }}>{c.owner_name || "—"}</div>
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
                                        <span className={`scope-badge ${c.charge_type}`}>
                                            {c.charge_type === "per_sqft"
                                                ? `₹${c.rate_per_sqft}/sqft`
                                                : "Fixed"}
                                        </span>
                                    </td>
                                    <td className="text-end amount-display">{fmt(c.amount)}</td>
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
                                                title="Override amount"
                                                onClick={() => openOverride(c)}
                                            >
                                                <FiEdit2 size={12} />
                                            </button>
                                            {c.is_override === 1 && (
                                                <button
                                                    className="billing-btn billing-btn-outline billing-btn-sm"
                                                    title="Reset to centralised rate"
                                                    onClick={() => handleReset(c)}
                                                >
                                                    <FiRefreshCw size={12} />
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

            {/* ── Override Modal ── */}
            {showModal && modalFlat && modalHead && (
                <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.4)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: 12, border: "none" }}>
                            <div className="billing-modal-header">
                                <span>🔧 Override Charge — {modalFlat.flat_number}</span>
                                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                            </div>
                            <div style={{ padding: 20 }}>
                                <div style={{
                                    background: "#f0f9ff", borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                                    fontSize: 13, color: "#0369a1"
                                }}>
                                    <strong>{modalHead.head_name}</strong> ({modalHead.head_code})
                                    {modalFlat.area_sqft && <span> · {modalFlat.area_sqft} sqft</span>}
                                </div>

                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="billing-form-label">Charge Type</label>
                                        <div className="d-flex gap-3">
                                            {["fixed", "per_sqft"].map((t) => (
                                                <label key={t} className="d-flex align-items-center gap-1"
                                                    style={{ cursor: "pointer", fontSize: 13 }}>
                                                    <input type="radio" name="ov_type"
                                                        checked={overrideForm.charge_type === t}
                                                        onChange={() => setOverrideForm({ ...overrideForm, charge_type: t })}
                                                    />
                                                    {t === "fixed" ? "Fixed Amount" : "Per SqFt"}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    {overrideForm.charge_type === "fixed" ? (
                                        <div className="col-12">
                                            <label className="billing-form-label">Amount (₹) *</label>
                                            <input type="number" className="billing-form-input" min="0" step="0.01"
                                                value={overrideForm.amount}
                                                onChange={(e) => setOverrideForm({ ...overrideForm, amount: e.target.value })}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    ) : (
                                        <div className="col-12">
                                            <label className="billing-form-label">Rate Per SqFt (₹) *</label>
                                            <input type="number" className="billing-form-input" min="0" step="0.001"
                                                value={overrideForm.rate_per_sqft}
                                                onChange={(e) => setOverrideForm({ ...overrideForm, rate_per_sqft: e.target.value })}
                                                placeholder="0.03"
                                            />
                                            {modalFlat.area_sqft && overrideForm.rate_per_sqft && (
                                                <div style={{ fontSize: 12, color: "#059669", marginTop: 4 }}>
                                                    = {fmt(parseFloat(overrideForm.rate_per_sqft) * parseFloat(modalFlat.area_sqft))} / month
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-3">
                                    <button className="billing-btn billing-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button className="billing-btn billing-btn-primary" onClick={handleSaveOverride} disabled={saving}>
                                        {saving ? "Saving..." : "Save Override"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Flat Config View Modal ── */}
            {showFlatConfig && selectedFlat && (
                <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.4)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: 12, border: "none" }}>
                            <div className="billing-modal-header">
                                <span>🏠 Flat {selectedFlat.flat_number} — Monthly Charges</span>
                                <button className="close-btn" onClick={() => setShowFlatConfig(false)}>×</button>
                            </div>
                            <div style={{ padding: 20 }}>
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
                                        {flatConfigData.map((c) => (
                                            <tr key={c.head_id}>
                                                <td>
                                                    <div style={{ fontWeight: 600, fontSize: 13 }}>{c.head_name}</div>
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
                                            <td colSpan={2} style={{ fontWeight: 700, paddingTop: 12 }}>Total Monthly</td>
                                            <td className="text-end amount-display" style={{ fontWeight: 800, color: "#2563eb" }}>
                                                {fmt(totalMonthly)}
                                            </td>
                                            <td />
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlatCharges;
