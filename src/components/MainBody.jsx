import React, { useState, useEffect, useRef } from 'react'
import ChatUserRender from './ChatUserRender'
import ChatDMRender from './ChatDMRender'
import GroupUserRender from './GroupUserRender'
import ChatGroupRender from './ChatGroupRender'
import { Routes, Route } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
export default function MainBody() {
    const [messageState, setMessageState] = useState(true)
    const [allAccounts, setAllAccounts] = useState([])
    const [allGroups, setAllGroups] = useState([])
    const [allGroupAccounts, setAllGroupAccounts] = useState([])
    const joinGroupEmailInput = useRef()
    useEffect(() => {
        console.log("react effect has render")
        axios.post("https://sirikakire-chat.herokuapp.com/api/Account/getAllAccount",{
            _id:sessionStorage.getItem('AccountID')
        }).then(res => {
            setAllAccounts(res.data)
        })
        axios.post("https://sirikakire-chat.herokuapp.com/api/Group/getAllGroup",{
            from_id:sessionStorage.getItem('AccountID')
        }).then(res => {
            setAllGroups(res.data)
        })
    }, []);
    function MainRender(){
        return(
            <div className="col-12 row p-0 m-0 center h-100 text-light">
                <div className="text-center fs-4">
                    <FontAwesomeIcon style={{fontSize:'100px'}} icon="fa-solid fa-check" />
                    <br/>Xin hãy tạo một chat mới
                </div>
            </div>
        )
    }
    function DMRender(){
        return(
            <>
                {allAccounts.map(Account => <ChatUserRender key={Account._id} object={Account}/>)}
            </>
        )
    }
    function GroupRender(){
        return(
            <>
                {allGroups.map(Group => <GroupUserRender key={Group._id} object={Group}/>)}
            </>
        )
    }
    function CreateGroupRender(){
        return(
            <>
                <div className="col-6 row m-0 p-2" style={{height:'10%'}}>
                    <button className="col-12 btn btn-light fw-bold rounded dotText" data-bs-toggle="modal" data-bs-target="#joinGroupModal">
                        Join group
                    </button>
                </div>
                <div className="col-6 row m-0 p-2" style={{height:'10%'}}>
                    <button onClick={() => setAllGroupAccounts([])} className="col-12 btn btn-light fw-bold rounded dotText" data-bs-toggle="modal" data-bs-target="#creatingGroupModal">
                        Creating new group
                    </button>
                </div>
            </>
        )
    }
    function JoiningGroupAccount({account}){
        return(
            <span className="badge bg-secondary m-1" style={{fontSize:'17px'}}>{account}</span>
        )
    }
    function RecommendAccount({account}) {
        return(
            <option value={account.email}/>
        )
    }
    function checkEmailInSystem(email){
        for(var i = 0; i < allAccounts.length;i++){
            if(allAccounts[i].email === email) {
                return true
            }
           
        }
        return false
    }
    return (
        <div className="MainBody w-100 m-auto center" style={{height: '100vh'}}>
            <div className="MainApp w-100 h-100 row m-0 p-0">
                <div className="col-4 h-100 row m-0 p-0">
                    <div className="navigativeButton col-12 row m-0 p-0" style={{height:'15%'}}>
                        <button onClick={() => setMessageState(true)} className="col-6 m-0 center h-100 fs-6 text-light fw-bold text-center" style={{border:'none', background:'none'}}>DMS</button>
                        <button onClick={() => setMessageState(false)} className="col-6 m-0 center h-100 fs-6 text-light fw-bold text-center" style={{border:'none', background:'none'}}>Group</button>
                    </div>
                    <div className="col-12 m-0 p-0 text-light" style={{height:(messageState === true? '80%':'75%'), overflow:'auto'}}>
                        {messageState === true? <DMRender/>:<GroupRender/>}
                    </div>
                    {messageState === false? <CreateGroupRender/>:<></>}
                    <div className="modal fade" id="creatingGroupModal" tabIndex="-1" aria-labelledby="creatingGroupModal" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content text-dark">
                                <div className="modal-header">
                                    <h5><FontAwesomeIcon icon="fa-solid fa-user" />&nbsp;Create new group</h5>
                                </div>
                                <div className="m-0 p-2 row modal-body">
                                    <div className="col-12 mb-2">
                                        <input type="text" required placeholder="Insert group name" className="fw-bold text-dark form-control form-control-lg"/>
                                    </div>
                                    <div className="col-12 m-0 mb-2 input-group">
                                        <input ref={joinGroupEmailInput} type="email" required list="datalistOptions" placeholder="Invite your teamate" className="fw-bold text-dark form-control form-control-lg"/>
                                        <button className="btn btn-secondary rounded-end" onClick={() => {
                                            if(allGroupAccounts.includes(joinGroupEmailInput.current.value)){ return }
                                            if(joinGroupEmailInput.current.value === '') { return }
                                            if(checkEmailInSystem(joinGroupEmailInput.current.value) === false) { return }
                                            let newEmail = [...allGroupAccounts, joinGroupEmailInput.current.value]
                                            setAllGroupAccounts(newEmail)
                                            joinGroupEmailInput.current.value = ''
                                        }}>Add</button>
                                        <datalist id="datalistOptions">
                                            {allAccounts.map(account => <RecommendAccount key={account._id} account={account}/>)}
                                        </datalist>
                                    </div>
                                    <div className="col-12 mb-2">
                                        <div className="fw-bold text-dark form-control" style={{minHeight:'100px'}}>
                                            <span className="badge bg-secondary m-1" style={{fontSize:'17px'}}>@You</span>
                                            {allGroupAccounts.map(account => <JoiningGroupAccount key={account} account={account}/>)}
                                        </div>
                                    </div>
                                    <div className="col-12 mb-2">
                                        <button className="w-100 btn btn-primary">Create</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                </div>
                <div className="col-8 h-100 border-start row m-0 p-0">
                    <Routes>
                        <Route path="/" element={<MainRender/>}/>
                        <Route path="/message/dm/:id" element={<ChatDMRender Objects={allAccounts}/> }/>
                        <Route path="/message/g/:id" element={<ChatGroupRender Objects={allGroups}/>}/>
                    </Routes>
                </div>
            </div>
        </div>
    )
}
