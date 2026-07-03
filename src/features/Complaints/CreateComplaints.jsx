import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { Badge } from '../../components/Common/ReusableFunction';
import "../../styles/Broadcast.css"
import { GetSessionData } from '../../utils/SessionManagement';
import { CreateBroadcastApi } from '../../services/BroadcastApi';

import { CreatePollApi } from '../../services/PollApi';
import {
    createComplaintsApi,
    getFlatsAndCategoryApi,
    CreateComplaintCategoryApi,
    GetComplaintCategoriesApi,
    getComplaintsApi
} from '../../services/ComplaintsApi';
import { toast } from "react-toastify";

const CreateComplaints = ({ setActive }) => {
    const [category, setCategory] = useState(1);
    const [title, setTitle] = useState("")
    const [allunits, setAllunits] = useState([])
    const [unit, setUnit] = useState("")
    const [description, setDescription] = useState("")
    const [allCategory, setAllCategory] = useState([])
    const [priority, setPriority] = useState("")
    const [attachment, setAttachment] = useState()
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [societyId, setSocietyId] = useState("")
    const [userId, setUserId] = useState("")
    const [options, setOptions] = useState(new Array(4).fill(""));
    const [errors, setErrors] = useState({})
    const [errorText, setErrorText] = useState("")

    // ── Create Category modal state ──
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [categorySubmitting, setCategorySubmitting] = useState(false);
    const [categoryErrors, setCategoryErrors] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedName, setSelectedName] = useState("");
    const [deleting, setDeleting] = useState(false);
    // Create Confirmation
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [recentCommunications, setRecentCommunications] = useState([]);
const [loadingRecent, setLoadingRecent] = useState(false);

    const priorityTabs = [
        {
            id: "High",
            value: "high",
            // icon: "🔴"
        },
        {
            id: "Medium",
            value: "medium",
            // icon: "🟢"
        },
        {
            id: "Urgent",
            value: "urgent",
            // icon: "🚨"
        },
        {
            id: "Low",
            value: "low",
            // icon: "🟡"
        }
    ];

    // Load session data on component mount for get session data
    useEffect(() => {
        SessionData()
    }, [])

    //fetch get session data
    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)
        setUserId(data.data.user_id)

        //call get flats and category api
        GetFlatsAndCategory(flats.society_id)
        GetRecentCommunications(flats.society_id);
    }

    //handle change for options
    const handleOptionChange = (index, value) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    //get time function
    const getDateTime = (date) => {
        const now = new Date();

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        return `${date} ${hours}:${minutes}:${seconds}`;
    };

    const GetRecentCommunications = async (societyId) => {
    try {
        setLoadingRecent(true);

        const response = await getComplaintsApi(societyId);

        console.log("response =", response);
        console.log("list =", response.list);

        setRecentCommunications(response.list.slice(0, 3));

    } catch (error) {
        console.log(error);
    } finally {
        setLoadingRecent(false);
    }
};

    //fetch get flats and category api
    const GetFlatsAndCategory = async (societyId) => {

        try {
            const data = await getFlatsAndCategoryApi(societyId)
            console.log(data)
            setAllunits(
                data.flats.map((item) => ({
                    value: item.flat_id,
                    label: item.flat_number,
                }))
            );
            setAllCategory(data.categories)
        } catch (error) {
            console.error("Error fetching flats and categories:", error)
        }
    }

    // ── fetch category list for the Create Category modal ──
    const fetchCategoryList = async (sid) => {
        try {
            setCategoryLoading(true);
            const data = await GetComplaintCategoriesApi(sid);
            setCategoryList(data?.categories || data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        } finally {
            setCategoryLoading(false);
        }
    };

    const openCategoryModal = () => {
        setShowCategoryModal(true);
        fetchCategoryList(societyId);
    };

    const closeCategoryModal = () => {
        setShowCategoryModal(false);
        setCategoryName("");
        setCategoryDescription("");
        setCategoryErrors({});
    };

    const handleCreateCategory = async () => {
        if (!categoryName.trim()) {
            setCategoryErrors({ name: "required" });
            return;
        }

        try {
            setCategorySubmitting(true);
            await CreateComplaintCategoryApi(societyId, categoryName.trim(), categoryDescription.trim());
            toast.success("Category created successfully!");
            setCategoryName("");
            setCategoryDescription("");
            setCategoryErrors({});
            fetchCategoryList(societyId);   // refresh list inside modal
            GetFlatsAndCategory(societyId); // refresh category tabs on the main form
        } catch (error) {
            console.log(error);
            toast.error(error);
        } finally {
            setCategorySubmitting(false);
        }
    };

    //handle change for file
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setAttachment(selected);
        }
    };

    //handle change for drop file
    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setAttachment(droppedFile);
        }
    };

    //handle change for drag file
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    //validation for form
    const validateForm = () => {
        let errors = {};

        if (!title) {
            errors.title = "required";
        }

        if (!unit) {
            errors.unit = "required";
        }

        if (!description) {
            errors.description = "required";
        }

        if (!priority) {
            errors.priority = "required";
        }

        return errors;
    };

    // ── clear a single field error as soon as user fills it ──
    const clearError = (field) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    // ── clear a single category field error as soon as user fills it ──
    const clearCategoryError = (field) => {
        if (categoryErrors[field]) {
            setCategoryErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const categoryOptions = allCategory.map((item) => ({
        value: item.category_id,
        label: item.name,
    }));
    //create complaint function and fetch create complaint api
    const CreateComplaint = async (validateOnly = false) => {
        try {
            const validationErrors = validateForm();

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);

                if (validateOnly) return false;

                return;
            }

            if (validateOnly) return true;

            const data = await createComplaintsApi(
                societyId,
                userId,
                category,
                unit.value,
                title,
                description,
                unit,
                priority,
                attachment
            );

            console.log(data);
            toast.success("Complaints created successfully!")
            setActive("complaints");

        } catch (error) {
            console.log(error);
            toast.error(error);
            setErrorText(error)
        }
    };

    const handleConfirmSubmit = async () => {

        const valid = await CreateComplaint(true);

        if (!valid) return;

        setShowConfirmModal(true);
    };

    const confirmCreateComplaint = async () => {

        try {

            setSaving(true);

            await CreateComplaint();

            setShowConfirmModal(false);

        }
        finally {

            setSaving(false);

        }

    };

    return (
        <>
            <div className="pg row g-4 bc-wrap">
                {/* LEFT */}
                <div className="col-12 col-lg-8">
                    <div className="sv-card text-start">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="bc-title">Create Complaints</h5>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={openCategoryModal}
                                >
                                    Create Category
                                </button>
                                <button
                                    className="btn btn-sm btn-ac ms-2 btn-primary"
                                    onClick={() => setActive("complaints")}
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                        <div className="mb-3 text-start">
                            <label className="sv-lb">
                                Complaint Category <span className="text-danger">*</span>
                            </label>

                            <Select
                                options={categoryOptions}
                                placeholder="Select Complaint Category"
                                value={categoryOptions.find(
                                    (item) => item.value === category
                                )}
                                onChange={(selectedOption) => {
                                    setCategory(selectedOption.value);
                                }}
                            />
                        </div>
                        <div className='d-flex'>
                            <label className="sv-lb"> Title <span className='text-danger'>*</span></label>
                            {errors.title && <span className='text-danger mx-2 '>{errors.title}</span>}
                        </div>

                        <input className={`sv-in mb-3 ${errors.title ? "error-input" : ""}`} placeholder="Example: Scheduled Maintenance of Lift B"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                clearError("title");
                            }
                            } />

                        <div className='d-flex'>
                            <label className="sv-lb"> Unit <span className='text-danger'>*</span></label>
                            {errors.unit && <span className='text-danger mx-2 '>{errors.unit}</span>}
                        </div>

                        {/* <input className={`sv-in mb-3 ${errors.unit ? "error-input" : ""}`} placeholder="Example: Scheduled Maintenance of Lift B"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)} /> */}
                        <Select
                            options={allunits}
                            value={unit}                  // 👈 poora object
                            onChange={(selectedOption) => {
                                setUnit(selectedOption);
                                clearError("unit");

                            }} // 👈 direct object
                        />

                        <div className='d-flex mt-3'>
                            <label className="sv-lb" >Description <span className='text-danger'>*</span></label>
                            {errors.description && <span className='text-danger mx-2 '>{errors.description}</span>}

                        </div>


                        <div className={`bc-editor-box ${errors.description ? "error-input" : ""}`}>

                            <textarea
                                className="sv-ta bc-editor-textarea"
                                placeholder="Type your announcement details here…"
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    clearError("description");
                                }
                                }
                            />
                        </div>

                        <label className="sv-lb">Attachment (Optional)</label>
                        <div
                            className="upload-zone mb-4"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            style={{ cursor: "pointer" }}
                            onClick={() => document.getElementById("fileInput").click()}
                        >
                            <div className="bc-upload-icon">☁️</div>
                            <div className="bc-upload-title">
                                {attachment ? attachment.name : "Click to upload or drag files here"}
                            </div>
                            <div className="bc-upload-sub">PDF, JPG, PNG up to 10 MB</div>

                            <input
                                id="fileInput"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className='d-flex'>
                            <label className="sv-lb">Priority <span className='text-danger'>*</span></label>
                            {errors.priority && <span className='text-danger mx-2 '>{errors.priority}</span>}
                        </div>

                        <div className="priorityTab mt-2">
                            {priorityTabs.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        setPriority(t.value);
                                        clearError("priority");
                                    }
                                    }
                                    className={`priorityTab-btn ${priority === t.value ? "active" : ""}`}
                                >
                                    {t.icon} {t.id}
                                </button>
                            ))}
                        </div>
                        {errorText && <h6 className='text-danger'>{errorText}</h6>}
                        <div className="d-flex gap-2 justify-content-end">
                            <button
                                className="btn-ac"
                                onClick={handleConfirmSubmit}
                            >
                                Create Complaints
                            </button>
                        </div>

                    </div>
                </div>

                {/* RIGHT */}
                <div className="col-12 col-lg-4">

                   

                    {/* Quick Actions */}
                    <div className="sv-card mb-3">
                        <h6 className="bc-side-title text-start">Quick Actions</h6>

                        {/* Go to Notice Board */}
                        <button
                            className="qa mb-2"
                            onClick={() => setActive("noticeboard")}
                        >
                            <div
                                className="qa-ico"
                                style={{ background: "#ede9fe" }}
                            >
                                📋
                            </div>
                            <span className="bc-qa-text">
                                Notice Board
                            </span>
                        </button>

                        {/* Go to Polls & Voting */}
                        <button
                            className="qa mb-2"
                            onClick={() => setActive("polls")}
                        >
                            <div
                                className="qa-ico"
                                style={{ background: "#ffedd5" }}
                            >
                                🗳️
                            </div>
                            <span className="bc-qa-text">
                                Polls & Voting
                            </span>
                        </button>
                         
                        {/* Go Back */}
                        <button
                            className="qa"
                            onClick={() => setActive("complaints")}
                        >
                            <div
                                className="qa-ico"
                                style={{ background: "#dbeafe" }}
                            >
                                📡
                            </div>
                            <span className="bc-qa-text">
                                Complaint List
                            </span>
                        </button>
                    </div>

                    {/* Recent Communications */}
                    <div className="sv-card">
                        <h6 className="bc-side-title text-start">Recent Communications</h6>

                       {loadingRecent ? (
    <div className="text-center py-3">
        Loading...
    </div>
) : recentCommunications.length === 0 ? (
    <div className="text-center text-muted py-3">
        No recent complaints
    </div>
) : (
    recentCommunications.map((item, index) => (
        <div
            key={item.complaint_id}
            className={`bc-rc-item ${
                index < recentCommunications.length - 1 ? "bordered" : ""
            }`}
        >
            <div className="text-start">
                <div className="bc-rc-title">
                    {item.title}
                </div>

                <div className="bc-rc-sub">
                    {item.created_at} • {item.category_name}
                </div>
            </div>

            <Badge
                label={item.status}
                c={
                    item.status === "Resolved"
                        ? "green"
                        : item.status === "Pending"
                        ? "orange"
                        : "blue"
                }
            />
        </div>
    ))
)}

                        <button className="btn-dk w-100 mt-3"  onClick={() => setActive("complaints")}>Show all communication</button>
                    </div>

                </div>
            </div>

            {/* ── CREATE CATEGORY MODAL ── */}
            <div
                className={`modal fade ${showCategoryModal ? "show d-block" : ""}`}
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Complaint Categories</h5>
                            <button type="button" className="btn-close" onClick={closeCategoryModal} />
                        </div>
                        <div className="modal-body text-start">

                            <div className='d-flex'>
                                <label className="sv-lb">Category Name <span className='text-danger'>*</span></label>
                                {categoryErrors.name && <span className='text-danger mx-2'>{categoryErrors.name}</span>}
                            </div>
                            <input
                                className={`sv-in mb-3 ${categoryErrors.name ? "error-input" : ""}`}
                                placeholder="Example: Parking"
                                value={categoryName}
                                onChange={(e) => {
                                    setCategoryName(e.target.value);
                                    clearCategoryError("name");
                                }}
                            />

                            <label className="sv-lb">Description</label>
                            <textarea
                                className="sv-ta bc-editor-textarea mb-3"
                                placeholder="Example: Related to parking area"
                                value={categoryDescription}
                                onChange={(e) => setCategoryDescription(e.target.value)}
                            />

                            <div className="d-flex justify-content-end mb-4">
                                <button
                                    className="btn-ac"
                                    onClick={handleCreateCategory}
                                    disabled={categorySubmitting}
                                >
                                    {categorySubmitting ? "Adding..." : "Add Category"}
                                </button>
                            </div>

                            <hr />

                            <h6 className="bc-side-title mb-2">Existing Categories</h6>

                            {categoryLoading ? (
                                <div className="text-muted small">Loading categories...</div>
                            ) : categoryList.length === 0 ? (
                                <div className="text-muted small">No categories yet</div>
                            ) : (
                                <div style={{ maxHeight: 220, overflowY: "auto" }}>
                                    {categoryList.map((c, i) => (
                                        <div
                                            key={c.category_id || i}
                                            className="d-flex justify-content-between align-items-start py-2"
                                            style={{ borderBottom: i < categoryList.length - 1 ? "1px solid #f1f1f1" : "none" }}
                                        >
                                            <div>
                                                <div className="fw-semibold" style={{ fontSize: 14 }}>{c.name}</div>
                                                {c.description && (
                                                    <div className="text-muted" style={{ fontSize: 12 }}>{c.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeCategoryModal}>Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={`modal fade ${showConfirmModal ? "show d-block" : ""}`}
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">
                                Confirm Complaint Creation
                            </h5>

                            <button
                                className="btn-close"
                                onClick={() => setShowConfirmModal(false)}
                                disabled={saving}
                            />
                        </div>

                        <div className="modal-body text-start">

                            Are you sure you want to create this complaint?

                        </div>

                        <div className="modal-footer">

                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowConfirmModal(false)}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={confirmCreateComplaint}
                                disabled={saving}
                            >
                                {saving ? "Creating..." : "Create"}
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </>

    );


}

export default CreateComplaints