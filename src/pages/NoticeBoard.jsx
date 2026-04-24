import React from 'react'
import '../styles/NoticeBoard.css'

import { FiMapPin, FiEdit, FiLock, FiCommand, FiDelete } from "react-icons/fi";

const NoticeBoard = () => {


    return (
        <>
            <div className='container-fluid mb-4'>
                <div className="header mt-4">
                    <h5 className="text-start fw-bold d-flex align-items-center gap-2">
                        <FiEdit size={18} color='text-primary' />
                        Notice Details
                    </h5>
                </div>
                <div className='notice-details '>
                    <div className="row">
                        <div className="col-md-9">
                            <div className="card px-1 mt-3">
                                <div className="card-body text-start">
                                    <div className="d-flex align-items-start gap-2">
                                        <div className="icon-circle">
                                            <FiEdit size={14} className="text-primary" />
                                        </div>

                                        <div className="card-title fw-bold mx-2">
                                            <h6 className="d-flex align-items-center">

                                                {/* Left side */}
                                                <div className="d-flex align-items-center gap-2">
                                                    <FiMapPin size={16} className="text-primary" />
                                                    <span>AGM 2025 Date Rescheduled</span>
                                                    <span className="badge noticeBadge bg-primary ms-2">Official</span>
                                                </div>

                                                {/* Right side icons */}
                                                <div className="ms-auto d-flex align-items-center gap-2">
                                                    <FiMapPin size={16} className='ms-2' />
                                                    <FiEdit size={16} className='ms-2' />
                                                    <FiDelete size={16} className='ms-2' />
                                                </div>

                                            </h6>

                                            <p>
                                                Due to unforeseen circumstances, the Annual General Meeting (AGM) 2025 has been rescheduled.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card px-1 mt-3">
                                <div className="card-body text-start">
                                    <div className="d-flex align-items-start gap-2">

                                        {/* Left icon */}
                                        <div className="icon-circle mt-1">
                                            <FiCommand size={14} className="text-primary" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow-1 mb-3 mx-2">

                                            {/* Header row */}
                                            <div className="d-flex align-items-start">

                                                {/* Left content */}
                                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                                    <FiLock size={16} className="text-primary" />

                                                    <h6 className="mb-0">
                                                        Water Seepage in Block B Basement
                                                    </h6>

                                                    <span className="badge noticeBadge bg-warning ms-2">Discussion</span>
                                                </div>

                                                {/* Right icons */}
                                                <div className="ms-auto d-flex align-items-center gap-3">
                                                    <FiMapPin size={16} className="cursor-pointer" />
                                                    <FiEdit size={16} className="cursor-pointer text-primary" />
                                                    <FiDelete size={16} className="cursor-pointer text-danger" />
                                                </div>

                                            </div>

                                            {/* Description */}
                                            <p className="mb-0 mt-2 text-muted">
                                                There is a significant water seepage issue in the basement of Block B.
                                            </p>

                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="card px-2 mt-3">
                                <div className="card-body text-start">
                                    <div className="d-flex align-items-start gap-2">

                                        {/* Left icon */}
                                        <div className="icon-circle mt-1">
                                            <FiCommand size={14} className="text-primary" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow-1 mb-3 mx-2">
                                            {/* Header row */}
                                            <div className="d-flex align-items-start">

                                                {/* Left content */}
                                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                                    <FiLock size={16} className="text-primary" />

                                                    <h6 className="mb-0">
                                                        Diwali Decoration Volunteers Needed
                                                    </h6>

                                                    <span className="badge noticeBadge bg-warning ms-2">Discussion</span>
                                                </div>

                                                {/* Right icons */}
                                                <div className="ms-auto d-flex align-items-center gap-3">
                                                    <FiMapPin size={16} className="cursor-pointer" />
                                                    <FiEdit size={16} className="cursor-pointer text-primary" />
                                                    <FiDelete size={16} className="cursor-pointer text-danger" />
                                                </div>

                                            </div>

                                            {/* Description */}
                                            <p className="mb-0 mt-2 text-muted">
                                                Looking for enthusiastic volunteers to help with Diwali decoration arrangements.
                                            </p>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card px-2 mt-3">
                                <div className="card-body text-start">
                                    <div className="d-flex align-items-start gap-2">

                                        {/* Left icon */}
                                        <div className="icon-circle mt-1">
                                            <FiCommand size={14} className="text-primary" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow-1 mb-3 mx-2">
                                            {/* Header row */}
                                            <div className="d-flex align-items-start">

                                                {/* Left content */}
                                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                                    <FiLock size={16} className="text-primary" />

                                                    <h6 className="mb-0">
                                                        Found: Car Keys near Gate 2
                                                    </h6>

                                                    <span className="badge noticeBadge bg-warning ms-2">Discussion</span>
                                                </div>

                                                {/* Right icons */}
                                                <div className="ms-auto d-flex align-items-center gap-3">
                                                    <FiMapPin size={16} className="cursor-pointer" />
                                                    <FiEdit size={16} className="cursor-pointer text-primary" />
                                                    <FiDelete size={16} className="cursor-pointer text-danger" />
                                                </div>

                                            </div>

                                            {/* Description */}
                                            <p className="mb-0 mt-2 text-muted">
                                                A white sedan was found in the parking lot near Block A.
                                            </p>

                                        </div>
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

export default NoticeBoard