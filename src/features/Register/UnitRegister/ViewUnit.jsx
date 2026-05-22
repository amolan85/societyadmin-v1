import { useState, useEffect } from 'react'
import { FaCar } from 'react-icons/fa';
import "../../../styles/Register.css";
import { getFlatByIdApi } from '../../../services/AddMemberApi';
import { GetSessionData } from '../../../utils/SessionManagement';
import { FiEdit, FiGrid, FiHome, FiMapPin, FiMessageSquare, FiTag } from 'react-icons/fi';
import { BiLocationPlus } from 'react-icons/bi';
import { TbRulerMeasure } from 'react-icons/tb';

const ViewUnit = ({ setActive, flatId }) => {
    const [societyId, setSocietyId] = useState(null);
    const [societyName, setSocietyName] = useState(null);
    const [areaSqft, setAreaSqft] = useState("");
    const [block, setBlock] = useState("");
    const [flatNumber, setFlatNumber] = useState("");
    const [floor, setFloor] = useState("");
    const [configuration, setConfiguration] = useState("");
    const [intercom, setIntercom] = useState("");
    const [unitType, setUnitType] = useState("");
    const [members, setMembers] = useState([]);
    const [currentStatus, setCurrentStatus] = useState("");

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
        if (flatId && societyId) {
            GetFlatDetailsById();
        }
    }, [flatId, societyId]);

    const GetFlatDetailsById = async () => {
        try {

            const data = await getFlatByIdApi(
                societyId,
                flatId
            );
            console.log(data, "Flat Details by ID");
            setBlock(data.block);
            setFlatNumber(data.flat_number);
            setFloor(data.floor);
            setAreaSqft(data.area_sqft);
            setConfiguration(data.unit_type);
            setIntercom(data.intercom);
            setUnitType(data.unit_type);
            setMembers(data.members);
            setCurrentStatus(data.current_status)

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
                            {/* <img
                                src="https://i.pravatar.cc/100"
                                className="rounded-circle border"
                                width="70"
                                height="70"
                                alt="profile"
                            /> */}
                            <div className="home-icon-box">
                                <FiHome size={70} className="text-secondary" />
                            </div>


                            <div>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <h5 className="mb-0 fw-bold">Unit {flatNumber}</h5>

                                    <span className="badge bg-primary-subtle text-primary">
                                        {currentStatus}
                                    </span>

                                    <span className="badge bg-secondary-subtle text-secondary">
                                        {
                                            members?.find(member => member.occupancy_type === "owner")?.occupancy_type
                                        }
                                    </span>
                                </div>

                                <div className="text-muted text-start small mt-2">
                                    {/* <div className="mb-1">
                                        <i className="bi bi-envelope me-1"></i>
                                        sarah@example.com
                                    </div> */}

                                    {/* <div>
                                       
                                        <BiLocationPlus className='me-1' />
                                        Block {block}, {floor} Floor
                                        <span className="mx-2">|</span>
                                        {areaSqft ? `${areaSqft} sq.ft` : ""}, {unitType}
                                    </div> */}
                                    <div className="d-flex gap-5 text-secondary">
                                        <div className="d-flex align-items-center gap-2">
                                            <FiMapPin />
                                            <span>Block {block},  {floor} Floor</span>
                                        </div>

                                        <div className="d-flex align-items-center gap-2">
                                            <TbRulerMeasure />
                                            <span>{areaSqft ? `${areaSqft} sq.ft` : ""}</span>
                                        </div>

                                        <div className="d-flex align-items-center gap-2">
                                            <FiGrid />
                                            <span>{unitType}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-3 mt-lg-0">
                            <button className="btn btn-outline-secondary btn-sm">
                                {/* <i className="bi bi-chat-left-text me-1"></i> */}
                                <FiMessageSquare className='me-1' />
                                Message
                            </button>

                            <button className="btn btn-primary btn-sm">
                                {/* <i className="bi bi-pencil-square me-1"></i> */}
                                <FiEdit className='me-1' />
                                Edit Unit
                            </button>
                            <button className="btn btn-primary btn-sm" onClick={() => setActive("unitRegister")}>Back</button>
                        </div>
                    </div>
                </div>

                <div className="row g-4 text-start">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white fw-semibold">
                                Unit Specifications
                            </div>

                            <div className="card-body">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">UNIT NUMBER</small>
                                        <div className="fw-semibold">{flatNumber}</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">BLOCK / TOWER</small>
                                        <div className="fw-semibold">Block {block}</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">FLOOR</small>
                                        <div className="fw-semibold">{floor} Floor</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">CONFIGURATION</small>
                                        <div className="fw-semibold">{configuration}</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">SUPER BUILT-UP AREA</small>
                                        <div className="fw-semibold">{areaSqft ? `${areaSqft} sq.ft` : ""} </div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">INTERCOM NUMBER</small>
                                        <div className="fw-semibold">{intercom}</div>
                                    </div>

                                </div>
                            </div>
                        </div>


                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <span className="fw-semibold">Primary Owner</span>

                                <button className="btn btn-outline-secondary btn-sm" onClick={() => setActive("memberDetails")}  >
                                    View Profile
                                </button>
                            </div>

                            <div className="card-body">

                                {members
                                    ?.filter((m) => m.occupancy_type === "owner")
                                    .map((m, index) => (
                                        <div
                                            key={index}
                                            className="d-flex justify-content-between align-items-center mb-3"
                                        >

                                            {/* Left Section */}
                                            <div className="d-flex align-items-center gap-3">

                                                <img
                                                    // src="https://i.pravatar.cc/60?img=12"
                                                    src={m.profile_url || "../src/assets/profile.png"}
                                                    alt="profile"
                                                    className="rounded-circle object-fit-cover"
                                                    width="55"
                                                    height="55"
                                                />

                                                <div>
                                                    <h6 className="text-start mb-1 fw-semibold">
                                                        {m.first_name} {m.last_name}
                                                    </h6>

                                                    <small className="text-start text-muted d-flex align-items-center gap-1">
                                                        <i className="bi bi-envelope"></i>
                                                        {m.occupancy_type}
                                                    </small>
                                                </div>
                                            </div>

                                            {/* Right Section */}
                                            <div className="text-end">
                                                <small className="text-muted d-block">
                                                    Moved In
                                                </small>

                                                <div className="fw-bold">
                                                    {m.start_date}
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>


                    <div className="col-lg-4">


                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white fw-semibold">
                                Registered Residents
                            </div>

                            <div className="list-group list-group-flush">
                                {members
                                    ?.filter((m) => m.occupancy_type !== "owner")
                                    .map((m, index) => (
                                        <div
                                            key={index}
                                            className="list-group-item d-flex align-items-center gap-3"
                                        >
                                            <img
                                                // src={`https://i.pravatar.cc/50?img=${index + 12}`}
                                                src={m.profile_url || "../src/assets/profile.png"}
                                                className="rounded-circle"
                                                width="45"
                                                height="45"
                                                alt=""
                                            />

                                            <div>
                                                <div className="fw-semibold">
                                                    {m.first_name} {m.last_name}
                                                </div>

                                                <small className="text-muted">
                                                    {m.occupancy_type === "tenant_relative"
                                                        ? "Tenant Family"
                                                        : m.occupancy_type === "owner_relative"
                                                            ? "Owner Family"
                                                            : m.occupancy_type
                                                                ?.replaceAll("_", " ")
                                                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                                                </small>
                                            </div>
                                        </div>
                                    ))}

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

export default ViewUnit