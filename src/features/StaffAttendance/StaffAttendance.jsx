import React, { useState, useEffect } from 'react'
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import "../../styles/StaffAttendance.css"
import { getStaffAttendanceApi } from './StaffAttendanceApi';

const StaffAttendance = () => {
    const [page, setPage] = useState(1);
    const [allStaff, setAllStaff] = useState([])
    const all = [
        { name: "Ramesh Gupta", role: "Security Guard", shift: "Morning", st: "Present", sc: "green", time: "08:02 AM" },
        { name: "Suresh Patil", role: "Housekeeping", shift: "Morning", st: "Present", sc: "green", time: "08:15 AM" },
        { name: "Kavita Singh", role: "Receptionist", shift: "Morning", st: "Late", sc: "orange", time: "09:32 AM" },
        { name: "Mohan Nair", role: "Security Guard", shift: "Evening", st: "Absent", sc: "red", time: "—" },
        { name: "Priya Verma", role: "Housekeeping", shift: "Morning", st: "Present", sc: "green", time: "07:55 AM" },
        { name: "Ajay Sharma", role: "Plumber", shift: "Morning", st: "Present", sc: "green", time: "08:30 AM" },
        { name: "Ritu Mehta", role: "Admin Staff", shift: "Morning", st: "Present", sc: "green", time: "09:01 AM" },
        { name: "Deepak Joshi", role: "Security Guard", shift: "Night", st: "Present", sc: "green", time: "10:00 PM" },
        { name: "Sunita Das", role: "Housekeeping", shift: "Morning", st: "Late", sc: "orange", time: "09:45 AM" },
        { name: "Vikas Rao", role: "Maintenance", shift: "Morning", st: "Absent", sc: "red", time: "—" },
    ];

    useEffect(() => {
        getStaff()
    }, [])

    //function for get staff
    const getStaff = async () => {
        const data = await getStaffAttendanceApi()
        setAllStaff(data)
    }

    const per = 5, total = Math.ceil(all.length / per);
    const rows = all.slice((page - 1) * per, page * per);

    // const per = 5, total = Math.ceil(allStaff.length / per);
    // const rows = allStaff.slice((page - 1) * per, page * per);


    return (

        <div className="pg sa-wrap">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h4 className="sa-title">Staff Attendance</h4>
                <div className="d-flex gap-2">
                    <input
                        type="date"
                        className="sv-in sa-date"
                        defaultValue="2025-12-14"
                    />
                    <button className="btn-ol">⬇ Export</button>
                </div>
            </div>

            {/* Stats */}
            <div className="row g-3 mb-4">
                {[
                    ["48", "Present", "tile-grn"],
                    ["2", "Absent", "tile-red"],
                    ["3", "Late", "tile-org"],
                    ["50", "Total Staff", "tile-blu"]
                ].map(([v, l, cls]) => (
                    <div className="col-6 col-md-3" key={l}>
                        <div className={`tile ${cls}`}>
                            <div className="tile-val">{v}</div>
                            <div className="tile-lbl">{l}</div>
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
                                {["Name", "Role", "Shift", "Status", "Time In"]
                                    .map(h => <th key={h}>{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((s, i) => (
                                <tr className="text-start" key={i}>

                                    <td className="sa-name">{s.name}</td>

                                    <td className="sa-muted">{s.role}</td>

                                    <td>
                                        <Badge label={s.shift} c="gray" />
                                    </td>

                                    <td>
                                        <Badge label={s.st} c={s.sc} />
                                    </td>

                                    <td className={s.st === "Absent" ? "sa-muted" : "sa-time"}>
                                        {s.time}
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