import React, { useState, useEffect } from 'react'
import { Badge } from '../../components/Common/ReusableFunction';
import "../../styles/Broadcast.css"
import { GetSessionData } from '../../utils/SessionManagement';
import { CreateBroadcastApi } from '../../services/BroadcastApi';
import { CreatePollApi } from '../../services/PollApi';
import { toast } from "react-toastify";

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
    const [errorText, setErrorText] = useState("")

    const tabs = [
        { id: "Announcement", icon: "📢" },
        { id: "Emergency", icon: "⚠️" },
        { id: "Circular", icon: "📄" },
        { id: "Event", icon: "📅" },
    ];

    // Load session data on component mount for get session data
    useEffect(() => {
        SessionData()
    }, [])

    //function for session data
    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)
        setUserId(data.data.user_id)
    }

    //handle change for change
    const handleOptionChange = (index, value) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    //get date time 
    const getDateTime = (date) => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        return `${date} ${hours}:${minutes}:${seconds}`;
    };


    //validation form 
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

    //function for submit poll
    const SubmitPoll = async () => {
        try {

            const validationErrors = validateForm();

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            const data = await CreatePollApi(
                societyId,
                userId,
                title,
                description,
                options,
                getDateTime(startDate),
                getDateTime(endDate)
            );

            toast.success("Poll created successfully!")

        } catch (error) {

            console.log(error);
            setErrorText(error)
        }
    };


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

                    {errorText && <h6 className='text-danger'>{errorText}</h6>}
                    <div className="d-flex gap-2 justify-content-end">
                        <button className="btn-ac" onClick={SubmitPoll}>Create Poll</button>
                    </div>

                </div>
            </div>

            {/* RIGHT */}
            <div className="col-12 col-lg-4">

                {/* Notifications */}
                <div className="sv-card mb-3">
                    <h6 className="bc-side-title text-start">Member View Preview</h6>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0 text-start">Proposal for New Gym Equipment</h6>

                        <Badge label="Live" c="green" />
                    </div>

                    <p className='text-muted text-start'>Provide details about what members are voting...<br />This text will show the description you enter.</p>
                    <button className="vote-btn mb-2 text-start">
                        Yes, I approve
                    </button>

                    <button className="vote-btn text-start">
                        No, I disapprove
                    </button>


                    <div className="text-end text-secondary small mt-2">
                        Voting ends in 3 days
                    </div>
                </div>

                {/* Templates*/}
                <div className="sv-card ">
                    <h6 className="fw-bold  text-start">Templates</h6>


                    <div className="template-card d-flex align-items-center justify-content-between">
                        <div className="d-flex gap-3">
                            <div className="template-icon blue-bg">
                                <i className="bi bi-file-earmark-text"></i>
                            </div>

                            <div>
                                <div className="fw-semibold text-start">AGM Standard Agenda</div>
                                <small className="text-secondary d-block text-start">
                                    Pre-filled common AGM items
                                </small>
                            </div>
                        </div>

                        <i className="bi bi-chevron-right text-secondary"></i>
                    </div>


                    <div className="template-card d-flex align-items-center justify-content-between">
                        <div className="d-flex gap-3">
                            <div className="template-icon green-bg">
                                <i className="bi bi-cash-stack"></i>
                            </div>

                            <div>
                                <div className="fw-semibold text-start">Expense Approval</div>
                                <small className="text-secondary d-block text-start">
                                    For repairs  ₹ 50,000
                                </small>
                            </div>
                        </div>

                        <i className="bi bi-chevron-right text-secondary"></i>
                    </div>


                    <div className="template-card d-flex align-items-center justify-content-between">
                        <div className="d-flex gap-3">
                            <div className="template-icon pink-bg">
                                <i className="bi bi-calendar-event"></i>
                            </div>

                            <div>
                                <div className="fw-semibold text-start">Event Date Selection</div>
                                <small className="text-secondary d-block text-start">
                                    Find best time for events
                                </small>
                            </div>
                        </div>

                        <i className="bi bi-chevron-right text-secondary"></i>
                    </div>
                </div>
                {/* Voting Rules */}
                <div className="sv-card mt-2">
                    <div className="voting-rule">
                        <div className="d-flex gap-2">
                            <i className="bi bi-info-circle text-primary"></i>

                            <div>
                                <div className="fw-semibold text-primary mb-1 text-start">
                                    Voting Rules
                                </div>

                                <small className="text-primary text-start d-block">
                                    Note that for AGM related matters, the Society by-laws
                                    mandate "One Vote per Flat" system to be legally valid.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );


}

export default CreatePoll