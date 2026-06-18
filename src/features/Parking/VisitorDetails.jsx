import { useState, useEffect } from 'react'
import { FaBalanceScale, FaCar, FaSwimmingPool, FaUsers } from 'react-icons/fa';
import { FiAlertTriangle, FiArrowLeft, FiCheckCircle, FiDownload, FiEdit, FiExternalLink, FiPhone, FiPrinter, FiSlash, FiStopCircle } from "react-icons/fi";
import { CgFileDocument } from 'react-icons/cg';
import { BiHistory, BiLocationPlus } from 'react-icons/bi';
import "../../styles/Visitor.css";
import ResolveViolationModal from './ResolveViolationModal';
import WarningNotificationModal from './WarningNotificationModal';
import ViewDocumentModal from './ViewDocumentModal';
import CheckOutVisitorModal from './CheckOutVisitorModal';
import ExtendTimeModal from './ExtendTimeModal';
import { BsFillChatSquareFill, BsHouseDoor, BsInfoCircle } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { getVisitorParkingByIdApi } from "../../services/VisitorParkingApi";
const VisitorDetails = ({ setActive, visitorParkingId, societyId/* memberId, setFlatId */ }) => {

    const [deallocateShow, setDeallocateShow] = useState(false);
    const [showDocument, setShowDocument] = useState(false);
    const [show, setShow] = useState(false)
    const [checkoutShow, setCheckOutShow] = useState(false)
    const [showExtendTime, setShowExtendTime] = useState(false)
    const [notificationShow, setNotificationShow] = useState(false)
    const [extendDuration, setExtendDuration] = useState("")
    const [visitorData, setVisitorData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (societyId && visitorParkingId) {
            fetchVisitorDetails();
        }
    }, [societyId, visitorParkingId]);
    const extendDurationType = [
        { id: "1 Hour", value: "1Hour" },
        { id: "2 Hours", value: "2Hours" },
        { id: "4 Hours", value: "4Hours" },
    ];
    const fetchVisitorDetails = async () => {
        try {
            setLoading(true);
            const data = await getVisitorParkingByIdApi(societyId, visitorParkingId);
            console.log("Visitor Data:", data);
            setVisitorData(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleWarningNotification = () => {
        setNotificationShow(true)
    };
    // ✅ Format: "10:45 AM, Oct 14"
    const formatEntryTime = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            month: "short",
            day: "2-digit",
        });
    };

    // ✅ Calculate: "2h 15m remaining"
    const getTimeRemaining = (allottedAt) => {
        if (!allottedAt) return "-";

        const allotted = new Date(allottedAt);
        const now = new Date();

        const diffMs = now - allotted;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffMs < 0) return "Not started";

        return `${diffHours}h ${diffMins}m elapsed`;
    };
    return (
        <>
            <div className="container-fluid min-vh-100">

                <div className=" mb-4">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center ">
                        <div className="d-flex  gap-3">
                            <div>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    {/* ✅ vehicle_number */}
                                    <h5 className="mb-0 fw-bold">{visitorData?.vehicle_number}</h5>
                                    {/* ✅ status */}
                                    <span className={`badge ${visitorData?.status === "active" ? "bg-success" : "bg-secondary"} text-white`}>
                                        {visitorData?.status === "active" ? "Active Session" : "Released"}
                                    </span>
                                </div>

                                <div className="text-muted text-start small mt-2">
                                    {/* ✅ allotted_at + allocation_id */}
                                    <div className="mb-1">
                                        Checked in today at {visitorData?.allotted_at} • Visitor Pass #{visitorData?.allocation_id}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-3 mt-lg-0">
                            <button className="btn btn-sm btn-ad print-btn"><FiAlertTriangle /> Report Violation</button>
                            <button className="btn btn-sm btn-ad grey-btn" onClick={() => setShowExtendTime(true)}><FiCheckCircle /> Extend Time</button>
                            <button className="btn btn-sm btn-ac btn-primary" onClick={() => setCheckOutShow(true)}><FiLogOut />Check Out</button>
                            <button className="btn btn-sm btn-ac btn-primary" onClick={() => setActive("parkingDashboard")}>Back</button>
                        </div>
                    </div>
                </div>

                <div className="row g-4">

                    {/* Left Section */}
                    <div className="col-lg-8">

                        <div className="card shadow-sm border text-start">
                            <div className="card-header bg-white fw-bold py-3">
                                Session Details
                            </div>

                            <div className="card-body">
                                <div className="row g-4">

                                    <div className="col-md-6">
                                        <small className="text-uppercase text-secondary fw-semibold">
                                            Assigned Slot
                                        </small>
                                        {/* ✅ slot_number + floor */}
                                        <div className="fw-semibold mt-1">
                                            {visitorData?.slot_number} ({visitorData?.floor})
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-uppercase text-secondary fw-semibold">
                                            Vehicle Type
                                        </small>
                                        {/* ✅ vehicle_type */}
                                        <div className="fw-semibold mt-1">
                                            {visitorData?.vehicle_type === "4_wheeler"
                                                ? "4-Wheeler"
                                                : visitorData?.vehicle_type === "2_wheeler"
                                                    ? "2-Wheeler"
                                                    : "-"}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-uppercase text-secondary fw-semibold">
                                            Entry Time
                                        </small>
                                        {/* ✅ allotted_at */}
                                        <div className="fw-semibold mt-1">
                                            {formatEntryTime(visitorData?.allotted_at)}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-uppercase text-secondary fw-semibold">
                                            Time Remaining
                                        </small>
                                        {/* ✅ released_at */}
                                        <div className="fw-semibold text-success mt-1">
                                            {visitorData?.released_at
                                                ? formatEntryTime(visitorData?.released_at)
                                                : getTimeRemaining(visitorData?.allotted_at)}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="alert alert-primary mb-0">
                                            <div className="fw-semibold">
                                                <BsInfoCircle className='me-2' />
                                                Visitor Note
                                            </div>
                                            {/* ✅ remarks */}
                                            <small>
                                                {visitorData?.remarks || "-"}
                                            </small>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Host Information */}
                        <div className="card shadow-sm border mt-4 text-start">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center ">
                                <span className="fw-bold">Host Information</span>
                                <button className="btn btn-link btn-sm text-decoration-none">
                                    View Unit Details
                                </button>
                            </div>

                            <div className="card-body p-0">

                                <div className="d-flex align-items-center p-3 border-bottom">
                                    <div className="house-icon-box me-3">
                                        <BsHouseDoor className="house-icon" />
                                    </div>
                                    <div>
                                        {/* ✅ zone + block + floor */}
                                        <div className="fw-semibold">{visitorData?.zone}</div>
                                        <small className="text-muted">
                                            Block {visitorData?.block} • {visitorData?.floor}
                                        </small>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center p-3">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src='../src/assets/profile.png'
                                            alt="profile"
                                            className="rounded-circle me-3"
                                            width="50"
                                            height="50"
                                        />
                                        <div>
                                            <div className="fw-semibold">-</div>
                                            <small className="text-muted">Primary Owner</small>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="btn btn-light border me-2"><FiPhone /></button>
                                        <button className="btn btn-light border"><BsFillChatSquareFill /></button>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Right Section */}
                    <div className="col-lg-4">

                        <div className="card shadow-sm border text-start">
                            <div className="card-header bg-white fw-bold">
                                Visitor Profile
                            </div>

                            <div className="card-body">

                                <div className="d-flex align-items-center">
                                    <div
                                        className="rounded-circle bg-warning-subtle text-warning fw-bold d-flex align-items-center justify-content-center me-3"
                                        style={{ width: 45, height: 45 }}
                                    >
                                        {/* ✅ visitor_name initials */}
                                        {visitorData?.visitor_name
                                            ? visitorData.visitor_name.split(" ").map(n => n[0]).join("").toUpperCase()
                                            : "?"}
                                    </div>

                                    <div>
                                        {/* ✅ visitor_name */}
                                        <div className="fw-semibold">
                                            {visitorData?.visitor_name || "-"}
                                        </div>
                                        {/* ✅ visitor_mobile */}
                                        <small className="text-muted">
                                            +91 {visitorData?.visitor_mobile || "-"}
                                        </small>
                                    </div>

                                </div>

                                <div className="mt-3">
                                    <small className="text-muted">
                                        Driver License / ID
                                    </small>
                                    {/* ✅ vehicle_number */}
                                    <div className="fw-semibold">
                                        {visitorData?.vehicle_number || "-"}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Activity Log */}
                        <div className="card shadow-sm border mt-4 text-start">
                            <div className="card-header bg-white fw-bold">
                                Activity Log
                            </div>

                            <div className="card-body">
                                <div className="visitor-timeline">

                                    {/* ✅ allotted_at */}
                                    <div className="visitor-timeline-item active">
                                        <h6 className="mb-1">Check In Approved</h6>
                                        <small className="text-muted">
                                            {visitorData?.allotted_at} • {visitorData?.zone}
                                        </small>
                                    </div>

                                    {/* ✅ slot_number */}
                                    <div className="visitor-timeline-item">
                                        <h6 className="mb-1">Host Approval Received</h6>
                                        <small className="text-muted">
                                            {visitorData?.slot_number} • Block {visitorData?.block}
                                        </small>
                                    </div>

                                    {/* ✅ released_at — sirf tab show karo jab released ho */}
                                    {visitorData?.released_at && (
                                        <div className="visitor-timeline-item">
                                            <h6 className="mb-1">Entry Request Created</h6>
                                            <small className="text-muted">
                                                {visitorData?.released_at}
                                            </small>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            <CheckOutVisitorModal
                checkoutShow={checkoutShow}
                setCheckoutShow={setCheckOutShow}
            />

            <ExtendTimeModal
                showExtendTime={showExtendTime}
                setShowExtendTime={setShowExtendTime}
                extendDurationType={extendDurationType}
                extendDuration={extendDuration}
                setExtendDuration={setExtendDuration}
            />
        </>
    )
    // return (
    //     <>
    //         <div className="container-fluid min-vh-100">

    //             <div className=" mb-4">
    //                 <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center ">
    //                     <div className="d-flex  gap-3">
    //                         <div>
    //                             <div className="d-flex align-items-center gap-2 flex-wrap">
    //                                 <h5 className="mb-0 fw-bold">KA-05-MH-2023</h5>
    //                                 <span className="badge bg-success text-white">
    //                                     Active Session
    //                                 </span>
    //                             </div>

    //                             <div className="text-muted text-start small mt-2">
    //                                 <div className="mb-1">
    //                                     Checked in today at 10:45 AM • Visitor Pass #VP-4921
    //                                 </div>

    //                             </div>
    //                         </div>
    //                     </div>

    //                     <div className="d-flex gap-2 mt-3 mt-lg-0">
    //                         <button className="btn btn-sm btn-ad print-btn" /* onClick={() => setActive("parkingRegister")} */><FiAlertTriangle /> Report Violation</button>
    //                         <button className="btn btn-sm btn-ad grey-btn" onClick={() => setShowExtendTime(true)}><FiCheckCircle /> Extend Time</button>

    //                         <button className="btn btn-sm btn-ac  btn-primary" onClick={() => setCheckOutShow(true)}> <FiLogOut />Check Out</button>
    //                         <button className="btn btn-sm btn-ac  btn-primary" onClick={() => setActive("parkingDashboard")}>Back</button>
    //                     </div>
    //                 </div>
    //             </div>

    //             <div className="row g-4">

    //                 {/* Left Section */}
    //                 <div className="col-lg-8">

    //                     <div className="card shadow-sm border text-start">
    //                         <div className="card-header bg-white fw-bold py-3">
    //                             Session Details
    //                         </div>

    //                         <div className="card-body">
    //                             <div className="row g-4">

    //                                 <div className="col-md-6">
    //                                     <small className="text-uppercase text-secondary fw-semibold">
    //                                         Assigned Slot
    //                                     </small>
    //                                     <div className="fw-semibold mt-1">V-12 (Level B1)</div>
    //                                 </div>

    //                                 <div className="col-md-6">
    //                                     <small className="text-uppercase text-secondary fw-semibold">
    //                                         Vehicle Type
    //                                     </small>
    //                                     <div className="fw-semibold mt-1">4-Wheeler (SUV)</div>
    //                                 </div>

    //                                 <div className="col-md-6">
    //                                     <small className="text-uppercase text-secondary fw-semibold">
    //                                         Entry Time
    //                                     </small>
    //                                     <div className="fw-semibold mt-1">
    //                                         10:45 AM, Oct 14
    //                                     </div>
    //                                 </div>

    //                                 <div className="col-md-6">
    //                                     <small className="text-uppercase text-secondary fw-semibold">
    //                                         Time Remaining
    //                                     </small>
    //                                     <div className="fw-semibold text-success mt-1">
    //                                         2h 15m remaining
    //                                     </div>
    //                                 </div>

    //                                 <div className="col-12">
    //                                     <div className="alert alert-primary mb-0">
    //                                         <div className="fw-semibold">
    //                                             {/* <i className="bi bi-info-circle me-2"></i> */}
    //                                             <BsInfoCircle className='me-2' />
    //                                             Visitor Note
    //                                         </div>

    //                                         <small>
    //                                             Family visit. Expected to leave by 4:00 PM.
    //                                         </small>
    //                                     </div>
    //                                 </div>

    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* Host Information */}

    //                     <div className="card shadow-sm border mt-4 text-start">
    //                         <div className="card-header bg-white d-flex justify-content-between align-items-center ">
    //                             <span className="fw-bold">Host Information</span>

    //                             <button className="btn btn-link btn-sm text-decoration-none">
    //                                 View Unit Details
    //                             </button>
    //                         </div>

    //                         <div className="card-body p-0">

    //                             <div className="d-flex align-items-center p-3 border-bottom">
    //                                 {/* <i className="bi bi-house-door fs-3 text-secondary me-3"></i> */}
    //                                 {/* <BsHouseDoor className='text-secondary me-3' /> */}
    //                                 <div className="house-icon-box me-3">
    //                                     <BsHouseDoor className="house-icon" />
    //                                 </div>

    //                                 <div>
    //                                     <div className="fw-semibold">Unit B-402</div>
    //                                     <small className="text-muted">
    //                                         Block B • 4th Floor
    //                                     </small>
    //                                 </div>
    //                             </div>

    //                             <div className="d-flex justify-content-between align-items-center p-3">

    //                                 <div className="d-flex align-items-center">

    //                                     <img
    //                                         src='../src/assets/profile.png'
    //                                         alt="profile"
    //                                         className="rounded-circle me-3"
    //                                         width="50"
    //                                         height="50"
    //                                     />



    //                                     <div>
    //                                         <div className="fw-semibold">
    //                                             Meera Patel
    //                                         </div>

    //                                         <small className="text-muted">
    //                                             Primary Owner
    //                                         </small>
    //                                     </div>
    //                                 </div>

    //                                 <div>
    //                                     <button className="btn btn-light border me-2">
    //                                         {/* <i className="bi bi-telephone"></i> */}
    //                                         <FiPhone />
    //                                     </button>

    //                                     <button className="btn btn-light border">
    //                                         {/* <i className="bi bi-chat"></i> */}
    //                                         <BsFillChatSquareFill />
    //                                     </button>
    //                                 </div>

    //                             </div>

    //                         </div>
    //                     </div>

    //                 </div>

    //                 {/* Right Section */}
    //                 <div className="col-lg-4">

    //                     <div className="card shadow-sm border text-start">
    //                         <div className="card-header bg-white fw-bold">
    //                             Visitor Profile
    //                         </div>

    //                         <div className="card-body">

    //                             <div className="d-flex align-items-center">

    //                                 <div
    //                                     className="rounded-circle bg-warning-subtle text-warning fw-bold d-flex align-items-center justify-content-center me-3"
    //                                     style={{ width: 45, height: 45 }}
    //                                 >
    //                                     RK
    //                                 </div>

    //                                 <div>
    //                                     <div className="fw-semibold">
    //                                         Rahul Kumar
    //                                     </div>

    //                                     <small className="text-muted">
    //                                         +91 98765 43210
    //                                     </small>
    //                                 </div>

    //                             </div>

    //                             <div className="mt-3">
    //                                 <small className="text-muted">
    //                                     Driver License / ID
    //                                 </small>

    //                                 <div className="fw-semibold">
    //                                     DL-142-9988
    //                                 </div>
    //                             </div>

    //                         </div>
    //                     </div>

    //                     {/* Activity Log */}

    //                     <div className="card shadow-sm border mt-4 text-start">
    //                         <div className="card-header bg-white fw-bold">
    //                             Activity Log
    //                         </div>

    //                         <div className="card-body">
    //                             <div className="visitor-timeline">

    //                                 <div className="visitor-timeline-item active">
    //                                     <h6 className="mb-1">Check In Approved</h6>
    //                                     <small className="text-muted">
    //                                         10:45 AM • Guard Gate 1
    //                                     </small>
    //                                 </div>

    //                                 <div className="visitor-timeline-item">
    //                                     <h6 className="mb-1">Host Approval Received</h6>
    //                                     <small className="text-muted">
    //                                         10:42 AM • App Notification
    //                                     </small>
    //                                 </div>

    //                                 <div className="visitor-timeline-item">
    //                                     <h6 className="mb-1">Entry Request Created</h6>
    //                                     <small className="text-muted">
    //                                         10:40 AM • Gate System
    //                                     </small>
    //                                 </div>

    //                             </div>
    //                         </div>
    //                     </div>

    //                 </div>

    //             </div>
    //         </div >

    //         <CheckOutVisitorModal
    //             checkoutShow={checkoutShow}
    //             setCheckoutShow={setCheckOutShow}
    //         />

    //         <ExtendTimeModal
    //             showExtendTime={showExtendTime}
    //             setShowExtendTime={setShowExtendTime}

    //             extendDurationType={extendDurationType}
    //             extendDuration={extendDuration}
    //             setExtendDuration={setExtendDuration}
    //         />

    //     </>
    // )
}

export default VisitorDetails