import React, { useState, useEffect } from 'react'
import "../../styles/Rules.css"
import { Badge } from '../../components/Common/ReusableFunction';
import { GetSessionData } from '../../utils/SessionManagement';
import { toast } from 'react-toastify';
import {
  listParkingRulesApi,
  createParkingRuleApi,
  getParkingRuleApi,
  updateParkingRuleStatusApi,
  updateParkingRuleApi,
  deleteParkingRuleApi,
} from '../../services/RulesApi';

const APPLIES_TO_OPTIONS = ["all", "owner", "tenant", "visitor"];

const Rules = () => {
  const [societyId, setSocietyId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [allRules, setAllRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null); // rule currently being updated

  // list filters (map 1:1 to ListParkingRules request body)
  const [search, setSearch] = useState("");
  const [appliesToFilter, setAppliesToFilter] = useState("");
  const [violationTypeFilter, setViolationTypeFilter] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState(""); // "" | "1" | "0"
  const [showFilters, setShowFilters] = useState(false);

  // pagination (from ListParkingRules response)
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Create By-law modal
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [ruleTitle, setRuleTitle] = useState("");
  const [ruleDescription, setRuleDescription] = useState("");
  const [appliesTo, setAppliesTo] = useState("all");
  const [violationType, setViolationType] = useState("");
  const [penaltyAmount, setPenaltyAmount] = useState("");
  const [penaltyDescription, setPenaltyDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // set when the modal is in "edit" mode (holds the rule id being edited)
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [editLoadingId, setEditLoadingId] = useState(null); // rule id currently being fetched for edit

  // rule pending a status-change confirmation (popup) — used for both activate & deactivate
  const [confirmStatusRule, setConfirmStatusRule] = useState(null);

  // id of the rule whose ⋮ actions dropdown is currently open
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    SessionData();
  }, []);

  const SessionData = async () => {
    try {
      const data = await GetSessionData();
      const flats = data.data.flats[0];
      setSocietyId(flats.society_id);

      // TODO: confirm the real field name by checking `console.log(data.data)`
      // and adjust this fallback chain to match your session payload.
      const currentUserId =
        data.data.user_id ??
        data.data.id ??
        data.data.user?.id ??
        null;
      setUserId(currentUserId);

      if (!currentUserId) {
        console.warn(
          "Could not resolve logged-in user id from session data — check GetSessionData() response shape.",
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!societyId) return;
    getRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [societyId, page]);

  // close the ⋮ actions dropdown when clicking outside of it
  useEffect(() => {
    if (!openMenuId) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest(".rl-action-menu-wrap")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  // reset to page 1 and refetch whenever a filter changes (debounced for search)
  useEffect(() => {
    if (!societyId) return;
    const timer = setTimeout(() => {
      if (page === 1) {
        getRules();
      } else {
        setPage(1);
      }
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, appliesToFilter, violationTypeFilter, isActiveFilter]);

  const getRules = async () => {
    try {
      setLoading(true);
      const res = await listParkingRulesApi(
        societyId,
        page,
        limit,
        search,
        appliesToFilter,
        violationTypeFilter,
        isActiveFilter === "" ? null : isActiveFilter === "1",
      );
      // listParkingRulesApi already returns response.data.data,
      // i.e. { limit, page, rules, total, total_pages } directly — no extra unwrap needed.
      const payload = res || {};
      setAllRules(payload.rules ?? []);
      setTotal(payload.total ?? 0);
      setTotalPages(payload.total_pages ?? 1);
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setAppliesToFilter("");
    setViolationTypeFilter("");
    setIsActiveFilter("");
  };

  // Builds a compact page list like: 1 … 4 5 6 … 12
  const getPageNumbers = () => {
    const pages = [];
    const windowSize = 1;

    for (let p = 1; p <= totalPages; p++) {
      const isEdge = p === 1 || p === totalPages;
      const isNearCurrent = Math.abs(p - page) <= windowSize;
      if (isEdge || isNearCurrent) {
        pages.push(p);
      } else if (pages[pages.length - 1] !== "…") {
        pages.push("…");
      }
    }
    return pages;
  };

  const resetForm = () => {
    setRuleTitle("");
    setRuleDescription("");
    setAppliesTo("all");
    setViolationType("");
    setPenaltyAmount("");
    setPenaltyDescription("");
    setIsActive(true);
    setErrors({});
    setEditingRuleId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShow(true);
  };

  const validateForm = () => {
    let err = {};
    if (!ruleTitle) err.ruleTitle = "required";
    if (!appliesTo) err.appliesTo = "required";
    if (!penaltyAmount) err.penaltyAmount = "required";
    return err;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!userId) {
      toast.error("Could not identify the logged-in user. Please re-login and try again.");
      return;
    }

    // NOTE: updateParkingRuleApi now sends title/description/applies_to/violation_type/
    // penalty/status together — make sure the same fields are added to the
    // UpdateParkingRule stored procedure on the backend, or they'll be silently ignored.
    try {
      if (editingRuleId) {
        await updateParkingRuleApi(
          societyId,
          editingRuleId,
          ruleTitle,
          ruleDescription,
          appliesTo,
          violationType,
          penaltyAmount,
          penaltyDescription,
          isActive,
        );
        toast.success("Rule updated successfully!");
      } else {
        await createParkingRuleApi(
          societyId,
          ruleTitle,
          ruleDescription,
          appliesTo,
          "society_policy",
          "active",
          violationType,
          penaltyAmount,
          penaltyDescription,
          isActive,
          userId,
        );
        toast.success("Rule created successfully!");
      }
      setShow(false);
      getRules();
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  // ---- toggle a rule's active/inactive status ----
  // Hits POST /api/parking_violation/UpdateParkingRule with { rule_id, is_active }
  // Both activating and deactivating ask for confirmation first (popup).
  const requestToggleStatus = (rule) => {
    setConfirmStatusRule(rule);
  };

  const performToggleStatus = async (rule) => {
    const nextStatus = !rule.is_active;
    setTogglingId(rule.id);

    // optimistic update so the UI feels instant
    setAllRules((prev) =>
      prev.map((r) => (r.id === rule.id ? { ...r, is_active: nextStatus } : r)),
    );

    try {
      await updateParkingRuleStatusApi(societyId, rule.id, nextStatus);
      toast.success(`Rule marked as ${nextStatus ? "active" : "inactive"}.`);
    } catch (error) {
      console.log(error);
      // revert on failure
      setAllRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, is_active: rule.is_active } : r)),
      );
      toast.error(error);
    } finally {
      setTogglingId(null);
    }
  };

  const confirmStatusChange = () => {
    if (confirmStatusRule) {
      performToggleStatus(confirmStatusRule);
    }
    setConfirmStatusRule(null);
  };

  // ---- fetch full rule details and open the modal in edit mode ----
  // Hits POST /api/parking_violation/GetParkingRule with { rule_id }
  const handleEditRule = async (rule) => {
    setEditLoadingId(rule.id);
    try {
      const data = await getParkingRuleApi(societyId, rule.id);
      const r = data || rule; // fallback to the row data if API returns nothing

      setEditingRuleId(rule.id);
      setRuleTitle(r.rule_title || "");
      setRuleDescription(r.rule_description || "");
      setAppliesTo(r.applies_to || "all");
      setViolationType(r.violation_type || "");
      setPenaltyAmount(r.penalty_amount || "");
      setPenaltyDescription(r.penalty_description || "");
      setIsActive(!!r.is_active);
      setErrors({});
      setShow(true);
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setEditLoadingId(null);
    }
  };

  // Infer BY-LAW vs FINE badge for the TYPE column.
  // Adjust this to read an actual `rule_type` field from the API once available.
  const getRuleTypeLabel = (r) => (r.violation_type ? "FINE" : "BY-LAW");

  // ---- derived stats (Total Rules from API total; rest from currently loaded page) ----
  const activeRules = allRules.filter((r) => r.is_active).length;
  const violationRules = allRules.filter((r) => !!r.violation_type).length;
  const totalPenaltyValue = allRules.reduce(
    (sum, r) => sum + (Number(r.penalty_amount) || 0),
    0,
  );

  return (

    <div className="pg row g-4 rl-wrap">

      {/* LEFT */}
      <div className="col-12 col-lg-12">

        {/* Stats */}
        <div className="row g-3 mb-4">
          {[
            ["👥", "#dbeafe", "Total Rules", total, `${activeRules} active on this page`],
            ["⚠️", "#fee2e2", "Violation Instances", violationRules, "Pending review"],
            ["💰", "#dcfce7", "Penalty Collection", `₹${totalPenaltyValue}`, "Avg. penalty across rules"],
          ].map(([ic, bg, l, v, m]) => (
            <div className="col-4" key={l}>
              <div
                className="sv-card"
                style={{
                  position: "relative",
                  padding: "18px 20px",
                  minHeight: 100,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    flexShrink: 0,
                  }}
                >
                  {ic}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                    marginBottom: 8,
                    paddingRight: 40,
                  }}
                >
                  {l}
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#1B3358",
                    lineHeight: 1.15,
                    marginBottom: 6,
                  }}
                >
                  {v}
                </div>
                <div style={{ fontSize: 12, color: "#8A94A6" }}>{m}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="sv-card p-0 overflow-hidden text-start">

          <div className="d-flex justify-content-between align-items-center px-4 py-3">
            <h6 className="rl-title">Active Rules & By-laws</h6>

            <div className="d-flex gap-2">
              <button className="btn-ac px-3" onClick={openAddModal}>
                + Create Rule
              </button>
              <button className="btn-ol rl-btn" onClick={() => setShowFilters((s) => !s)}>
                ▾ Filter
              </button>
              <button className="btn-ol rl-btn">⬆ Report</button>
            </div>
          </div>

          {showFilters && (
            <div className="px-4 pb-3 d-flex flex-wrap gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search rules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ maxWidth: 180 }}
              />

              <select
                className="form-select form-select-sm"
                value={appliesToFilter}
                onChange={(e) => setAppliesToFilter(e.target.value)}
                style={{ maxWidth: 140 }}
              >
                <option value="">All scopes</option>
                {APPLIES_TO_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>

              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Violation type..."
                value={violationTypeFilter}
                onChange={(e) => setViolationTypeFilter(e.target.value)}
                style={{ maxWidth: 160 }}
              />

              <select
                className="form-select form-select-sm"
                value={isActiveFilter}
                onChange={(e) => setIsActiveFilter(e.target.value)}
                style={{ maxWidth: 130 }}
              >
                <option value="">All status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>

              <button className="btn btn-sm btn-ad grey-btn" onClick={clearFilters}>
                Clear
              </button>
            </div>
          )}

          <div className="rl-table-wrap">
            <table className="sv-tbl">
              <thead>
                <tr>
                  <th>RULE TITLE</th>
                  <th>APPLICABILITY</th>
                  <th>PENALTY</th>
                  <th>TYPE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      Loading rules...
                    </td>
                  </tr>
                ) : allRules.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      No rules found
                    </td>
                  </tr>
                ) : (
                  allRules.map((r) => (
                    <tr key={r.id}>

                      <td>
                        <div className="rl-rule-title">{r.rule_title}</div>
                        <div className="rl-sub">{r.rule_description}</div>
                      </td>

                      <td className="rl-muted">
                        🔒 {r.applies_to}
                      </td>

                      <td className="rl-penalty" title={r.penalty_description || ""}>
                        {r.penalty_description || `₹${r.penalty_amount}`}
                      </td>

                      <td>
                        <Badge
                          label={getRuleTypeLabel(r)}
                          c={getRuleTypeLabel(r) === "FINE" ? "orange" : "blue"}
                        />
                      </td>

                      <td>
                        <Badge
                          label={r.is_active ? "ACTIVE" : "INACTIVE"}
                          c={r.is_active ? "blue" : "gray"}
                        />
                      </td>

                      <td style={{ position: "relative" }}>
                        <div className="rl-action-menu-wrap" style={{ position: "relative", display: "inline-block" }}>
                          <button
                            type="button"
                            onClick={() => setOpenMenuId(openMenuId === r.id ? null : r.id)}
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              fontSize: 18,
                              lineHeight: 1,
                              color: "#4B5563",
                              padding: "4px 8px",
                              borderRadius: 6,
                            }}
                            title="Actions"
                          >
                            ⋮
                          </button>

                          {openMenuId === r.id && (
                            <div
                              style={{
                                position: "absolute",
                                top: "100%",
                                right: 0,
                                marginTop: 4,
                                background: "#fff",
                                border: "1px solid #E5E7EB",
                                borderRadius: 8,
                                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                                minWidth: 150,
                                zIndex: 20,
                                overflow: "hidden",
                                textAlign: "left",
                              }}
                            >
                              <button
                                type="button"
                                disabled={editLoadingId === r.id}
                                onClick={() => {
                                  handleEditRule(r);
                                  setOpenMenuId(null);
                                }}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  border: "none",
                                  background: "none",
                                  padding: "10px 14px",
                                  fontSize: 13.5,
                                  color: "#1B3358",
                                  textAlign: "left",
                                  cursor: editLoadingId === r.id ? "wait" : "pointer",
                                  opacity: editLoadingId === r.id ? 0.6 : 1,
                                }}
                              >
                                {editLoadingId === r.id ? "Loading..." : "Edit Rule"}
                              </button>

                              <div style={{ borderTop: "1px solid #F0F1F4" }} />

                              <button
                                type="button"
                                disabled={togglingId === r.id}
                                onClick={() => {
                                  requestToggleStatus(r);
                                  setOpenMenuId(null);
                                }}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  border: "none",
                                  background: "none",
                                  padding: "10px 14px",
                                  fontSize: 13.5,
                                  color: r.is_active ? "#DC2626" : "#16A34A",
                                  textAlign: "left",
                                  cursor: togglingId === r.id ? "wait" : "pointer",
                                  opacity: togglingId === r.id ? 0.6 : 1,
                                }}
                              >
                                {r.is_active ? "Deactivate Rule" : "Activate Rule"}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="rl-footer d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span className="rl-sub">
              Page {page} of {totalPages || 1} • {total} total rules
            </span>

            <div className="d-flex align-items-center gap-1">
              <button
                className="rl-link"
                style={{
                  border: "none",
                  background: "none",
                  opacity: page <= 1 ? 0.4 : 1,
                  cursor: page <= 1 ? "not-allowed" : "pointer",
                }}
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Prev
              </button>

              {getPageNumbers().map((p, idx) =>
                p === "…" ? (
                  <span key={`ellipsis-${idx}`} className="rl-sub" style={{ padding: "0 4px" }}>
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      minWidth: 28,
                      height: 28,
                      borderRadius: 6,
                      border: p === page ? "none" : "1px solid #E3E6EC",
                      background: p === page ? "#1B3358" : "transparent",
                      color: p === page ? "#fff" : "#1B3358",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                className="rl-link"
                style={{
                  border: "none",
                  background: "none",
                  opacity: page >= totalPages ? 0.4 : 1,
                  cursor: page >= totalPages ? "not-allowed" : "pointer",
                }}
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next →
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* CREATE / EDIT RULE MODAL */}
      {show && (
        <>
          <div className="modal-backdrop fade show"></div>

          <div className="modal show d-block">
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-semibold">
                    {editingRuleId ? "Edit By-law" : "Create By-law"}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShow(false)}
                  ></button>
                </div>

                <div className="modal-body text-start">
                  <div className="mb-3">
                    <div className="d-flex">
                      <label className="sv-lb">
                        Rule Title <span className="text-danger">*</span>
                      </label>
                      {errors.ruleTitle && (
                        <span className="text-danger mx-2">{errors.ruleTitle}</span>
                      )}
                    </div>
                    <input
                      className="sv-in"
                      placeholder="e.g., No Unauthorized Parking"
                      value={ruleTitle}
                      onChange={(e) => setRuleTitle(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="sv-lb">Rule Description</label>
                    <textarea
                      className="sv-in"
                      rows={2}
                      placeholder="Describe the rule"
                      value={ruleDescription}
                      onChange={(e) => setRuleDescription(e.target.value)}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <div className="d-flex">
                        <label className="sv-lb">
                          Applies To <span className="text-danger">*</span>
                        </label>
                        {errors.appliesTo && (
                          <span className="text-danger mx-2">{errors.appliesTo}</span>
                        )}
                      </div>
                      <select
                        className="form-select form-control"
                        value={appliesTo}
                        onChange={(e) => setAppliesTo(e.target.value)}
                      >
                        {APPLIES_TO_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <div className="d-flex">
                        <label className="sv-lb">
                          Penalty Amount <span className="text-danger">*</span>
                        </label>
                        {errors.penaltyAmount && (
                          <span className="text-danger mx-2">{errors.penaltyAmount}</span>
                        )}
                      </div>
                      <input
                        className="sv-in"
                        type="number"
                        placeholder="e.g., 500"
                        value={penaltyAmount}
                        onChange={(e) => setPenaltyAmount(e.target.value)}
                      />
                    </div>

                  </div>

                  <div className="mb-1">
                    <label className="sv-lb">Penalty Description</label>
                    <textarea
                      className="sv-in"
                      rows={2}
                      placeholder="e.g., Rs.500 fine for first offence. Rs.1000 for repeat within 30 days."
                      value={penaltyDescription}
                      onChange={(e) => setPenaltyDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    className="btn btn-sm btn-ad grey-btn"
                    onClick={() => setShow(false)}
                  >
                    Cancel
                  </button>

                  <button className="btn-ac px-4" onClick={handleSubmit}>
                    {editingRuleId ? "Save Changes" : "Add Rule"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ACTIVATE / DEACTIVATE CONFIRMATION POPUP */}
      {confirmStatusRule && (
        <>
          <div className="modal-backdrop fade show"></div>

          <div className="modal show d-block">
            <div className="modal-dialog modal-sm modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-light">
                  <h6 className="modal-title fw-semibold mb-0">
                    {confirmStatusRule.is_active ? "Deactivate Rule?" : "Activate Rule?"}
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setConfirmStatusRule(null)}
                  ></button>
                </div>

                <div className="modal-body text-start">
                  <p className="mb-0">
                    Are you sure you want to {confirmStatusRule.is_active ? "deactivate" : "activate"}{" "}
                    <strong>{confirmStatusRule.rule_title}</strong>?{" "}
                    {confirmStatusRule.is_active
                      ? "It will no longer apply until reactivated."
                      : "It will start applying immediately."}
                  </p>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    className="btn btn-sm btn-ad grey-btn"
                    onClick={() => setConfirmStatusRule(null)}
                  >
                    Cancel
                  </button>

                  <button
                    className={`btn btn-sm ${confirmStatusRule.is_active ? "btn-danger" : "btn-success"}`}
                    onClick={confirmStatusChange}
                  >
                    {confirmStatusRule.is_active ? "Yes, Deactivate" : "Yes, Activate"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Rules
