import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const JoinGroupModal = () => {
    return(
        <div className="modal fade" id="joinGroupModal" tabIndex="-1" aria-labelledby="joinGroupModal" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content text-dark">
                    <div className="modal-header">
                        <h5><FontAwesomeIcon icon="fa-solid fa-user" />&nbsp;Join group</h5>
                    </div>
                    <div className="m-0 p-2 row modal-body">
                        <div className="col-12 mb-2">
                            <input type="text" required placeholder="Insert group id" minLength="24" maxLength="24" size="24" className="fw-bold text-dark form-control form-control-lg"/>
                        </div>
                        <div className="col-12 mb-2">
                            <button className="w-100 btn btn-primary">Join</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 
export default JoinGroupModal 