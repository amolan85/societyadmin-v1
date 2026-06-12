import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getViolationAlertByIdApi } from "../../services/ViolationAlertsApi";
import { GetSessionData } from "../../utils/SessionManagement";

const ViolationDetails = ({
    violationId,
    setActive,
}) => {
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState(null);
    const [societyId, setSocietyId] = useState(null);

    useEffect(() => {
        loadSession();
    }, []);

    useEffect(() => {
        if (societyId && violationId) {
            getViolationDetails();
        }
    }, [societyId, violationId]);

////////////////////////////
    const fetchViolationDetails = async () => {
    try {
        setLoading(true);

        const data = await getViolationAlertByIdApi(violationId);

        console.log("Violation Data:", data);

        setViolationData(data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
};
/////////////////////
    const loadSession = async () => {
        try {
            const session = await GetSessionData();

            const flats = session?.data?.flats?.[0];

            if (flats?.society_id) {
                setSocietyId(flats.society_id);
            }
        } catch (error) {
            console.error("Session Error:", error);
        }
    };

    const getViolationDetails = async () => {
        try {
            setLoading(true);

            console.log("Society ID:", societyId);
            console.log("Violation ID:", violationId);

            const response = await getViolationAlertByIdApi(
                societyId,
                violationId
            );

            console.log("Violation Details Response:", response);

            setDetails(
                response?.violation ||
                response?.data ||
                response
            );
        } catch (error) {
            console.error("Violation Details Error:", error);
            console.log("Backend Response:", error?.response?.data);

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to fetch violation details"
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="pg">
                <h5>Loading...</h5>
            </div>
        );
    }

    return (
        <div className="pg cp-wrap">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="cp-title">Violation Details</h4>
                    <p className="cp-sub">
                        Complete information about the violation alert.
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => setActive("violationAlerts")}
                >
                    Back
                </button>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <div className="row g-4">

                        <div className="col-md-6">
                            <label className="fw-bold">Violation Type</label>
                            <div>{details?.violation_type || "-"}</div>
                        </div>

                        <div className="col-md-6">
                            <label className="fw-bold">Status</label>
                            <div>{details?.status || "-"}</div>
                        </div>

                        <div className="col-md-6">
                            <label className="fw-bold">Slot Number</label>
                            <div>{details?.slot_number || "-"}</div>
                        </div>

                        <div className="col-md-6">
                            <label className="fw-bold">Vehicle Number</label>
                            <div>{details?.vehicle_number || "-"}</div>
                        </div>

                        <div className="col-md-6">
                            <label className="fw-bold">Penalty Amount</label>
                            <div>₹ {details?.penalty_amount || 0}</div>
                        </div>

                        <div className="col-md-6">
                            <label className="fw-bold">Vehicle Type</label>
                            <div>{details?.vehicle_type || "-"}</div>
                        </div>

                        <div className="col-md-12">
                            <label className="fw-bold">Description</label>
                            <div>{details?.description || "-"}</div>
                        </div>

                        <div className="col-md-6">
                            <label className="fw-bold">Created By</label>
                            <div>{details?.reported_by_name || "-"}</div>
                        </div>

                        <div className="col-md-6">
                            <label className="fw-bold">Created Date</label>
                            <div>{details?.created_at || "-"}</div>
                        </div>

                        {details?.photo_url && (
                            <div className="col-md-12">
                                <label className="fw-bold">
                                    Evidence Photo
                                </label>

                                <div className="mt-2">
                                    <img
                                        src={details.photo_url}
                                        alt="Violation"
                                        className="img-fluid rounded border"
                                        style={{
                                            maxHeight: "350px",
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViolationDetails;