import React, { useState, useEffect } from 'react'
import ChatUserRender from './ChatUserRender'
import ChatDMRender from './ChatDMRender'
import GroupUserRender from './GroupUserRender'
import ChatGroupRender from './ChatGroupRender'
import { Routes, Route } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { io } from 'socket.io-client'
export default function MainBody() {
    const [messageState, setMessageState] = useState(true)
    const [allAccounts, setAllAccounts] = useState([])
    const [allGroups, setAllGroups] = useState([])
    useEffect(() => {
        console.log("react effect has render")
        axios.post("https://sirikakire-chat.herokuapp.com/api/Account/getAllAccount",{
            _id:localStorage.getItem('AccountID')
        }).then(res => {
            setAllAccounts(res.data)
        })
        axios.post("https://sirikakire-chat.herokuapp.com/api/Group/getAllGroup",{
            from_id:localStorage.getItem('AccountID')
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
    return (
        <div className="MainBody w-100 m-auto center" style={{height: '100vh'}}>
            <div className="MainApp w-100 h-100 row m-0 p-0">
                <div className="col-4 h-100 row m-0 p-0">
                    <div className="navigativeButton col-12 row m-0 p-0" style={{height:'15%'}}>
                        <button onClick={() => setMessageState(true)} className="col-6 m-0 center h-100 fs-6 text-light fw-bold text-center" style={{border:'none', background:'none'}}>DMS</button>
                        <button onClick={() => setMessageState(false)} className="col-6 m-0 center h-100 fs-6 text-light fw-bold text-center" style={{border:'none', background:'none'}}>Group</button>
                    </div>
                    <div className="col-12 m-0 p-0 text-light" style={{height:'80%', overflow:'auto'}}>
                        {messageState === true? <DMRender/>:<GroupRender/>}
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
