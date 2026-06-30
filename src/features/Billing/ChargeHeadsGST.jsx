/**
 * ChargeHeadsGST.jsx
 * GST configuration per charge head
 * Per Indian law: Notification 12/2017-CT(Rate) + Circular 109/28/2019-GST
 */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { listChargeHeadsApi } from "../../services/BillingApi";
import apiClient from "../../services/ApiClient";
import UrlData from "../../utils/Url";
import { GetSessionData } from "../../utils/SessionManagement";

const getSid = () => {
    const s = GetSessionData();
    return s?.data?.flats?.[0]?.society_id || null;
};

const billingPost = async (ep, data) => {
    const r = await apiClient({ method:"post", url: UrlData+"billing/"+ep,
        data: { society_id: getSid(), ...data } });
    return r.data.data;
};

// Indian GST rules reference
const GST_RULES = [
    {
        value: "exempt",
        label: "🟢 Exempt — No GST",
        desc: "Water charges, sinking fund, repair fund, property tax collection, corpus fund",
        law: "Notification No. 12/2017-CT(Rate) — Exempt list",
        cgst: 0, sgst: 0,
    },
    {
        value: "conditional_7500",
        label: "🟡 Conditional — 18% GST (if > ₹7,500/month)",
        desc: "General maintenance / service charges. GST only if member's monthly bill exceeds ₹7,500",
        law: "Circular No. 109/28/2019-GST + Notification 12/2017-CT(Rate)",
        cgst: 9, sgst: 9, sac: "999722",
    },
    {
        value: "standard_18",
        label: "🔴 Standard 18% GST (always)",
        desc: "Non-occupancy charges, building insurance, club charges, other services",
        law: "SAC 997221/997137 — 18% GST always applicable",
        cgst: 9, sgst: 9,
    },
    {
        value: "custom",
        label: "⚙️ Custom Rate",
        desc: "Set your own CGST/SGST/IGST rates",
        law: "Custom configuration",
        cgst: 0, sgst: 0,
    },
];

// Common SAC codes for society charges
const SAC_CODES = [
    { code: "999722", label: "999722 — Maintenance of residential colony" },
    { code: "997221", label: "997221 — Non-occupancy / letting out" },
    { code: "997137", label: "997137 — Building insurance services" },
    { code: "998311", label: "998311 — Repair & maintenance services" },
    { code: "",        label: "— Not applicable (exempt)" },
];

const ChargeHeadsGST = ({ setActive }) => {
    const [heads,    setHeads]   = useState([]);
    const [loading,  setLoading] = useState(true);
    const [editing,  setEditing] = useState(null); // head being edited
    const [saving,   setSaving]  = useState(false);
    const [form,     setForm]    = useState({
        gst_rule:"exempt", cgst_rate:0, sgst_rate:0, igst_rate:0, sac_code:"", gst_notes:""
    });

    useEffect(() => { loadHeads(); }, []);

    const loadHeads = async () => {
        setLoading(true);
        try {
            const r = await listChargeHeadsApi();
            setHeads(r?.charge_heads || []);
        } catch(e) {
            toast.error("Failed to load charge heads");
        } finally { setLoading(false); }
    };

    const openEdit = (head) => {
        setEditing(head);
        const rule = GST_RULES.find(r => r.value === (head.gst_rule || "exempt")) || GST_RULES[0];
        setForm({
            gst_rule:  head.gst_rule  || "exempt",
            cgst_rate: head.cgst_rate || rule.cgst,
            sgst_rate: head.sgst_rate || rule.sgst,
            igst_rate: head.igst_rate || 0,
            sac_code:  head.sac_code  || rule.sac || "",
            gst_notes: head.gst_notes || rule.law || "",
        });
    };

    const handleRuleChange = (rule_value) => {
        const rule = GST_RULES.find(r => r.value === rule_value);
        setForm(f => ({
            ...f,
            gst_rule:  rule_value,
            cgst_rate: rule.cgst || f.cgst_rate,
            sgst_rate: rule.sgst || f.sgst_rate,
            igst_rate: 0,
            sac_code:  rule.sac || f.sac_code,
            gst_notes: rule.law,
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await billingPost("UpsertChargeHeadGST", {
                head_id:   editing.id,
                gst_rule:  form.gst_rule,
                cgst_rate: parseFloat(form.cgst_rate) || 0,
                sgst_rate: parseFloat(form.sgst_rate) || 0,
                igst_rate: parseFloat(form.igst_rate) || 0,
                sac_code:  form.sac_code || null,
                gst_notes: form.gst_notes || null,
            });
            toast.success(`GST rule saved for ${editing.head_name} ✅`);
            setEditing(null);
            loadHeads();
        } catch(e) {
            toast.error(typeof e === "string" ? e : "Save failed");
        } finally { setSaving(false); }
    };

    const ruleInfo = GST_RULES.find(r => r.value === form.gst_rule);

    const ruleColor = (rule) => ({
        exempt:          "#059669",
        conditional_7500:"#d97706",
        standard_18:     "#dc2626",
        custom:          "#7c3aed",
    })[rule] || "#6b7280";

    const ruleBg = (rule) => ({
        exempt:          "#d1fae5",
        conditional_7500:"#fef3c7",
        standard_18:     "#fee2e2",
        custom:          "#f5f3ff",
    })[rule] || "#f3f4f6";

    return (
        <div className="pg" style={{ padding:"20px 24px" }}>
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                <div>
                    <h4 style={{ fontWeight:700, margin:0 }}>🧾 GST Configuration</h4>
                    <p style={{ color:"#6b7280", fontSize:13, margin:0 }}>
                        Per Indian law — Notification 12/2017-CT(Rate) + Circular 109/28/2019-GST
                    </p>
                </div>
                <button className="billing-btn billing-btn-outline"
                    onClick={() => setActive("chargeHeads")}>← Charge Heads</button>
            </div>

            {/* Law reference box */}
            <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe",
                borderRadius:10, padding:"12px 16px", marginBottom:20, fontSize:13 }}>
                <div style={{ fontWeight:700, color:"#1e40af", marginBottom:6 }}>
                    📋 Indian Housing Society GST Rules Summary
                </div>
                <div className="row g-2">
                    {GST_RULES.map(r => (
                        <div key={r.value} className="col-12 col-md-6">
                            <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                                <span style={{ background:ruleBg(r.value), color:ruleColor(r.value),
                                    padding:"1px 6px", borderRadius:4, fontSize:11, fontWeight:700,
                                    whiteSpace:"nowrap", marginTop:1 }}>
                                    {r.cgst+r.sgst > 0 ? `${r.cgst+r.sgst}%` : "0%"}
                                </span>
                                <div>
                                    <div style={{ fontWeight:600, color:"#374151", fontSize:12 }}>{r.label.replace(/.*— /, "")}</div>
                                    <div style={{ color:"#6b7280", fontSize:11 }}>{r.desc}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charge heads table */}
            <div className="billing-card" style={{ padding:0 }}>
                <div style={{ padding:"12px 20px", borderBottom:"1px solid #f3f4f6", fontWeight:700, fontSize:14 }}>
                    Charge Heads — GST Status
                </div>
                {loading ? (
                    <div style={{ padding:40, textAlign:"center", color:"#9ca3af" }}>Loading...</div>
                ) : (
                    <table className="billing-table">
                        <thead>
                            <tr>
                                <th>Head Name</th><th>Code</th><th>Type</th>
                                <th>GST Rule</th><th>CGST</th><th>SGST</th>
                                <th>SAC Code</th><th>Legal Basis</th><th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {heads.map(h => {
                                const rule  = h.gst_rule || "exempt";
                                const total = (parseFloat(h.cgst_rate||0) + parseFloat(h.sgst_rate||0));
                                return (
                                    <tr key={h.id}>
                                        <td style={{ fontWeight:600 }}>{h.head_name}</td>
                                        <td style={{ fontSize:12, color:"#6b7280" }}>{h.head_code}</td>
                                        <td style={{ fontSize:12 }}>{h.charge_type}</td>
                                        <td>
                                            <span style={{
                                                background: ruleBg(rule), color: ruleColor(rule),
                                                padding:"2px 8px", borderRadius:99, fontSize:11, fontWeight:700
                                            }}>
                                                {rule === "exempt"           ? "🟢 Exempt" :
                                                 rule === "conditional_7500" ? "🟡 Conditional" :
                                                 rule === "standard_18"      ? "🔴 Standard 18%" : "⚙️ Custom"}
                                            </span>
                                        </td>
                                        <td style={{ textAlign:"center", fontSize:12 }}>
                                            {parseFloat(h.cgst_rate||0) > 0 ? `${h.cgst_rate}%` : "—"}
                                        </td>
                                        <td style={{ textAlign:"center", fontSize:12 }}>
                                            {parseFloat(h.sgst_rate||0) > 0 ? `${h.sgst_rate}%` : "—"}
                                        </td>
                                        <td style={{ fontSize:11, color:"#6b7280" }}>{h.sac_code || "—"}</td>
                                        <td style={{ fontSize:10, color:"#9ca3af", maxWidth:160, whiteSpace:"normal" }}>
                                            {h.gst_notes || "—"}
                                        </td>
                                        <td>
                                            <button className="billing-btn billing-btn-outline billing-btn-sm"
                                                onClick={() => openEdit(h)}>
                                                ✏️ Edit GST
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Edit Modal */}
            {editing && (
                <div className="modal show d-block" style={{ background:"rgba(0,0,0,0.5)", zIndex:9999 }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth:560 }}>
                        <div className="modal-content" style={{ borderRadius:12, border:"none" }}>
                            <div style={{ background:"#1e40af", padding:"16px 20px", color:"#fff",
                                borderRadius:"12px 12px 0 0" }}>
                                <div style={{ fontSize:16, fontWeight:800 }}>
                                    🧾 GST Rule — {editing.head_name}
                                </div>
                                <div style={{ fontSize:12, opacity:.8 }}>
                                    Code: {editing.head_code} · Amount: ₹{editing.centralised_amount || "varies"}
                                </div>
                            </div>
                            <div style={{ padding:20 }}>
                                {/* Rule selector */}
                                <div style={{ marginBottom:16 }}>
                                    <label className="billing-form-label">GST Rule *</label>
                                    <div className="d-flex flex-column gap-2">
                                        {GST_RULES.map(r => (
                                            <label key={r.value}
                                                style={{ display:"flex", gap:10, cursor:"pointer", padding:"10px 12px",
                                                    borderRadius:8, border:`2px solid ${form.gst_rule===r.value?ruleColor(r.value):"#e5e7eb"}`,
                                                    background: form.gst_rule===r.value ? ruleBg(r.value) : "#fff" }}>
                                                <input type="radio" name="gst_rule" value={r.value}
                                                    checked={form.gst_rule === r.value}
                                                    onChange={() => handleRuleChange(r.value)} />
                                                <div>
                                                    <div style={{ fontWeight:700, fontSize:13, color:form.gst_rule===r.value?ruleColor(r.value):"#374151" }}>
                                                        {r.label}
                                                    </div>
                                                    <div style={{ fontSize:11, color:"#6b7280" }}>{r.desc}</div>
                                                    <div style={{ fontSize:10, color:"#9ca3af", marginTop:1 }}>📋 {r.law}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Rate inputs */}
                                {form.gst_rule !== "exempt" && (
                                    <div className="row g-3 mb-3">
                                        <div className="col-4">
                                            <label className="billing-form-label">CGST %</label>
                                            <input type="number" className="billing-form-input" step="0.01"
                                                value={form.cgst_rate}
                                                readOnly={form.gst_rule !== "custom"}
                                                onChange={e => setForm({...form, cgst_rate:e.target.value})}
                                                style={{ background: form.gst_rule !== "custom" ? "#f9fafb":"#fff" }} />
                                        </div>
                                        <div className="col-4">
                                            <label className="billing-form-label">SGST %</label>
                                            <input type="number" className="billing-form-input" step="0.01"
                                                value={form.sgst_rate}
                                                readOnly={form.gst_rule !== "custom"}
                                                onChange={e => setForm({...form, sgst_rate:e.target.value})}
                                                style={{ background: form.gst_rule !== "custom" ? "#f9fafb":"#fff" }} />
                                        </div>
                                        <div className="col-4">
                                            <label className="billing-form-label">IGST % (inter-state)</label>
                                            <input type="number" className="billing-form-input" step="0.01"
                                                value={form.igst_rate}
                                                onChange={e => setForm({...form, igst_rate:e.target.value})} />
                                        </div>
                                        <div className="col-6">
                                            <label className="billing-form-label">SAC Code</label>
                                            <select className="billing-form-input"
                                                value={form.sac_code}
                                                onChange={e => setForm({...form, sac_code:e.target.value})}>
                                                {SAC_CODES.map(s => (
                                                    <option key={s.code} value={s.code}>{s.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <label className="billing-form-label">Effective Rate</label>
                                            <div style={{ padding:"9px 12px", background:"#f9fafb",
                                                borderRadius:8, fontWeight:700, fontSize:16, color:ruleColor(form.gst_rule) }}>
                                                {(parseFloat(form.cgst_rate||0)+parseFloat(form.sgst_rate||0)+parseFloat(form.igst_rate||0)).toFixed(1)}% GST
                                            </div>
                                        </div>
                                        {form.gst_rule === "conditional_7500" && (
                                            <div className="col-12">
                                                <div style={{ background:"#fef3c7", border:"1px solid #fde68a",
                                                    borderRadius:8, padding:"8px 12px", fontSize:12, color:"#92400e" }}>
                                                    ⚠️ This GST will only apply when the member's total maintenance
                                                    exceeds <b>₹7,500/month</b>. Below that → Exempt.
                                                    (Circular 109/28/2019-GST)
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div style={{ marginBottom:16 }}>
                                    <label className="billing-form-label">Legal Basis / Notes</label>
                                    <input type="text" className="billing-form-input"
                                        value={form.gst_notes}
                                        onChange={e => setForm({...form, gst_notes:e.target.value})} />
                                </div>

                                <div className="d-flex gap-2">
                                    <button className="billing-btn billing-btn-outline" style={{ flex:1 }}
                                        onClick={() => setEditing(null)}>Cancel</button>
                                    <button className="billing-btn billing-btn-primary" style={{ flex:2 }}
                                        onClick={handleSave} disabled={saving}>
                                        {saving ? "Saving..." : "✅ Save GST Rule"}
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

export default ChargeHeadsGST;
