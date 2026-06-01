// CheckOutVisitorModal.jsx
import { BiCheck } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import "../../styles/Parking.css";
const CheckOutVisitorModal = ({
    checkoutShow,
    setCheckoutShow,
    errors = {},
    errorText = "",
    handleSubmit = () => { },
    mode,
}) => {
    if (!checkoutShow) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>

            <div className="modal fade show d-block" id="covCheckoutModal" tabindex="-1" aria-labelledby="covCheckoutModalLabel" aria-modal="true" role="dialog">
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
                                        <td>KA-05-MH-2023</td>
                                    </tr>
                                    <tr>
                                        <td className="text-start">Visitor Name</td>
                                        <td>Rahul Kumar</td>
                                    </tr>
                                    <tr>
                                        <td className="text-start">Entry Time</td>
                                        <td>10:45 AM (Today)</td>
                                    </tr>
                                    <tr>
                                        <td className="text-start">Duration</td>
                                        <td>2h 45m</td>
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
                            <button type="button" className="btn btn-sm cov-btn-checkout">
                                {/* <i className="bi bi-box-arrow-right"></i>  */}
                                  <FiLogOut />Confirm Check Out
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckOutVisitorModal;
