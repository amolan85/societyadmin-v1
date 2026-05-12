import React, { useState, useEffect } from 'react'
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import "../../styles/StaffAttendance.css"
import { getStaffAttendanceApi } from '../../services/StaffAttendanceApi';
import { GetSessionData } from '../../utils/SessionManagement';
import CreateStaff from './CreateStaffAttendance';

const StaffAttendance = ({ setActive, setStaffId }) => {
    const [page, setPage] = useState(1);
    const [societyId, setSocietyId] = useState("")
    const [allStaff, setAllStaff] = useState([])
    const [date, setDate] = useState(new Date().toISOString().split("T")[0])
    const [totalStaff, setTotalStaff] = useState("")
    const [present, setPresent] = useState("")
    const [absent, setAbsent] = useState("")
    const [late, setLate] = useState("")

    // const all = [
    //     { name: "Ramesh Gupta", role: "Security Guard", shift: "Morning", st: "Present", sc: "green", time: "08:02 AM" },
    //     { name: "Suresh Patil", role: "Housekeeping", shift: "Morning", st: "Present", sc: "green", time: "08:15 AM" },
    //     { name: "Kavita Singh", role: "Receptionist", shift: "Morning", st: "Late", sc: "orange", time: "09:32 AM" },
    //     { name: "Mohan Nair", role: "Security Guard", shift: "Evening", st: "Absent", sc: "red", time: "—" },
    //     { name: "Priya Verma", role: "Housekeeping", shift: "Morning", st: "Present", sc: "green", time: "07:55 AM" },
    //     { name: "Ajay Sharma", role: "Plumber", shift: "Morning", st: "Present", sc: "green", time: "08:30 AM" },
    //     { name: "Ritu Mehta", role: "Admin Staff", shift: "Morning", st: "Present", sc: "green", time: "09:01 AM" },
    //     { name: "Deepak Joshi", role: "Security Guard", shift: "Night", st: "Present", sc: "green", time: "10:00 PM" },
    //     { name: "Sunita Das", role: "Housekeeping", shift: "Morning", st: "Late", sc: "orange", time: "09:45 AM" },
    //     { name: "Vikas Rao", role: "Maintenance", shift: "Morning", st: "Absent", sc: "red", time: "—" },
    // ];

    useEffect(() => {
        SessionData()
    }, [])

    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)
        getStaff(flats.society_id)

    }

    //function for get staff
    const getStaff = async (societyId) => {
        const data = await getStaffAttendanceApi(societyId, date)
        console.log(data)
        setAllStaff(data.list)
        setTotalStaff(data.count)
        setPresent(data.summary.present)
        setAbsent(data.summary.absent)
    }

    const per = 5, total = Math.ceil(allStaff.length / per);
    const rows = allStaff.slice((page - 1) * per, page * per);

    const dateHandleChange = async (e) => {
        setDate(e.target.value)
        const data = await getStaffAttendanceApi(societyId, e.target.value)
        console.log(data)
    }

    return (

        <div className="pg sa-wrap">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h4 className="sa-title">Staff Attendance</h4>

                <div className="d-flex gap-2">
                    <button className="btn  btn-primary" onClick={() => setActive("createStaff")}>Create</button>
                    <input
                        type="date"
                        className="sv-in sa-date"
                        value={date}
                        onChange={dateHandleChange}
                    />
                    <button className="btn-ol">⬇ Export</button>
                </div>
            </div>

            {/* Stats */}
            <div className="row g-3 mb-4">
                {[
                    [present, "Present", "tile-grn"],
                    [absent, "Absent", "tile-red"],
                    ["3", "Late", "tile-org"],
                    [totalStaff, "Total Staff", "tile-blu"]
                ].map(([v, l, cls]) => (
                    // <div className="col-6 col-md-3" key={l}>
                    //     <div className={`tile ${cls}`}>
                    //         <div className="tile-val">{v}</div>
                    //         <div className="tile-lbl">{l}</div>
                    //     </div>
                    // </div>
                    <div className="col-6 col-md-3" key={l}>
                        <div className={`tile bg-white ${cls}`}>
                            <div className=" text-start fw-bold">{l}</div>
                            <div className="tile-val text-start mt-1">{v}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="sv-card p-0 overflow-hidden">

                <div className="sa-table-wrap">
                    <table className="sv-tbl">
                        <thead>
                            <tr>
                                {["Name", "Role", "Shift", "Status", "Time In", "Time Out"]
                                    .map(h => <th key={h}>{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((s, i) => (
                                <tr className="text-start" key={i}>

                                    <td className="sa-name">{s.first_name + " " + s.last_name}</td>

                                    <td className="sa-muted">{s.role}</td>

                                    <td>
                                        {/* <Badge label={s.shift} c="gray" /> */}
                                    </td>

                                    <td>
                                        <Badge label={s.status} c={
                                            s.status === "present"
                                                ? "green"
                                                : s.status === "absent"
                                                    ? "red"
                                                    : s.status === "late"
                                                        ? "tile-org"
                                                        : "gray"
                                        } />
                                    </td>
                                    <td className={s.st === "Absent" ? "sa-muted" : "sa-time"}>
                                        {s.check_in}
                                    </td>
                                    <td className={s.st === "Absent" ? "sa-muted" : "sa-time"}>
                                        {s.check_out}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    page={page}
                    total={total}
                    onChange={setPage}
                />

            </div>
        </div>
    );
}

export default StaffAttendance