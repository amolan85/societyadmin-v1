import React, { useState, useMemo } from "react";
import Select from "react-select";
import "../../styles/MemberTransfer.css";
import { Badge } from "../../components/Common/ReusableFunction";
//import ConfirmModal from "../../components/Common/ConfirmModal"; // reuse your existing modal

/**
 * MemberTransfer — redesigned as a 4-step wizard:
 * 1. Member & Source Unit   2. Destination & Schedule
 * 3. Dues & Checklist       4. Documents & Review
 *
 * Wire-up notes (replace the mock data with real calls):
 * - searchMembersApi(query)               -> populate `memberOptions`
 * - getMembersByIdApi(societyId, memberId)-> populate `member`
 * - getAllBlocksApi / getAllFlatsApi      -> destination block/flat selects
 * - getFlatDuesApi(flatId)                -> outstanding maintenance / deposit
 * - TransferMemberApi(payload)            -> final submit in handleConfirmTransfer
 */

const STEPS = [
    { key: "member", label: "Member & Source" },
    { key: "destination", label: "Destination" },
    { key: "checklist", label: "Dues & Checklist" },
    { key: "review", label: "Documents & Review" },
];

const TRANSFER_TYPES = [
    { value: "intra", label: "Intra-Society Move (same owner/tenant)" },
    { value: "sale", label: "Ownership Sale / Resale" },
    { value: "tenant_handover", label: "Tenant Handover" },
];

const blockOptions = [
    { value: "A", label: "Block A" },
    { value: "B", label: "Block B" },
    { value: "C", label: "Block C" },
];

const flatOptionsByBlock = {
    A: [{ value: "A-201", label: "A-201 (Vacant)", vacant: true }, { value: "A-202", label: "A-202 (Occupied)", vacant: false }],
    B: [{ value: "B-201", label: "B-201 (Vacant)", vacant: true }, { value: "B-204", label: "B-204 (Vacant)", vacant: true }],
    C: [{ value: "C-101", label: "C-101 (Occupied)", vacant: false }],
};

const memberOptions = [
    { value: "MEM-1025", label: "Ruchi Gupta · A-102 · Owner" },
    { value: "MEM-1099", label: "Aakash Shah · B-304 · Tenant" },
];

const MemberTransfer = () => {
    const [step, setStep] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [selectedMember, setSelectedMember] = useState(null);
    const [member] = useState({
        name: "Ruchi Gupta",
        memberId: "MEM-1025",
        mobile: "9876543210",
        email: "ruchi35435@gmail.com",
        memberType: "Owner",
        currentBlock: "A",
        currentFloor: "1",
        currentFlat: "A-102",
        outstandingDues: 0,
        depositHeld: 25000,
    });

    const [form, setForm] = useState({
        transferType: null,
        block: null,
        flat: null,
        transferDate: "",
        reason: "",
        duesCleared: member.outstandingDues === 0,
        depositAction: "transfer", // transfer | refund | forfeit
        parkingUpdated: false,
        vehicleUpdated: false,
        accessCardUpdated: false,
        oldFlatStatus: "vacant", // vacant | relist | new-tenant
    });

    const [errors, setErrors] = useState({});

    const history = [
        { date: "10-Jun-2026", from: "A-102", to: "B-204", by: "Admin" },
        { date: "15-Jan-2026", from: "A-101", to: "A-102", by: "Manager" },
    ];

    const flatChoices = form.block ? flatOptionsByBlock[form.block.value] || [] : [];

    const setField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const validateStep = () => {
        const e = {};
        if (step === 1) {
            if (!form.transferType) e.transferType = "Select a transfer type";
            if (!form.block) e.block = "Select destination block";
            if (!form.flat) e.flat = "Select destination flat";
            if (!form.transferDate) e.transferDate = "Select a transfer date";
            if (form.flat && flatChoices.find((f) => f.value === form.flat.value)?.vacant === false) {
                e.flat = "This flat is currently occupied — pick a vacant unit or resolve the existing occupancy first";
            }
        }
        if (step === 2) {
            if (!form.duesCleared) e.duesCleared = "Outstanding dues must be cleared or explicitly waived before transfer";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const goNext = () => {
        if (!validateStep()) return;
        setStep((s) => Math.min(s + 1, STEPS.length - 1));
    };
    const goBack = () => setStep((s) => Math.max(s - 1, 0));

    const progressPct = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

    const handleConfirmTransfer = () => {
        // TODO: call TransferMemberApi(societyId, member.memberId, form)
        setShowConfirm(false);
        setSubmitted(true);
    };

    return (
        <div className="pg mt-wizard">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap">
                <div>
                    <div className="mt-breadcrumb text-start">Members › Transfer Member</div>
                    <h4 className="mt-title text-start">
                        Member Transfer
                        <Badge label={submitted ? "Submitted" : "Draft"} c={submitted ? "green" : "orange"} />
                    </h4>
                    <p className="mt-sub text-start">Move a resident from one flat to another inside the society</p>
                </div>
                <div>
                    <button className="btn-ol me-2">Cancel</button>
                    <button className="btn-ac" disabled={step !== STEPS.length - 1} onClick={() => setShowConfirm(true)}>
                        Submit Transfer
                    </button>
                </div>
            </div>

            {/* STEPPER */}
            <div className="mt-stepper sv-card mb-4">
                <div className="mt-stepper-track">
                    <div className="mt-stepper-fill" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="mt-stepper-labels">
                    {STEPS.map((s, i) => (
                        <button
                            key={s.key}
                            className={`mt-step-item ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
                            onClick={() => i < step && setStep(i)}
                        >
                            <span className="mt-step-index">{i < step ? "✓" : i + 1}</span>
                            <span className="mt-step-label">{s.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="row g-4">
                {/* LEFT: active step content */}
                <div className="col-lg-8">

                    {/* STEP 0 — Member & Source */}
                    {step === 0 && (
                        <div className="sv-card mb-4">
                            <h5 className="mb-3 text-start">Select Member</h5>

                            <div className="mb-3">
                                <label className="text-start d-block">Search member by name, unit, or member ID</label>
                                <Select
                                    options={memberOptions}
                                    value={selectedMember}
                                    onChange={setSelectedMember}
                                    placeholder="Type to search…"
                                    isClearable
                                />
                            </div>

                            <hr />

                            <h6 className="mb-3 text-muted text-start">Current Details</h6>
                            <div className="row">
                                <div className="col-md-3 text-center">
                                    <div className="mt-avatar">RG</div>
                                </div>
                                <div className="col-md-9">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="text-start d-block">Name</label>
                                            <input className="form-control" value={member.name} readOnly />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="text-start d-block">Member ID</label>
                                            <input className="form-control" value={member.memberId} readOnly />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="text-start d-block">Mobile</label>
                                            <input className="form-control" value={member.mobile} readOnly />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="text-start d-block">Email</label>
                                            <input className="form-control" value={member.email} readOnly />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="text-start d-block">Current Block</label>
                                            <input className="form-control" value={member.currentBlock} readOnly />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="text-start d-block">Current Floor</label>
                                            <input className="form-control" value={member.currentFloor} readOnly />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="text-start d-block">Current Flat</label>
                                            <input className="form-control" value={member.currentFlat} readOnly />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 1 — Destination & Schedule */}
                    {step === 1 && (
                        <div className="sv-card mb-4">
                            <h5 className="mb-3 text-start">Destination & Schedule</h5>

                            <div className="mb-3">
                                <label className="text-start d-block">Transfer Type</label>
                                <Select
                                    options={TRANSFER_TYPES}
                                    value={form.transferType}
                                    onChange={(v) => setField("transferType", v)}
                                    placeholder="Select transfer type"
                                />
                                {errors.transferType && <div className="mt-err">{errors.transferType}</div>}
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="text-start d-block">New Block</label>
                                    <Select
                                        options={blockOptions}
                                        value={form.block}
                                        onChange={(v) => { setField("block", v); setField("flat", null); }}
                                        placeholder="Select block"
                                    />
                                    {errors.block && <div className="mt-err">{errors.block}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="text-start d-block">New Flat</label>
                                    <Select
                                        options={flatChoices}
                                        value={form.flat}
                                        onChange={(v) => setField("flat", v)}
                                        placeholder={form.block ? "Select flat" : "Select block first"}
                                        isDisabled={!form.block}
                                    />
                                    {errors.flat && <div className="mt-err">{errors.flat}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="text-start d-block">Transfer Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={form.transferDate}
                                        onChange={(e) => setField("transferDate", e.target.value)}
                                    />
                                    {errors.transferDate && <div className="mt-err">{errors.transferDate}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="text-start d-block">Current Flat, After Transfer</label>
                                    <select
                                        className="form-select"
                                        value={form.oldFlatStatus}
                                        onChange={(e) => setField("oldFlatStatus", e.target.value)}
                                    >
                                        <option value="vacant">Mark as vacant</option>
                                        <option value="relist">Relist for sale/rent</option>
                                        <option value="new-tenant">New tenant already identified</option>
                                    </select>
                                </div>
                                <div className="col-md-12">
                                    <label className="text-start d-block">Reason for Transfer</label>
                                    <textarea
                                        rows="3"
                                        className="form-control"
                                        value={form.reason}
                                        onChange={(e) => setField("reason", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2 — Dues & Checklist */}
                    {step === 2 && (
                        <div className="sv-card mb-4">
                            <h5 className="mb-3 text-start">Dues & Checklist</h5>

                            <div className="mt-dues-row text-start">
                                <div>
                                    <div className="text-muted small">Outstanding Maintenance Dues</div>
                                    <div className="fw-bold">₹{member.outstandingDues.toLocaleString("en-IN")}</div>
                                </div>
                                <div>
                                    <div className="text-muted small">Security Deposit Held</div>
                                    <div className="fw-bold">₹{member.depositHeld.toLocaleString("en-IN")}</div>
                                </div>
                            </div>

                            <div className="form-check mt-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={form.duesCleared}
                                    onChange={(e) => setField("duesCleared", e.target.checked)}
                                />
                                <label className="form-check-label">No maintenance dues pending</label>
                            </div>
                            {errors.duesCleared && <div className="mt-err">{errors.duesCleared}</div>}

                            <div className="mb-3 mt-3">
                                <label className="text-start d-block">Security Deposit Action</label>
                                <select
                                    className="form-select"
                                    value={form.depositAction}
                                    onChange={(e) => setField("depositAction", e.target.value)}
                                >
                                    <option value="transfer">Carry forward to new flat</option>
                                    <option value="refund">Refund to member</option>
                                    <option value="forfeit">Forfeit (per society bylaws)</option>
                                </select>
                            </div>

                            <hr />

                            <div className="row">
                                {[
                                    ["parkingUpdated", "Parking allotment updated"],
                                    ["vehicleUpdated", "Vehicle mapping updated"],
                                    ["accessCardUpdated", "Access card / biometric updated"],
                                ].map(([key, label]) => (
                                    <div className="col-md-6 mb-3" key={key}>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={form[key]}
                                                onChange={(e) => setField(key, e.target.checked)}
                                            />
                                            <label className="form-check-label">{label}</label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3 — Documents & Review */}
                    {step === 3 && (
                        <>
                            <div className="sv-card mb-4">
                                <h5 className="mb-3 text-start">Documents</h5>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="text-start d-block">Approval Letter</label>
                                        <input type="file" className="form-control" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="text-start d-block">NOC Document</label>
                                        <input type="file" className="form-control" />
                                    </div>
                                    {form.transferType?.value === "sale" && (
                                        <div className="col-md-6 mb-3">
                                            <label className="text-start d-block">Sale Deed</label>
                                            <input type="file" className="form-control" />
                                        </div>
                                    )}
                                    <div className="col-md-12">
                                        <label className="text-start d-block">Remarks</label>
                                        <textarea rows="3" className="form-control" />
                                    </div>
                                </div>
                            </div>

                            <div className="sv-card">
                                <h5 className="mb-3 text-start">Review Summary</h5>
                                <div className="mt-review-grid text-start">
                                    <div><span className="text-muted">Member</span><strong>{member.name}</strong></div>
                                    <div><span className="text-muted">From</span><strong>{member.currentFlat}</strong></div>
                                    <div><span className="text-muted">To</span><strong>{form.flat?.label || "—"}</strong></div>
                                    <div><span className="text-muted">Type</span><strong>{form.transferType?.label || "—"}</strong></div>
                                    <div><span className="text-muted">Date</span><strong>{form.transferDate || "—"}</strong></div>
                                    <div><span className="text-muted">Dues Cleared</span><strong>{form.duesCleared ? "Yes" : "No"}</strong></div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* WIZARD NAV */}
                    <div className="d-flex justify-content-between mt-3">
                        <button className="btn-ol" onClick={goBack} disabled={step === 0}>Back</button>
                        {step < STEPS.length - 1 ? (
                            <button className="btn-ac" onClick={goNext}>Continue</button>
                        ) : (
                            <button className="btn-ac" onClick={() => setShowConfirm(true)}>Submit Transfer</button>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE — always visible */}
                <div className="col-lg-4">
                    <div className="sv-card mb-4">
                        <h5 className="mb-3 text-start">Current Status</h5>
                        <div className="mb-3 d-flex justify-content-between text-start">
                            <span>Current Flat</span><strong>{member.currentFlat}</strong>
                        </div>
                        <div className="mb-3 d-flex justify-content-between text-start">
                            <span>New Flat</span><strong>{form.flat?.label || "-"}</strong>
                        </div>
                        <div className="mb-3 d-flex justify-content-between text-start">
                            <span>Status</span>
                            <Badge label={submitted ? "Submitted" : "Pending"} c={submitted ? "green" : "orange"} />
                        </div>
                    </div>

                    <div className="sv-card">
                        <h5 className="mb-3 text-start">Transfer History</h5>
                        <table className="table table-sm">
                            <thead><tr><th className="text-start">Date</th><th className="text-start">From</th><th className="text-start">To</th></tr></thead>
                            <tbody>
                                {history.map((item, index) => (
                                    <tr key={index}>
                                        <td className="text-start">{item.date}</td><td className="text-start">{item.from}</td><td className="text-start">{item.to}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* CONFIRM MODAL — reuses your existing ConfirmModal component */}
            {/* <ConfirmModal
                show={showConfirm}
                title="Confirm Member Transfer"
                message={`Transfer ${member.name} from ${member.currentFlat} to ${form.flat?.label || "the selected flat"}?`}
                confirmLabel="Confirm Transfer"
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmTransfer}
            /> */}
        </div>
    );
};

export default MemberTransfer;
