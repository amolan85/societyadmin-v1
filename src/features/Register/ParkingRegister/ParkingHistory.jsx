import { useState, useEffect } from 'react'
import "../../../styles/AddMember.css"
import "../../../styles/Parking.css"
import { Badge, Pagination } from '../../../components/Common/ReusableFunction';
import { FiCalendar, FiFilter, FiSearch, FiCheckCircle, FiXCircle, FiRefreshCw, FiEdit, } from 'react-icons/fi';
import { FaCar } from "react-icons/fa";
import { BiImport } from 'react-icons/bi';


const ParkingHistory = ({ setActive, slotId, slotData }) => {
    const [societyId, setSocietyId] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [profileUrl, setProfileUrl] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [exportModal, setExportModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    //const historyData = slotData?.history || [];
    // useEffect(() => { SessionData(); }, []);
    useEffect(() => {
        setFilteredData(slotData?.history || []);
    }, [slotData]);

    useEffect(() => {
        handleSearch();
    }, [statusFilter, startDate, endDate]);
    // const SessionData = async () => {
    //     const data = await GetSessionData();
    //     const flats = data.data.flats[0];
    //     setSocietyId(flats.society_id);
    // };

    // const loadHistory = async () => {
    //     try {
    //         setLoading(true);
    //         const res = await GetParkingSlotHistoryApi(slotId, page, limit);
    //         console.log("History response:", res);
    //         setHistoryData(res?.history || []);
    //         setTotalPages(res?.total_pages || 1);
    //     } catch (e) {
    //         console.error("Failed to load history", e);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleSearch = () => {
        let data = slotData?.history || [];

        // Search filter
        if (search.trim()) {
            const lower = search.toLowerCase();
            data = data.filter(s =>
                s.action?.toLowerCase().includes(lower) ||
                s.remarks?.toLowerCase().includes(lower) ||
                s.user_name?.toLowerCase().includes(lower) ||
                s.allocated_by_name?.toLowerCase().includes(lower)
            );
        }

        // Status filter
        if (statusFilter) {
            data = data.filter(s => s.action === statusFilter);
        }

        // Date range filter
        if (startDate) {
            data = data.filter(s => new Date(s.created_at) >= new Date(startDate));
        }
        if (endDate) {
            data = data.filter(s => new Date(s.created_at) <= new Date(endDate + "T23:59:59"));
        }

        setFilteredData(data);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };
    const handlePageChange = (value) => { setPage(value); };
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

                {/* <div className="d-flex justify-content-between align-items-center mb-4 text-start">
                    <div className="col-12 col-md-4 col-lg-3 position-relative">
                        <span
                            style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#aaa", cursor: "pointer" }}
                            onClick={handleSearch}   // ← add karo
                        >
                            <FiSearch size={16} />
                        </span>

                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="Search by slot no, vehicle or owner..."
                            value={search}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearch(value);

                                // Jab search clear ho to full data wapas show karo
                                if (!value.trim()) {
                                    setFilteredData(slotData?.history || []);
                                }
                            }}
                            onKeyDown={handleSearchKeyDown}   // ← add karo
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

                </div> */}
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">

                    {/* Left — Back button */}
                    <button className="btn btn-primary btn-sm" onClick={() => setActive("parkingDetails")}>
                        Back
                    </button>

                    {/* Right — Search + Export */}
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="form-control form-control-sm"
                            value={search}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearch(value);
                                if (!value.trim()) {
                                    // Search clear hone par baki filters apply rehne chahiye
                                    let data = slotData?.history || [];
                                    if (statusFilter) data = data.filter(s => s.action === statusFilter);
                                    if (startDate) data = data.filter(s => new Date(s.created_at) >= new Date(startDate));
                                    if (endDate) data = data.filter(s => new Date(s.created_at) <= new Date(endDate + "T23:59:59"));
                                    setFilteredData(data);
                                }
                            }}
                            onKeyDown={handleSearchKeyDown}
                            style={{ width: 200 }}
                        />
                        <button className="btn btn-primary btn-sm" onClick={handleSearch}>
                            <FiSearch size={14} />
                        </button>
                    </div>

                </div>

                {/* Filters row */}
                <div className="row mb-3 g-2">
                    <div className="col-md-4">
                        <select
                            className="form-select form-select-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="allocated">Allocated</option>
                            <option value="deallocated">Deallocated</option>
                            <option value="status_changed">Status Changed</option>
                            <option value="updated">Updated</option>
                            <option value="visitor_allocated">Visitor Allocated</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
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
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            No history available
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((s, i) => (
                                        <tr className="text-start" key={i}>
                                            {/* ACTIVITY */}
                                            <td>
                                                <div className="d-flex align-items-start gap-3">
                                                    <div
                                                        className="ph-icon"
                                                        style={{
                                                            background:
                                                                s.action === "allocated"
                                                                    ? "#dcfce7"
                                                                    : s.action === "deallocated"
                                                                        ? "#fee2e2"
                                                                        : s.action === "status_changed"
                                                                            ? "#dbeafe"
                                                                            : s.action === "updated"
                                                                                ? "#fef3c7"
                                                                                : s.action === "visitor_allocated"
                                                                                    ? "#ede9fe"
                                                                                    : "#f3f4f6",

                                                            color:
                                                                s.action === "allocated"
                                                                    ? "#16a34a"
                                                                    : s.action === "deallocated"
                                                                        ? "#dc2626"
                                                                        : s.action === "status_changed"
                                                                            ? "#2563eb"
                                                                            : s.action === "updated"
                                                                                ? "#d97706"
                                                                                : s.action === "visitor_allocated"
                                                                                    ? "#7c3aed"
                                                                                    : "#6b7280"
                                                        }}
                                                    >
                                                        {s.action === "allocated" && <FiCheckCircle size={18} />}
                                                        {s.action === "deallocated" && <FiXCircle size={18} />}
                                                        {s.action === "status_changed" && <FiRefreshCw size={18} />}
                                                        {s.action === "updated" && <FiEdit size={18} />}
                                                        {s.action === "visitor_allocated" && <FaCar size={18} />}
                                                    </div>
                                                    <div>
                                                        <div className="fw-semibold text-dark text-capitalize">
                                                            {s.action?.replace(/_/g, " ")}
                                                        </div>
                                                        <small className="text-muted">ID: {s.allocated_by_name}</small>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* DATE & TIME */}
                                            <td>
                                                <div className="fw-semibold text-dark">
                                                    {s.created_at
                                                        ? new Date(s.created_at).toLocaleDateString("en-IN", {
                                                            day: "2-digit", month: "short", year: "numeric"
                                                        })
                                                        : "—"}
                                                </div>
                                                <small className="text-muted">
                                                    {s.created_at
                                                        ? new Date(s.created_at).toLocaleTimeString("en-IN", {
                                                            hour: "2-digit", minute: "2-digit", hour12: true
                                                        })
                                                        : ""}
                                                </small>
                                            </td>

                                            {/* DESCRIPTION */}
                                            <td className="text-muted" style={{ maxWidth: "260px" }}>
                                                {s.remarks || "—"}
                                            </td>

                                            {/* PERFORMED BY */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <img
                                                        src={profileUrl || "../src/assets/profile.png"}
                                                        className="rounded-circle border"
                                                        width="40"
                                                        height="40"
                                                        alt="profile"
                                                    />
                                                    <span className="fw-semibold text-dark">
                                                        {s.performed_by || `${s.user_name}` || "—"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* STATUS */}
                                            <td>
                                                <Badge
                                                    label={s.action?.replace(/_/g, " ")}
                                                    c={
                                                        s.action === "allocated" ? "green"
                                                            : s.action === "deallocated" ? "red"
                                                                : s.action === "status_changed" ? "blue"
                                                                    : "grey"
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer + Pagination */}
                    <div className="d-flex justify-content-between align-items-center px-3 py-2 border-top">
                        <small className="text-muted">
                            Showing {filteredData.length > 0 ? `1-${filteredData.length}` : "0"} of {filteredData.length} activities
                        </small>
                        <Pagination
                            page={page}
                            total={totalPages}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>


        </>
    );
}

export default ParkingHistory