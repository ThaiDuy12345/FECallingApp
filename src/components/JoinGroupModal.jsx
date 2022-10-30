import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import api from '../API/api'
const JoinGroupModal = () => {
    const groupID = useRef();
    const joinGroupButton = useRef()
    const joinGroup = () => {
        joinGroupButton.current.disabled = true
        if(groupID.current.value === ''){
            alert("The group id cannot be empty")
            joinGroupButton.current.disabled = false
            return
        }
        if(groupID.current.value.length !== 24){
            alert("The group id is not available")
            joinGroupButton.current.disabled = false
            return
        }
        axios.put(api.joinGroup,{
            _id: sessionStorage.getItem("AccountID"),
            group_id: groupID.current.value 
        }).then(res => {
            if(res.data === null){
                alert("Failed to join, group you join may not exist, please try again")
                joinGroupButton.current.disabled = false
                return
            }
            window.location.href = `/message/g/${res.data._id}`
        })
    }
    return(
        <div className="modal fade" id="joinGroupModal" tabIndex="-1" aria-labelledby="joinGroupModal" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content text-dark">
                    <div className="modal-header">
                        <h5><FontAwesomeIcon icon="fa-solid fa-user" />&nbsp;Join group</h5>
                    </div>
                    <div className="m-0 p-2 row modal-body">
                        <div className="col-12 mb-2">
                            <input ref={groupID} type="text" required placeholder="Insert group id" minLength="24" maxLength="24" size="24" className="fw-bold text-dark form-control form-control-lg"/>
                        </div>
                        <div className="col-12 mb-2">
                            <button ref={joinGroupButton} onClick={joinGroup} className="w-100 btn btn-primary">Join</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 
export default JoinGroupModal 