// CheckOutVisitorModal.jsx
import { BiCheck } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import "../../styles/Parking.css";
const CheckOutVisitorModal = ({
    checkoutShow,
    setCheckoutShow,
    visitorData,
    onConfirm,
    errors = {},
    errorText = "",
    handleSubmit = () => { },
    mode,
}) => {
    if (!checkoutShow) return null;
    const formatEntryTime = (dateStr) => {
        if (!dateStr) return "-";

        const normalized = dateStr.includes("T")
            ? dateStr
            : dateStr.replace(" ", "T");

        const date = new Date(normalized);

        if (isNaN(date)) return "-";

        return date.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const getTimeElapsed = (allottedAt) => {
        if (!allottedAt) return "-";

        const start = new Date(allottedAt);
        const now = new Date();

        const diffMs = now - start;

        const hrs = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hrs}h ${mins}m`;
    };

    return (
        <>
            <div className="modal-backdrop fade show"></div>

            <div className="modal fade show d-block" id="covCheckoutModal" tabIndex="-1" aria-labelledby="covCheckoutModalLabel" aria-modal="true" role="dialog">
                <div className="modal-dialog modal-dialog-centered cov-modal-dialog">
                    <div className="modal-content cov-modal-content">


                        <div className="modal-header cov-modal-header bg-light">
                            <h5 className="modal-title cov-modal-title" id="covCheckoutModalLabel">Check Out Visitor</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setCheckoutShow(false)}></button>
                        </div>


                        <div className="modal-body cov-modal-body">
                            <p className="cov-subtitle text-start">Review the session details below before confirming checkout.</p>

                            <table className="cov-detail-table bg-light ">
                                <tbody>
                                    <tr >
                                        <td className="text-start">Vehicle Number</td>
                                        <td>{visitorData?.vehicle_number || "-"}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-start">Visitor Name</td>
                                        <td>{visitorData?.visitor_name || "-"}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-start">Entry Time</td>
                                        <td>{formatEntryTime(visitorData?.allotted_at)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-start">Duration</td>
                                       <td>{getTimeElapsed(visitorData?.allotted_at)}</td>
                                    </tr>
                                </tbody>
                            </table>


                            <div className="cov-payment-box">
                                <div className="cov-payment-icon-wrap">
                                    {/* <i className="bi bi-check-lg"></i> */}
                                    <BiCheck />
                                </div>
                                <div>
                                    <div className="cov-payment-title text-start">No Payment Due</div>
                                    <p className="cov-payment-sub text-start">Guest parking is free for up to 4 hours.</p>
                                </div>
                            </div>
                        </div>


                        <div className="modal-footer  cov-modal-footer bg-light">
                            <button type="button" className="btn btn-sm cov-btn-cancel" data-bs-dismiss="modal" onClick={() => setCheckoutShow(false)}>Cancel</button>
                            <button
                                type="button"
                                className="btn btn-sm cov-btn-checkout"
                                onClick={() => {
                                    onConfirm();
                                    setCheckoutShow(false);
                                }}
                            >
                                <FiLogOut /> Confirm Check Out
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckOutVisitorModal;
