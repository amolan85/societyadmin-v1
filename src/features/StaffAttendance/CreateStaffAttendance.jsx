import React, { useState, useEffect } from 'react'
import { Badge } from '../../components/Common/ReusableFunction';
import "../../styles/Broadcast.css"
import { GetSessionData } from '../../utils/SessionManagement';
import { CreateBroadcastApi, getBroadcastByIdApi, UpdateBroadcastApi } from '../../services/BroadcastApi';
import { createComplaintsApi } from '../../services/ComplaintsApi';
import { createStaffApi, getStaffByIdApi, UpdateStaffApi } from '../../services/StaffAttendanceApi';
import { toast } from "react-toastify";

const CreateStaffAttendance = ({ setActive, staffId }) => {
    const [role, setRole] = useState("security");
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [mobileNo, setMobileNo] = useState("")
    const [emailId, setEmailId] = useState("")
    const [channel, setChannel] = useState("")
    const [salary, setSalary] = useState("")
    const [joiningDate, setJoiningDate] = useState("")
    const [societyId, setSocietyId] = useState("")
    const [errors, setErrors] = useState({})
    const [sId, setSId] = useState("")
    const [errorText, setErrorText] = useState("")

    const tabs = [
        { id: "Security", icon: "📢", value: "security" },
        { id: "Housekeeping", icon: "⚠️", value: "housekeeping" },
        { id: "Manager", icon: "📄", value: "manager" },
        { id: "Electrician", icon: "📅", value: "electrician" },
        { id: "Plumber", icon: "📅", value: "plumber" },
        { id: "Other", icon: "📅", value: "other" },
    ];

    useEffect(() => {
        SessionData()
    }, [])

    useEffect(() => {
        if (staffId) {
            StffById();
        }
    }, [staffId]);

    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)
    }

    const StffById = async () => {
        const data = await getStaffByIdApi(staffId)
        console.log(data)
        setFirstName(data.first_name)
        setLastName(data.last_name)
        setEmailId(data.email)
        setMobileNo(data.mobile)
        setSalary(data.salary)
        setJoiningDate(data.joining_date)
        setSId(data.staff_id)
    }

    const validateForm = () => {
        let errors = {};

        if (!firstName) {
            errors.firstName = "required";
        }

        if (!lastName) {
            errors.lastName = "required";
        }
        if (!emailId) {
            errors.emailId = "required";
        } else if (!/\S+@\S+\.\S+/.test(emailId)) {
            errors.emailId = "Invalid email";
        }


        if (!mobileNo) {
            errors.mobileNo = "required";
        } else if (!/^[0-9]{10}$/.test(mobileNo)) {
            errors.mobileNo = "Invalid mobile no.";
        }
        // else {
        //     errors.mobileNo = "";
        // }

        if (!joiningDate) {
            errors.joiningDate = "required";
        }

        return errors;
    };

    const CreateStaff = async () => {
        try {
            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
            if (sId) {
                const data = await UpdateStaffApi(
                    sId,
                    firstName,
                    lastName,
                    emailId,
                    mobileNo,
                    role,
                    salary,
                    joiningDate
                );
                toast.success("Staff updated successfully");
                setActive("staff");
            }
            else {
                const data = await createStaffApi(
                    societyId,
                    firstName,
                    lastName,
                    emailId,
                    mobileNo,
                    role,
                    salary,
                    joiningDate
                );
                toast.success("Staff created successfully");
                setActive("staff");
            }
        } catch (error) {
            console.log(error);
            toast.error(error);
            setErrorText(error
            );


        }
    };

    return (
        <div className="pg row g-4 bc-wrap">
            {/* LEFT */}
            <div className="col-12 col-lg-8">
                <div className="sv-card text-start">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="bc-title">{sId ? "Update" : "Create"} Staff Attendance</h5>
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => setActive("staff")}
                        >
                            Back
                        </button>
                    </div>
                    <div className="NoticeBoardTabs mt-2">
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setRole(t.value)}
                                className={`NoticeBoardTabs-btn ${role === t.value ? "active" : ""}`}
                            >
                                {t.icon} {t.id}
                            </button>
                        ))}
                    </div>
                    <div className='d-flex'>
                        <label className="sv-lb">First Name <span className='text-danger'>*</span></label>
                        {errors.firstName && <span className='text-danger mx-2 '>{errors.firstName}</span>}
                    </div>

                    <input className={`sv-in mb-3 ${errors.firstName ? "error-input" : ""}`} placeholder="Enter first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} />


                    <div className='d-flex'>
                        <label className="sv-lb">Last Name <span className='text-danger'>*</span></label>
                        {errors.lastName && <span className='text-danger mx-2 '>{errors.lastName}</span>}
                    </div>

                    <input className={`sv-in mb-3 ${errors.lastName ? "error-input" : ""}`} placeholder="Enter last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)} />


                    <div className='d-flex'>
                        <label className="sv-lb">Email Id<span className='text-danger'>*</span></label>
                        {errors.emailId && <span className='text-danger mx-2 '>{errors.emailId}</span>}
                    </div>

                    <input className={`sv-in mb-3 ${errors.emailId ? "error-input" : ""}`} placeholder="Enter email id"
                        value={emailId}
                        onChange={(e) => setEmailId(e.target.value)} />



                    <div className='d-flex'>
                        <label className="sv-lb">Mobile No<span className='text-danger'>*</span></label>
                        {errors.mobileNo && <span className='text-danger mx-2 '>{errors.mobileNo}</span>}
                    </div>

                    <input className={`sv-in mb-3 ${errors.mobileNo ? "error-input" : ""}`} placeholder="Enter mobile no."
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)} />


                    <div className='d-flex'>
                        <label className="sv-lb">Salary</label>
                        {errors.salary && <span className='text-danger mx-2 '>{errors.salary}</span>}
                    </div>

                    <input className={`sv-in mb-3 ${errors.salary ? "error-input" : ""}`} placeholder="Enter salary"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)} />


                    <div className='d-flex'>
                        <label className="sv-lb">Joining Date<span className='text-danger'>*</span></label>
                        {errors.joiningDate && <span className='text-danger mx-2 '>{errors.joiningDate}</span>}
                    </div>

                    <input className={`sv-in mb-3 ${errors.joiningDate ? "error-input" : ""}`} placeholder="Enter salary"
                        type='date'
                        value={joiningDate}
                        onChange={(e) => setJoiningDate(e.target.value)} />

                    {errorText && <h6 className='text-danger'>{errorText}</h6>}

                    <div className="d-flex gap-2 justify-content-end">

                        <button className="btn-ac" onClick={CreateStaff}>{sId ? "Update" : "Create"}</button>
                    </div>

                </div>
            </div>

            {/* RIGHT */}
            <div className="col-12 col-lg-4">

                {/* Notifications */}
                <div className="sv-card mb-3">
                    <h6 className="bc-side-title text-start">Notifications</h6>

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
                    <h6 className="bc-side-title text-start">Quick Actions</h6>

                    {[["➕", "New Notice", "#dbeafe"], ["📊", "Create Poll", "#ffedd5"], ["📄", "Issue NOC", "#ede9fe"]].map(([ic, lb, bg]) => (
                        <button key={lb} className="qa mb-2">
                            <div className="qa-ico" style={{ background: bg }}>{ic}</div>
                            <span className="bc-qa-text">{lb}</span>
                        </button>
                    ))}
                </div>

                {/* Recent Communications */}
                <div className="sv-card">
                    <h6 className="bc-side-title text-start">Recent Communications</h6>

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

export default CreateStaffAttendance