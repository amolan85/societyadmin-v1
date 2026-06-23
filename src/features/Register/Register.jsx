import "../../styles/Register.css"
import { FiBox, FiHome, FiSmile,FiUsers  } from 'react-icons/fi'
import { FaCar } from 'react-icons/fa';
import {  BsPerson } from 'react-icons/bs';
import { BiDiamond } from 'react-icons/bi';

const Register = ({ setActive }) => {
  const regs = [
    { icon: <BsPerson color='blue' />, title: "Member Register", val: "1,245", sub: "Total active members", meta: "↑ 12 this week", mc: "tx-success", bg: "#dbeafe", tab: /* "registerHistory"  */ "addmember"},
    { icon: <FiHome color='purple' />, title: "Unit Register", val: "420", sub: "95% Occupancy", meta: "20 Vacant", mc: "", bg: "#cab8df", tab: "unitRegister", },
    { icon: <FaCar color='orange' />, title: "Parking Register", val: "512", sub: "Slots allocated", meta: "14 Guest slots open", mc: "", bg: "#ffedd5", tab: "parkingRegister", },
    { icon: <BiDiamond color='green' />, title: "Vendor Register", val: "28", sub: "Active service providers", meta: "3 Pending approval", mc: "", bg: "#dcfce7" },
    { icon: <FiBox color='blue' />, title: "Asset Register", val: "$1.2M", sub: "Total Asset Value", meta: "85 Items Tracked", mc: "", bg: "#c3cefe" },
    { icon: <FiSmile color='red' />, title: "Complaint Register", val: "12", sub: "Open issues", meta: "3 High Priority", mc: "tx-danger", bg: "#fee2e2" },
    { icon: <FiUsers   color='teal' />, title: "Visitor Register", val: "1,245", sub: "Total visitors", meta: "↑ 12 this week", mc: "tx-success", bg: "#dbeafe", tab: "visitorRegister" },
    {icon: <FaCar color="teal" />,title: "Vehicle Register",val: "856",sub: "Total vehicles",meta: "↑ 8 this week",  mc: "tx-success",bg: "#dbeafe",tab: "vehicleRegister"}
  ];
  return (

    <div className="pg rg-wrap">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="rg-title">Registers Overview</h4>
          <p className="rg-sub">
            Quick access to all management modules
          </p>
        </div>

        <button className="btn-ac" >+ New Entry</button>
      </div>

      {/* Cards */}
      <div className="row g-3">
        {regs.map((r, i) => (
          <div className="col-12 col-md-6 col-lg-4" key={i}>
            <div className="sv-card text-start">

              {/* Top */}
              <div className="d-flex justify-content-between align-items-start mb-3">

                <div className="rg-icon" style={{ background: r.bg }}>
                  {r.icon}
                </div>

                <span className="rg-menu">⋯</span>
              </div>

              {/* Content */}
              <div className="rg-card-title">{r.title}</div>
              <div className="rg-value">{r.val}</div>
              <div className="rg-desc">{r.sub}</div>

              <hr className="divider" />

              {/* Footer */}
              <div className="d-flex justify-content-between align-items-center">
                <span className={`rg-meta ${r.mc}`}>{r.meta}</span>

                <a href="#!" className="rg-link" onClick={() => setActive(r.tab)}>
                  View All →
                </a>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Register