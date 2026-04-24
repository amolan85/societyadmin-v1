import React from 'react'
import '../styles/polls.css'
import Select from 'react-select'
import { FiEdit } from "react-icons/fi";

const Polls = () => {
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]

    return (
        <>
            <div className='container-fluid'>
                <div className="header mt-4">
                    <h5 className="text-start fw-bold d-flex align-items-center gap-2">
                        <FiEdit size={18} color='text-primary'/>
                        Poll Details
                    </h5>
                </div>
                <div className='poll-details '>
                    <div className="row">
                        <div className="col-md-9">
                            <div className="card px-2">
                                <div className="card-body text-start">
                                    <div className='form-group'>
                                        <label htmlFor='pollTitle' className="form-label fw-bold">Poll Title</label>
                                        <input type="text" id="pollTitle" className="form-control" placeholder='Example: Schedule Maintenance of Lift B' />
                                    </div>
                                    <div className='form-group mt-3'>
                                        <label htmlFor='pollCategory' className="form-label fw-bold">Category</label>
                                        <Select options={options} placeholder="Select Category" />
                                    </div>
                                    <div className='form-group mt-3'>
                                        <label htmlFor='pollDescription' className="form-label fw-bold">Description</label>
                                        <textarea type="text" id="pollDescription" className="form-control" rows="4" placeholder='Provide details about members are voting for...' />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label className="form-label fw-bold">Attachment</label>

                                        <div className="upload-box">
                                            <input
                                                type="file"
                                                id="pollAttachment"
                                                className="file-input"
                                                onChange={(e) => console.log(e.target.files[0])}
                                            />

                                            <div className="upload-content">
                                                <div className="upload-icon">☁️</div>
                                                <p>Click to upload supporting documents (PDF, JPG)</p>
                                            </div>
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

export default Polls