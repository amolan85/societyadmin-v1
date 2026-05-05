import React, { useState, useEffect } from 'react'
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import "../../styles/StaffAttendance.css"
import CreateBroadcast from './CreateBroadcast';
import { getBroadcastApi } from '../../services/BroadcastApi';
import { GetSessionData } from '../../utils/SessionManagement';


const Broadcast = ({ setActive }) => {
    const [page, setPage] = useState(1);
    const [allBroadcast, setAllBroadcast] = useState([])
    const [showCreate, setShowCreate] = useState(false);
    const [societyId, setSocietyId] = useState("")

    const all = [
        {
            subject: "Water Supply Maintenance",
            content: "Water supply will be unavailable from 10 AM to 2 PM due to maintenance work.",
            attachment: "Notice",
            type: "Important",
        },
        {
            subject: "Monthly Society Meeting",
            content: "All members are requested to attend the meeting on Sunday at 5 PM in the clubhouse.",
            attachment: "Event",
            type: "General",
        },
        {
            subject: "Parking Rules Update",
            content: "New parking guidelines have been implemented. Please check your allotted slots.",
            attachment: "Policy",
            type: "Important",
        },
        {
            subject: "Festival Celebration",
            content: "Join us for the upcoming festival celebration this Saturday evening.",
            attachment: "Invitation",
            type: "General",
        },
        {
            subject: "Lift Maintenance Notice",
            content: "Lift A will be under maintenance tomorrow from 9 AM to 1 PM.",
            attachment: "Notice",
            type: "Urgent",
        },
    ];


    useEffect(() => {
        SessionData()
    }, [])

    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)
        getBroadcast(flats.society_id)
    }

    //function for get broadcast
    const getBroadcast = async (societyId) => {
        const data = await getBroadcastApi(societyId)
        setAllBroadcast(data)
    }


    const per = 5, total = Math.ceil(allBroadcast.length / per);
    const rows = allBroadcast.slice((page - 1) * per, page * per);

    return (
        <>
            <div className="pg sa-wrap">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h4 className="sa-title">Broadcast</h4>
                    <div className="d-flex gap-2">
                        <button className='btn btn-sm btn-primary' onClick={() => setActive("createbroadcast")}>Create</button>

                        <button className="btn-ol">⬇ Export</button>
                    </div>
                </div>

                {/* Table */}
                <div className="sv-card p-0 overflow-hidden">
                    <div className="sa-table-wrap">
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    {["Subject", "Content", "Attachment", "Type", "Status"]
                                        .map(h => <th key={h}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((s, i) => (
                                    <tr className="text-start" key={s.broadcast_id}>

                                        <td className="sa-name">{s.title}</td>

                                        <td className="sa-muted">{s.message}</td>
                                        <td className="sa-muted"><img src={s.file_url} height={50}/></td>
                                        <td>
                                            <Badge label={s.type} c="gray" />
                                        </td>
<td className="sa-muted">{s.status}</td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        page={page}
                        total={total}
                        onChange={setPage}
                    />

                </div>
            </div>
        </>
    )
}

export default Broadcast