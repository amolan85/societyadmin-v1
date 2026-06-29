import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
    getSchedulerProgressApi,
    getSchedulerLogsApi,
    triggerPenaltyApi,
    triggerAutoBillGenerationApi,
    triggerInterestApi,
    getBillingSettingsApi,
} from "../../services/BillingApi";
import "../../styles/Billing.css";

const fmtD   = (d) => d ? new Date(d).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit", hour12:true }) : "—";
const fmtDur = (s) => { if (!s && s !== 0) return "—"; if (s < 60) return `${s}s`; return `${Math.floor(s/60)}m ${s%60}s`; };

const STATUS_COLOR = {
    success: { bg:"#d1fae5", color:"#065f46", dot:"#059669" },
    failed:  { bg:"#fee2e2", color:"#991b1b", dot:"#dc2626" },
    running: { bg:"#dbeafe", color:"#1e40af", dot:"#2563eb" },
    partial: { bg:"#fef3c7", color:"#92400e", dot:"#d97706" },
};

const JOB_META = {
    auto_interest: { icon:"💰", label:"Interest on Arrears" },
    auto_bill_generate: { icon:"⚡", label:"Auto Bill Generation",  time:"00:05 AM IST", freq:"Daily" },
    auto_penalty:       { icon:"🔴", label:"Penalty Processing",    time:"01:00 AM IST", freq:"Daily" },
};

const ProgressBar = ({ pct, color="#2563eb", height=8 }) => (
    <div style={{ background:"#e5e7eb", borderRadius:99, height, overflow:"hidden", minWidth:80 }}>
        <div style={{ width:`${Math.min(100, pct||0)}%`, height:"100%", background:color, borderRadius:99, transition:"width 0.5s ease" }} />
    </div>
);

const Dot = ({ color, animate }) => (
    <span style={{
        display:"inline-block", width:9, height:9, borderRadius:"50%",
        background:color, marginRight:6,
        animation: animate ? "pulse 1.2s ease-in-out infinite" : "none"
    }} />
);

// ── Scheduler Master Card ─────────────────────────────────────
const SchedulerMasterCard = ({ settings }) => {
    const masters = [
        {
            id:      "auto_bill_generate",
            icon:    "⚡",
            label:   "Auto Bill Generation",
            time:    "00:05 AM",
            tz:      "IST",
            freq:    settings?.bill_frequency || "monthly",
            day:     `Day ${settings?.generation_day || 1}`,
            enabled: parseInt(settings?.auto_generate || 0) === 1,
            detail:  `Generates bills for all flats on day ${settings?.generation_day||1} of each ${settings?.bill_frequency||"month"}`,
            color:   "#2563eb",
            bg:      "#dbeafe",
        },
        {
            id:      "auto_penalty",
            icon:    "🔴",
            label:   "Penalty Processing",
            time:    "01:00 AM",
            tz:      "IST",
            freq:    "Daily",
            day:     "Every day",
            enabled: parseInt(settings?.penalty_enabled || 0) === 1,
            detail:  `Applies ${settings?.penalty_type==="percentage" ? `${settings?.penalty_value||0}%` : `₹${settings?.penalty_value||0}`} penalty on all overdue bills`,
            color:   "#dc2626",
            bg:      "#fee2e2",
        },
        {
            id:      "fy_reset",
            icon:    "🗓",
            label:   "Financial Year Tracking",
            time:    "Auto",
            tz:      "IST",
            freq:    "Yearly",
            day:     `1 Apr every year`,
            enabled: true,
            detail:  `Auto-calculates FY — ${settings?.use_system_fy===1?"System FY (Apr–Mar)":"Custom FY"}`,
            color:   "#7c3aed",
            bg:      "#f3e8ff",
        },
        {
            id:      "auto_interest",
            icon:    "💰",
            label:   "Interest on Arrears",
            time:    "02:00 AM",
            tz:      "IST",
            freq:    "Monthly",
            day:     "Every day after due date",
            enabled: parseInt(settings?.interest_enabled ?? 1) === 1,
            detail:  `${settings?.interest_type === "C" ? "Compound" : "Simple"} interest @ ${((parseFloat(settings?.interest_rate||0.18))*100).toFixed(1)}% p.a. on overdue balance`,
            color:   "#f59e0b",
            bg:      "#fef3c7",
        },
        {
            id:      "due_date",
            icon:    "📅",
            label:   "Due Date Rule",
            time:    "On bill generation",
            tz:      "",
            freq:    "Per bill",
            day:     settings?.due_date_type === "days_after"
                        ? `+${settings?.due_date_value||25} days after generation`
                        : `Fixed: ${settings?.due_date_value||25}th of month`,
            enabled: true,
            detail:  settings?.due_date_type === "days_after"
                        ? `Due = bill date + ${settings?.due_date_value||25} days`
                        : `Due = ${settings?.due_date_value||25}th of every month`,
            color:   "#059669",
            bg:      "#d1fae5",
        },
    ];

    return (
        <div className="row g-3 mb-4">
            {masters.map((m) => (
                <div key={m.id} className="col-12 col-md-6 col-xl-3">
                    <div style={{
                        background:"#fff", border:`1px solid #e5e7eb`,
                        borderRadius:12, padding:"16px 18px", height:"100%",
                        borderLeft:`4px solid ${m.enabled ? m.color : "#e5e7eb"}`
                    }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div style={{ fontSize:22 }}>{m.icon}</div>
                            <span style={{
                                fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:99,
                                background: m.enabled ? m.bg : "#f3f4f6",
                                color: m.enabled ? m.color : "#9ca3af",
                            }}>
                                {m.enabled ? "✅ ACTIVE" : "❌ OFF"}
                            </span>
                        </div>
                        <div style={{ fontWeight:700, fontSize:14, color:"#111827", marginBottom:4 }}>{m.label}</div>
                        <div style={{ fontSize:12, color:"#6b7280", marginBottom:8 }}>{m.detail}</div>
                        <div style={{ borderTop:"1px solid #f3f4f6", paddingTop:8 }}>
                            <div className="d-flex justify-content-between mb-1" style={{ fontSize:11 }}>
                                <span style={{ color:"#9ca3af" }}>🕐 Runs at</span>
                                <span style={{ fontWeight:600, color:"#374151" }}>{m.time} {m.tz}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-1" style={{ fontSize:11 }}>
                                <span style={{ color:"#9ca3af" }}>📆 Frequency</span>
                                <span style={{ fontWeight:600, color:"#374151", textTransform:"capitalize" }}>{m.freq}</span>
                            </div>
                            <div className="d-flex justify-content-between" style={{ fontSize:11 }}>
                                <span style={{ color:"#9ca3af" }}>📍 Schedule</span>
                                <span style={{ fontWeight:600, color:m.enabled?m.color:"#9ca3af" }}>{m.day}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// ── Main ─────────────────────────────────────────────────────
const SchedulerDashboard = ({ setActive }) => {
    const [progress,   setProgress]   = useState(null);
    const [logs,       setLogs]       = useState([]);
    const [total,      setTotal]      = useState(0);
    const [page,       setPage]       = useState(1);
    const [jobFilter,  setJobFilter]  = useState("");
    const [settings,   setSettings]   = useState(null);
    const [loading,    setLoading]    = useState(true);
    const [triggering, setTriggering] = useState("");
    const intervalRef = useRef(null);

    useEffect(() => {
        loadAll();
        intervalRef.current = setInterval(loadProgress, 5000);
        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(() => { loadLogs(); }, [page, jobFilter]);

    const loadAll = async () => {
        setLoading(true);
        await Promise.all([loadProgress(), loadLogs(), loadSettings()]);
        setLoading(false);
    };

    const loadProgress = async () => {
        try { const r = await getSchedulerProgressApi(); setProgress(r); } catch (_) {}
    };

    const loadLogs = async () => {
        try {
            const r = await getSchedulerLogsApi(page, 15, jobFilter || null);
            setLogs(r?.logs || []);
            setTotal(r?.pagination?.total || 0);
        } catch (_) {}
    };

    const loadSettings = async () => {
        try { const r = await getBillingSettingsApi(); setSettings(r); } catch (_) {}
    };

    const handleTrigger = async (type) => {
        setTriggering(type);
        try {
            if (type === "bill") {
                const r = await triggerAutoBillGenerationApi();
                toast.success(`Bill generation done — ${r?.bills_created||r?.societies_processed||0} bills created`);
            } else if (type === "penalty") {
                const r = await triggerPenaltyApi();
                const applied = r?.penalties_applied || 0;
                const skipped = r?.penalties_skipped || r?.skipped || 0;
                if (applied === 0 && skipped > 0) {
                    toast.info(`Penalty already applied this month for all ${skipped} overdue bills`);
                } else {
                    toast.success(`Penalty done — ${applied} applied, ${skipped} already done`);
                }
            } else {
                const r = await triggerInterestApi();
                const applied = r?.interest_applied || 0;
                const skipped = r?.skipped || 0;
                if (applied === 0 && skipped > 0) {
                    toast.info(`Interest already applied this month for all ${skipped} bills`);
                } else {
                    toast.success(`Interest applied to ${applied} bills`);
                }
            }
            setTimeout(loadAll, 1500);
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Trigger failed");
        } finally {
            setTriggering("");
        }
    };

    const hasRunning = progress?.recent_jobs?.some((j) => j.status === "running");
    const summary    = progress?.summary || [];
    const totalPages = Math.ceil(total / 15);

    return (
        <div className="pg" style={{ padding:"20px 24px" }}>

            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                <div>
                    <h4 style={{ fontWeight:700, margin:0 }}>⏰ Scheduler & Cron Tracker</h4>
                    <p style={{ color:"#6b7280", fontSize:13, margin:0 }}>
                        Automation status, progress tracking and scheduler configuration
                    </p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>← Dashboard</button>
                    <button className="billing-btn billing-btn-outline" onClick={loadAll}>🔄 Refresh</button>
                    <button className="billing-btn billing-btn-primary"
                        onClick={() => handleTrigger("bill")} disabled={!!triggering}>
                        {triggering === "bill" ? "⏳ Running..." : "⚡ Run Bill Generation"}
                    </button>
                    <button style={{ background:"#dc2626", color:"#fff", padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, opacity: triggering?"0.6":"1" }}
                        onClick={() => handleTrigger("penalty")} disabled={!!triggering}>
                        {triggering === "penalty" ? "⏳ Running..." : "🔴 Run Penalty Now"}
                    </button>
                    <button style={{ background:"#f59e0b", color:"#fff", padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, opacity: triggering?"0.6":"1" }}
                        onClick={() => handleTrigger("interest")} disabled={!!triggering}>
                        {triggering === "interest" ? "⏳ Running..." : "💰 Run Interest Now"}
                    </button>
                </div>
            </div>

            {/* Running alert */}
            {hasRunning && (
                <div style={{ background:"#dbeafe", border:"1px solid #93c5fd", borderRadius:10, padding:"12px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                    <Dot color="#2563eb" animate />
                    <span style={{ color:"#1e40af", fontWeight:600 }}>Job in progress — auto-refreshing every 5 seconds</span>
                </div>
            )}

            {/* Scheduler Masters */}
            <div style={{ marginBottom:8 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>
                    📋 Scheduler Configuration
                </div>
                <SchedulerMasterCard settings={settings} />
            </div>

            {/* Stats summary */}
            {summary.length > 0 && (
                <div className="d-flex gap-3 mb-4 flex-wrap">
                    {summary.map((s) => {
                        const meta = JOB_META[s.job_type] || { icon:"📋", label:s.job_type };
                        return (
                            <div key={s.job_type} style={{
                                flex:1, minWidth:220, background:"#fff",
                                border:"1px solid #e5e7eb", borderRadius:12, padding:"16px 20px"
                            }}>
                                <div style={{ fontSize:13, color:"#6b7280", marginBottom:6 }}>
                                    {meta.icon} {meta.label}
                                </div>
                                <div className="d-flex align-items-end justify-content-between mb-3">
                                    <div>
                                        <div style={{ fontSize:28, fontWeight:800, lineHeight:1 }}>{s.total_runs}</div>
                                        <div style={{ fontSize:11, color:"#9ca3af" }}>Total Runs</div>
                                    </div>
                                    <div style={{ textAlign:"right", fontSize:12 }}>
                                        <div><span style={{ color:"#059669" }}>✅ {s.success_count} ok</span></div>
                                        <div><span style={{ color:"#dc2626" }}>❌ {s.failed_count} fail</span></div>
                                        {parseInt(s.running_count) > 0 && <div><span style={{ color:"#2563eb" }}>⏳ {s.running_count} running</span></div>}
                                    </div>
                                </div>
                                {s.job_type === "auto_bill_generate" && (
                                    <div style={{ fontSize:12, padding:"6px 10px", background:"#f0fdf4", borderRadius:6, marginBottom:6 }}>
                                        📄 Bills created: <strong>{Number(s.total_bills_created||0).toLocaleString()}</strong>
                                    </div>
                                )}
                                {s.job_type === "auto_penalty" && (
                                    <div style={{ fontSize:12, padding:"6px 10px", background:"#fff7ed", borderRadius:6, marginBottom:6 }}>
                                        🔴 Penalties applied: <strong>{Number(s.total_penalties_applied||0).toLocaleString()}</strong>
                                    </div>
                                )}
                                <div style={{ fontSize:11, color:"#9ca3af" }}>
                                    Avg duration: {fmtDur(Math.round(s.avg_duration_seconds||0))} · Last: {fmtD(s.last_run)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Logs table */}
            <div className="billing-card" style={{ padding:0 }}>
                <div style={{ padding:"14px 20px", borderBottom:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                    <span style={{ fontWeight:700 }}>📋 Job History</span>
                    <div className="d-flex gap-2 align-items-center">
                        <select className="billing-form-input" style={{ width:190 }}
                            value={jobFilter} onChange={(e) => { setJobFilter(e.target.value); setPage(1); }}>
                            <option value="">All Job Types</option>
                            <option value="auto_bill_generate">⚡ Bill Generation</option>
                            <option value="auto_penalty">🔴 Penalty Processing</option>
                        </select>
                        <span style={{ fontSize:12, color:"#9ca3af" }}>{total} records</span>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign:"center", padding:48, color:"#9ca3af" }}>
                        <div style={{ fontSize:24, marginBottom:8 }}>⏳</div>Loading...
                    </div>
                ) : logs.length === 0 ? (
                    <div style={{ textAlign:"center", padding:48, color:"#9ca3af" }}>
                        <div style={{ fontSize:32, marginBottom:8 }}>📋</div>
                        <div style={{ fontWeight:600, marginBottom:4 }}>No scheduler logs yet</div>
                        <div style={{ fontSize:13 }}>Run a job using the buttons above to see progress here</div>
                    </div>
                ) : (
                    <div style={{ overflowX:"auto" }}>
                        <table className="billing-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Job</th>
                                    <th>Trigger</th>
                                    <th>Status</th>
                                    <th style={{ minWidth:130 }}>Progress</th>
                                    <th>Bills</th>
                                    <th>Penalties</th>
                                    <th>Errors</th>
                                    <th>Duration</th>
                                    <th>Started</th>
                                    <th>Finished</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => {
                                    const meta   = JOB_META[log.job_type] || { icon:"📋", label:log.job_type };
                                    const sc     = STATUS_COLOR[log.status] || STATUS_COLOR.partial;
                                    const pct    = parseInt(log.progress_pct || 0);
                                    const isRun  = log.status === "running";
                                    return (
                                        <tr key={log.id}>
                                            <td style={{ fontSize:11, color:"#9ca3af" }}>#{log.id}</td>
                                            <td>
                                                <div style={{ fontWeight:600, fontSize:13 }}>{meta.icon} {meta.label}</div>
                                                {log.run_date && <div style={{ fontSize:11, color:"#9ca3af" }}>{log.run_date}</div>}
                                            </td>
                                            <td>
                                                <span style={{ fontSize:11, padding:"2px 8px", borderRadius:99,
                                                    background: log.trigger_type==="manual"?"#fef3c7":"#f3f4f6",
                                                    color: log.trigger_type==="manual"?"#92400e":"#6b7280", fontWeight:600 }}>
                                                    {log.trigger_type==="manual" ? "👤 Manual" : "🤖 Auto"}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ fontSize:11, padding:"3px 10px", borderRadius:99,
                                                    background:sc.bg, color:sc.color, fontWeight:700,
                                                    display:"flex", alignItems:"center", gap:4, width:"fit-content" }}>
                                                    <Dot color={sc.dot} animate={isRun} />
                                                    {log.status?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ minWidth:140 }}>
                                                <div style={{ fontSize:11, color:"#6b7280", marginBottom:3 }}>
                                                    {log.processed_flats||0} / {log.total_flats||0}
                                                    <span style={{ color:"#2563eb", marginLeft:4 }}>({pct}%)</span>
                                                </div>
                                                <ProgressBar pct={pct}
                                                    color={log.status==="failed"?"#dc2626":isRun?"#2563eb":"#059669"} />
                                                {isRun && (
                                                    <div style={{ fontSize:10, color:"#2563eb", marginTop:2 }}>⏳ In progress...</div>
                                                )}
                                            </td>
                                            <td style={{ textAlign:"center" }}>
                                                {parseInt(log.bills_created||0) > 0
                                                    ? <div style={{ color:"#059669", fontWeight:700 }}>+{log.bills_created}</div>
                                                    : null}
                                                {parseInt(log.bills_skipped||0) > 0
                                                    ? <div style={{ fontSize:11, color:"#9ca3af" }}>skip {log.bills_skipped}</div>
                                                    : null}
                                                {!log.bills_created && !log.bills_skipped && "—"}
                                            </td>
                                            <td style={{ textAlign:"center" }}>
                                                {parseInt(log.penalties_applied||0) > 0
                                                    ? <div style={{ color:"#dc2626", fontWeight:700 }}>+{log.penalties_applied}</div>
                                                    : null}
                                                {parseInt(log.penalties_skipped||0) > 0
                                                    ? <div style={{ fontSize:11, color:"#9ca3af" }}>skip {log.penalties_skipped}</div>
                                                    : null}
                                                {!log.penalties_applied && !log.penalties_skipped && "—"}
                                            </td>
                                            <td style={{ textAlign:"center" }}>
                                                {parseInt(log.errors||0) > 0
                                                    ? <span style={{ color:"#dc2626", fontWeight:700 }}
                                                        title={log.error_details||""}>⚠️ {log.errors}</span>
                                                    : <span style={{ color:"#9ca3af" }}>—</span>}
                                            </td>
                                            <td style={{ fontSize:12, color:"#374151", whiteSpace:"nowrap" }}>
                                                {fmtDur(log.duration_seconds)}
                                            </td>
                                            <td style={{ fontSize:12, color:"#6b7280", whiteSpace:"nowrap" }}>
                                                {fmtD(log.started_at)}
                                            </td>
                                            <td style={{ fontSize:12, color:"#6b7280", whiteSpace:"nowrap" }}>
                                                {isRun
                                                    ? <span style={{ color:"#2563eb" }}>Running...</span>
                                                    : fmtD(log.finished_at)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ padding:"12px 20px", borderTop:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:12, color:"#9ca3af" }}>
                            Page {page} of {totalPages} · {total} records
                        </span>
                        <div className="d-flex gap-2">
                            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                                style={{ padding:"4px 10px", border:"1px solid #e5e7eb", borderRadius:6, background:"#fff", cursor:"pointer", fontSize:13 }}>
                                ‹ Prev
                            </button>
                            {Array.from({length: Math.min(totalPages,5)}, (_,i) => {
                                const p = page <= 3 ? i+1 : page-2+i;
                                if (p < 1 || p > totalPages) return null;
                                return (
                                    <button key={p} onClick={() => setPage(p)}
                                        style={{ padding:"4px 10px", border:"1px solid #e5e7eb", borderRadius:6, cursor:"pointer", fontSize:13,
                                            background: page===p?"#2563eb":"#fff", color:page===p?"#fff":"#374151" }}>
                                        {p}
                                    </button>
                                );
                            })}
                            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                                style={{ padding:"4px 10px", border:"1px solid #e5e7eb", borderRadius:6, background:"#fff", cursor:"pointer", fontSize:13 }}>
                                Next ›
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ fontSize:11, color:"#9ca3af", textAlign:"center", marginTop:12 }}>
                🔄 Auto-refreshes every 5 seconds when jobs are running · Timezone: {settings?.timezone || "Asia/Kolkata"}
            </div>

            <style>{`
                @keyframes pulse {
                    0%,100% { opacity:1; transform:scale(1); }
                    50% { opacity:0.4; transform:scale(1.4); }
                }
            `}</style>
        </div>
    );
};

export default SchedulerDashboard;


// import { useState, useEffect, useRef } from "react";
// import { toast } from "react-toastify";
// import {
//     getSchedulerProgressApi,
//     getSchedulerLogsApi,
//     triggerPenaltyApi,
//     triggerAutoBillGenerationApi,
//     getBillingSettingsApi,
// } from "../../services/BillingApi";
// import "../../styles/Billing.css";

// const fmtD   = (d) => d ? new Date(d).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit", hour12:true }) : "—";
// const fmtDur = (s) => { if (!s && s !== 0) return "—"; if (s < 60) return `${s}s`; return `${Math.floor(s/60)}m ${s%60}s`; };

// const STATUS_COLOR = {
//     success: { bg:"#d1fae5", color:"#065f46", dot:"#059669" },
//     failed:  { bg:"#fee2e2", color:"#991b1b", dot:"#dc2626" },
//     running: { bg:"#dbeafe", color:"#1e40af", dot:"#2563eb" },
//     partial: { bg:"#fef3c7", color:"#92400e", dot:"#d97706" },
// };

// const JOB_META = {
//     auto_bill_generate: { icon:"⚡", label:"Auto Bill Generation",  time:"00:05 AM IST", freq:"Daily" },
//     auto_penalty:       { icon:"🔴", label:"Penalty Processing",    time:"01:00 AM IST", freq:"Daily" },
// };

// const ProgressBar = ({ pct, color="#2563eb", height=8 }) => (
//     <div style={{ background:"#e5e7eb", borderRadius:99, height, overflow:"hidden", minWidth:80 }}>
//         <div style={{ width:`${Math.min(100, pct||0)}%`, height:"100%", background:color, borderRadius:99, transition:"width 0.5s ease" }} />
//     </div>
// );

// const Dot = ({ color, animate }) => (
//     <span style={{
//         display:"inline-block", width:9, height:9, borderRadius:"50%",
//         background:color, marginRight:6,
//         animation: animate ? "pulse 1.2s ease-in-out infinite" : "none"
//     }} />
// );

// // ── Scheduler Master Card ─────────────────────────────────────
// const SchedulerMasterCard = ({ settings }) => {
//     const masters = [
//         {
//             id:      "auto_bill_generate",
//             icon:    "⚡",
//             label:   "Auto Bill Generation",
//             time:    "00:05 AM",
//             tz:      "IST",
//             freq:    settings?.bill_frequency || "monthly",
//             day:     `Day ${settings?.generation_day || 1}`,
//             enabled: parseInt(settings?.auto_generate || 0) === 1,
//             detail:  `Generates bills for all flats on day ${settings?.generation_day||1} of each ${settings?.bill_frequency||"month"}`,
//             color:   "#2563eb",
//             bg:      "#dbeafe",
//         },
//         {
//             id:      "auto_penalty",
//             icon:    "🔴",
//             label:   "Penalty Processing",
//             time:    "01:00 AM",
//             tz:      "IST",
//             freq:    "Daily",
//             day:     "Every day",
//             enabled: parseInt(settings?.penalty_enabled || 0) === 1,
//             detail:  `Applies ${settings?.penalty_type==="percentage" ? `${settings?.penalty_value||0}%` : `₹${settings?.penalty_value||0}`} penalty on all overdue bills`,
//             color:   "#dc2626",
//             bg:      "#fee2e2",
//         },
//         {
//             id:      "fy_reset",
//             icon:    "🗓",
//             label:   "Financial Year Tracking",
//             time:    "Auto",
//             tz:      "IST",
//             freq:    "Yearly",
//             day:     `1 Apr every year`,
//             enabled: true,
//             detail:  `Auto-calculates FY — ${settings?.use_system_fy===1?"System FY (Apr–Mar)":"Custom FY"}`,
//             color:   "#7c3aed",
//             bg:      "#f3e8ff",
//         },
//         {
//             id:      "due_date",
//             icon:    "📅",
//             label:   "Due Date Rule",
//             time:    "On bill generation",
//             tz:      "",
//             freq:    "Per bill",
//             day:     settings?.due_date_type === "days_after"
//                         ? `+${settings?.due_date_value||25} days after generation`
//                         : `Fixed: ${settings?.due_date_value||25}th of month`,
//             enabled: true,
//             detail:  settings?.due_date_type === "days_after"
//                         ? `Due = bill date + ${settings?.due_date_value||25} days`
//                         : `Due = ${settings?.due_date_value||25}th of every month`,
//             color:   "#059669",
//             bg:      "#d1fae5",
//         },
//     ];

//     return (
//         <div className="row g-3 mb-4">
//             {masters.map((m) => (
//                 <div key={m.id} className="col-12 col-md-6 col-xl-3">
//                     <div style={{
//                         background:"#fff", border:`1px solid #e5e7eb`,
//                         borderRadius:12, padding:"16px 18px", height:"100%",
//                         borderLeft:`4px solid ${m.enabled ? m.color : "#e5e7eb"}`
//                     }}>
//                         <div className="d-flex justify-content-between align-items-start mb-2">
//                             <div style={{ fontSize:22 }}>{m.icon}</div>
//                             <span style={{
//                                 fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:99,
//                                 background: m.enabled ? m.bg : "#f3f4f6",
//                                 color: m.enabled ? m.color : "#9ca3af",
//                             }}>
//                                 {m.enabled ? "✅ ACTIVE" : "❌ OFF"}
//                             </span>
//                         </div>
//                         <div style={{ fontWeight:700, fontSize:14, color:"#111827", marginBottom:4 }}>{m.label}</div>
//                         <div style={{ fontSize:12, color:"#6b7280", marginBottom:8 }}>{m.detail}</div>
//                         <div style={{ borderTop:"1px solid #f3f4f6", paddingTop:8 }}>
//                             <div className="d-flex justify-content-between mb-1" style={{ fontSize:11 }}>
//                                 <span style={{ color:"#9ca3af" }}>🕐 Runs at</span>
//                                 <span style={{ fontWeight:600, color:"#374151" }}>{m.time} {m.tz}</span>
//                             </div>
//                             <div className="d-flex justify-content-between mb-1" style={{ fontSize:11 }}>
//                                 <span style={{ color:"#9ca3af" }}>📆 Frequency</span>
//                                 <span style={{ fontWeight:600, color:"#374151", textTransform:"capitalize" }}>{m.freq}</span>
//                             </div>
//                             <div className="d-flex justify-content-between" style={{ fontSize:11 }}>
//                                 <span style={{ color:"#9ca3af" }}>📍 Schedule</span>
//                                 <span style={{ fontWeight:600, color:m.enabled?m.color:"#9ca3af" }}>{m.day}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// // ── Main ─────────────────────────────────────────────────────
// const SchedulerDashboard = ({ setActive }) => {
//     const [progress,   setProgress]   = useState(null);
//     const [logs,       setLogs]       = useState([]);
//     const [total,      setTotal]      = useState(0);
//     const [page,       setPage]       = useState(1);
//     const [jobFilter,  setJobFilter]  = useState("");
//     const [settings,   setSettings]   = useState(null);
//     const [loading,    setLoading]    = useState(true);
//     const [triggering, setTriggering] = useState("");
//     const intervalRef = useRef(null);

//     useEffect(() => {
//         loadAll();
//         intervalRef.current = setInterval(loadProgress, 5000);
//         return () => clearInterval(intervalRef.current);
//     }, []);

//     useEffect(() => { loadLogs(); }, [page, jobFilter]);

//     const loadAll = async () => {
//         setLoading(true);
//         await Promise.all([loadProgress(), loadLogs(), loadSettings()]);
//         setLoading(false);
//     };

//     const loadProgress = async () => {
//         try { const r = await getSchedulerProgressApi(); setProgress(r); } catch (_) {}
//     };

//     const loadLogs = async () => {
//         try {
//             const r = await getSchedulerLogsApi(page, 15, jobFilter || null);
//             setLogs(r?.logs || []);
//             setTotal(r?.pagination?.total || 0);
//         } catch (_) {}
//     };

//     const loadSettings = async () => {
//         try { const r = await getBillingSettingsApi(); setSettings(r); } catch (_) {}
//     };

//     const handleTrigger = async (type) => {
//         setTriggering(type);
//         try {
//             if (type === "bill") {
//                 const r = await triggerAutoBillGenerationApi();
//                 toast.success(`Bill generation triggered — ${r?.societies_processed||0} societies processed`);
//             } else {
//                 const r = await triggerPenaltyApi();
//                 toast.success(`Penalty applied — ${r?.penalties_applied||0} bills penalised`);
//             }
//             setTimeout(loadAll, 1500);
//         } catch (e) {
//             toast.error(typeof e === "string" ? e : "Trigger failed");
//         } finally {
//             setTriggering("");
//         }
//     };

//     const hasRunning = progress?.recent_jobs?.some((j) => j.status === "running");
//     const summary    = progress?.summary || [];
//     const totalPages = Math.ceil(total / 15);

//     return (
//         <div className="pg" style={{ padding:"20px 24px" }}>

//             {/* Header */}
//             <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
//                 <div>
//                     <h4 style={{ fontWeight:700, margin:0 }}>⏰ Scheduler & Cron Tracker</h4>
//                     <p style={{ color:"#6b7280", fontSize:13, margin:0 }}>
//                         Automation status, progress tracking and scheduler configuration
//                     </p>
//                 </div>
//                 <div className="d-flex gap-2 flex-wrap">
//                     <button className="billing-btn billing-btn-outline" onClick={() => setActive("billingDashboard")}>← Dashboard</button>
//                     <button className="billing-btn billing-btn-outline" onClick={loadAll}>🔄 Refresh</button>
//                     <button className="billing-btn billing-btn-primary"
//                         onClick={() => handleTrigger("bill")} disabled={!!triggering}>
//                         {triggering === "bill" ? "⏳ Running..." : "⚡ Run Bill Generation"}
//                     </button>
//                     <button style={{ background:"#dc2626", color:"#fff", padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, opacity: triggering?"0.6":"1" }}
//                         onClick={() => handleTrigger("penalty")} disabled={!!triggering}>
//                         {triggering === "penalty" ? "⏳ Running..." : "🔴 Run Penalty Now"}
//                     </button>
//                 </div>
//             </div>

//             {/* Running alert */}
//             {hasRunning && (
//                 <div style={{ background:"#dbeafe", border:"1px solid #93c5fd", borderRadius:10, padding:"12px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
//                     <Dot color="#2563eb" animate />
//                     <span style={{ color:"#1e40af", fontWeight:600 }}>Job in progress — auto-refreshing every 5 seconds</span>
//                 </div>
//             )}

//             {/* Scheduler Masters */}
//             <div style={{ marginBottom:8 }}>
//                 <div style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>
//                     📋 Scheduler Configuration
//                 </div>
//                 <SchedulerMasterCard settings={settings} />
//             </div>

//             {/* Stats summary */}
//             {summary.length > 0 && (
//                 <div className="d-flex gap-3 mb-4 flex-wrap">
//                     {summary.map((s) => {
//                         const meta = JOB_META[s.job_type] || { icon:"📋", label:s.job_type };
//                         return (
//                             <div key={s.job_type} style={{
//                                 flex:1, minWidth:220, background:"#fff",
//                                 border:"1px solid #e5e7eb", borderRadius:12, padding:"16px 20px"
//                             }}>
//                                 <div style={{ fontSize:13, color:"#6b7280", marginBottom:6 }}>
//                                     {meta.icon} {meta.label}
//                                 </div>
//                                 <div className="d-flex align-items-end justify-content-between mb-3">
//                                     <div>
//                                         <div style={{ fontSize:28, fontWeight:800, lineHeight:1 }}>{s.total_runs}</div>
//                                         <div style={{ fontSize:11, color:"#9ca3af" }}>Total Runs</div>
//                                     </div>
//                                     <div style={{ textAlign:"right", fontSize:12 }}>
//                                         <div><span style={{ color:"#059669" }}>✅ {s.success_count} ok</span></div>
//                                         <div><span style={{ color:"#dc2626" }}>❌ {s.failed_count} fail</span></div>
//                                         {parseInt(s.running_count) > 0 && <div><span style={{ color:"#2563eb" }}>⏳ {s.running_count} running</span></div>}
//                                     </div>
//                                 </div>
//                                 {s.job_type === "auto_bill_generate" && (
//                                     <div style={{ fontSize:12, padding:"6px 10px", background:"#f0fdf4", borderRadius:6, marginBottom:6 }}>
//                                         📄 Bills created: <strong>{Number(s.total_bills_created||0).toLocaleString()}</strong>
//                                     </div>
//                                 )}
//                                 {s.job_type === "auto_penalty" && (
//                                     <div style={{ fontSize:12, padding:"6px 10px", background:"#fff7ed", borderRadius:6, marginBottom:6 }}>
//                                         🔴 Penalties applied: <strong>{Number(s.total_penalties_applied||0).toLocaleString()}</strong>
//                                     </div>
//                                 )}
//                                 <div style={{ fontSize:11, color:"#9ca3af" }}>
//                                     Avg duration: {fmtDur(Math.round(s.avg_duration_seconds||0))} · Last: {fmtD(s.last_run)}
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             )}

//             {/* Logs table */}
//             <div className="billing-card" style={{ padding:0 }}>
//                 <div style={{ padding:"14px 20px", borderBottom:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
//                     <span style={{ fontWeight:700 }}>📋 Job History</span>
//                     <div className="d-flex gap-2 align-items-center">
//                         <select className="billing-form-input" style={{ width:190 }}
//                             value={jobFilter} onChange={(e) => { setJobFilter(e.target.value); setPage(1); }}>
//                             <option value="">All Job Types</option>
//                             <option value="auto_bill_generate">⚡ Bill Generation</option>
//                             <option value="auto_penalty">🔴 Penalty Processing</option>
//                         </select>
//                         <span style={{ fontSize:12, color:"#9ca3af" }}>{total} records</span>
//                     </div>
//                 </div>

//                 {loading ? (
//                     <div style={{ textAlign:"center", padding:48, color:"#9ca3af" }}>
//                         <div style={{ fontSize:24, marginBottom:8 }}>⏳</div>Loading...
//                     </div>
//                 ) : logs.length === 0 ? (
//                     <div style={{ textAlign:"center", padding:48, color:"#9ca3af" }}>
//                         <div style={{ fontSize:32, marginBottom:8 }}>📋</div>
//                         <div style={{ fontWeight:600, marginBottom:4 }}>No scheduler logs yet</div>
//                         <div style={{ fontSize:13 }}>Run a job using the buttons above to see progress here</div>
//                     </div>
//                 ) : (
//                     <div style={{ overflowX:"auto" }}>
//                         <table className="billing-table">
//                             <thead>
//                                 <tr>
//                                     <th>#</th>
//                                     <th>Job</th>
//                                     <th>Trigger</th>
//                                     <th>Status</th>
//                                     <th style={{ minWidth:130 }}>Progress</th>
//                                     <th>Bills</th>
//                                     <th>Penalties</th>
//                                     <th>Errors</th>
//                                     <th>Duration</th>
//                                     <th>Started</th>
//                                     <th>Finished</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {logs.map((log) => {
//                                     const meta   = JOB_META[log.job_type] || { icon:"📋", label:log.job_type };
//                                     const sc     = STATUS_COLOR[log.status] || STATUS_COLOR.partial;
//                                     const pct    = parseInt(log.progress_pct || 0);
//                                     const isRun  = log.status === "running";
//                                     return (
//                                         <tr key={log.id}>
//                                             <td style={{ fontSize:11, color:"#9ca3af" }}>#{log.id}</td>
//                                             <td>
//                                                 <div style={{ fontWeight:600, fontSize:13 }}>{meta.icon} {meta.label}</div>
//                                                 {log.run_date && <div style={{ fontSize:11, color:"#9ca3af" }}>{log.run_date}</div>}
//                                             </td>
//                                             <td>
//                                                 <span style={{ fontSize:11, padding:"2px 8px", borderRadius:99,
//                                                     background: log.trigger_type==="manual"?"#fef3c7":"#f3f4f6",
//                                                     color: log.trigger_type==="manual"?"#92400e":"#6b7280", fontWeight:600 }}>
//                                                     {log.trigger_type==="manual" ? "👤 Manual" : "🤖 Auto"}
//                                                 </span>
//                                             </td>
//                                             <td>
//                                                 <span style={{ fontSize:11, padding:"3px 10px", borderRadius:99,
//                                                     background:sc.bg, color:sc.color, fontWeight:700,
//                                                     display:"flex", alignItems:"center", gap:4, width:"fit-content" }}>
//                                                     <Dot color={sc.dot} animate={isRun} />
//                                                     {log.status?.toUpperCase()}
//                                                 </span>
//                                             </td>
//                                             <td style={{ minWidth:140 }}>
//                                                 <div style={{ fontSize:11, color:"#6b7280", marginBottom:3 }}>
//                                                     {log.processed_flats||0} / {log.total_flats||0}
//                                                     <span style={{ color:"#2563eb", marginLeft:4 }}>({pct}%)</span>
//                                                 </div>
//                                                 <ProgressBar pct={pct}
//                                                     color={log.status==="failed"?"#dc2626":isRun?"#2563eb":"#059669"} />
//                                                 {isRun && (
//                                                     <div style={{ fontSize:10, color:"#2563eb", marginTop:2 }}>⏳ In progress...</div>
//                                                 )}
//                                             </td>
//                                             <td style={{ textAlign:"center" }}>
//                                                 {parseInt(log.bills_created||0) > 0
//                                                     ? <div style={{ color:"#059669", fontWeight:700 }}>+{log.bills_created}</div>
//                                                     : null}
//                                                 {parseInt(log.bills_skipped||0) > 0
//                                                     ? <div style={{ fontSize:11, color:"#9ca3af" }}>skip {log.bills_skipped}</div>
//                                                     : null}
//                                                 {!log.bills_created && !log.bills_skipped && "—"}
//                                             </td>
//                                             <td style={{ textAlign:"center" }}>
//                                                 {parseInt(log.penalties_applied||0) > 0
//                                                     ? <div style={{ color:"#dc2626", fontWeight:700 }}>+{log.penalties_applied}</div>
//                                                     : null}
//                                                 {parseInt(log.penalties_skipped||0) > 0
//                                                     ? <div style={{ fontSize:11, color:"#9ca3af" }}>skip {log.penalties_skipped}</div>
//                                                     : null}
//                                                 {!log.penalties_applied && !log.penalties_skipped && "—"}
//                                             </td>
//                                             <td style={{ textAlign:"center" }}>
//                                                 {parseInt(log.errors||0) > 0
//                                                     ? <span style={{ color:"#dc2626", fontWeight:700 }}
//                                                         title={log.error_details||""}>⚠️ {log.errors}</span>
//                                                     : <span style={{ color:"#9ca3af" }}>—</span>}
//                                             </td>
//                                             <td style={{ fontSize:12, color:"#374151", whiteSpace:"nowrap" }}>
//                                                 {fmtDur(log.duration_seconds)}
//                                             </td>
//                                             <td style={{ fontSize:12, color:"#6b7280", whiteSpace:"nowrap" }}>
//                                                 {fmtD(log.started_at)}
//                                             </td>
//                                             <td style={{ fontSize:12, color:"#6b7280", whiteSpace:"nowrap" }}>
//                                                 {isRun
//                                                     ? <span style={{ color:"#2563eb" }}>Running...</span>
//                                                     : fmtD(log.finished_at)}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                     <div style={{ padding:"12px 20px", borderTop:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
//                         <span style={{ fontSize:12, color:"#9ca3af" }}>
//                             Page {page} of {totalPages} · {total} records
//                         </span>
//                         <div className="d-flex gap-2">
//                             <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
//                                 style={{ padding:"4px 10px", border:"1px solid #e5e7eb", borderRadius:6, background:"#fff", cursor:"pointer", fontSize:13 }}>
//                                 ‹ Prev
//                             </button>
//                             {Array.from({length: Math.min(totalPages,5)}, (_,i) => {
//                                 const p = page <= 3 ? i+1 : page-2+i;
//                                 if (p < 1 || p > totalPages) return null;
//                                 return (
//                                     <button key={p} onClick={() => setPage(p)}
//                                         style={{ padding:"4px 10px", border:"1px solid #e5e7eb", borderRadius:6, cursor:"pointer", fontSize:13,
//                                             background: page===p?"#2563eb":"#fff", color:page===p?"#fff":"#374151" }}>
//                                         {p}
//                                     </button>
//                                 );
//                             })}
//                             <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
//                                 style={{ padding:"4px 10px", border:"1px solid #e5e7eb", borderRadius:6, background:"#fff", cursor:"pointer", fontSize:13 }}>
//                                 Next ›
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <div style={{ fontSize:11, color:"#9ca3af", textAlign:"center", marginTop:12 }}>
//                 🔄 Auto-refreshes every 5 seconds when jobs are running · Timezone: {settings?.timezone || "Asia/Kolkata"}
//             </div>

//             <style>{`
//                 @keyframes pulse {
//                     0%,100% { opacity:1; transform:scale(1); }
//                     50% { opacity:0.4; transform:scale(1.4); }
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default SchedulerDashboard;