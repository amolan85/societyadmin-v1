import { useState, useEffect, useRef } from 'react'
import { GetSessionData } from "../../../utils/SessionManagement";
import "../../../styles/AddMember.css"
import "../../../styles/ParkingRegister.css"
import { Badge, Pagination } from '../../../components/Common/ReusableFunction';
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXls } from "react-icons/bs";
import { BiExport } from 'react-icons/bi';
import { FiFilter, FiSearch } from 'react-icons/fi';
import { toast } from "react-toastify";
import {
    CreateVisitorApi, ListVisitorsApi,
    GetVisitorApi, DeleteVisitorApi, VisitorCheckoutApi,
    ApproveVisitorApi, RejectVisitorApi, UpdateVisitorApi
} from '../../../services/VisitorApi';
import { getAllBlocksApi, getAllFlatsApi } from '../../../services/UnitRegisterApi';
import AllotVisitorParkingModal from '../../Parking/AllotVisitorParkingModal';
import VisitorModal from "./VisitorModal";
import { ListParkingSlotsApi } from "../../../services/ParkingApi";
import { AllotVisitorParkingApi } from '../../../services/VisitorParkingApi';

const VisitorRegister = ({ setActive, setVisitorId }) => {

    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [societyId, setSocietyId] = useState("");
    const [visitorsList, setVisitorsList] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [editVisitorId, setEditVisitorId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [visitorAllBlocks, setVisitorAllBlocks] = useState([]);
    const [visitorAllFlats, setVisitorAllFlats] = useState([]);
    const [visitorSelectedBlock, setVisitorSelectedBlock] = useState("");
    const [visitorSelectedFlat, setVisitorSelectedFlat] = useState("");
    const [flatNumber, setFlatNumber] = useState("");
    const [stats, setStats] = useState({ total: 0, today: 0, pending: 0, checkedOut: 0 });

    const [show, setShow] = useState(false);
    const [exportModal, setExportModal] = useState(false);
    const [approvalModal, setApprovalModal] = useState(false);
    const [photo, setPhoto] = useState(null);

    const [activeTab, setActiveTab] = useState("excel");

    const [errors, setErrors] = useState({});
    const [errorText, setErrorText] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");

    const [visitorType, setVisitorType] = useState("guest");

    const [visitorName, setVisitorName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [comingFrom, setComingFrom] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [purpose, setPurpose] = useState("");
    const [idType, setIdType] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [flatId, setFlatId] = useState("");
    const [approvalStatus, setApprovalStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [visitorTypeFilter, setVisitorTypeFilter] = useState("");
    const [scheduleStartDate, setScheduleStartDate] = useState("");
    const [scheduleEndDate, setScheduleEndDate] = useState("");
    const [flatIdFilter, setFlatIdFilter] = useState("");
    const [scheduleDate, setScheduleDate] = useState("");
    const [entryStatus, setEntryStatus] = useState("");

    const [showAllotParking, setShowAllotParking] = useState(false);
    const [allVisitors, setAllVisitors] = useState([]);
    const [allSlots, setAllSlots] = useState([]);
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedVehicleType, setSelectedVehicleType] = useState(null);
    const [remarks, setRemarks] = useState("");

    const [parcelDescription, setParcelDescription] = useState("");
    const [parcelCompany, setParcelCompany] = useState("");
    const [parcelDeliveryType, setParcelDeliveryType] = useState("");

    const [tempVisitorType, setTempVisitorType] = useState("");
    const [tempEntryStatus, setTempEntryStatus] = useState("");
    const [tempFlatId, setTempFlatId] = useState("");
    const [tempScheduleDate, setTempScheduleDate] = useState("");
    const [showMoreFilters, setShowMoreFilters] = useState(false);

    useEffect(() => { SessionData(); }, []);

    const SessionData = async () => {
        const data = await GetSessionData();
        setUserId(data.data.user_id);
        const allFlats = data.data.flats;
        const firstFlat = allFlats[0];
        setSocietyId(firstFlat.society_id);
        getVisitors({
            sid: firstFlat.society_id,
            pg: 1,
            searchText: "",
            visitorType: "",
            entryStatus: "",
            approvalStatus: "",
            flatId: null,
            fromDate: "",
            toDate: "",
            scheduleDate: ""
        });
    };

    useEffect(() => {
        if (!societyId) return;

        getVisitors({
            sid: societyId,
            pg: page,
            searchText: search,
            visitorType: visitorTypeFilter,
            entryStatus,
            approvalStatus,
            flatId: flatIdFilter,
            fromDate: dateFrom,
            toDate: dateTo,
            scheduleDate
        });

    }, [
        page,
        approvalStatus,
        visitorTypeFilter,
        entryStatus,
        flatIdFilter,
        scheduleDate,
        dateFrom,
        dateTo
    ]);

    const getVisitors = async ({
        sid,
        pg,
        searchText,
        status,
        fromDate,
        toDate,
        visitorType = "",
        entryStatus = "",
        flatId = null,
        scheduleDate = ""
    }) => {
        try {
            setLoading(true);

            const data = await ListVisitorsApi({
                societyId: sid,
                currentPage: pg,
                currentSearch: searchText,
                currentVisitorType: visitorType,
                currentEntryStatus: entryStatus,
                currentStatus: approvalStatus,
                currentFlatId: flatId,
                currentFromDate: fromDate,
                currentToDate: toDate,
                currentScheduleDate: scheduleDate,
                pageSize: 10
            });

            const visitors = data?.visitors || [];
            const pagination = data?.pagination || {};

            setVisitorsList(visitors);
            setTotalCount(pagination.total || 0);
            setTotalPages(pagination.total_pages || 1);
            setPage(pagination.page || pg);
            const today = new Date().toISOString().split("T")[0];

            setStats({
                total: pagination.total || 0,
                today: visitors.filter(v => v.check_in_time?.startsWith(today)).length,
                pending: visitors.filter(v => v.approval_status === "pending").length,
                checkedOut: visitors.filter(v => !!v.check_out_time).length
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const GetVisitorDetailsById = async (id) => {
        try {
            const data = await GetVisitorApi(id, societyId);

            setVisitorType((data.visitor_type || "").toLowerCase());
            setVisitorName(data.visitor_name || "");
            setMobile(data.mobile || "");
            setEmail(data.email || "");
            setGender((data.gender || "").toLowerCase());

            setComingFrom(data.coming_from || "");
            setVehicleNumber(data.vehicle_number || "");
            setFlatId(data.flat_id || "");

            setPurpose(data.purpose || "");
            setIdType((data.id_type || "").toLowerCase());
            setIdNumber(data.id_number || "");

            setParcelDescription(data.parcel_description || "");
            setParcelCompany(data.parcel_company || "");
            setParcelDeliveryType(data.parcel_delivery_type || "");

            setVisitorSelectedBlock(data.block || "");

            const flatsRes = await getAllFlatsApi(societyId, data.block);
            setVisitorAllFlats(flatsRes?.flats || []);

            setVisitorSelectedFlat(String(data.flat_id));
            setFlatNumber(data.flat_number || "");

            setScheduleStartDate(
                data.schedule_start_date
                    ? data.schedule_start_date.split(" ")[0]
                    : ""
            );

            setScheduleEndDate(
                data.schedule_end_date
                    ? data.schedule_end_date.split(" ")[0]
                    : ""
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageChange = (value) => {
        setPage(value);
    };

    const handleVisitorBlockChange = async (e) => {
        const block = e.target.value;
        setVisitorSelectedBlock(block);
        setVisitorSelectedFlat("");
        setVisitorAllFlats([]);
        // ── clear block error here too, as a guaranteed backup ──
        setErrors(prev => ({ ...prev, block: "" }));
        if (block) {
            const res = await getAllFlatsApi(societyId, block);
            setVisitorAllFlats(res?.flats || []);
        }
    };

    const handleAddVisitor = async () => {
        resetForm();
        setVisitorSelectedBlock("");
        setVisitorSelectedFlat("");
        setVisitorAllFlats([]);
        const data = await GetSessionData();
        const sId = data.data.flats[0].society_id;
        const blockRes = await getAllBlocksApi(societyId);
        setVisitorAllBlocks(blockRes?.blocks || []);
        setShow(true);
    };

    const resetForm = () => {
        setVisitorName(""); setMobile(""); setEmail(""); setGender("");
        setComingFrom(""); setVehicleNumber(""); setPurpose("");
        setIdType(""); setIdNumber(""); setFlatId("");
        setParcelDescription(""); setParcelCompany(""); setParcelDeliveryType("");
        setVisitorType("guest");
        setErrors({}); setErrorText("");
        setIsEdit(false);
        setEditVisitorId(null);
        setScheduleStartDate("");
        setScheduleEndDate("");
    };

    const validateForm = () => {
        let errs = {};
        if (!visitorName) errs.visitorName = "required";
        if (!mobile) errs.mobile = "required";
        if (!isEdit && !flatId) errs.flatId = "required";
        if (visitorType === "guest") {
            if (!purpose) errs.purpose = "required";
            if (!isEdit && !idType) errs.idType = "required";
            if (!isEdit && !idNumber) errs.idNumber = "required";
        } else {
            if (!parcelCompany) errs.parcelCompany = "required";
            if (!parcelDeliveryType) errs.parcelDeliveryType = "required";
        }
        return errs;
    };

    // const formatDateTime = (date) => {
    //     if (!date) return "";
    //     return `${date} 00:00:00`;
    // };

    const handleSubmit = async () => {
        try {
            const validationErrors = validateForm();

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            // ── clear all errors right before submitting, guaranteed ──
            setErrors({});

            if (isEdit) {
                await UpdateVisitorApi({
                    visitorId: editVisitorId,
                    societyId,
                    flatId,
                    visitorName,
                    mobile,
                    email,
                    gender,
                    visitorType,
                    comingFrom,
                    vehicleNumber,
                    purpose,
                    idType,
                    idNumber,
                    parcelCompany,
                    parcelDeliveryType,
                    parcelDescription,
                    approvalStatus,
                    photo,
                    scheduleStartDate,
                    scheduleEndDate
                });
            } else {
                await CreateVisitorApi({
                    societyId,
                    flatId,
                    visitorName,
                    mobile,
                    email,
                    gender,
                    visitorType,
                    vehicleNumber,
                    purpose,
                    idType,
                    idNumber,
                    comingFrom,
                    photo,
                    scheduleStartDate,
                    scheduleEndDate
                });
            }

            toast.success(isEdit ? "Visitor updated successfully!" : "Visitor added successfully!");

            setShow(false);
            resetForm();

            setSearch("");
            setApprovalStatus("");
            setDateFrom("");
            setDateTo("");

            getVisitors({
                sid: societyId,
                pg: 1,
                searchText: "",
                visitorType: "",
                entryStatus: "",
                approvalStatus: "",
                flatId: null,
                fromDate: "",
                toDate: "",
                scheduleDate: ""
            });

        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
            setErrorText(error?.response?.data?.message || error?.message || "Error occurred");
        }
    };

    const handleDelete = async (visitorId) => {
        if (!window.confirm("Are you sure you want to delete this visitor?")) return;
        try {
            await DeleteVisitorApi(visitorId, societyId);
            toast.success("Visitor deleted successfully");
            getVisitors({ sid: societyId, pg: page, searchText: search, status: approvalStatus, fromDate: dateFrom, toDate: dateTo });
        } catch (e) { toast.error(e?.message || "Delete failed"); }
    };

    const handleCheckout = async (visitorId) => {
        if (!window.confirm("Checkout this visitor?")) return;
        try {
            await VisitorCheckoutApi(visitorId, societyId);
            toast.success("Visitor checked out");
            getVisitors({ sid: societyId, pg: page, searchText: search, status: approvalStatus, fromDate: dateFrom, toDate: dateTo });
        } catch (e) { toast.error(e?.message || "Checkout failed"); }
    };

    const getParkingSlots = async () => {
        try {
            const data = await ListParkingSlotsApi(
                societyId,
                1,
                100,
                "",
                "available",
                "visitor",
                ""
            );

            const slots = (data?.slots || []).map(item => ({
                value: item.id,
                label: item.slot_number
            }));

            setAllSlots(slots);
        } catch (error) {
            console.log(error);
        }
    };

    const handleOpenAllotParking = async (visitor) => {
        await getParkingSlots();

        setSelectedVisitor({
            value: visitor.id,
            label: visitor.visitor_name
        });
        setVehicleNumber(visitor.vehicle_number || "");
        setShowAllotParking(true);
    };

    const handleVisitorParkingSubmit = async () => {
        try {
            const payload = {
                society_id: Number(societyId),
                visitor_entry_id: selectedVisitor?.value,
                slot_id: selectedSlot?.value,
                allotted_by: Number(userId),
                vehicle_number: vehicleNumber,
                vehicle_type: selectedVehicleType?.value,
                remarks: remarks || ""
            };

            await AllotVisitorParkingApi(payload);

            toast.success("Parking allotted successfully");

            setShowAllotParking(false);

            setSelectedSlot(null);
            setSelectedVehicleType(null);
            setRemarks("");

        } catch (error) {
            toast.error(error?.message || "Failed to allot parking");
        }
    };

    const handleApproval = async (status) => {
        try {
            if (status === "approved") {
                await ApproveVisitorApi(selectedVisitor.id, societyId, userId);
            } else {
                await RejectVisitorApi(selectedVisitor.id, societyId, userId, rejectionReason);
            }
            toast.success(`Visitor ${status === "approved" ? "approved" : "rejected"} successfully`);
            setApprovalModal(false);
            setSelectedVisitor(null);
            setRejectionReason("");
            getVisitors({ sid: societyId, pg: page, searchText: search, status: approvalStatus, fromDate: dateFrom, toDate: dateTo });
        } catch (e) { toast.error(e?.message || "Action failed"); }
    };

    const fmt = (dt, type) => {
        if (!dt) return "—";

        const date = new Date(
            dt + (dt.includes("Z") || dt.includes("+") ? "" : "Z")
        );

        return type === "time"
            ? date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            })
            : date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
    };

    return (
        <>
            <div className="pg cp-wrap">

                {/* Stats */}
                <div className="row g-3 mb-4">
                    {[
                        [stats.total, "Total Visitors", ""],
                        [stats.today, "Today's Visitors", ""],
                        [stats.pending, "Pending Approval", "tile-grn"],
                        [stats.checkedOut, "Checked Out Today", "tile-purple"]
                    ].map(([v, l, cls]) => (
                        <div className="col-6 col-md-3" key={l}>
                            <div className={`tile bg-white ${cls}`}>
                                <div className="text-start text-muted">{l}</div>
                                <div className="tile-val text-start mt-1">{v}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="visitor-toolbar mb-4">

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">

                        <div className="d-flex align-items-center gap-2">

                            <button
                                className="btn btn-sm btn-ac btn-primary"
                                onClick={handleAddVisitor}
                            >
                                + Add Visitor
                            </button>

                            <div className="position-relative">

                                <button
                                    className={`btn btn-sm btn-ac btn-primary ${showMoreFilters ? "active" : ""}`}
                                    onClick={() => {
                                        setTempVisitorType(visitorTypeFilter);
                                        setTempEntryStatus(entryStatus);
                                        setTempFlatId(flatIdFilter);
                                        setTempScheduleDate(scheduleDate);
                                        setShowMoreFilters(v => !v);
                                    }}
                                >
                                    <FiFilter size={14} /> More Filters
                                </button>

                                {showMoreFilters && (
                                    <div
                                        className="shadow border rounded-3 bg-white p-3 position-absolute start-0 mt-1"
                                        style={{
                                            width: "320px",
                                            zIndex: 999,
                                            top: "100%",
                                            maxHeight: "450px",
                                            overflowY: "auto"
                                        }}
                                    >
                                        <p className="text-muted fw-semibold mb-1 text-start"
                                            style={{ fontSize: 11, textTransform: "uppercase" }}>
                                            Visitor Type
                                        </p>

                                        <div className="d-flex gap-2 flex-wrap mb-3">
                                            {[
                                                ["", "All"],
                                                ["guest", "Guest"],
                                                ["delivery", "Delivery"]
                                            ].map(([value, label]) => (
                                                <button
                                                    key={value}
                                                    className={`btn btn-sm rounded-pill ${tempVisitorType === value ? "btn-primary" : "btn-outline-secondary"}`}
                                                    onClick={() => setTempVisitorType(value)}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>

                                        <label className="form-label fw-semibold text-start d-block mb-1">
                                            Entry Status
                                        </label>

                                        <select
                                            className="form-select mb-3"
                                            value={tempEntryStatus}
                                            onChange={(e) => setTempEntryStatus(e.target.value)}
                                        >
                                            <option value="">All</option>
                                            <option value="waiting">Waiting</option>
                                            <option value="completed">Complete</option>
                                        </select>

                                        <label className="form-label fw-semibold text-start d-block mb-1">
                                            Schedule Date
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control mb-3"
                                            value={tempScheduleDate}
                                            onChange={(e) => setTempScheduleDate(e.target.value)}
                                        />

                                        <div className="d-flex justify-content-between">
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => {
                                                    setTempVisitorType("");
                                                    setTempEntryStatus("");
                                                    setTempFlatId("");
                                                    setTempScheduleDate("");
                                                }}
                                            >
                                                Clear All
                                            </button>

                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => {
                                                    setVisitorTypeFilter(tempVisitorType);
                                                    setEntryStatus(tempEntryStatus);
                                                    setFlatIdFilter(tempFlatId);
                                                    setScheduleDate(tempScheduleDate);
                                                    setPage(1);
                                                    setShowMoreFilters(false);
                                                }}
                                            >
                                                Apply Filters
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control visitor-search"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setPage(1);
                                    getVisitors({
                                        sid: societyId,
                                        pg: 1,
                                        searchText: search,
                                        visitorType: visitorTypeFilter,
                                        entryStatus,
                                        approvalStatus,
                                        flatId: flatIdFilter,
                                        fromDate: dateFrom,
                                        toDate: dateTo,
                                        scheduleDate
                                    });
                                }}
                            >
                                <FiSearch />
                            </button>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="row g-2">
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={approvalStatus}
                                onChange={(e) => {
                                    setApprovalStatus(e.target.value);
                                    setPage(1);
                                }}
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <input
                                type="date"
                                className="form-control"
                                value={dateFrom}
                                onChange={(e) => {
                                    setDateFrom(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>

                        <div className="col-md-4">
                            <input
                                type="date"
                                className="form-control"
                                value={dateTo}
                                onChange={(e) => {
                                    setDateTo(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="sv-card p-0">
                    <div className="sa-table-wrap">
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    {["VISITOR", "UNIT", "TYPE", "PURPOSE / PARCEL", "VEHICLE", "CHECK IN", "CHECK OUT", "ENTRY STATUS", "STATUS", "ACTIONS"].map(h => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {visitorsList.map((v, i) => (
                                    <tr className="text-start" key={i}>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <img
                                                    src={
                                                        v.photo_url?.startsWith("http")
                                                            ? v.photo_url
                                                            : "../src/assets/profile.png"
                                                    }
                                                    alt="Profile"
                                                    width={38}
                                                    height={38}
                                                    className="rounded-circle object-fit-cover flex-shrink-0"
                                                    onError={(e) => { e.target.src = "../src/assets/profile.png"; }}
                                                />
                                                <div>
                                                    <div className="fw-semibold">
                                                        {v.visitor_name || "-"}
                                                    </div>
                                                    <small className="text-muted">
                                                        {v.mobile || "-"}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{v.flat_number || "-"}</td>
                                        <td>
                                            <Badge
                                                label={v.visitor_type === "delivery" ? "Delivery" : "Guest"}
                                                c={v.visitor_type === "delivery" ? "orange" : "blue"}
                                            />
                                        </td>
                                        <td>
                                            <div className="fw-semibold">
                                                {v.visitor_type === "delivery" ? v.parcel_description : v.purpose}
                                            </div>
                                            {v.coming_from && <small className="text-muted">From: {v.coming_from}</small>}
                                        </td>
                                        <td>{v.vehicle_number || <span className="text-muted">—</span>}</td>
                                        <td>
                                            <div>{fmt(v.check_in_time, "time")}</div>
                                            <small className="text-muted">{fmt(v.check_in_time, "date")}</small>
                                        </td>
                                        <td>
                                            <div>{fmt(v.check_out_time, "time")}</div>
                                            <small className="text-muted">{fmt(v.check_out_time, "date")}</small>
                                        </td>
                                        <td>
                                            <Badge
                                                label={
                                                    v.entry_status === "waiting"
                                                        ? "Waiting"
                                                        : v.entry_status === "inside"
                                                            ? "Inside"
                                                            : ["complete", "completed"].includes(v.entry_status?.toLowerCase())
                                                                ? "Completed"
                                                                : v.entry_status === "cancelled"
                                                                    ? "Cancelled"
                                                                    : "-"
                                                }
                                                c={
                                                    v.entry_status === "waiting"
                                                        ? "orange"
                                                        : v.entry_status === "inside"
                                                            ? "blue"
                                                            : ["complete", "completed"].includes(v.entry_status?.toLowerCase())
                                                                ? "green"
                                                                : v.entry_status === "cancelled"
                                                                    ? "red"
                                                                    : "grey"
                                                }
                                            />
                                        </td>
                                        <td>
                                            <Badge
                                                label={
                                                    v.approval_status === "pending"
                                                        ? "Pending"
                                                        : v.approval_status === "approved"
                                                            ? "Approved"
                                                            : v.approval_status === "rejected"
                                                                ? "Rejected"
                                                                : "-"
                                                }
                                                c={
                                                    v.approval_status === "pending"
                                                        ? "yellow"
                                                        : v.approval_status === "approved"
                                                            ? "green"
                                                            : v.approval_status === "rejected"
                                                                ? "red"
                                                                : "grey"
                                                }
                                            />
                                        </td>
                                        <td>
                                            <div className="member-action-dropdown dropdown">
                                                <button className="member-action-btn" type="button" data-bs-toggle="dropdown">⋮</button>
                                                <ul className="dropdown-menu member-action-menu dropdown-menu-end">

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                            onClick={() => {
                                                                setVisitorId(v.id);
                                                                setActive("visitorDetailsPage");
                                                            }}
                                                        >
                                                            View Details
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                            disabled={v.approval_status !== "pending"}
                                                            onClick={() => {
                                                                if (v.approval_status !== "pending") return;
                                                                resetForm();
                                                                setIsEdit(true);
                                                                setEditVisitorId(v.id);
                                                                GetVisitorDetailsById(v.id);
                                                                setShow(true);
                                                            }}
                                                        >
                                                            Edit Visitor
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                            disabled={v.approval_status !== "pending"}
                                                            onClick={() => {
                                                                if (v.approval_status !== "pending") return;
                                                                setSelectedVisitor(v);
                                                                setApprovalModal(true);
                                                            }}
                                                        >
                                                            Approve / Reject
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                            disabled={!(v.entry_status === "checked_in" || v.entry_status === "inside")}
                                                            onClick={() => {
                                                                if (!(v.entry_status === "checked_in" || v.entry_status === "inside")) return;
                                                                handleCheckout(v.id);
                                                            }}
                                                        >
                                                            Checkout
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                            disabled={
                                                                v.approval_status === "pending" ||
                                                                v.approval_status === "rejected" ||
                                                                !!v.check_out_time ||
                                                                v.entry_status === "checked_out"
                                                            }
                                                            onClick={() => {
                                                                if (
                                                                    v.approval_status === "pending" ||
                                                                    v.approval_status === "rejected" ||
                                                                    !!v.check_out_time ||
                                                                    v.entry_status === "checked_out"
                                                                ) return;
                                                                handleOpenAllotParking(v);
                                                            }}
                                                        >
                                                            Allot Parking
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item text-danger"
                                                            disabled
                                                            style={{
                                                                color: "#6c757d",
                                                                cursor: "not-allowed",
                                                                opacity: 0.6
                                                            }}
                                                            onClick={() => handleDelete(v.id)}
                                                        >
                                                            Delete Visitor
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination page={page} total={totalPages} onChange={handlePageChange} />
                </div>
            </div>

            {/* ── Add / Edit Visitor Modal ── */}
            <VisitorModal
                show={show}
                setShow={setShow}
                mode={isEdit ? "edit" : "add"}
                errors={errors}
                setErrors={setErrors}
                errorText={errorText}
                visitorType={visitorType}
                setVisitorType={setVisitorType}
                visitorName={visitorName}
                setVisitorName={setVisitorName}
                mobile={mobile}
                setMobile={setMobile}
                flatId={flatId}
                setFlatId={setFlatId}
                flatNumber={flatNumber}
                setFlatNumber={setFlatNumber}
                photo={photo}
                setPhoto={setPhoto}
                allBlocks={visitorAllBlocks}
                allFlats={visitorAllFlats}
                selectedBlock={visitorSelectedBlock}
                setSelectedBlock={setVisitorSelectedBlock}
                selectedFlat={visitorSelectedFlat}
                setSelectedFlat={setVisitorSelectedFlat}
                onBlockChange={handleVisitorBlockChange}
                vehicleNumber={vehicleNumber}
                setVehicleNumber={setVehicleNumber}
                email={email}
                setEmail={setEmail}
                gender={gender}
                setGender={setGender}
                comingFrom={comingFrom}
                setComingFrom={setComingFrom}
                purpose={purpose}
                setPurpose={setPurpose}
                idType={idType}
                setIdType={setIdType}
                idNumber={idNumber}
                setIdNumber={setIdNumber}
                parcelCompany={parcelCompany}
                setParcelCompany={setParcelCompany}
                parcelDeliveryType={parcelDeliveryType}
                setParcelDeliveryType={setParcelDeliveryType}
                parcelDescription={parcelDescription}
                setParcelDescription={setParcelDescription}
                handleSubmit={handleSubmit}
                onClose={resetForm}
                scheduleStartDate={scheduleStartDate}
                setScheduleStartDate={setScheduleStartDate}
                scheduleEndDate={scheduleEndDate}
                setScheduleEndDate={setScheduleEndDate}
            />
            <AllotVisitorParkingModal
                show={showAllotParking}
                setShow={setShowAllotParking}

                allFlats={allSlots}

                blocks={selectedVisitor}
                setBlocks={setSelectedVisitor}

                flat={selectedSlot}
                setFlat={setSelectedSlot}

                firstName={vehicleNumber}
                setFirstName={setVehicleNumber}

                memType={selectedVehicleType}
                setMemType={setSelectedVehicleType}

                remarks={remarks}
                setRemarks={setRemarks}

                handleSubmit={handleVisitorParkingSubmit}
                mode="add"
            />
            {/* ── Approve / Reject Modal ── */}
            {approvalModal && selectedVisitor && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal show d-block">
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content">
                                <div className="modal-header bg-light">
                                    <h1 className="modal-title fs-5">Visitor Approval</h1>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => { setApprovalModal(false); setRejectionReason(""); }}
                                    />
                                </div>
                                <div className="modal-body text-start">
                                    <p className="mb-1 fw-semibold">{selectedVisitor.visitor_name}</p>
                                    <p className="text-muted mb-3" style={{ fontSize: 13 }}>
                                        {selectedVisitor.purpose || selectedVisitor.parcel_company}
                                    </p>
                                    <label className="sv-lb">Rejection Reason (optional)</label>
                                    <input
                                        className="sv-in mt-1"
                                        placeholder="Enter reason if rejecting..."
                                        value={rejectionReason}
                                        onChange={e => setRejectionReason(e.target.value)}
                                    />
                                </div>
                                <div className="modal-footer bg-light">
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button className="btn btn-sm btn-danger" onClick={() => handleApproval("rejected")}>Reject</button>
                                        <button className="btn btn-sm btn-success" onClick={() => handleApproval("approved")}>Approve</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── Export Modal ── */}
            {exportModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal show d-block">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5">Export Data</h1>
                                    <button type="button" className="btn-close" onClick={() => setExportModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <h6 className="text-start fw-bold">Select Format</h6>
                                    <div className="row mb-4">
                                        {[
                                            { tab: "excel", Icon: BsFiletypeXls, label: "Excel" },
                                            { tab: "csv", Icon: BsFiletypeCsv, label: "CSV" },
                                            { tab: "pdf", Icon: BsFiletypePdf, label: "PDF" },
                                        ].map(({ tab, Icon, label }) => (
                                            <div className="col-md-4" key={tab}>
                                                <div
                                                    className={`format-card text-center p-3 rounded-3 ${activeTab === tab ? "active-format" : ""}`}
                                                    onClick={() => setActiveTab(tab)}
                                                >
                                                    <Icon className={activeTab === tab ? "text-primary" : "text-secondary"} size={20} />
                                                    <p className={`fw-semibold mb-0 mt-1 ${activeTab === tab ? "text-primary" : "text-secondary"}`}>
                                                        {label}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <h6 className="text-start fw-bold">Data Range</h6>
                                    <div className="range-card active-range d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <input className="form-check-input" type="radio" defaultChecked />
                                            <h6 className="fw-bold mt-1">All Data</h6>
                                        </div>
                                        <span className="text-muted"><h6>{totalCount} records</h6></span>
                                    </div>
                                    <div className="range-card d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <input className="form-check-input" type="radio" />
                                            <h6 className="fw-bold mt-1">Current Search results</h6>
                                        </div>
                                        <h6 className="text-muted mt-1">{visitorsList.length} records</h6>
                                    </div>
                                    <div className="range-card d-flex align-items-center gap-3">
                                        <input className="form-check-input" type="radio" />
                                        <h6 className="fw-bold mt-1">Custom date range</h6>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setExportModal(false)}>Cancel</button>
                                    <button className="btn btn-sm btn-primary">
                                        <i className="bi bi-download me-2"></i>Export Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default VisitorRegister;