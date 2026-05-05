// import React from 'react'
// import "../../styles/polls.css"
// import Select from 'react-select'
// import { FiEdit } from "react-icons/fi";

// const CreatePoll = ({ setActive }) => {
//     const options = [
//         { value: 'chocolate', label: 'Chocolate' },
//         { value: 'strawberry', label: 'Strawberry' },
//         { value: 'vanilla', label: 'Vanilla' }
//     ]

//     return (
//         <>
//             <div className='container-fluid'>
//                 <div className="header mt-4">
//                     <h5 className="text-start fw-bold d-flex align-items-center gap-2">
//                         <FiEdit size={18} color='text-primary' />
//                         Create Poll
//                     </h5>
//                 </div>
//                 <div className='poll-details '>
//                     <div className="row">
//                         <div className="col-md-9">
//                             <div className="card px-2">
//                                 <div className="card-body text-start">
//                                     <div className='form-group'>
//                                         <label htmlFor='pollTitle' className="form-label fw-bold">Poll Title</label>
//                                         <input type="text" id="pollTitle" className="form-control" placeholder='Example: Schedule Maintenance of Lift B' />
//                                     </div>
//                                     <div className='form-group mt-3'>
//                                         <label htmlFor='pollCategory' className="form-label fw-bold">Category</label>
//                                         <Select options={options} placeholder="Select Category" />
//                                     </div>
//                                     <div className='form-group mt-3'>
//                                         <label htmlFor='pollDescription' className="form-label fw-bold">Description</label>
//                                         <textarea type="text" id="pollDescription" className="form-control" rows="4" placeholder='Provide details about members are voting for...' />
//                                     </div>
//                                     <div className="form-group mt-3">
//                                         <label className="form-label fw-bold">Attachment</label>

//                                         <div className="upload-box">
//                                             <input
//                                                 type="file"
//                                                 id="pollAttachment"
//                                                 className="file-input"
//                                                 onChange={(e) => console.log(e.target.files[0])}
//                                             />

//                                             <div className="upload-content">
//                                                 <div className="upload-icon">☁️</div>
//                                                 <p>Click to upload supporting documents (PDF, JPG)</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </>
//     )
// }

// export default CreatePoll

import React, { useState, useEffect } from 'react'
import { Badge } from '../../components/Common/ReusableFunction';
import "../../styles/Broadcast.css"
import { GetSessionData } from '../../utils/SessionManagement';
import { CreateBroadcastApi } from '../../services/BroadcastApi';
import { CreatePollApi } from '../../services/PollApi';

const CreatePoll = ({ setActive }) => {
    const [tab, setTab] = useState("Announcement");
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [societyId, setSocietyId] = useState("")
    const [userId, setUserId] = useState("")
    const [options, setOptions] = useState(new Array(4).fill(""));
    const [errors, setErrors] = useState({})

    const tabs = [
        { id: "Announcement", icon: "📢" },
        { id: "Emergency", icon: "⚠️" },
        { id: "Circular", icon: "📄" },
        { id: "Event", icon: "📅" },
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

    const validateForm = () => {
        let errors = {};

        if (!title) {
            errors.title = "required";
        }

        if (!description) {
            errors.description = "required";
        }
        options.forEach((opt, index) => {
            if (!opt || opt.trim() === "") {
                errors[`option_${index}`] = "required";
            }
        });
        if (!startDate) {
            errors.startDate = "required";
        }
        if (!endDate) {
            errors.endDate = "required";
        }
        return errors;
    };

    const SubmitBroadcast = async () => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        }
        else {
            const data = await CreatePollApi(societyId, userId, title, description, options, getDateTime(startDate), getDateTime(endDate))
            console.log(data);
        }
    }


    return (
        <div className="pg row g-4 bc-wrap">
            {/* LEFT */}
            <div className="col-12 col-lg-8">
                <div className="sv-card text-start">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="bc-title">Create Poll</h5>
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => setActive("polls")}
                        >
                            Back
                        </button>
                    </div>
                    <div className='d-flex'>
                        <label className="sv-lb">Poll Title <span className='text-danger'>*</span></label>
                        {errors.title && <span className='text-danger mx-2 '>{errors.title}</span>}
                    </div>

                    <input className={`sv-in mb-3 ${errors.title ? "error-input" : ""}`} placeholder="Example: Scheduled Maintenance of Lift B"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} />

                    <div className='d-flex'>
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
                    <h6 className='fw-bold'>Voting Options</h6>
                    <div>
                        {options.map((opt, index) => (
                            <div key={index}>
                                <div className='d-flex'>
                                    <label className="sv-lb mt-2">Option {index + 1} <span className='text-danger'>*</span></label>
                                    {errors[`option_${index}`] && (
                                        <span className='text-danger mx-2'>
                                            {errors[`option_${index}`]}
                                        </span>
                                    )}
                                </div>

                                <input
                                    className={`sv-in mb-2 ${errors[`option_${index}`] ? "error-input" : ""
                                        }`}
                                    placeholder={`Example: Option ${index + 1}`}
                                    value={opt}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="row mt-2">
                        <div className='col-lg-6'>
                            <div className='d-flex'>
                                <label className="sv-lb">Start Date <span className='text-danger'>*</span></label>
                                {errors.startDate && <span className='text-danger mx-2 '>{errors.startDate}</span>}

                            </div>

                            <input className={`sv-in mb-3 ${errors.startDate ? "error-input" : ""}`} type='date'

                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className='col-lg-6'>
                            <div className='d-flex'>
                                <label className="sv-lb">End Date <span className='text-danger'>*</span></label>
                                {errors.endDate && <span className='text-danger mx-2 '>{errors.endDate}</span>}

                            </div>

                            <input className={`sv-in mb-3 ${errors.endDate ? "error-input" : ""}`} type='date'

                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="d-flex gap-2 justify-content-end">
                        <button className="btn-ac" onClick={SubmitBroadcast}>Create Poll</button>
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

export default CreatePoll