import React, { useState } from 'react'
import { Badge } from '../../components/Common/ReusableFunction';
import "../../styles/Broadcast.css"

const CreateBroadcast = ({ setActive }) => {
    const [tab, setTab] = useState("Announcement");
    const [subject, setSubject] = useState("")
    const [content, setContent] = useState("")
    const [attchment, setAttchment] = useState("")
    const tabs = [
        { id: "Announcement", icon: "📢" },
        { id: "Emergency", icon: "⚠️" },
        { id: "Circular", icon: "📄" },
        { id: "Event", icon: "📅" },
    ];
    return (

        <div className="pg row g-4 bc-wrap">
            {/* LEFT */}
            <div className="col-12 col-lg-8">
                <div className="sv-card text-start">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="bc-title">📢 Create & Publish</h5>
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => setActive("broadcasting")}
                        >
                            Back
                        </button>
                    </div>
                    <div className="broadcastTabs mt-2">
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`broadcastTab-btn ${tab === t.id ? "active" : ""}`}
                            >
                                {t.icon} {t.id}
                            </button>
                        ))}
                    </div>
                    <label className="sv-lb">Subject / Title</label>
                    <input className="sv-in mb-3" placeholder="Example: Scheduled Maintenance of Lift B"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)} />
                    <label className="sv-lb">Content</label>
                    <div className="bc-editor-box">
                        <div className="bc-editor-toolbar">
                            {["B", "I", "U", "≡", "≔", "🔗"].map(b => (
                                <button key={b} className={`bc-editor-btn ${b === "B" ? "bold" : ""}`}>
                                    {b}
                                </button>
                            ))}
                        </div>

                        <textarea
                            className="sv-ta bc-editor-textarea"
                            placeholder="Type your announcement details here…"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <label className="sv-lb">Attachment (Optional)</label>

                    <div className="upload-zone mb-4">
                        <div className="bc-upload-icon">☁️</div>
                        <div className="bc-upload-title">Click to upload or drag files here</div>
                        <div className="bc-upload-sub">PDF, JPG, PNG up to 10 MB</div>
                    </div>

                    <label className="sv-lb">Broadcasting Channels</label>

                    <div className="d-flex gap-2 mb-4">
                        <span className="bx bx-blue">☑ App Notification</span>
                        <span className="bx bx-gray">⊕ Add Channel</span>
                    </div>

                    <div className="d-flex gap-4 mb-4 bc-radio">
                        <label className="d-flex align-items-center gap-2">
                            <input type="radio" defaultChecked />
                            Send Now
                        </label>
                        <label className="d-flex align-items-center gap-2">
                            <input type="radio" />
                            Schedule for later
                        </label>
                    </div>

                    <div className="d-flex gap-2 justify-content-end">
                        <button className="btn-ol">Preview</button>
                        <button className="btn-ol">Save Draft</button>
                        <button className="btn-ac">Publish ✈</button>
                    </div>

                </div>
            </div>

            {/* RIGHT */}
            <div className="col-12 col-lg-4">

                {/* Notifications */}
                <div className="sv-card mb-3">
                    <h6 className="bc-side-title">Notifications</h6>

                    {[
                        { lbl: "Committee Meeting", time: "Today, 08:00 PM", dot: "dot-org" },
                        { lbl: "New user registered.", time: "59 minutes ago", dot: "dot-blu" },
                        { lbl: "Mr. Roy Sing update notice board", time: "1 hour ago", dot: "dot-org" },
                        { lbl: "Complaint by Riya Mittal", time: "Today, 10:59 AM", dot: "dot-red" },
                    ].map((n, i) => (
                        <div key={i} className="bc-notify-item">
                            <span className={`dot ${n.dot}`} />
                            <div className="text-start">
                                <div className="bc-notify-label">{n.lbl}</div>
                                <div className="bc-notify-time">{n.time}</div>
                            </div>
                        </div>
                    ))}

                    <button className="btn-dk w-100 mt-2">Show all notifications</button>
                </div>

                {/* Quick Actions */}
                <div className="sv-card mb-3">
                    <h6 className="bc-side-title">Quick Actions</h6>

                    {[["➕", "New Notice", "#dbeafe"], ["📊", "Create Poll", "#ffedd5"], ["📄", "Issue NOC", "#ede9fe"]].map(([ic, lb, bg]) => (
                        <button key={lb} className="qa mb-2">
                            <div className="qa-ico" style={{ background: bg }}>{ic}</div>
                            <span className="bc-qa-text">{lb}</span>
                        </button>
                    ))}
                </div>

                {/* Recent Communications */}
                <div className="sv-card">
                    <h6 className="bc-side-title">Recent Communications</h6>

                    {[
                        { title: "Water Supply Cut", time: "Today, 10:30 AM", type: "Alert", s: "Sent", sc: "green" },
                        { title: "New Year Event", time: "Dec 31, 08:00 PM", type: "Invitation", s: "Scheduled", sc: "blue" },
                        { title: "Parking Lot Resurfacing", time: "Edited 2h ago", type: "Announcement", s: "Draft", sc: "gray" },
                    ].map((r, i, arr) => (
                        <div key={i} className={`bc-rc-item ${i < arr.length - 1 ? "bordered" : ""}`}>
                            <div className="text-start">
                                <div className="bc-rc-title">{r.title}</div>
                                <div className="bc-rc-sub">{r.time} • {r.type}</div>
                            </div>
                            <Badge label={r.s} c={r.sc} />
                        </div>
                    ))}

                    <button className="btn-dk w-100 mt-3">Show all communication</button>
                </div>

            </div>
        </div>
    );


}

export default CreateBroadcast