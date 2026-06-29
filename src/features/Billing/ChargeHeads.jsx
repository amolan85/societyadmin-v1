import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { listChargeHeadsApi, upsertChargeHeadApi, deleteChargeHeadApi } from "../../services/BillingApi";

const GST_RULES = [
    { value:"exempt",           label:"🟢 Exempt (0%)",              cgst:0,  sgst:0,  desc:"Water, Sinking Fund, Property Tax, Repair Fund" },
    { value:"conditional_7500", label:"🟡 Conditional 18% (>₹7,500)",cgst:9,  sgst:9,  desc:"General Maintenance — GST only if monthly bill > ₹7,500", sac:"999722" },
    { value:"standard_18",      label:"🔴 Standard 18% (always)",    cgst:9,  sgst:9,  desc:"Non-Occupancy, Insurance, Club Charges", sac:"997221" },
    { value:"custom",           label:"⚙️ Custom Rate",              cgst:0,  sgst:0,  desc:"Set your own rates" },
];

const RULE_COLORS = {
    exempt:           { bg:"#d1fae5", color:"#065f46" },
    conditional_7500: { bg:"#fef3c7", color:"#92400e" },
    standard_18:      { bg:"#fee2e2", color:"#991b1b" },
    custom:           { bg:"#f5f3ff", color:"#7c3aed" },
};

const EMPTY_FORM = {
    head_code:"", head_name:"", head_group:"", charge_type:"fixed",
    charge_scope:"centralised", charge_basis:"fixed",
    centralised_amount:"", centralised_rate:"",
    percentage_rate:"", percentage_of_heads:[],
    applies_to_types:["residential_flat","commercial_shop","commercial_office"],
    is_active:1, sort_order:"",
    gst_rule:"exempt", cgst_rate:0, sgst_rate:0, igst_rate:0, sac_code:"", gst_notes:"",
};

const ChargeHeads = ({ setActive }) => {
    const [heads,     setHeads]     = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing,   setEditing]   = useState(null);
    const [form,      setForm]      = useState(EMPTY_FORM);
    const [saving,    setSaving]    = useState(false);
    const [deleting,  setDeleting]  = useState(null);
    const [tab,       setTab]       = useState("basic"); // basic | percentage | gst

    useEffect(() => { loadHeads(); }, []);

    const loadHeads = async () => {
        setLoading(true);
        try { setHeads((await listChargeHeadsApi())?.charge_heads || []); }
        catch(e) { toast.error("Failed to load"); }
        finally { setLoading(false); }
    };

    const openAdd = () => {
        setEditing(null); setForm(EMPTY_FORM); setTab("basic"); setShowModal(true);
    };
    const openEdit = (h) => {
        setEditing(h);
        setForm({
            ...EMPTY_FORM, ...h,
            charge_basis:        h.charge_basis        || "fixed",
            percentage_of_heads: h.percentage_of_heads
                ? String(h.percentage_of_heads).split(",").map(s=>s.trim()).filter(Boolean)
                : [],
            applies_to_types: h.applies_to_types
                ? h.applies_to_types.split(",").map(s=>s.trim())
                : ["residential_flat","commercial_shop","commercial_office"],
            gst_rule:  h.gst_rule  || "exempt",
            cgst_rate: h.cgst_rate || 0,
            sgst_rate: h.sgst_rate || 0,
            igst_rate: h.igst_rate || 0,
            sac_code:  h.sac_code  || "",
            gst_notes: h.gst_notes || "",
        });
        setTab("basic"); setShowModal(true);
    };

    const handleGstRule = (rule) => {
        const r = GST_RULES.find(x => x.value === rule);
        setForm(f => ({...f, gst_rule:rule, cgst_rate:r.cgst, sgst_rate:r.sgst,
            sac_code: r.sac || f.sac_code, gst_notes:
            rule==="conditional_7500" ? "Circular No. 109/28/2019-GST — GST if >₹7,500/month" :
            rule==="standard_18"      ? "SAC 997221 — 18% GST always applicable" :
            rule==="exempt"           ? "Notification 12/2017-CT(Rate) — Exempt" : f.gst_notes
        }));
    };

    const toggleType = (t) => {
        setForm(f => {
            const cur = f.applies_to_types || [];
            return {...f, applies_to_types: cur.includes(t) ? cur.filter(x=>x!==t) : [...cur,t]};
        });
    };
    const togglePctHead = (id) => {
        const sid = String(id);
        setForm(f => {
            const cur = f.percentage_of_heads || [];
            return {...f, percentage_of_heads: cur.includes(sid) ? cur.filter(x=>x!==sid) : [...cur,sid]};
        });
    };

    const handleSave = async () => {
        if (!form.head_code.trim()) { toast.error("Head Code is required"); return; }
        if (!form.head_name.trim()) { toast.error("Head Name is required"); return; }
        if (form.charge_basis === "percentage" && (!form.percentage_rate || parseFloat(form.percentage_rate) <= 0))
            { toast.error("Percentage rate is required"); return; }
        setSaving(true);
        try {
            await upsertChargeHeadApi({
                head_id:             editing?.id || null,
                head_code:           form.head_code,
                head_name:           form.head_name,
                head_group:          form.head_group || null,
                charge_type:         form.charge_type,
                charge_scope:        form.charge_scope,
                charge_basis:        form.charge_basis,
                centralised_amount:  form.charge_basis === "fixed"      ? parseFloat(form.centralised_amount)||0 : null,
                centralised_rate:    form.charge_basis === "per_sqft"   ? parseFloat(form.centralised_rate)||0  : null,
                percentage_rate:     form.charge_basis === "percentage" ? parseFloat(form.percentage_rate)||0   : null,
                percentage_of_heads: form.charge_basis === "percentage" ? form.percentage_of_heads.join(",")    : null,
                applies_to_types:    form.applies_to_types.join(","),
                is_active:           form.is_active,
                sort_order:          parseInt(form.sort_order)||99,
                // GST
                gst_rule:    form.gst_rule,
                cgst_rate:   parseFloat(form.cgst_rate)||0,
                sgst_rate:   parseFloat(form.sgst_rate)||0,
                igst_rate:   parseFloat(form.igst_rate)||0,
                sac_code:    form.sac_code || null,
                gst_notes:   form.gst_notes || null,
            });
            toast.success(editing ? "Charge head updated ✅" : "Charge head created ✅");
            setShowModal(false);
            loadHeads();
        } catch(e) { toast.error(typeof e==="string"?e:"Save failed"); }
        finally { setSaving(false); }
    };

    const handleDelete = async (h) => {
        if (!window.confirm(`Delete "${h.head_name}"?`)) return;
        setDeleting(h.id);
        try { await deleteChargeHeadApi(h.id); toast.success("Deleted"); loadHeads(); }
        catch(e) { toast.error(typeof e==="string"?e:"Delete failed"); }
        finally { setDeleting(null); }
    };

    // Heads eligible for percentage reference (fixed/per_sqft only, not percentage)
    const eligibleBases = heads.filter(h => (h.charge_basis||"fixed") !== "percentage" && h.id !== editing?.id);

    const ruleStyle = (rule) => RULE_COLORS[rule] || RULE_COLORS.exempt;
    const totalGst  = (parseFloat(form.cgst_rate||0)+parseFloat(form.sgst_rate||0)+parseFloat(form.igst_rate||0));

    return (
        <div className="pg" style={{ padding:"20px 24px" }}>
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                <div>
                    <h4 style={{ fontWeight:700, margin:0 }}>🧾 Charge Heads</h4>
                    <p style={{ color:"#6b7280", fontSize:13, margin:0 }}>Dynamic billing charge heads with GST + percentage support</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>← Dashboard</button>
                    <button className="billing-btn billing-btn-primary" onClick={openAdd}>+ Add Charge Head</button>
                </div>
            </div>

            {/* Table */}
            <div className="billing-card" style={{ padding:0 }}>
                <table className="billing-table">
                    <thead>
                        <tr>
                            <th>#</th><th>Code</th><th>Name</th><th>Basis</th>
                            <th>Amount / Rate</th><th>GST</th><th>Applies To</th>
                            <th>Status</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={9} style={{ textAlign:"center", padding:30, color:"#9ca3af" }}>Loading...</td></tr>
                        ) : heads.length === 0 ? (
                            <tr><td colSpan={9} style={{ textAlign:"center", padding:30, color:"#9ca3af" }}>No charge heads. Add one above.</td></tr>
                        ) : heads.map((h, i) => {
                            const rule = h.gst_rule || "exempt";
                            const rs   = ruleStyle(rule);
                            const basis = h.charge_basis || "fixed";
                            return (
                                <tr key={h.id}>
                                    <td style={{ color:"#9ca3af", fontSize:11 }}>{i+1}</td>
                                    <td><span style={{ fontWeight:700, color:"#2563eb", fontSize:12 }}>{h.head_code}</span></td>
                                    <td style={{ fontWeight:600 }}>{h.head_name}
                                        {h.head_group && <div style={{ fontSize:10, color:"#9ca3af" }}>{h.head_group}</div>}
                                    </td>
                                    <td>
                                        <span style={{ fontSize:11, padding:"2px 6px", borderRadius:99,
                                            background: basis==="percentage"?"#f5f3ff":basis==="per_sqft"?"#dbeafe":"#f3f4f6",
                                            color: basis==="percentage"?"#7c3aed":basis==="per_sqft"?"#2563eb":"#374151" }}>
                                            {basis==="percentage" ? `% Based` : basis==="per_sqft" ? "₹/sqft" : "Fixed ₹"}
                                        </span>
                                    </td>
                                    <td style={{ fontSize:12 }}>
                                        {basis==="percentage"
                                            ? <span style={{ color:"#7c3aed", fontWeight:700 }}>{h.percentage_rate}%</span>
                                            : basis==="per_sqft"
                                                ? `₹${h.centralised_rate}/sqft`
                                                : `₹${parseFloat(h.centralised_amount||0).toLocaleString("en-IN")}`}
                                    </td>
                                    <td>
                                        <span style={{ fontSize:10, padding:"2px 6px", borderRadius:99,
                                            background:rs.bg, color:rs.color, fontWeight:600 }}>
                                            {rule==="exempt"?"0%":
                                             rule==="conditional_7500"?"18%*":
                                             rule==="standard_18"?"18%":
                                             `${parseFloat(h.cgst_rate||0)+parseFloat(h.sgst_rate||0)}%`}
                                        </span>
                                    </td>
                                    <td style={{ fontSize:10, color:"#6b7280" }}>
                                        {(h.applies_to_types||"").split(",").map(t=>
                                            t.replace("residential_flat","Res").replace("commercial_shop","Shop").replace("commercial_office","Office")
                                        ).join(", ")}
                                    </td>
                                    <td>
                                        <span style={{ fontSize:11, padding:"2px 8px", borderRadius:99,
                                            background:h.is_active?"#d1fae5":"#f3f4f6",
                                            color:h.is_active?"#065f46":"#6b7280", fontWeight:600 }}>
                                            {h.is_active?"Active":"Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <button className="billing-btn billing-btn-outline billing-btn-sm" onClick={() => openEdit(h)}>✏️</button>
                                            <button className="billing-btn billing-btn-sm"
                                                style={{ background:"#fee2e2", color:"#dc2626", border:"1px solid #fecaca" }}
                                                onClick={() => handleDelete(h)} disabled={deleting===h.id}>
                                                {deleting===h.id?"...":"🗑"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ background:"rgba(0,0,0,0.5)", zIndex:9999 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content" style={{ borderRadius:12, border:"none", maxHeight:"92vh", overflowY:"auto" }}>
                            <div style={{ background:"#1e40af", padding:"16px 20px", color:"#fff",
                                borderRadius:"12px 12px 0 0", position:"sticky", top:0, zIndex:1 }}>
                                <div style={{ fontSize:16, fontWeight:800 }}>
                                    {editing ? "✏️ Edit Charge Head" : "+ Add Charge Head"}
                                </div>
                                <div style={{ fontSize:11, opacity:.8 }}>Configure amount, calculation basis, and GST rules</div>
                            </div>

                            {/* Tabs */}
                            <div style={{ display:"flex", borderBottom:"1px solid #e5e7eb", background:"#f9fafb" }}>
                                {[["basic","📋 Basic"],["percentage","% Percentage"],["gst","🧾 GST"]].map(([t,l]) => (
                                    <button key={t} onClick={() => setTab(t)}
                                        style={{ padding:"10px 20px", border:"none", background:"none", cursor:"pointer",
                                            fontWeight:tab===t?"700":"400", fontSize:13,
                                            color:tab===t?"#2563eb":"#6b7280",
                                            borderBottom:tab===t?"2px solid #2563eb":"2px solid transparent" }}>
                                        {l}
                                    </button>
                                ))}
                            </div>

                            <div style={{ padding:20 }}>
                                {/* ── BASIC TAB ── */}
                                {tab === "basic" && (
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="billing-form-label">Head Code *</label>
                                            <input type="text" className="billing-form-input"
                                                value={form.head_code}
                                                onChange={e => setForm({...form, head_code:e.target.value.toUpperCase()})}
                                                placeholder="e.g. GMM" />
                                        </div>
                                        <div className="col-md-8">
                                            <label className="billing-form-label">Head Name *</label>
                                            <input type="text" className="billing-form-input"
                                                value={form.head_name}
                                                onChange={e => setForm({...form, head_name:e.target.value})}
                                                placeholder="e.g. General Maintenance" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="billing-form-label">Group</label>
                                            <input type="text" className="billing-form-input"
                                                value={form.head_group}
                                                onChange={e => setForm({...form, head_group:e.target.value})}
                                                placeholder="e.g. Maintenance" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="billing-form-label">Sort Order</label>
                                            <input type="number" className="billing-form-input"
                                                value={form.sort_order}
                                                onChange={e => setForm({...form, sort_order:e.target.value})} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="billing-form-label">Status</label>
                                            <select className="billing-form-input"
                                                value={form.is_active}
                                                onChange={e => setForm({...form, is_active:parseInt(e.target.value)})}>
                                                <option value={1}>Active</option>
                                                <option value={0}>Inactive</option>
                                            </select>
                                        </div>

                                        {/* Charge Basis */}
                                        <div className="col-12">
                                            <label className="billing-form-label">Calculation Basis *</label>
                                            <div className="d-flex gap-2 flex-wrap">
                                                {[
                                                    ["fixed",      "₹ Fixed Amount",    "Set a fixed ₹ per period"],
                                                    ["per_sqft",   "₹/sqft",            "Amount × flat area"],
                                                    ["percentage", "% of Other Charges","% of sum of selected heads"],
                                                ].map(([v,l,d]) => (
                                                    <label key={v} style={{ flex:1, minWidth:140, padding:"10px 12px",
                                                        border:`2px solid ${form.charge_basis===v?"#2563eb":"#e5e7eb"}`,
                                                        borderRadius:8, cursor:"pointer",
                                                        background:form.charge_basis===v?"#eff6ff":"#fff" }}>
                                                        <input type="radio" name="charge_basis" value={v}
                                                            checked={form.charge_basis===v}
                                                            onChange={() => setForm({...form, charge_basis:v})}
                                                            style={{ marginRight:6 }} />
                                                        <b style={{ fontSize:13 }}>{l}</b>
                                                        <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>{d}</div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {form.charge_basis === "fixed" && (
                                            <div className="col-md-6">
                                                <label className="billing-form-label">Fixed Amount (₹) *</label>
                                                <input type="number" className="billing-form-input"
                                                    value={form.centralised_amount}
                                                    onChange={e => setForm({...form, centralised_amount:e.target.value})}
                                                    placeholder="e.g. 1100" />
                                            </div>
                                        )}
                                        {form.charge_basis === "per_sqft" && (
                                            <div className="col-md-6">
                                                <label className="billing-form-label">Rate per Sqft (₹)</label>
                                                <input type="number" className="billing-form-input" step="0.01"
                                                    value={form.centralised_rate}
                                                    onChange={e => setForm({...form, centralised_rate:e.target.value})}
                                                    placeholder="e.g. 2.5" />
                                            </div>
                                        )}
                                        {form.charge_basis === "percentage" && (
                                            <div className="col-12">
                                                <div style={{ background:"#f5f3ff", border:"1px solid #ddd6fe",
                                                    borderRadius:8, padding:"10px 14px", fontSize:12, color:"#7c3aed", marginTop:4 }}>
                                                    ⚙️ Configure percentage settings in the <b>% Percentage</b> tab →
                                                </div>
                                            </div>
                                        )}

                                        {/* Scope */}
                                        <div className="col-md-6">
                                            <label className="billing-form-label">Charge Scope</label>
                                            <select className="billing-form-input" value={form.charge_scope}
                                                onChange={e => setForm({...form, charge_scope:e.target.value})}>
                                                <option value="centralised">Centralised (auto-apply)</option>
                                                <option value="per_flat">Per Flat (manual)</option>
                                            </select>
                                        </div>

                                        {/* Applies To */}
                                        <div className="col-12">
                                            <label className="billing-form-label">Applies To (property types)</label>
                                            <div className="d-flex gap-3 flex-wrap mt-1">
                                                {[["residential_flat","Residential Flat"],["commercial_shop","Commercial Shop"],["commercial_office","Commercial Office"]].map(([v,l]) => (
                                                    <label key={v} style={{ cursor:"pointer", fontSize:13 }}>
                                                        <input type="checkbox"
                                                            checked={(form.applies_to_types||[]).includes(v)}
                                                            onChange={() => toggleType(v)}
                                                            style={{ marginRight:5 }} />
                                                        {l}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── PERCENTAGE TAB ── */}
                                {tab === "percentage" && (
                                    <div>
                                        <div style={{ background:"#f5f3ff", border:"1px solid #ddd6fe",
                                            borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:13 }}>
                                            <div style={{ fontWeight:700, color:"#7c3aed", marginBottom:4 }}>
                                                ⚙️ Percentage-Based Charge
                                            </div>
                                            <div style={{ color:"#6b7280" }}>
                                                This charge = <b>{form.percentage_rate||"X"}%</b> of the
                                                sum of selected charge heads below.<br/>
                                                Example: Education Fund = 2% of (GMM + WC + EBC)
                                            </div>
                                        </div>

                                        <div className="row g-3 mb-4">
                                            <div className="col-md-4">
                                                <label className="billing-form-label">Percentage Rate (%)*</label>
                                                <input type="number" className="billing-form-input" step="0.01"
                                                    value={form.percentage_rate}
                                                    onChange={e => setForm({...form, percentage_rate:e.target.value})}
                                                    placeholder="e.g. 2" />
                                            </div>
                                            <div className="col-md-8">
                                                <label className="billing-form-label">Also set Charge Basis to "% of Other Charges"</label>
                                                <div style={{ padding:"9px 12px", background:form.charge_basis==="percentage"?"#d1fae5":"#fff7ed",
                                                    borderRadius:8, fontSize:12,
                                                    color:form.charge_basis==="percentage"?"#065f46":"#92400e" }}>
                                                    {form.charge_basis==="percentage"
                                                        ? "✅ Charge basis is set to Percentage"
                                                        : "⚠️ Go to Basic tab and set Calculation Basis to '% of Other Charges'"}
                                                </div>
                                            </div>
                                        </div>

                                        <label className="billing-form-label">Calculate % of these heads:</label>
                                        {eligibleBases.length === 0 ? (
                                            <div style={{ color:"#9ca3af", fontSize:12, marginTop:8 }}>
                                                No other charge heads found. Add other heads first.
                                            </div>
                                        ) : (
                                            <div className="row g-2 mt-1">
                                                {eligibleBases.map(h => {
                                                    const selected = (form.percentage_of_heads||[]).includes(String(h.id));
                                                    return (
                                                        <div key={h.id} className="col-md-4 col-6">
                                                            <label style={{ display:"flex", alignItems:"center", gap:8,
                                                                padding:"8px 12px", border:`1px solid ${selected?"#2563eb":"#e5e7eb"}`,
                                                                borderRadius:8, cursor:"pointer",
                                                                background:selected?"#eff6ff":"#fff" }}>
                                                                <input type="checkbox" checked={selected}
                                                                    onChange={() => togglePctHead(h.id)} />
                                                                <div>
                                                                    <div style={{ fontWeight:600, fontSize:13 }}>{h.head_name}</div>
                                                                    <div style={{ fontSize:11, color:"#6b7280" }}>
                                                                        {h.head_code} · ₹{parseFloat(h.centralised_amount||0).toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {(form.percentage_of_heads||[]).length > 0 && form.percentage_rate && (
                                            <div style={{ marginTop:16, background:"#f0fdf4", border:"1px solid #6ee7b7",
                                                borderRadius:8, padding:"10px 14px", fontSize:13 }}>
                                                <b>Preview:</b> {form.head_name||"This head"} =
                                                {form.percentage_rate}% of (
                                                {(form.percentage_of_heads||[]).map(id => {
                                                    const h = heads.find(x => String(x.id)===String(id));
                                                    return h?.head_name || id;
                                                }).join(" + ")})
                                                = {form.percentage_rate}% × ₹{
                                                    eligibleBases.filter(h => (form.percentage_of_heads||[]).includes(String(h.id)))
                                                        .reduce((s,h)=>s+parseFloat(h.centralised_amount||0),0).toLocaleString()
                                                } = ₹{
                                                    (eligibleBases.filter(h => (form.percentage_of_heads||[]).includes(String(h.id)))
                                                        .reduce((s,h)=>s+parseFloat(h.centralised_amount||0),0)
                                                        * parseFloat(form.percentage_rate||0) / 100).toFixed(2)
                                                }
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ── GST TAB ── */}
                                {tab === "gst" && (
                                    <div>
                                        <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe",
                                            borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:12 }}>
                                            <b style={{ color:"#1e40af" }}>📋 Indian GST Law Reference</b><br/>
                                            General Maintenance &gt;₹7,500 → 18% GST (Circular 109/28/2019) |
                                            Water/Sinking Fund → Exempt (Notification 12/2017) |
                                            Non-Occupancy/Insurance → Always 18% GST
                                        </div>

                                        <div className="d-flex flex-column gap-2 mb-4">
                                            {GST_RULES.map(r => {
                                                const sel = form.gst_rule === r.value;
                                                const rc  = RULE_COLORS[r.value];
                                                return (
                                                    <label key={r.value}
                                                        style={{ display:"flex", gap:10, cursor:"pointer",
                                                            padding:"12px 14px", borderRadius:10,
                                                            border:`2px solid ${sel?rc.color:"#e5e7eb"}`,
                                                            background:sel?rc.bg:"#fff" }}>
                                                        <input type="radio" name="gst_rule" value={r.value}
                                                            checked={sel}
                                                            onChange={() => handleGstRule(r.value)} />
                                                        <div style={{ flex:1 }}>
                                                            <div style={{ fontWeight:700, fontSize:13, color:sel?rc.color:"#374151" }}>
                                                                {r.label}
                                                            </div>
                                                            <div style={{ fontSize:11, color:"#6b7280" }}>{r.desc}</div>
                                                        </div>
                                                        {(r.cgst+r.sgst) > 0 && (
                                                            <span style={{ background:rc.bg, color:rc.color, padding:"2px 8px",
                                                                borderRadius:99, fontWeight:700, fontSize:13, alignSelf:"center" }}>
                                                                {r.cgst+r.sgst}%
                                                            </span>
                                                        )}
                                                    </label>
                                                );
                                            })}
                                        </div>

                                        {form.gst_rule !== "exempt" && (
                                            <div className="row g-3">
                                                <div className="col-3">
                                                    <label className="billing-form-label">CGST %</label>
                                                    <input type="number" className="billing-form-input" step="0.01"
                                                        value={form.cgst_rate}
                                                        readOnly={form.gst_rule !== "custom"}
                                                        onChange={e => setForm({...form, cgst_rate:e.target.value})}
                                                        style={{ background:form.gst_rule!=="custom"?"#f9fafb":"#fff" }} />
                                                </div>
                                                <div className="col-3">
                                                    <label className="billing-form-label">SGST %</label>
                                                    <input type="number" className="billing-form-input" step="0.01"
                                                        value={form.sgst_rate}
                                                        readOnly={form.gst_rule !== "custom"}
                                                        onChange={e => setForm({...form, sgst_rate:e.target.value})}
                                                        style={{ background:form.gst_rule!=="custom"?"#f9fafb":"#fff" }} />
                                                </div>
                                                <div className="col-3">
                                                    <label className="billing-form-label">IGST %</label>
                                                    <input type="number" className="billing-form-input" step="0.01"
                                                        value={form.igst_rate}
                                                        onChange={e => setForm({...form, igst_rate:e.target.value})} />
                                                </div>
                                                <div className="col-3">
                                                    <label className="billing-form-label">Total GST</label>
                                                    <div style={{ padding:"9px 12px", background:"#f9fafb", borderRadius:8,
                                                        fontWeight:800, fontSize:16,
                                                        color:RULE_COLORS[form.gst_rule]?.color||"#374151" }}>
                                                        {totalGst.toFixed(1)}%
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <label className="billing-form-label">SAC Code</label>
                                                    <input type="text" className="billing-form-input"
                                                        value={form.sac_code}
                                                        onChange={e => setForm({...form, sac_code:e.target.value})}
                                                        placeholder="e.g. 999722" />
                                                </div>
                                                <div className="col-6">
                                                    <label className="billing-form-label">Legal Basis</label>
                                                    <input type="text" className="billing-form-input"
                                                        value={form.gst_notes}
                                                        onChange={e => setForm({...form, gst_notes:e.target.value})} />
                                                </div>
                                                {form.gst_rule==="conditional_7500" && (
                                                    <div className="col-12">
                                                        <div style={{ background:"#fef3c7", border:"1px solid #fde68a",
                                                            borderRadius:8, padding:"8px 12px", fontSize:12, color:"#92400e" }}>
                                                            ⚠️ GST applied only when total monthly maintenance &gt; ₹7,500
                                                            (Circular 109/28/2019-GST)
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div style={{ padding:"12px 20px", borderTop:"1px solid #e5e7eb",
                                display:"flex", justifyContent:"flex-end", gap:10,
                                position:"sticky", bottom:0, background:"#fff", borderRadius:"0 0 12px 12px" }}>
                                <button className="billing-btn billing-btn-outline"
                                    onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="billing-btn billing-btn-primary"
                                    onClick={handleSave} disabled={saving} style={{ minWidth:140 }}>
                                    {saving ? "Saving..." : editing ? "Update" : "Create Head"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChargeHeads;

// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { FiEdit2, FiTrash2, FiPlus, FiRefreshCw } from "react-icons/fi";
// import {
//     listChargeHeadsApi, upsertChargeHeadApi,
//     deleteChargeHeadApi, autoApplyChargeHeadApi
// } from "../../services/BillingApi";
// import "../../styles/Billing.css";

// const PROPERTY_TYPES = [
//     "residential_flat", "commercial_shop", "commercial_office"
// ];

// const ChargeHeads = ({ setActive }) => {
//     const [heads, setHeads]         = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [editHead, setEditHead]   = useState(null);
//     const [applying, setApplying]   = useState(null);
//     const [form, setForm]           = useState({
//         head_code: "", head_name: "", head_group: "",
//         charge_type: "fixed", charge_scope: "centralised",
//         centralised_amount: "", centralised_rate: "",
//         applies_to_types: ["residential_flat"],
//         is_active: 1, sort_order: 0
//     });
//     const [loading, setLoading]     = useState(false);

//     useEffect(() => { fetchHeads(); }, []);

//     const fetchHeads = async () => {
//         try {
//             const res = await listChargeHeadsApi("");
//             setHeads(res?.charge_heads || res || []);
//         } catch (e) {
//             toast.error(typeof e === "string" ? e : "Failed to load charge heads");
//         }
//     };

//     const openAdd = () => {
//         setEditHead(null);
//         setForm({
//             head_code: "", head_name: "", head_group: "",
//             charge_type: "fixed", charge_scope: "centralised",
//             centralised_amount: "", centralised_rate: "",
//             applies_to_types: ["residential_flat"],
//             is_active: 1, sort_order: heads.length + 1
//         });
//         setShowModal(true);
//     };

//     const openEdit = (h) => {
//         setEditHead(h);
//         setForm({
//             head_code:          h.head_code,
//             head_name:          h.head_name,
//             head_group:         h.head_group || "",
//             charge_type:        h.charge_type || "fixed",
//             charge_scope:       h.charge_scope || "centralised",
//             centralised_amount: h.centralised_amount || "",
//             centralised_rate:   h.centralised_rate   || "",
//             applies_to_types:   h.applies_to_types
//                 ? h.applies_to_types.split(",")
//                 : ["residential_flat"],
//             is_active:  h.is_active,
//             sort_order: h.sort_order
//         });
//         setShowModal(true);
//     };

//     const handleSave = async () => {
//         if (!form.head_code || !form.head_name) {
//             toast.error("Code and Name are required");
//             return;
//         }
//         if (form.charge_scope === "centralised") {
//             if (form.charge_type === "fixed" && !form.centralised_amount) {
//                 toast.error("Amount is required for Fixed Centralised charges");
//                 return;
//             }
//             if (form.charge_type === "per_sqft" && !form.centralised_rate) {
//                 toast.error("Rate per sqft is required");
//                 return;
//             }
//         }
//         setLoading(true);
//         try {
//             await upsertChargeHeadApi({
//                 head_id:            editHead?.id || null,
//                 head_code:          form.head_code,
//                 head_name:          form.head_name,
//                 head_group:         form.head_group || null,
//                 charge_type:        form.charge_type,
//                 charge_scope:       form.charge_scope,
//                 centralised_amount: form.charge_scope === "centralised" && form.charge_type === "fixed"
//                     ? parseFloat(form.centralised_amount) : null,
//                 centralised_rate:   form.charge_scope === "centralised" && form.charge_type === "per_sqft"
//                     ? parseFloat(form.centralised_rate) : null,
//                 applies_to_types:   form.applies_to_types.join(","),
//                 is_active:          form.is_active,
//                 sort_order:         parseInt(form.sort_order) || 0,
//             });
//             toast.success(editHead ? "Charge head updated" : "Charge head created & auto-applied");
//             setShowModal(false);
//             fetchHeads();
//         } catch (e) {
//             toast.error(typeof e === "string" ? e : "Failed to save");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (h) => {
//         if (!window.confirm(`Delete "${h.head_name}"? This cannot be undone.`)) return;
//         try {
//             await deleteChargeHeadApi(h.id);
//             toast.success("Charge head deleted");
//             fetchHeads();
//         } catch (e) {
//             toast.error(typeof e === "string" ? e : "Failed to delete");
//         }
//     };

//     const handleAutoApply = async (h) => {
//         setApplying(h.id);
//         try {
//             const res = await autoApplyChargeHeadApi(h.id);
//             toast.success(`Applied to ${res?.flats_updated || 0} flats`);
//         } catch (e) {
//             toast.error(typeof e === "string" ? e : "Auto apply failed");
//         } finally {
//             setApplying(null);
//         }
//     };

//     const toggleType = (type) => {
//         setForm((prev) => {
//             const arr = prev.applies_to_types.includes(type)
//                 ? prev.applies_to_types.filter((t) => t !== type)
//                 : [...prev.applies_to_types, type];
//             return { ...prev, applies_to_types: arr.length ? arr : [type] };
//         });
//     };

//     return (
//         <div className="pg" style={{ padding: "20px 24px" }}>

//             {/* Header */}
//             <div className="d-flex align-items-center justify-content-between mb-4">
//                 <div>
//                     <h4 style={{ fontWeight: 700, margin: 0 }}>🏷️ Charge Heads</h4>
//                     <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
//                         Dynamic billing charge heads for your society
//                     </p>
//                 </div>
//                 <div className="d-flex gap-2">
//                     <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>
//                         ← Dashboard
//                     </button>
//                     <button className="billing-btn billing-btn-primary" onClick={openAdd}>
//                         <FiPlus /> Add Charge Head
//                     </button>
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="billing-card" style={{ padding: 0, overflow: "hidden" }}>
//                 <div style={{ overflowX: "auto" }}>
//                     <table className="billing-table">
//                         <thead>
//                             <tr>
//                                 <th>#</th>
//                                 <th>Code</th>
//                                 <th>Name</th>
//                                 <th>Group</th>
//                                 <th>Charge Type</th>
//                                 <th>Scope</th>
//                                 <th>Rate / Amount</th>
//                                 <th>Applies To</th>
//                                 <th>Status</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {heads.length === 0 ? (
//                                 <tr>
//                                     <td colSpan={10} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
//                                         No charge heads yet — add your first one
//                                     </td>
//                                 </tr>
//                             ) : heads.map((h) => (
//                                 <tr key={h.id}>
//                                     <td style={{ color: "#9ca3af", fontSize: 12 }}>{h.sort_order}</td>
//                                     <td>
//                                         <span style={{ fontWeight: 700, color: "#2563eb", fontSize: 13 }}>
//                                             {h.head_code}
//                                         </span>
//                                     </td>
//                                     <td style={{ fontWeight: 600 }}>{h.head_name}</td>
//                                     <td style={{ color: "#6b7280", fontSize: 12 }}>{h.head_group || "—"}</td>
//                                     <td>
//                                         <span className={`scope-badge ${h.charge_type}`}>
//                                             {h.charge_type === "per_sqft" ? "Per SqFt" : "Fixed"}
//                                         </span>
//                                     </td>
//                                     <td>
//                                         <span className={`scope-badge ${h.charge_scope}`}>
//                                             {h.charge_scope === "centralised" ? "Centralised" : "Per Flat"}
//                                         </span>
//                                     </td>
//                                     <td className="amount-display">
//                                         {h.charge_scope === "centralised"
//                                             ? h.charge_type === "per_sqft"
//                                                 ? `₹${h.centralised_rate}/sqft`
//                                                 : `₹${Number(h.centralised_amount || 0).toLocaleString("en-IN")}`
//                                             : <span className="amount-muted">Set per flat</span>
//                                         }
//                                     </td>
//                                     <td>
//                                         <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
//                                             {(h.applies_to_types || "").split(",").map((t) => (
//                                                 <span key={t} style={{
//                                                     fontSize: 10, padding: "2px 6px",
//                                                     background: "#f3f4f6", color: "#374151",
//                                                     borderRadius: 6
//                                                 }}>
//                                                     {t.replace("_", " ")}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </td>
//                                     <td>
//                                         <span className={`bill-badge ${h.is_active ? "paid" : "unpaid"}`}>
//                                             {h.is_active ? "Active" : "Inactive"}
//                                         </span>
//                                     </td>
//                                     <td>
//                                         <div className="d-flex gap-1">
//                                             <button
//                                                 className="billing-btn billing-btn-outline billing-btn-sm"
//                                                 title="Edit"
//                                                 onClick={() => openEdit(h)}
//                                             >
//                                                 <FiEdit2 size={12} />
//                                             </button>
//                                             {h.charge_scope === "centralised" && (
//                                                 <button
//                                                     className="billing-btn billing-btn-outline billing-btn-sm"
//                                                     title="Auto Apply to all flats"
//                                                     onClick={() => handleAutoApply(h)}
//                                                     disabled={applying === h.id}
//                                                 >
//                                                     {applying === h.id
//                                                         ? <span style={{ fontSize: 10 }}>...</span>
//                                                         : <FiRefreshCw size={12} />
//                                                     }
//                                                 </button>
//                                             )}
//                                             <button
//                                                 className="billing-btn billing-btn-danger billing-btn-sm"
//                                                 title="Delete"
//                                                 onClick={() => handleDelete(h)}
//                                             >
//                                                 <FiTrash2 size={12} />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* ── Modal ── */}
//             {showModal && (
//                 <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.4)" }}>
//                     <div className="modal-dialog modal-dialog-centered modal-lg">
//                         <div className="modal-content" style={{ borderRadius: 12, border: "none" }}>
//                             <div className="billing-modal-header">
//                                 <span>{editHead ? "✏️ Edit Charge Head" : "➕ Add Charge Head"}</span>
//                                 <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
//                             </div>
//                             <div style={{ padding: 24 }}>
//                                 <div className="row g-3">
//                                     <div className="col-4">
//                                         <label className="billing-form-label">Head Code *</label>
//                                         <input type="text" className="billing-form-input"
//                                             value={form.head_code}
//                                             onChange={(e) => setForm({ ...form, head_code: e.target.value.toUpperCase() })}
//                                             placeholder="e.g. GM, WC, SF"
//                                             disabled={!!editHead}
//                                         />
//                                     </div>
//                                     <div className="col-8">
//                                         <label className="billing-form-label">Head Name *</label>
//                                         <input type="text" className="billing-form-input"
//                                             value={form.head_name}
//                                             onChange={(e) => setForm({ ...form, head_name: e.target.value })}
//                                             placeholder="e.g. General Maintenance"
//                                         />
//                                     </div>
//                                     <div className="col-6">
//                                         <label className="billing-form-label">Group</label>
//                                         <input type="text" className="billing-form-input"
//                                             value={form.head_group}
//                                             onChange={(e) => setForm({ ...form, head_group: e.target.value })}
//                                             placeholder="Maintenance / Fund / Charges"
//                                         />
//                                     </div>
//                                     <div className="col-3">
//                                         <label className="billing-form-label">Sort Order</label>
//                                         <input type="number" className="billing-form-input"
//                                             value={form.sort_order}
//                                             onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
//                                         />
//                                     </div>
//                                     <div className="col-3">
//                                         <label className="billing-form-label">Status</label>
//                                         <select className="billing-form-input"
//                                             value={form.is_active}
//                                             onChange={(e) => setForm({ ...form, is_active: parseInt(e.target.value) })}
//                                         >
//                                             <option value={1}>Active</option>
//                                             <option value={0}>Inactive</option>
//                                         </select>
//                                     </div>

//                                     {/* Charge Type + Scope */}
//                                     <div className="col-6">
//                                         <label className="billing-form-label">Charge Type</label>
//                                         <div className="d-flex gap-2">
//                                             {["fixed", "per_sqft"].map((t) => (
//                                                 <label key={t} className="d-flex align-items-center gap-1"
//                                                     style={{ cursor: "pointer", fontSize: 13 }}>
//                                                     <input type="radio" name="charge_type"
//                                                         checked={form.charge_type === t}
//                                                         onChange={() => setForm({ ...form, charge_type: t })}
//                                                     />
//                                                     {t === "fixed" ? "Fixed Amount" : "Per SqFt"}
//                                                 </label>
//                                             ))}
//                                         </div>
//                                     </div>
//                                     <div className="col-6">
//                                         <label className="billing-form-label">Charge Scope</label>
//                                         <div className="d-flex gap-2">
//                                             {["centralised", "per_flat"].map((s) => (
//                                                 <label key={s} className="d-flex align-items-center gap-1"
//                                                     style={{ cursor: "pointer", fontSize: 13 }}>
//                                                     <input type="radio" name="charge_scope"
//                                                         checked={form.charge_scope === s}
//                                                         onChange={() => setForm({ ...form, charge_scope: s })}
//                                                     />
//                                                     {s === "centralised" ? "Centralised (auto-apply)" : "Per Flat (manual)"}
//                                                 </label>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     {/* Amount / Rate — only for centralised */}
//                                     {form.charge_scope === "centralised" && (
//                                         <div className="col-6">
//                                             <label className="billing-form-label">
//                                                 {form.charge_type === "per_sqft" ? "Rate Per SqFt (₹) *" : "Amount (₹) *"}
//                                             </label>
//                                             <input type="number" className="billing-form-input" min="0" step="0.01"
//                                                 value={form.charge_type === "per_sqft" ? form.centralised_rate : form.centralised_amount}
//                                                 onChange={(e) => setForm({
//                                                     ...form,
//                                                     [form.charge_type === "per_sqft" ? "centralised_rate" : "centralised_amount"]: e.target.value
//                                                 })}
//                                                 placeholder={form.charge_type === "per_sqft" ? "0.03" : "1100.00"}
//                                             />
//                                             {form.charge_scope === "centralised" && form.charge_type === "per_sqft" && (
//                                                 <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
//                                                     Amount = rate × flat area_sqft
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )}

//                                     {/* Applies To */}
//                                     <div className="col-12">
//                                         <label className="billing-form-label">Applies To (property types) *</label>
//                                         <div className="d-flex gap-3 flex-wrap">
//                                             {PROPERTY_TYPES.map((t) => (
//                                                 <label key={t} className="d-flex align-items-center gap-1"
//                                                     style={{ cursor: "pointer", fontSize: 13 }}>
//                                                     <input type="checkbox"
//                                                         checked={form.applies_to_types.includes(t)}
//                                                         onChange={() => toggleType(t)}
//                                                     />
//                                                     {t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
//                                                 </label>
//                                             ))}
//                                         </div>
//                                         <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
//                                             Selected: {form.applies_to_types.join(", ")}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Info box */}
//                                 <div style={{
//                                     background: "#f0f9ff", border: "1px solid #bae6fd",
//                                     borderRadius: 8, padding: "10px 14px", marginTop: 16,
//                                     fontSize: 12, color: "#0369a1"
//                                 }}>
//                                     {form.charge_scope === "centralised"
//                                         ? "✅ Centralised — will auto-apply to all matching flats when saved. Flats with manual overrides will be skipped."
//                                         : "ℹ️ Per Flat — you will set the amount manually for each flat from Flat Charges page."
//                                     }
//                                 </div>

//                                 <div className="d-flex justify-content-end gap-2 mt-3">
//                                     <button className="billing-btn billing-btn-outline" onClick={() => setShowModal(false)}>
//                                         Cancel
//                                     </button>
//                                     <button className="billing-btn billing-btn-primary" onClick={handleSave} disabled={loading}>
//                                         {loading ? "Saving..." : editHead ? "Update" : "Create & Apply"}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ChargeHeads;
