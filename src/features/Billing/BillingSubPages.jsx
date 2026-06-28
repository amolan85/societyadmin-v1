// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { FiSearch } from "react-icons/fi";
// import {
//     getBillingSettingsApi,
//     upsertBillingSettingsApi,
//     getFlatLedgerApi,
//     setOpeningBalanceApi,
// } from "../../services/BillingApi";
// import { getAllMembersWithoutPaginationApi } from "../../services/AddMemberApi";
// import { GetSessionData } from "../../utils/SessionManagement";
// import "../../styles/Billing.css";

// const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

// const MONTHS = [
//     "January","February","March","April","May","June",
//     "July","August","September","October","November","December"
// ];

// const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);


// // ─────────────────────────────────────────────────────────────────────────────
// // Shared hook — loads flat options from session society_id
// // Used by FlatLedger and OpeningBalance
// // ─────────────────────────────────────────────────────────────────────────────
// const useFlatOptions = () => {
//     const [societyId,   setSocietyId]   = useState("");
//     const [flatOptions, setFlatOptions] = useState([]);

//     useEffect(() => {
//         const s = GetSessionData();
//         const sid = s?.society_id || s?.data?.society_id || "";
//         if (sid) {
//             setSocietyId(sid);
//             fetchFlats(sid);
//         }
//     }, []);

//     const fetchFlats = async (sid) => {
//         try {
//             const res = await getAllMembersWithoutPaginationApi(sid, "", "", "", "", null);
//             const members = res?.members || res || [];
//             const seen    = new Set();
//             const opts    = [];
//             members.forEach((m) => {
//                 if (m.flat_id && !seen.has(m.flat_id)) {
//                     seen.add(m.flat_id);
//                     opts.push({
//                         flat_id:     m.flat_id,
//                         flat_number: m.flat_number,
//                         block:       m.block,
//                     });
//                 }
//             });
//             setFlatOptions(opts);
//         } catch (_) {}
//     };

//     return { societyId, flatOptions };
// };


// // ─────────────────────────────────────────────────────────────────────────────
// // Flat Ledger
// // ─────────────────────────────────────────────────────────────────────────────
// export const FlatLedger = ({ setActive }) => {
//     const { flatOptions } = useFlatOptions();

//     const [flatId,     setFlatId]     = useState("");
//     const [fromYear,   setFromYear]   = useState(new Date().getFullYear());
//     const [toYear,     setToYear]     = useState(new Date().getFullYear());
//     const [flatInfo,   setFlatInfo]   = useState(null);
//     const [openingBal, setOpeningBal] = useState(null);
//     const [bills,      setBills]      = useState([]);
//     const [receipts,   setReceipts]   = useState([]);
//     const [loading,    setLoading]    = useState(false);

//     const fetchLedger = async () => {
//         if (!flatId) { toast.error("Please select a flat"); return; }
//         setLoading(true);
//         try {
//             // society_id comes from token — no need to pass from frontend
//             const res = await getFlatLedgerApi(parseInt(flatId), fromYear || null, toYear || null);
//             setFlatInfo(res);
//             setOpeningBal(res?.opening_balance || null);
//             setBills(res?.bills     || []);
//             setReceipts(res?.receipts  || []);
//         } catch (e) {
//             toast.error(typeof e === "string" ? e : "Failed to load ledger");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const totalBilled  = bills.reduce((s, b) => s + parseFloat(b.total_amount        || 0), 0);
//     const totalPaid    = bills.reduce((s, b) => s + parseFloat(b.paid_amount          || 0), 0);
//     const totalBalance = bills.reduce((s, b) =>
//         s + parseFloat(b.balance_principal || 0) + parseFloat(b.balance_interest || 0), 0);

//     return (
//         <div className="pg" style={{ padding: "20px 24px" }}>

//             {/* Header */}
//             <div className="d-flex align-items-center justify-content-between mb-4">
//                 <div>
//                     <h4 style={{ fontWeight: 700, margin: 0 }}>📒 Flat Ledger</h4>
//                     <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>Full billing statement for a flat</p>
//                 </div>
//                 <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>
//                     ← Dashboard
//                 </button>
//             </div>

//             {/* Search */}
//             <div className="billing-card mb-3">
//                 <div className="d-flex gap-3 align-items-end flex-wrap">
//                     <div style={{ flex: 1, minWidth: 200 }}>
//                         <label className="billing-form-label">Select Flat *</label>
//                         <select className="billing-form-input" value={flatId}
//                             onChange={(e) => setFlatId(e.target.value)}>
//                             <option value="">Select Flat</option>
//                             {flatOptions.map((f) => (
//                                 <option key={f.flat_id} value={f.flat_id}>
//                                     {f.flat_number}{f.block ? ` / ${f.block}` : ""}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <div>
//                         <label className="billing-form-label">From Year</label>
//                         <select className="billing-form-input" style={{ width: 100 }}
//                             value={fromYear} onChange={(e) => setFromYear(e.target.value)}>
//                             {years.map((y) => <option key={y} value={y}>{y}</option>)}
//                         </select>
//                     </div>
//                     <div>
//                         <label className="billing-form-label">To Year</label>
//                         <select className="billing-form-input" style={{ width: 100 }}
//                             value={toYear} onChange={(e) => setToYear(e.target.value)}>
//                             {years.map((y) => <option key={y} value={y}>{y}</option>)}
//                         </select>
//                     </div>
//                     <button className="billing-btn billing-btn-primary" onClick={fetchLedger} disabled={loading}>
//                         <FiSearch /> {loading ? "Loading..." : "View Ledger"}
//                     </button>
//                 </div>
//             </div>

//             {flatInfo && (
//                 <>
//                     {/* Flat Header */}
//                     <div className="bill-detail-header mb-3">
//                         <div className="d-flex justify-content-between flex-wrap gap-2">
//                             <div>
//                                 <div style={{ fontSize: 20, fontWeight: 800 }}>
//                                     Flat {flatInfo.flat_number}{flatInfo.block ? ` / ${flatInfo.block}` : ""}
//                                 </div>
//                                 <div style={{ opacity: 0.85, fontSize: 13 }}>
//                                     👤 {flatInfo.owner_name || "—"} · {flatInfo.owner_mobile || ""}
//                                 </div>
//                             </div>
//                             <div className="text-end">
//                                 <div style={{ fontSize: 12, opacity: 0.8 }}>Balance Outstanding</div>
//                                 <div style={{ fontSize: 24, fontWeight: 800 }}>{fmt(totalBalance)}</div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Summary Cards */}
//                     <div className="d-flex gap-3 mb-3 flex-wrap">
//                         {[
//                             { label: "Opening Arrears", val: fmt(parseFloat(openingBal?.principal || 0) + parseFloat(openingBal?.interest || 0)), color: "#7c3aed" },
//                             { label: "Total Billed",    val: fmt(totalBilled),  color: "#2563eb" },
//                             { label: "Total Paid",      val: fmt(totalPaid),    color: "#059669" },
//                             { label: "Balance Due",     val: fmt(totalBalance), color: "#dc2626" },
//                         ].map((s) => (
//                             <div key={s.label} style={{
//                                 background: "#fff", border: "1px solid #e5e7eb",
//                                 borderRadius: 10, padding: "10px 18px", flex: 1, minWidth: 130
//                             }}>
//                                 <div style={{ fontSize: 11, color: "#6b7280" }}>{s.label}</div>
//                                 <div style={{ fontWeight: 700, color: s.color, fontSize: 16 }}>{s.val}</div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Opening Balance */}
//                     {openingBal && (openingBal.principal > 0 || openingBal.interest > 0) && (
//                         <div className="billing-card mb-3">
//                             <div className="billing-card-title">📂 Opening Balance (Arrears)</div>
//                             <div className="d-flex gap-4 flex-wrap" style={{ fontSize: 14 }}>
//                                 <span>As of: <strong>{openingBal.as_of_date}</strong></span>
//                                 <span>Principal: <strong className="amount-display">{fmt(openingBal.principal)}</strong></span>
//                                 <span>Interest: <strong className="amount-display amount-red">{fmt(openingBal.interest)}</strong></span>
//                                 <span>Total: <strong className="amount-display">{fmt(openingBal.total)}</strong></span>
//                             </div>
//                             {openingBal.remarks && (
//                                 <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>{openingBal.remarks}</div>
//                             )}
//                         </div>
//                     )}

//                     <div className="row g-3">
//                         {/* Bills */}
//                         <div className="col-12 col-lg-7">
//                             <div className="billing-card">
//                                 <div className="billing-card-title">📄 Bills ({bills.length})</div>
//                                 {bills.length === 0 ? (
//                                     <div style={{ color: "#9ca3af", fontSize: 13, padding: "16px 0" }}>No bills found</div>
//                                 ) : (
//                                     <div style={{ overflowX: "auto" }}>
//                                         <table className="billing-table">
//                                             <thead>
//                                                 <tr>
//                                                     <th>Bill No</th>
//                                                     <th>Month / Year</th>
//                                                     <th className="text-end">Total</th>
//                                                     <th className="text-end">Paid</th>
//                                                     <th className="text-end">Balance</th>
//                                                     <th>Status</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {bills.map((b) => (
//                                                     <tr key={b.bill_id}>
//                                                         <td style={{ fontSize: 12, fontWeight: 600, color: "#2563eb" }}>{b.bill_no}</td>
//                                                         <td style={{ fontWeight: 600 }}>{b.bill_month} {b.bill_year}</td>
//                                                         <td className="text-end amount-display">{fmt(b.total_amount)}</td>
//                                                         <td className="text-end amount-green">{fmt(b.paid_amount)}</td>
//                                                         <td className="text-end amount-red">
//                                                             {fmt(parseFloat(b.balance_principal || 0) + parseFloat(b.balance_interest || 0))}
//                                                         </td>
//                                                         <td>
//                                                             <span className={`bill-badge ${b.is_overdue ? "overdue" : b.status}`}>
//                                                                 {b.is_overdue ? "Overdue" : b.status}
//                                                             </span>
//                                                         </td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                             <tfoot>
//                                                 <tr>
//                                                     <td colSpan={2} style={{ fontWeight: 700, paddingTop: 12 }}>Total</td>
//                                                     <td className="text-end amount-display" style={{ fontWeight: 700 }}>{fmt(totalBilled)}</td>
//                                                     <td className="text-end amount-green"   style={{ fontWeight: 700 }}>{fmt(totalPaid)}</td>
//                                                     <td className="text-end amount-red"     style={{ fontWeight: 700 }}>{fmt(totalBalance)}</td>
//                                                     <td />
//                                                 </tr>
//                                             </tfoot>
//                                         </table>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Receipts */}
//                         <div className="col-12 col-lg-5">
//                             <div className="billing-card">
//                                 <div className="billing-card-title">💳 Receipts ({receipts.length})</div>
//                                 <div style={{ overflowX: "auto" }}>
//                                     <table className="billing-table">
//                                         <thead>
//                                             <tr>
//                                                 <th>Receipt No</th>
//                                                 <th>Date</th>
//                                                 <th>Mode</th>
//                                                 <th className="text-end">Amount</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {receipts.length === 0 ? (
//                                                 <tr>
//                                                     <td colSpan={4} style={{ textAlign: "center", color: "#9ca3af", padding: 20 }}>
//                                                         No receipts yet
//                                                     </td>
//                                                 </tr>
//                                             ) : receipts.map((r) => (
//                                                 <tr key={r.receipt_id}>
//                                                     <td style={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>{r.receipt_no}</td>
//                                                     <td style={{ fontSize: 12 }}>{r.receipt_date}</td>
//                                                     <td>
//                                                         <span className="pay-mode-badge">
//                                                             {r.payment_mode?.toUpperCase()}
//                                                         </span>
//                                                     </td>
//                                                     <td className="text-end amount-green">{fmt(r.total_amount)}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                         {receipts.length > 0 && (
//                                             <tfoot>
//                                                 <tr>
//                                                     <td colSpan={3} style={{ fontWeight: 700, paddingTop: 10 }}>Total Received</td>
//                                                     <td className="text-end amount-green" style={{ fontWeight: 700 }}>
//                                                         {fmt(receipts.reduce((s, r) => s + parseFloat(r.total_amount || 0), 0))}
//                                                     </td>
//                                                 </tr>
//                                             </tfoot>
//                                         )}
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };


// // ─────────────────────────────────────────────────────────────────────────────
// // Billing Settings
// // ─────────────────────────────────────────────────────────────────────────────
// export const BillingSettings = ({ setActive }) => {
//     const [form, setForm] = useState({
//         // Basic
//         financial_year: "", fy_start_date: "", fy_end_date: "",
//         timezone: "Asia/Kolkata",
//         interest_enabled: 1, interest_rate: 0.18, interest_type: "S",
//         due_day: 25, roundoff: 1,
//         startup_month: "April", startup_bill_no: 1,
//         bill_type: "Advance", notes: "", additional_notes: "",
//         // Automation
//         bill_frequency: "monthly", auto_generate: 0, generation_day: 1,
//         due_date_type: "fixed_date", due_date_value: 25,
//         penalty_enabled: 0, penalty_type: "fixed",
//         penalty_value: 100, penalty_frequency: "monthly",
//         use_system_fy: 1, custom_fy_start_month: 4, custom_fy_start_day: 1,
//     });
//     const [saving, setSaving] = useState(false);
//     const [loaded, setLoaded] = useState(false);
//     const [currentFY, setCurrentFY] = useState(null);

//     useEffect(() => {
//         // Calculate current FY
//         const today = new Date();
//         const month = today.getMonth() + 1;
//         const year  = today.getFullYear();
//         const fyYear = month >= 4 ? year : year - 1;
//         setCurrentFY({
//             code:  `FY${fyYear}-${String(fyYear+1).slice(2)}`,
//             start: `01 Apr ${fyYear}`,
//             end:   `31 Mar ${fyYear+1}`,
//         });

//         // Load existing settings
//         const load = async () => {
//             try {
//                 const res = await getBillingSettingsApi();
//                 if (res) setForm((prev) => ({
//                 ...prev,
//                 ...res,
//                 interest_enabled:      res.interest_enabled      != null ? parseInt(res.interest_enabled)      : 1,
//                 auto_generate:         res.auto_generate         != null ? parseInt(res.auto_generate)         : 0,
//                 penalty_enabled:       res.penalty_enabled       != null ? parseInt(res.penalty_enabled)       : 0,
//                 use_system_fy:         res.use_system_fy         != null ? parseInt(res.use_system_fy)         : 1,
//                 roundoff:              res.roundoff         != null ? parseInt(res.roundoff)         : 1,
//             }));
//             } catch (_) {}
//             finally { setLoaded(true); }
//         };
//         load();
//     }, []);

//     const handleSave = async () => {
//         setSaving(true);
//         try {
//             await upsertBillingSettingsApi({
//                 // Basic
//                 timezone:         form.timezone || 'Asia/Kolkata',
//                 financial_year:   form.financial_year || null,
//                 fy_start_date:    null,  // auto-calculated, never send manually
//                 fy_end_date:      null,  // auto-calculated, never send manually
//                 interest_enabled: parseInt(form.interest_enabled ?? 1),
//                 interest_rate:          parseFloat(form.interest_rate   || 0.18),
//                 interest_type:          form.interest_type,
//                 due_day:                parseInt(form.due_day          || 25),
//                 roundoff:               parseInt(form.roundoff          ?? 1),
//                 startup_month:          form.startup_month,
//                 startup_bill_no:        parseInt(form.startup_bill_no  || 1),
//                 bill_type:              form.bill_type,
//                 notes:                  form.notes                 || null,
//                 additional_notes:       form.additional_notes      || null,
//                 // Automation
//                 bill_frequency:         form.bill_frequency,
//                 auto_generate:          parseInt(form.auto_generate     ?? 0),
//                 generation_day:         parseInt(form.generation_day    || 1),
//                 due_date_type:          form.due_date_type,
//                 due_date_value:         parseInt(form.due_date_value    || 25),
//                 penalty_enabled:        parseInt(form.penalty_enabled   ?? 0),
//                 penalty_type:           form.penalty_type,
//                 penalty_value:          parseFloat(form.penalty_value   || 0),
//                 penalty_frequency:      form.penalty_frequency,
//                 use_system_fy:          parseInt(form.use_system_fy     ?? 1),
//                 custom_fy_start_month:  parseInt(form.custom_fy_start_month || 4),
//                 custom_fy_start_day:    parseInt(form.custom_fy_start_day   || 1),
//             });
//             toast.success("Billing settings saved successfully");
//         } catch (e) {
//             toast.error(typeof e === "string" ? e : "Failed to save settings");
//         } finally {
//             setSaving(false);
//         }
//     };

//     const f  = (key) => ({ value: form[key] ?? "", onChange: (e) => setForm({ ...form, [key]: e.target.value }) });
//     const cb = (key) => ({
//         checked:  parseInt(form[key] ?? 0) === 1,
//         onChange: (e) => setForm({ ...form, [key]: e.target.checked ? 1 : 0 })
//     });

//     if (!loaded) return <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Loading...</div>;

//     return (
//         <div className="pg" style={{ padding: "20px 24px" }}>
//             <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
//                 <div>
//                     <h4 style={{ fontWeight: 700, margin: 0 }}>⚙️ Billing Settings</h4>
//                     <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
//                         Configure billing, automation, penalties and financial year
//                     </p>
//                 </div>
//                 <div className="d-flex gap-2">
//                     <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>← Dashboard</button>
//                     <button className="billing-btn billing-btn-primary" onClick={handleSave} disabled={saving}>
//                         {saving ? "Saving..." : "💾 Save Settings"}
//                     </button>
//                 </div>
//             </div>

//             {/* Current FY banner */}
//             {currentFY && (
//                 <div style={{
//                     background:"#dbeafe", border:"1px solid #93c5fd",
//                     borderRadius:10, padding:"12px 20px", marginBottom:24,
//                     display:"flex", justifyContent:"space-between", alignItems:"center"
//                 }}>
//                     <div>
//                         <span style={{ fontWeight:700, color:"#1e40af", fontSize:15 }}>
//                             Current FY: {currentFY.code}
//                         </span>
//                         <span style={{ color:"#2563eb", fontSize:13, marginLeft:12 }}>
//                             {currentFY.start} → {currentFY.end}
//                         </span>
//                     </div>
//                     <span style={{ fontSize:11, color:"#6b7280" }}>Auto-calculated · April to March</span>
//                 </div>
//             )}

//             <div className="row g-3">
//                 <div className="col-12 col-lg-8">

//                     {/* ── Financial Year ── */}
//                     <div className="billing-card mb-3">
//                         <div className="billing-card-title">🗓 Financial Year</div>
//                         <div className="row g-3">
//                             <div className="col-12">
//                                 <label className="d-flex align-items-center gap-3" style={{ cursor:"pointer", fontSize:14 }}>
//                                     <input type="checkbox" {...cb("use_system_fy")} />
//                                     <div>
//                                         <strong>Use System FY (Recommended)</strong>
//                                         <div style={{ fontSize:12, color:"#6b7280" }}>April 1 → March 31, auto-calculated every year</div>
//                                     </div>
//                                 </label>
//                             </div>
//                             {parseInt(form.use_system_fy) === 0 && (
//                                 <>
//                                     <div className="col-4">
//                                         <label className="billing-form-label">Custom Start Month (1-12)</label>
//                                         <input type="number" className="billing-form-input" min="1" max="12" {...f("custom_fy_start_month")} />
//                                     </div>
//                                     <div className="col-4">
//                                         <label className="billing-form-label">Custom Start Day</label>
//                                         <input type="number" className="billing-form-input" min="1" max="31" {...f("custom_fy_start_day")} />
//                                     </div>
//                                 </>
//                             )}
//                             <div className="col-4">
//                                 <label className="billing-form-label">FY Code (optional label)</label>
//                                 <input type="text" className="billing-form-input" {...f("financial_year")} placeholder="e.g. 2025-26" />
//                             </div>
//                             <div className="col-8">
//                                 <label className="billing-form-label">Server Timezone</label>
//                                 <select className="billing-form-input" {...f("timezone")}>
//                                     <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30) — Recommended</option>
//                                     <option value="UTC">UTC</option>
//                                     <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
//                                     <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
//                                     <option value="America/New_York">America/New_York (EST)</option>
//                                 </select>
//                                 <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>
//                                     Current server IST time: {new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata', hour12:true})}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* ── Interest ── */}
//                     <div className="billing-card mb-3">
//                         <div className="billing-card-title">📈 Interest on Arrears</div>
//                         <div className="row g-3">
//                             <div className="col-12">
//                                 <label className="d-flex align-items-center gap-3" style={{ cursor:"pointer", fontSize:14 }}>
//                                     <input type="checkbox" {...cb("interest_enabled")} />
//                                     <div>
//                                         <strong>Enable Interest on Late/Unpaid Bills</strong>
//                                         <div style={{ fontSize:12, color:"#6b7280" }}>
//                                             Interest will be charged on opening arrear balance when generating next bill
//                                         </div>
//                                     </div>
//                                 </label>
//                             </div>

//                             {parseInt(form.interest_enabled) === 1 && (
//                                 <>
//                                     <div className="col-4">
//                                         <label className="billing-form-label">Annual Interest Rate</label>
//                                         <input type="number" className="billing-form-input" step="0.01" min="0" max="1"
//                                             value={form.interest_rate}
//                                             onChange={(e) => setForm({...form, interest_rate: parseFloat(e.target.value)||0})} />
//                                         <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>
//                                             {(parseFloat(form.interest_rate||0)*100).toFixed(0)}% p.a. = {(parseFloat(form.interest_rate||0)*100/12).toFixed(2)}% per month
//                                         </div>
//                                     </div>
//                                     <div className="col-4">
//                                         <label className="billing-form-label">Interest Type</label>
//                                         <select className="billing-form-input" {...f("interest_type")}>
//                                             <option value="S">Simple Interest</option>
//                                             <option value="C">Compound Interest</option>
//                                         </select>
//                                     </div>
//                                     <div className="col-4">
//                                         <label className="billing-form-label">Round Off Bills</label>
//                                         <select className="billing-form-input" value={form.roundoff}
//                                             onChange={(e) => setForm({...form, roundoff: parseInt(e.target.value)})}>
//                                             <option value={1}>Yes — round to nearest ₹</option>
//                                             <option value={0}>No — keep paise</option>
//                                         </select>
//                                     </div>
//                                     <div className="col-12">
//                                         <div style={{
//                                             background:"#f0fdf4", border:"1px solid #bbf7d0",
//                                             borderRadius:8, padding:"10px 14px", fontSize:12, color:"#065f46"
//                                         }}>
//                                             Example: Flat with ₹1,100 unpaid arrear →
//                                             Interest = ₹{(1100 * parseFloat(form.interest_rate||0) / 12).toFixed(2)} per month
//                                             ({form.interest_type === "S" ? "Simple" : "Compound"})
//                                         </div>
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                     </div>

//                     {/* ── Bill Generation ── */}
//                     <div className="billing-card mb-3">
//                         <div className="billing-card-title">⚡ Bill Generation</div>
//                         <div className="row g-3">
//                             <div className="col-4">
//                                 <label className="billing-form-label">Bill Frequency</label>
//                                 <select className="billing-form-input" {...f("bill_frequency")}>
//                                     <option value="monthly">Monthly</option>
//                                     <option value="quarterly">Quarterly</option>
//                                     <option value="half_yearly">Half-Yearly</option>
//                                     <option value="yearly">Yearly</option>
//                                 </select>
//                             </div>
//                             <div className="col-4">
//                                 <label className="billing-form-label">Generation Day (1–31)</label>
//                                 <input type="number" className="billing-form-input" min="1" max="31" {...f("generation_day")} />
//                             </div>
//                             <div className="col-4">
//                                 <label className="billing-form-label">Bill Type</label>
//                                 <select className="billing-form-input" {...f("bill_type")}>
//                                     <option value="Advance">Advance</option>
//                                     <option value="Arrear">Arrear</option>
//                                 </select>
//                             </div>
//                             <div className="col-12">
//                                 <label className="d-flex align-items-center gap-3" style={{ cursor:"pointer", fontSize:14 }}>
//                                     <input type="checkbox" {...cb("auto_generate")} />
//                                     <div>
//                                         <strong>Enable Auto Bill Generation</strong>
//                                         <div style={{ fontSize:12, color:"#6b7280" }}>
//                                             System generates bills automatically on day {form.generation_day} of each period at 12:05 AM
//                                         </div>
//                                     </div>
//                                 </label>
//                             </div>
//                         </div>
//                     </div>

//                     {/* ── Due Date ── */}
//                     <div className="billing-card mb-3">
//                         <div className="billing-card-title">📅 Due Date</div>
//                         <div className="row g-3">
//                             <div className="col-6">
//                                 <label className="billing-form-label">Due Date Type</label>
//                                 <select className="billing-form-input" {...f("due_date_type")}>
//                                     <option value="fixed_date">Fixed Date (e.g. 25th every month)</option>
//                                     <option value="days_after">Days After Generation</option>
//                                 </select>
//                             </div>
//                             <div className="col-6">
//                                 <label className="billing-form-label">
//                                     {form.due_date_type === "fixed_date" ? "Fixed Day (1–31)" : "Days After Generation"}
//                                 </label>
//                                 <input type="number" className="billing-form-input"
//                                     min="1" max={form.due_date_type === "fixed_date" ? "31" : "90"}
//                                     {...f("due_date_value")} />
//                                 <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>
//                                     {form.due_date_type === "fixed_date"
//                                         ? `Bills due on ${form.due_date_value}th of each month`
//                                         : `Bills due ${form.due_date_value} days after generation`}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* ── Penalty ── */}
//                     <div className="billing-card mb-3">
//                         <div className="billing-card-title">🔴 Late Payment Penalty</div>
//                         <div className="row g-3">
//                             <div className="col-12">
//                                 <label className="d-flex align-items-center gap-3" style={{ cursor:"pointer", fontSize:14 }}>
//                                     <input type="checkbox" {...cb("penalty_enabled")} />
//                                     <div>
//                                         <strong>Enable Automatic Penalty</strong>
//                                         <div style={{ fontSize:12, color:"#6b7280" }}>
//                                             Auto-applied to overdue bills daily at 1:00 AM
//                                         </div>
//                                     </div>
//                                 </label>
//                             </div>
//                             {parseInt(form.penalty_enabled) === 1 && (
//                                 <>
//                                     <div className="col-4">
//                                         <label className="billing-form-label">Penalty Type</label>
//                                         <select className="billing-form-input" {...f("penalty_type")}>
//                                             <option value="fixed">Fixed Amount (₹)</option>
//                                             <option value="percentage">Percentage (%) of outstanding</option>
//                                         </select>
//                                     </div>
//                                     <div className="col-4">
//                                         <label className="billing-form-label">
//                                             {form.penalty_type === "fixed" ? "Amount (₹)" : "Percentage (%)"}
//                                         </label>
//                                         <input type="number" className="billing-form-input"
//                                             min="0" step={form.penalty_type === "fixed" ? "1" : "0.1"}
//                                             {...f("penalty_value")} />
//                                     </div>
//                                     <div className="col-4">
//                                         <label className="billing-form-label">Frequency</label>
//                                         <select className="billing-form-input" {...f("penalty_frequency")}>
//                                             <option value="monthly">Monthly (recurring)</option>
//                                             <option value="one_time">One Time only</option>
//                                         </select>
//                                     </div>
//                                     <div className="col-12">
//                                         <div style={{
//                                             background:"#fef3c7", border:"1px solid #fde68a",
//                                             borderRadius:8, padding:"10px 14px", fontSize:12, color:"#92400e"
//                                         }}>
//                                             ⚠️ Bill ₹1,100 overdue → Penalty =&nbsp;
//                                             {form.penalty_type === "fixed"
//                                                 ? `₹${form.penalty_value} (fixed)`
//                                                 : `₹${((1100 * parseFloat(form.penalty_value||0))/100).toFixed(2)} (${form.penalty_value}% of ₹1,100)`}
//                                             {form.penalty_frequency === "monthly" ? " · every month till paid" : " · once"}
//                                         </div>
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                     </div>

//                     {/* ── Notes ── */}
//                     <div className="billing-card mb-3">
//                         <div className="billing-card-title">📝 Notes</div>
//                         <div className="row g-3">
//                             <div className="col-6">
//                                 <label className="billing-form-label">Internal Notes</label>
//                                 <textarea className="billing-form-input" rows={3} {...f("notes")} placeholder="Internal notes" />
//                             </div>
//                             <div className="col-6">
//                                 <label className="billing-form-label">Notes on Bill (shown to members)</label>
//                                 <textarea className="billing-form-input" rows={3} {...f("additional_notes")} placeholder="e.g. Please pay by due date to avoid penalty" />
//                             </div>
//                         </div>
//                     </div>

//                 </div>

//                 {/* ── Right sidebar: quick info ── */}
//                 <div className="col-12 col-lg-4">
//                     <div className="billing-card mb-3" style={{ background:"#f0f9ff", border:"1px solid #bae6fd" }}>
//                         <div style={{ fontWeight:700, color:"#0369a1", marginBottom:10 }}>⏰ Scheduler Status</div>
//                         <div style={{ fontSize:13 }}>
//                             <div className="d-flex justify-content-between mb-2">
//                                 <span style={{ color:"#6b7280" }}>Auto Bills</span>
//                                 <span style={{ color: parseInt(form.auto_generate)===1 ? "#059669":"#dc2626", fontWeight:600 }}>
//                                     {parseInt(form.auto_generate)===1 ? "✅ ON" : "❌ OFF"}
//                                 </span>
//                             </div>
//                             <div className="d-flex justify-content-between mb-2">
//                                 <span style={{ color:"#6b7280" }}>Penalty</span>
//                                 <span style={{ color: parseInt(form.penalty_enabled)===1 ? "#059669":"#dc2626", fontWeight:600 }}>
//                                     {parseInt(form.penalty_enabled)===1 ? "✅ ON" : "❌ OFF"}
//                                 </span>
//                             </div>
//                             <div className="d-flex justify-content-between">
//                                 <span style={{ color:"#6b7280" }}>System FY</span>
//                                 <span style={{ color:"#2563eb", fontWeight:600 }}>
//                                     {parseInt(form.use_system_fy)===1 ? "Apr–Mar" : "Custom"}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="billing-card mb-3">
//                         <div style={{ fontWeight:700, marginBottom:10 }}>📋 Scheduler Times</div>
//                         <div style={{ fontSize:12, color:"#6b7280" }}>
//                             <div className="mb-2">⚡ Bill Generation<br/><strong>Daily 12:05 AM IST</strong></div>
//                             <div>🔴 Penalty Processing<br/><strong>Daily 01:00 AM IST</strong></div>
//                         </div>
//                     </div>

//                     <div className="billing-card">
//                         <div style={{ fontWeight:700, marginBottom:10 }}>ℹ️ Current Summary</div>
//                         <div style={{ fontSize:12 }}>
//                             <div className="d-flex justify-content-between mb-1">
//                                 <span style={{ color:"#6b7280" }}>Frequency</span>
//                                 <span style={{ fontWeight:600, textTransform:"capitalize" }}>{form.bill_frequency}</span>
//                             </div>
//                             <div className="d-flex justify-content-between mb-1">
//                                 <span style={{ color:"#6b7280" }}>Generate on</span>
//                                 <span style={{ fontWeight:600 }}>Day {form.generation_day}</span>
//                             </div>
//                             <div className="d-flex justify-content-between mb-1">
//                                 <span style={{ color:"#6b7280" }}>Due</span>
//                                 <span style={{ fontWeight:600 }}>
//                                     {form.due_date_type === "fixed_date"
//                                         ? `${form.due_date_value}th`
//                                         : `+${form.due_date_value} days`}
//                                 </span>
//                             </div>
//                             <div className="d-flex justify-content-between mb-2">
//                                 <span style={{ color:"#6b7280" }}>Timezone</span>
//                                 <span style={{ fontWeight:600, color:"#2563eb", fontSize:11 }}>{form.timezone || "Asia/Kolkata"}</span>
//                             </div>
//                             <div className="d-flex justify-content-between">
//                                 <span style={{ color:"#6b7280" }}>Interest</span>
//                                 <span style={{ fontWeight:600, color: parseInt(form.interest_enabled)===1 ? "#374151":"#dc2626" }}>
//                                     {parseInt(form.interest_enabled)===1
//                                         ? `${(parseFloat(form.interest_rate||0)*100).toFixed(0)}% p.a. (${form.interest_type === "S" ? "Simple" : "Compound"})`
//                                         : "❌ Disabled"}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="d-flex justify-content-end mt-2">
//                 <button className="billing-btn billing-btn-primary" onClick={handleSave} disabled={saving} style={{ minWidth:160 }}>
//                     {saving ? "Saving..." : "💾 Save All Settings"}
//                 </button>
//             </div>
//         </div>
//     );
// };


// // ─────────────────────────────────────────────────────────────────────────────
// // Opening Balance
// // ─────────────────────────────────────────────────────────────────────────────
// export const OpeningBalance = ({ setActive }) => {
//     const { flatOptions } = useFlatOptions();   // society_id handled inside hook

//     const [form, setForm] = useState({
//         flat_id:    "",
//         as_of_date: new Date().getFullYear() + "-04-01",
//         principal:  "",
//         interest:   "",
//         remarks:    ""
//     });
//     const [saving, setSaving] = useState(false);

//     const handleSave = async () => {
//         if (!form.flat_id)    { toast.error("Please select a flat");  return; }
//         if (!form.as_of_date) { toast.error("Date is required");      return; }

//         setSaving(true);
//         try {
//             // society_id comes from token — no need to pass
//             await setOpeningBalanceApi({
//                 flat_id:    parseInt(form.flat_id),
//                 as_of_date: form.as_of_date,
//                 principal:  parseFloat(form.principal || 0),
//                 interest:   parseFloat(form.interest  || 0),
//                 remarks:    form.remarks || null,
//             });
//             toast.success("Opening balance saved successfully");
//             setForm((prev) => ({ ...prev, flat_id: "", principal: "", interest: "", remarks: "" }));
//         } catch (e) {
//             toast.error(typeof e === "string" ? e : "Failed to save");
//         } finally {
//             setSaving(false);
//         }
//     };

//     const totalOpening = parseFloat(form.principal || 0) + parseFloat(form.interest || 0);

//     return (
//         <div className="pg" style={{ padding: "20px 24px" }}>

//             {/* Header */}
//             <div className="d-flex align-items-center justify-content-between mb-4">
//                 <div>
//                     <h4 style={{ fontWeight: 700, margin: 0 }}>📂 Opening Balances</h4>
//                     <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
//                         Set arrears carried forward for each flat
//                     </p>
//                 </div>
//                 <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>
//                     ← Dashboard
//                 </button>
//             </div>

//             <div className="row g-3">
//                 <div className="col-12 col-lg-6">
//                     <div className="billing-card">
//                         <div className="billing-card-title">Set Opening Balance</div>
//                         <div className="row g-3">

//                             <div className="col-12">
//                                 <label className="billing-form-label">Flat *</label>
//                                 <select className="billing-form-input"
//                                     value={form.flat_id}
//                                     onChange={(e) => setForm({ ...form, flat_id: e.target.value })}>
//                                     <option value="">Select Flat</option>
//                                     {flatOptions.map((f) => (
//                                         <option key={f.flat_id} value={f.flat_id}>
//                                             {f.flat_number}{f.block ? ` / ${f.block}` : ""}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="col-12">
//                                 <label className="billing-form-label">As of Date *</label>
//                                 <input type="date" className="billing-form-input"
//                                     value={form.as_of_date}
//                                     onChange={(e) => setForm({ ...form, as_of_date: e.target.value })} />
//                                 <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>
//                                     Typically the first day of your billing start month (e.g. 2024-04-01)
//                                 </div>
//                             </div>

//                             <div className="col-6">
//                                 <label className="billing-form-label">Principal Arrears (₹)</label>
//                                 <input type="number" className="billing-form-input" min="0" step="0.01"
//                                     value={form.principal}
//                                     onChange={(e) => setForm({ ...form, principal: e.target.value })}
//                                     placeholder="14300.00" />
//                             </div>

//                             <div className="col-6">
//                                 <label className="billing-form-label">Interest Arrears (₹)</label>
//                                 <input type="number" className="billing-form-input" min="0" step="0.01"
//                                     value={form.interest}
//                                     onChange={(e) => setForm({ ...form, interest: e.target.value })}
//                                     placeholder="3566.50" />
//                             </div>

//                             {/* Total Preview */}
//                             {totalOpening > 0 && (
//                                 <div className="col-12">
//                                     <div style={{
//                                         background: "#f0fdf4", border: "1px solid #bbf7d0",
//                                         borderRadius: 8, padding: "10px 14px",
//                                         display: "flex", justifyContent: "space-between",
//                                         fontSize: 13, fontWeight: 600
//                                     }}>
//                                         <span>Total Opening Balance</span>
//                                         <span style={{ color: "#059669" }}>{fmt(totalOpening)}</span>
//                                     </div>
//                                 </div>
//                             )}

//                             <div className="col-12">
//                                 <label className="billing-form-label">Remarks</label>
//                                 <input type="text" className="billing-form-input"
//                                     value={form.remarks}
//                                     onChange={(e) => setForm({ ...form, remarks: e.target.value })}
//                                     placeholder="Opening arrears as on April 2024" />
//                             </div>
//                         </div>

//                         <div className="d-flex justify-content-end mt-3">
//                             <button className="billing-btn billing-btn-primary" onClick={handleSave} disabled={saving}>
//                                 {saving ? "Saving..." : "Save Opening Balance"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Info */}
//                 <div className="col-12 col-lg-6">
//                     <div className="billing-card mb-3">
//                         <div className="billing-card-title">ℹ️ About Opening Balances</div>
//                         <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
//                             <p>Opening balance represents <strong>arrears carried forward</strong> from before the system start date.</p>
//                             <p><strong>Principal</strong> — unpaid maintenance amount outstanding before system start</p>
//                             <p><strong>Interest</strong> — interest already accrued on those arrears</p>
//                             <p>These are automatically picked up when the <strong>first bill is generated</strong> for the flat.</p>
//                         </div>
//                     </div>
//                     <div style={{
//                         background: "#fee2e2", border: "1px solid #fca5a5",
//                         borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#991b1b"
//                     }}>
//                         ⚠️ Set opening balances <strong>before generating any bills</strong> for the flat. Once a bill exists, the opening balance from that bill carries forward automatically.
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";
import {
    getBillingSettingsApi,
    upsertBillingSettingsApi,
    getFlatLedgerApi,
    setOpeningBalanceApi,
} from "../../services/BillingApi";
import { getAllMembersWithoutPaginationApi } from "../../services/AddMemberApi";
import { GetSessionData } from "../../utils/SessionManagement";
import "../../styles/Billing.css";

const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);


// ─────────────────────────────────────────────────────────────────────────────
// Shared hook — loads flat options from session society_id
// Used by FlatLedger and OpeningBalance
// ─────────────────────────────────────────────────────────────────────────────
const useFlatOptions = () => {
    const [societyId,   setSocietyId]   = useState("");
    const [flatOptions, setFlatOptions] = useState([]);

    useEffect(() => {
        const s = GetSessionData();
        const sid = s?.society_id || s?.data?.society_id || "";
        if (sid) {
            setSocietyId(sid);
            fetchFlats(sid);
        }
    }, []);

    const fetchFlats = async (sid) => {
        try {
            const res = await getAllMembersWithoutPaginationApi(sid, "", "", "", "", null);
            const members = res?.members || res || [];
            const seen    = new Set();
            const opts    = [];
            members.forEach((m) => {
                if (m.flat_id && !seen.has(m.flat_id)) {
                    seen.add(m.flat_id);
                    opts.push({
                        flat_id:     m.flat_id,
                        flat_number: m.flat_number,
                        block:       m.block,
                    });
                }
            });
            setFlatOptions(opts);
        } catch (_) {}
    };

    return { societyId, flatOptions };
};


// ─────────────────────────────────────────────────────────────────────────────
// Flat Ledger
// ─────────────────────────────────────────────────────────────────────────────
export const FlatLedger = ({ setActive }) => {
    const { flatOptions } = useFlatOptions();

    const [flatId,     setFlatId]     = useState("");
    const [fromYear,   setFromYear]   = useState(new Date().getFullYear());
    const [toYear,     setToYear]     = useState(new Date().getFullYear());
    const [flatInfo,   setFlatInfo]   = useState(null);
    const [openingBal, setOpeningBal] = useState(null);
    const [bills,      setBills]      = useState([]);
    const [receipts,   setReceipts]   = useState([]);
    const [loading,    setLoading]    = useState(false);

    const fetchLedger = async () => {
        if (!flatId) { toast.error("Please select a flat"); return; }
        setLoading(true);
        try {
            // society_id comes from token — no need to pass from frontend
            const res = await getFlatLedgerApi(parseInt(flatId), fromYear || null, toYear || null);
            setFlatInfo(res);
            setOpeningBal(res?.opening_balance || null);
            setBills(res?.bills     || []);
            setReceipts(res?.receipts  || []);
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to load ledger");
        } finally {
            setLoading(false);
        }
    };

    const totalBilled  = bills.reduce((s, b) => s + parseFloat(b.total_amount        || 0), 0);
    const totalPaid    = bills.reduce((s, b) => s + parseFloat(b.paid_amount          || 0), 0);
    const totalBalance = bills.reduce((s, b) =>
        s + parseFloat(b.balance_principal || 0) + parseFloat(b.balance_interest || 0), 0);

    return (
        <div className="pg" style={{ padding: "20px 24px" }}>

            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 style={{ fontWeight: 700, margin: 0 }}>📒 Flat Ledger</h4>
                    <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>Full billing statement for a flat</p>
                </div>
                <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>
                    ← Dashboard
                </button>
            </div>

            {/* Search */}
            <div className="billing-card mb-3">
                <div className="d-flex gap-3 align-items-end flex-wrap">
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <label className="billing-form-label">Select Flat *</label>
                        <select className="billing-form-input" value={flatId}
                            onChange={(e) => setFlatId(e.target.value)}>
                            <option value="">Select Flat</option>
                            {flatOptions.map((f) => (
                                <option key={f.flat_id} value={f.flat_id}>
                                    {f.flat_number}{f.block ? ` / ${f.block}` : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="billing-form-label">From Year</label>
                        <select className="billing-form-input" style={{ width: 100 }}
                            value={fromYear} onChange={(e) => setFromYear(e.target.value)}>
                            {years.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="billing-form-label">To Year</label>
                        <select className="billing-form-input" style={{ width: 100 }}
                            value={toYear} onChange={(e) => setToYear(e.target.value)}>
                            {years.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <button className="billing-btn billing-btn-primary" onClick={fetchLedger} disabled={loading}>
                        <FiSearch /> {loading ? "Loading..." : "View Ledger"}
                    </button>
                </div>
            </div>

            {flatInfo && (
                <>
                    {/* Flat Header */}
                    <div className="bill-detail-header mb-3">
                        <div className="d-flex justify-content-between flex-wrap gap-2">
                            <div>
                                <div style={{ fontSize: 20, fontWeight: 800 }}>
                                    Flat {flatInfo.flat_number}{flatInfo.block ? ` / ${flatInfo.block}` : ""}
                                </div>
                                <div style={{ opacity: 0.85, fontSize: 13 }}>
                                    👤 {flatInfo.owner_name || "—"} · {flatInfo.owner_mobile || ""}
                                </div>
                            </div>
                            <div className="text-end">
                                <div style={{ fontSize: 12, opacity: 0.8 }}>Balance Outstanding</div>
                                <div style={{ fontSize: 24, fontWeight: 800 }}>{fmt(totalBalance)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="d-flex gap-3 mb-3 flex-wrap">
                        {[
                            { label: "Opening Arrears", val: fmt(parseFloat(openingBal?.principal || 0) + parseFloat(openingBal?.interest || 0)), color: "#7c3aed" },
                            { label: "Total Billed",    val: fmt(totalBilled),  color: "#2563eb" },
                            { label: "Total Paid",      val: fmt(totalPaid),    color: "#059669" },
                            { label: "Balance Due",     val: fmt(totalBalance), color: "#dc2626" },
                        ].map((s) => (
                            <div key={s.label} style={{
                                background: "#fff", border: "1px solid #e5e7eb",
                                borderRadius: 10, padding: "10px 18px", flex: 1, minWidth: 130
                            }}>
                                <div style={{ fontSize: 11, color: "#6b7280" }}>{s.label}</div>
                                <div style={{ fontWeight: 700, color: s.color, fontSize: 16 }}>{s.val}</div>
                            </div>
                        ))}
                    </div>

                    {/* Opening Balance */}
                    {openingBal && (openingBal.principal > 0 || openingBal.interest > 0) && (
                        <div className="billing-card mb-3">
                            <div className="billing-card-title">📂 Opening Balance (Arrears)</div>
                            <div className="d-flex gap-4 flex-wrap" style={{ fontSize: 14 }}>
                                <span>As of: <strong>{openingBal.as_of_date}</strong></span>
                                <span>Principal: <strong className="amount-display">{fmt(openingBal.principal)}</strong></span>
                                <span>Interest: <strong className="amount-display amount-red">{fmt(openingBal.interest)}</strong></span>
                                <span>Total: <strong className="amount-display">{fmt(openingBal.total)}</strong></span>
                            </div>
                            {openingBal.remarks && (
                                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>{openingBal.remarks}</div>
                            )}
                        </div>
                    )}

                    <div className="row g-3">
                        {/* Bills */}
                        <div className="col-12 col-lg-7">
                            <div className="billing-card">
                                <div className="billing-card-title">📄 Bills ({bills.length})</div>
                                {bills.length === 0 ? (
                                    <div style={{ color: "#9ca3af", fontSize: 13, padding: "16px 0" }}>No bills found</div>
                                ) : (
                                    <div style={{ overflowX: "auto" }}>
                                        <table className="billing-table">
                                            <thead>
                                                <tr>
                                                    <th>Bill No</th>
                                                    <th>Month / Year</th>
                                                    <th className="text-end">Total</th>
                                                    <th className="text-end">Paid</th>
                                                    <th className="text-end">Balance</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bills.map((b) => (
                                                    <tr key={b.bill_id}>
                                                        <td style={{ fontSize: 12, fontWeight: 600, color: "#2563eb" }}>{b.bill_no}</td>
                                                        <td style={{ fontWeight: 600 }}>{b.bill_month} {b.bill_year}</td>
                                                        <td className="text-end amount-display">{fmt(b.total_amount)}</td>
                                                        <td className="text-end amount-green">{fmt(b.paid_amount)}</td>
                                                        <td className="text-end amount-red">
                                                            {fmt(parseFloat(b.balance_principal || 0) + parseFloat(b.balance_interest || 0))}
                                                        </td>
                                                        <td>
                                                            <span className={`bill-badge ${b.is_overdue ? "overdue" : b.status}`}>
                                                                {b.is_overdue ? "Overdue" : b.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan={2} style={{ fontWeight: 700, paddingTop: 12 }}>Total</td>
                                                    <td className="text-end amount-display" style={{ fontWeight: 700 }}>{fmt(totalBilled)}</td>
                                                    <td className="text-end amount-green"   style={{ fontWeight: 700 }}>{fmt(totalPaid)}</td>
                                                    <td className="text-end amount-red"     style={{ fontWeight: 700 }}>{fmt(totalBalance)}</td>
                                                    <td />
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Receipts */}
                        <div className="col-12 col-lg-5">
                            <div className="billing-card">
                                <div className="billing-card-title">💳 Receipts ({receipts.length})</div>
                                <div style={{ overflowX: "auto" }}>
                                    <table className="billing-table">
                                        <thead>
                                            <tr>
                                                <th>Receipt No</th>
                                                <th>Date</th>
                                                <th>Mode</th>
                                                <th className="text-end">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {receipts.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} style={{ textAlign: "center", color: "#9ca3af", padding: 20 }}>
                                                        No receipts yet
                                                    </td>
                                                </tr>
                                            ) : receipts.map((r) => (
                                                <tr key={r.receipt_id}>
                                                    <td style={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>{r.receipt_no}</td>
                                                    <td style={{ fontSize: 12 }}>{r.receipt_date}</td>
                                                    <td>
                                                        <span className="pay-mode-badge">
                                                            {r.payment_mode?.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="text-end amount-green">{fmt(r.total_amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        {receipts.length > 0 && (
                                            <tfoot>
                                                <tr>
                                                    <td colSpan={3} style={{ fontWeight: 700, paddingTop: 10 }}>Total Received</td>
                                                    <td className="text-end amount-green" style={{ fontWeight: 700 }}>
                                                        {fmt(receipts.reduce((s, r) => s + parseFloat(r.total_amount || 0), 0))}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        )}
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};


// ─────────────────────────────────────────────────────────────────────────────
// Billing Settings
// ─────────────────────────────────────────────────────────────────────────────
export const BillingSettings = ({ setActive }) => {
    const [form, setForm] = useState({
        // Basic
        financial_year: "", fy_start_date: "", fy_end_date: "",
        timezone: "Asia/Kolkata",
        interest_enabled: 1, interest_rate: 0.18, interest_type: "S",
        due_day: 25, roundoff: 1,
        startup_month: "April", startup_bill_no: 1,
        bill_type: "Advance", notes: "", additional_notes: "",
        // Automation
        bill_frequency: "monthly", auto_generate: 0, generation_day: 1,
        due_date_type: "fixed_date", due_date_value: 25,
        penalty_enabled: 0, penalty_type: "fixed",
        penalty_value: 100, penalty_frequency: "monthly",
        use_system_fy: 1, custom_fy_start_month: 4, custom_fy_start_day: 1,
    });
    const [saving, setSaving] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [currentFY, setCurrentFY] = useState(null);

    useEffect(() => {
        // Calculate current FY
        const today = new Date();
        const month = today.getMonth() + 1;
        const year  = today.getFullYear();
        const fyYear = month >= 4 ? year : year - 1;
        setCurrentFY({
            code:  `FY${fyYear}-${String(fyYear+1).slice(2)}`,
            start: `01 Apr ${fyYear}`,
            end:   `31 Mar ${fyYear+1}`,
        });

        // Load existing settings
        const load = async () => {
            try {
                const res = await getBillingSettingsApi();
                if (res) setForm((prev) => ({
                ...prev,
                ...res,
                interest_enabled:      res.interest_enabled      != null ? parseInt(res.interest_enabled)      : 1,
                auto_generate:         res.auto_generate         != null ? parseInt(res.auto_generate)         : 0,
                penalty_enabled:       res.penalty_enabled       != null ? parseInt(res.penalty_enabled)       : 0,
                use_system_fy:         res.use_system_fy         != null ? parseInt(res.use_system_fy)         : 1,
                roundoff:              res.roundoff         != null ? parseInt(res.roundoff)         : 1,
            }));
            } catch (_) {}
            finally { setLoaded(true); }
        };
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await upsertBillingSettingsApi({
                // Basic
                timezone:         form.timezone || 'Asia/Kolkata',
                financial_year:   form.financial_year || null,
                fy_start_date:    null,  // auto-calculated, never send manually
                fy_end_date:      null,  // auto-calculated, never send manually
                interest_enabled: parseInt(form.interest_enabled ?? 1),
                interest_rate:          parseFloat(form.interest_rate   || 0.18),
                interest_type:          form.interest_type,
                due_day:                parseInt(form.due_day          || 25),
                roundoff:               parseInt(form.roundoff          ?? 1),
                startup_month:          form.startup_month,
                startup_bill_no:        parseInt(form.startup_bill_no  || 1),
                bill_type:              form.bill_type,
                notes:                  form.notes                 || null,
                additional_notes:       form.additional_notes      || null,
                // Automation
                bill_frequency:         form.bill_frequency,
                auto_generate:          parseInt(form.auto_generate     ?? 0),
                generation_day:         parseInt(form.generation_day    || 1),
                due_date_type:          form.due_date_type,
                due_date_value:         parseInt(form.due_date_value    || 25),
                penalty_enabled:        parseInt(form.penalty_enabled   ?? 0),
                penalty_type:           form.penalty_type,
                penalty_value:          parseFloat(form.penalty_value   || 0),
                penalty_frequency:      form.penalty_frequency,
                use_system_fy:          parseInt(form.use_system_fy     ?? 1),
                custom_fy_start_month:  parseInt(form.custom_fy_start_month || 4),
                custom_fy_start_day:    parseInt(form.custom_fy_start_day   || 1),
            });
            toast.success("Billing settings saved successfully");
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const f  = (key) => ({ value: form[key] ?? "", onChange: (e) => setForm({ ...form, [key]: e.target.value }) });
    const cb = (key) => ({
        checked:  parseInt(form[key] ?? 0) === 1,
        onChange: (e) => setForm({ ...form, [key]: e.target.checked ? 1 : 0 })
    });

    if (!loaded) return <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Loading...</div>;

    return (
        <div className="pg" style={{ padding: "20px 24px" }}>
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                <div>
                    <h4 style={{ fontWeight: 700, margin: 0 }}>⚙️ Billing Settings</h4>
                    <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
                        Configure billing, automation, penalties and financial year
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>← Dashboard</button>
                    <button className="billing-btn billing-btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "💾 Save Settings"}
                    </button>
                </div>
            </div>

            {/* Current FY banner */}
            {currentFY && (
                <div style={{
                    background:"#dbeafe", border:"1px solid #93c5fd",
                    borderRadius:10, padding:"12px 20px", marginBottom:24,
                    display:"flex", justifyContent:"space-between", alignItems:"center"
                }}>
                    <div>
                        <span style={{ fontWeight:700, color:"#1e40af", fontSize:15 }}>
                            Current FY: {currentFY.code}
                        </span>
                        <span style={{ color:"#2563eb", fontSize:13, marginLeft:12 }}>
                            {currentFY.start} → {currentFY.end}
                        </span>
                    </div>
                    <span style={{ fontSize:11, color:"#6b7280" }}>Auto-calculated · April to March</span>
                </div>
            )}

            <div className="row g-3">
                <div className="col-12 col-lg-8">

                    {/* ── Financial Year ── */}
                    <div className="billing-card mb-3">
                        <div className="billing-card-title">🗓 Financial Year</div>
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="d-flex align-items-center gap-3" style={{ cursor:"pointer", fontSize:14 }}>
                                    <input type="checkbox" {...cb("use_system_fy")} />
                                    <div>
                                        <strong>Use System FY (Recommended)</strong>
                                        <div style={{ fontSize:12, color:"#6b7280" }}>April 1 → March 31, auto-calculated every year</div>
                                    </div>
                                </label>
                            </div>
                            {parseInt(form.use_system_fy) === 0 && (
                                <>
                                    <div className="col-4">
                                        <label className="billing-form-label">Custom Start Month (1-12)</label>
                                        <input type="number" className="billing-form-input" min="1" max="12" {...f("custom_fy_start_month")} />
                                    </div>
                                    <div className="col-4">
                                        <label className="billing-form-label">Custom Start Day</label>
                                        <input type="number" className="billing-form-input" min="1" max="31" {...f("custom_fy_start_day")} />
                                    </div>
                                </>
                            )}
                            <div className="col-4">
                                <label className="billing-form-label">FY Code (optional label)</label>
                                <input type="text" className="billing-form-input" {...f("financial_year")} placeholder="e.g. 2025-26" />
                            </div>
                            <div className="col-8">
                                <label className="billing-form-label">Server Timezone</label>
                                <select className="billing-form-input" {...f("timezone")}>
                                    <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30) — Recommended</option>
                                    <option value="UTC">UTC</option>
                                    <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                                    <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
                                    <option value="America/New_York">America/New_York (EST)</option>
                                </select>
                                <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>
                                    Current server IST time: {new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata', hour12:true})}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Interest ── */}
                    <div className="billing-card mb-3">
                        <div className="billing-card-title">📈 Interest on Arrears</div>
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="d-flex align-items-center gap-3" style={{ cursor:"pointer", fontSize:14 }}>
                                    <input type="checkbox" {...cb("interest_enabled")} />
                                    <div>
                                        <strong>Enable Interest on Late/Unpaid Bills</strong>
                                        <div style={{ fontSize:12, color:"#6b7280" }}>
                                            Interest will be charged on opening arrear balance when generating next bill
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {parseInt(form.interest_enabled) === 1 && (
                                <>
                                    <div className="col-4">
                                        <label className="billing-form-label">Annual Interest Rate</label>
                                        <input type="number" className="billing-form-input" step="0.01" min="0" max="1"
                                            value={form.interest_rate}
                                            onChange={(e) => setForm({...form, interest_rate: parseFloat(e.target.value)||0})} />
                                        <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>
                                            {(parseFloat(form.interest_rate||0)*100).toFixed(0)}% p.a. = {(parseFloat(form.interest_rate||0)*100/12).toFixed(2)}% per month
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <label className="billing-form-label">Interest Type</label>
                                        <select className="billing-form-input" {...f("interest_type")}>
                                            <option value="S">Simple Interest</option>
                                            <option value="C">Compound Interest</option>
                                        </select>
                                    </div>
                                    <div className="col-4">
                                        <label className="billing-form-label">Round Off Bills</label>
                                        <select className="billing-form-input" value={form.roundoff}
                                            onChange={(e) => setForm({...form, roundoff: parseInt(e.target.value)})}>
                                            <option value={1}>Yes — round to nearest ₹</option>
                                            <option value={0}>No — keep paise</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <div style={{
                                            background:"#f0fdf4", border:"1px solid #bbf7d0",
                                            borderRadius:8, padding:"10px 14px", fontSize:12, color:"#065f46"
                                        }}>
                                            Example: Flat with ₹1,100 unpaid arrear →
                                            Interest = ₹{(1100 * parseFloat(form.interest_rate||0) / 12).toFixed(2)} per month
                                            ({form.interest_type === "S" ? "Simple" : "Compound"})
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ── Bill Generation ── */}
                    <div className="billing-card mb-3">
                        <div className="billing-card-title">⚡ Bill Generation</div>
                        <div className="row g-3">
                            <div className="col-4">
                                <label className="billing-form-label">Bill Frequency</label>
                                <select className="billing-form-input" {...f("bill_frequency")}>
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="half_yearly">Half-Yearly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                            <div className="col-4">
                                <label className="billing-form-label">Generation Day (1–31)</label>
                                <input type="number" className="billing-form-input" min="1" max="31" {...f("generation_day")} />
                            </div>
                            <div className="col-4">
                                <label className="billing-form-label">Bill Type</label>
                                <select className="billing-form-input" {...f("bill_type")}>
                                    <option value="Advance">Advance</option>
                                    <option value="Arrear">Arrear</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="d-flex align-items-center gap-3" style={{ cursor:"pointer", fontSize:14 }}>
                                    <input type="checkbox" {...cb("auto_generate")} />
                                    <div>
                                        <strong>Enable Auto Bill Generation</strong>
                                        <div style={{ fontSize:12, color:"#6b7280" }}>
                                            System generates bills automatically on day {form.generation_day} of each period at 12:05 AM
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* ── Due Date ── */}
                    <div className="billing-card mb-3">
                        <div className="billing-card-title">📅 Due Date</div>
                        <div className="row g-3">
                            <div className="col-6">
                                <label className="billing-form-label">Due Date Type</label>
                                <select className="billing-form-input" {...f("due_date_type")}>
                                    <option value="fixed_date">Fixed Date (e.g. 25th every month)</option>
                                    <option value="days_after">Days After Generation</option>
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="billing-form-label">
                                    {form.due_date_type === "fixed_date" ? "Fixed Day (1–31)" : "Days After Generation"}
                                </label>
                                <input type="number" className="billing-form-input"
                                    min="1" max={form.due_date_type === "fixed_date" ? "31" : "90"}
                                    {...f("due_date_value")} />
                                <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>
                                    {form.due_date_type === "fixed_date"
                                        ? `Bills due on ${form.due_date_value}th of each month`
                                        : `Bills due ${form.due_date_value} days after generation`}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Penalty ── */}
                    <div className="billing-card mb-3">
                        <div className="billing-card-title">🔴 Late Payment Penalty</div>
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="d-flex align-items-center gap-3" style={{ cursor:"pointer", fontSize:14 }}>
                                    <input type="checkbox" {...cb("penalty_enabled")} />
                                    <div>
                                        <strong>Enable Automatic Penalty</strong>
                                        <div style={{ fontSize:12, color:"#6b7280" }}>
                                            Auto-applied to overdue bills daily at 1:00 AM
                                        </div>
                                    </div>
                                </label>
                            </div>
                            {parseInt(form.penalty_enabled) === 1 && (
                                <>
                                    <div className="col-4">
                                        <label className="billing-form-label">Penalty Type</label>
                                        <select className="billing-form-input" {...f("penalty_type")}>
                                            <option value="fixed">Fixed Amount (₹)</option>
                                            <option value="percentage">Percentage (%) of outstanding</option>
                                        </select>
                                    </div>
                                    <div className="col-4">
                                        <label className="billing-form-label">
                                            {form.penalty_type === "fixed" ? "Amount (₹)" : "Percentage (%)"}
                                        </label>
                                        <input type="number" className="billing-form-input"
                                            min="0" step={form.penalty_type === "fixed" ? "1" : "0.1"}
                                            {...f("penalty_value")} />
                                    </div>
                                    <div className="col-4">
                                        <label className="billing-form-label">Frequency</label>
                                        <select className="billing-form-input" {...f("penalty_frequency")}>
                                            <option value="monthly">Monthly (recurring)</option>
                                            <option value="one_time">One Time only</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <div style={{
                                            background:"#fef3c7", border:"1px solid #fde68a",
                                            borderRadius:8, padding:"10px 14px", fontSize:12, color:"#92400e"
                                        }}>
                                            ⚠️ Bill ₹1,100 overdue → Penalty =&nbsp;
                                            {form.penalty_type === "fixed"
                                                ? `₹${form.penalty_value} (fixed)`
                                                : `₹${((1100 * parseFloat(form.penalty_value||0))/100).toFixed(2)} (${form.penalty_value}% of ₹1,100)`}
                                            {form.penalty_frequency === "monthly" ? " · every month till paid" : " · once"}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ── Notes ── */}
                    <div className="billing-card mb-3">
                        <div className="billing-card-title">📝 Notes</div>
                        <div className="row g-3">
                            <div className="col-6">
                                <label className="billing-form-label">Internal Notes</label>
                                <textarea className="billing-form-input" rows={3} {...f("notes")} placeholder="Internal notes" />
                            </div>
                            <div className="col-6">
                                <label className="billing-form-label">Notes on Bill (shown to members)</label>
                                <textarea className="billing-form-input" rows={3} {...f("additional_notes")} placeholder="e.g. Please pay by due date to avoid penalty" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* ── Right sidebar: quick info ── */}
                <div className="col-12 col-lg-4">
                    <div className="billing-card mb-3" style={{ background:"#f0f9ff", border:"1px solid #bae6fd" }}>
                        <div style={{ fontWeight:700, color:"#0369a1", marginBottom:10 }}>⏰ Scheduler Status</div>
                        <div style={{ fontSize:13 }}>
                            <div className="d-flex justify-content-between mb-2">
                                <span style={{ color:"#6b7280" }}>Auto Bills</span>
                                <span style={{ color: parseInt(form.auto_generate)===1 ? "#059669":"#dc2626", fontWeight:600 }}>
                                    {parseInt(form.auto_generate)===1 ? "✅ ON" : "❌ OFF"}
                                </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span style={{ color:"#6b7280" }}>Penalty</span>
                                <span style={{ color: parseInt(form.penalty_enabled)===1 ? "#059669":"#dc2626", fontWeight:600 }}>
                                    {parseInt(form.penalty_enabled)===1 ? "✅ ON" : "❌ OFF"}
                                </span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span style={{ color:"#6b7280" }}>System FY</span>
                                <span style={{ color:"#2563eb", fontWeight:600 }}>
                                    {parseInt(form.use_system_fy)===1 ? "Apr–Mar" : "Custom"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="billing-card mb-3">
                        <div style={{ fontWeight:700, marginBottom:10 }}>📋 Scheduler Times</div>
                        <div style={{ fontSize:12, color:"#6b7280" }}>
                            <div className="mb-2">⚡ Bill Generation<br/><strong>Daily 12:05 AM IST</strong></div>
                            <div>🔴 Penalty Processing<br/><strong>Daily 01:00 AM IST</strong></div>
                        </div>
                    </div>

                    <div className="billing-card">
                        <div style={{ fontWeight:700, marginBottom:10 }}>ℹ️ Current Summary</div>
                        <div style={{ fontSize:12 }}>
                            <div className="d-flex justify-content-between mb-1">
                                <span style={{ color:"#6b7280" }}>Frequency</span>
                                <span style={{ fontWeight:600, textTransform:"capitalize" }}>{form.bill_frequency}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-1">
                                <span style={{ color:"#6b7280" }}>Generate on</span>
                                <span style={{ fontWeight:600 }}>Day {form.generation_day}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-1">
                                <span style={{ color:"#6b7280" }}>Due</span>
                                <span style={{ fontWeight:600 }}>
                                    {form.due_date_type === "fixed_date"
                                        ? `${form.due_date_value}th`
                                        : `+${form.due_date_value} days`}
                                </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span style={{ color:"#6b7280" }}>Timezone</span>
                                <span style={{ fontWeight:600, color:"#2563eb", fontSize:11 }}>{form.timezone || "Asia/Kolkata"}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span style={{ color:"#6b7280" }}>Interest</span>
                                <span style={{ fontWeight:600, color: parseInt(form.interest_enabled)===1 ? "#374151":"#dc2626" }}>
                                    {parseInt(form.interest_enabled)===1
                                        ? `${(parseFloat(form.interest_rate||0)*100).toFixed(0)}% p.a. (${form.interest_type === "S" ? "Simple" : "Compound"})`
                                        : "❌ Disabled"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-end mt-2">
                <button className="billing-btn billing-btn-primary" onClick={handleSave} disabled={saving} style={{ minWidth:160 }}>
                    {saving ? "Saving..." : "💾 Save All Settings"}
                </button>
            </div>
        </div>
    );
};


// ─────────────────────────────────────────────────────────────────────────────
// Opening Balance
// ─────────────────────────────────────────────────────────────────────────────
export const OpeningBalance = ({ setActive }) => {
    const { flatOptions } = useFlatOptions();   // society_id handled inside hook

    const [form, setForm] = useState({
        flat_id:    "",
        as_of_date: new Date().getFullYear() + "-04-01",
        principal:  "",
        interest:   "",
        remarks:    ""
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!form.flat_id)    { toast.error("Please select a flat");  return; }
        if (!form.as_of_date) { toast.error("Date is required");      return; }

        setSaving(true);
        try {
            // society_id comes from token — no need to pass
            await setOpeningBalanceApi({
                flat_id:    parseInt(form.flat_id),
                as_of_date: form.as_of_date,
                principal:  parseFloat(form.principal || 0),
                interest:   parseFloat(form.interest  || 0),
                remarks:    form.remarks || null,
            });
            toast.success("Opening balance saved successfully");
            setForm((prev) => ({ ...prev, flat_id: "", principal: "", interest: "", remarks: "" }));
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const totalOpening = parseFloat(form.principal || 0) + parseFloat(form.interest || 0);

    return (
        <div className="pg" style={{ padding: "20px 24px" }}>

            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 style={{ fontWeight: 700, margin: 0 }}>📂 Opening Balances</h4>
                    <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
                        Set arrears carried forward for each flat
                    </p>
                </div>
                <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>
                    ← Dashboard
                </button>
            </div>

            <div className="row g-3">
                <div className="col-12 col-lg-6">
                    <div className="billing-card">
                        <div className="billing-card-title">Set Opening Balance</div>
                        <div className="row g-3">

                            <div className="col-12">
                                <label className="billing-form-label">Flat *</label>
                                <select className="billing-form-input"
                                    value={form.flat_id}
                                    onChange={(e) => setForm({ ...form, flat_id: e.target.value })}>
                                    <option value="">Select Flat</option>
                                    {flatOptions.map((f) => (
                                        <option key={f.flat_id} value={f.flat_id}>
                                            {f.flat_number}{f.block ? ` / ${f.block}` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12">
                                <label className="billing-form-label">As of Date *</label>
                                <input type="date" className="billing-form-input"
                                    value={form.as_of_date}
                                    onChange={(e) => setForm({ ...form, as_of_date: e.target.value })} />
                                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>
                                    Typically the first day of your billing start month (e.g. 2024-04-01)
                                </div>
                            </div>

                            <div className="col-6">
                                <label className="billing-form-label">Principal Arrears (₹)</label>
                                <input type="number" className="billing-form-input" min="0" step="0.01"
                                    value={form.principal}
                                    onChange={(e) => setForm({ ...form, principal: e.target.value })}
                                    placeholder="14300.00" />
                            </div>

                            <div className="col-6">
                                <label className="billing-form-label">Interest Arrears (₹)</label>
                                <input type="number" className="billing-form-input" min="0" step="0.01"
                                    value={form.interest}
                                    onChange={(e) => setForm({ ...form, interest: e.target.value })}
                                    placeholder="3566.50" />
                            </div>

                            {/* Total Preview */}
                            {totalOpening > 0 && (
                                <div className="col-12">
                                    <div style={{
                                        background: "#f0fdf4", border: "1px solid #bbf7d0",
                                        borderRadius: 8, padding: "10px 14px",
                                        display: "flex", justifyContent: "space-between",
                                        fontSize: 13, fontWeight: 600
                                    }}>
                                        <span>Total Opening Balance</span>
                                        <span style={{ color: "#059669" }}>{fmt(totalOpening)}</span>
                                    </div>
                                </div>
                            )}

                            <div className="col-12">
                                <label className="billing-form-label">Remarks</label>
                                <input type="text" className="billing-form-input"
                                    value={form.remarks}
                                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                                    placeholder="Opening arrears as on April 2024" />
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-3">
                            <button className="billing-btn billing-btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? "Saving..." : "Save Opening Balance"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="col-12 col-lg-6">
                    <div className="billing-card mb-3">
                        <div className="billing-card-title">ℹ️ About Opening Balances</div>
                        <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
                            <p>Opening balance represents <strong>arrears carried forward</strong> from before the system start date.</p>
                            <p><strong>Principal</strong> — unpaid maintenance amount outstanding before system start</p>
                            <p><strong>Interest</strong> — interest already accrued on those arrears</p>
                            <p>These are automatically picked up when the <strong>first bill is generated</strong> for the flat.</p>
                        </div>
                    </div>
                    <div style={{
                        background: "#fee2e2", border: "1px solid #fca5a5",
                        borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#991b1b"
                    }}>
                        ⚠️ Set opening balances <strong>before generating any bills</strong> for the flat. Once a bill exists, the opening balance from that bill carries forward automatically.
                    </div>
                </div>
            </div>
        </div>
    );
};
