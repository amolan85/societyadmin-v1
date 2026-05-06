
import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { Badge } from '../../components/Common/ReusableFunction';
import "../../styles/Broadcast.css"
import { GetSessionData } from '../../utils/SessionManagement';
import { CreateBroadcastApi } from '../../services/BroadcastApi';
import { CreatePollApi } from '../../services/PollApi';
import { createComplaintsApi, getFlatsAndCategoryApi } from '../../services/ComplaintsApi';

const CreateComplaints = ({ setActive }) => {
    const [category, setCategory] = useState("1");
    const [title, setTitle] = useState("")
    const [allunits, setAllunits] = useState([])
    const [unit, setUnit] = useState("")
    const [description, setDescription] = useState("")
    const [allCategory, setAllCategory] = useState([])
    const [priority, setPriority] = useState("high")
    const [attachment, setAttachment] = useState()
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [societyId, setSocietyId] = useState("")
    const [userId, setUserId] = useState("")
    const [options, setOptions] = useState(new Array(4).fill(""));
    const [errors, setErrors] = useState({})

    const tabs = [
        { id: "Maintenance", icon: "📢", value: "1" },
        { id: "Plumbing", icon: "⚠️", value: "2" },
        { id: "Electrical", icon: "📄", value: "3" },
        { id: "Parking", icon: "📅", value: "4" },
        { id: "Noise", icon: "📅", value: "5" },
    ];


    useEffect(() => {
        SessionData()

    }, [])

    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)
        setUserId(data.data.user_id)
        GetFlatsAndCategory(flats.society_id)
    }

    const handleOptionChange = (index, value) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    const getDateTime = (date) => {
        const now = new Date();

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        return `${date} ${hours}:${minutes}:${seconds}`;
    };

    const GetFlatsAndCategory = async (societyId) => {
        const data = await getFlatsAndCategoryApi(societyId)
        console.log(data)
        setAllunits(
            data.flats.map((item) => ({
                value: item.flat_id,
                label: item.flat_number,
            }))
        );
        setAllCategory(data.categories)
    }

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setAttachment(selected);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setAttachment(droppedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };


    const validateForm = () => {
        let errors = {};

        if (!title) {
            errors.title = "required";
        }

        if (!unit) {
            errors.unit = "required";
        }

        if (!description) {
            errors.description = "required";
        }


        return errors;
    };

    const CreateComplaint = async () => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        }
        else {
            const data = await createComplaintsApi(societyId, userId, category, unit.value, title, description, unit, priority, attachment)
            setActive("complaints")
        }
    }


    return (
        <>
            <div className="pg row g-4 bc-wrap">
                {/* LEFT */}
                <div className="col-12 col-lg-8">
                    <div className="sv-card text-start">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="bc-title">Create Complaints</h5>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => setActive("complaints")}
                            >
                                Back
                            </button>
                        </div>
                        <div className="broadcastTabs mt-2">
                            {allCategory.map((t) => (
                                <button
                                    key={t.category_id}
                                    onClick={() => setCategory(t.category_id)}
                                    className={`broadcastTab-btn ${category === t.category_id ? "active" : ""}`}
                                >
                                    {t.icon} {t.name}
                                </button>
                            ))}
                        </div>
                        <div className='d-flex'>
                            <label className="sv-lb"> Title <span className='text-danger'>*</span></label>
                            {errors.title && <span className='text-danger mx-2 '>{errors.title}</span>}
                        </div>

                        <input className={`sv-in mb-3 ${errors.title ? "error-input" : ""}`} placeholder="Example: Scheduled Maintenance of Lift B"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} />

                        <div className='d-flex'>
                            <label className="sv-lb"> Unit <span className='text-danger'>*</span></label>
                            {errors.unit && <span className='text-danger mx-2 '>{errors.unit}</span>}
                        </div>

                        {/* <input className={`sv-in mb-3 ${errors.unit ? "error-input" : ""}`} placeholder="Example: Scheduled Maintenance of Lift B"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)} /> */}
                        <Select
                            options={allunits}
                            value={unit}                  // 👈 poora object
                            onChange={(selectedOption) => setUnit(selectedOption)} // 👈 direct object
                        />

                        <div className='d-flex mt-3'>
                            <label className="sv-lb" >Description <span className='text-danger'>*</span></label>
                            {errors.description && <span className='text-danger mx-2 '>{errors.description}</span>}

                        </div>


                        <div className={`bc-editor-box ${errors.description ? "error-input" : ""}`}>

                            <textarea
                                className="sv-ta bc-editor-textarea"
                                placeholder="Type your announcement details here…"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <label className="sv-lb">Attachment (Optional)</label>
                        <div
                            className="upload-zone mb-4"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            style={{ cursor: "pointer" }}
                            onClick={() => document.getElementById("fileInput").click()}
                        >
                            <div className="bc-upload-icon">☁️</div>
                            <div className="bc-upload-title">
                                {attachment ? attachment.name : "Click to upload or drag files here"}
                            </div>
                            <div className="bc-upload-sub">PDF, JPG, PNG up to 10 MB</div>

                            <input
                                id="fileInput"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                        </div>


                        <label className="sv-lb">Priority</label>

                        {/* <div className="d-flex gap-2 mb-4">
                        <span className="bx bx-blue">☑ App Notification</span>
                        <span className="bx bx-gray">⊕ Add Channel</span>
                    </div> */}
                        <div className="d-flex gap-3 mb-4">

                            <label className="bx">
                                <input
                                    type="radio"
                                    name="priority"
                                    value="high"
                                    checked={priority === "high"}
                                    onChange={(e) => setPriority(e.target.value)}
                                />
                                &nbsp; High
                            </label>

                            <label className="bx">
                                <input
                                    type="radio"
                                    name="priority"
                                    value="medium"
                                    checked={priority === "medium"}
                                    onChange={(e) => setPriority(e.target.value)}
                                />
                                &nbsp; Medium
                            </label>

                            <label className="bx">
                                <input
                                    type="radio"
                                    name="priority"
                                    value="low"
                                    checked={priority === "low"}
                                    onChange={(e) => setPriority(e.target.value)}
                                />
                                &nbsp; Low
                            </label>
                        </div>
                        <div className="d-flex gap-2 justify-content-end">
                            <button className="btn-ac" onClick={CreateComplaint}>Create Complaints</button>
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

        </>

    );


}

export default CreateComplaints