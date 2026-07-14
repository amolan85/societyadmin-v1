import { useState, useEffect } from 'react';
import { GetSessionData } from "../../../utils/SessionManagement";
import { Badge, Pagination } from '../../../components/Common/ReusableFunction';
import { FiSearch, FiMapPin, FiTruck, FiTag, FiHash, FiPhone, FiMail } from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import { toast } from "react-toastify";
import {
    CreateVehicleApi, ListVehiclesApi,
    GetVehicleByIdApi, UpdateVehicleApi, DeleteVehicleApi
} from '../../../services/VehicleRegisterAPI';
import { getAllBlocksApi, getAllUnitsBySearchApi } from '../../../services/UnitRegisterApi';
import VehicleModal from './VehicleModal';
import AllocateResidentParkingModal from '../../Parking/AllocateResidentParkingModal';

const ListVehicleRegister = ({ setActive, setVehicleId }) => {

    // List & pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState("");
    const [vehiclesList, setVehiclesList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Session
    const [societyId, setSocietyId] = useState("");
    const [userId, setUserId] = useState(null);

    // Modal
    const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editVehicleId, setEditVehicleId] = useState(null);

    // Block / Flat
    const [allBlocks, setAllBlocks] = useState([]);
    const [allFlats, setAllFlats] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState("");
    const [selectedFlat, setSelectedFlat] = useState("");
    const [selectedOwnerName, setSelectedOwnerName] = useState("");

    // Form fields
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [color, setColor] = useState("");
    const [stickerId, setStickerId] = useState("");
    const [rcDocument, setRcDocument] = useState(null);
    const [flatId, setFlatId] = useState("");
    const [rcDocumentUrl, setRcDocumentUrl] = useState("");

    // Validation
    const [errors, setErrors] = useState({});
    const [errorText, setErrorText] = useState("");

    // Filters
    const [filterBlock, setFilterBlock] = useState("");
    const [filterFloor, setFilterFloor] = useState("");
    const [filterFlatStatus, setFilterFlatStatus] = useState("");
    const [selectedOwnerId, setSelectedOwnerId] = useState(null);

    // Stats
    const [stats, setStats] = useState({ total: 0, twoWheeler: 0, fourWheeler: 0, other: 0 });

    // ── Allocate Parking Modal state ──
    const [showParkingModal, setShowParkingModal] = useState(false);
    const [selectedVehicleForParking, setSelectedVehicleForParking] = useState(null);
    // Delete Confirmation Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [selectedVehicleNumber, setSelectedVehicleNumber] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => { SessionData(); }, []);

    useEffect(() => {
        if (!societyId) return;
        getVehicles({ sid: societyId, pg: page, searchText: search, vType: vehicleTypeFilter });
    }, [page, vehicleTypeFilter]);

    const filteredVehicles = vehiclesList.filter(v => {
        if (filterBlock && v.block?.toLowerCase() !== filterBlock.toLowerCase()) return false;
        if (filterFloor && String(v.floor) !== String(filterFloor)) return false;
        if (filterFlatStatus && v.flat_status?.toLowerCase() !== filterFlatStatus.toLowerCase()) return false;
        return true;
    });

    const SessionData = async () => {
        try {
            const data = await GetSessionData();
            setUserId(data.data.user_id);
            const firstFlat = data.data.flats?.[0];
            if (firstFlat) {
                const sid = firstFlat.society_id;
                setSocietyId(sid);
                getVehicles({ sid, pg: 1, searchText: "", vType: "" });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const generateStickerId = (flatNumber) => {
        const cleanFlat = (flatNumber || "").replace(/[^A-Za-z0-9]/g, "");
        return `STK-${cleanFlat}`;
    };

    const getVehicles = async ({ sid, pg, searchText, vType }) => {
        try {
            setLoading(true);
            const response = await ListVehiclesApi({
                societyId: sid,
                currentPage: pg,
                search: searchText,
                vehicleType: vType,
            });
            console.log("Vehicle API Response:", response);
            const list = response?.vehicles || [];
            const pagination = response?.pagination || {};
            setVehiclesList(list);
            setTotalCount(pagination.total || 0);
            setTotalPages(pagination.total_pages || 1);
            setPage(pagination.page || pg);
            setStats({
                total: pagination.total || 0,
                twoWheeler: list.filter(v => v.vehicle_type === "2_wheeler").length,
                fourWheeler: list.filter(v => v.vehicle_type === "4_wheeler").length,
                other: list.filter(v => v.vehicle_type === "other").length,
            });
        } catch (e) {
            toast.error("Failed to load vehicles");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setVehicleNumber(""); setVehicleType(""); setVehicleModel("");
        setColor(""); setStickerId(""); setRcDocument(null);
        setFlatId(""); setSelectedBlock(""); setSelectedFlat("");
        setSelectedOwnerId(null);
        setSelectedOwnerName("");
        setErrors({}); setErrorText("");
        setRcDocumentUrl("");
        setIsEdit(false); setEditVehicleId(null);
    };

    const handleAdd = async () => {
        resetForm();
        const blockRes = await getAllBlocksApi(societyId);
        setAllBlocks(blockRes?.blocks || []);
        setAllFlats([]);
        setShow(true);
    };

    const handleBlockChange = async (e) => {
        const block = e.target.value;
        setSelectedBlock(block);
        setSelectedFlat("");
        setSelectedOwnerId(null);
        setAllFlats([]);
        if (block) {
            const res = await getAllUnitsBySearchApi(societyId, block);
            console.log("Flats with members:", res?.flats);
            const filtered = (res?.flats || []).filter(f => {
                const sameBlock = String(f.block).toLowerCase() === String(block).toLowerCase();
                const hasOwner = f.members?.some(m => m.occupancy_type === "owner");
                return sameBlock && hasOwner;
            });
            setAllFlats(filtered);
        }
    };

    const handleFlatChange = (flatId) => {
        setSelectedFlat(flatId);
        const flatData = allFlats.find(f => String(f.flat_id) === String(flatId));
        const owner = flatData?.members?.find(m => m.occupancy_type === "owner");
        if (!owner) {
            toast.error("This flat has no owner. Cannot add vehicle.");
            setSelectedOwnerId(null);
            setSelectedOwnerName("");
            setStickerId("");
            return;
        }
        setSelectedOwnerId(owner.user_id);
        setSelectedOwnerName(`${owner.first_name || ""} ${owner.last_name || ""}`.trim());
        setStickerId(generateStickerId(flatData?.flat_number));
    };

    const handleEditOpen = async (vehicleId) => {
        try {
            resetForm();
            const data = await GetVehicleByIdApi(vehicleId, societyId);
            setVehicleNumber(data.vehicle_number || "");
            setVehicleType(data.vehicle_type || "");
            setVehicleModel(data.vehicle_model || "");
            setColor(data.color || "");
            setStickerId(data.sticker_id || "");
            setFlatId(data.flat_id || "");
            setRcDocumentUrl(data.rc_document || data.rc_document_url || "");
            setSelectedOwnerName(data.owner_name || "");
            setFlatId(data.flat_number || "");
            setIsEdit(true);
            setEditVehicleId(vehicleId);
            setShow(true);
        } catch {
            toast.error("Failed to load vehicle details");
        }
    };

    const validateForm = () => {
        let errs = {};
        if (!vehicleNumber) errs.vehicleNumber = "required";
        if (!vehicleType) errs.vehicleType = "required";
        if (!vehicleModel) errs.vehicleModel = "required";
        if (!color) errs.color = "required";
        if (!stickerId) errs.stickerId = "required";
        if (!rcDocument && !isEdit) errs.rcDocument = "required";
        if (!isEdit) {
            if (!selectedFlat) errs.flatId = "required";
            if (!selectedBlock) errs.block = "required";
        }
        return errs;
    };


    const openVehicleDetails = (vehicleId) => {
        setVehicleId(vehicleId);
        setActive("vehicleDetailsPage");
    };


    const handleSubmit = async (validateOnly = false) => {

        const errs = validateForm();

        if (Object.keys(errs).length > 0) {
            setErrors(errs);

            if (validateOnly) return false;

            return;
        }

        if (validateOnly) return true;

        try {

            if (isEdit) {

                await UpdateVehicleApi(
                    editVehicleId,
                    societyId,
                    vehicleNumber,
                    vehicleType,
                    vehicleModel,
                    color,
                    stickerId,
                    rcDocument
                );

                toast.success("Vehicle updated successfully!");

            } else {

                await CreateVehicleApi(
                    societyId,
                    selectedOwnerId,
                    selectedFlat,
                    vehicleNumber,
                    vehicleType,
                    vehicleModel,
                    color,
                    stickerId,
                    rcDocument
                );

                toast.success("Vehicle added successfully!");
            }

            setShow(false);
            resetForm();

            getVehicles({
                sid: societyId,
                pg: 1,
                searchText: "",
                vType: ""
            });

        } catch (e) {
            toast.error(e?.message || "Something went wrong");
            setErrorText(e?.message || "Error occurred");
        }
    };

    const handleDelete = (vehicleId, vehicleNumber) => {
        setSelectedVehicleId(vehicleId);
        setSelectedVehicleNumber(vehicleNumber);
        setShowDeleteModal(true);
    };
    const confirmDeleteVehicle = async () => {
        try {
            setDeleting(true);

            await DeleteVehicleApi(selectedVehicleId, societyId);

            toast.success("Vehicle deleted successfully");

            setShowDeleteModal(false);

            getVehicles({
                sid: societyId,
                pg: page,
                searchText: search,
                vType: vehicleTypeFilter
            });

        } catch (e) {
            toast.error(e?.message || "Delete failed");
        } finally {
            setDeleting(false);
        }
    };

    const handleConfirmSubmit = () => {
        if (handleSubmit) {
            const valid = handleSubmit(true); // validation only
            if (valid === false) return;
        }

        setShowConfirmModal(true);
    };
    // ── open AllocateResidentParkingModal ──
    const handleAllocateParking = (vehicle) => {
        setSelectedVehicleForParking(vehicle);
        setShowParkingModal(true);
    };

    const vehicleTypeLabel = (type) => {
        if (type === "2_wheeler") return "2 Wheeler";
        if (type === "4_wheeler") return "4 Wheeler";
        return type || "—";
    };

    const vehicleTypeBadgeColor = (type) => {
        if (type === "2_wheeler") return "blue";
        if (type === "4_wheeler") return "green";
        return "grey";
    };

    return (
        <>
            <div className="pg cp-wrap">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bc-header-icon">
                            <FaCar size={20} color="#2563eb" />
                        </div>

                        <div className="text-start">
                            <h4 className="cp-title mb-1">Owner Vehicles</h4>
                            <p className="cp-sub mb-0">
                                Manage owner vehicle registrations and related information.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Stats */}
                <div className="row g-3 mb-4">
                    {[
                        [stats.total, "Total Vehicles", ""],
                        [stats.twoWheeler, "2 Wheelers", ""],
                        [stats.fourWheeler, "4 Wheelers", "tile-grn"],
                        [stats.other, "Others", "tile-purple"],
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
                        <button className="btn btn-sm btn-primary" onClick={handleAdd}>
                            + Add Vehicle
                        </button>
                        <div className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control visitor-search"
                                placeholder="Search by number, model..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setPage(1);
                                    getVehicles({ sid: societyId, pg: 1, searchText: search, vType: vehicleTypeFilter });
                                }}
                            >
                                <FiSearch />
                            </button>
                        </div>
                    </div>

                    <div className="row g-2">
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={vehicleTypeFilter}
                                onChange={e => { setVehicleTypeFilter(e.target.value); setPage(1); }}
                            >
                                <option value="">All Types</option>
                                <option value="2_wheeler">2 Wheeler</option>
                                <option value="4_wheeler">4 Wheeler</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={filterBlock}
                                onChange={e => setFilterBlock(e.target.value)}
                            >
                                <option value="">All Blocks</option>
                                <option value="A">Block A</option>
                                <option value="B">Block B</option>
                                <option value="C">Block C</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={filterFlatStatus}
                                onChange={e => setFilterFlatStatus(e.target.value)}
                            >
                                <option value="">All Flat Status</option>
                                <option value="Occupied">Occupied</option>
                                <option value="Vacant">Vacant</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Filter by floor..."
                                value={filterFloor}
                                onChange={e => setFilterFloor(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Cards — Complaints-style row format */}
                {loading ? (
                    <div className="sv-card text-center py-5 text-muted">Loading...</div>
                ) : filteredVehicles.length === 0 ? (
                    <div className="sv-card text-center py-5 text-muted">No vehicles found</div>
                ) : (

                    filteredVehicles.map((v, i) => (
                        <div
                            key={v.vehicle_id || i}
                            className="card border-0 shadow-sm rounded-3"
                            style={{
                                padding: "10px 14px",
                                marginTop: 8,
                                cursor: "pointer"
                            }}
                            onClick={() => openVehicleDetails(v.vehicle_id)}
                        >
                            <div className="d-flex justify-content-between align-items-start gap-2">

                                <div className="d-flex gap-2 flex-grow-2 min-w-0">
                                    <img
                                        src={
                                            v.owner_profile_url?.startsWith("http")
                                                ? v.owner_profile_url
                                                : "../src/assets/profile.png"
                                        }
                                        alt="Profile"
                                        width={38}
                                        height={38}
                                        className="rounded-circle object-fit-cover flex-shrink-0"
                                        onError={(e) => { e.target.src = "../src/assets/profile.png"; }}
                                    />

                                    <div className="text-start min-w-0">
                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                            <span style={{ fontSize: 16, fontWeight: 600 }}>{v.owner_name || "—"}</span>
                                            <Badge
                                                label={vehicleTypeLabel(v.vehicle_type)}
                                                c={vehicleTypeBadgeColor(v.vehicle_type)}
                                            />
                                        </div>

                                        <div className="d-flex flex-wrap align-items-center gap-3 text-secondary" style={{ fontSize: 13 }}>
                                            <div className="d-flex align-items-center gap-1"><FiTruck size={12} /><span>{v.vehicle_number}</span></div>
                                            <div className="d-flex align-items-center gap-1"><FiMapPin size={12} /><span>{v.flat_number || "—"}</span></div>
                                            <div className="d-flex align-items-center gap-1"><FiTag size={12} /><span>{v.vehicle_model || "—"}</span></div>
                                            <div className="d-flex align-items-center gap-1"><span style={{ width: 12 }}>●</span><span>{v.color || "—"}</span></div>
                                            <div className="d-flex align-items-center gap-1"><FiHash size={12} /><span>{v.sticker_id || "—"}</span></div>
                                            {v.owner_mobile && (
                                                <div className="d-flex align-items-center gap-1"><FiPhone size={12} /><span>{v.owner_mobile}</span></div>
                                            )}
                                            {v.owner_email && (
                                                <div className="d-flex align-items-center gap-1"><FiMail size={12} /><span>{v.owner_email}</span></div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                    <div
                                        className="member-action-dropdown dropdown flex-shrink-0"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button className="member-action-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">⋮</button>
                                        <ul className="dropdown-menu member-action-menu dropdown-menu-end">
                                            <li>
                                                <button
                                                    className="dropdown-item member-action-item"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openVehicleDetails(v.vehicle_id);
                                                    }}                                                >
                                                    View Details
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item member-action-item"
                                                    onClick={() => handleEditOpen(v.vehicle_id)} onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditOpen(v.vehicle_id);
                                                    }}
                                                >
                                                    Edit Vehicle
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item member-action-item"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAllocateParking(v);
                                                    }}
                                                >
                                                    Allocate Parking
                                                </button>
                                            </li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li>
                                                <button
                                                    className="dropdown-item member-action-item member-action-delete"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(v.vehicle_id, v.vehicle_number);
                                                    }}
                                                >
                                                    Delete Vehicle
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))
                )}

                <div className="sv-card p-0 mt-2">
                    <Pagination page={page} total={totalPages} onChange={setPage} />
                </div>
            </div>

            {/* Add / Edit Vehicle Modal */}
            <VehicleModal
                show={show}
                setShow={setShow}
                mode={isEdit ? "edit" : "add"}
                errors={errors}
                setErrors={setErrors}
                errorText={errorText}
                allBlocks={allBlocks}
                allFlats={allFlats}
                selectedBlock={selectedBlock}
                setSelectedBlock={setSelectedBlock}
                selectedFlat={selectedFlat}
                setSelectedFlat={setSelectedFlat}
                onBlockChange={handleBlockChange}
                vehicleNumber={vehicleNumber}
                setVehicleNumber={setVehicleNumber}
                vehicleType={vehicleType}
                setVehicleType={setVehicleType}
                vehicleModel={vehicleModel}
                setVehicleModel={setVehicleModel}
                color={color}
                setColor={setColor}
                stickerId={stickerId}
                setStickerId={setStickerId}
                rcDocument={rcDocument}
                setRcDocument={setRcDocument}
                flatId={flatId}
                handleSubmit={handleSubmit}
                onClose={resetForm}
                onFlatChange={handleFlatChange}
                selectedOwnerName={selectedOwnerName}
                rcDocumentUrl={rcDocumentUrl}
            />

            {/* ── Allocate Resident Parking Modal (your modal) ── */}
            <AllocateResidentParkingModal
                show={showParkingModal}
                onClose={() => {
                    setShowParkingModal(false);
                    setSelectedVehicleForParking(null);
                }}
                vehicle={selectedVehicleForParking}
                societyId={societyId}
                userId={userId}
                onSuccess={() =>
                    getVehicles({ sid: societyId, pg: page, searchText: search, vType: vehicleTypeFilter })
                }
            />
            <div
                className={`modal fade ${showDeleteModal ? "show d-block" : ""}`}
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">
                                Confirm Delete
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                            />
                        </div>

                        <div className="modal-body text-start">

                            <p className="mb-0">
                                Are you sure you want to delete vehicle{" "}
                                <strong>"{selectedVehicleNumber}"</strong>?
                            </p>

                        </div>

                        <div className="modal-footer">

                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-danger"
                                onClick={confirmDeleteVehicle}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default ListVehicleRegister;
