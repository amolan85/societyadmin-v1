import React, { useState, useEffect } from 'react'
import { Badge } from '../../components/Common/ReusableFunction'
import { FaCar } from 'react-icons/fa';
import viewUnit from './ViewUnit';
import { getMembersByIdApi } from '../../services/AddMemberApi';
import { GetSessionData } from '../../utils/SessionManagement';

const MemberDetails = ({ setActive, memberId, setFlatId }) => {
    const [societyId, setSocietyId] = useState("");
    const [societyName, setSocietyName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [block, setBlock] = useState("");
    const [flatNo, setFlatNo] = useState("");
    const [occupancyType, setOccupancyType] = useState("");
    const [status, setStatus] = useState("");
    const [area, setArea] = useState("");
    const [moveInDate, setMoveInDate] = useState("");
    const [flatIdNo, setFlatIdNo] = useState("");

    useEffect(() => {
        SessionData();
    }, []);

    const SessionData = async () => {
        try {
            const data = await GetSessionData();

            console.log(data.data);

            const flats = data.data.flats[0];

            setSocietyId(flats.society_id);
            setSocietyName(flats.society_name)

        } catch (error) {
            console.log(error);
        }
    };

    // Call API only when both values are available
    useEffect(() => {
        if (memberId && societyId) {
            GetMemberDetailsById();
        }
    }, [memberId, societyId]);

    const GetMemberDetailsById = async () => {
        try {

            const data = await getMembersByIdApi(
                societyId,
                memberId
            );

            setFirstName(data.first_name);
            setLastName(data.last_name);
            setEmail(data.email);
            setPhone(data.mobile);
            setBlock(data.block);
            setFlatNo(data.flat_number);
            setOccupancyType(data.occupancy_type);
            setStatus(data.status);
            setArea(data.area_sqft);
            setMoveInDate(data.start_date);
            setFlatIdNo(data.flat_id);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="container-fluid min-vh-100">

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">

                        <div className="d-flex align-items-center gap-3">
                            <img
                                src="https://i.pravatar.cc/100"
                                className="rounded-circle border"
                                width="70"
                                height="70"
                                alt="profile"
                            />

                            <div>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <h5 className="mb-0 fw-bold">{firstName} {lastName}</h5>

                                    <span className="badge bg-primary-subtle text-primary">
                                        {occupancyType}
                                    </span>

                                    <span className="badge bg-success-subtle text-success">
                                        {status}
                                    </span>
                                </div>

                                <div className="text-muted text-start small mt-2">
                                    <div className="mb-1">
                                        <i className="bi bi-envelope me-1"></i>
                                        {email}
                                    </div>

                                    <div>
                                        <i className="bi bi-telephone me-1"></i>
                                        {phone}
                                        <span className="mx-2">|</span>
                                        Unit {block}-{flatNo}, {societyName}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-3 mt-lg-0">
                            <button className="btn btn-outline-secondary btn-sm">
                                <i className="bi bi-clock-history me-1"></i>
                                History
                            </button>

                            <button className="btn btn-outline-secondary btn-sm">
                                <i className="bi bi-chat-left-text me-1"></i>
                                Message
                            </button>

                            <button className="btn btn-primary btn-sm">
                                <i className="bi bi-pencil-square me-1"></i>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row g-4 text-start">

                    <div className="col-lg-8">


                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white fw-semibold">
                                Personal Information
                            </div>

                            <div className="card-body">
                                <div className="row g-4">

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">FULL NAME</small>
                                        <div className="fw-semibold">{firstName} {lastName}</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">DATE OF BIRTH</small>
                                        <div className="fw-semibold">May 14, 1988</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">OCCUPATION</small>
                                        <div className="fw-semibold">Senior Architect</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">EMPLOYER</small>
                                        <div className="fw-semibold">Design Studio One</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">EMERGENCY CONTACT</small>
                                        <div className="fw-semibold">David Jenkins (Spouse)</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">EMERGENCY PHONE</small>
                                        <div className="fw-semibold">{phone}</div>
                                    </div>

                                </div>
                            </div>
                        </div>


                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <span className="fw-semibold">Unit Details ({block}-{flatNo})</span>

                                <button className="btn btn-outline-secondary btn-sm" onClick={() => { setFlatId(flatIdNo); setActive("viewUnit") }}  >
                                    View Unit
                                </button>
                            </div>

                            <div className="card-body">
                                <div className="row g-4">

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">UNIT TYPE</small>
                                        <div className="fw-semibold">3 BHK Premium</div>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">FLOOR AREA</small>
                                        <div className="fw-semibold">{area}</div>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">OWNERSHIP TYPE</small>
                                        <div className="fw-semibold">{occupancyType}</div>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">MOVE-IN DATE</small>
                                        <div className="fw-semibold">{moveInDate}</div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-lg-4">


                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white fw-semibold">
                                Family Members
                            </div>

                            <div className="list-group list-group-flush">

                                <div className="list-group-item d-flex align-items-center gap-3">
                                    <img
                                        src="https://i.pravatar.cc/50?img=12"
                                        className="rounded-circle"
                                        width="45"
                                        height="45"
                                        alt=""
                                    />

                                    <div>
                                        <div className="fw-semibold">David Jenkins</div>
                                        <small className="text-muted">Spouse</small>
                                    </div>
                                </div>

                                <div className="list-group-item d-flex align-items-center gap-3">
                                    <img
                                        src="https://i.pravatar.cc/50?img=18"
                                        className="rounded-circle"
                                        width="45"
                                        height="45"
                                        alt=""
                                    />

                                    <div>
                                        <div className="fw-semibold">Lily Jenkins</div>
                                        <small className="text-muted">Daughter</small>
                                    </div>
                                </div>

                            </div>
                        </div>


                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white fw-semibold">
                                Registered Vehicles
                            </div>

                            <div className="list-group list-group-flush ">

                                <div className="list-group-item">
                                    <div className="fw-semibold ">

                                        <FaCar color='blue' className='me-2' />
                                        Tesla Model Y
                                    </div>

                                    <small className="text-muted">
                                        ABC-1234 • Slot P-404
                                    </small>
                                </div>

                                <div className="list-group-item">
                                    <div className="fw-semibold">
                                        {/* <i className="bi bi-bicycle me-2"></i> */}
                                        <FaCar color='blue' className='me-2' />
                                        Trek Bicycle
                                    </div>

                                    <small className="text-muted">
                                        Unregistered • Bike Rack
                                    </small>
                                </div>

                            </div>
                        </div>


                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white fw-semibold">
                                Recent Activity
                            </div>

                            <div className="list-group list-group-flush">

                                <div className="list-group-item d-flex align-items-start gap-3">
                                    <div
                                        className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center"
                                        // style="width:40px;height:40px;"
                                        style={{ width: "40px", height: "40px" }}
                                    >
                                        <i className="bi bi-check-lg"></i>
                                    </div>

                                    <div>
                                        <div className="fw-semibold">
                                            Tesla Model Y Added
                                        </div>

                                        <small className="text-muted">
                                            2 hours ago
                                        </small>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default MemberDetails