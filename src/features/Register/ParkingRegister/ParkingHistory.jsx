import  { useState, useEffect } from 'react'
import "../../../styles/AddMember.css"
// import memberDetails from './MemberDetails';
import { Badge, Pagination } from '../../../components/Common/ReusableFunction';
import { GetSessionData } from '../../../utils/SessionManagement';
import { AddMemberApi, getMembersApi } from '../../../services/AddMemberApi';
import { toast } from "react-toastify";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiCalendar, FiFilter, FiSearch } from 'react-icons/fi';
import { BiImport } from 'react-icons/bi';


const ParkingHistory = ({ setActive }) => {
    const [societyId, setSocietyId] = useState("")
    const [page, setPage] = useState(1);
    const [exportModal, setExportModal] = useState(false)
    const [search, setSearch] = useState("");

    const parkingHistoryData = [
        {
            "id": 1,
            "activity": "Sticker Renewed",
            "activityId": "#EV-2024-001",
            "dateTime": "Jan 10, 2025 09:30 AM",
            "description": "Renewed annual parking sticker for Tesla Model 3",
            "performedBy": "Admin User",
            "status": "Completed"
        },
        {
            "id": 2,
            "activity": "Vehicle Updated",
            "activityId": "Plate Change",
            "dateTime": "Nov 05, 2025 02:15 PM",
            "description": "Updated vehicle details from BMW 3 Series to Tesla Model 3",
            "performedBy": "Sarah Williams",
            "status": "Approved"
        },
        {
            "id": 3,
            "activity": "Wrong Parking",
            "activityId": "Complaint #C-402",
            "dateTime": "Aug 12, 2025 06:45 PM",
            "description": "Guest vehicle parked in reserved slot P-B05",
            "performedBy": "Security",
            "status": "Resolved"
        },
        {
            "id": 4,
            "activity": "Allocation Created",
            "activityId": "New Allocation",
            "dateTime": "Jan 15, 2025 10:00 AM",
            "description": "Slot P-B05 allocated to Unit B-204 (Sarah Williams)",
            "performedBy": "Admin User",
            "status": "Completed"
        }
    ]



    useEffect(() => {
        SessionData()

    }, [])

    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)

    }

    // const total = Math.ceil(totalCount / limit);
    const total = 1;
    // const per = limit, total = Math.ceil(filteredData.length / per);
    // const rows = filteredData.slice((page - 1) * per, page * per);

    return (
        <>
            {
                <style>
                    {`
                .ph-icon {
                 width: 42px;
                 height: 42px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                flex-shrink: 0;
                 background: #f0f0f0;
}   `}
                </style>
            }
            <div className="pg cp-wrap">

                <div className="d-flex justify-content-between align-items-center mb-4 text-start">
                    <div className="col-12 col-md-4 col-lg-3 position-relative">
                        <span
                            style={{
                                position: "absolute",
                                left: "15px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#aaa"
                            }}
                        >
                            <FiSearch size={16} />
                        </span>

                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="Search by slot no, vehicle or owner..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: "35px" }}
                        />
                    </div>
                    <div className='d-flex'>
                        <button
                            className="btn btn-sm filter-btn d-flex align-items-center gap-2 bg-white"
                            data-bs-toggle="dropdown"
                        >
                            <FiCalendar size={14} />

                            Date Range
                        </button>

                        <button
                            className="btn btn-sm filter-btn d-flex align-items-center gap-2 bg-white ms-2"
                            data-bs-toggle="dropdown"
                        >
                            <FiFilter size={14} />

                            Filter Type
                        </button>
                        <button className="btn-ol ms-2" onClick={() => setExportModal(true)}><BiImport /> Export</button>
                     <button className="btn btn-primary btn-sm ms-2" onClick={() => setActive("parkingDetails")}>Back</button>
                    </div>

                </div>

                <div className="sv-card p-0 overflow-hidden">
                    <div className="sa-table-wrap">
                        {/* <table className="sv-tbl">
                            <thead>
                                <tr>
                                    {
                                        [" ACTIVITY", "DATE & TIME", "DESCRIPTION", "PERFORMED BY", "STATUS"]
                                            .map(h => <th key={h}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {parkingHistoryData.map((s, i) => (
                                    <tr className="text-start" key={i}>
                                        <td className="sa-name">{s.activity}</td>
                                        <td className="sa-name">{s.dateTime}</td>
                                        <td className="sa-name">{s.description}</td>
                                        <td className="sa-name">{s.performedBy}</td>
                                        <td ><Badge label={s.status} c={s.status === "Completed" ? "green" : s.status === "Approved" ? "pink" : "blue"} /> </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> */}
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    {["ACTIVITY", "DATE & TIME", "DESCRIPTION", "PERFORMED BY", "STATUS"]
                                        .map((h) => (
                                            <th key={h}>{h}</th>
                                        ))}
                                </tr>
                            </thead>

                            <tbody>
                                {parkingHistoryData.map((s, i) => (
                                    <tr className="text-start" key={i}>

                                        {/* ACTIVITY */}
                                        <td>
                                            <div className="d-flex align-items-start gap-3">

                                                <div
                                                    className={`ph-icon 
                                ${s.status === "Completed" ? "ph-green" : ""}
                                ${s.status === "Approved" ? "ph-pink" : ""}
                                ${s.status === "Resolved" ? "ph-blue" : ""}
                            `}
                                                >
                                                    {s.activity === "Sticker Renewed" && "⭐"}
                                                    {s.activity === "Vehicle Updated" && "🚗"}
                                                    {s.activity === "Wrong Parking" && "⚠️"}
                                                    {s.activity === "Allocation Created" && "✔️"}
                                                </div>

                                                <div>
                                                    <div className="fw-semibold text-dark">
                                                        {s.activity}
                                                    </div>

                                                    <small className="text-muted">
                                                        ID : {s.activityId}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>

                                        {/* DATE & TIME */}
                                        <td>
                                            <div className="fw-semibold text-dark">
                                                {s.dateTime.split(" ")[0]}{" "}
                                                {s.dateTime.split(" ")[1]}{" "}
                                                {s.dateTime.split(" ")[2]}
                                            </div>

                                            <small className="text-muted">
                                                {s.dateTime.split(" ").slice(3).join(" ")}
                                            </small>
                                        </td>

                                        {/* DESCRIPTION */}
                                        <td className="text-muted" style={{ maxWidth: "260px" }}>
                                            {s.description}
                                        </td>

                                        {/* PERFORMED BY */}
                                        <td>
                                            <div className="d-flex align-items-center gap-2">

                                                <img
                                                    src={`https://i.pravatar.cc/40?img=${i + 12}`}
                                                    alt=""
                                                    width={34}
                                                    height={34}
                                                    className="rounded-circle"
                                                />

                                                <span className="fw-semibold text-dark">
                                                    {s.performedBy}
                                                </span>
                                            </div>
                                        </td>

                                        {/* STATUS */}
                                        <td>
                                            <Badge
                                                label={s.status}
                                                c={
                                                    s.status === "Completed"
                                                        ? "green"
                                                        : s.status === "Approved"
                                                            ? "pink"
                                                            : s.status === "Resolved"
                                                                ? "blue"
                                                                : "grey"
                                                }
                                            />
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
                        // onChange={handlePageChange}
                    />
                </div>
            </div>


        </>
    );
}

export default ParkingHistory