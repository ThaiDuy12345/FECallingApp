import React, { useState, useEffect } from 'react'
import ChatUserRender from './ChatUserRender'
import ChatDMRender from './ChatDMRender'
import GroupUserRender from './GroupUserRender'
import ChatGroupRender from './ChatGroupRender'
import JoinGroupModal from './JoinGroupModal'
import CreateGroupModal from './CreateGroupModal'
import { Routes, Route } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import api from '../API/api'
import axios from 'axios'
export default function MainBody() {
    const [messageState, setMessageState] = useState(true)
    const [allAccounts, setAllAccounts] = useState([])
    const [allGroups, setAllGroups] = useState([])
    useEffect(() => {
        console.log("react effect has render")
        axios.post(api.getAllAccountsExceptId,{
            _id:sessionStorage.getItem('AccountID')
        }).then(res => {
            setAllAccounts(res.data)
        })
        axios.post(api.getAllGroupsRelatedToAccount,{
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
            <div className="w-100 row m-0 p-0" style={{height:'50px', position:'absolute', bottom:'0', left:'0', backgroundColor:'rgb(33, 33, 51)'}} >
                <div className="h-100 col-6 m-0 p-2">
                    <button className="w-100 h-100 p-0 btn btn-light fw-bold rounded dotText" data-bs-toggle="modal" data-bs-target="#joinGroupModal">
                        <FontAwesomeIcon icon="fa-solid fa-comment-medical" /> &nbsp;Join group
                    </button>
                </div>
                <div className="h-100 col-6 m-0 p-2">
                    <button className="w-100 h-100 p-0 btn btn-light fw-bold rounded dotText" data-bs-toggle="modal" data-bs-target="#creatingGroupModal">
                        <FontAwesomeIcon icon="fa-solid fa-users-line" /> &nbsp;Creating group
                    </button>
                </div>
            </div>
        )
    }
    
    
    return (
        <div className="MainBody w-100 m-auto center h-100">
            <div className="MainApp w-100 h-100 row m-0 p-0">
                <div className="col-4 h-100 m-0 p-0" style={{position: "relative"}}>
                    <div className="navigativeButton w-100 row m-0 p-0" style={{height:'15%', minHeight:'50px'}}>
                        <button onClick={() => {
                            sessionStorage.removeItem('AccountID')
                            window.location.reload()
                        }} className="logoutButton col-12 m-0 center h-25 fs-6 fw-bold text-center" style={{border:'none'}}><FontAwesomeIcon icon="fa-solid fa-right-from-bracket" /> &nbsp;Logout</button>
                        <button onClick={() => setMessageState(true)} className="col-6 m-0 p-0 center h-75 fs-6 text-light fw-bold text-center" style={{border:'none'}}>DMS</button>
                        <button onClick={() => setMessageState(false)} className="col-6 m-0 p-0 center h-75 fs-6 text-light fw-bold text-center" style={{border:'none'}}>Group</button>
                    </div>
                    <div className="w-100 m-0 pt-0 ps-0 pe-0 pb-5 text-light" style={{height:(messageState === true? '100%':'85%'), overflow: 'auto'}}>
                        {messageState === true? <DMRender/>:<GroupRender/>}
                    </div>
                    {messageState === false? <CreateGroupRender/>:<></>}
                    <CreateGroupModal allAccounts={allAccounts} allGroups={allGroups} setAllGroups={setAllGroups}/>
                    <JoinGroupModal allGroups={allGroups} setAllGroups={setAllGroups}/>
                </div>
                <div className="col-8 h-100 border-start row m-0 p-0">
                    <Routes>
                        <Route path="/" element={<MainRender/>}/>
                        <Route path="/message/dm/:id" element={<ChatDMRender Objects={allAccounts}/> }/>
                        <Route path="/message/g/:id" element={<ChatGroupRender Objects={allGroups} allGroups={allGroups} setAllGroups={setAllGroups}/>}/>
                    </Routes>
                </div>
            </div>
        </div>
    )
}
