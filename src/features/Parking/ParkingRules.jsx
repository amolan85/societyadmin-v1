import { useState, useEffect } from "react";
import "../../styles/AddMember.css";
import { Badge, Pagination } from "../../components/Common/ReusableFunction";
import { GetSessionData } from "../../utils/SessionManagement";
import { toast } from "react-toastify";
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXls } from "react-icons/bs";
import { FiFilter, FiSearch } from "react-icons/fi";
import { CgExport } from "react-icons/cg";
import { exportFile, exportToPDF } from "../../components/Common/ExportFile";
import { BiImport } from "react-icons/bi";
import NewRuleModal from "./NewRuleModal";
import EditRuleModal from "./EditRuleModal";
import { createParkingRuleApi, deleteParkingRuleApi, getParkingRuleByIdApi, listParkingRulesApi, updateParkingRuleApi } from "../../services/ParkingRulesApi";
import ExportModal from "../../components/Common/ExportModal";


const ParkingRules = ({ setActive, setMemberId, setFlatId }) => {

    const [societyId, setSocietyId] = useState("");
    const [userId, setUserId] = useState("");
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const [editRuleShow, setEditRuleShow] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [mode, setMode] = useState("add");

    const [allParkingRules, setAllParkingRules] = useState([]);
    const [allExportParkingRules, setAllExportParkingRules] = useState([]);
    const [activeTab, setActiveTab] = useState("excel");
    const [exportModal, setExportModal] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [search, setSearch] = useState("");
    const [selectedRange, setSelectedRange] = useState("all");

    const [statusField, setStatusField] = useState(null);
    const [typeField, setTypeField] = useState(null);
    const [violationTypeField, setViolationTypeField] = useState(null);
    const [frequency, setFrequency] = useState(null);
    const [ruleTitle, setRuleTitle] = useState("");
    const [description, setDescription] = useState("");
    const [penalty, setPenalty] = useState("");
    const [ruleId, setRuleId] = useState("");

    const statusOptions = [
        {
            value: "active",
            label: "Active",
        },
        {
            value: "draft",
            label: "Draft",
        },
        {
            value: "under_review",
            label: "Under Review",
        },
    ]

    const typeOptions = [
        {
            value: "society_policy",
            label: "Society Policy",
        },
        {
            value: "law",
            label: "Law",
        },
    ]

    const violationTypeOptions = [
        {
            value: "unauthorized_parking",
            label: "Unauthorized Parking",
        },
        {
            value: "wrong_slot",
            label: "Wrong Slot",
        },

        {
            value: "double_parking",
            label: "Double Parking",
        },
        {
            value: "no_sticker",
            label: "No Sticker",
        },
        {
            value: "visitor_overstay",
            label: "Visitor Overstay",
        },
        {
            value: "other",
            label: "Other",
        },
    ]

    useEffect(() => {
        SessionData();
    }, []);

    const SessionData = async () => {
        const data = await GetSessionData();
        console.log(data.data);
        const flats = data.data.flats[0];
        setSocietyId(flats.society_id);
        setUserId(flats.user_id);
        getAllParkingRules(flats.society_id);

    };

    //function for get parking rules
    const getAllParkingRules = async (societyId, page) => {
        try {
            const data = await listParkingRulesApi(societyId, page, limit);
            setAllParkingRules(data.rules || []);
            setPage(data.page);
            setLimit(data.limit);
            setTotalCount(data.rules.length);
        } catch (error) {
            console.error("Error fetching parking rules:", error);
        }
    };

    //total count for pagination
    const total = Math.ceil(totalCount / limit);


    const getAllExportData = async (societyId) => {
        try {
            const data = await listParkingRulesApi(societyId);

            setAllExportParkingRules(data.rules);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    //validation for create parking rule
    const validateForm = () => {
        let errors = {};

        if (!ruleTitle?.trim()) {
            errors.ruleTitle = "required";
        }

        if (!description?.trim()) {
            errors.description = "required";
        }

        if (!typeField?.value) {
            errors.typeField = "required";
        }

        if (!statusField?.value) {
            errors.statusField = "required";
        }

        if (!violationTypeField?.value) {
            errors.violationTypeField = "required";
        }

        if (!penalty) {
            errors.penalty = "required";
        }

        return errors;
    };

    //function for create parking rule
    const createParkingRule = async () => {
        try {
            const validationErrors = validateForm();

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
            if (mode === "edit") {
                const data = await updateParkingRuleApi(societyId, ruleId, ruleTitle, description, typeField?.value, statusField?.value, violationTypeField?.value, penalty, userId);
                console.log(data, "update response");
                toast.success("Parking rule updated successfully");
            }
            else {
                const data = await createParkingRuleApi(societyId, ruleTitle, description, typeField?.value, statusField?.value, violationTypeField?.value, penalty, userId);
                console.log(data, "Create response");
                toast.success("Parking rule created successfully");
            }
            setShow(false);
            resetForm();
            getAllParkingRules(societyId, page);
        } catch (error) {
            console.error("Error fetching create parking rule:", error);
        }
    };

    //function for get parking rule
    const getParkingRuleById = async (ruleId) => {

        try {
            const data = await getParkingRuleByIdApi(societyId, ruleId);
            console.log(data, "Get response");
            setRuleTitle(data.rule_title);
            setDescription(data.rule_description);
            // setTypeField({ value: data.by, label: data.by });
            setTypeField(
                typeOptions.find((item) => item.value === data.by) || null
            );
               setStatusField(
                statusOptions.find((item) => item.value === data.status) || null
            );
            // setStatusField({ value: data.status, label: data.status });
            setViolationTypeField(
                violationTypeOptions.find((item) => item.value === data.violation_type) || null
            );
              setStatusField(
                statusOptions.find((item) => item.value === data.status) || null
            );
            setPenalty(data.penalty_amount);
            setRuleId(data.id);

        } catch (error) {
            console.error("Get Error:", error);
            toast.error(error);
        }
    };


    //function for delete parking rule
    const handleDelete = async (ruleId) => {
        const confirmed = window.confirm("Are you sure you want to delete this parking rule?");

        if (!confirmed) return;

        try {
            const data = await deleteParkingRuleApi(societyId, ruleId);
            console.log(data, "Delete response");
            toast.success("Parking rule deleted successfully");
            getAllParkingRules(societyId, page);
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error(error);
        }
    };

    //function for handle page change in pagination
    const handlePageChange = (value) => {
        setPage(value);
        getAllParkingRules(societyId, value);
    };

    //function for handle export data based on selected range
    const exportData =
        selectedRange === "all"
            ? allExportParkingRules
            : selectedRange === "search"
                ? allParkingRules
                : "";


    //function for download export data in excel, csv and pdf format
    const downloadExcel = async () => {
        exportFile({
            data: exportData,
            fileName: "Parking_Rules",
            sheetName: "Parking_Rules",
            type: "xlsx",
        });
    };

    const downloadCSV = async () => {
        exportFile({
            data: exportData,
            fileName: "Parking_Rules",
            sheetName: "Parking_Rules",
            type: "csv",
        });
    };

    const downloadPDF = () => {
        exportToPDF({
            title: "Parking Rules Report",
            fileName: "Parking_Rules",
            columns: [
                "Rule Id",
                "Rule Title",
                "Description",
                "Penalty Amount",
                "Type",
                "Status",
            ],
            data: exportData.map((item) => [
                item.id,
                item.rule_title,
                item.rule_description,
                item.penalty_amount,
                item.by,
                item.status,
            ]),
        });
    };

    const handleExport = () => {
        if (activeTab === "excel") {
            downloadExcel();
            setExportModal(false);
        } else if (activeTab === "csv") {
            downloadCSV();
            setExportModal(false);
        } else if (activeTab === "pdf") {
            downloadPDF();
            setExportModal(false);
        }
    };


    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);

        try {
            if (!value.trim()) {
                setPage(1);
                const data = await listParkingRulesApi(societyId, page, limit);
                setAllParkingRules(data?.rules || []);
            }
            if (value.length < 2) return;

            const data = await listParkingRulesApi(societyId, page, limit, value);

            setAllParkingRules(data?.rules || []);
        } catch (error) {
            console.error("Search error:", error);
        }
    };


    const resetForm = () => {
        setRuleTitle("");
        setDescription("");
        setTypeField(null);
        setStatusField(null);
        setViolationTypeField(null);
        setPenalty("");
        setErrors({});
        setErrorText("");
    };

    return (
        <>
            <div className="pg cp-wrap">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 text-start">
                    <div>
                        <h4 className="cp-title">Parking Rules & Regulations</h4>
                        <p className="cp-sub">
                            Manage enforcement policies, penalties, and parking by-laws.
                        </p>
                    </div>
                    <div className='d-flex'>

                        <button className="btn btn-sm btn-ac ms-2 btn-primary" onClick={() => {
                            resetForm();
                            setShow(true)
                            setMode("add");
                        }}>+ Create Rule</button>

                        <button className="btn btn-sm btn-ac ms-2 btn-primary" onClick={() => setActive("parkingDashboard")}>Back</button>


                    </div>

                </div>

                <div className="d-flex justify-content-between align-items-center mb-4 text-start">
                    {/* <div>
                        <h4 className="cp-title">Members</h4>
                        <p className="cp-sub">
                            Manage and track all society members
                        </p>
                    </div> */}
                    <div className="col-12 col-md-4 col-lg-3 position-relative">
                        <span
                            style={{
                                position: "absolute",
                                left: "15px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#aaa",
                            }}
                        >
                            <FiSearch size={16} />
                        </span>

                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="Search history"
                            value={search}
                            // onChange={(e) => setSearch(e.target.value)}
                            onChange={handleSearch}
                            style={{ paddingLeft: "35px" }}
                        />
                    </div>
                    <div className="d-flex">
                        <button
                            className="btn btn-sm filter-btn d-flex align-items-center gap-2 bg-white"
                            data-bs-toggle="dropdown"
                        >
                            <FiFilter size={14} />
                            Filter
                        </button>
                        <button
                            className="btn btn-sm filter-btn d-flex align-items-center gap-2 bg-white ms-2"
                            data-bs-toggle="dropdown"
                            onClick={() => {
                                getAllExportData(societyId);
                                setExportModal(true);
                            }}
                        >
                            <BiImport size={14} />
                            Export
                        </button>
                    </div>
                </div>
                <div className="sv-card p-0 overflow-hidden">
                    <div className="sa-table-wrap">
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    <th>RULE ID</th>
                                    <th>RULE TITLE</th>
                                    <th>TYPE</th>
                                    <th>PENALTY</th>
                                    <th>STATUS</th>
                                    <th className="text-center">ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allParkingRules.map((item, index) => (
                                    <tr key={index}>
                                        {/* Unit */}
                                        <td className="text-start">
                                            <div className="fw-bold">#RULE-P-{item.id}</div>

                                        </td>
                                        <td className="text-start">
                                            <div className="fw-bold">{item.rule_title}</div>
                                            <small className="text-muted">
                                                {item.rule_description}
                                            </small>
                                        </td>


                                        {/* KYC */}
                                        <td className="text-start">
                                            {/* <span
                                                className={`badge rounded-pill bg-${item.kycColor}-subtle text-${item.kycColor}`}
                                            >
                                                {item.kycIcon} {item.kycStatus}
                                            </span> */}
                                            <Badge
                                                label={item.by === "law" ? "By Law" : item.by === "society_policy" ? " Policy" : ""}
                                                c={
                                                    item.by === "law"
                                                        ? "blue"
                                                        : item.by === "society_policy"
                                                            ? "gray"

                                                            : "gray"
                                                }
                                            />{" "}

                                        </td>
                                        <td className="text-start">
                                            <div className="fw-bold">{item.penalty_amount}</div>

                                        </td>
                                        {/* Agreement */}
                                        <td className="text-start">
                                            {/* <span
                                                className={`badge rounded-pill bg-${item.agreementColor}-subtle text-${item.agreementColor}`}
                                            >
                                                {item.agreementIcon} {item.status}
                                            </span> */}
                                            <Badge
                                                label={item.status === "active" ? "Active" : item.status === "draft" ? "Draft" : item.status === "under_review" ? "Reviewing" : ""}
                                                c={
                                                    item.status === "active"
                                                        ? "green"
                                                        : item.status === "draft"
                                                            ? "red"
                                                            : item.status === "under_review"
                                                                ? "orange"
                                                                : "gray"
                                                }
                                            />{" "}
                                        </td>

                                        {/* Action */}
                                        {/* <td className="text-start">
                                            <button
                                                className={`btn btn-sm btn-outline-${item.actionColor}`}
                                           onClick={()=>setActive("rentalsApplication")}
                                           >
                                                {item.action}
                                            </button>
                                        </td> */}
                                        <td className="text-start">
                                            <div className="member-action-dropdown dropdown">
                                                <button
                                                    className="member-action-btn"
                                                    type="button"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    ⋮
                                                </button>

                                                <ul className="dropdown-menu member-action-menu dropdown-menu-end">
                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                        // onClick={() =>
                                                        //     getMembersById(s.user_id, s.flat_id)
                                                        // }
                                                        // onClick={() => setActive("viewParkingDetails")}
                                                        >
                                                            View Details
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                            onClick={() => {

                                                                setShow(true)
                                                                setMode("edit");
                                                                getParkingRuleById(item.id);
                                                            }}
                                                        >
                                                            Edit Rules
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <hr className="dropdown-divider" />
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item member-action-delete"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            Delete Rules
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

                    {/* Pagination */}
                    <Pagination page={page} total={total} onChange={handlePageChange} />
                </div>
            </div>
            <NewRuleModal
                mode={mode}
                show={show}
                setShow={setShow}

                statusOptions={statusOptions}
                statusField={statusField}
                setStatusField={setStatusField}

                typeOptions={typeOptions}
                typeField={typeField}
                setTypeField={setTypeField}

                violationTypeOptions={violationTypeOptions}
                violationTypeField={violationTypeField}
                setViolationTypeField={setViolationTypeField}

                ruleTitle={ruleTitle}
                setRuleTitle={setRuleTitle}

                description={description}
                setDescription={setDescription}

                frequency={frequency}
                setFrequency={setFrequency}

                penalty={penalty}
                setPenalty={setPenalty}

                handleSubmit={createParkingRule}
                errors={errors}
                resetForm={resetForm}
            />

            {/* <EditRuleModal
                editRuleShow={editRuleShow}
                setEditRuleShow={setEditRuleShow}

                statusOptions={statusOptions}
                statusField={statusField}
                setStatusField={setStatusField}

                typeOptions={typeOptions}
                typeField={typeField}
                setTypeField={setTypeField}
            /> */}
            <ExportModal
                show={exportModal}
                onClose={() => setExportModal(false)}
                onExport={handleExport}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedRange={selectedRange}
                setSelectedRange={setSelectedRange}
                totalRecords={allExportParkingRules.length}
                currentRecords={allParkingRules.length}
            />
        </>
    );
};

export default ParkingRules;
